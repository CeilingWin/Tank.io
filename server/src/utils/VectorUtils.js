var VecUtils = {
    add: (v1, v2) => {
        return {
            x: v1.x + v2.x,
            y: v1.y + v2.y
        }
    }
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        return VecUtils.add(this, v);
    }
}

export { VecUtils, Vector }