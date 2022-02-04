import * as schema from "@colyseus/schema";
import { Game } from "../entity/Game.js";
import { Player } from "../entity/Player.js";
import { GC, TYPE_MESSAGE } from "../Constant.js";
import { GameConfig } from "../config/GameConfig.js";
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;


export class GameState extends Schema {
    constructor(room) {
        super();
        this.room = room;
        // attr
        this.game = new Game(this.room);
        this.players = new MapSchema();
        this.resetState();
        this.initDefault();

        // sub message
        this.room.onMessage(TYPE_MESSAGE.UPDATE_TANK, this.onUpdateUserTank.bind(this));
    }

    resetState() {
        this.state = GC.ROOM_STATE.LOBBY;
    }

    init(roomName, maxPlayer, mapId) {
        this.resetState();
        this.maxPlayer = maxPlayer;
        this.mapId = mapId;
        this.roomName = roomName;
    }

    initDefault() {
        this.maxPlayer = 2;
        this.mapId = 0;
    }

    addPlayer(id, options) {
        if (!options.tankType) options.tankType = GameConfig.getRoomConfig()["default_tank"];
        if (!options.skin) options.skin = 0;
        let player = new Player(id, options.username, options.tankType, options.skin);
        this.players.set(id, player);
    }

    removePlayer(id) {
        this.log("Player", id, "left");
        if (this.state === GC.ROOM_STATE.LOBBY || this.state === GC.ROOM_STATE.SHOW_LEADER_BOARD) {
            this.players.delete(id);
        } else {
            let player = this.players.get(id);
            player.setAfk(true);
        }
    }

    getNumPlayers() {
        return this.players.size;
    }

    async update() {
        switch (this.state) {
            case GC.ROOM_STATE.LOBBY:
                await this.handleLobby();
                break;
            case GC.ROOM_STATE.WAITING_TO_START:
                this.handleWaiting();
                break;
            case GC.ROOM_STATE.IN_GAME:
                this.handleGameUpdate();
                break;
            case GC.ROOM_STATE.SHOW_LEADER_BOARD:
                this.handleEndGame();
                break;
        }
    }

    async handleLobby() {
        if (this.players.size === this.maxPlayer) {
            this.room.lock();
            await this.startWaiting();
        }
        else if (this.room.locked) {
            this.room.unlock();
        }
    }

    async startWaiting() {
        this.gameStartAt = Date.now() + GC.TIME_TO_READY;
        await this.initGame();
        this.state = GC.ROOM_STATE.WAITING_TO_START;
    }

    async initGame() {
        await this.game.init(this.mapId, this.players);
    }

    handleWaiting() {
        let currentTime = Date.now();
        if (currentTime >= this.gameStartAt) this.startGame();
    }

    startGame() {
        this.state = GC.ROOM_STATE.IN_GAME;
    }

    handleGameUpdate() {
        this.game.update();
        if (this.game.isEndGame()) {
            this.showLeaderBoard();
        }
    }

    showLeaderBoard() {
        console.log("Show leaderboard");
        const TIME_DELAY = 2000;
        this.timeFinishShowLeaderBoard = Date.now() + GC.TIME_SHOW_LEADER_BOAR + TIME_DELAY;
        let leaderBoard = this.game.getLeaderBoard();
        leaderBoard = leaderBoard.map(player => {
            player.username = this.players.get(player.playerId).username;
            return player;
        })
        setTimeout(()=>this.room.broadcast(TYPE_MESSAGE.SHOW_LEADER_BOARD, leaderBoard),TIME_DELAY);
        this.state = GC.ROOM_STATE.SHOW_LEADER_BOARD;
        // delete all afk player
        for (let playerId of this.players.keys()) {
            let player = this.players.get(playerId);
            if (player.isAfk()) this.players.delete(playerId);
        }
    }

    handleEndGame() {
        if (Date.now() >= this.timeFinishShowLeaderBoard) {
            this.state = GC.ROOM_STATE.LOBBY;
        }
    }

    onUpdateUserTank(client, message) {
        if (this.state !== GC.ROOM_STATE.IN_GAME) return;
        this.game.handleMessageUpdateTank(client.sessionId, message);
    }

    log(...args) {
        console.log("<Room ", this.roomName + "> ---->", args.join(" "));
    }
}

schema.defineTypes(GameState, {
    players: { map: Player },
    game: Game,
    state: "number",
    maxPlayer: "number",
    mapId: "number",
    roomName: "string",
    gameStartAt: "number"
});
