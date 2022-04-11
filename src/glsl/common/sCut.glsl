// smooth cuts a region on [position - line_size, position + line_size]
float sCut(float v, float position, float line_size) {
  return smoothstep(position - line_size, position, v) -
         smoothstep(position, position + line_size, v);
}

#pragma glslify: export(sCut)