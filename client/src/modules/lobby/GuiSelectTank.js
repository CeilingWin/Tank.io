var GuiSelectTank = BaseGui.extend({
    ctor: function (){
        this.btnOk = null;
        this.btnBack = null;
        this.btnNext = null;
        this.btnPrev = null;
        this.cannon = null;
        this.body = null;
        this.pbHp = null;
        this.pbSpeed = null;
        this.pbDamage = null;
        this.pbFireRate = null;
        this.lbTankName = null;
        this.lvSkins = null;
        this._super("res/z_gui/GuiSelectTank.json");
        this.setHaveFog(true);
    },

    initGui: function (){
        this.tanksConfig = Config.getIns().getTanksConfig();
        this.tankType = LocalStorage.getTankType();
        this.selectTank(this.tankType);

        this.body.runAction(cc.rotateBy(10,360).repeatForever());
        this.cannon.runAction(cc.rotateBy(8.5,-360).repeatForever());
        GuiUtils.addEventOnHover(this.btnNext,res.COMMON_BG_TF2_PNG,res.COMMON_BG_TF_PNG);
        GuiUtils.addEventOnHover(this.btnPrev,res.COMMON_BG_TF2_PNG,res.COMMON_BG_TF_PNG);
        GuiUtils.addEventOnHover(this.btnBack,res.COMMON_BTN_BACK2_PNG,res.COMMON_BTN_BACK_PNG);
        GuiUtils.addEventOnHover(this.btnOk,res.COMMON_BTN_OK2_PNG,res.COMMON_BG_TF2_PNG);
    },

    selectTank: function(tankType){
        this.tankType = tankType;
        this.skin = 0;
        // attr
        let config = this.tanksConfig.find(cf=>cf["type"]===tankType);
        this.pbHp.setPercent(config["hp"]/2000*100);
        this.pbSpeed.setPercent(config["max_speed"]/1000*100);
        this.pbFireRate.setPercent(config["bullet_rate"]/1000*100);
        this.pbDamage.setPercent(config["bullet"]["damage"]/300*100);
        this.loadAllSkin(tankType);
        this.selectSkin(this.skin);
    },

    selectSkin: function (skin){
        this.skin = skin;
        this.loadTank(this.tankType,skin);
        this.listSkinUI.forEach(ui=>{
            ui.pn.setVisible(ui.skin===skin);
        })
    },

    loadTank: function(tankType, skin){
        this.tankType = tankType;
        this.body.setTexture(ResourceUtils.getTankBody(tankType,skin));
        this.cannon.setTexture(ResourceUtils.getCannon(tankType,skin));
        this.lbTankName.setString(tankType);
    },

    loadAllSkin: function(tankType){
        let skin = 0;
        this.lvSkins.removeAllItems();
        this.listSkinUI = [];
        while(true){
            let filePath = "res/tank/" + tankType + "/cannon" + skin + ".png";
            if (!cc.loader.getRes(filePath)) return;
            let ui = new ElementSkinTank(this);
            ui.loadData(tankType,skin);
            this.listSkinUI.push(ui);
            this.lvSkins.pushBackCustomItem(ui);
            skin += 1;
        }
    },

    onTouchUIEnded: function(sender){
        switch(sender){
            case this.btnBack:
                this.destroy();
                break;
            case this.btnNext:
                this.onChangeTank(1);
                break;
            case this.btnPrev:
                this.onChangeTank(-1);
                break;
            case this.btnOk:
                LocalStorage.setItem("tankType",this.tankType);
                LocalStorage.setItem("skin",this.skin);
                cc.log("save tank:",this.tankType,"skin",this.skin);
                EventCenter.pub(EventId.CHANGED_TANK);
                this.destroy();
                break;
        }
    },

    onChangeTank: function (offset){
        let currentIndex = this.tanksConfig.findIndex(cf=>cf["type"]===this.tankType);
        currentIndex = ((currentIndex+offset) + this.tanksConfig.length) % this.tanksConfig.length;
        this.selectTank(this.tanksConfig[currentIndex]["type"]);
    }
});

GuiSelectTank.prototype.className = "GuiSelectTank";