import * as schema from "@colyseus/schema";
import {GC} from "../Constant.js";
import { MapGame } from "./Map.js";

export class Game extends schema.Schema{
    constructor(mapId,players){
        super();
    }

    async init(mapId,players){
        this.tick = 0;
        await this.initMap(mapId);
        this.initTankForAllPlayers(players);
    }

    async initMap(mapId){
        this.map = new MapGame();
        await this.map.initMap(mapId);
    }

    initTankForAllPlayers(players){

    }

    update(){
    }
}

schema.defineTypes(Game,{
    tick: "number"
})