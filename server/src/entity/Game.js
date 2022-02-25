import * as schema from "@colyseus/schema";
import { GC, TYPE_MESSAGE } from "../Constant.js";
import { Vector } from "../utils/VectorUtils.js";
import { MapGame } from "./Map.js";
import { Tank } from "./Tank.js";
import { Bullet } from "./Bullet.js";
import { JetPlane } from "./JetPlane.js";
import { GameConfig } from "../config/GameConfig.js";
import { Item } from "./Item.js";

export class Game extends schema.Schema {
    constructor(room) {
        super();
        this.room = room;
        this.tanks = new schema.MapSchema();
        this.bullets = new schema.ArraySchema();
        this.jetPlanes = new schema.ArraySchema();
        this.items = new schema.ArraySchema();
        this.listDeathPlayers = new schema.ArraySchema();
    }

    async init(mapId, players) {
        this.reset();
        await this.initMap(mapId);
        this.initTankForAllPlayers(players);
        this.initJetPlanes();
        this.ts = Date.now();
    }

    reset() {
        this.tanks.clear();
        this.bullets.clear();
        this.jetPlanes.clear();
        this.items.clear();
        this.listDeathPlayers.clear();
        this.numAlivePlayer = 0;
    }

    async initMap(mapId) {
        this.map = new MapGame();
        await this.map.initMap(mapId);
    }

    initTankForAllPlayers(players) {
        players.forEach(player => {
            let pos = this.getRandomSpawnPosition();
            let tank = new Tank(this, player.tankType);
            tank.setPosition(pos);
            tank.playerId = player.id;
            this.tanks.set(player.id, tank);
            tank.checkCollision();
        });
    }

    initJetPlanes(){
        const MAX_JET_PLANE = GameConfig.getRoomConfig()["max_jet_plane_on_map"];
        for (let i=0;i<MAX_JET_PLANE;i++){
            let jetPlane = new JetPlane(this);
            this.jetPlanes.push(jetPlane);
        }
    }

    initItems(){
        const MAX_ITEMS = GameConfig.getRoomConfig()["max_item_on_map"];
        for (let i=0;i<MAX_ITEMS;i++){
            let item = new Item(this);
            this.items.push(item);
        }
    }

    getRandomSpawnPosition() {
        return new Vector(Math.random() * this.map.width, Math.random() * this.map.height);
    }

    update() {
        this.ts = Date.now();
        this.updateTank();
        this.updateBullets();
        this.updateJetPlane();
        this.initItems();
        this.numAlivePlayer = this.tanks.size - this.listDeathPlayers.length;
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

    updateJetPlane(){
        this.jetPlanes.forEach(jetPlane => {
            jetPlane.update();
        })
    }

    isEndGame() {
        return this.numAlivePlayer <= 0;
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
            tank.shoot();
        }
    }

    playerWasKilled(playerId, killerId) {
        console.log(playerId, "was killed by", killerId);
        this.listDeathPlayers.unshift({
            playerId: playerId,
            timeDie: this.ts
        });
        this.room.broadcast(TYPE_MESSAGE.PLAYER_WAS_KILLED, {
            playerId: playerId,
            killerId: killerId
        });
    }

    getLeaderBoard() {
        this.tanks.forEach((tank, playerId) => {
            if (tank.isActive()) this.listDeathPlayers.unshift({
                playerId: playerId,
                timeDie: this.ts
            })
        });
        return this.listDeathPlayers.map(player => {
            let tank = this.tanks.get(player.playerId);
            player.kills = tank.kills;
            player.totalDamage = tank.totalDamage;
            return player;
        });
    }

    canPutObjectOnMap(object){
        let body = object.getBody();
        let potentials = this.map.getPotentialObstacle(body);
        potentials.forEach((collider) => {
            if (this.map.checkCollision(body, collider)) {
                return false;
            }
        });
        return true;
    }
}

schema.defineTypes(Game, {
    ts: "number",
    tanks: { map: Tank },
    bullets: [Bullet],
    jetPlanes: [JetPlane],
    numAlivePlayer: "number"
})