var MINIMAP_SCALE = 0.4;
var GuiGameControl = BaseGui.extend({
    ctor: function(){
        this.lbNotification = null;
        this.sprMinimap = null;
        this.minimap = null;
        this.pbHp = null;
        this.lbHp = null;
        this._super("res/z_gui/game/GuiGameControl.json");
        gv.gameRoom.getNetwork().onMessage(TYPE_MESSAGE.PLAYER_WAS_KILLED,this.onPlayerWasKilled.bind(this));
        this.subEvent(EventId.KEY_M_PRESS,this.onResizeMinimap.bind(this));
    },

    initGui: function(){
        this.lbNotification.setOpacity(0);
        this.minimap.setVisible(false);
    },

    start: function (){
        this.loadMinimap();
        this.loadAllTanks();
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
            else sprTankPos.setTexture("res/common/red_dot.png");
            sprTankPos.tankId = id;
            this.sprMinimap.addChild(sprTankPos);
            this.tanks.push(sprTankPos);
        });
        this.updateMinimap();
    },

    update: function(){
        this.showTankState(gv.game.getFollowTank());
        this.updateMinimap();
    },

    updateMinimap: function(){
        this.tanks.forEach(sprTank=>{
            let tank = gv.game.tanks.get(sprTank.tankId);
            if (tank.isDied()){
                sprTank.setVisible(false);
            } else {
                let x = tank.x/this.actualSizeMap.width*this.sizeMinimap.width;
                let y = tank.y/this.actualSizeMap.height*this.sizeMinimap.height;
                sprTank.setPosition(x,y);
            }
        });
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
        let mess = "@player was killed by @killer";
        mess = mess.replace("@player",player["username"]).replace("@killer",killer["username"]);
        this.showMessage(mess);
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
    }
});

GuiGameControl.prototype.className = "GuiGameControl";