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
            this.system = new System();
            let map = await promiseLoadMap;
            this.width = map.width*map.tileWidth;
            this.height = map.height*map.tileHeight;
            this.initBorder();
            this.loadObstacle(map, "object");
            this.loadObstacle(map, "trees");
            console.log("Load map success!");
        } catch (err) {
            console.error("Load map failed!", err);
        }
    }

    loadObstacle(tileMap, layerName) {
        let tileSize = {
            width: tileMap.tileWidth,
            height: tileMap.tileHeight
        };
        let mapSize = {
            width: tileMap.width,
            height: tileMap.height
        };
        let objectLayer = tileMap.layers.find(layer => layer.name === layerName);
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

    initBorder(){
        let borderWidth = 200;
        let borderLeft = new Polygon({x:0,y:0},[
            {x:0,y:0},
            {x:0,y:this.height},
            {x:-borderWidth,y:this.height},
            {x:-borderWidth,y:0},
        ]);
        let borderRight = new Polygon({x:this.width,y:0},[
            {x:0,y:0},
            {x:borderWidth,y:0},
            {x:borderWidth,y:this.height},
            {x:0,y:this.height}
        ]);
        let borderBottom = new Polygon({x:0,y:0},[
            {x:0,y:0},
            {x:this.width,y:0},
            {x:this.width,y:-borderWidth},
            {x:0,y:-borderWidth}
        ]);
        let borderTop = new Polygon({x:0,y:this.height},[
            {x:0,y:0},
            {x:this.width,y:0},
            {x:this.width,y:borderWidth},
            {x:0,y:borderWidth}
        ]);
        this.system.insert(borderLeft);
        this.system.insert(borderRight);
        this.system.insert(borderBottom);
        this.system.insert(borderTop);
        this.system.update();
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