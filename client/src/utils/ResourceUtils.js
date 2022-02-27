var ResourceUtils = {
    getTankBody: function(tankType, skin){
        return "res/tank/"+tankType+"/body"+skin+".png";
    },

    getCannon: function (tankType, skin){
        return "res/tank/"+tankType+"/cannon" + skin+".png";
    },

    getMiniMap: function (mapId){
        return "res/map/minimap/map" + mapId + ".png";
    },

    getItem: function (type){
        return "res/items/item_" + type + ".png";
    }
}