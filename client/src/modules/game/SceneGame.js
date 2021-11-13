var SceneGame = BaseScene.extend({
    ctor: function (){
        this._super();
    },

    onEnter: function(){
        this._super();
        SceneMgr.getIns().addGui(new MapLayer(),Layer.GUI);
    }
})