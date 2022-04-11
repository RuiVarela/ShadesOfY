#version 300 es
precision mediump float;

out vec4 fragColor;

uniform vec2 resolution;
uniform float time;

#pragma glslify: pSin = require('./common/pSin.glsl')
#pragma glslify: sCut = require('./common/sCut.glsl')

const float PI = 3.141592;

void main() {
  vec2 uv = 2.0 * (gl_FragCoord.xy / resolution) - 1.0;
  uv.x *= (resolution.x / resolution.y);

  float dist = length(uv);

  float polar = atan(uv.y, uv.x);
  float line_size = 0.06;
  float blobs = 15.0;
  float radius = 0.8 + sin(polar * blobs * pSin(time, 1.0)) * 0.09;

  float color = sCut(dist, radius, line_size);

  fragColor = vec4(color, 0.0, 0.0, 1.0);
}