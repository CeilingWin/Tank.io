var GuiGameResult = BaseGui.extend({
    ctor: function(){
        this.lbRanking = null;
        this.lv = null;
        this.btnBack = null;
        this.lbNextGame = null;
        this._super("res/z_gui/game/GuiGameResult.json");
        this.setHaveFog(true);
        this.setFogOpacity(50);
    },

    initGui: function () {
        this.lbRanking.setString("");
        GuiUtils.addEventOnHover(this.btnBack, res.COMMON_BTN_BACK2_PNG, res.COMMON_BTN_BACK_PNG);
        this.timeFinishShowLeaderBoard = gv.gameRoom.roomState["timeFinishShowLeaderBoard"];
        this.schedule(this.update.bind(this), 1);
        this.update();
        let gui = gv.sceneMgr.getGui(GuiDeathScreen.prototype.className);
        gui && gui.destroy();
    },

    update: function () {
        let timeRemain = Math.round((this.timeFinishShowLeaderBoard - gv.gameRoom.getServerTime()) / 1000);
        this.lbNextGame.setString("Next game begins in @time seconds".replace("@time", timeRemain));
    },

    showGameResult: function (leaderboard) {
        let playerRank, rank = 1;
        let playerId = gv.gameRoom.getPlayerId();
        leaderboard.forEach(player => {
            let isMe = false;
            if (player["playerId"] === playerId) {
                playerRank = rank;
                isMe = true;
            }
            let row = new ElementGameResult(rank, player, isMe);
            this.lv.pushBackCustomItem(row);
            rank += 1;
        });
        this.lbRanking.setString("#" + playerRank + "/" + leaderboard.length);
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