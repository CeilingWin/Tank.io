var GuiGameResult = BaseGui.extend({
    ctor: function(){
        this.lbRanking = null;
        this.lv = null;
        this.btnBack = null;
        this._super("res/z_gui/game/GuiGameResult.json");
        this.setHaveFog(true);
        this.setFogOpacity(50);
    },

    initGui: function(){
        this.lbRanking.setString("");
        GuiUtils.addEventOnHover(this.btnBack,res.COMMON_BTN_BACK2_PNG,res.COMMON_BTN_BACK_PNG);
    },

    showGameResult: function (leaderboard){
        let rank = 1;
        leaderboard.forEach(player => {
            let row = new ElementGameResult(rank,player);
            this.lv.pushBackCustomItem(row);
            rank += 1;
        })
    },

    onTouchUIEnded: function (sender){
        switch(sender){
            case this.btnBack:
                gv.gameRoom.leave();
                gv.sceneMgr.runScene(new SceneLobby());
                break;
        }
    }
});

GuiGameResult.prototype.className = "GuiGameResult";