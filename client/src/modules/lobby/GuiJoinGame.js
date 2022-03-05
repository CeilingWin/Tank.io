var GuiJoinGame = BaseGui.extend({
    ctor: function(){
        this.tfRoomId = null;
        this.btnFindRoom = null;
        this.btnClose = null;
        this.lvRooms = null;
        this.lbEmpty = null;
        this.btnRefresh = null;
        this.lbError = null;
        this._super("res/z_gui/GuiJoinGame.json");
    },

    initGui: function(){
        MatchMaker.getIns().getAvailableRooms(this.reloadAvailableRooms.bind(this));
        GuiUtils.addEventOnHover(this.btnFindRoom,res.COMMON_RECTANGLE_SELECTED_PNG,res.COMMON_RECTANGLE_PNG);
        GuiUtils.addEventOnHover(this.btnClose,res.COMMON_BTN_BACK2_PNG,res.COMMON_BTN_BACK_PNG);
        GuiUtils.addEventOnHover(this.btnRefresh,res.COMMON_BTN_OK2_PNG,res.COMMON_BG_TF2_PNG);
        this.lbError.setOpacity(0);
        this.lbError.oldPos = this.lbError.getPosition();
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
        if (roomId === ""){
            this.lbError.stopAllActions();
            this.lbError.setOpacity(255);
            this.lbError.y -= 20;
            this.lbError.runAction(cc.sequence(
                cc.moveTo(0.5,this.lbError.oldPos.x,this.lbError.oldPos.y).easing(cc.easeBackOut()),
                cc.delayTime(5),
                cc.fadeOut(1)
            ));
        } else {
            MatchMaker.getIns().joinRoomById(roomId);
        }
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