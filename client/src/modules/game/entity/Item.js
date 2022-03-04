var Item = cc.Node.extend({
    ctor: function(){
        this._super();
        this._init();
        this.active = false;
    },

    _init: function () {
        this.iconEffect = new cc.Sprite();
        this.parachute = new cc.Sprite("res/items/parachute.png");
        this.addChild(this.iconEffect);
        this.addChild(this.parachute);
        this.effectType = null;
        this.timeToAppear = Config.getIns().getItemsConfig()["time_to_appear"];
        // eff
        this.iconEffect.runAction(cc.sequence(
            cc.scaleTo(0.5,1.05,1.05),
            cc.scaleTo(0.5,0.95,0.95)
        ).repeatForever());
        this.parachute.runAction(cc.rotateBy(5,360).repeatForever());
    },

    updateData: function (data){
        if (!data.active) this.setVisible(false)
        else {
            this.setVisible(true);
            this.setPosition(data.x,data.y);
            let effectType = data["effectType"];
            if (this.effectType !== effectType){
                this.iconEffect.setTexture(ResourceUtils.getEffect(effectType));
                this.effectType = effectType;
            }
            let timeRemainToAppear = data["timeRemainToAppear"];
            if (timeRemainToAppear <= 0){
                this.parachute.setVisible(false);
            } else {
                this.parachute.setVisible(true);
                this.parachute.scale = 0.5 + 0.5*timeRemainToAppear/this.timeToAppear;
            }
        }
    }
})