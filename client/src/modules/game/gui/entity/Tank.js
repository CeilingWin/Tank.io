var Tank = cc.Node.extend({
    ctor: function(){
        this._super();
        this._init();
        this.loadAttributes();
        this.hp = this.maxHp;

        // lb name
        let lbName = new ccui.Text("",res.FONTS_BOLD_TTF,18);
        lbName.setPosition(0,50);
        this.addChild(lbName);
        this.lbName = lbName;
    },

    loadAttributes: function(){
        let config = Config.getIns().getTankConfig();
        this.bulletRate = config["bullet_rate"];
        this.maxHp = config["hp"];
    },

    setData: function(name){
        this.lbName.setString(name);
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
    },

    getWoldPos: function () {
        return this.getParent().convertToWorldSpace(this.getPosition());
    },

    setCannonDirection: function(direction){
        this.cannon.setRotation(direction/Math.PI*180);
    },

    setDirection(direction){
        this.body.setRotation(direction/Math.PI*180);
    },

    setHp: function(hp){
        this.hp = hp;
    }
})