import * as schema from "@colyseus/schema";

export class Player extends schema.Schema {
    constructor(username,id){
        super();
        this.username = username;
        this.id = id;
    }

    // get username(){
    //     return this.username;
    // }

    // get id(){
    //     return this.id;
    // }
}

schema.defineTypes(Player,{
    username: "string",
    id: "string"
})