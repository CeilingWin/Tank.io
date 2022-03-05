import * as schema from "@colyseus/schema";
import {GC} from "../Constant.js";
import {GameConfig} from "../config/GameConfig.js";
import {Vector} from "../utils/VectorUtils.js";

export class BoCircle extends schema.Schema {
    constructor(controller) {
        super();
        this.controller = controller;
        this.initAttributes();
        this.init();
    }

    init(){
        let mapWidth = this.controller.map.width;
        let mapHeight = this.controller.map.height;
        this.x = mapWidth/2;
        this.y = mapHeight/2;
        this.radius = Math.sqrt(mapWidth*mapWidth + mapHeight*mapHeight)/2;
        this.timeToContinueScale = this.breakTime;
        this.timeScaleRemain = 0;
    }

    initAttributes(){
        let config = GameConfig.getBoConfig();
        this.breakTime = config["breakTime"];
        this.scaleSpeed = config["scaleSpeed"];
        this.scaleTime = config["scaleTime"];
        this.damageIncreaseRate = config["damageIncreaseRate"];
        this.damage = config["damage"]/1000*GC.DT;
        this.radiusDecreasePerFrame = this.scaleSpeed/1000*GC.DT;
    }

    getPosition(){
        return new Vector(this.x,this.y);
    }

    update(){
        let boPosition = this.getPosition();
        this.controller.tanks.forEach(tank=>{
            if (Vector.distance(boPosition,tank.getPosition())>this.radius){
                tank.takeDamage(this.damage);
            }
        });

        if (this.radius <= 0) return;
        this.timeScaleRemain -= GC.DT;
        if (this.timeScaleRemain <= 0){
            this.timeToContinueScale -= GC.DT;
            if (this.timeToContinueScale <= 0){
                this.timeToContinueScale = this.breakTime;
                this.timeScaleRemain = this.scaleTime;
                this.damage *= this.damageIncreaseRate;
            }
        } else {
            this.radius -= this.radiusDecreasePerFrame;
            if (this.radius <= 0) {
                this.radius = 0;
            }
        }
    }
}

schema.defineTypes(BoCircle, {
    x: "float32",
    y: "float32",
    radius: "float32"
});