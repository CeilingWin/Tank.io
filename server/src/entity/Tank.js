import * as schema from "@colyseus/schema";
import {GC} from "../Constant.js";

export class Tank extends schema.Schema{
    constructor(){
        super();
        this.rotation = 0;
    }

    setPosition(pos){
        this.x = pos.x;
        this.y = pos.y;
    }
}

schema.defineTypes(Tank,{
    x: "float32",
    y: "float32",
    rotation: "float32"
})