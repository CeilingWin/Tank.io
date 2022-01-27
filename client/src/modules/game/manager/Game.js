const TIME_TO_SEND_UPDATE_TANK = 1000/30;
var Game = cc.Class.extend({
    ctor: function(){
        this.tanks = new Map();
        this.bullets = [];
        this.network = gv.gameRoom.getNetwork();
    },

    init: function(mapId){
        this.mapId = mapId;
        this.mapLayer = gv.sceneMgr.addGui(new MapLayer(mapId));
        this.guiControl = gv.sceneMgr.addGui(new GuiGameControl());
        this.input = new Input();
    },

    destroyGuiGame: function(){
        this.mapLayer && this.mapLayer.destroy();
        this.guiControl && this.guiControl.destroy();
        this.mapLayer = null;
        this.guiControl = null;
    },

    addTank: function (playerData, tankData, isMe) {
        let playerId = playerData["id"];
        let tank = new Tank(playerData["tankType"], playerData["skin"]);
        tank.setPosition(tankData.x,tankData.y);
        this.mapLayer.addTankToMap(tank);
        this.tanks.set(playerId,tank);
        tank.setData(playerData["username"]);
        if (isMe) {
            this.me = tank;
            tank.isMe = true;
            this.mapLayer.follow(tank);
            this.followTank = tank;
        }
    },

    getFollowTank: function (){
        return this.followTank;
    },

    start: function(){
        cc.log("Start game");
        this.guiControl.start();
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
        if (!currentState) return;
        this.updateTank(currentState.tanks);
        this.updateBullets(currentState.bullets);
        this.guiControl.update();
    },

    updateTank: function (tanksData){
        if (!tanksData) return;
        this.tanks.forEach((tank,id)=>{
            let tankData = tanksData.get(id);
            if (!tankData.active) {
                tank.die();
                return;
            }
            tank.setPosition(tankData.x,tankData.y);
            tank.setDirection(tankData.direction);
            tank.setCannonDirection(tankData["cannonDirection"]);
            tank.setHp(tankData.hp);
            tank.kills = tankData.kills;
        });
    },

    updateBullets: function(bulletsData){
        let bullet;
        for (let i=this.bullets.length;i<bulletsData.length;i++){
            bullet = new Bullet();
            this.bullets.push(bullet);
            this.mapLayer.addBulletToMap(bullet);
        }
        for (let i= 0;i<this.bullets.length;i++){
            bullet = this.bullets[i];
            let bulletData = bulletsData[i];
            if (bulletData.active) {
                bullet.setPosition(bulletData.x,bulletData.y);
                bullet.setVisible(true);
            }
            else bullet.setVisible(false);
        }
    },

    updateInput: function(){
        if (!this.input.isRunning()) return;
        let currentTime = Date.now();
        if (currentTime - this.lastTimeSendInput >= TIME_TO_SEND_UPDATE_TANK){
            let tankDir = this.input.getDirection();
            let isClicked = this.input.isClicked();
            let mousePos = this.input.getMousePos();
            let tankPos = this.me.getWoldPos();
            let cannonDir = cc.pAngleSigned(cc.pSub(mousePos,tankPos),cc.p(1,0));
            this.network.send(TYPE_MESSAGE.UPDATE_TANK,[tankDir,cannonDir,isClicked]);
            this.lastTimeSendInput = currentTime;
        }
    },
})