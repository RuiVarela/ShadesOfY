#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')

void main() {
    vec2 uv = nomalizeCoord(resolution, gl_FragCoord.xy);

    float line_size = 0.2;
    float fade_size = 0.03;

    float mask = 0.0;
    
    mask = max(mask, sCut(uv.x, 0.5, line_size));
    mask = max(mask, sBar(uv.x, -0.5, line_size, fade_size));

    fragColor = vec4(mask, mask, mask, 1.0);
}