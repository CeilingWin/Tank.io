var BaseGui = cc.Layer.extend(_injectCCS).extend({
    ctor: function (jsonFile){
        this._super();
        // default attr
        this._haveFog = false;
        this.FOG_OPACITY = 200;
        this._isDestroyWhenTouchOutside = false;
        this._listEvent = [];
        // init cocos gui
        this.rootNoe = this.initJson(jsonFile);
        this.addListenerClickOutside();
        this.addFogLayer();
        this.initGui();
    },

    onEnter: function () {
        this._super();
        this.fogLayer.setVisible(this.haveFog());
        this._clickOutsideListener.setEnabled(this.haveFog());
    },

    initGui: function(){
        // override me
    },

    destroy: function () {
        if (this._hasDestroyed) return;
        this._hasDestroyed = true;
        if (this.fogLayer) this.fogLayer.setVisible(false);
        this.removeGui();
    },

    removeGui: function () {
        this.removeAllEvents();
        this._clickOutsideListener = null;
        this.fogLayer = null;
        this.removeFromParent();
    },

    removeAllEvents: function () {
        this._listEvent.forEach(e=>EventCenter.remove(e));
        this._listEvent = [];
    },

    subEvent: function (eventId, listener){
        this._listEvent.push(EventCenter.sub(eventId,listener));
    },

    setHaveFog: function (bool) {
        this._haveFog = bool;
    },

    setDestroyWhenTouchOutside: function (bool) {
        this._isDestroyWhenTouchOutside = bool;
    },

    haveFog: function(){
        return this._haveFog;
    },

    setFogOpacity: function (opacity) {
        this.FOG_OPACITY = opacity;
        this.fogLayer.setOpacity(opacity);
    },

    addFogLayer: function () {
        this.FOG_NAME = "FOG_NAME";
        this.fogLayer = new cc.LayerColor(cc.color(0, 0, 0, 200));
        this.fogLayer.setOpacity(this.FOG_OPACITY);
        this.fogLayer.attr({
            width: cc.winSize.width,
            height: cc.winSize.height
        });
        this.fogLayer.setName(this.FOG_NAME);
        this.addChild(this.fogLayer, -1);
    },

    addListenerClickOutside: function () {
        //using to prevent all touch of behind GUI
        this._clickOutsideListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                return true;
            }.bind(this),
            onTouchMoved: function () { },
            onTouchEnded: function (touch, event) {
                if (this._isDestroyWhenTouchOutside) {
                    var checkTouchOnChildOf = function (parent, touch) {
                        if (!parent) {
                            return false;
                        }
                        var child, locationInNode, size, rect, listChild;
                        listChild = parent.getChildren();
                        if (!listChild) {
                            return false;
                        }
                        var len = listChild.length;
                        var touchOnChild = false;
                        for (var i = 0; i < len; ++i) {
                            child = listChild[i];
                            if (child && child.getName() != this.FOG_NAME && child.visible) {
                                locationInNode = child.convertToNodeSpace(touch.getLocation());
                                size = child.getContentSize();
                                rect = cc.rect(0, 0, size.width, size.height);
                                if (cc.rectContainsPoint(rect, locationInNode)) {
                                    touchOnChild = true;
                                } else {
                                    touchOnChild = checkTouchOnChildOf(child, touch);
                                }
                                if (touchOnChild) {
                                    return true;
                                }
                            }
                        }
                        return touchOnChild;
                    }.bind(this);
                    if (!checkTouchOnChildOf(this._rootNode || this, touch)) {
                        this.destroy();
                    } else {
                        cc.log("touch on child");
                    }
                }
            }.bind(this)
        });
        cc.eventManager.addListener(this._clickOutsideListener, this);
    },

    setTimeOut: function (delay, funcObj) {
        return this.runAction(cc.sequence(
            cc.delayTime(delay),
            cc.callFunc(funcObj)
        ));
    },
})