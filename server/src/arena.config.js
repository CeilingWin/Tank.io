import Arena from "@colyseus/arena";
import { monitor } from "@colyseus/monitor";
import config from "config";
/**
 * Import your Room files
 */
import {GameRoom} from "./room/GameRoom.js";
import { ServerRoom } from "./room/ServerRoom.js";
// config
const gameConfig = config.get("game_config");

export default Arena.default({
    getId: () => "Your Colyseus App",

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer.define('server',ServerRoom);
        gameServer.define('game_room',GameRoom,{
            maxPlayer : gameConfig["default_num_player"],
            mapId: 0
        });
        if (process.env.NODE_ENV !== "production") {
            gameServer.simulateLatency(100);
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
