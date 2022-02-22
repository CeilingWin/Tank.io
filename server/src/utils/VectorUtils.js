import SAT from "sat";
const POINT_EPSILON = 1.192092896e-07;
class Vector extends SAT.Vector{
    constructor(x, y) {
        super(x,y);
    }

    static angleSigned(v1,v2){
        v1 = v1.normalize().clone();
        v2 = v2.normalize().clone();
        var angle = Math.atan2(v1.x * v2.y - v1.y * v2.x, v1.dot(v2));
        if (Math.abs(angle) < POINT_EPSILON)
            return 0.0;
        return angle;
    }

    static multi(vector, f){
        vector = vector.clone();
        vector.x *= f;
        vector.y *= f;
        return vector;
    }
}

export { Vector }