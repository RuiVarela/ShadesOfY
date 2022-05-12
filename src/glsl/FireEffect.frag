#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')

void main() {
    vec2 uv = nomalizeCoord(resolution, gl_FragCoord.xy);

    const vec2 distortion = vec2(0.5, 0.15);
    const vec2 movement = vec2(-0.01, -0.3);
    const float speed = 2.5 * 1.0;

    vec2 fire_uv = uv * distortion + movement * speed * time;
    float fire = fbm(fire_uv) * 0.5 + 0.5;

    float gradient = smoothstep(0.0 + fire, -0.5, uv.y);
    float mask = gradient * fire;

    vec3 color = 2.0 * vec3(fire, pow(fire, 3.0), 0.0);
    color = mask * clamp(color, 0.0, 1.0);

    fragColor = vec4(color, 1.0);
}