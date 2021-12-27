var GC = {
    ROOM_STATE : {
        LOBBY : 0,
        WAITING_TO_START : 1,
        IN_GAME : 2
    },
    // time: ms
    TIME_TO_READY : 2000,
    RENDER_DELAY : 100,
    TIME_TO_SYNC_CS : 1000/20,
    DT: 1000/60,
    
    // tank
    TANK_SPEED : 500,
}

var TYPE_MESSAGE = {
    // SERVER
    PING : 1000,
    // LOBBY
    PLAYER_JOIN : 0,
    PLAYER_LEAVE : 1,
    // CONTROLL GAME
    START_WAITING : 10,
    START_GAME : 11,
    UPDATE_TANK : 12
}

export {GC, TYPE_MESSAGE};