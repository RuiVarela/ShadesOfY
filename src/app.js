import BaseEffect from "./fx_base/BaseEffect";



const gl = document.querySelector("#gl_canvas").getContext("webgl");
let effect = new BaseEffect();
effect.setup(gl);


function render(time) {
    effect.render(time);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);