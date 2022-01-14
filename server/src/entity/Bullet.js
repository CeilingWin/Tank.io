import * as schema from "@colyseus/schema";
import { Box, Circle, Polygon } from "detect-collisions";
import { GC } from "../Constant.js";
import { Vector } from "../utils/VectorUtils.js";
import { GameConfig } from "../config/GameConfig.js";
const BASE_VECTOR = new Vector(1, 0);
export class Bullet extends schema.Schema {
    constructor() {
        super();
        this.initAttributes();
        this.initBody();
    }

    setData(position, direction, active, playerId) {
        this.x = position.x;
        this.y = position.y;
        this.direction = direction;
        this.active = active;
        this.playerId = playerId;
    }

    initAttributes() {
        let config = GameConfig.getBulletConfig("normal");
        this.speed = config["speed"];
        this.damage = config["damage"];
        this.geometry = config["geometry"];
        this.radius = config["radius"];
    }

    initBody() {
        // todo: init body base on geometry
        this.body = new Circle(new Vector(0, 0), this.radius);
    }

    setPosition(pos) {
        this.x = pos.x;
        this.y = pos.y;
    }

    getPosition() {
        return new Vector(this.x, this.y);
    }

    setActive(bool) {
        this.active = bool;
    }

    isActive() {
        return this.active;
    }

    update() {
        this.x += this.speed * GC.DT * Math.cos(this.direction) / 1000;
        this.y += this.speed * GC.DT * Math.sin(-this.direction) / 1000;
        this.updateBody();
    }

    updateBody() {
        this.body.pos.x = this.x;
        this.body.pos.y = this.y;
        this.body.updateAABB();
    }

    getBody() {
        return this.body;
    }

}

schema.defineTypes(Bullet, {
    x: "float32",
    y: "float32",
    direction: "float32",
    active: "boolean"
})