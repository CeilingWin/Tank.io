var Tank = cc.Node.extend({
    ctor: function(){
        this._super();
        this._init();
    },
    
    _init: function () {
        // body
        let body = new cc.Sprite("res/tank/body.png");
        this.addChild(body);
        this.body = body;
        //cannon
        let cannon = new cc.Sprite("res/tank/cannon1.png");
        cannon.anchorX = 0.4;
        this.addChild(cannon);
        this.cannon = cannon;
    }
})