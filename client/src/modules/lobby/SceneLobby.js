
var SceneLobby = BaseScene.extend({
    ctor: function(){
        this.btnPlayNow = null;
        this.btnJoin = null;
        this.btnNewGame = null;
        this.tfUserName = null;
        this._super("res/z_gui/SceneLobby.json");
    },

    initGui: function () {
        // test
        cc.log("test colyseus");
        let client = new Colyseus.Client('ws://localhost:2567');
        client.joinOrCreate("lobby",{
            name: this.tfUserName.getString()
        }).then(room => {
            console.log(room.sessionId, "joined", room.name);
            let sw = new SceneWaitingGame();
            sw.setRoom(room);
            SceneMgr.getIns().addGui(sw);
        });
    },


    onTouchUIEnded: function(sender){
        switch (sender){
            case this.btnPlayNow:
                SceneMgr.getIns().runScene(new SceneGame());
                break;
            case this.btnJoin:
                this.initGui();
                cc.log("join game");
                break;
            case this.btnNewGame:
                cc.log("new game");
                break;
        }
    }
});

SceneLobby.prototype.className = "SceneLobby";