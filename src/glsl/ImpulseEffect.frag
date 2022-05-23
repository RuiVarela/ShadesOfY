#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')

float signal(vec2 uv, float tx) {
    
    // sinc
    float x = fract(uv.x + tx) * 2.0 - 1.0;
    float scaled_x = x * 20.3;
    float sinc_v = (sin(scaled_x) / (scaled_x)) * 0.8;
    sinc_v *= smoothstep(1.0, 0.65, abs(uv.x));

    return sinc_v;
   // return sCutPoint(uv, vec2(uv.x, sinc_v), 0.005);
}

void main() {
    vec2 uv = nomalizeCoord(resolution, gl_FragCoord.xy);

    float mask = 0.0;

    float planes = 15.0;
    const float speed = 0.8;

    for (float i = 0.0; i <= 1.0; i += (1.0 / planes)) {
        vec2 uvp = uv * mix(5.0, 1.0, i);

        vec2 p0 = vec2(uvp.x, signal(uvp, time * speed));
        float v = sCutPoint(uvp, p0, 0.005);

        mask = max(mask, v * i);
    }
  
    fragColor = vec4(mask, mask, mask, 1.0);
}