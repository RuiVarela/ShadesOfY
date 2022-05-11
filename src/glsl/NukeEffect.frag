#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')

// Source the art of code
// https://www.youtube.com/watch?v=3CycKKJiwis&t=319s

vec2 getPos(vec2 id, vec2 offset) {
    float t = time + 1234.0;
    vec2 noise = Hash22(id + offset);
    float x = sin(t * noise.x);
    float y = cos(t * noise.y);
    return 2.0 * offset + vec2(x, y); // * 0.75;
} 

float line(vec2 p, vec2 a, vec2 b) {
    float dist = distanceToLineSegment(p, a, b);
    float mask = sCut(dist, 0.0, 0.05);

    // attenuation based on the distance between A and B
    dist = distance(a, b);
    mask *= smoothstep(2.5, 1.6, dist) * 0.5;

    mask *= 1.0 + sCut(dist, 1.5, 0.15);
    

    return mask;
}

float nuclear(vec2 uv) {
    vec2 block_uv = fract(uv) * 2.0 - 1.0;
    vec2 id = floor(uv);

    float ball_mask = 0.0;
    float line_mask = 0.0; 

    const vec4 offsets[9 + 4] = vec4[9 + 4] (
        vec4(0.0, 0.0,   -1.0, -1.0), vec4(0.0, 0.0,   0.0, -1.0), vec4(0.0, 0.0,   1.0, -1.0),
        vec4(0.0, 0.0,   -1.0,  0.0), vec4(0.0, 0.0,   0.0,  0.0), vec4(0.0, 0.0,   1.0,  0.0),
        vec4(0.0, 0.0,   -1.0,  1.0), vec4(0.0, 0.0,   0.0,  1.0), vec4(0.0, 0.0,   1.0,  1.0),


        vec4(-1.0, 0.0, 0.0, -1.0), vec4(-1.0, 0.0, 0.0, 1.0),
        vec4(1.0, 0.0, 0.0, -1.0), vec4(1.0, 0.0, 0.0, 1.0)
    );

    for (int i = 0; i != offsets.length(); ++i) {
        vec2 a_offset = offsets[i].xy;
        vec2 b_offset = offsets[i].zw;

        //if (b_offset.x != 0.0 || b_offset.y != 0.0)  continue;

        vec2 a_position = getPos(id, a_offset); 
        vec2 b_position = getPos(id, b_offset); 

        
        float noise = Hash21(id + b_offset);
        float sparkle = 0.035 / distance(block_uv, b_position);
        sparkle *= pSin(time * 3.0 + noise * 10.0);
        ball_mask = max(ball_mask, clamp(sparkle, 0.0, 1.0));

        if (b_offset.x != 0.0 || b_offset.y != 0.0) {
            line_mask = max(line_mask, line(block_uv, a_position, b_position)); 
        }
    }

    return max(line_mask, ball_mask);
}

void main() {
    vec2 uv = nomalizeCoord(resolution, gl_FragCoord.xy);
    vec2 mouse_uv = nomalizeCoord(resolution, mouse.xy);


    uv = rotate(uv, -time * 0.05);
    mouse_uv = rotate(mouse_uv, -time * 0.05);


    float t = time * 0.2;
    float mask = 0.0;
    for (float i = 0.0; i <= 1.0; i += (1.0 / 3.0)) {
        float z = fract(t + i);
        float size = mix(5.0, 1.0, z);
        float fade = smoothstep(0.0, 0.5, z) * smoothstep(1.0, 0.8, z);
        mask += nuclear(uv * size + i * 20.0 + mouse_uv) * fade;
    }



    //vec3 base_color = vec3(0.0, 0.7, 0.30);
    vec3 base_color = cosPalette(pSin(time) * 0.1, ColorIq4) * 0.7;
    vec3 color = base_color * mask;


    vec2 screen_uv = (gl_FragCoord.xy / resolution) * 2.0 - 1.0;
    float vignette = clamp(pow(length(screen_uv), 3.0), 0.0, 1.0);

    color += base_color * vignette * 0.140;

        // Grid Drawing code
    // float grid_mask = 0.0;
    // grid_mask = max(grid_mask, sCut(block_uv.x, -1.0, 0.1));
    // grid_mask = max(grid_mask, sCut(block_uv.x, 1.0, 0.1));
    // grid_mask = max(grid_mask, sCut(block_uv.y, -1.0, 0.1));
    // grid_mask = max(grid_mask, sCut(block_uv.y, 1.0, 0.1));
    // color = mix(color, vec4(0.0, 0.0, 1.0, 1.0), grid_mask);
    fragColor = vec4(color, 1.0);
}