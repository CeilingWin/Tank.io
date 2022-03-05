var GuiNewGame = BaseGui.extend({
    ctor: function(){
        this.tfRoomName = null;
        this.tfNumPlayer = null;
        this.cbPrivateGame = null;
        this.btnCreateNewGame = null;
        this.btnClose = null;
        this.btnNext = null;
        this.btnPrev = null;
        this.sprMap = null;
        this.lbErrorRoomName = null;
        this.lbErrorNumPlayer = null;
        this._super("res/z_gui/GuiNewGame.json");
    },

    initGui: function(){
        GuiUtils.addEventOnHover(this.btnNext,res.COMMON_BG_TF2_PNG,res.COMMON_BG_TF_PNG);
        GuiUtils.addEventOnHover(this.btnPrev,res.COMMON_BG_TF2_PNG,res.COMMON_BG_TF_PNG);
        GuiUtils.addEventOnHover(this.btnClose,res.COMMON_BTN_BACK2_PNG,res.COMMON_BTN_BACK_PNG);
        GuiUtils.addEventOnHover(this.btnCreateNewGame,res.COMMON_BTN_OK2_PNG,res.COMMON_BG_TF2_PNG);
        // init list map
        let numMap = 0;
        while(true){
            let mapId = numMap;
            if (cc.loader.getRes("res/map/map_" + mapId + ".tmx")){
                numMap += 1;
            } else {
                break;
            }
        }
        this.numMap = numMap;
        let mapId = Number(LocalStorage.getMapId());
        this.loadMap(mapId);
        let func = (lb) => {
            lb.setOpacity(0);
            lb.oldPos = lb.getPosition();
        }
        func(this.lbErrorRoomName);
        func(this.lbErrorNumPlayer);
    },

    loadMap: function(mapId){
        this.sprMap.setTexture(ResourceUtils.getMiniMap(mapId));
        this.mapId = mapId;
    },

    onTouchUIEnded: function(sender){
        switch (sender){
            case this.btnClose:
                this.destroy();
                break;
            case this.btnCreateNewGame:
                this.onBtnNewGameClick();
                break;
            case this.btnNext:
                this.loadMap((this.mapId + 1) % this.numMap);
                break;
            case this.btnPrev:
                this.loadMap((this.mapId - 1 + this.numMap) % this.numMap);
                break;
        }
    },

    onBtnNewGameClick: function(){
        if (!this.isValidInput()) return;
        let roomName = this.tfRoomName.getString();
        let numPlayer = Number(this.tfNumPlayer.getString());
        let isPrivate = this.cbPrivateGame.isSelected();
        LocalStorage.setItem("mapId",this.mapId);
        MatchMaker.getIns().createNewGame({
            roomName: roomName,
            maxPlayer: numPlayer,
            isPrivate: isPrivate,
            mapId: Number(this.mapId)
        })
    },

    isValidInput: function (){
        this.disAppearLbError(this.lbErrorNumPlayer);
        this.disAppearLbError(this.lbErrorRoomName);
        let validRoomName = true, validNumPlayers = true;
        if (this.tfRoomName.getString() === "") {
            this.doAppearLbError(this.lbErrorRoomName,"Enter room name");
            validRoomName = false;
        }
        if (this.tfNumPlayer.getString() === "") {
            this.doAppearLbError(this.lbErrorNumPlayer, "Enter num player");
            validNumPlayers = false;
        }
        else {
            let numPlayer = Number(this.tfNumPlayer.getString());
            if (isNaN(numPlayer)) {
                this.doAppearLbError(this.lbErrorNumPlayer,"Invalid num player");
                validNumPlayers = false;
            }
            else if (numPlayer < 2 || numPlayer > 50) {
                this.doAppearLbError(this.lbErrorNumPlayer, "Num player must be between 2 and 50");
                validNumPlayers = false;
            }
        }
        return validNumPlayers && validRoomName;
    },

    disAppearLbError: function (lb){
        lb.stopAllActions();
        lb.setOpacity(0);
    },

    doAppearLbError: function(lbError, message){
        lbError.stopAllActions();
        lbError.setString(message);
        lbError.setOpacity(255);
        lbError.y = lbError.oldPos.y - 20;
        lbError.runAction(cc.sequence(
            cc.moveTo(0.5,lbError.oldPos.x,lbError.oldPos.y).easing(cc.easeBackOut()),
            cc.delayTime(5),
            cc.fadeOut(1)
        ));
    }
});

GuiNewGame.prototype.className = "GuiNewGame";