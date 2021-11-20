var MapLayer = BaseGui.extend({
    ctor: function(){
        this._super("res/z_gui/game/MapLayer.json");
    },

    initGui: function(){
        let fileReader = (filePath)=>{
            return cc.loader.getRes(filePath);
        };
        TMParser.parseFile("res/map/map_0.tmx",cc.loader.getRes.bind(cc.loader), (err,map)=>{
            if (err) cc.log(err);
            else cc.log(map);
            this.loadMap(map,"background");
            this.loadMap(map,"deco")
            this.loadMap(map,"object");
        });
    },

    loadMap: function(tileMap,layerName){
        let tileSize = cc.size(tileMap.tileWidth, tileMap.tileHeight);
        let mapSize = cc.size(tileMap.width, tileMap.height);
        let objectLayer = tileMap.layers.find(layer => layer.name === layerName);
        cc.log(objectLayer);
        cc.log(objectLayer.tiles.length);
        for (let xIndex=0;xIndex<mapSize.width;xIndex++){
            for (let yIndex=0;yIndex<mapSize.height;yIndex++){
                let tile = objectLayer.tileAt(xIndex, yIndex);
                if (!tile) continue;
                let resImg = tile.image.source;
                let x = xIndex*tileSize.width;
                let y = (mapSize.height - yIndex)*tileSize.height;
                let diagonalFlips = objectLayer.diagonalFlips[yIndex*mapSize.width+xIndex];
                let horizontalFlips = objectLayer.horizontalFlips[yIndex*mapSize.width+xIndex];
                let verticalFlips = objectLayer.verticalFlips[yIndex*mapSize.width+xIndex];
                if (tile.id === 53){
                    cc.log(xIndex,yIndex,"d h v",diagonalFlips,horizontalFlips,verticalFlips);
                }
                let object = this.loadObject(resImg,x,y);
                let body = tile.objectGroups.find(o=>o.name === "body");
                body && this.drawBody(object,body,tile);
            }
        }
    },

    _loadMap: function () {

    },

    loadObject: function (imgSource,x,y){
        let spr = new cc.Sprite("res/map/"+imgSource);
        spr.anchorX = 0;
        spr.anchorY = 0;
        spr.x = x;
        spr.y = y;
        cc.log("rotation ",)
        spr.setContentSize(cc.size())
        this.addChild(spr);
        return spr;
    },

    drawBody: function(spr,body,tile){
        cc.log("draw body",body);
        let ndBody = new cc.DrawNode();
        let localPos = cc.p(body.x,body.y);
        if (body.ellipse){
            cc.log('ellipse');
        } else if (body.polygon){
            cc.log('polygon');
        } else {
            cc.log("rectangle");
            let posX = localPos.x;
            let posY = tile.image.height - (localPos.y + body.height);
            let pos = cc.p(posX,posY);
            let size = cc.p(body.width,body.height);
            size = cc.pAdd(pos,size);
            ndBody.drawRect(pos, size, cc.color(200,200,200,100), 2, cc.color(255, 0, 255, 255));
        }
        spr.addChild(ndBody);
        cc.log("______________________________");
    }
})