var MatchMaker = cc.Class.extend({
    ctor: function(){
       this.client = new Colyseus.Client('ws://localhost:2567');
    },

    playNow: function(playerName){
        SceneMgr.getIns().setTouchEnabled(false);
        this.client.joinOrCreate("game_room",{name: playerName}).then(this.onJoinNewRoom.bind(this));
    },

    onJoinNewRoom: function (room) {
        cc.log("join room ",room.id);
        SceneMgr.getIns().runScene(new SceneGame(room));
    }
});

MatchMaker.getIns = function(){
    if (!this._matchMaker) this._matchMaker = new MatchMaker();
    return this._matchMaker;
}