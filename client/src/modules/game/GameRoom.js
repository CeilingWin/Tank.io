var GameRoom = cc.Class.extend({
    game: null,
    roomState: null,
    ctor: function (){

    },

    joinNewRoom: function(room){
        this.room = room;
        this.roomState = this.room.state;
        SceneMgr.getIns().runScene(new SceneGame());
        this.listenMessage();
        this.initGame();
    },

    listenMessage: function(){
        this.room.onMessage(TYPE_MESSAGE.START_WAITING,this.startWaiting.bind(this));
        this.room.onMessage(TYPE_MESSAGE.START_GAME,this.startGame.bind(this));

        this.room.state.game.onChange = c => {
            cc.log("game state changed",c);
            cc.log("game tick",this.roomState.game.tick);
        }

        this.roomState.onChange = (changes) =>{
            cc.log(changes);
            cc.log("room state:",this.roomState.state);
        }
    },

    initGame: function(){
        switch (this.roomState.state) {
            case GC.ROOM_STATE.LOBBY:
                this.showLobby();
                break;
            case GC.ROOM_STATE.WAITING:
                this.startWaiting();
                break;
            case GC.ROOM_STATE.IN_GAME:
                this.startGame();
                break;
            default:
                cc.log("unknown state",this.roomState.state);
        }
    },

    showLobby: function(){
        cc.log("show lobby");
    },

    rejoinGame: function(){
        // todo:
    },

    startWaiting: function(message){
        cc.log("start waiting", message);
    },

    startGame: function(){
        cc.log("start game");
    }
});

GameRoom.getIns = function(){
    if (!this._gameMgr) this._gameMgr = new GameRoom();
    return this._gameMgr;
}