
import * as tmx from "tmx-parser";
var TMParser = {
    parse: tmx.parse,
    parseFile: (filePath,fileReader,callback)=>{
        if (fileReader) {
            tmx.readFile  = (filePath,cb)=>{
                let data = fileReader(filePath);
                let err = data ? false : true;
                cb(err,data);
            }
        }
        tmx.parseFile(filePath,(err,map)=>{
            if (err) console.log("load map failed!");
            else map = TMParser._customMap(map);
            callback && callback(err,map);
        });
    },

    _customMap: (map)=>{
        let tileSize = {width: map.tileWidth, height: map.tileHeight};
        let mapSize = {width: map.width, height: map.height};
        // custom tileset
        map.tileSets.forEach(tileSet => {
            if (tileSet.image) return;
            tileSet.tiles.forEach(tile =>{
                // load image info
                tile.imgRes = tile.image.source;
                tile.width = tile.image.width;
                tile.height = tile.image.height;
                // load collision
                tile.bodys = [];
                tile.objectGroups.forEach(body=>TMParser._loadBody(tile,body));
                // remove unused attributes tile
                delete tile.image;
                delete tile.terrain;
                delete tile.probability;
                delete tile.animations;
                delete tile.objectGroup;
            });
        });
        // custom layer
        map.layers.forEach(layer => {
            // if (!layer.properties.isNeedToLoad) return;
            for (let xIndex=0;xIndex<mapSize.width;xIndex++){
                for (let yIndex=0;yIndex<mapSize.height;yIndex++){
                    let tile = layer.tileAt(xIndex,yIndex);
                    if (!tile) continue;
                    // load position
                    tile.x = xIndex*tileSize.width;
                    tile.y = (mapSize.height - yIndex)*tileSize.height;
                }
            }
            // remove unused attributes layer
            delete layer.diagonalFlips;
            delete layer.horizontalFlips;
            delete layer.verticalFlips;
            delete layer.type;
        });
        map.convertTilePosToXYPos = function(x,y){
            return {
                x: x*this.tileWidth,
                y: (this.height - y)*this.tileHeight
            }
        }
        return map;
    },

    _loadBody: (tile,body)=>{
        if (!body) return;
        let customBody = {};
        let _convertPosY = (y) =>{
            return tile.height - y;
        }
        if (body.ellipse){
            customBody.type = "circle";
            customBody.radius = body.width/2;
            customBody.x = body.x + customBody.radius;
            customBody.y = _convertPosY(body.y + customBody.radius);
        } else if (body.polygon){
            customBody.type = "polygon";
            let x = body.x;
            let y = body.y;
            customBody.x = x;
            customBody.y = _convertPosY(y);
            customBody.points = [];
            body.polygon.forEach(pos => {
                customBody.points.push({
                    x: +pos.x,
                    y: -pos.y
                });
            });
        } else {
            customBody.type = "rectangle";
            customBody.x = body.x;
            customBody.y = tile.height - (body.y + body.height);
            customBody.width = body.width;
            customBody.height = body.height;
        }
        tile.bodys.push(customBody);
    }

}
console.log("Exported custom tmx reader!");

export {TMParser};