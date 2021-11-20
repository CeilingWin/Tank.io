var SceneGame = BaseScene.extend({
    ctor: function (room){
        this.room = room;
        this._super("res/z_gui/game/GameScene.json");
        this.initGui();
    },

    initGui: function(){
        this.layerWaiting = new LayerWaiting();
        this.layerWaiting.setRoomId(this.room.id);
        // this.getTopLayer().addChild(this.layerWaiting);
        this.room.state.onChange = changes=>{
            cc.log("game state changed!");
            changes.forEach((change,index) => {
                cc.log(index," :");
                cc.log(change.field);
                cc.log(change.value);
                cc.log(change.previousValue);
            });
            this.layerWaiting.setNumPlayers(this.room.state.players.size);
        }
        this.room.state.players.onChange = ()=>{
            cc.log("on player changed");
            this.layerWaiting.setNumPlayers(this.room.state.players.size);
        }

        this.mapLayer = new MapLayer()
        this.addChild(this.mapLayer);
    },

})