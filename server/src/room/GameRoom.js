import { Room } from "@colyseus/core";
import { GameState } from "../schema/GameState.js";
import { Player } from "../entity/Player.js";
import { GC } from "../Constant.js";
import { GameConfig } from "../config/GameConfig.js";
var roomConfig = GameConfig.getRoomConfig();
export class GameRoom extends Room {
    static numRoom = 0;
    onCreate(options) {
        this.setPatchRate(GC.TIME_TO_SYNC_CS);
        this.setState(new GameState(this));
        this.setSimulationInterval(() => this.state.update(), GC.DT);
        this.defaultOptions = options;
        GameRoom.numRoom += 1;
    }

    onJoin(client, options) {
        if (this.state.getNumPlayers() === 0) {
            this.loadGameOptions(client,options);
        } 
        this.state.addPlayer(client.sessionId, options.username);
        console.log("PLAYER JOIN GAME: username(", options.username, "); id(", client.sessionId, ")");
        // todo: send player join game
    }

    loadGameOptions(client, options){
        let maxPlayer = options.maxPlayer || this.defaultOptions.maxPlayer;
        let mapId = options.mapId || this.defaultOptions.mapId;
        let isPrivate = options.isPrivate || this.defaultOptions.isPrivate;
        let roomName = options.roomName || this.defaultOptions.roomName;
        if (isPrivate) this.lock();
        if (!roomName) roomName = "Room" + GameRoom.numRoom;
        if (maxPlayer < this.defaultOptions.maxPlayer) maxPlayer = this.defaultOptions.maxPlayer;
        maxPlayer = Math.min(maxPlayer,roomConfig["max_player"]);
        this.state.init(roomName, maxPlayer, mapId);
        console.log("INIT GAME : ", {
            roomName: roomName,
            maxPlayer: maxPlayer,
            mapId: mapId,
            isPrivate: isPrivate,
            host: client.sessionId
        });
    }

    onLeave(client, consented) {
        // todo:
    }

}