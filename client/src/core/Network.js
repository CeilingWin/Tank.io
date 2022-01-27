var ROOM_DEFINE = "game_room"
var Network = cc.Class.extend({
    ctor: function (){
        this.connection = new Colyseus.Client('ws://localhost:2567');
        this.pingInterval = 2000;
    },

    connectServer: function(){
        this.connection.joinOrCreate("server").then((room)=>{
            this.serverRoom = room;
            cc.director.runScene(new SceneLobby());
            this.listenServerResponse();
            this.pingToServer();
            setInterval(this.pingToServer.bind(this),this.pingInterval);
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

