var MatchMaker = cc.Class.extend({
    ctor: function(){
    },

    playNow: function(){
        let username = cc.sys.localStorage.getItem("username");
        SceneMgr.getIns().setTouchEnabled(false);
        gv.network.joinRoom({username: username},this.onJoinNewRoom.bind(this));
    },

    createNewGame: function(gameConfig){
        gameConfig.username = cc.sys.localStorage.getItem("username");
        gv.network.createRoom(gameConfig,this.onJoinNewRoom.bind(this));
    },

    onJoinNewRoom: function (room) {
        cc.log("join room ",room.id);
        GameRoom.getIns().joinNewRoom(room);
    }
});

MatchMaker.getIns = function(){
    if (!this._matchMaker) this._matchMaker = new MatchMaker();
    return this._matchMaker;
}