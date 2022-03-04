var GC = {
    ROOM_STATE : {
        LOBBY : 0,
        WAITING_TO_START : 1,
        IN_GAME : 2,
        SHOW_LEADER_BOARD : 3
    },
    // time: ms
    TIME_TO_READY : 2000,
    TIME_SHOW_LEADER_BOARD : 10000,
    RENDER_DELAY : 100,
    TIME_TO_SYNC_CS : 1000/20,
    DT: 1000/60,
    
    // tank
    TANK_MIN_SPEED : 100,
    TANK_MAX_SPEED : 500,

    // effect
    EFFECT_TYPE: {
        HEAL: 0,
        SHIELD: 1
    }
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
    SHOW_LEADER_BOARD: 14
}

export {GC, TYPE_MESSAGE};