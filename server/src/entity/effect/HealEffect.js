import {Effect} from "./Effect.js";
import {GC} from "../../Constant.js";

export class HealEffect extends Effect{
    constructor(tank) {
        super(0);
        this.tank = tank;
        this.healPerFrame = this["healRate"]/1000*GC.DT;
    }

    update(){
        super.update();
        if (!this.isActive()) return;
        this.tank.heal(this.healPerFrame);
    }
}