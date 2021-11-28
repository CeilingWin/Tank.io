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

    joinRoom: function (roomName,options,callback) {
        this.connection.joinOrCreate(roomName,options).then(callback);
    },
    
    pingToServer: function () {
        this.timeSentPing = Date.now();
        this.serverRoom.send(TYPE_MESSAGE.PING);
    },

    onPingSuccess: function(){
        let currentTime = Date.now();
        this.ping = Math.round((currentTime - this.timeSentPing)/2);
    },

    getPing: function(){
        return this.ping;
    }
});

