import * as schema from "@colyseus/schema";
import { Box, Circle, Polygon } from "detect-collisions";
import { GameConfig } from "../config/GameConfig.js";
import { GC } from "../Constant.js";
import { Vector } from "../utils/VectorUtils.js";

export class Item extends schema.Schema{
    constructor(gameController) {
        super();
        this.controller = gameController;
        this.initAttributes();
        this.setActive(false);
        this.timeRemainToAppear = 0;
        this.effectType = 0;
    }

    initAttributes() {
        let config = GameConfig.getItemsConfig();
        this.radius = config["radius"];
        this.timeAlive = config["time_alive"];
        this.timeToAppear = Number(config["time_to_appear"]);
    }

    initWithEffect(effectType){
        this.effectType = effectType;
        this.timeRemainToAppear = this.timeToAppear;
        this.timeAliveRemain = this.timeAlive;
        this.setActive(true);
    }

    initBody() {
        this.body = new Circle(new Vector(this.x, this.y), this.radius);
    }

    getBody() {
        return this.body;
    }

    setPosition(pos) {
        this.x = pos.x;
        this.y = pos.y;
        this.initBody();
        this.body.updateAABB();
    }

    setActive(bool) {
        this.active = bool;
    }

    isActive() {
        return this.active;
    }

    update(){
        if (!this.isActive()) return;
        if (this.timeRemainToAppear > 0) {
            this.timeRemainToAppear -= GC.DT;
        } else {
            this.timeAliveRemain -= GC.DT;
            if (this.timeAliveRemain <= 0) this.setActive(false);
            else {
                this.checkCollisionWithTanks();
            }
        }
    }

    checkCollisionWithTanks(){
        let iterator = this.controller.tanks.values();
        let tank = iterator.next().value;
        while (tank){
            if (!tank.isActive()) {
                tank = iterator.next().value;
                continue;
            }
            if (this.controller.map.checkCollision(tank.getBody(),this.getBody())){
                tank.performEffect(this.effectType);
                this.setActive(false);
                break;
            }
            tank = iterator.next().value;
        }
    }
}

schema.defineTypes(Item, {
    x: "float32",
    y: "float32",
    effectType: "number",
    active: "boolean",
    timeRemainToAppear: "int16"
})