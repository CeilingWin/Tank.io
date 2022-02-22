
import config from "config";
// config
const tankConfig = config.get("tanks");
const bulletConfig = config.get("bullets");
const roomConfig = config.get("room_config");
const jetPlaneConfig = config.get("jet_plane");

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
    }
}

export { GameConfig }