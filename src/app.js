import { BaseEffect, PixelEffect } from "./BaseEffect";

// Shaders
import FunctionPlotEffectFragmentSource from './glsl/FunctionPlotEffect.frag'
import LinesEffectFragmentSource from './glsl/LinesEffect.frag'
import WiggleEffectFragmentSource from './glsl/WiggleEffect.frag'
import SpiralEffectFragmentSource from './glsl/SpiralEffect.frag'
import BounceEffectFragmentSource from './glsl/BounceEffect.frag'
import LightsEffectFragmentSource from './glsl/LightsEffect.frag'
import XorEffectFragmentSource from './glsl/XorEffect.frag'
import SDF2dEffectFragmentSource from './glsl/SDF2dEffect.frag'
import TunnelEffectFragmentSource from './glsl/TunnelEffect.frag'
import PlasmaEffectFragmentSource from './glsl/PlasmaEffect.frag'
import FireEffectFragmentSource from './glsl/FireEffect.frag'

//console.log(LinesEffectFragmentSource);

const available = [
    {name: "FireEffect", kind: "PixelEffect", fragment: FireEffectFragmentSource },

    {name: "BaseEffect", kind: "BaseEffect" },
    {name: "FunctionPlotEffect", kind: "PixelEffect", fragment: FunctionPlotEffectFragmentSource },
    {name: "BounceEffect", kind: "PixelEffect", fragment: BounceEffectFragmentSource },
    {name: "LineEffect", kind: "PixelEffect", fragment: LinesEffectFragmentSource },
    {name: "XorEffect", kind: "PixelEffect", fragment: XorEffectFragmentSource },
    {name: "WiggleEffect", kind: "PixelEffect", fragment: WiggleEffectFragmentSource },
    {name: "SpiralEffect", kind: "PixelEffect", fragment: SpiralEffectFragmentSource },
    {name: "TunnelEffect", kind: "PixelEffect", fragment: TunnelEffectFragmentSource },
    {name: "LightsEffect", kind: "PixelEffect", fragment: LightsEffectFragmentSource },
    {name: "SDF2dEffect", kind: "PixelEffect", fragment: SDF2dEffectFragmentSource },
    {name: "PlasmaEffect", kind: "PixelEffect", fragment: PlasmaEffectFragmentSource }
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