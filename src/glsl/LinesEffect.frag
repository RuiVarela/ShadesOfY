#version 300 es
precision mediump float;

#pragma glslify: sCut = require('./common/sCut.glsl')

out vec4 fragColor;

uniform vec2 resolution;
uniform float time;


const float line_size = 0.03;
const float radius = 0.5;

void main() {
  vec2 uv = 2.0 * (gl_FragCoord.xy / resolution) - 1.0;
  uv.x *= (resolution.x / resolution.y);

  float color = 0.0;

  // circle
  float dist = length(uv);
  color = max(color, sCut(dist, radius, line_size));

  // vertical
  color = max(color, sCut(abs(uv.x), 0.9, line_size));

  // horizontal
  color = max(color, sCut(abs(uv.y), 0.9, line_size));


  fragColor = vec4(color, color,color, 1.0);
}