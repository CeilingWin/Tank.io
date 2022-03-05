const TIME_TO_SEND_UPDATE_TANK = 1000/30;
var Game = cc.Class.extend({
    ctor: function(){
        this.tanks = new Map();
        this.bullets = [];
        this.jetPlanes = [];
        this.items = [];
        this.network = gv.gameRoom.getNetwork();
        gv.gameRoom.getNetwork().onMessage(TYPE_MESSAGE.PLAYER_WAS_KILLED,this.onPlayerWasKilled.bind(this));
    },

    init: function(mapId,callback){
        this.mapId = mapId;
        this.mapLayer = gv.sceneMgr.addGui(new MapLayer(mapId));
        this.guiControl = gv.sceneMgr.addGui(new GuiGameControl());
        this.input = new Input();
        this.callback = callback;
    },

    loadMapDone: function(){
        this.callback && this.callback();
        this.callback = null;
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
        tank.playerId = playerId;
        this.mapLayer.addTankToMap(tank);
        this.tanks.set(playerId,tank);
        tank.setData(playerData["username"]);
        if (isMe) {
            this.me = tank;
            tank.isMe = true;
            this.follow(tank);
        }
    },

    follow: function (tank){
        this.mapLayer.follow(tank);
        this.followTank = tank;
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
        this.updateJetPlanes(currentState.jetPlanes);
        this.updateItems(currentState.items);
        this.mapLayer.update();
        this.mapLayer.updateBo(currentState.boCircle);
        this.guiControl.update();
    },

    updateTank: function (tanksData){
        if (!tanksData) return;
        this.tanks.forEach((tank,id)=>{
            let tankData = tanksData.get(id);
            tank.updateData(tankData);
            // if (tank.playerId === this.getFollowTank().playerId &&)
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
            bullet.updateData(bulletData);
        }
    },

    updateJetPlanes: function(jetPlanesData){
        let jetPlane;
        for (let i=this.jetPlanes.length;i<jetPlanesData.length;i++){
            jetPlane = new JetPlane();
            this.jetPlanes.push(jetPlane);
            this.mapLayer.addJetPlaneToMap(jetPlane);
        }
        for (let i= 0;i<this.jetPlanes.length;i++){
            jetPlane = this.jetPlanes[i];
            let jetPlaneData = jetPlanesData[i];
            jetPlane.updateData(jetPlaneData);
        }
    },

    updateItems: function(itemsData){
        let item;
        for (let i=this.items.length;i<itemsData.length;i++){
            item = new Item();
            this.items.push(item);
            this.mapLayer.addItemToMap(item);
        }
        for (let i= 0;i<this.items.length;i++){
            item = this.items[i];
            let itemData = itemsData[i];
            item.updateData(itemData);
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

    endGame: function (){
        this.input.stop();
        this.guiControl.runAction(cc.fadeOut(1.5));
    },

    onPlayerWasKilled(message){
        let deathPlayerId = message["playerId"];
        let killerId = message["killerId"];
        let currentFollowTank = this.getFollowTank();
        if (deathPlayerId === currentFollowTank.playerId){
            currentFollowTank.setActive(false);
            let tank;
            if (!killerId){
                let iterator = this.tanks.values();
                tank = iterator.next().value;
                while (tank){
                    if (tank.isActive()) break;
                    tank = iterator.next().value;
                }
            } else {
                tank = this.tanks.get(killerId);
            }
            if (tank) this.follow(tank);
        }
        if (deathPlayerId === this.me.playerId){
            this.input.stop();
            if (gv.gameRoom.roomState.game["numAlivePlayer"] > 1) gv.sceneMgr.addGui(new GuiDeathScreen(gv.gameRoom.getPlayerDataById(killerId)));
        }
    }
})