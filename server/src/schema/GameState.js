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
        this.room.broadcastPatch();
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
        this.room.broadcastPatch();
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
        this.room.broadcastPatch();
    }

    handleGameUpdate() {
        this.game.update();
        this.room.broadcastPatch();
    }
}

schema.defineTypes(GameState, {
    players: { map: Player },
    game: Game,
    state: "number",
    maxPlayer: "number",
    mapId: "number",
    gameStartAt: "number",
});
