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
        this.ts = Date.now();
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
        this.ts = Date.now();
        this.updateTank();
    }

    updateTank(){
        this.tanks.forEach(tank=>tank.update());
    }

    setTankDir(playerId,dir){
        let tank = this.tanks.get(playerId);
        if (tank) tank.setTankDir(dir);
    }
}

schema.defineTypes(Game,{
    ts: "number",
    tanks: {map:Tank}
})