import * as schema from "@colyseus/schema";
import {GameConfig} from "../../config/GameConfig.js";
import {GC} from "../../Constant.js";

export class Effect extends schema.Schema {
    constructor(type) {
        super();
        this.type = type;
        this.initAttributes();
        this.timeRemain = this.duration;
    }

    initAttributes(){
        let config = GameConfig.getEffectConfig().find(cf=>cf.type === this.type);
        for (let key in config){
            this[key] = config[key];
        }
    }

    isActive() {
        return this.timeRemain > 0;
    }

    update(){
        this.timeRemain -= GC.DT;
    }
}

schema.defineTypes(Effect, {
    type: "number",
    timeRemain: "number"
});