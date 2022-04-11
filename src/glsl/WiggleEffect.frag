#version 300 es
precision mediump float;

#pragma glslify: pSin = require('./common/pSin.glsl')
#pragma glslify: sCut = require('./common/sCut.glsl')

#pragma glslify: rotate = require(glsl-rotate)



out vec4 fragColor;

uniform vec2 resolution;
uniform float time;

const float PI = 3.141592;
const float line_size = 0.06;
const float blobs = 15.0;

void main() {
  vec2 uv = 2.0 * (gl_FragCoord.xy / resolution) - 1.0;
  uv.x *= (resolution.x / resolution.y);

  uv = rotate(uv, time * 0.3);

  float dist = length(uv);
  float polar = atan(uv.y, uv.x);

  float current_blobs = blobs * pSin(time * 0.8);
  float radius = 0.8 + sin(polar * current_blobs) * 0.09;


  float visible_region = smoothstep(PI, PI - (PI / 4.0), abs(polar));

  float color = sCut(dist, radius, line_size) * visible_region;

  fragColor = vec4(color, 0.0, 0.0, 1.0);
}