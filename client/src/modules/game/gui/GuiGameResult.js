var GuiGameResult = BaseGui.extend({
    ctor: function(){
        this.lbRanking = null;
        this.lv = null;
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
    }
});

GuiGameResult.prototype.className = "GuiGameResult";