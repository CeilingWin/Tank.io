
var GameRoom = cc.Class.extend({
    game: null,
    roomState: null,
    ctor: function (){
        gv.gameRoom = this;
    },

    joinNewRoom: function(room){
        this.room = room;
        this.roomState = this.room.state;
        this.gameScene = SceneMgr.getIns().runScene(new SceneGame());
        this.listenMessage();
    },

    listenMessage: function(){
        this.room.onMessage(TYPE_MESSAGE.START_WAITING,this.startWaiting.bind(this));
        this.room.onMessage(TYPE_MESSAGE.START_GAME,this.startGame.bind(this));

        this.roomState.listen("state",this.handleGameStateChange.bind(this));
        // listen game state update
        this.roomState.game.listen("ts",this.processGameUpdate.bind(this));
    },

    sendToServer: function(typeMessage,data){
        this.room.send(typeMessage,data);
    },

    handleGameStateChange: function(){
        switch (this.roomState.state) {
            case GC.ROOM_STATE.LOBBY:
                this.showLobby();
                break;
            case GC.ROOM_STATE.WAITING_TO_START:
                this.startWaiting();
                break;
            case GC.ROOM_STATE.IN_GAME:
                this.startGame();
                break;
            default:
                cc.log("unknown state",this.roomState.state);
        }
    },

    initGame: function(){
        this.game = new Game();
        gv.game = this.game;
        this.game.init(this.roomState.mapId);
        // init tank
        this.roomState.game.tanks.forEach((tank,playerId)=>{
            this.game.addTank(playerId,tank, playerId === this.room.sessionId);
        })
    },

    showLobby: function(){
        cc.log("show lobby");
    },

    rejoinGame: function(){
        // todo:
    },

    startWaiting: function(){
        cc.log("start waiting");
        let gameStartAt = this.roomState.gameStartAt;
        cc.log(this.roomState);
        this.gameScene.destroyAllGuis();
        this.initGame();
        this.gameScene.showWaiting(gameStartAt);
    },

    startGame: function(){
        this.gameScene.stopWaiting();
        if (!this.game) this.initGame();
        this.game.start();
    },

    processGameUpdate: function(){
        this.roomState.game.tanks.forEach(tank=>{
            this.game.tanks[0].setPosition(tank.x,tank.y);
            this.game.tanks[0].setRotation(tank.direction/Math.PI*180);
            cc.log(tank.direction/Math.PI*180);
        })
    }

});

GameRoom.getIns = function(){
    if (!this._gameMgr) this._gameMgr = new GameRoom();
    return this._gameMgr;
}