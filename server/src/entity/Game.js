import * as schema from "@colyseus/schema";
import {GC} from "../Constant.js";

export class Game extends schema.Schema{
    constructor(){
        super();
        this.tick = 0;
    }

    update(){
    }
}

schema.defineTypes(Game,{
    tick: "number"
})