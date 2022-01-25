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
        MatchMaker.getIns().getAvailableRooms(this.reloadAvailableRooms.bind(this));
    },

    onTouchUIEnded: function(sender){
        switch (sender){
            case this.btnClose:
                this.destroy();
                break;
            case this.btnFindRoom:
                this.onBtnFindRoomClick();
                break;
            case this.btnRefresh:
                MatchMaker.getIns().getAvailableRooms(this.reloadAvailableRooms.bind(this));
                break;
        }
    },

    onBtnFindRoomClick: function(){
        let roomId = this.tfRoomId.getString().toUpperCase();
        MatchMaker.getIns().joinRoomById(roomId);
    },

    reloadAvailableRooms: function(rooms){
        if (rooms.length === 0) {
            this.lbEmpty.setVisible(true);
            this.lvRooms.setVisible(false);
        } else {
            this.lbEmpty.setVisible(false);
            this.lvRooms.setVisible(true);
            this.lvRooms.removeAllChildren();
            rooms.forEach(room =>{
                this.lvRooms.pushBackCustomItem(new ElementAvailableRoom(room));
            });
        }
    }
});

GuiJoinGame.prototype.className = "GuiJoinGame";