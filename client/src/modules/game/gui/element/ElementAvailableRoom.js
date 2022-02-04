var ElementAvailableRoom = ccui.Layout.extend(_injectCCS).extend({
    ctor: function(roomData){
        this._super();
        this.lbRoomId = null;
        this.lbRoomName = null;
        this.lbMap = null;
        this.lbPlayers = null;
        this.pn = null;
        this.btn = null;
        this.initJson("res/z_gui/game/element/ElementAvailableRoom.json");
        this.load(roomData);
        this.setContentSize(this.pn.getContentSize());
        this.btn.addClickEventListener(this.onClick.bind(this));
        this.setCascadeOpacityEnabled(true);
        GuiUtils.addEventOnHover(this,()=>{
            this.pn.setBackGroundImage(res.COMMON_BG_TF2_PNG);
        },()=>{
            this.pn.setBackGroundImage(res.COMMON_BG_TF_PNG);
        })
    },

    load: function(roomData){
        this.roomId = roomData.roomId;
        this.lbRoomId.setString(roomData.roomId);
        let roomState = roomData.metadata;
        this.lbRoomName.setString(roomState["roomName"]);
        this.lbMap.setString(roomState["mapId"]);
        this.lbPlayers.setString("[n/m]".replace("n",roomData["clients"]).replace("m",roomState["maxPlayer"]));
    },

    onClick: function (){
        MatchMaker.getIns().joinRoomById(this.roomId);
    }
});