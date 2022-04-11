#version 300 es
precision mediump float;

out vec4 fragColor;

uniform vec2 resolution;
uniform float time;

const float PI = 3.141592;

float cutout(float v, float position, float line_size) {
  return smoothstep(position - line_size, position, v) -
         smoothstep(position, position + line_size, v);
}

float positiveSin(float v, float scale) {
  return (0.5 * sin(v) + 0.5) * scale;
}

void main() {
  vec2 uv = 2.0 * (gl_FragCoord.xy / resolution) - 1.0;
  uv.x *= (resolution.x / resolution.y);

  float dist = length(uv);

  float polar = atan(uv.y, uv.x);
  float line_size = 0.06;
  float blobs = 15.0;
  float radius = 0.8 + sin(polar * blobs * positiveSin(time, 1.0)) * 0.09;

  float color = cutout(dist, radius, line_size);

  fragColor = vec4(color, 0.0, 0.0, 1.0);
}