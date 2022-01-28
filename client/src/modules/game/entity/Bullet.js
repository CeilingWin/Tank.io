var Bullet = cc.Node.extend({
    ctor: function(){
        this._super();
        this._init();
        this.active = false;
        this.direction = 0;
    },

    _init: function () {
        let spr = new cc.Sprite("res/battle/bullet_mini.png");
        spr.anchorX = 0.7;
        this.spr = spr;
        this.addChild(spr);
    },

    updateData: function (data){
        if (!data.active){
            if (this.active) {
                // todo: show eff explode...
                this.setVisible(false);
                return;
            } else {
                this.setVisible(false);
            }
            return;
        }
        this.setVisible(true);
        this.setPosition(data.x,data.y);
        this.direction = data.direction/Math.PI*180;
        this.spr.setRotation(this.direction);
    }
})