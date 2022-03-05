
exports.requestJoinOptions = function (i) {
    return { 
        username: "user" + i 
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