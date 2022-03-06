
exports.requestJoinOptions = function (i) {
    let tankType = "tank" + Math.trunc(Math.random()*3);
    let numSkin;
    switch(tankType){
        case "tank0":
            numSkin = 3;
            break
        case "tank1":
            numSkin = 2;
            break;
        case "tank2":
            numSkin = 5;
            break;
        default:
            numSkin = 2;
    }
    let skin = Math.trunc(Math.random()*numSkin);
    return { 
        username: "user" + i,
        tankType: tankType,
        skin: skin
    };
}

exports.onJoin = function () {
    console.log(this.sessionId, "joined.");

    this.onMessage("*", (type, message) => {
        console.log("onMessage:", type, message);
    });
    setInterval(()=>{
        let tankDir = {x: Math.random()-Math.random(), y: Math.random()-Math.random()};
        let cannonDir = Math.random()*2*Math.PI - Math.PI;
        let isClicked = Math.random()>0.5;
        this.send(12,[tankDir.x,tankDir.y,cannonDir,isClicked])
    },50);

}

exports.onLeave = function () {
    console.log(this.sessionId, "left.");
}

exports.onError = function (err) {
    console.log(this.sessionId, "!! ERROR !!", err.message);
}

exports.onStateChange = function (state) {
}