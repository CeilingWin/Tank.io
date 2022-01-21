
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
    },

    listenMessage: function(){
        this.roomState.listen("state",this.handleGameStateChange.bind(this));
        // listen game state update
        this.roomState.game.listen("ts",this.processGameUpdate.bind(this));
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
            default:
                cc.log("unknown state",this.roomState.state);
        }
    },

    initGame: function(){
        cc.log("Init game!");
        this.game = new Game();
        gv.game = this.game;
        this.game.init(this.roomState["mapId"]);
        // init tank
        this.roomState.game.tanks.forEach((tank, playerId) => {
            cc.log("Init tank:",playerId,this.room.sessionId);
            this.game.addTank(playerId, tank, playerId === this.room.sessionId);
        });
        this.deltaServerTime = Date.now() - this.roomState.game.ts;
        // queue game state
        this.gameUpdates = [];
    },

    showLobby: function(){
        cc.log("show lobby");
    },

    rejoinGame: function(){
        // todo:
    },

    startWaiting: function(){
        cc.log("Start waiting");
        let gameStartAt = this.roomState.gameStartAt;
        this.gameScene.destroyAllGuis();
        this.gameScene.showWaiting(gameStartAt);
    },

    startGame: function () {
        this.gameScene.stopWaiting();
        if (!this.game) this.initGame();
        this.game.start();
    },

    processGameUpdate: function () {
        if (!this.game) this.initGame();
        // copy current update
        let currentUpdate = {}, serverResponse = this.roomState.game;
        currentUpdate.ts = serverResponse.ts;
        currentUpdate.tanks = new Map();
        currentUpdate.bullets = [];
        serverResponse.tanks.forEach((tank, id) => {
            currentUpdate.tanks.set(id, {
                x: tank.x,
                y: tank.y,
                direction: tank.direction,
                cannonDirection: tank.cannonDirection,
                active: tank.active
            });
        });
        serverResponse.bullets.forEach(bullet => {
            currentUpdate.bullets.push({
                x: bullet.x,
                y: bullet.y,
                direction: bullet.direction,
                active: bullet.active
            });
        });
        this.gameUpdates.push(currentUpdate);
        // remove old update
        let currentServerTime = this.getServerTime();
        let baseUpdateIndex = this.gameUpdates.lastIndexOf(update => update.ts <= currentServerTime);
        this.gameUpdates.splice(0, baseUpdateIndex);
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
            interpolateState.tanks.set(id,{
                x: this._interpolatePosition(tank.x,nextTank.x,ratio),
                y: this._interpolatePosition(tank.y,nextTank.y,ratio),
                direction: this._interpolateAngle(tank.direction,nextTank.direction,ratio),
                cannonDirection: this._interpolateAngle(tank.cannonDirection,nextTank.cannonDirection,ratio),
                active: this._interpolateBoolean(tank.active,nextTank.active,ratio)
            });
        });
        let i = 0;
        for (;i<baseUpdate.bullets.length;i++){
            let baseBullet = baseUpdate.bullets[i];
            let nextBullet = nextUpdate.bullets[i];
            interpolateState.bullets.push({
                x: this._interpolatePosition(baseBullet.x, nextBullet.x, ratio),
                y: this._interpolatePosition(baseBullet.y, nextBullet.y, ratio),
                active: this._interpolateBoolean(baseBullet.active, nextBullet.active, ratio)
            });
        }
        for (;i<nextUpdate.bullets.length;i++){
            interpolateState.bullets.push(nextUpdate.bullets[i]);
        }
        return interpolateState;
    },

    _interpolatePosition: function (p1, p2, ratio) {
        return p1 + (p2 - p1) * ratio;
    },

    _interpolateAngle: function (a1, a2, ratio) {
        let deltaA = Math.abs(a2 - a1);
        if (deltaA < Math.PI) {
            return a1 + (a2 - a1) * ratio;
        } else {
            if (a1 > a2) return a1 + (Math.PI - deltaA) * ratio;
            else return a1 - (Math.PI - deltaA) * ratio;
        }
    },

    _interpolateBoolean: function (b1, b2, ratio){
        if (ratio < 0.99) return b1;
        return b2;
    },

    getNetwork: function (){
        return this.room;
    },

    getPlayerDataById: function(playerId){
        return this.roomState["players"].get(playerId);
    }
});

GameRoom.getIns = function(){
    if (!this._gameMgr) this._gameMgr = new GameRoom();
    return this._gameMgr;
}