#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')

//
// The art of code
// https://www.youtube.com/watch?v=rvDo9LvfoVE&t=13
//

void main() {
    vec2 uv = nomalizeCoord(resolution, gl_FragCoord.xy);
    vec3 color = vec3(0);

    fragColor = vec4(color, 1.0);
}