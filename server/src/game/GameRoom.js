import {Room} from "@colyseus/core";
import {GameState} from "../schema/GameState.js";
import {Player} from "../schema/Player.js";
export class GameRoom extends Room {
    onCreate(options){
        this.setState(new GameState());
        this.setSimulationInterval(()=>this.state.update());
    }

    onJoin(client, options){
        this.state.addPlayer(client.sessionId,options.username);
    }

    onLeave(client, consented) {
        // todo:
    }

}