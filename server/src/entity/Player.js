import * as schema from "@colyseus/schema";

export class Player extends schema.Schema {
    constructor(id, username) {
        super();
        this.id = id;
        if (!username || username === "") username = "noname" + Math.round(Math.random() * 10000);
        this.username = username;
        this.setAfk(false);
    }

    isAfk() {
        return this._afk;
    }

    setAfk(bool) {
        this._afk = bool;
    }
}

schema.defineTypes(Player, {
    id: "string",
    username: "string"
});