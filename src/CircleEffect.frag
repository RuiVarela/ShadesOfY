precision mediump float;

uniform vec2 resolution;
uniform float time;

float cutout(float v, float position, float line_size) {
  return smoothstep(position - line_size, position, v) * 
         smoothstep(position + line_size, position, v);
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;

  uv = uv * 2.0 - 1.0;

  float dist = length(uv);


  float line_size = 0.1;
  float radius = 0.8;



  float color = cutout(dist, radius, line_size);
  gl_FragColor = vec4(color, 0.0, 0.0, 1.0);
}