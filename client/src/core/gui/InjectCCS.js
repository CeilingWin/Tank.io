const _injectCCS = {
    initJson: function (jsonRes) {
        if (typeof jsonRes !== 'undefined') {
            const size = cc.director.getVisibleSize();
            const json = ccs.load(jsonRes, "res/");
            const node = json.node;

            this.setRootNode(node);
            node.DEFAULT_CONTENT_SIZE = node.getContentSize();
            node.DEFAULT_ANCHOR_POINT = node.getAnchorPoint();

            node.setContentSize(size);
            node.setLocalZOrder(0);
            this.addChild(node);
            this.syncChild(node);
            return node;
        }
    },
    syncChild: function (node) {
        const allChildren = node.getChildren();
        if (allChildren == null || allChildren.length === 0) return;
        if (!this.ce) this.ce = {};
        allChildren.forEach(child => {
            this._assign(child);
            this.syncChild(child);
        });
    },
    _assign: function (child, childName = child.getName()) {
        if (childName in this && this[childName] == null) {
            this[childName] = child;
            this._handleBtn(child);
            this._handleCheckBox(child);
        }
    },
    _handleBtn: function (child, childName = child.getName()) {
        if (childName.indexOf("btn") !== -1) {
            child.addTouchEventListener(this._onTouchUIEvent.bind(this), this);
            child.setPressedActionEnabled(true);
            child.setZoomScale(-0.1);
            child.offsetChildPos = { x: 0, y: 0 };
        }
    },
    _handleCheckBox: function (child, childName = child.getName()) {
        if (childName.indexOf("cbox") !== -1) {
            child.addTouchEventListener(this._onTouchUIEvent.bind(this), this);
        }
    },
    _onTouchUIEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                this.onTouchUIBegan && this.onTouchUIBegan(sender);
                break;
            case ccui.Widget.TOUCH_MOVED:
                this.onTouchUIMoved && this.onTouchUIMoved(sender);
                break;
            case ccui.Widget.TOUCH_ENDED:
                this.onTouchUIEnded && this.onTouchUIEnded(sender);
                break;
            case ccui.Widget.TOUCH_CANCELED:
                this.onTouchUICanceled && this.onTouchUICanceled(sender);
                break;
        }
    },
    onTouchUIBegan: function () { },
    onTouchUIMoved: function () { },
    onTouchUIEnded: function () { },
    onTouchUICanceled: function () { },

    setRootNode: function (r) { this._rootNode = r; },
    getRootNode: function () { return this._rootNode; },
    getDelegate: function () { return this; },

    subEvent: function (eventId, listener){
        if (!this._listEvent) this._listEvent = [];
        this._listEvent.push(EventCenter.sub(eventId,listener));
    },

    removeAllEvents: function () {
        this._listeners && this._listEvent.forEach(e=>EventCenter.remove(e));
        this._listEvent = [];
    },

};