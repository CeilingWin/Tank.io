var MatchMaker = cc.Class.extend({
    ctor: function(){
    },

    playNow: function () {
        let username = LocalStorage.getUsername();
        SceneMgr.getIns().setTouchEnabled(false);
        gv.network.joinRoom({username: username}, this.onJoinNewRoom.bind(this));
    },

    createNewGame: function (gameConfig) {
        gameConfig.username = LocalStorage.getUsername();
        gv.network.createRoom(gameConfig, this.onJoinNewRoom.bind(this));
    },

    joinRoomById: function (roomId) {
        let options = {
            username: LocalStorage.getUsername()
        }
        gv.network.joinRoomById(roomId,options,this.onJoinNewRoom.bind(this),this.onFindRoomFailed.bind(this));
    },

    getAvailableRooms: function (callback){
        gv.network.getAvailableRooms(callback);
    },

    onJoinNewRoom: function (room) {
        cc.log("join room ", room.id);
        GameRoom.getIns().joinNewRoom(room);
    },

    onFindRoomFailed: function (error){
        cc.log("Find room failed",error);
        // todo: show error
    },
});

MatchMaker.getIns = function(){
    if (!this._matchMaker) this._matchMaker = new MatchMaker();
    return this._matchMaker;
}