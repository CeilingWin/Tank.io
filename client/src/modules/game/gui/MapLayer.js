var MapLayer = BaseGui.extend({
    ctor: function(mapId){
        this.mapId = mapId;
        this._super();
    },

    initGui: function(){
        TMParser.parseFile("res/map/map_" + this.mapId + ".tmx",cc.loader.getRes.bind(cc.loader), (err,map)=>{
            if (err) return cc.log("Cannot load map");
            this.loadLayer(map,"background");
            this.loadLayer(map,"deco");
            this.loadLayer(map,"object");
            this.tankLayer = new cc.Layer();
            this.addChild(this.tankLayer);
            this.loadTrees(map);
            this.mapWidth = map.tileWidth*map.width;
            this.mapHeight = map.tileHeight*map.height;
            this.isLoadedMap = true;
            this.initBo();
            this._loadDone();
        });
        // this.setScale(0.5,0.5);
    },

    initBo: function (){
        this.ndBo = new cc.Node();
        this.ndBo.setOpacity(50);
        this.ndBo.setCascadeOpacityEnabled(true);
        this.addChild(this.ndBo,1000000);
        this.sprBoCircle = new cc.Sprite(res.COMMON_CIRCLE_PNG);
        this.pnTop = new cc.LayerColor(cc.color.RED,this.mapWidth,this.mapHeight);
        this.pnBottom = new cc.LayerColor(cc.color.RED,this.mapWidth,this.mapHeight);
        this.pnLeft = new cc.LayerColor(cc.color.RED,this.mapWidth,this.mapHeight);
        this.pnRight = new cc.LayerColor(cc.color.RED,this.mapWidth,this.mapHeight);

        this.pnTop = new ccui.Layout();
        this.pnBottom = new ccui.Layout();
        this.pnLeft = new ccui.Layout();
        this.pnRight = new ccui.Layout();

        let listPn = [this.pnTop,this.pnBottom,this.pnLeft,this.pnRight];
        listPn.forEach(pn=>{
            pn.setContentSize(this.getSize());
            pn.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            pn.setBackGroundColor(cc.color.RED);
        });

        this.pnTop.setAnchorPoint(0.5,0);
        this.pnBottom.setAnchorPoint(0.5,1);
        this.pnLeft.setAnchorPoint(1,0.5);
        this.pnRight.setAnchorPoint(0,0.5);
        this.pnTop.x = this.mapWidth/2;
        this.pnBottom.x = this.mapWidth/2;
        this.pnRight.y = this.mapHeight/2;
        this.pnLeft.y = this.mapHeight/2;
        this.ndBo.addChild(this.sprBoCircle);
        this.ndBo.addChild(this.pnTop);
        this.ndBo.addChild(this.pnBottom);
        this.ndBo.addChild(this.pnLeft);
        this.ndBo.addChild(this.pnRight);
        this.defaultBoRadius = this.sprBoCircle.getContentSize().width/2;
        this.ndBo.setVisible(false);
        this.lastBoPos = null;
    },

    updateBo: function (boCircle){
        if (!this.lastBoPos) {
            this.sprBoCircle.setPosition(boCircle.x,boCircle.y);
            this.lastBoPos = true;
            this.ndBo.setVisible(true);
        }
        this.setBoRadius(boCircle.radius);
    },

    setBoRadius: function(radius){
        let scale = radius/this.defaultBoRadius;
        this.sprBoCircle.setScale(scale);
        this.pnTop.y = this.sprBoCircle.y + radius;
        this.pnBottom.y = this.sprBoCircle.y - radius;
        this.pnRight.setPosition(this.sprBoCircle.x + radius,this.sprBoCircle.y);
        this.pnLeft.setPosition(this.sprBoCircle.x - radius,this.sprBoCircle.y);
        let scaleLR = (2*radius)/this.mapHeight;
        this.pnRight.scaleY = scaleLR;
        this.pnLeft.scaleY = scaleLR;
    },

    getSize: function(){
        return cc.size(this.mapWidth,this.mapHeight);
    },

    _loadDone: function () {
        if (this.callFunc) {
            this.callFunc();
            this.callFunc = null;
        }
        gv.game.loadMapDone();
    },

    follow: function(tank){
        this.tank = tank;
        let func = ()=>{
            if (this.actionFollow){
                this.stopAction(this.actionFollow);
            }
            this.actionFollow = this.runAction(cc.follow(tank,cc.rect(0,0,this.mapWidth*this.scaleX,this.mapHeight*this.scaleY)));
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

    loadLayer: function(tileMap,layerName){
        let layer = new cc.Layer();
        layer.setName(layerName);
        this.addChild(layer);
        let tileSize = cc.size(tileMap.tileWidth, tileMap.tileHeight);
        let mapSize = cc.size(tileMap.width, tileMap.height);
        let objectLayer = tileMap.layers.find(layer => layer.name === layerName);
        for (let xIndex=0;xIndex<mapSize.width;xIndex++){
            for (let yIndex=0;yIndex<mapSize.height;yIndex++){
                let tile = objectLayer.tileAt(xIndex, yIndex);
                if (!tile) continue;
                let resImg = tile.imgRes;
                let pos = tileMap.convertTilePosToXYPos(xIndex,yIndex);
                let object = this.loadObject(layer,resImg,pos.x,pos.y,tile.properties.z);
                // tile.bodys.forEach(body=>this.drawBody(object,body,tile));
            }
        }
    },

    loadTrees: function(tileMap){
        this.trees = [];
        const layerName = "trees";
        let layer = new cc.Layer();
        layer.setName(layerName);
        this.addChild(layer);
        let tileSize = cc.size(tileMap.tileWidth, tileMap.tileHeight);
        let mapSize = cc.size(tileMap.width, tileMap.height);
        let objectLayer = tileMap.layers.find(layer => layer.name === layerName);
        let blur = function(bool){
            if (this._isBlur === bool) return;
            if (bool){
                this.setOpacity(120);
                this.body.forEach(b=>b.setVisible(true));
            } else {
                this.setOpacity(255);
                this.body.forEach(b=>b.setVisible(false));
            }
            this._isBlur = bool;
        }
        for (let xIndex=0;xIndex<mapSize.width;xIndex++){
            for (let yIndex=0;yIndex<mapSize.height;yIndex++){
                let tile = objectLayer.tileAt(xIndex, yIndex);
                if (!tile) continue;
                let resImg = tile.imgRes;
                let pos = tileMap.convertTilePosToXYPos(xIndex,yIndex);
                let tree = this.loadObject(layer,resImg,pos.x,pos.y);
                tree.center = cc.pAdd(tree.getPosition(),cc.p(tree.width/2,tree.height/2));
                tree.radius = tree.width/2;
                tree.blur = blur;
                tree.body = [];
                tile.bodys.forEach(body=>{
                    let ndBody = new cc.DrawNode();
                    ndBody.x = 0; ndBody.y = 0;
                    ndBody.setPosition(tree.getPosition());
                    ndBody.setVisible(false);
                    layer.addChild(ndBody);
                    let pos = cc.p(body.x,body.y);
                    let r = body.radius;
                    ndBody.drawDot(pos,r,cc.color(94,53,38));
                    tree.body.push(ndBody);
                });
                this.trees.push(tree);
            }
        }
    },

    update: function(){
        let tank = gv.game.getFollowTank();
        this.trees.forEach(tree=>{
            if (cc.pDistance(tank.getPosition(), tree.center) <= tree.radius){
                tree.blur(true);
            } else {
                tree.blur(false);
            }
        })
    },

    addTankToMap: function(tank){
        cc.log("add tank");
        this.tankLayer.addChild(tank,100);
    },

    addBulletToMap: function(bullet){
        this.tankLayer.addChild(bullet,200);
    },

    addJetPlaneToMap: function(jetPlane){
        this.addChild(jetPlane,1000);
    },

    addItemToMap: function (item){
        this.addChild(item,500);
    },

    loadObject: function (parent,imgSource,x,y,z){
        let spr = new cc.Sprite("res/map/"+imgSource);
        spr.anchorX = 0;
        spr.anchorY = 0;
        spr.x = x;
        spr.y = y;
        if (z) {
            parent.addChild(spr,z);
        }
        else parent.addChild(spr);
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