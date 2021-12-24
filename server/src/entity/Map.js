import * as schema from "@colyseus/schema";
import { TMParser } from "../lib/TMParser.js";
import { GC } from "../Constant.js";
import { Box, Circle, System, Polygon} from "detect-collisions";
import { Vector } from "../utils/VectorUtils.js";

export class MapGame extends schema.Schema {
    constructor() {
        super();
    }

    async initMap(mapId) {
        // todo: load map base on map id
        let promiseLoadMap = new Promise((resolve, reject) => {
            TMParser.parseFile("res/map/map_0.tmx", null, (err, map) => {
                if (err) reject(err);
                else resolve(map);
            });
        });
        try {
            let map = await promiseLoadMap;
            this.loadObstacle(map);
            console.log("Load map success!");
        } catch (err) {
            console.error("Load map failed!", err);
        }
    }

    loadObstacle(tileMap) {
        this.system = new System();
        let tileSize = {
            width: tileMap.tileWidth,
            height: tileMap.tileHeight
        };
        let mapSize = {
            width: tileMap.width,
            height: tileMap.height
        };
        let objectLayer = tileMap.layers.find(layer => layer.name === "object");
        for (let xIndex = 0; xIndex < mapSize.width; xIndex++) {
            for (let yIndex = 0; yIndex < mapSize.height; yIndex++) {
                let tile = objectLayer.tileAt(xIndex, yIndex);
                if (!tile) continue;
                let pos = tileMap.convertTilePosToXYPos(xIndex, yIndex);
                let bodys = tile.bodys;
                bodys.forEach(body => {
                    this.addObstacle(pos, body);
                });
            }
        }
    }

    addObstacle(pos, body) {
        let geometry,p;
        let relativePos = new Vector(body.x,body.y);
        switch (body.type) {
            case "rectangle":
                geometry = new Box(relativePos.add(pos),body.width,body.height);
                break;
            case "circle":
                geometry = new Circle(relativePos.add(pos),body.radius);
                break;
            case "polygon":
                console.log("before",body.points);
                body.points.forEach(point=>{
                    point.y = -point.y;
                });
                console.log("after",body.points.reverse());
                geometry = new Polygon(relativePos.add(pos),body.points.reverse());
                break;
        }
        this.system.insert(geometry);
        this.system.update();
    }

    getPotentialObstacle(body){
        return this.system.getPotentials(body);
    }

    checkCollision(body, collider){
        return this.system.checkCollision(body,collider);
    }

    getCollisionResponse(){
        return this.system.response;
    }
}

schema.defineTypes(MapGame, {})