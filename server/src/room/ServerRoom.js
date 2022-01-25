import {Room} from "@colyseus/core";
import { TYPE_MESSAGE } from "../Constant.js";

export class ServerRoom extends Room {
    onCreate(options){
        this.setPatchRate(null);
        this.players = [];

        this.onMessage("*",this.handleMessage);
    }

    onJoin(client, options){
        this.players.push(client.sessionId);
        console.log("New player connected! Total num player: ",this.players.length);
    }

    onLeave(client, consented) {
        this.players = this.players.filter(p=> p !== client.sessionId);
        console.log("Player ",client.sessionId,"left ! Total num player: ",this.players.length);
    }

    handleMessage(client,type,message){
        switch(type){
            case TYPE_MESSAGE.PING:
                client.send(type);
        }
    }
}