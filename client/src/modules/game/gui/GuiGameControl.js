var GuiGameControl = BaseGui.extend({
    ctor: function(){
        this.lbNotification = null;
        this._super("res/z_gui/game/GuiGameControl.json");
        gv.gameRoom.getNetwork().onMessage(TYPE_MESSAGE.PLAYER_WAS_KILLED,this.onPlayerWasKilled.bind(this));
    },

    initGui: function(){
        this.lbNotification.setOpacity(0);
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
    }

});

GuiGameControl.prototype.className = "GuiGameControl";