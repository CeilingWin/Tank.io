import * as schema from "@colyseus/schema";
import { Box, Polygon } from "detect-collisions";
import { GC } from "../Constant.js";
import { Vector } from "../utils/VectorUtils.js";
import { GameConfig } from "../config/GameConfig.js";
const BASE_VECTOR = new Vector(1, 0);
const CANNON_LENGTH = 60;
export class Tank extends schema.Schema {
    constructor(gameController) {
        super();
        this.controller = gameController;
        this.initAttributes();
        this.movementVector = new Vector();
        this.direction = 0;
        this.cannonDirection = 0;
        this.speed = this.minSpeed;
        this.lastShootAt = 0;
        this.active = true;
        this.initBody();
    }

    initAttributes(){
        let config = GameConfig.getTankConfig("tank_0");
        this.width = config["width"];
        this.height = config["height"];
        this.minSpeed = config["min_speed"];
        this.maxSpeed = config["max_speed"];
        this.bulletRate = config["bullet_rate"];
        this.hp = config["hp"];
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
        this.updateBody();
    }

    getPosition() {
        return new Vector(this.x, this.y);
    }

    isActive(){
        return this.active;
    }

    setMovementVector(vector) {
        this.movementVector.x = vector.x;
        this.movementVector.y = vector.y;
    }

    setCannonDirection(dir) {
        this.cannonDirection = dir;
    }

    getCannonDirection(){
        return this.cannonDirection;
    }

    isMoving(){
        return this.movementVector.len() > 0.1;
    }

    update() {
        if(!this.isActive()) return;
        this.updateMovement();
        if (!this.isMoving()) return;
        let tankBody = this.getBody();
        let potentials = this.controller.map.getPotentialObstacle(tankBody);
        potentials.forEach((collider) => {
            if (this.controller.map.checkCollision(tankBody, collider)) {
                this.handleCollision();
            }
        });
        this.controller.tanks.forEach((opponentTank, opponentId) => {
            if (opponentId === this.playerId || !opponentTank.isActive()) return;
            if (this.controller.map.checkCollision(tankBody, opponentTank.getBody())) {
                this.handleCollision();
            }
        });
    }

    updateMovement(){
        if (!this.isMoving()) {
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

    canShoot(){
        return (Date.now() - this.lastShootAt) >= this.bulletRate;
    }

    getStartingPositionOfBullet(){
        return {
            x: this.x + CANNON_LENGTH * Math.cos(this.cannonDirection),
            y: this.y + CANNON_LENGTH * Math.sin(-this.cannonDirection)
        }
    }

    takeDamage(damage){
        this.hp -= damage;
        if (this.hp <= 0) {
            this.hp = 0;
            this.active = false;
        }
    }

    handleCollision() {
        const { overlapV } = this.controller.map.getCollisionResponse();
        this.x -= overlapV.x;
        this.y -= overlapV.y;
        this.updateBody();
    }
}

schema.defineTypes(Tank, {
    x: "float32",
    y: "float32",
    direction: "float32",
    cannonDirection: "float32",
    lastShootAt: "number",
    hp: "number",
    active: "boolean"
})