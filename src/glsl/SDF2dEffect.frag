#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')
#pragma glslify: import('./common/SDF2d.glsl')

float sdf(in vec2 position) {
  float d = 100.0;

  float roundness = pSin(time) * 0.1;

  d = min(d, sdCircle(position - vec2(1.0, 0.0), 0.2) - roundness);
  d = min(d, sdBox(position - vec2(-1.0, 0.0), vec2(0.2, 0.4)) - roundness);

  float scale = 4.0;
  d = min(d, sdEquilateralTriangle( (position - vec2(0.0, 0.5)) * scale) / scale - roundness);


  // animate
  float t = time/3.0;
  float n = 3.0 + mod(floor(t),9.0);  // n, number of sides
  float a = fract(t);                 // angle factor
  float w = 2.0 + a*a*(n-2.0);        // angle divisor, between 2 and n  

  scale = 1.8;
  d = min(d, sdStar( (position + vec2(0.0, 0.5)) * scale, 0.7, int(n), w) / scale);


  return d;
}


const float line_size = 0.06;
const float blobs = 15.0;

void main() {
  vec2 uv = nomalizeCoord(resolution, gl_FragCoord.xy);
  uv *= 2.0;

  float d = sdf(uv);

  vec3 color = backgroundPalette(resolution, gl_FragCoord.xy, ColorIq2, time * 0.01) * 0.7;
  if (d < 0.0) 
    color = cosPalette(0.4, ColorIq7);
  
  //color *= 1.0 - exp(-6.0 * abs(d));
	//color *= 0.8 + 0.2*cos(150.0 * d);
	color = mix(color, vec3(1.0), sCut(d, 0.0, 0.01));

  fragColor = vec4(color, 1.0);
}