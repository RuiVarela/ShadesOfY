#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')

//https://greentec.github.io/shadertoy-fire-shader-en/

void main() {
    vec2 uv = nomalizeCoord(resolution, gl_FragCoord.xy);

    const vec2 distortion = vec2(0.5, 0.15);
    const vec2 movement = vec2(-0.01, -0.3);
    const float speed = 2.5;

    vec2 fire_uv = uv * distortion + movement * speed * time;
    float gradient = clamp(pow(1.0 - (uv.y * 0.5 + 0.5), 2.0) * 5.0, 0.0, 1.0);


    float waves = fbm(fire_uv) * 0.5 + 0.5;
    float mask = gradient * waves;

    vec3 color = mask * clamp(vec3(2.0 * waves, 2.0 * pow(waves, 3.0), pow(waves, 4.0)), 0.0, 1.0);

    fragColor = vec4(color, 1.0);

}