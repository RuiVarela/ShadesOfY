#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')

float xorSample(vec2 pos)
{
    const float bits = 6.0;
    const float res = pow(2.0, bits);

    vec2 f = fract(pos) * 0.5 * res;
    float r = 0.0;
    for (float i = 0.0; i < bits; ++i) {
        r = r * 0.5 + mod(floor(f.x) + floor (f.y), 2.0);
        f /= 2.0;
    }
    return r;
}


void main() {
    vec2 uv = nomalizeCoord(resolution, gl_FragCoord.xy);

    uv *= 2.0;

    vec3 color = vec3(xorSample(uv));
    fragColor = vec4(color, 1.0);
}