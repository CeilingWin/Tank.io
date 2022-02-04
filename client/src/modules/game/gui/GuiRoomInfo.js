var GuiRoomInfo = BaseGui.extend({
    ctor: function(){
        this.lbRoomId = null;
        this.lbNumPlayer = null;
        this.lbRoomName = null;
        this.sprLoading = null;
        this.btnCancel = null;
        this._super("res/z_gui/game/GuiRoomInfo.json");
        gv.gameRoom.roomState["players"].onAdd = this.updateNumPlayer.bind(this);
        gv.gameRoom.roomState["players"].onRemove = this.updateNumPlayer.bind(this);
    },

    initGui: function(){
        this.roomState = gv.gameRoom.roomState;
        this.lbRoomId.setString("Room ID: " + gv.gameRoom.getNetwork().id);
        this.lbRoomName.setString("Room name: " + this.roomState["roomName"]);
        this.updateNumPlayer();
        this.sprLoading.runAction(cc.rotateBy(6,360).repeatForever());
        GuiUtils.addEventOnHover(this.btnCancel,res.COMMON_BTN_BACK2_PNG,res.COMMON_BTN_BACK_PNG);
    },

    updateNumPlayer: function (){
        this.lbNumPlayer.setString("Players: " + this.roomState["players"].size + "/" + this.roomState["maxPlayer"]);
    },

    onTouchUIEnded: function (sender){
        switch (sender){
            case this.btnCancel:
                gv.gameRoom.leave();
                gv.sceneMgr.runScene(new SceneLobby());
                break;
        }
    }
});

GuiRoomInfo.prototype.className = "GuiRoomInfo";