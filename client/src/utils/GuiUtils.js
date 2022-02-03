var GuiUtils = GuiUtils || {};

GuiUtils.addEventOnHover = function (button, onHover, onNotHover){
    if (!onHover) {
        let oldColor = button.getColor();
        onHover = ()=>{
            button.setColor(cc.color(239,239,239));
        }
        onNotHover = ()=>{
            button.setColor(oldColor);
        }
    }
    cc.eventManager.addListener({
        event: cc.EventListener.MOUSE,
        onMouseMove: function(event){
            let target = event.getCurrentTarget();
            let locationInNode = target.convertToNodeSpace(event.getLocation());
            let s = target.getContentSize();
            let rect = cc.rect(0, 0, s.width, s.height);
            if (cc.rectContainsPoint(rect, locationInNode)) {
                onHover();
            } else {
                onNotHover();
            }
        }
    },button);
}