var Tank = cc.Node.extend({
    ctor: function(type, skin){
        this.type = type;
        this.skin = skin;
        this._super();
        this._init();
        this.loadAttributes();
        this.hp = this.maxHp;
        this._isDied = false;
        this.kills = 0;
        // lb name
        let lbName = new ccui.Text("",res.FONTS_ARIALBD_TTF,22);
        lbName.setPosition(0,80);
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
        let body = new cc.Sprite("res/tank/"+this.type+ "/body" + this.skin + ".png");
        this.addChild(body);
        this.body = body;
        //cannon
        let cannon = new cc.Sprite("res/tank/"+this.type+ "/cannon" + this.skin + ".png");
        cannon.anchorX = 0.3;
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
    },

    die: function(){
        this.setVisible(false);
        this._isDied = true;
    },

    isDied: function(){
        return this._isDied;
    }
})