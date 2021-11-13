
var SceneLobby = BaseScene.extend({
    ctor: function(){
        this.btnPlayNow = null;
        this.btnJoin = null;
        this.btnNewGame = null;
        this._super("res/gui/SceneLobby.json");
        this.initGui();
    },

    initGui: function () {
        // test
        cc.log("test colyseus");
        let client = new Colyseus.Client('ws://localhost:2567');
        client.joinOrCreate("my_room").then(room => {
            console.log(room.sessionId, "joined", room.name);
        });
    },

    onTouchUIEnded: function(sender){
        switch (sender){
            case this.btnPlayNow:
                SceneMgr.getIns().runScene(new SceneGame());
                break;
            case this.btnJoin:
                cc.log("join game");
                break;
            case this.btnNewGame:
                cc.log("new game");
                break;
        }
    }
});

SceneLobby.prototype.className = "SceneLobby";