#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')

const float line_size = 0.06;
const float blobs = 15.0;

void main() {
    vec2 uv = nomalizeCoord(resolution, gl_FragCoord.xy);

    float speed = time * 0.1;
    float distance = 0.5;

    float angle = atan(uv.y, uv.x);
    float radius = length(uv);

    //radius = length(uv);
    //radius = log(radius);
    radius = log(radius) / log(E * 5.0);


    float spiral = radius + angle / (2.0 * PI) * distance;
    spiral = mod(spiral + speed, distance);
    spiral = sCut(spiral, distance / 2.0, 0.02);

    fragColor = vec4(spiral, 0.0, 0.0, 1.0);
}