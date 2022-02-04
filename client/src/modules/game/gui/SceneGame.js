var SceneGame = BaseScene.extend({
    ctor: function (){
        // this._super("res/z_gui/game/GameScene.json");
        this._super();
        this.initGui();
    },

    initGui: function(){

    },

    showWaiting: function(gameStartAt){
        this.guiWaiting = gv.sceneMgr.addGui(new GuiWaitingToStart(),Layer.TOP);
        this.guiWaiting.setTimeToStart(gameStartAt);
    },

    stopWaiting: function (){
        this.guiWaiting && this.guiWaiting.destroy();
        this.guiWaiting = null;
    },

    clearScene: function(){
        if (gv.gameRoom.game) gv.gameRoom.game.destroyGuiGame();
        this.destroyAllGuis();
    }

})