#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')

#pragma glslify: rotate = require(glsl-rotate)

struct Light {
  vec2 position;
  vec3 color;
  float edge;
};

void main() {
    vec2 uv = nomalizeCoord(resolution, gl_FragCoord.xy);

    uv = rotate(uv, time * 0.05);
    uv *= 1.2;

    Light lights[4] = Light[4](
        Light(vec2(-0.5, 0.0), vec3(1.0, 0.0, 0.0), -1.0f),
        Light(vec2(0.0, 0.5), vec3(0.0, 0.0, 1.0), 1.0f),
        Light(vec2(0.5, 0.0), vec3(0.0, 1.0, 0.0), 1.0f),
        Light(vec2(0.0, -0.5), vec3(1.0, 1.0, 0.0), -1.0f)
    );

    float light_power = 0.16;
    float speed = 2.5;

    vec3 color = vec3(0.0);
    for (int i = 0; i != lights.length(); ++i) {
        Light light = lights[i];

        float raw_light = clamp(light_power / distance(uv, light.position), 0.0, 1.0);
        float attenuated = pow(raw_light, 1.0 + pSin(time * speed + float(i)) * 2.0);
        color += light.color * attenuated;


        
        float p = (i % 2 == 0) ? uv.x : uv.y;
        raw_light = clamp(light_power * 0.15 / distance(p, light.edge), 0.0, 1.0);
        attenuated = pow(raw_light, 1.0 + pSin(time * speed + float(i)) * 2.0);
        color += light.color * attenuated;
    }

    fragColor = vec4(color, 1.0);
}