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
        this.lastShootAt = 0;
        this.cannonDirection = 0;
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
        this.checkShoot(data["lastShootAt"]);
        this.kills = data.kills;
    },

    checkShoot: function (lastShootAt){
        if (lastShootAt > this.lastShootAt){
            this.lastShootAt = lastShootAt;
            this.cannon.stopAllActions();
            this.cannon.setPosition(0,0);
            let dx = Math.cos(-this.cannonDirection);
            let dy = Math.sin(-this.cannonDirection);
            this.cannon.runAction(cc.sequence(
                cc.moveBy(0.1,dx*4,dy*4),
                cc.moveBy(0.1,-dx*8,-dy*8),
                cc.moveTo(0.1,0,0)
            ));
            let fire = this.cannon.fire;
            fire.stopAllActions();
            fire.setOpacity(0);
            fire.runAction(cc.sequence(
                cc.fadeIn(0.1),
                cc.fadeOut(0.1)
            ));
        }
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
        let fire = new cc.Sprite("res/battle/fire.png");
        fire.anchorX = 0;
        fire.setPosition(cannon.width*0.95,cannon.height/2);
        fire.setOpacity(0);
        this.cannon.addChild(fire);
        this.cannon.fire = fire;
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

    getWoldPos: function () {
        return this.getParent().convertToWorldSpace(this.getPosition());
    },

    setCannonDirection: function(direction){
        this.cannonDirection = direction;
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
        if (this.isDied()) return;
        this.setVisible(false);
        this._isDied = true;
        // eff
        let spr = new cc.Sprite(res.BATTLE_TANK_DEATH_PNG);
        spr.setPosition(this.x,this.y);
        this.getParent().addChild(spr);
        spr.setOpacity(0);
        spr.setRotation(Math.random()*Math.PI*2);
        spr.runAction(cc.fadeIn(0.3));
    },

    isDied: function(){
        return this._isDied;
    }
})