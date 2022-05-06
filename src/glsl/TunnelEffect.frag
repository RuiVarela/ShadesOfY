#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')

vec3 brick(vec2 uv) {
    float brick_ratio = 2.095; // a good ratio to wrap around on a tunnel
    float brick_y = 5.0;
    float brick_x = brick_y / brick_ratio;
    
    vec2 scaled_uv = uv * vec2(brick_x, brick_y);
    // move odd bricks forward
    scaled_uv.x += mod(floor(scaled_uv.y), 2.0) * 0.5;

    vec2 buv = fract(scaled_uv);

    float mortar_y = 0.02;
    float mortar_x = mortar_y / brick_ratio;

    float fade_y = mortar_y * 0.4;
    float fade_x = fade_y / brick_ratio;


    float mask = 0.0;
    mask = max(mask, sBar(buv.x, 0.0, mortar_x, fade_x));
    mask = max(mask, sBar(buv.x, 1.0, mortar_x, fade_x));
    mask = max(mask, sBar(buv.y, 0.0, mortar_y, fade_y));
    mask = max(mask, sBar(buv.y, 1.0, mortar_y, fade_y));


    vec3 color = vec3(0.5, 0.0, 0.0);

    // shadowing
    color *= 0.5 + 0.5 * sqrt(4.0 * buv.x * (1.0 - buv.x));
    color *= 0.5 + 0.5 * sqrt(4.0 * buv.y * (1.0 - buv.y));

    // mortar
    color = mix(color, vec3(0.83, 0.83, 0.77), mask);

    return color;
}

void main() {
    vec2 uv = nomalizeCoord(resolution, gl_FragCoord.xy);

    
    float a = atan(uv.y, uv.x) + PI;
    float r1 = length(uv);
    float r2 = pow(pow(uv.x * uv.x, 4.0) + pow(uv.y * uv.y, 4.0), 1.0/8.0);

    float r = mix(r1, r2, pSin(time * 0.1));

    vec2 polar_uv = vec2(a , 1.0 / r + time * 0.5);
    vec3 color = brick(polar_uv);

    color = color * clamp(r * 1.0, 0.0, 1.0);

    fragColor = vec4(color, 1.0);
}
