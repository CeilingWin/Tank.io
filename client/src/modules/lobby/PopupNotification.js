var PopupNotification = BaseGui.extend({
    ctor: function (){
        this.lbMess = null;
        this.btnOk = null;
        this._super("res/z_gui/PopupNotification.json");
        this.setHaveFog(true);
    },

    setNotification: function(str){
        this.lbMess.setString(str);
    },

    setCallFunc: function(func){
        this.func = func;
    },

    onTouchUIEnded: function(sender){
        if (sender === this.btnOk){
            this.func && this.func();
            this.destroy();
        }
    }
});