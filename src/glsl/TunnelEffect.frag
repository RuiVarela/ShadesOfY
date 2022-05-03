#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')

vec3 brick(vec2 uv) {
    float brick_ratio = 2.09;
    float brick_y = 5.0;
    float brick_x = brick_y / brick_ratio;
    
    vec2 scaled_uv = uv * vec2(brick_x, brick_y);
    // move odd bricks forward
    scaled_uv.x += mod(floor(scaled_uv.y), 2.0) * 0.5;

    vec2 buv = fract(scaled_uv);

    float mask = 1.0f;
    float mortar_y = 0.04;
    float mortar_x = mortar_y / brick_ratio;

    mask = smoothstep(0.0, mortar_x, buv.x) * smoothstep(1.0, 1.0 - mortar_x, buv.x) * 
           smoothstep(0.0, mortar_y, buv.y) * smoothstep(1.0, 1.0 - mortar_y, buv.y);
    
    vec3 color = mix(vec3(0.83, 0.83, 0.77), vec3(0.5, 0.0, 0.0), mask);

    // shadowing
    if (buv.x > mortar_x && buv.x < (1.0 - mortar_x) && 
        buv.y > mortar_y && buv.y < (1.0 - mortar_y)) {
        color *= 0.5 + 0.5 * sqrt(4.0 * buv.x * (1.0 - buv.x));
        color *= 0.5 + 0.5 * sqrt(4.0 * buv.y * (1.0 - buv.y));
    }

    return color;
}

void main() {
    vec2 uv = nomalizeCoord(resolution, gl_FragCoord.xy);

    vec3 color = brick(uv);

    fragColor = vec4(color, 1.0);
}