var MapLayer = BaseGui.extend({
    ctor: function(){
        this._super();
    },

    initGui: function(){
        TMParser.parseFile("res/map/map_0.tmx",cc.loader.getRes.bind(cc.loader), (err,map)=>{
            if (err) return cc.log("Cannot load map");
            this.loadMap(map,"background");
            this.loadMap(map,"deco")
            this.loadMap(map,"object");
            this.mapWidth = map.tileWidth*map.width;
            this.mapHeight = map.tileHeight*map.height;
            this.isLoadedMap = true;
            this._loadDone();
        });
    },

    _loadDone: function () {
        if (this.callFunc) {
            this.callFunc();
            this.callFunc = null;
        }
    },

    follow: function(tank){
        this.tank = tank;
        let func = ()=>{
            if (this.actionFollow){
                this.stopAction(this.actionFollow);
            }
            this.actionFollow = this.runAction(cc.follow(tank,cc.rect(0,0,this.mapWidth,this.mapHeight)));
        }
        if (!this.isLoadedMap){
            this.callFunc = func;
        } else {
            func();
        }
    },

    test: function () {
        let tank = this.tank;
        let touchEvent = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: (event)=>{
                let p = event.getLocation();
                p = this.convertToNodeSpace(p);
                return true;
            },

            onTouchEnded: (event) =>{
                let p = event.getLocation();
                p = this.convertToNodeSpace(p);
                this.tank.stopAllActions();
                let speed = 500;
                tank.runAction(cc.moveTo(1,p.x,p.y));
            }
        })
        cc.eventManager.addListener(touchEvent,this);

    },

    loadMap: function(tileMap,layerName){
        let tileSize = cc.size(tileMap.tileWidth, tileMap.tileHeight);
        let mapSize = cc.size(tileMap.width, tileMap.height);
        let objectLayer = tileMap.layers.find(layer => layer.name === layerName);
        for (let xIndex=0;xIndex<mapSize.width;xIndex++){
            for (let yIndex=0;yIndex<mapSize.height;yIndex++){
                let tile = objectLayer.tileAt(xIndex, yIndex);
                if (!tile) continue;
                let resImg = tile.imgRes;
                let pos = tileMap.convertTilePosToXYPos(xIndex,yIndex);
                let object = this.loadObject(resImg,pos.x,pos.y,tile.properties.z);
                let bodys = tile.bodys;
                bodys.forEach(body=>this.drawBody(object,body,tile));
            }
        }
    },

    addTankToMap: function(tank){
        this.addChild(tank,100);
    },

    addBulletToMap: function(bullet){
        this.addChild(bullet,200);
    },

    loadObject: function (imgSource,x,y,z){
        let spr = new cc.Sprite("res/map/"+imgSource);
        spr.anchorX = 0;
        spr.anchorY = 0;
        spr.x = x;
        spr.y = y;
        if (z) {
            this.addChild(spr,z);
        }
        else this.addChild(spr);
        return spr;
    },

    drawBody: function(spr,body,tile){
        let type = body.type;
        let ndBody = new cc.DrawNode();
        ndBody.x = 0; ndBody.y = 0;
        spr.addChild(ndBody);
        let pos;
        switch (type){
            case "rectangle":
                pos = cc.p(body.x,body.y);
                let size = cc.p(body.width,body.height);
                size = cc.pAdd(pos,size);
                ndBody.drawRect(pos, size, cc.color(200,200,200,100), 2, cc.color(255, 0, 255, 255));
                break;
            case "circle":
                pos = cc.p(body.x,body.y);
                let r = body.radius;
                ndBody.drawCircle(pos,r,0,50,false,3,cc.color(255,0,0));
                break;
            case "polygon":
                ndBody.drawPoly(body.points,cc.color(0,255,0,100),3,cc.color(0,255,0));
                break;
        }
    }
})