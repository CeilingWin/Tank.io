import Arena from "@colyseus/arena";
import { monitor } from "@colyseus/monitor";
/**
 * Import your Room files
 */
import { MyRoom } from "./rooms/MyRoom.js";
import { Lobby } from "./lobby/LobbyRoom.js";

export default Arena.default({
    getId: () => "Your Colyseus App",

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer.define('lobby',Lobby);
        gameServer.define('my_room', MyRoom);
    },

    initializeExpress: (app) => {
        /**
         * Bind your custom express routes here:
         */

        app.get("/", (req, res) => {
            res.sendFile(join(__dirname, '../client', 'index.html'));
        });

        /**
         * Bind @colyseus/monitor
         * It is recommended to protect this route with a password.
         * Read more: https://docs.colyseus.io/tools/monitor/
         */
        app.use("/colyseus", monitor());
    },

    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }

});
