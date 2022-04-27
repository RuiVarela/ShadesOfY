#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')

const float line_size = 0.06;
const float blobs = 15.0;

void main() {
  vec2 uv = nomalizeCoord(resolution, gl_FragCoord.xy);

  uv = rotate(uv, time * 0.3);

  float dist = length(uv);
  float polar = atan(uv.y, uv.x);

  float current_blobs = blobs * pSin(time * 0.8);
  float radius = 0.8 + sin(polar * current_blobs) * 0.09;


  float visible_region = smoothstep(PI, PI - (PI / 4.0), abs(polar));

  float color = sCut(dist, radius, line_size) * visible_region;


  //background
  vec3 background = backgroundPalette(resolution, gl_FragCoord.xy, ColorIq3, time * 0.01) * 0.7;
  vec3 foreground = vec3(1.0, 1.0, 1.0);
  fragColor = vec4(mix(background, foreground, color), 1.0);
}