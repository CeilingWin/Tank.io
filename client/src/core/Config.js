var Config = cc.Class.extend({
    ctor: function(){
        cc.loader.loadJson("res/config/default.json",(err,json)=>{
            this.json = json;
        });
    },

    getTankConfig: function(type){
        return this.json["tanks"].find(cf=>cf["type"]===type);
    },

    getDefaultTank: function(){
        return this.json["room_config"]["default_tank"];
    },

    getDefaultMapId: function(){
        return this.json["room_config"]["default_map"];
    },

    getTanksConfig: function(){
        return this.json["tanks"].map(cf=>{
            cf.bullet = this.json["bullets"].find(b=>b["type"] === cf["bullet_type"]);
            return cf;
        });
    }
});

Config.getIns = function(){
    if (!this._ins) this._ins = new Config();
    return this._ins;
}