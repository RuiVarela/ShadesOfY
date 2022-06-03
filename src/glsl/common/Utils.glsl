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

// https://theorangeduck.com/page/avoiding-shader-conditionals

// returns 1.0 when the condition is met and 0.0 otherwise
float when_eq(float x, float y) { return 1.0 - abs(sign(x - y)); }
vec2 when_eq(vec2 x, vec2 y)    { return 1.0 - abs(sign(x - y)); }
vec3 when_eq(vec3 x, vec3 y)    { return 1.0 - abs(sign(x - y)); }
vec4 when_eq(vec4 x, vec4 y)    { return 1.0 - abs(sign(x - y)); }

vec4 when_neq(vec4 x, vec4 y) { return abs(sign(x - y)); }
vec4 when_gt(vec4 x, vec4 y) { return max(sign(x - y), 0.0); }
vec4 when_lt(vec4 x, vec4 y) { return max(sign(y - x), 0.0); }
vec4 when_ge(vec4 x, vec4 y) { return 1.0 - when_lt(x, y); }
vec4 when_le(vec4 x, vec4 y) { return 1.0 - when_gt(x, y); }

vec4 when_and(vec4 a, vec4 b) { return a * b; }
vec4 when_or(vec4 a, vec4 b) { return min(a + b, 1.0); }
vec4 when_xor(vec4 a, vec4 b) { return (a + b) % 2.0; }
vec4 when_not(vec4 a) { return 1.0 - a; }