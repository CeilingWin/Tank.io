var GuiDeathScreen = BaseGui.extend({
    ctor: function(killer){
        this.killer = killer;
        this.lbTitle = null;
        this.lbKillBy = null;
        this.btnBack = null;
        this.btnView = null;

        this._super("res/z_gui/game/GuiDeathScreen.json");
        this.setHaveFog(false);
    },

    initGui: function () {
        GuiUtils.addEventOnHover(this.btnBack, res.COMMON_BTN_BACK2_PNG, res.COMMON_BTN_BACK_PNG);
        GuiUtils.addEventOnHover(this.btnView, res.COMMON_BG_TF2_PNG, res.COMMON_BTN_OK2_PNG);
        this.loadData();
        this.lbTitle.scale = 1.5;
        this.lbTitle.setOpacity(100);
        this.lbTitle.runAction(cc.spawn(
            cc.fadeIn(0.8),
            cc.scaleTo(0.5,1,1)
        ));
        let func = (node) => {
            node.setOpacity(0);
            node.runAction(cc.fadeIn(1));
        }
        func(this.lbKillBy);
        func(this.btnBack);
        func(this.btnView);
    },

    loadData: function (){
        let killerName;
        if (!this.killer) killerName = "BO CIRCLE";
        else killerName = this.killer["username"];
        this.lbKillBy.setString("Killed by " + killerName);
    },

    onTouchUIEnded: function (sender){
        switch(sender){
            case this.btnBack:
                gv.gameRoom.leave();
                gv.sceneMgr.runScene(new SceneLobby());
                break;
            case this.btnView:
                this.destroy();
                break;
        }
    }
});

GuiDeathScreen.prototype.className = "GuiDeathScreen";