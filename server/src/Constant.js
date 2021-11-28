var GC = {
    ROOM_STATE : {
        LOBBY : 0,
        WAITING_TO_START : 1,
        IN_GAME : 2
    },
    TIME_TO_READY : 5000,

    DELTA_T : 50 //ms
}

var TYPE_MESSAGE = {
    // SERVER
    PING : 1000,
    // LOBBY
    PLAYER_JOIN : 0,
    PLAYER_LEAVE : 1,
    // CONTROLL GAME
    START_WAITING : 10,
    START_GAME : 11
}

export {GC, TYPE_MESSAGE};