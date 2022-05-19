#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')

void main() {
    vec2 uv = nomalizeCoord(resolution, gl_FragCoord.xy) * 0.5 + vec2(0.5);

    //vec3 color = vec3(hash22(uv), 0.0);
    
    //vec3 color = vec3(hash21(uv + 1.0));
    
    //float noised = snoise(uv * vec2(3.0, 3.0)) * 0.5 + 0.5;
    //vec3 color = vec3(noised);

    
   
    float noised = fbm(uv * vec2(0.3, 0.3));
    //vec3 color = vec3(noised);
    vec3 color = vec3(pSin(time * 1.0 + noised * PI));

    fragColor = vec4(color, 1.0);
}