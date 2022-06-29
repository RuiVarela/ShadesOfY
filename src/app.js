import { BaseEffect, PixelEffect } from "./BaseEffect";

// Shaders
import FunctionPlotEffectFragmentSource from './glsl/FunctionPlotEffect.frag'
import LinesEffectFragmentSource from './glsl/LinesEffect.frag'
import WiggleEffectFragmentSource from './glsl/WiggleEffect.frag'
import SpiralEffectFragmentSource from './glsl/SpiralEffect.frag'
import BounceEffectFragmentSource from './glsl/BounceEffect.frag'
import LightsEffectFragmentSource from './glsl/LightsEffect.frag'
import XorEffectFragmentSource from './glsl/XorEffect.frag'
import TunnelEffectFragmentSource from './glsl/TunnelEffect.frag'
import PlasmaEffectFragmentSource from './glsl/PlasmaEffect.frag'
import NukeEffectFragmentSource from './glsl/NukeEffect.frag'
import FireEffectFragmentSource from './glsl/FireEffect.frag'
import LissajousEffectFragmentSource from './glsl/LissajousEffect.frag'
import NoiseEffectFragmentSource from './glsl/NoiseEffect.frag'
import ImpulseEffectFragmentSource from './glsl/ImpulseEffect.frag'
import StarfieldEffectFragmentSource from './glsl/StarfieldEffect.frag'
import SphereEffectFragmentSource from './glsl/SphereEffect.frag'

//console.log(LinesEffectFragmentSource);
let selectedIndex = 13
const available = [   
    //{name: "BaseEffect", kind: "BaseEffect" },
    {name: "FunctionPlotEffect", kind: "PixelEffect", fragment: FunctionPlotEffectFragmentSource },
    {name: "BounceEffect", kind: "PixelEffect", fragment: BounceEffectFragmentSource },
    {name: "NoiseEffect", kind: "PixelEffect", fragment: NoiseEffectFragmentSource },


    {name: "LineEffect", kind: "PixelEffect", fragment: LinesEffectFragmentSource },
    {name: "XorEffect", kind: "PixelEffect", fragment: XorEffectFragmentSource },
    {name: "WiggleEffect", kind: "PixelEffect", fragment: WiggleEffectFragmentSource },
    {name: "SpiralEffect", kind: "PixelEffect", fragment: SpiralEffectFragmentSource },
    {name: "TunnelEffect", kind: "PixelEffect", fragment: TunnelEffectFragmentSource },
    {name: "LightsEffect", kind: "PixelEffect", fragment: LightsEffectFragmentSource },
    {name: "PlasmaEffect", kind: "PixelEffect", fragment: PlasmaEffectFragmentSource },
    {name: "NukeEffect", kind: "PixelEffect", fragment: NukeEffectFragmentSource },
    {name: "StarfieldEffect", kind: "PixelEffect", fragment: StarfieldEffectFragmentSource },
    {name: "FireEffect", kind: "PixelEffect", fragment: FireEffectFragmentSource },
    {name: "ImpulseEffect", kind: "PixelEffect", fragment: ImpulseEffectFragmentSource },
    {name: "LissajousEffect", kind: "PixelEffect", fragment: LissajousEffectFragmentSource },

    {name: "ShpereEffect", kind: "PixelEffect", fragment: SphereEffectFragmentSource },
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

var next_effect = available[selectedIndex];
selectList.selectedIndex = selectedIndex;

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