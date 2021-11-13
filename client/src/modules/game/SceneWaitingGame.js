var SceneWaitingGame = BaseGui.extend({
    ctor: function (){
        this._super("res/z_gui/game/SceneWatingGame.json");
        this.setHaveFog(true);
        this.setFogOpacity(255);
    },

    setRoom: function (room) {
        this.room = room;
        cc.log(room.state);
        room.onMessage("rooms", (rooms) => {
            cc.log(rooms);
        });
        room.onMessage(1,(mess)=>{
            cc.log("server send ",mess);
        })
    }
})