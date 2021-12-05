var Tank = cc.Node.extend({
    ctor: function(){
        this._super();

        let tank = new cc.Sprite("res/map/textures/object/80-100.png");
        tank.x = tank.width/2;
        tank.y = tank.height/2;
        this.addChild(tank);
    },
})