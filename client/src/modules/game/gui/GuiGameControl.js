var MINIMAP_SCALE = 0.4;
var NUM_FRAME_TO_UPDATE_FPS = 60;
var VIEW_RANGE = 900;
var GuiGameControl = BaseGui.extend({
    ctor: function(){
        this.lbNotification = null;
        this.sprMinimap = null;
        this.minimap = null;
        this.ndHp = null;
        this.pbHp = null;
        this.lbHp = null;
        this.lbKills = null;
        this.lbAlive = null;
        this.lbFps = null;
        this.lbPing = null;
        this.btnBack = null;
        this.lbNumBullet = null;
        this.sprViewMode = null;
        this.ndBullet = null;
        this._super("res/z_gui/game/GuiGameControl.json");
        gv.gameRoom.getNetwork().onMessage(TYPE_MESSAGE.PLAYER_WAS_KILLED,this.onPlayerWasKilled.bind(this));
        this.subEvent(EventId.KEY_M_PRESS,this.onResizeMinimap.bind(this));
        this.setCascadeOpacityEnabled(true);
    },

    initGui: function(){
        this.lbNotification.setOpacity(0);
        this.minimap.setVisible(false);
        this.sprViewMode.setVisible(false);
    },

    start: function (){
        this.loadMinimap();
        this.loadAllTanks();
        this.lastTime = Date.now();
        this.numFrame = 0;
    },

    loadMinimap: function (){
        this.minimap.setVisible(true);
        this.isShowMap = false;
        let mapId = gv.game.mapId;
        this.sprMinimap.setTexture("res/map/minimap/map" + mapId + ".png");
        this.sizeMinimap = this.sprMinimap.getContentSize();
        this.actualSizeMap = gv.game.mapLayer.getSize();
        this.minimap.scale = MINIMAP_SCALE;
    },

    loadAllTanks: function (){
        let tanks = gv.game.tanks;
        this.tanks = [];
        tanks.forEach((tank,id)=>{
            let sprTankPos = new cc.Sprite();
            if (tank.isMe) sprTankPos.setTexture("res/common/blue_dot.png");
            else {
                sprTankPos.setTexture("res/common/red_dot.png");
                // todo: hide tank
                // sprTankPos.setVisible(false);
            }
            sprTankPos.tankId = id;
            this.sprMinimap.addChild(sprTankPos);
            this.tanks.push(sprTankPos);
        });
        this.updateMinimap();
    },

    update: function(){
        let followTank = gv.game.getFollowTank();
        this.showTankState(followTank);
        this.updateMinimap();
        this.lbAlive.setString(gv.gameRoom.roomState["game"]["numAlivePlayer"]);
        this.lbKills.setString(followTank.kills);
        this.lbPing.setString(gv.network.getPing() + "ms");
        // fps
        this.numFrame += 1;
        if (this.numFrame >= NUM_FRAME_TO_UPDATE_FPS){
            let currentTime = Date.now();
            let fps = Math.round(1000/(currentTime-this.lastTime)*this.numFrame);
            this.lbFps.setString(fps);
            this.lastTime = currentTime;
            this.numFrame = 0;
        }
    },

    updateMinimap: function(){
        let followTank = gv.game.getFollowTank();
        let followTankPos = followTank.getPosition();
        this.tanks.forEach(sprTank=>{
            let tank = gv.game.tanks.get(sprTank.tankId);
            if (tank.isDied() || cc.pDistance(followTankPos,tank.getPosition())>VIEW_RANGE){
                sprTank.setVisible(false);
            } else {
                sprTank.setVisible(true);
                let x = tank.x/this.actualSizeMap.width*this.sizeMinimap.width;
                let y = tank.y/this.actualSizeMap.height*this.sizeMinimap.height;
                sprTank.setPosition(x,y);
            }
        });
    },

    updateBo: function(boData){
        if (!this.bo){
            this.bo = new cc.DrawNode();
            let x = boData.x/this.actualSizeMap.width*this.sizeMinimap.width;
            let y = boData.y/this.actualSizeMap.height*this.sizeMinimap.height;
            this.bo.setPosition(x,y);
            this.bo.drawCircle(cc.p(0,0),100,0,100,false,2,cc.color.BLUE);
            this.minimap.addChild(this.bo);
        }
        let radius = boData.radius;
        this.bo.scale = radius/this.actualSizeMap.width*this.sizeMinimap.width/100;
    },

    onResizeMinimap: function(){
        this.isShowMap = !this.isShowMap;
        this.minimap.stopAllActions();
        if (this.isShowMap){
            this.minimap.runAction(cc.scaleTo(0.4,1).easing(cc.easeBackOut()));
        } else {
            this.minimap.runAction(cc.scaleTo(0.4,MINIMAP_SCALE).easing(cc.easeBackIn()));
        }
    },

    onPlayerWasKilled: function(message){
        let player = gv.gameRoom.getPlayerDataById(message["playerId"]);
        let killer = gv.gameRoom.getPlayerDataById(message["killerId"]);
        if (message["playerId"] === gv.game.me.playerId) {
            this.sprViewMode.setVisible(true);
            this.sprViewMode.runAction(cc.sequence(
                cc.fadeOut(1),
                cc.fadeIn(1)
            ).repeatForever());
            this.ndHp.setVisible(false);
            this.ndBullet.setVisible(false);
        } else {
            let killerUserName ;
            if (!killer) killerUserName = "BO CIRCLE";
            else killerUserName = killer["username"];
            let mess = "@player was killed by @killer";
            mess = mess.replace("@player",player["username"]).replace("@killer",killerUserName);
            this.showMessage(mess);
        }
    },

    showMessage: function(mess){
        this.lbNotification.stopAllActions();
        this.lbNotification.setOpacity(255);
        this.lbNotification.setString(mess);
        this.lbNotification.runAction(cc.sequence(
            cc.delayTime(3),
            cc.fadeOut(2)
        ));
    },

    showTankState: function(tank){
        this.pbHp.setPercent(tank.hp/tank.maxHp*100);
        this.lbHp.setString(tank.hp + "/" + tank.maxHp);
        this.lbNumBullet.setString(tank.numBullet + "/" + tank.maxBullets);
    },

    onTouchUIEnded: function (sender){
        switch (sender){
            case this.btnBack:
                gv.gameRoom.leave();
                gv.sceneMgr.runScene(new SceneLobby());
                break;
        }
    },

    onExit: function(){

    }
});

GuiGameControl.prototype.className = "GuiGameControl";