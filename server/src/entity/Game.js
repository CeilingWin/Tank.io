import * as schema from "@colyseus/schema";
import {GC} from "../Constant.js";

export class Game extends schema.Schema{
    constructor(){
        super();
    }
}

schema.defineTypes(Game,{
    mode: "int8"
})