import * as schema from "@colyseus/schema";
import {GC} from "../Constant.js";
import { Vector } from "../utils/VectorUtils.js";
import { MapGame } from "./Map.js";
import { Player } from "./Player.js";
import { Tank } from "./Tank.js";

export class Game extends schema.Schema{
    constructor(mapId,players){
        super();
        this.tanks = new schema.MapSchema();
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
        players.forEach(player=>{
            let pos = this.getRandomSpawnPosition();
            let tank = new Tank();
            tank.setPosition(pos);
            this.tanks.set(player.id,tank);
        });
    }

    getRandomSpawnPosition(){
        return new Vector(Math.random()*700,Math.random()*700);
    }

    update(){
    }
}

schema.defineTypes(Game,{
    tick: "number",
    tanks: {map:Tank}
})