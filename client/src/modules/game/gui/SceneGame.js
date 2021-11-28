var SceneGame = BaseScene.extend({
    ctor: function (){
        this._super("res/z_gui/game/GameScene.json");
        this.initGui();
    },

    initGui: function(){

    },

    showWaiting: function(gameStartAt){
        this.guiWaiting = gv.sceneMgr.addGui(new GuiWaitingToStart(),Layer.TOP);
        this.guiWaiting.setTimeToStart(gameStartAt);
    }

})