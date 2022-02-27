
var GameRoom = cc.Class.extend({
    game: null,
    roomState: null,
    ctor: function (){
        gv.gameRoom = this;
    },

    joinNewRoom: function(room){
        this.room = room;
        this.roomState = this.room.state;
        this.gameScene = SceneMgr.getIns().runScene(new SceneGame());
        this.listenMessage();
        this.room.onLeave(this.leave.bind(this));
    },

    listenMessage: function(){
        this.roomState.listen("state",this.handleGameStateChange.bind(this));
        // listen game state update
        this.roomState.game.listen("ts",this.processGameUpdate.bind(this));
        this.room.onMessage(TYPE_MESSAGE.SHOW_LEADER_BOARD,this.showLeaderboard.bind(this));
    },

    handleGameStateChange: function(){
        switch (this.roomState.state) {
            case GC.ROOM_STATE.LOBBY:
                this.showLobby();
                break;
            case GC.ROOM_STATE.WAITING_TO_START:
                this.startWaiting();
                break;
            case GC.ROOM_STATE.IN_GAME:
                this.startGame();
                break;
            case GC.ROOM_STATE.SHOW_LEADER_BOARD:
                this.handleEndGame();
                break;
            default:
                cc.log("unknown state",this.roomState.state);
        }
    },

    initGame: function(){
        this.game = new Game();
        gv.game = this.game;
        this.game.init(this.roomState["mapId"],()=>{
            // init tank
            this.roomState.game.tanks.forEach((tank, playerId) => {
                cc.log("Init tank:",playerId,this.room.sessionId);
                let playerData = this.roomState["players"].get(playerId);
                this.game.addTank(playerData, tank, playerId === this.room.sessionId);
            });
        });
    },

    showLobby: function(){
        this.gameScene.clearScene();
        gv.sceneMgr.addGui(new GuiRoomInfo());
    },

    rejoinGame: function(){
        // todo:
    },

    startWaiting: function(){
        cc.log("Start waiting");
        let gameStartAt = this.roomState.gameStartAt;
        this.gameScene.destroyAllGuis();
        this.gameScene.showWaiting(gameStartAt);
        this.initGame();
    },

    startGame: function () {
        this.gameScene.stopWaiting();
        this.deltaServerTime = Date.now() - this.roomState.game.ts;
        // queue game state
        this.gameUpdates = [];
        this.game.start();
    },

    processGameUpdate: function () {
        if (this.roomState.state !== GC.ROOM_STATE.IN_GAME) return;
        // copy current update
        let currentUpdate = {}, serverResponse = this.roomState.game;
        currentUpdate.ts = serverResponse.ts;
        currentUpdate.tanks = new Map();
        currentUpdate.bullets = [];
        currentUpdate.jetPlanes = [];
        currentUpdate.items = [];
        serverResponse.tanks.forEach((tank, id) => {
            currentUpdate.tanks.set(id, InterpolateObject.getObject(InterpolateObject.Tank,tank));
        });
        serverResponse.bullets.forEach(bullet => {
            currentUpdate.bullets.push(InterpolateObject.getObject(InterpolateObject.Bullet, bullet));
        });
        serverResponse.jetPlanes.forEach(jetPlane => {
            currentUpdate.jetPlanes.push(InterpolateObject.getObject(InterpolateObject.JetPlane, jetPlane));
        });
        serverResponse.items.forEach(item => {
            currentUpdate.items.push(InterpolateObject.getObject(InterpolateObject.Item, item));
        })
        this.gameUpdates.push(currentUpdate);
        // remove old update
        let currentServerTime = this.getServerTime();
        let baseUpdateIndex = this.gameUpdates.lastIndexOf(update => update.ts <= currentServerTime);
        this.gameUpdates.splice(0, baseUpdateIndex);
    },

    handleEndGame: function (){
        this.game.endGame();
        this.gameScene.stopWaiting();
    },

    showLeaderboard: function (data){
        let gui = gv.sceneMgr.addGui(new GuiGameResult());
        gui.showGameResult(data)
        this.game.stop();
    },

    getCurrentGameState() {
        let currentServerTime = this.getServerTime();
        let baseUpdateIndex = this.gameUpdates.lastIndexOf(update => update.ts <= currentServerTime);
        if (baseUpdateIndex < 0) return this.gameUpdates[this.gameUpdates.length - 1];
        else if (baseUpdateIndex === this.gameUpdates.length - 1) return this.gameUpdates[baseUpdateIndex];
        else {
            const baseUpdate = this.gameUpdates[baseUpdateIndex];
            const nextUpdate = this.gameUpdates[baseUpdateIndex + 1];
            let ratio = (currentServerTime - baseUpdateIndex.ts) / (nextUpdate.ts - baseUpdate.ts);
            return this.interpolateGameState(baseUpdate, nextUpdate, ratio);
        }
    },

    getServerTime: function () {
        return Date.now() - this.deltaServerTime - GC.RENDER_DELAY;
    },

    interpolateGameState: function (baseUpdate, nextUpdate, ratio) {
        let interpolateState = {};
        interpolateState.tanks = new Map();
        interpolateState.bullets = [];
        baseUpdate.tanks.forEach((tank,id)=>{
            let nextTank = nextUpdate.tanks.get(id);
            interpolateState.tanks.set(id,InterpolateObject.interpolate(tank,nextTank,ratio));
        });
        let i = 0;
        for (;i<baseUpdate.bullets.length;i++){
            let baseBullet = baseUpdate.bullets[i];
            let nextBullet = nextUpdate.bullets[i];
            interpolateState.bullets.push(InterpolateObject.interpolate(baseBullet,nextBullet,ratio));
        }
        for (;i<nextUpdate.bullets.length;i++){
            interpolateState.bullets.push(nextUpdate.bullets[i]);
        }
        return interpolateState;
    },

    getNetwork: function (){
        return this.room;
    },

    getPlayerDataById: function(playerId){
        return this.roomState["players"].get(playerId);
    },

    getPlayerId: function(){
        return this.room.sessionId;
    },

    leave: function (){
        if (this.game) this.game.stop();
        this.room.leave();
    }
});

GameRoom.getIns = function(){
    if (!this._gameMgr) this._gameMgr = new GameRoom();
    return this._gameMgr;
}