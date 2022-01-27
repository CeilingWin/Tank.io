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
        let hpBar = new cc.LayerColor(cc.color.BLACK,145,25);
        hpBar.setPosition(-hpBar.width/2,110);
        this.addChild(hpBar);
        this.hpBar = hpBar;
        let pbHp = new ccui.LoadingBar(res.DEFAULT_LOADINGBARFILE_PNG,60);
        pbHp.setScale9Enabled(true);
        pbHp.width = 140;
        pbHp.height = 20;
        pbHp.setPosition(hpBar.width/2,hpBar.height/2);
        pbHp.setColor(cc.color.GREEN);
        this.hpBar.addChild(pbHp);
        this.pbHp = pbHp;
        this.hpBar.setCascadeOpacityEnabled(true);
        this.hpBar.setOpacity(0);
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
    
    updateData: function (data){
        if (!data.active) {
            this.die();
            return;
        }
        this.setPosition(data.x,data.y);
        this.setDirection(data.direction);
        this.setCannonDirection(data["cannonDirection"]);
        this.setHp(data.hp);
        this.kills = data.kills;
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
        if (deltaHp === 0) return;
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
        this.hpBar.stopAllActions();
        this.hpBar.setOpacity(255);
        let color;
        if (this.hp<this.maxHp*0.3) color = cc.color.RED;
        else if (this.hp<this.maxHp*0.5) color = cc.color.YELLOW;
        else color = cc.color.GREEN;
        this.pbHp.setColor(color);
        this.pbHp.setPercent(this.hp/this.maxHp*100);
        this.hpBar.runAction(cc.sequence(
            cc.delayTime(3),
            cc.fadeOut(1)
        ));
    },

    die: function(){
        this.setVisible(false);
        this._isDied = true;
    },

    isDied: function(){
        return this._isDied;
    }
})