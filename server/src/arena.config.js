import Arena from "@colyseus/arena";
import { monitor } from "@colyseus/monitor";
/**
 * Import your Room files
 */
import {GameRoom} from "./game/GameRoom.js";

export default Arena.default({
    getId: () => "Your Colyseus App",

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer.define('game_room',GameRoom);
        if (process.env.NODE_ENV !== "production") {
            gameServer.simulateLatency(2000);
        }
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
