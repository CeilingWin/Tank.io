import * as schema from "@colyseus/schema";
import {GC} from "../Constant.js";
export class Game extends schema.Schema{
    state;

    constructor(){
        super();
        this.state = GC.GAME_STATE.LOBBY;
    }

}