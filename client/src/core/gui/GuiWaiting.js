var GuiWaiting = BaseGui.extend({
    ctor: function (){
        this.spr = null;
        this._super("res/z_gui/GuiWaiting.json");

        this.spr.runAction(cc.rotateBy(3,360).repeatForever());
    }
});

GuiWaiting.prototype.className = "GuiWaiting";