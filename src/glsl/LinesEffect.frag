#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')

const float line_size = 0.03;
const float radius = 0.5;

void main() {
  vec2 uv = nomalizeCoord(resolution, gl_FragCoord.xy);

  uv *= 0.2 + pSin(time);

  vec2 local_uv = uv * 3.0;
  local_uv = fract(local_uv) * 2.0 - 1.0;

  float color = 0.0;

  // circle
  float dist = length(local_uv);
  color = max(color, sCut(dist, radius, line_size));

  // vertical
  color = max(color, sCut(abs(local_uv.x), 1.0, line_size));

  // horizontal
  color = max(color, sCut(abs(local_uv.y), 1.0, line_size));

  fragColor = vec4(color, color,color, 1.0);
}