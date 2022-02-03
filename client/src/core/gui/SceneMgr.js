var SceneMgr = cc.Class.extend({
    ctor: function () {
    },
    getRunningScene: function () {
        return this._runningScene || cc.director.getRunningScene();
    },
    getCurSceneName: function() {
        var curScene = this.getRunningScene();
        if (curScene) return curScene.className;
        else return "";
    },
    runScene: function(scene) {
        this._runningScene && this._runningScene.onRemove();
        cc.director.runScene(scene);
        this._runningScene = scene;
        return scene;
    },
    getLayer: function(layerIndex) {
        return this.getRunningScene().getLayer(layerIndex);
    },
    getTopLayer: function () {
        return this.getRunningScene().getTopLayer();
    },
    addGui: function(gui, layerId) {
        return this.getRunningScene().addGui(gui, layerId);
    },
    getGui: function(guiName) {
        return this.getRunningScene().getGui(guiName);
    },
    removeGui: function(guiName) {
        return this.getRunningScene().removeGui(guiName);
    },
    setTouchEnabled: function(enable){
        this.getRunningScene().setTouchEnabled(enable);
    },

    showWaiting: function(bool){
        let gui = this.getGui(GuiWaiting.prototype.className);
        gui && gui.destroy();
        if (bool) {
            this.addGui(new GuiWaiting(),Layer.TOP);
        }
    }
});

SceneMgr.getIns = function(){
    if (!this._sceneMgr) this._sceneMgr = new SceneMgr();
    return this._sceneMgr;
}
