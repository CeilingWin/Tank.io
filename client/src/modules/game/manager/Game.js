var Game = cc.Class.extend({
    ctor: function(mapId){
        cc.log("new game");
        this.tanks = [];
    },

    init: function(mapId){
        this.mapLayer = gv.sceneMgr.addGui(new MapLayer(mapId));
        this.guiControl = gv.sceneMgr.addGui(new GuiGameControl());
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
        this.input = new Input();
        this.input.start();
        // todo: start sample input
        // schedule update
        cc.director.getScheduler().schedule(this.update.bind(this),this.mapLayer,1/60,cc.REPEAT_FOREVER,0,false,"update_game");
    },

    update: function () {
    }
})