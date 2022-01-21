import * as schema from "@colyseus/schema";
import { GC } from "../Constant.js";
import { Vector } from "../utils/VectorUtils.js";
import { MapGame } from "./Map.js";
import { Player } from "./Player.js";
import { Tank } from "./Tank.js";
import { Bullet } from "./Bullet.js";

export class Game extends schema.Schema {
    constructor() {
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
            let tank = new Tank(this);
            tank.setPosition(pos);
            tank.playerId = player.id;
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
        this.tanks.forEach((tank) => {
            tank.update();
        });
    }

    updateBullets() {
        this.bullets.forEach(bullet => {
            bullet.update();
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
            bullet = new Bullet(this);
            this.bullets.push(bullet);
        }
        bullet.setData(tank.getStartingPositionOfBullet(), tank.getCannonDirection(), true, playerId);
        tank.lastShootAt = Date.now();
    }
}

schema.defineTypes(Game, {
    ts: "number",
    tanks: { map: Tank },
    bullets: [Bullet]
})