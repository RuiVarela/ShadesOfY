#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')

const float line_size = 0.005;

float f(float x) {

    // sinc
    x = fract(x + time * 0.1);
    x = x * 2.0 - 1.0;
    
    float scaled_x = (x) * 20.3;
    float sinc_v = sin(scaled_x) / (scaled_x);
    return sinc_v * 0.5;
    


    //return sin(x * 2.0 * PI);
    //return sincZero(x, 10.0);
}


void main() {
    vec2 uv = nomalizeCoord(resolution, gl_FragCoord.xy);

    float mask = 0.0;
    mask = max(mask, sCut(uv.x, -1.0, line_size));
    mask = max(mask, sCut(uv.x, .0, line_size));
    mask = max(mask, sCut(uv.x, 1.0, line_size));

    mask = max(mask, sCut(uv.y, -1.0, line_size));
    mask = max(mask, sCut(uv.y, 0.0, line_size));
    mask = max(mask, sCut(uv.y, 1.0, line_size));
    

    float x = uv.x;
    float y = f(uv.x);
    mask = max(mask, sCutPoint(uv, vec2(x, y), line_size * 4.0));

    //background
    vec3 background = vec3(0.0, 0.0, 0.0);
    vec3 foreground = vec3(1.0, 1.0, 1.0);
    fragColor = vec4(mix(background, foreground, mask), 1.0);
}