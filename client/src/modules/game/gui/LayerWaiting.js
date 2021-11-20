var LayerWaiting = BaseGui.extend({
    ctor: function (){
        this.sprLoading = null;
        this.lbRoomId = null;
        this.lbNumPlayer = null;
        this._super("res/z_gui/game/LayerWaiting.json");
        this.setHaveFog(true);
        this.setFogOpacity(200);
    },

    initGui: function(){
        this.sprLoading.runAction(cc.rotateBy(8,360).repeatForever());
    },

    setRoomId: function (roomId) {
        this.lbRoomId.setString("Room ID: " + roomId);
    },

    setNumPlayers: function (numPlayers) {
        this.lbNumPlayer.setString(numPlayers);
    }
})