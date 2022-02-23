var JetPlane = cc.Node.extend(_injectCCS).extend({
    ctor: function(){
        this._super();
        this.rootNode = this.initJson("res/z_gui/game/entity/JetPlane.json");
        this.rootNode.setScale(0.7,0.7);
        this.active = false;
        this.direction = 0;
    },

    updateData: function (data){
        if (!data.active){
            if (this.active) {
                // todo: show eff explode...
                this.setVisible(false);
                return;
            } else {
                this.setVisible(false);
            }
            return;
        }
        this.setVisible(true);
        this.setPosition(data.x,data.y);
        this.direction = data.direction/Math.PI*180;
        this.rootNode.setRotation(this.direction);
    }
})