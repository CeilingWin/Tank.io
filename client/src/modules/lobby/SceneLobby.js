
var SceneLobby = BaseScene.extend({
    ctor: function(){
        this.btnPlayNow = null;
        this.btnJoin = null;
        this.btnNewGame = null;
        this.tfUserName = null;
        this._super("res/z_gui/SceneLobby.json");
    },

    initGui: function () {
        let username = cc.sys.localStorage.getItem("username");
        if (username) this.tfUserName.setString(username);
        this.tfUserName.addEventListener(()=>{
            cc.sys.localStorage.setItem("username",this.tfUserName.getString());
        });
    },

    onEnter: function (){
        this._super();
        gv.network.connectServer();
    },

    onTouchUIEnded: function(sender){
        switch (sender){
            case this.btnPlayNow:
                MatchMaker.getIns().playNow();
                break;
            case this.btnJoin:
                gv.sceneMgr.addGui(new GuiJoinGame());
                break;
            case this.btnNewGame:
                gv.sceneMgr.addGui(new GuiNewGame());
                break;
        }
    },
});

SceneLobby.prototype.className = "SceneLobby";