import {HealEffect} from "./HealEffect.js";
import {ShieldEffect} from "./ShieldEffect.js";

export class EffectFactory {
    static createEffect(type, tank){
        switch(type){
            case 0:
                return new HealEffect(tank);
            case 1:
                return new ShieldEffect(tank);
        }
    }
}