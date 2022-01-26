var Config = cc.Class.extend({
    ctor: function(){
        cc.loader.loadJson("res/config/default.json",(err,json)=>{
            this.json = json;
        });
    },

    getTankConfig: function(){
        // todo:
        cc.log(this.json);
        return this.json["tanks"][0];
    }
});

Config.getIns = function(){
    if (!this._ins) this._ins = new Config();
    return this._ins;
}