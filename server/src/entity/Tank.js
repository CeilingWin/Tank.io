import * as schema from "@colyseus/schema";
import { Polygon } from "detect-collisions";
import { GC } from "../Constant.js";
import { Vector } from "../utils/VectorUtils.js";
import { GameConfig } from "../config/GameConfig.js";
import { Bullet } from "./Bullet.js";
import {Effect} from "./effect/Effect.js";
import {EffectFactory} from "./effect/EffectFactory.js";
const BASE_VECTOR = new Vector(1, 0);
export class Tank extends schema.Schema {
    constructor(gameController, type) {
        super();
        this.controller = gameController;
        this.initAttributes(type);
        this.movementVector = new Vector();
        this.direction = 0;
        this.cannonDirection = 0;
        this.speed = this.minSpeed;
        this.lastShootAt = 0;
        this.active = true;
        this.hp = this.maxHp;
        this.numBullet = this.maxBullets;
        this.timeToFullBullet = 0;
        this.timeRemainToFullBullet = 0;
        // kda
        this.kills = 0;
        this.totalDamage = 0;
        this.effects = new schema.ArraySchema();
        this.initBody();
    }

    initAttributes(type) {
        this.type = type;
        let config = GameConfig.getTankConfig(type);
        this.width = config["width"];
        this.height = config["height"];
        this.minSpeed = config["min_speed"];
        this.maxSpeed = config["max_speed"];
        this.bulletRate = config["bullet_rate"];
        this.maxHp = config["hp"];
        this.rotationSpeed = config["rotation_speed"];
        this.cannonLength = config["cannon_length"];
        this.maxBullets = config["max_bullets"];
        this.timeReloadBullet = config["time_reload_bullet"];
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

    isActive() {
        return this.active;
    }

    setMovementVector(vector) {
        this.movementVector.x = vector.x;
        this.movementVector.y = vector.y;
    }

    setCannonDirection(dir) {
        this.cannonDirection = dir;
    }

    getCannonDirection() {
        return this.cannonDirection;
    }

    isMoving() {
        return this.movementVector.len() > 0.1;
    }

    update() {
        this.updateBullet();
        if (!this.isActive()) return;
        this.updateEffect();
        this.updateMovement();
        if (!this.isMoving()) return;
        this.checkCollision();
    }

    checkCollision() {
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

    updateMovement() {
        if (!this.isMoving()) {
            this.speed = this.minSpeed;
            return;
        }
        // update speed
        this.speed *= 1.1;
        if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
        // cal direction
        this.updateDirection();
        // move
        this.x += Math.cos(-this.direction) * GC.DT * this.speed / 1000;
        this.y += Math.sin(-this.direction) * GC.DT * this.speed / 1000;
        this.updateBody();
    }

    updateDirection() {
        let direction = Vector.angleSigned(this.movementVector, BASE_VECTOR);
        let dr = Math.abs(direction - this.direction);
        let deltaR = this.rotationSpeed * GC.DT / 1000;
        if (dr <= deltaR) {
            this.direction = direction;
            return;
        };
        if (dr < deltaR) deltaR = dr;
        if (dr < Math.PI) {
            if (direction < this.direction) this.direction -= deltaR;
            else this.direction += deltaR;
        } else {
            if (direction < this.direction) this.direction += deltaR;
            else this.direction -= deltaR;
        }
        if (this.direction > Math.PI) this.direction = this.direction - 2 * Math.PI;
        else if (this.direction < - Math.PI) this.direction = 2 * Math.PI + this.direction;
    }

    updateBody() {
        this.body.pos.x = this.x;
        this.body.pos.y = this.y;
        this.body.setAngle(this.direction);
        this.body.updateAABB();
    }

    updateBullet(){
        if (this.numBullet > 0) return;
        if (this.numBullet === 0 && this.timeToFullBullet === 0){
            this.timeToFullBullet = Date.now() + this.timeReloadBullet;
            this.timeRemainToFullBullet = this.timeReloadBullet;
            return;
        }
        let currentTime = Date.now();
        if (currentTime >= this.timeToFullBullet){
            this.numBullet = this.maxBullets;
            this.timeToFullBullet = 0;
            this.timeRemainToFullBullet = 0;
        } else {
            this.timeRemainToFullBullet = this.timeToFullBullet - currentTime;
        }
    }

    updateEffect(){
        let numEffect = this.effects.length;
        let isHaveEffectOutOfDate = false;
        for (let i=0;i<numEffect;i++){
            let eff = this.effects[i];
            eff.update();
            if (!eff.isActive()) isHaveEffectOutOfDate = true;
        }
        if (isHaveEffectOutOfDate) this.effects = this.effects.filter(eff=>eff.isActive());
    }

    getBody() {
        return this.body;
    }

    canShoot() {
        return (this.numBullet > 0) && ((Date.now() - this.lastShootAt) >= this.bulletRate);
    }

    getStartingPositionOfBullet() {
        return {
            x: this.x + this.cannonLength * Math.cos(this.cannonDirection),
            y: this.y + this.cannonLength * Math.sin(-this.cannonDirection)
        }
    }

    takeDamage(damage) {
        if (this.effects.find(eff=>eff.isShield)) return 0;
        damage = Math.min(this.hp, damage);
        this.hp -= damage;
        if (this.hp <= 0) {
            this.hp = 0;
            this.active = false;
        }
        return damage;
    }

    heal(hp){
        let newHp = this.hp + hp;
        newHp = Math.min(newHp,this.maxHp);
        this.hp = newHp;
    }

    handleCollision() {
        const { overlapV } = this.controller.map.getCollisionResponse();
        this.x -= overlapV.x;
        this.y -= overlapV.y;
        this.updateBody();
    }

    shoot(){
        let bullet = this.controller.bullets.find(bullet => !bullet.isActive());
        if (!bullet) {
            bullet = new Bullet(this.controller);
            this.controller.bullets.push(bullet);
        }
        bullet.setData(this.getStartingPositionOfBullet(), this.getCannonDirection(), true, this.playerId);
        this.lastShootAt = Date.now();
        this.numBullet -= 1;
    }

    performEffect(effectType){
        let effect = EffectFactory.createEffect(effectType,this);
        this.effects = this.effects.filter(effect=>effect.type !== effectType);
        this.effects.push(effect);
    }
}

schema.defineTypes(Tank, {
    x: "float32",
    y: "float32",
    direction: "float32",
    cannonDirection: "float32",
    lastShootAt: "number",
    hp: "int32",
    active: "boolean",
    kills: "number",
    numBullet: "number",
    timeRemainToFullBullet: "number",
    effects: [Effect]
})