var InterpolateObject = InterpolateObject || {};

var interpolatePosition = function (p1, p2, ratio) {
    return p1 + (p2 - p1) * ratio;
}

var interpolateAngle = function (a1, a2, ratio) {
    let deltaA = Math.abs(a2 - a1);
    if (deltaA < Math.PI) {
        return a1 + (a2 - a1) * ratio;
    } else {
        if (a1 > a2) return a1 + (Math.PI - deltaA) * ratio;
        else return a1 - (Math.PI - deltaA) * ratio;
    }
}

var interpolateBoolean = function (b1, b2, ratio){
    if (ratio < 0.99) return b1;
    return b2;
}

var interpolate = function(s1,s2,ratio){
    if (ratio < 0.5) return s1;
    return s2;
}

// OBJECT DEFINE
InterpolateObject.Tank = {
    x : interpolatePosition,
    y : interpolatePosition,
    direction : interpolateAngle,
    cannonDirection : interpolateAngle,
    active : interpolateBoolean,
    hp : interpolate,
    kills : interpolate,
    lastShootAt: interpolate
}

InterpolateObject.Bullet = {
    x : interpolatePosition,
    y : interpolatePosition,
    direction : interpolateAngle,
    active : interpolateBoolean
}

Object.entries(InterpolateObject).forEach(([key,value])=>{
    value.entries = Object.entries(value);
});

// FUNC
InterpolateObject.getObject = function(type,data){
    let obj = {};
    type.entries.forEach(v=>{
        obj[v[0]] = data[v[0]];
    });
    obj.type = type;
    return obj;
}

InterpolateObject.interpolate = function(obj1, obj2, ratio){
    let obj = {}, type = obj1.type;
    type.entries.forEach(([key, func])=>{
        obj[key] = func(obj1[key],obj2[key],ratio);
    });
    return obj;
}