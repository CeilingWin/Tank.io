
import config from "config";
// config
const tankConfig = config.get("tanks");
const bulletConfig = config.get("bullets");
const roomConfig = config.get("room_config");
const jetPlaneConfig = config.get("jet_plane");
const itemsConfig = config.get("items");
const effectsConfig = config.get("effects");
const boConfig = config.get("bo");

var GameConfig = {
    getTankConfig: function(typeTank){
        return tankConfig.find(tankCf => tankCf["type"] === typeTank);
    },

    getBulletConfig: function(typeBullet){
        return bulletConfig.find(bulletCf => bulletCf["type"] === typeBullet);
    },

    getJetPlaneConfig: function(){
        return jetPlaneConfig;
    },

    getRoomConfig: function(){
        return roomConfig;
    },

    getItemsConfig: function(){
        return itemsConfig;
    },

    getEffectConfig: function (){
        return effectsConfig;
    },

    getBoConfig: function (){
        return boConfig;
    }
}

export { GameConfig }