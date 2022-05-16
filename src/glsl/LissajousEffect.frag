#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')



void main() {
    vec2 uv = nomalizeCoord(resolution, gl_FragCoord.xy);

    const float dot_size = 0.05;
    

    float mask = 0.0;

    const float A = 1.0;
    const float B = 1.0;
    float a = 2.0;
    float b = 4.0;


    float speed = 1.0;
    float t_step = 0.1 * speed; 
    float min_t = time - (15.0 * t_step);

    for (float t = time; t > min_t; t -= t_step) {

        vec2 lissajous = vec2(sin(a * t + PI / 2.0), sin(b * t));

        mask = max(mask, sCutPoint(uv, lissajous, dot_size));
    }








    //background
    vec3 background = vec3(0.0, 0.0, 0.0);
    vec3 foreground = vec3(1.0, 1.0, 1.0);
    fragColor = vec4(mix(background, foreground, mask), 1.0);
}