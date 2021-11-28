var Game = cc.Class.extend({
    ctor: function(){
        cc.log("new game");
        gv.sceneMgr.addGui(new MapLayer());
    },

    start: function(){
        // todo: ...
    }
})