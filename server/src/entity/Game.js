import * as schema from "@colyseus/schema";
import { GC } from "../Constant.js";
import { Vector } from "../utils/VectorUtils.js";
import { MapGame } from "./Map.js";
import { Player } from "./Player.js";
import { Tank } from "./Tank.js";
import { Bullet } from "./Bullet.js";

export class Game extends schema.Schema {
    constructor(mapId, players) {
        super();
        this.tanks = new schema.MapSchema();
        this.bullets = new schema.ArraySchema();
    }

    async init(mapId, players) {
        await this.initMap(mapId);
        this.initTankForAllPlayers(players);
        this.ts = Date.now();
    }

    async initMap(mapId) {
        this.map = new MapGame();
        await this.map.initMap(mapId);
    }

    initTankForAllPlayers(players) {
        players.forEach(player => {
            let pos = this.getRandomSpawnPosition();
            let tank = new Tank();
            tank.setPosition(pos);
            this.tanks.set(player.id, tank);
        });
    }

    getRandomSpawnPosition() {
        return new Vector(Math.random() * 700, Math.random() * 700);
    }

    update() {
        this.ts = Date.now();
        this.updateTank();
        this.updateBullets();
    }

    updateTank() {
        // check movement
        this.tanks.forEach((tank, playerId) => {
            if (!tank.isActive()) return;
            tank.update();
            if (!tank.isMoving()) return;
            let tankBody = tank.getBody();
            let potentials = this.map.getPotentialObstacle(tankBody);
            potentials.forEach((collider) => {
                if (this.map.checkCollision(tankBody, collider)) {
                    this.handleTankCollision(tank);
                }
            });
            this.tanks.forEach((opponentTank, opponentId) => {
                if (opponentId === playerId || !opponentTank.isActive()) return;
                if (this.map.checkCollision(tankBody, opponentTank.getBody())) {
                    this.handleTankCollision(tank);
                }
            });
        });
    }

    updateBullets() {
        this.bullets.forEach(bullet => {
            if (!bullet.isActive()) return;
            bullet.update();
            let bulletBody = bullet.getBody();
            // check collision with tank
            this.tanks.forEach((tank, id) => {
                if (!tank.isActive() || bullet.playerId === id) return;
                if (this.map.checkCollision(bulletBody, tank.getBody())){
                    tank.takeDamage(bullet.damage);
                    bullet.setActive(false);
                }
            });
            // check collision with obstacle
            let potentials = this.map.getPotentialObstacle(bulletBody);
            potentials.forEach((collider) => {
                if (this.map.checkCollision(bulletBody, collider)) {
                    bullet.setActive(false);
                }
            });
        });
    }

    handleMessageUpdateTank(playerId, message) {
        let movementDir = message[0];
        let cannonDir = message[1];
        let isClicked = message[2];
        let tank = this.tanks.get(playerId);
        if (!tank || !tank.isActive()) return;
        tank.setMovementVector(movementDir);
        tank.setCannonDirection(cannonDir);
        if (isClicked && tank.canShoot()) {
            this.playerShoot(playerId, tank);
        }
    }

    playerShoot(playerId, tank) {
        let bullet = this.bullets.find(bullet => !bullet.isActive());
        if (!bullet) {
            bullet = new Bullet();
            this.bullets.push(bullet);
        }
        bullet.setData(tank.getStartingPositionOfBullet(), tank.getCannonDirection(), true, playerId);
        tank.lastShootAt = Date.now();
    }

    handleTankCollision(tank) {
        const { overlapV } = this.map.getCollisionResponse();
        tank.x -= overlapV.x;
        tank.y -= overlapV.y;
        tank.updateBody();
    }
}

schema.defineTypes(Game, {
    ts: "number",
    tanks: { map: Tank },
    bullets: [Bullet]
})