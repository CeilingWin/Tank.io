var Lobby = BaseGui.extend({
    ctor: function(){
        this.btnPlayNow = null;
        this.btnJoin = null;
        this.btnNewGame = null;
        this._super("res/gui/SceneLobby.json");
        this.setHaveFog(true);
        this.setDestroyWhenTouchOutside(true);
    },

    onTouchUIEnded: function(sender){
        this.btnPlayNow.setPressedActionEnabled(true);
        switch (sender){
            case this.btnPlayNow:
                cc.log("play now");
                break;
        }
    }
})