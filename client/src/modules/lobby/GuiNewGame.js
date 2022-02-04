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
        let roomName = this.tfRoomName.getString();
        let numPlayer = Number(this.tfNumPlayer.getString());
        let isPrivate = this.cbPrivateGame.isSelected();
        LocalStorage.setItem("mapId",this.mapId);
        // todo: check input
        MatchMaker.getIns().createNewGame({
            roomName: roomName,
            maxPlayer: numPlayer,
            isPrivate: isPrivate,
            mapId: Number(this.mapId)
        })
    }
});

GuiNewGame.prototype.className = "GuiNewGame";