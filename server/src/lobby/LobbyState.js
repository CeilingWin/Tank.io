import * as schema from "@colyseus/schema";
import {Player} from "./Player.js";
export class LobbyState extends schema.Schema {
    constructor(){
        super();
        this.players = new schema.ArraySchema();
        this.roomName = "abjjdods";
    }

    addPlayer(id,name){
        this.players.push(new Player(name,id));
    }
}

schema.defineTypes(LobbyState,{
    players: [Player],
    roomName: "string"
});