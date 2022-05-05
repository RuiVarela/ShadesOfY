#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')



void main() {
    vec2 uv = nomalizeCoord(resolution, gl_FragCoord.xy);

    float mask = pow(pow(uv.x * uv.x, 4.0) + pow(uv.y * uv.y, 4.0), 1.0/8.0);;

    //background
    vec3 background = vec3(0.0, 0.0, 0.0);
    vec3 foreground = vec3(1.0, 1.0, 1.0);
    fragColor = vec4(mix(background, foreground, mask), 1.0);
}