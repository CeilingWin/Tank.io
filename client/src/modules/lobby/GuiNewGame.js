var GuiNewGame = BaseGui.extend({
    ctor: function(){
        this.tfRoomName = null;
        this.tfNumPlayer = null;
        this.cbPrivateGame = null;
        this.btnCreateNewGame = null;
        this.btnClose = null;
        this._super("res/z_gui/GuiNewGame.json");
    },

    initGui: function(){

    },

    onTouchUIEnded: function(sender){
        switch (sender){
            case this.btnClose:
                this.destroy();
                break;
            case this.btnCreateNewGame:
                this.onBtnNewGameClick();
                break;
        }
    },

    onBtnNewGameClick: function(){
        let roomName = this.tfRoomName.getString();
        let numPlayer = Number(this.tfNumPlayer.getString());
        let isPrivate = this.cbPrivateGame.isSelected();
        // todo: map id
        // todo: check input
        MatchMaker.getIns().createNewGame({
            roomName: roomName,
            maxPlayer: numPlayer,
            isPrivate: isPrivate
        })
    }
});

GuiNewGame.prototype.className = "GuiNewGame";