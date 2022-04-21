#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')

const float line_size = 0.005;

float f(float x) {
    return sin(x * 2.0 * PI) * 0.5  + 0.5;
}

void main() {
    vec2 uv = nomalizeCoord(resolution, gl_FragCoord.xy) * 0.5 + vec2(0.5);
    // uv normalized between 0.0 <-> 1.0, with aspect ratio correction

    float mask = 0.0;
    mask = max(mask, sCut(uv.x, 0.0, line_size));
    mask = max(mask, sCut(uv.x, 1.0, line_size));

    mask = max(mask, sCut(uv.y, 0.0, line_size));
    mask = max(mask, sCut(uv.y, 0.5, line_size));
    mask = max(mask, sCut(uv.y, 1.0, line_size));
    

    float x = uv.x;
    float y = f(uv.x);
    mask = max(mask, sCutPoint(uv, vec2(x, y), line_size));

    //background
    vec3 background = vec3(0.0, 0.0, 0.0);
    vec3 foreground = vec3(1.0, 1.0, 1.0);
    fragColor = vec4(mix(background, foreground, mask), 1.0);
}