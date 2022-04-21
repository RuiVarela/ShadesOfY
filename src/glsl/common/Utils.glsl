// constants
const float PI = 3.14159265359;
const float TWO_PI = 6.28318530718;
const float E = 2.71828182845904523;

// normalizes the input keeping the screen aspect ratio
// - screen center will be at (0,0), 
// - Y will vary from -1 to 1 
// - X will extend to keep aspect ration
vec2 nomalizeCoord(vec2 screen_size, vec2 coord) {
  vec2 position = 2.0 * (coord.xy / screen_size.xy) - 1.0;
  position.x *= screen_size.x / screen_size.y;
  return position;
}


// positive sin, rescales sin to fit in [0, 1]
float pSin(float a) {
  return (0.5 * sin(a) + 0.5);
}

// smooth cuts a region on [position - line_size, position + line_size]
float sCut(float v, float position, float line_size) {
  return smoothstep(position - line_size, position, v) -
         smoothstep(position, position + line_size, v);
}

// cuts a point
float sCutPoint(vec2 v, vec2 position, float size) {
    float d = distance(v, position);
    return smoothstep(-size, 0.0, d) - smoothstep(0.0, size, d);
}

