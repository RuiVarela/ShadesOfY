#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')

const float line_size = 0.06;
const float blobs = 15.0;

void main() {
    vec2 uv = nomalizeCoord(resolution, gl_FragCoord.xy);

    fragColor = vec4(uv, 0.0, 1.0);
}