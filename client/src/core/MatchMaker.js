var MatchMaker = cc.Class.extend({
    ctor: function(){
    },

    playNow: function () {
        SceneMgr.getIns().setTouchEnabled(false);
        gv.network.joinRoom(this.mergeOptions({}), this.onJoinNewRoom.bind(this));
    },

    createNewGame: function (gameConfig) {
        gv.network.createRoom(this.mergeOptions(gameConfig), this.onJoinNewRoom.bind(this));
    },

    joinRoomById: function (roomId) {
        gv.network.joinRoomById(roomId,this.mergeOptions({}),this.onJoinNewRoom.bind(this),this.onFindRoomFailed.bind(this));
    },

    getAvailableRooms: function (callback){
        gv.network.getAvailableRooms(callback);
    },

    onJoinNewRoom: function (room) {
        cc.log("join room ", room.id);
        GameRoom.getIns().joinNewRoom(room);
    },

    onFindRoomFailed: function (error){
        let popup = new PopupNotification();
        popup.setNotification(error);
        gv.sceneMgr.addGui(popup);
    },

    mergeOptions: function (option){
        option.username = LocalStorage.getUsername();
        option.tankType = LocalStorage.getTankType();
        option.skin = Number(LocalStorage.getSkin());
        return option;
    }
});

MatchMaker.getIns = function(){
    if (!this._matchMaker) this._matchMaker = new MatchMaker();
    return this._matchMaker;
}