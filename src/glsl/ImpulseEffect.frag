#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')

float signal(float uvx, float tx) {
    
    // sinc
    float x = fract(uvx + tx) * 2.0 - 1.0;
    float scaled_x = x * 20.3;
    float sinc_v = (sin(scaled_x) / (scaled_x)) * 0.8;
    sinc_v *= smoothstep(1.0, 0.65, abs(uvx));

    return sinc_v;
}

float line(vec2 p, vec2 a, vec2 b) {
    float dist = distanceToLineSegment(p, a, b);
    float mask = sCut(dist, 0.0, 0.005);
    return mask;
}


void main() {
    vec2 uv = nomalizeCoord(resolution, gl_FragCoord.xy);

    float mask = 0.0;

    float planes = 25.0;
    const float speed = 0.8;

    for (float i = 0.0; i <= 1.0; i += (1.0 / planes)) {
        vec2 uvp = uv * mix(3.0, 1.0, i);

        float offset = 0.01;
        vec2 pp = vec2(uvp.x - offset, signal(uvp.x - offset, time * speed));
        vec2 pn = vec2(uvp.x + offset, signal(uvp.x + offset, time * speed));

        mask = max(mask, line(uvp, pn, pp) * pow(i, 3.0) );
    }
  
    fragColor = vec4(mask, mask, mask, 1.0);


    vec3 background = backgroundPalette(resolution * 4.0, gl_FragCoord.xy, ColorIq2, 0.5);
    vec3 foreground = vec3(1.0, 1.0, 1.0);
    fragColor = vec4(mix(background, foreground, mask), 1.0);
}