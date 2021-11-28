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
        this.game = new Game();
        this.resetState();
        this.initDefault();
    }

    resetState(){
        this.tick = 0;
        this.state = GC.GAME_STATE.LOBBY;
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
    }

    getNumPlayers(){
        return this.players.size;
    }

    update(){
        switch(this.state){
            case GC.GAME_STATE.LOBBY:
                this.handleLobby();
                break;
            case GC.GAME_STATE.WAITING:
                this.handleWaiting();
                break;
            case GC.GAME_STATE.IN_GAME:
                this.handleGameUpdate();
                break;
        }
        this.tick += 1;
    }

    handleLobby(){
    }

    startWaiting(){
        this.timeCountDown = GC.TIME_TO_READY;
        this.state = GC.GAME_STATE.WAITING;
        this.room.broadcast(TYPE_MESSAGE.START_WAITING,{
            timeWaiting: this.timeCountDown
        });
    }

    handleWaiting(){
        this.timeCountDown -= GC.DELTA_T;
        if (this.timeCountDown <= 0) this.startGame();
    }

    startGame(){
        this.state = GC.GAME_STATE.IN_GAME;
        this.room.broadcast(TYPE_MESSAGE.START_GAME);
    }

    handleGameUpdate(){
        console.log("game update");
        this.game.update();
    }
}

schema.defineTypes(GameState, {
    players: {map:Player},
    game: Game,
    state: "number",
    maxPlayer: "number",
    mapId: "number",
    tick: "number"
});
