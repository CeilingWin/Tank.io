var Input = cc.Class.extend({
    mousePos: cc.p(0,0),
    touched: false,
    _isClicked: false,
    ctor: function (){
        this.keyDir = {
            up: false,
            down: false,
            right: false,
            left: false
        }
    },

    getDirection: function (){
        let direction = cc.p(0,0);
        if (this.keyDir.up) direction = cc.pAdd(direction,cc.p(0,1));
        if (this.keyDir.down) direction = cc.pAdd(direction,cc.p(0,-1));
        if (this.keyDir.right) direction = cc.pAdd(direction,cc.p(1,0));
        if (this.keyDir.left) direction = cc.pAdd(direction,cc.p(-1,0));
        return cc.pNormalize(direction);
    },

    getMousePos: function () {
        return this.mousePos;
    },

    isClicked: function(){
        let isClicked = this._isClicked;
        if (!this.touched) this._isClicked = false;
        return isClicked;
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
            onKeyPressed:(keyCode)=>{
                this._onKeyPressed(keyCode);
            },
            onKeyReleased:(keyCode)=>{
                this._onKeyReleased(keyCode);
            }
        })
        cc.eventManager.addListener(this.keyListener,this.target);
    },
    
    initTouchListener: function(){
        this.touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan:()=>{
                this.touched = true;
                this._isClicked = true;
                return true;
            },
            onTouchEnded:()=>{
                this.touched = false;
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
    },

    _onKeyPressed: function(keyCode){
        switch (keyCode){
            case cc.KEY.w:
            case cc.KEY.up:
                this.keyDir.up = true;
                break;
            case cc.KEY.d:
            case cc.KEY.right:
                this.keyDir.right = true;
                break;
            case cc.KEY.s:
            case cc.KEY.down:
                this.keyDir.down = true;
                break;
            case cc.KEY.a:
            case cc.KEY.left:
                this.keyDir.left = true;
                break;
        }
    },

    _onKeyReleased: function (keyCode) {
        switch (keyCode){
            case cc.KEY.w:
            case cc.KEY.up:
                this.keyDir.up = false;
                break;
            case cc.KEY.d:
            case cc.KEY.right:
                this.keyDir.right = false;
                break;
            case cc.KEY.s:
            case cc.KEY.down:
                this.keyDir.down = false;
                break;
            case cc.KEY.a:
            case cc.KEY.left:
                this.keyDir.left = false;
                break;
        }
    }
})