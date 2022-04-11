#version 300 es
precision mediump float;

out vec4 fragColor;

uniform vec2 resolution;
uniform float time;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  fragColor = vec4(uv, 0.0, 1.0);
}