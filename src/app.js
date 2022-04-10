import { BaseEffect, PixelEffect } from "./BaseEffect";

// Shaders
import CircleEffectFragmentSource from './CircleEffect.frag'


function fxFactory(name) {
    switch (name) {

        case "CircleEffect": 
            return new PixelEffect(CircleEffectFragmentSource);

        case "BaseEffect":
        default:
            return new BaseEffect();
    }
}

const gl = document.querySelector("#gl_canvas").getContext("webgl");
var running_effect = null;
var next_effect = "CircleEffect";

function render(time) {
    if (next_effect != null) {

        if (running_effect != null) 
            running_effect.shutdown();
        
        running_effect = fxFactory(next_effect);
        running_effect.setup(gl);
        next_effect = null;
    }

    if (running_effect != null)
        running_effect.render(time);

    requestAnimationFrame(render);
}

requestAnimationFrame(render);