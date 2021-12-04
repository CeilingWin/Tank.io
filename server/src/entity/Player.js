import * as schema from "@colyseus/schema";

export class Player extends schema.Schema{
    constructor(id,username) {
        super();
        this.id = id;
        if (!username || username === "") username = "noname";
        this.username = username;
    }
}

schema.defineTypes(Player, {
    id : "string",
    username: "string"
});