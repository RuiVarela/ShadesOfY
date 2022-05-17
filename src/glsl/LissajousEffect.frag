#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')


float line(vec2 p, vec2 a, vec2 b) {
    float dist = distanceToLineSegment(p, a, b);
    float mask = sCut(dist, 0.0, 0.02);
    
    
    mask = max(mask, sCutPoint(p, a, 0.04));
    // attenuation based on the distance between A and B
    //dist = distance(a, b);
    //mask *= smoothstep(2.5, 1.6, dist) * 0.5;

    //mask *= 1.0 + sCut(dist, 1.5, 0.15);
    

    return mask;
}


void main() {
    vec2 uv = nomalizeCoord(resolution, gl_FragCoord.xy);
    uv *= 1.1;

    float mask = 0.0;

    const float A = 1.0;
    const float B = 1.0;
    float a = 2.0;
    float b = 6.0;


    float speed = 0.7;
    float points = 35.0;

    float t_step = 0.05; 
    float max_t = time * speed;
    float min_t = max_t - (points * t_step);

    for (float t = max_t; t > min_t; t -= t_step) {

        vec2 la = vec2(sin(a * t + PI / 2.0), sin(b * t));
        vec2 lb = vec2(sin(a * (t - t_step) + PI / 2.0), sin(b * (t - t_step)));

        mask = max(mask, line(uv, la , lb));
    }

    //background
    vec3 background = vec3(0.0, 0.0, 0.0);
    vec3 foreground = vec3(1.0, 1.0, 1.0);
    fragColor = vec4(mix(background, foreground, mask), 1.0);
}