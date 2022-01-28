var LocalStorage = {
    getUsername: function () {
        return cc.sys.localStorage.getItem("username") || "";
    },

    getTankType: function (){
        return cc.sys.localStorage.getItem("tankType") || Config.getIns().getDefaultTank();
    },

    getSkin: function(){
        return cc.sys.localStorage.getItem("skin") || 0;
    },

    setItem: function (key, value){
        cc.sys.localStorage.setItem(key, value);
    }
}