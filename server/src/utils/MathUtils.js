
var MathUtils = {
    randomBetween(min, max){
        return Math.random()*(max-min) + min;
    },

    randomInt(min,max){
        return Math.round(MathUtils.randomBetween(min,max));
    }
}

export { MathUtils }