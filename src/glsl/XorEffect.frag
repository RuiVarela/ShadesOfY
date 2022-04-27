#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')

float xorSample(vec2 pos) {
    const float bits = 6.0;
    const float res = pow(2.0, bits);

    vec2 f = fract(pos) * 0.5 * res;
    float r = 0.0;
    for (float i = 0.0; i < bits; ++i) {
        r = r * 0.5 + mod(floor(f.x) + floor (f.y), 2.0);
        f /= 2.0;
    }
    return r;
}

vec4 render(vec2 position) {
    vec2 uv = nomalizeCoord(resolution, position);

    uv = uv * (0.5 + pSin(time * 0.3));

    uv = rotate(uv, time * 0.05);
    
    float color = xorSample(uv);
    return vec4(color, color, color, 1.0);
}


#pragma glslify: multisample = require(./common/multisample.glsl, render=render) 

void main() {
    fragColor = multisample(4.0);;
}