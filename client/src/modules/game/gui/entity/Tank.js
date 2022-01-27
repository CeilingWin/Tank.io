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
        // pb hp
        // let hpBar = new cc.Sprite("res/common/bg_progress_bar.png");
        // hpBar.setPosition(0,140);
        // this.addChild(hpBar);
        // this.hpBar = hpBar;
        // let pbHp = new ccui.LoadingBar("res/Default/LoadingBarFile.png",100);
        // pbHp.setContentSize(80,20);
        // pbHp.setPosition(hpBar.width/2,hpBar.height/2);
        // pbHp.setColor(cc.color.GREEN);
        // this.hpBar.addChild(pbHp);
    },

    loadAttributes: function(){
        let config = Config.getIns().getTankConfig();
        this.bulletRate = config["bullet_rate"];
        this.bodyWidth = config["width"];
        this.bodyHeight = config["height"];
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
        let deltaHp = hp - this.hp;
        this.hp = hp;
        if (deltaHp<0){
            let text = new ccui.Text(deltaHp,res.FONTS_ARIALBD_TTF,40);
            text.setColor(cc.color.RED);
            text.setPosition(cc.pAdd(this.getPosition(),cc.p(0,20)));
            this.getParent().addChild(text);
            text.runAction(cc.sequence(
                cc.spawn(
                    cc.moveBy(0.6,0,200),
                    cc.fadeOut(0.6)
                ),
                cc.callFunc(()=>text.removeFromParent())
            ));
        }
    },

    die: function(){
        this.setVisible(false);
        this._isDied = true;
    },

    isDied: function(){
        return this._isDied;
    }
})