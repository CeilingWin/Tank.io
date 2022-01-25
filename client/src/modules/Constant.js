var GC = {
    ROOM_STATE : {
        LOBBY : 0,
        WAITING_TO_START : 1,
        IN_GAME : 2,
        SHOW_LEADER_BOARD : 3
    },
    TIME_TO_READY : 2000,
    RENDER_DELAY : 100,
    TIME_TO_SYNC_CS : 50 //ms
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
    UPDATE_TANK : 12,

    PLAYER_WAS_KILLED: 13,
    SHOW_LEADER_BOARD: 14,
}
