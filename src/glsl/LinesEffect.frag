#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')
#pragma glslify: import('./common/SDF2d.glsl')

const float line_size = 0.03;
const float radius = 0.5;

// keyhole
float keyHole(in vec2 id, in vec2 position) {

  float rotation = 0.0;

  float x_odd = mod(id.x, 2.0);
  float y_odd = mod(id.y, 2.0);
  float x_even = 1.0 - x_odd;
  float y_even = 1.0 - y_odd;

  
  rotation += x_even * y_even * (PI / 2.0);
  rotation += y_odd * PI;
  rotation += y_odd * x_odd * (PI / 2.0);

  position = rotate(position, rotation);


  float d = 100.0;
  float roundness = 0.1 + pSin(time * 0.2) * 0.8;

  d = min(d, sdBox(position + vec2(0.5, 0.5), vec2(0.5, 0.5)) - roundness);
  d = min(d, sdCircle(position, 0.6));

  return d;
}


void main() {
  vec2 uv = nomalizeCoord(resolution, gl_FragCoord.xy);

  uv = rotate(uv, -time * 0.005);

  float move_speed = 0.1;
  float scaler = 6.0;
  vec2 local_uv = uv * scaler;
  vec2 local_id = floor(local_uv);

  float offset = mod(floor((local_id.y + 1.0) / 2.0), 2.0) * 2.0 - 1.0;

  uv.x -= offset * time * move_speed;
  local_uv = uv * scaler;
  local_id = floor(local_uv);
  local_uv = fract(local_uv) * 2.0 - 1.0;

  vec3 foreground = vec3(1.0, 1.0, 1.0);
  vec3 color = backgroundPalette(resolution, gl_FragCoord.xy, ColorIq6, time * 0.01) * 0.7;


  color = mix(color, foreground, sCut(keyHole(local_id, local_uv), 0.0, line_size));  

  //color = mix(color, foreground, sCut(abs(local_uv.x), 1.0, line_size));   // vertical
  //color = mix(color, foreground, sCut(abs(local_uv.y), 1.0, line_size));   // horizontal


  fragColor = vec4(color, 1.0);
}