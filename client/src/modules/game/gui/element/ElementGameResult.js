var ElementGameResult = ccui.Layout.extend(_injectCCS).extend({
    ctor: function(rank, data, isMe){
        this._super();
        this.lbRank = null;
        this.lbName = null;
        this.lbKills = null;
        this.lbDamage = null;
        this.pn = null;
        this.initJson("res/z_gui/game/element/ElementGameResult.json");
        this.load(rank, data, isMe);
        this.setContentSize(this.pn.getContentSize());
    },

    load: function(rank, data, isMe){
        this.lbRank.setString(rank);
        this.lbName.setString(data["username"]);
        this.lbKills.setString(data["kills"]);
        this.lbDamage.setString(data["totalDamage"]);
        if (isMe){
            this.pn.setBackGroundImage(res.COMMON_BG_TF2_PNG);
        } else {
            this.pn.setBackGroundImage(res.COMMON_BG_TF_PNG);
        }
    }
})