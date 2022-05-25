#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')
#pragma glslify: import('./common/SDF2d.glsl')

const float line_size = 0.03;
const float radius = 0.5;

// keyhole
float sdf0(in vec2 position) {
  float d = 100.0;
  float roundness = pSin(time) * 0.4;

  d = min(d, sdBox(position + vec2(0.5, 0.6), vec2(0.5, 0.4)) - roundness);
  d = min(d, sdCircle(position, 0.6));

  return d;
}


// triangle
float sdf1(in vec2 position) {
  float d = 100.0;
  float roundness = pSin(time) * 0.0;

  float scale = 4.0;
  d = min(d, sdEquilateralTriangle((position - vec2(0.75, 0.7)) * scale) / scale - roundness);

/*
  // animate
  float t = time/3.0;
  float n = 3.0 + mod(floor(t),9.0);  // n, number of sides
  float a = fract(t);                 // angle factor
  float w = 2.0 + a*a*(n-2.0);        // angle divisor, between 2 and n  

  scale = 1.8;
  d = min(d, sdStar( (position + vec2(0.0, 0.5)) * scale, 0.7, int(n), w) / scale);
*/


  return d;
}


void main() {
  vec2 uv = nomalizeCoord(resolution, gl_FragCoord.xy);

  uv *= 0.2 + pSin(time * 0.1);

  vec2 local_uv = uv * 3.0;
  local_uv = fract(local_uv) * 2.0 - 1.0;

  vec3 foreground = vec3(1.0, 1.0, 1.0);
  vec3 color = backgroundPalette(resolution, gl_FragCoord.xy, ColorIq6, time * 0.01) * 0.7;


  color = mix(color, foreground, sCut(sdf0(local_uv), 0.0, line_size));  
  color = mix(color, foreground, sCut(sdf1(local_uv), 0.0, line_size));  

  color = mix(color, foreground, sCut(abs(local_uv.x), 1.0, line_size));   // vertical
  color = mix(color, foreground, sCut(abs(local_uv.y), 1.0, line_size));   // horizontal


  fragColor = vec4(color, 1.0);
}