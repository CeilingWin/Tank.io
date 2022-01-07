
import config from "config";
// config
const tankConfig = config.get("tank_config");

var GameConfig = {
    getTankConfig: function(typeTank){
        return tankConfig.find(tankCf => tankCf["type"] === typeTank);
    }
}

export { GameConfig }