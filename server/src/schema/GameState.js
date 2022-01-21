import * as schema from "@colyseus/schema";
import { Game } from "../entity/Game.js";
import { Player } from "../entity/Player.js";
import { GC, TYPE_MESSAGE } from "../Constant.js";
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

    init(maxPlayer, mapId) {
        this.resetState();
        this.maxPlayer = maxPlayer;
        this.mapId = mapId;
    }

    initDefault() {
        this.maxPlayer = 2;
        this.mapId = 0;
    }

    addPlayer(id, username) {
        let player = new Player(id, username);
        this.players.set(id, player);
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
        if (this.players.size === this.maxPlayer) await this.startWaiting();
    }

    async startWaiting() {
        this.room.lock();
        this.gameStartAt = Date.now() + GC.TIME_TO_READY;
        this.state = GC.ROOM_STATE.WAITING_TO_START;
        await this.initGame();
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

    showLeaderBoard(){
        console.log("Show leaderboard");
        this.timeFinishShowLeaderBoard = Date.now() + GC.TIME_SHOW_LEADER_BOARD;
        let leaderBoard = this.game.getLeaderBoard();
        this.room.broadcast(TYPE_MESSAGE.SHOW_LEADER_BOARD,leaderBoard);
        this.state = GC.ROOM_STATE.SHOW_LEADER_BOARD;
    }

    handleEndGame() {
        if (Date.now() >= this.timeFinishShowLeaderBoard) {
            this.state = GC.ROOM_STATE.LOBBY;
            console.log("Show lobby");
        }
    }

    onUpdateUserTank(client, message) {
        if (this.state !== GC.ROOM_STATE.IN_GAME) return;
        this.game.handleMessageUpdateTank(client.sessionId, message);
    }
}

schema.defineTypes(GameState, {
    players: { map: Player },
    game: Game,
    state: "number",
    maxPlayer: "number",
    mapId: "number",
    gameStartAt: "number"
});
