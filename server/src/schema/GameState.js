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
        this.game = new Game();
        this.players = new MapSchema();
        this.resetState();
        this.initDefault();

        // sub message
        this.room.onMessage(TYPE_MESSAGE.UPDATE_TANK,this.onUpdateUserTank.bind(this));
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

    async addPlayer(id, username) {
        let player = new Player(id, username);
        this.players.set(id, player);
        if (this.state === GC.ROOM_STATE.LOBBY && this.players.size === this.maxPlayer) await this.startWaiting();
    }

    getNumPlayers() {
        return this.players.size;
    }

    update() {
        switch (this.state) {
            case GC.ROOM_STATE.LOBBY:
                this.handleLobby();
                break;
            case GC.ROOM_STATE.WAITING_TO_START:
                this.handleWaiting();
                break;
            case GC.ROOM_STATE.IN_GAME:
                this.handleGameUpdate();
                break;
        }
    }

    handleLobby() {}

    async startWaiting() {
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
    }

    onUpdateUserTank(client,message){
        if (this.state !== GC.ROOM_STATE.IN_GAME) return;
        let tankDir = message[0];
        let cannonDir = message[1];
        let isClicked = message[2];
        this.game.setMovementVector(client.sessionId,tankDir);
        this.game.setCannonDir(client.sessionId,cannonDir);

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
