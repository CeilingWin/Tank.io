import * as schema from "@colyseus/schema";
import { Game } from "../entity/Game.js";
import {Player} from "./Player.js";
import {GC,TYPE_MESSAGE} from "../Constant.js";
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;


export class GameState extends Schema {
    constructor(room) {
        super();
        this.room = room;
        // attr
        this.players = new MapSchema();
        this.resetState();
        this.initDefault();
    }

    resetState(){
        this.state = GC.ROOM_STATE.LOBBY;
    }

    init(maxPlayer, mapId){
        this.resetState();
        this.maxPlayer = maxPlayer;
        this.mapId = mapId;
    }

    initDefault(){
        this.maxPlayer = 2;
        this.mapId = 0;
    }

    addPlayer(id,username){
        let player = new Player(id,username);
        this.players.set(id,player);
        if (this.players.size === this.maxPlayer) this.startWaiting();
        this.room.broadcastPatch();
    }

    getNumPlayers(){
        return this.players.size;
    }

    update(){
        switch(this.state){
            case GC.ROOM_STATE.LOBBY:
                this.handleLobby();
                break;
            case GC.ROOM_STATE.WAITING:
                this.handleWaiting();
                break;
            case GC.ROOM_STATE.IN_GAME:
                this.handleGameUpdate();
                break;
        }
    }

    handleLobby(){
    }

    startWaiting(){
        this.timeCountDown = GC.TIME_TO_READY;
        this.gameStartAt = Date.now() + this.timeCountDown;
        this.state = GC.ROOM_STATE.WAITING;
        this.room.broadcastPatch();
    }

    handleWaiting(){
        this.timeCountDown -= GC.DELTA_T;
        if (this.timeCountDown <= 0) this.startGame();
    }

    startGame(){
        this.state = GC.ROOM_STATE.IN_GAME;
        this.game = new Game();
        this.room.broadcastPatch();
    }

    handleGameUpdate(){
        console.log("game update");
        this.game.update();
        this.room.broadcastPatch();
    }
}

schema.defineTypes(GameState, {
    players: {map:Player},
    game: Game,
    state: "number",
    maxPlayer: "number",
    mapId: "number",
    gameStartAt: "number",
});
