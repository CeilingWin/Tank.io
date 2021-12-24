import * as schema from "@colyseus/schema";
import { Box } from "detect-collisions";
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

    update(){
        if (this.movementVector.len() === 0) return;
        // move
        this.x += this.movementVector.x*GC.DT*GC.TANK_SPEED/1000;
        this.y += this.movementVector.y*GC.DT*GC.TANK_SPEED/1000;
        this.direction = Vector.angleSigned(this.movementVector,BASE_VECTOR);
    }

    getBody(){
        let body = new Box(this.getPosition(),this.width,this.height);
        body.setOffset({x:-this.width/2,y:-this.height/2});
        body.setAngle(this.direction);
        return body;
    }
}

schema.defineTypes(Tank,{
    x: "float32",
    y: "float32",
    direction: "float32",
    rotation: "float32"
})