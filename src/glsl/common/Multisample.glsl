//
// multisample pixels to anti aliasing
//
// Change times to define the level of anti-aliasing (1 to 16)
vec4 multisample(float times) {
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);

    // anti alias
    float s = 1.0 / times;
    for (float x = -0.5; x < 0.5; x += s) {
        for (float y = -0.5; y < 0.5; y += s) {
            vec2 position = gl_FragCoord.xy + vec2(x,y);
            color += render(position);
        }
    } 
    color /= times * times;
    return color;
}


#pragma glslify: export(multisample) 