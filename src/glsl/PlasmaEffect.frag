#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')

void main() {
    vec2 uv = nomalizeCoord(resolution, gl_FragCoord.xy);
    //zoom
    uv *= 1.0 + pSin(time * 0.2) * 1.5;

    float mask = 0.0;

    mask = pSin(uv.x * 2.0 + time * 0.1);
    mask += pSin(uv.y * 4.0 + time * 0.2);
    mask += pSin((uv.x + uv.y) * 1.0 + 2.3);
    mask += pSin(length(uv) * 3.0);

    mask /= 4.0;

    //background
    vec3 background = backgroundPalette(resolution, gl_FragCoord.xy, ColorIq4, 0.01);
    vec3 foreground = cosPalette(mask + time * 0.2, ColorIq2);
    fragColor = vec4(mix(background, foreground, mask), 1.0);
}