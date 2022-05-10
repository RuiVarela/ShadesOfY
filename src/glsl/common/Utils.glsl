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

// makes a bar on a region [position - line_size, position + line_size] width a controllable fade
float sBar(float v, float position, float line_size, float fade_size) {
    return 1.0 - smoothstep(0.0, fade_size, abs(v - position) - line_size + fade_size);
}

// cuts a point
float sCutPoint(vec2 v, vec2 position, float size) {
    float d = distance(v, position);
    return smoothstep(-size, 0.0, d) - smoothstep(0.0, size, d);
}


// Hashing 
float Hash21(vec2 p) {
    p = fract(p * vec2(233.34, 851.73));
    p += dot(p, p + 23.45);
    return fract(p.x*p.y);
}

vec2 Hash22(vec2 p) {
    float n = Hash21(p);
    return vec2(n, Hash21(p + n));
}

