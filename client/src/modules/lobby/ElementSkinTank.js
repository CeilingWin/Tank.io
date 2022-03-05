var ElementSkinTank = ccui.Layout.extend(_injectCCS).extend({
    ctor: function(){
        this._super();
        this.pn = null;
        this.btn = null;
        this.body = null;
        this.cannon = null;
        this.rootNode = this.initJson("res/z_gui/ElementSkinTank.json");
        this.setContentSize(this.pn.getContentSize());
        this.btn.addClickEventListener(this.onClick.bind(this));
        this.btn.setPressedActionEnabled(true);
        this.btn.setSwallowTouches(false);
    },

    loadData: function (tankType, skin){
        this.tankType = tankType;
        this.skin = skin;
        this.body.setTexture(ResourceUtils.getTankBody(tankType,skin));
        this.cannon.setTexture(ResourceUtils.getCannon(tankType,skin));
        this.rootNode.setScale(0);
        this.rootNode.runAction(cc.sequence(
            cc.delayTime(0.06*skin),
            cc.scaleTo(0.3,1.05,1.01),
            cc.scaleTo(0.1,0.97,0.98),
            cc.scaleTo(0.1,1,1)
        ));
    },

    onClick: function (){
        let guiSelectTank = gv.sceneMgr.getGui(GuiSelectTank.prototype.className);
        guiSelectTank.selectSkin(this.skin);
        this.btn.stopAllActions();
        this.btn.scale = 1;
        this.btn.runAction(cc.sequence(
            cc.scaleTo(0.08,1.1),
            cc.scaleTo(0.06,1)
        ));
    }
})