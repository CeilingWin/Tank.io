import { Room } from "@colyseus/core";
import { GameState } from "../schema/GameState.js";
import { Player } from "../entity/Player.js";
import { GC } from "../Constant.js";
export class GameRoom extends Room {
    onCreate(options) {
        this.setPatchRate(null);
        this.setState(new GameState(this));
        this.setSimulationInterval(() => this.state.update(), GC.DELTA_T);
        this.defaultOptions = options;
    }

    async onJoin(client, options) {
        if (this.state.getNumPlayers() === 0) {
            console.log("host ", client.sessionId);
            let maxPlayer = options.maxPlayer || this.defaultOptions.maxPlayer;
            let mapId = options.mapId || this.defaultOptions.mapId;
            this.state.init(maxPlayer, mapId);
            console.log("INIT GAME with options: max player (", maxPlayer, "); mapId(", mapId, ")");
        }
        await this.state.addPlayer(client.sessionId, options.username);
        console.log("PLAYER JOIN GAME: username(", options.username, "); id(", client.sessionId, ")");
        // todo: send player join game
    }

    onLeave(client, consented) {
        // todo:
    }

}