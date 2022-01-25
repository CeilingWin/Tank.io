var GuiJoinGame = BaseGui.extend({
    ctor: function(){
        this.tfRoomId = null;
        this.btnFindRoom = null;
        this.btnClose = null;
        this.lvRooms = null;
        this.lbEmpty = null;
        this.btnRefresh = null;
        this._super("res/z_gui/GuiJoinGame.json");
    },

    initGui: function(){

    },

    onTouchUIEnded: function(sender){
        switch (sender){
            case this.btnClose:
                this.destroy();
                break;
            case this.btnFindRoom:
                this.onBtnFindRoomClick();
                break;
        }
    },

    onBtnFindRoomClick: function(){
        let roomId = this.tfRoomId.getString().toUpperCase();
        MatchMaker.getIns().joinRoomById(roomId);
    }
});

GuiJoinGame.prototype.className = "GuiJoinGame";