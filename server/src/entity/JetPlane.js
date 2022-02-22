import * as schema from "@colyseus/schema";
import { MathUtils } from "../utils/MathUtils.js";
import { GC } from "../Constant.js";
import { Vector } from "../utils/VectorUtils.js";
import { GameConfig } from "../config/GameConfig.js";
const BASE_VECTOR = new Vector(1, 0);
export class JetPlane extends schema.Schema {
    constructor(gameController) {
        super();
        this.controller = gameController;
        this.initAttributes();
        this.setActive(false);
        this.direction = 0;
    }

    initAttributes() {
        let config = GameConfig.getJetPlaneConfig();
        this.speed = config["speed"];
    }

    reset(){
        let mapWidth = this.controller.map.width;
        let mapHeight = this.controller.map.height;
        this.direction = MathUtils.randomBetween(-Math.PI, Math.PI);
        let centerPos = new Vector();
        let delta = 0;
        centerPos.x = MathUtils.randomBetween(mapWidth-delta,mapWidth+delta);
        centerPos.y = MathUtils.randomBetween(mapHeight-delta,mapHeight+delta);
        let startPos = new Vector(Math.cos(this.direction),Math.sin(this.direction));
        startPos = Vector.multi(startPos,-Math.sqrt(mapWidth*mapWidth + mapHeight*mapHeight));
        this.x = startPos.x;
        this.y = startPos.y;
        this.setActive(true);
    }

    setActive(bool) {
        this.active = bool;
    }

    isActive() {
        return this.active;
    }

    update() {
        if (!this.isActive()) return;
        this.x += this.speed * GC.DT * Math.cos(this.direction) / 1000;
        this.y += this.speed * GC.DT * Math.sin(-this.direction) / 1000;
    }
}

schema.defineTypes(JetPlane, {
    x: "float32",
    y: "float32",
    direction: "float32",
    active: "boolean"
})