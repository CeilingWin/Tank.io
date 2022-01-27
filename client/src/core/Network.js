var ROOM_DEFINE = "game_room"
var Network = cc.Class.extend({
    ctor: function (){
        this.connection = new Colyseus.Client('ws://localhost:2567');
        this.pingInterval = 2000;
    },

    connectServer: function(){
        gv.sceneMgr.setTouchEnabled(false);
        this.connection.joinOrCreate("server").then((room)=>{
            this.serverRoom = room;
            if (gv.sceneMgr.getCurSceneName() !== SceneLobby.prototype.className){
                gv.sceneMgr.runScene(new SceneLobby());
            }
            this.listenServerResponse();
            this.pingToServer();
            setInterval(this.pingToServer.bind(this),this.pingInterval);
            gv.sceneMgr.setTouchEnabled(true);
            this.serverRoom.onLeave(()=>{
                gv.sceneMgr.setTouchEnabled(true);
                this.serverRoom = null;
                let popup = gv.sceneMgr.addGui(new PopupNotification());
                popup.setNotification("Lost connection to server. Reconnect?");
                popup.setCallFunc(this.connectServer.bind(this));
            })
        }).catch((err)=>{
            gv.sceneMgr.setTouchEnabled(true);
            let popup = gv.sceneMgr.addGui(new PopupNotification());
            popup.setNotification("Connect to server failed. Reconnect?");
            popup.setCallFunc(this.connectServer.bind(this));
        });
    },

    listenServerResponse: function(){
        this.serverRoom.onMessage(TYPE_MESSAGE.PING,this.onPingSuccess.bind(this));
    },

    joinRoom: function (options,callback) {
        this.connection.joinOrCreate(ROOM_DEFINE,options).then(callback);
    },

    createRoom: function (options,callback){
        this.connection.create(ROOM_DEFINE,options).then(callback);
    },

    joinRoomById: function (roomId,options,callback,catcher){
        this.connection.joinById(roomId,options).then(callback).catch(catcher);
    },

    getAvailableRooms: function (callback){
        this.connection.getAvailableRooms(ROOM_DEFINE).then(callback);
    },
    
    pingToServer: function () {
        if (!this.serverRoom) return;
        this.timeSentPing = Date.now();
        this.serverRoom.send(TYPE_MESSAGE.PING);
    },

    onPingSuccess: function(){
        let currentTime = Date.now();
        this.ping = currentTime - this.timeSentPing;
    },

    getPing: function(){
        return this.ping;
    }
});

