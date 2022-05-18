#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')


float line(vec2 p, vec2 a, vec2 b) {
    float dist = distanceToLineSegment(p, a, b);
    float mask = sCut(dist, 0.0, 0.02);
    
    
    //mask = max(mask, sCutPoint(p, a, 0.04));
    // attenuation based on the distance between A and B
    //dist = distance(a, b);
    //mask *= smoothstep(2.5, 1.6, dist) * 0.5;

    //mask *= 1.0 + sCut(dist, 1.5, 0.15);
    

    return mask;
}

void main() {
    vec2 uv = nomalizeCoord(resolution, gl_FragCoord.xy);
    float aspect = (resolution.x / resolution.y);

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
    

    const float scaler_y = 0.80;
    float scaler_x = scaler_y * aspect;
    const float speed = 3.0;
    const float points = 40.0;
    const float t_step = 0.05; 

    float max_t = time * speed;
    float min_t = max_t - (points * t_step);

    for (float i = 0.0; i < points; ++i) {
        float progress = 1.0 - (i / points);

        float t0 = (time * speed) - (i * t_step);
        float t1 = (time * speed) - ((i + 1.0) * t_step);

        vec2 l0 = vec2(sin(a * t0 + PI / 2.0) * scaler_x, sin(b * t0) * scaler_y);
        vec2 l1 = vec2(sin(a * t1 + PI / 2.0) * scaler_x, sin(b * t1) * scaler_y);
        mask = max(mask, line(uv, l0, l1) * progress);
    }


    const vec3 matrix_green = vec3(0.011, 0.625, 0.3828);

    float green_noise = snoise(vec2(time * 0.2)) * 0.05 + 0.15;
    vec3 color = matrix_green * green_noise;
    
    color = mix(color, matrix_green, mask);


    //
    // Tv edges
    //
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