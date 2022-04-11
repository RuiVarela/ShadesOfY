import { BaseEffect, PixelEffect } from "./BaseEffect";

// Shaders
import CircleEffectFragmentSource from './glsl/CircleEffect.frag'
import WiggleEffectFragmentSource from './glsl/WiggleEffect.frag'

const available = [
    {name: "WiggleEffect",  kind: "PixelEffect", fragment: WiggleEffectFragmentSource },

    
    {name: "BaseEffect",    kind: "BaseEffect" },
    {name: "CircleEffect",  kind: "PixelEffect", fragment: CircleEffectFragmentSource },
    {name: "WiggleEffect",  kind: "PixelEffect", fragment: WiggleEffectFragmentSource },
];

function fxFactory(info) {
    switch (info.kind) {  
        case "PixelEffect": 
            return new PixelEffect(info.fragment);

        case "BaseEffect":
        default:
            return new BaseEffect();
    }
}


//
// fill the list of effects
//
let selectList = document.getElementById("effect_list"); 
for (var i = 0; i < available.length; i++) {
    var option = document.createElement("option");
    option.value = i;
    option.text = available[i].name;
    selectList.appendChild(option);
}
selectList.addEventListener("change", (event) => {
    next_effect = available[event.target.value];
    console.log(`"Changed to ${next_effect.name}`);
});


const gl = document.querySelector("#gl_canvas").getContext("webgl2");
var running_effect = null;
var next_effect = available[0];

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