#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')

void main() {
    vec2 uv = nomalizeCoord(resolution, gl_FragCoord.xy);

    vec3 color = vec3(0.0);
    if (uv.x > 0.0 && uv.y > 0.0) {

        color = vec3(hash21(uv + time));

    } else if (uv.x > 0.0 && uv.y <= 0.0) {

        color = vec3(snoise(uv * 3.0) * 0.5 + 0.5);

    } else if (uv.x <= 0.0 && uv.y > 0.0) {

        color = vec3(fbm(uv * 3.0) * 0.5 + 0.5);

    } else {

        float noised = fbm(uv * 0.4);
        color = vec3(pSin(time * 0.4 + noised * PI));
    }

    fragColor = vec4(color, 1.0);
}