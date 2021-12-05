var Game = cc.Class.extend({
    ctor: function(mapId){
        cc.log("new game");
        this.tanks = [];
    },

    initMap: function(mapId){
        this.mapLayer = gv.sceneMgr.addGui(new MapLayer(mapId));
    },

    addTank: function (playerId, tankData, isMe) {
        let tank = new Tank();
        tank.setPosition(tankData.x,tankData.y);
        tank.playerId = playerId;
        this.mapLayer.addTankToMap(tank);
        this.tanks.push(tank);
        if (isMe) this.mapLayer.follow(tank);
    },

    start: function(){
        cc.log("start game");
        // todo: ...
    }
})