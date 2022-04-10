precision mediump float;

uniform vec2 resolution;
uniform float time;

const float PI = 3.141592;

float cutout(float v, float position, float line_size) {
  return smoothstep(position - line_size, position, v) * 
         smoothstep(position + line_size, position, v);
}

void main() {
  vec2 uv = 2.0 * (gl_FragCoord.xy / resolution) - 1.0;
  uv.x *= (resolution.x / resolution.y);

  float dist = length(uv);

  float polar = atan(uv.y, uv.x);
  float line_size = 0.06;
  float radius = 0.8 + sin(polar * 60.0) * 0.09;
  float color = cutout(dist, radius, line_size);


  gl_FragColor = vec4(color, 0.0, 0.0, 1.0);
}