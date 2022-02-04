
var SceneLobby = BaseScene.extend({
    ctor: function(){
        this.btnPlayNow = null;
        this.btnJoin = null;
        this.btnNewGame = null;
        this.tfUserName = null;
        this.btnChangeTank = null;
        this._super("res/z_gui/SceneLobby.json");
    },

    initGui: function () {
        let username = LocalStorage.getUsername();
        if (username) this.tfUserName.setString(username);
        this.tfUserName.addEventListener(()=>{
            cc.sys.localStorage.setItem("username",this.tfUserName.getString());
        });
        GuiUtils.addEventOnHover(this.btnPlayNow,res.COMMON_RECTANGLE_SELECTED_PNG,res.COMMON_RECTANGLE_PNG);
        GuiUtils.addEventOnHover(this.btnNewGame,res.COMMON_RECTANGLE_SELECTED_PNG,res.COMMON_RECTANGLE_PNG);
        GuiUtils.addEventOnHover(this.btnJoin,res.COMMON_RECTANGLE_SELECTED_PNG,res.COMMON_RECTANGLE_PNG);
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
            case this.btnChangeTank:
                gv.sceneMgr.addGui(new GuiSelectTank());
                break;
        }
    },
});

SceneLobby.prototype.className = "SceneLobby";