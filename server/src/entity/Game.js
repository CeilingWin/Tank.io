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
        this.tanks.forEach(tank=>{
            tank.update();
            // check collision
            let tankBody = tank.getBody();
            let potentials = this.map.getPotentialObstacle(tankBody);
            potentials.forEach((collider) => {
                if (this.map.checkCollision(tankBody, collider)) {
                  this.handleCollisionsTankWithObstacle(tank,this.map.getCollisionResponse());
                }
              });
        });
    }

    handleCollisionsTankWithObstacle(tank,collisionResponse){
        const { overlapV } = collisionResponse;
        tank.x -= overlapV.x;
        tank.y -= overlapV.y;
    }

    setMovementVector(playerId,dir){
        let tank = this.tanks.get(playerId);
        if (tank) tank.setMovementVector(dir);
    }

    setCannonDir(playerId,dir){
        let tank = this.tanks.get(playerId);
        if (tank) tank.setCannonDirection(dir);
    }
}

schema.defineTypes(Game,{
    ts: "number",
    tanks: {map:Tank}
})