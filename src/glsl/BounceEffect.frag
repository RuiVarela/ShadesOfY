#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')

// based on The Art of Code from Martin
// https://www.youtube.com/watch?v=IKVM4DAQ840&t=25s

const float line_size = 0.005;

float bounce(float x, float base) {

    float section = -log(1.0 - x) / log(base);
    float block = floor(section);
    
    // make pattern
    section = fract(section);

    // undistort
    section = (1.0 - pow(base, -section))  / (1.0 - 1.0 / base);

    // create a parabola on points 0 and 1
    float parabola = -section * (section - 1.0);

    // make next parabolas smaller and smaller
    parabola *= pow(base, -(block + 1.0f)); 

    return parabola * 2.0; // a bit bigger
}

void main() {
    vec2 uv = nomalizeCoord(resolution, gl_FragCoord.xy);

    float mask = 0.0;
    mask = max(mask, sCut(uv.x, -1.0, line_size));
    mask = max(mask, sCut(uv.x, 1.0, line_size));

    mask = max(mask, sCut(uv.y, -1.0, line_size));
    mask = max(mask, sCut(uv.y, 0.0, line_size));
    mask = max(mask, sCut(uv.y, 1.0, line_size));
    

    // [0, 1]
    float x = (uv.x * 0.5 + 0.5);
    //float base = 2.0;
    float base = clamp(1.0 - (mouse.x / resolution.x), 0.0, 0.8);
    float value = bounce(x, base);

    if (x < 0.0 || x > 1.0) {
        // don't write on the sids
    } else if (uv.y < 0.0) {
        mask = max(mask, value);
    } else {
        mask = max(mask, sCutPoint(uv, vec2(uv.x, value), line_size * 2.0));
    }

    //background
    vec3 background = vec3(0.0, 0.0, 0.0);
    vec3 foreground = vec3(1.0, 1.0, 1.0);
    fragColor = vec4(mix(background, foreground, mask), 1.0);
}