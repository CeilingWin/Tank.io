import * as schema from "@colyseus/schema";
import { Box, Polygon } from "detect-collisions";
import {GC} from "../Constant.js";
import { Vector } from "../utils/VectorUtils.js";
import config from "config";
// config
const tankConfig = config.get("tank_config");
const BASE_VECTOR = new Vector(1,0);
export class Tank extends schema.Schema{
    constructor(){
        super();
        this.rotation = 0;
        this.movementVector = new Vector();
        this.width = tankConfig.width;
        this.height = tankConfig.height;
        this.direction = 0;
        this.cannonDirection = 0;
        this.initBody();
    }

    initBody(){
        this.body = new Polygon(new Vector(0,0),[
            { x: -this.width / 2, y: -this.height / 2 },
            { x: this.width / 2, y: -this.height / 2 },
            { x: this.width / 2, y: this.height / 2 },
            { x: -this.width / 2, y: this.height / 2 }
        ]);
    }

    setPosition(pos){
        this.x = pos.x;
        this.y = pos.y;
    }

    getPosition(){
        return new Vector(this.x,this.y);
    }

    setMovementVector(vector){
        this.movementVector.x = vector.x;
        this.movementVector.y = vector.y;
    }

    setCannonDirection(dir){
        this.cannonDirection = dir;
    }

    update(){
        if (this.movementVector.len() === 0) return;
        // move
        this.x += this.movementVector.x*GC.DT*GC.TANK_SPEED/1000;
        this.y += this.movementVector.y*GC.DT*GC.TANK_SPEED/1000;
        this.direction = Vector.angleSigned(this.movementVector,BASE_VECTOR);
        // update body
        this.body.pos.x = this.x;
        this.body.pos.y = this.y;
        this.body.setAngle(this.direction);
        this.body.updateAABB();
    }

    getBody(){
        return this.body;
    }
}

schema.defineTypes(Tank,{
    x: "float32",
    y: "float32",
    direction: "float32",
    rotation: "float32",
    cannonDirection: "float32"
})