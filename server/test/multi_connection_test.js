import { ColyseusTestServer, boot } from "@colyseus/testing";
import { describe } from "mocha";
import  arenaConfig  from "../src/arena.config.js";
import assert from "assert";

describe("testing multi connection", () => {
    let colyseus;
    before(async () => colyseus = await boot(arenaConfig));
    after(async () => colyseus.shutdown());
  
    beforeEach(async () => await colyseus.cleanup());
  
    it("connecting into a room", async() => {
      // `room` is the server-side Room instance reference.
      const room = await colyseus.createRoom("game_room");
      const client1 = await colyseus.connectTo(room,{
        maxPlayer:21,
        mapId:1
      });
      for (let i=0;i<20;i++){
        const client = await colyseus.connectTo(room,{
          username: "un" + i
        });
      }
      // `client1` is the client-side `Room` instance reference (same as JavaScript SDK)
      // make your assertions
      assert.strictEqual(client1.sessionId, room.clients[0].sessionId);
    });
  });