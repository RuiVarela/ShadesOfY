#version 300 es
precision mediump float;

out vec4 fragColor;

uniform vec2 resolution;
uniform float time;
uniform vec4  mouse;    // xy = current pixel coords (if LMB is down). zw = click pixel

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;

  vec4 color = vec4(uv, 0.0, 1.0);


  if ((gl_FragCoord.x < mouse.x) && (gl_FragCoord.y < mouse.y)) {
    vec4 highlight = vec4(0.0, 0.0, 1.0, 1.0);

    // drag
    if (mouse.z > 0.0 && mouse.w > 0.0) 
      highlight = vec4(1.0, 0.0, 0.0, 1.0);
    
    color = mix(color, highlight, 0.4); 
  } 

  if ((gl_FragCoord.x < abs(mouse.z)) && (gl_FragCoord.y < abs(mouse.w))) {
    vec4 highlight = vec4(0.0, 1.0, 0.0, 1.0);
    color = mix(color, highlight, 0.2); 
  } 
  
  fragColor = color;
}