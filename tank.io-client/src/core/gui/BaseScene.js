var Layer = {
    GUI : 0,
    TOP : 1,
}
var BaseScene = cc.Scene.extend(_injectCCS).extend({
    ctor: function (jsonFile){
        this._super();
        // attr
        this._listGui = [];
        this.initJson(jsonFile);
        this.initLayer();
    },

    initLayer: function () {
        this._listLayer = [];
        let numLayer = 0;
        for (let key in Layer){
            let idLayer = Layer[key];
            let layer = new cc.Layer();
            this._listLayer.push(layer);
            this.addChild(layer,idLayer);
            numLayer += 1;
        }
        this.numLayer = numLayer;
    },

    addGui: function(gui, layerId = Layer.GUI){
        if (layerId >= this.numLayer) layerId = this.numLayer - 1;
        this._listLayer[layerId].addChild(gui);
        this._listGui.push(gui);
        return gui;
    },

    getGui: function (guiName){
        return this._listGui.find(gui => gui.getClassName() === guiName);
    },

    removeGui: function(guiName) {
        return this._listGuis = this._listGuis.filter(gui => gui.getClassName() !== guiName);
    },

    getLayer: function(layerId){
        return this._listLayer[layerId];
    },

    onRemove: function(){
        this.removeAllEvents();
        this._listGui.forEach(gui => gui.destroy());
    }
});

