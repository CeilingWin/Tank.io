var SceneLobby = BaseScene.extend({
    ctor: function(){
        this.btnPlayNow = null;
        this.btnJoin = null;
        this.btnNewGame = null;
        this._super("res/gui/SceneLobby.json");
    },

    onTouchUIEnded: function(sender){
        switch (sender){
            case this.btnPlayNow:
                cc.log("play now");
                break;
            case this.btnJoin:
                cc.log("join game");
                break;
            case this.btnNewGame:
                cc.log("new game");
                break;
        }
    }
});

SceneLobby.prototype.className = "SceneLobby";