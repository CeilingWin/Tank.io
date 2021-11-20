import * as schema from "@colyseus/schema";
import { Game } from "../entity/Game.js";
import {Player} from "./Player.js";
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;


export class GameState extends Schema {
    constructor() {
        super();
        this.players = new MapSchema();
        this.game = new Game();
    }

    addPlayer(id,username){
        let player = new Player(id,username);
        this.players.set(id,player);
    }

    getNumPlayers(){
        return this.players.size;
    }

    update(){
    }
}

schema.defineTypes(GameState, {
    players: {map:Player}
});
