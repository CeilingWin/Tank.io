const UPDATE_INTERVAL_KEY = "update_game";
const TIME_TO_SEND_UPDATE_TANK = 1000/30;
var Game = cc.Class.extend({
    ctor: function(){
        this.tanks = [];
        this.sendToServer = GameRoom.getIns().sendToServer.bind(GameRoom.getIns());
    },

    init: function(mapId){
        this.mapLayer = gv.sceneMgr.addGui(new MapLayer(mapId));
        this.guiControl = gv.sceneMgr.addGui(new GuiGameControl());
        this.input = new Input();
    },

    addTank: function (playerId, tankData, isMe) {
        let tank = new Tank();
        tank.setPosition(tankData.x,tankData.y);
        tank.playerId = playerId;
        this.mapLayer.addTankToMap(tank);
        this.tanks.push(tank);
        if (isMe) {
            this.me = tank;
            this.mapLayer.follow(tank);
        }
    },

    getTankById: function(playerId){
        return this.tanks.find(tank=>tank.playerId === playerId);
    },

    start: function(){
        cc.log("start game");
        // todo: start sample input
        this.input.start();
        this.lastTimeSendInput = 0;
        // schedule update
        cc.director.getScheduler().schedule(this.update.bind(this),this.mapLayer,1/60,cc.REPEAT_FOREVER,0,false,UPDATE_INTERVAL_KEY);
    },

    update: function () {
        this.updateInput();
    },

    updateInput: function(){
        let currentTime = Date.now();
        if (currentTime - this.lastTimeSendInput >= TIME_TO_SEND_UPDATE_TANK){
            // todo: send input
            let tankDir = this.input.getDirection();
            let isClicked = this.input.isClicked();
            let mousePos = this.input.getMousePos();
            let tankPos = this.me.getWoldPos();
            let cannonDir = cc.pAngleSigned(cc.pSub(mousePos,tankPos),cc.p(1,0));
            this.sendToServer(TYPE_MESSAGE.UPDATE_TANK,[tankDir,cannonDir,isClicked]);
            this.lastTimeSendInput = currentTime;
        }
    }
})