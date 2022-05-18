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

    //
    // barrel coordinates
    //
    float barrer_power = 1.12;
    float theta = atan(uv.y, uv.x);
    float radius = length(uv);
    radius = pow(radius, barrer_power);
    uv = radius * vec2(cos(theta), sin(theta));


    //
    // compute lissajous
    //
    const float dot_size = 0.05;
    

    float mask = 0.0;

    const float A = 1.0;
    const float B = 1.0;
    float a = 2.0;
    float b = 6.0;


    const float scaler = 0.84;
    const float speed = 0.7;
    const float points = 35.0;
    const float t_step = 0.05; 

    float max_t = time * speed;
    float min_t = max_t - (points * t_step);

    for (float t = max_t; t > min_t; t -= t_step) {
        vec2 la = vec2(sin(a * t + PI / 2.0), sin(b * t));
        vec2 lb = vec2(sin(a * (t - t_step) + PI / 2.0), sin(b * (t - t_step)));
        mask = max(mask, line(uv, la * scaler, lb * scaler));
    }


    const vec3 matrix_green = vec3(0.011, 0.625, 0.3828);
    
    vec3 color = matrix_green * (0.1 + pSin(time) * 0.1);
    color = mix(color, matrix_green, mask);


    //
    // Tv edges
    //
    float aspect = (resolution.x / resolution.y);
    float fade_region = 0.05;
    float tv_edge_y = 0.9;
    float tv_edge_x = tv_edge_y * aspect;

    float abs_y = abs(uv.y);
    float abs_x = abs(uv.x);

    float palette_offset = max(abs_x / aspect, abs_y) - 1.0;
    vec3 border = cosPalette(0.53 + palette_offset, ColorIq4);
    color = mix(color, border, smoothstep(tv_edge_y - fade_region, tv_edge_y, abs_y));
    color = mix(color, border, smoothstep(tv_edge_x - fade_region, tv_edge_x, abs_x));


    fragColor = vec4(color, 1.0);
}