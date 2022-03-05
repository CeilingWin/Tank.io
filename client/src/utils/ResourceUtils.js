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

    getEffect: function (type){
        return "res/items/eff_" + type + ".png";
    },

    getTile: function (name){
        let sprFrame = cc.spriteFrameCache.getSpriteFrame(name);
        if (!sprFrame){
            cc.spriteFrameCache.addSpriteFrames(res.MAP_PLIST_OBJECT_PLIST,res.MAP_PLIST_OBJECT_PNG);
            sprFrame = cc.spriteFrameCache.getSpriteFrame(name);
            if (!sprFrame) return null;
        }
        let tile = new cc.Sprite();
        tile.initWithSpriteFrame(sprFrame);
        return tile;
    }
}