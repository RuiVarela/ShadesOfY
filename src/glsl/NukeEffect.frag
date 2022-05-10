#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')

// https://www.youtube.com/watch?v=3CycKKJiwis&t=319s

vec2 getPos(vec2 id, vec2 offset) {

    vec2 noise = Hash22(id + offset);
    float x = sin(time * noise.x);
    float y = cos(time * noise.y);
    return 2.0 * offset + vec2(x, y) * 0.75;
} 

float line(vec2 p, vec2 a, vec2 b) {
    float dist = distanceToLineSegment(p, a, b);
    float mask = sBar(dist, 0.0, 0.03, 0.02);
    return mask;
}


void main() {
    vec2 uv = nomalizeCoord(resolution, gl_FragCoord.xy);

    uv *= 3.0;

    const float size = 0.25;

    vec2 block_uv = fract(uv) * 2.0 - 1.0;
    vec2 id = floor(uv);

    float ball_mask = 0.0; //sCutPoint(block_uv, getPos(id), size);
    float line_mask = 0.0; 


    for (float y = -1.0; y <= 1.0; y++) {
        for (float x = -1.0; x <= 1.0; x++) {


            //if ( (x != 0.0 && x != -1.0) || y != 0.0 )  continue;
            //if ( x != 0.0 || y != 0.0)  continue;


            vec2 center_position = getPos(id, vec2(0, 0)); 
            vec2 current_position = getPos(id, vec2(x, y)); 

            ball_mask = max(ball_mask, sCutPoint(block_uv, current_position, size));

            if (x != 0.0 || y != 0.0) {
                line_mask = max(line_mask, line(block_uv, center_position, current_position)); 
            }
        }
    }
    


    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
    //color = vec4(block_uv.r, block_uv.g, 0.0, 1.0);





    color = mix(color, vec4(0.5, 1.0, 0.5, 1.0), line_mask);
    color = mix(color, vec4(1.0, 1.0, 1.0, 1.0), ball_mask);

    // grid
    float grid_mask = 0.0;
    grid_mask = max(grid_mask, sCut(block_uv.x, -1.0, 0.1));
    grid_mask = max(grid_mask, sCut(block_uv.x, 1.0, 0.1));
    grid_mask = max(grid_mask, sCut(block_uv.y, -1.0, 0.1));
    grid_mask = max(grid_mask, sCut(block_uv.y, 1.0, 0.1));
    color = mix(color, vec4(0.0, 0.0, 1.0, 1.0), grid_mask);

   // 
    //color.rg = Hash22(id); 

    //
    //
    //mask = Hash22(uv).x;
    //color = vec4(mask, mask, mask, 1.0);

    fragColor = color;
}