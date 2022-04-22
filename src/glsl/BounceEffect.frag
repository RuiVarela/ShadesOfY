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

    // guides
    mask = max(mask, sCut(uv.x, -1.0, line_size));
    mask = max(mask, sCut(uv.x, 1.0, line_size));

    mask = max(mask, sCut(uv.y, -1.0, line_size));
    mask = max(mask, sCut(uv.y, 0.0, line_size));
    mask = max(mask, sCut(uv.y, 1.0, line_size));

    // [0, 1]
    float x = (uv.x * 0.5 + 0.5);
    //float base = 2.0;
    float base = clamp(1.0 - (mouse.x / resolution.x), 0.0, 0.8);
    float y = bounce(x, base);

    if (x < 0.0 || x > 1.0) {
        // don't write on the sids
    } else if (uv.y < 0.0) {
        mask = max(mask, y);
    } else {
        mask = max(mask, sCutPoint(uv, vec2(uv.x, y), line_size * 2.0));
    }



    float ball_x = fract(time * 0.4);
    float ball_y = bounce(ball_x, base);

    ball_x = ball_x * 2.0 - 1.0;
    float ball_d = distance(uv, vec2(ball_x, ball_y));
    

    fragColor = vec4(mask);
    fragColor = mix(fragColor, vec4(1.0, 0.0, 0.0, 1.0), step(ball_d, 0.03));
    fragColor.a = 1.0;
}