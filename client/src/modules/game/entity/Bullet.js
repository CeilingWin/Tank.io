var Bullet = cc.Node.extend({
    ctor: function(){
        this._super();
        this._init();
    },

    _init: function () {
        let spr = new cc.Sprite("res/bullet/bullet_normal.png");
        this.addChild(spr);
    }
})