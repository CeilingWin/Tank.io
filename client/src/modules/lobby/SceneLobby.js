
var SceneLobby = BaseScene.extend({
    ctor: function(){
        this.btnPlayNow = null;
        this.btnJoin = null;
        this.btnNewGame = null;
        this.tfUserName = null;
        this.btnChangeTank = null;
        this.body = null;
        this.cannon = null;
        this._super("res/z_gui/SceneLobby.json");
        this.subEvent(EventId.CHANGED_TANK,this.loadTank.bind(this));
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
        GuiUtils.addEventOnHover(this.btnChangeTank,res.COMMON_BTN_OK2_PNG,res.COMMON_RECTANGLE_PNG);
        this.body.runAction(cc.rotateBy(10,360).repeatForever());
        this.cannon.runAction(cc.rotateBy(8.5,-360).repeatForever());
        this.loadTank();

        let rt = new ccui.RichText();
        rt.setContentSize(cc.size(1000,200));
        rt.setPosition(500,500);
        this.addChild(rt);
        let t1 = new ccui.RichElementText(0,cc.color.RED,255,"Test1",res.FONTS_ARIAL_TTF,50);
        let t2 = new ccui.RichElementText(0,cc.color.GREEN,255,"Test2",res.FONTS_ARIAL_TTF,50);
        rt.pushBackElement(t1);
        rt.pushBackElement(t2);
    },

    loadTank: function (){
        let tankType = LocalStorage.getTankType();
        let skin = Number(LocalStorage.getSkin());
        this.body.setTexture(ResourceUtils.getTankBody(tankType,skin));
        this.cannon.setTexture(ResourceUtils.getCannon(tankType,skin));
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