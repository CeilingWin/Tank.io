var MatchMaker = cc.Class.extend({
    ctor: function(){
    },

    playNow: function(username){
        cc.sys.localStorage.setItem("username",username);
        SceneMgr.getIns().setTouchEnabled(false);
        gv.network.joinRoom("game_room",{username: username},this.onJoinNewRoom.bind(this));
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