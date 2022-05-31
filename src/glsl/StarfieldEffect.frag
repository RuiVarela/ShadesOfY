#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')

//
// The art of code
// https://www.youtube.com/watch?v=rvDo9LvfoVE&t=13
//

float Star(vec2 uv, float flare) {
    float mask = 0.0;

    float distance = length(uv);
    float light = 0.05 / distance;
    mask += light;
   

    float rays = 1.0 - clamp(abs(uv.x * uv.y * 800.0), 0.0, 1.0);
    mask += rays * flare;

    uv = rotate(uv, PI / 4.0);
    rays = 1.0 - clamp(abs(uv.x * uv.y * 800.0), 0.0, 1.0);
    mask += rays * flare* 0.3;

    mask *= smoothstep(0.50, 0.10, distance);

    return mask;
}

vec3 StarLayer(vec2 uv) 
{
    vec3 color = vec3(0);

    vec2 id = floor(uv);
    vec2 gv = fract(uv) - 0.5;

    for (int y = -1; y <= 1; ++y) {
        for (int x = -1; x <= 1; ++x) {
            vec2 offset = vec2(x, y);
           
            vec2 r = hash22(id + offset);
            float size = fract(r.x * 345.32);
            float flare = smoothstep(0.55, 0.8, size);
            float star = Star(gv - offset - r + 0.5, flare * 0.5);
            star *= sin(time * 1.0 * r.y * 2.0 * PI) * 0.5 + 1.0;
            //vec3 star_color = sin(vec3(0.2, 0.4, 0.6) * fract(r.x * 44233.98) * 3.0 * PI) * 0.5 + 0.5;
            vec3 star_color = cosPalette(fract(r.x * 44233.98) + 3.8, ColorIq5);
            color += star * size * star_color;
        }
    }

    return color;
}

void main() {
    vec2 uv = nomalizeCoord(resolution, gl_FragCoord.xy);
    vec2 mouse_uv = nomalizeCoord(resolution, mouse.xy);

    vec3 color = vec3(0);
    float t = time * 0.02;   

    uv += mouse_uv;
    uv = rotate(uv, -t);

    const float layers = 4.0;
    for (float i = 0.0; i <= 1.0; i += 1.0 / layers) {
        float depth = fract(i + t);
        float fade = depth * smoothstep(1.0, 0.9, depth);
        float offset = i * 45.0;
        float scale = mix(20.0, 0.5, depth);
        color += StarLayer(uv * scale + offset) * fade;
    }

    fragColor = vec4(color, 1.0);
}