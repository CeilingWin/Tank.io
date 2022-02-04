var GuiNewGame = BaseGui.extend({
    ctor: function(){
        this.tfRoomName = null;
        this.tfNumPlayer = null;
        this.cbPrivateGame = null;
        this.btnCreateNewGame = null;
        this.btnClose = null;
        this.btnNext = null;
        this.btnPrev = null;
        this._super("res/z_gui/GuiNewGame.json");
    },

    initGui: function(){
        GuiUtils.addEventOnHover(this.btnNext,res.COMMON_BG_TF2_PNG,res.COMMON_BG_TF_PNG);
        GuiUtils.addEventOnHover(this.btnPrev,res.COMMON_BG_TF2_PNG,res.COMMON_BG_TF_PNG);
        GuiUtils.addEventOnHover(this.btnClose,res.COMMON_BTN_BACK2_PNG,res.COMMON_BTN_BACK_PNG);
        GuiUtils.addEventOnHover(this.btnCreateNewGame,res.COMMON_BTN_OK2_PNG,res.COMMON_BG_TF2_PNG);
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