const TIME_TO_SEND_UPDATE_TANK = 1000/30;
var Game = cc.Class.extend({
    ctor: function(){
        this.tanks = new Map();
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
        this.mapLayer.addTankToMap(tank);
        this.tanks.set(playerId,tank);
        if (isMe) {
            this.me = tank;
            this.mapLayer.follow(tank);
        }
    },

    getTankById: function(playerId){
        return this.tanks.get(playerId);
    },

    start: function(){
        cc.log("start game");
        this.input.start();
        this.lastTimeSendInput = 0;
        // schedule update
        this.interval = setInterval(this.update.bind(this),1000/60);
    },

    stop: function (){
        this.interval && clearInterval(this.interval);
        this.interval = null;
    },

    update: function () {
        this.updateInput();
        let currentState = gv.gameRoom.getCurrentGameState();
        this.updateTank(currentState["tanks"]);
    },

    updateTank: function (tanksData){
        this.tanks.forEach((tank,id)=>{
            let tankData = tanksData.get(id);
            tank.setPosition(tankData.x,tankData.y);
            tank.setDirection(tankData.direction);
            tank.setCannonDirection(tankData["cannonDirection"]);
        });
    },

    updateBullets: function(bulletsData){

    },

    updateInput: function(){
        let currentTime = Date.now();
        if (currentTime - this.lastTimeSendInput >= TIME_TO_SEND_UPDATE_TANK){
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