import {Effect} from "./Effect.js";

export class ShieldEffect extends Effect {
    constructor(tank) {
        super(1);
        this.tank = tank;
        this.isShield = true;
    }

    update(){
        super.update();
        if (!this.isActive()) {
            this.isShield = false;
        }
    }
}