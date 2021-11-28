
var SceneLobby = BaseScene.extend({
    ctor: function(){
        this.btnPlayNow = null;
        this.btnJoin = null;
        this.btnNewGame = null;
        this.tfUserName = null;
        this._super("res/z_gui/SceneLobby.json");
    },

    initGui: function () {

    },

    onTouchUIEnded: function(sender){
        switch (sender){
            case this.btnPlayNow:
                MatchMaker.getIns().playNow(this.tfUserName.getString());
                break;
            case this.btnJoin:
                this.initGui();
                cc.log("join game");
                break;
            case this.btnNewGame:
                cc.log("new game");
                break;
        }
    }
});

SceneLobby.prototype.className = "SceneLobby";