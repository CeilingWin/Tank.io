var GuiGameControl = BaseGui.extend({
    ctor: function(){
        this.btnTest = null;
        this._super("res/z_gui/game/GuiGameControl.json");
    },

    initGui: function(){
    },

});

GuiGameControl.prototype.className = "GuiGameControl";