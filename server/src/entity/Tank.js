import * as schema from "@colyseus/schema";
import { Box, Polygon } from "detect-collisions";
import { GC } from "../Constant.js";
import { Vector } from "../utils/VectorUtils.js";
import { GameConfig } from "../config/GameConfig.js";
const BASE_VECTOR = new Vector(1, 0);
export class Tank extends schema.Schema {
    constructor() {
        super();
        this.initAttributes();
        this.rotation = 0;
        this.movementVector = new Vector();
        this.direction = 0;
        this.cannonDirection = 0;
        this.speed = this.minSpeed;
        this.initBody();
    }

    initAttributes(){
        let config = GameConfig.getTankConfig("tank_0");
        this.width = config["width"];
        this.height = config["height"];
        this.minSpeed = config["min_speed"];
        this.maxSpeed = config["max_speed"];
    }

    initBody() {
        this.body = new Polygon(new Vector(0, 0), [
            { x: -this.width / 2, y: -this.height / 2 },
            { x: this.width / 2, y: -this.height / 2 },
            { x: this.width / 2, y: this.height / 2 },
            { x: -this.width / 2, y: this.height / 2 }
        ]);
    }

    setPosition(pos) {
        this.x = pos.x;
        this.y = pos.y;
    }

    getPosition() {
        return new Vector(this.x, this.y);
    }

    setMovementVector(vector) {
        this.movementVector.x = vector.x;
        this.movementVector.y = vector.y;
    }

    setCannonDirection(dir) {
        this.cannonDirection = dir;
    }

    update() {
        if (this.movementVector.len() < 0.1) {
            this.speed = this.minSpeed;
            return;
        }
        // update speed
        this.speed *= 1.1;
        if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
        // move
        this.x += this.movementVector.x * GC.DT * this.speed / 1000;
        this.y += this.movementVector.y * GC.DT * this.speed / 1000;
        this.direction = Vector.angleSigned(this.movementVector, BASE_VECTOR);
        this.updateBody();
    }

    updateBody(){
        this.body.pos.x = this.x;
        this.body.pos.y = this.y;
        this.body.setAngle(this.direction);
        this.body.updateAABB();
    }

    getBody() {
        return this.body;
    }
}

schema.defineTypes(Tank, {
    x: "float32",
    y: "float32",
    direction: "float32",
    rotation: "float32",
    cannonDirection: "float32"
})