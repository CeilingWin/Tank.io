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
    } else if (typeof onHover === "string"){
        let resPath = onHover;
        onHover = ()=>{
            button.loadTextures(resPath,resPath);
        }
        let resPath2 = onNotHover;
        onNotHover = ()=>{
            button.loadTextures(resPath2,resPath2);
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