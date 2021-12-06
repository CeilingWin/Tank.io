var Input = cc.Class.extend({
    tankDir: cc.p(0,0),
    cannonDir: cc.p(1,0),
    mousePos: cc.p(0,0),
    touched: false,
    keyListener: null,
    mouseListener: null,
    ctor: function (){

    },

    start: function(){
        this.target = gv.sceneMgr.getRunningScene();
        this.initKeyListener();
        this.initMouseListener();
        this.initTouchListener();
    },

    initKeyListener: function(){
        this.keyListener = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (event) {
                cc.log("on pressed",event);
            },
            onKeyReleased: function (event) {
                cc.log("on released",event);
            }
        })
        cc.eventManager.addListener(this.keyListener,this.target);
        this.stop();
        this.stop();
    },
    
    initTouchListener: function(){
        this.touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function (event) {
                this.touched = true;
                cc.log("touch began");
            },
            onTouchEnded: function (event) {
                this.touched = false;
                cc.log("touch end");
            }
        });
        cc.eventManager.addListener(this.touchListener,this.target);
    },

    initMouseListener: function(){
        this.mouseListener = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            onMouseMove: function (event) {
                this.mousePos = event.getLocation();
            }
        });
        cc.eventManager.addListener(this.mouseListener,this.target);
    },

    stop: function(){
        this._removeListener(this.keyListener);
        this._removeListener(this.mouseListener);
        this._removeListener(this.touchListener);
    },

    _removeListener: function (listener){
        listener && cc.eventManager.removeListener(listener);
    }
})