
import config from "config";
// config
const tankConfig = config.get("tanks");
const bulletConfig = config.get("bullets");

var GameConfig = {
    getTankConfig: function(typeTank){
        return tankConfig.find(tankCf => tankCf["type"] === typeTank);
    },

    getBulletConfig: function(typeBullet){
        return bulletConfig.find(bulletCf => bulletCf["type"] === typeBullet);
    }
}

export { GameConfig }