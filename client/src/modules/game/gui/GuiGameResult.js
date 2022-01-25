var GuiGameResult = BaseGui.extend({
    ctor: function(){
        this.lbRanking = null;
        this.lv = null;
        this.btnBack = null;
        this._super("res/z_gui/game/GuiGameResult.json");
        this.setHaveFog(true);
    },

    initGui: function(){
        this.lbRanking.setString("");
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