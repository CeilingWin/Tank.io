var MatchMaker = cc.Class.extend({
    ctor: function(){
    },

    playNow: function () {
        let username = this._getUsername();
        SceneMgr.getIns().setTouchEnabled(false);
        gv.network.joinRoom({username: username}, this.onJoinNewRoom.bind(this));
    },

    createNewGame: function (gameConfig) {
        gameConfig.username = this._getUsername();
        gv.network.createRoom(gameConfig, this.onJoinNewRoom.bind(this));
    },

    joinRoomById: function (roomId) {
        let options = {
            username: this._getUsername()
        }
        gv.network.joinRoomById(roomId,options,this.onJoinNewRoom.bind(this),this.onFindRoomFailed.bind(this));
    },

    onJoinNewRoom: function (room) {
        cc.log("join room ", room.id);
        GameRoom.getIns().joinNewRoom(room);
    },

    onFindRoomFailed: function (error){
        cc.log("Find room failed",error);
        // todo: show error
    },

    _getUsername: function () {
        return cc.sys.localStorage.getItem("username");
    }
});

MatchMaker.getIns = function(){
    if (!this._matchMaker) this._matchMaker = new MatchMaker();
    return this._matchMaker;
}