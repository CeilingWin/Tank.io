
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
        let config = Config.getIns().getTankConfig(this.type);
        this.bulletRate = config["bullet_rate"];
        this.bodyWidth = config["width"];
        this.bodyHeight = config["height"];
        this.maxHp = config["hp"];
        this.maxBullets = config["max_bullets"];
        this.timeReloadBullet = config["time_reload_bullet"];
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
        this.updateBullet(data["numBullet"],data["timeRemainToFullBullet"]);
        this.updateEffect(data["effects"]);
        this.kills = data.kills;
    },

    updateEffect: function (effects){
        if (effects.find(effect=>effect.type === GC.EFFECT_TYPE.HEAL)) this.ndHeal.setVisible(true);
        else this.ndHeal.setVisible(false);
        if (effects.find(effect=>effect.type === GC.EFFECT_TYPE.SHIELD)) this.ndShield.setVisible(true);
        else this.ndShield.setVisible(false);
    },
    
    updateBullet: function (numBullet, timeRemainToFullBullet){
        this.numBullet = numBullet;
        if (numBullet > 0) this.bulletBar.setOpacity(0);
        else {
            this.bulletBar.setOpacity(255);
            this.pbBullet.setPercent(timeRemainToFullBullet/this.timeReloadBullet*100);
        }
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
        let body = new cc.Sprite(ResourceUtils.getTankBody(this.type,this.skin));
        this.addChild(body);
        this.body = body;
        //cannon
        let cannon = new cc.Sprite(ResourceUtils.getCannon(this.type,this.skin));
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
        let hpBar = new cc.LayerColor(cc.color(0,0,0,100),145,15);
        hpBar.setPosition(-hpBar.width/2,110);
        this.addChild(hpBar);
        this.hpBar = hpBar;
        let pbHp = new ccui.LoadingBar(res.DEFAULT_LOADINGBARFILE_PNG,60);
        pbHp.setScale9Enabled(true);
        pbHp.width = 140;
        pbHp.height = 12;
        pbHp.setPosition(hpBar.width/2,hpBar.height/2);
        pbHp.setColor(cc.color.GREEN);
        this.hpBar.addChild(pbHp);
        this.pbHp = pbHp;
        this.hpBar.setCascadeOpacityEnabled(true);
        this.hpBar.setOpacity(0);
        // pb bullet
        let bulletBar = new cc.LayerColor(cc.color(0,0,0,100),145,15);
        bulletBar.setPosition(-bulletBar.width/2,90);
        this.addChild(bulletBar);
        this.bulletBar = bulletBar;
        let pbBullet = new ccui.LoadingBar(res.DEFAULT_LOADINGBARFILE_PNG,60);
        pbBullet.setScale9Enabled(true);
        pbBullet.width = 140;
        pbBullet.height = 12;
        pbBullet.setPosition(bulletBar.width/2,bulletBar.height/2);
        pbBullet.setColor(cc.color.WHITE);
        this.bulletBar.addChild(pbBullet);
        this.pbBullet = pbBullet;
        this.bulletBar.setCascadeOpacityEnabled(true);
        this.bulletBar.setOpacity(0);
        // eff heal
        this.ndHeal = new cc.Node();
        this.addChild(this.ndHeal);
        const numIcon = 5;
        const d = 60, t = 0.7;
        for (let i=0;i<numIcon;i++){
            let icon = new cc.Sprite("res/effect/eff_heal2.png");
            icon.setColor(cc.color.GREEN);
            icon.setOpacity(0);
            let x = Math.random()*1.6*d - d*0.8;
            let y = -Math.random()*d + d*0.2;
            icon.oldPos = cc.p(x,y);
            icon.setPosition(x,y);
            this.ndHeal.addChild(icon);
            let delay = Math.random()*0.3 + 0.1;
            icon.runAction(cc.sequence(
                cc.delayTime(delay),
                cc.callFunc(()=>{
                    icon.y = icon.oldPos.y;
                    icon.setOpacity(255);
                }),
                cc.spawn(
                    cc.moveBy(t,0,80),
                    cc.sequence(
                        cc.delayTime(t*0.5),
                        cc.fadeOut(t*0.5)
                    )
                )
            ).repeatForever());
        }
        // eff shield
        this.ndShield = new cc.Node();
        this.addChild(this.ndShield);
        const numSpr = 4, rotationSpeed = 180;
        for (let i=0;i<numSpr;i++){
            let shield = new cc.Sprite("res/effect/shield.png");
            shield.anchorX = 0.29;
            shield.anchorY = 0.47;
            shield.setPosition(0,0);
            shield.rotation = 360/numSpr*i;
            let rotationBy = i%2===0? rotationSpeed : rotationSpeed/2;
            shield.runAction(cc.rotateBy(1,rotationBy).repeatForever());
            this.ndShield.addChild(shield);
        }
        this.ndHeal.setVisible(false);
        this.ndShield.setVisible(false);
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
        hp = Math.round(hp);
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