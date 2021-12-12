import * as schema from "@colyseus/schema";
import {GC} from "../Constant.js";

export class Tank extends schema.Schema{
    constructor(){
        super();
        this.rotation = 0;
        this.dir = {x:0,y:0};
    }

    setPosition(pos){
        this.x = pos.x;
        this.y = pos.y;
    }

    setTankDir(pos){
        this.dir = pos;
    }

    update(){
        this.x += this.dir.x*GC.DT*GC.TANK_SPEED/1000;
        this.y += this.dir.y*GC.DT*GC.TANK_SPEED/1000;
    }
}

schema.defineTypes(Tank,{
    x: "float32",
    y: "float32",
    rotation: "float32"
})