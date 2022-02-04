var GuiWaitingToStart = BaseGui.extend({
    ctor: function (){
        this.lbTimeRemaining = null;
        this._super("res/z_gui/game/GuiWaitingToStart.json");
        this.setHaveFog(true);
        this.setFogOpacity(150);
    },

    setTimeToStart: function (gameStartAt){
        this.gameStartAt = gameStartAt;
        this.schedule(this.updateCountDown.bind(this),0.1);
    },

    updateCountDown: function () {
        let currentTime = Date.now();
        let timeRemaining = Math.round(this.gameStartAt - currentTime);
        timeRemaining = Math.max(0,timeRemaining);
        timeRemaining = Math.round(timeRemaining/1000);
        if (timeRemaining !== this.lastScond){
            this.lbTimeRemaining.setString(timeRemaining);
            this.lastScond = timeRemaining;
        }
    }
})