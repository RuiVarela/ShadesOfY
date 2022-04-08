import BaseEffect from "./fx_base/BaseEffect";

const gl = document.querySelector("#gl_canvas").getContext("webgl");

var running_effect = null;
var next_effect = null;

function fxFactory(name) {
    return new BaseEffect();
}

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

next_effect = "base";