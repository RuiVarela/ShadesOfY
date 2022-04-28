#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')

const float line_size = 0.05;
const float blobs = 15.0;


vec4 render(vec2 position) {
    vec2 uv = nomalizeCoord(resolution, position);

    float speed = time * 0.1;
    float distance = 0.3;

    float angle = atan(uv.y, uv.x);

    // these are 3 different spirals
    float options[3] = float[3]( 
        length(uv), 
        log(length(uv)), 
        log(length(uv)) / log(E * 5.0)
    );


    // mix the 3 spirals in time
    float factor = mod(time * 0.1f, 3.0);
    int current_index = int(floor(factor));
    factor = fract(factor);
    int next_index = (current_index + 1) % 3;
    float radius = mix(options[current_index], options[next_index], factor);


    // pick a fixed spiral
    //radius = options[current_index];

    float spiral = radius + angle / (2.0 * PI) * distance;
    spiral = mod(spiral + speed, distance);
    spiral = sCut(spiral, distance / 2.0, line_size);

    return vec4(spiral);
}


#pragma glslify: multisample = require(./common/multisample.glsl, render=render) 

void main() {
    float spiral = multisample(4.0).x;

    //background
    vec3 background = backgroundPalette(resolution, gl_FragCoord.xy, ColorIq1, time * 0.01) * 0.7;
    vec3 foreground = vec3(1.0, 1.0, 1.0);
    fragColor = vec4(mix(background, foreground, spiral), 1.0);
}