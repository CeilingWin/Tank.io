import {LobbyRoom} from "@colyseus/core";
import {LobbyState} from "./LobbyState.js";

export class Lobby extends LobbyRoom {
    onCreate(options){
        this.setState(new LobbyState());
    }

    onJoin(client, options){
        console.log(options);
        client.send(1,{
            mess: "hello"
        });
        this.state.addPlayer(client.sessionId,options.name);
        console.log(this.state);
        console.log(this.state);
    }

}