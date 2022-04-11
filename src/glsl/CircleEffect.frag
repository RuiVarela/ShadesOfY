#version 300 es
precision mediump float;

out vec4 fragColor;

uniform vec2 resolution;
uniform float time;

#pragma glslify: sCut = require('./common/sCut.glsl')

void main() {
  vec2 uv = 2.0 * (gl_FragCoord.xy / resolution) - 1.0;
  uv.x *= (resolution.x / resolution.y);

  float dist = length(uv);
  float line_size = 0.06;
  float radius = 0.8;
  float color = sCut(dist, radius, line_size);

  fragColor = vec4(color, color,color, 1.0);
}