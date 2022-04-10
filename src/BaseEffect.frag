precision mediump float;

uniform vec2 resolution;
uniform float time;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  gl_FragColor = vec4(uv, 0.0, 1.0);
}