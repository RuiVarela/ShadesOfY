// positive sin, rescales sin to fit in [0, 1] and multiplies by scale in the end
float pSin(float a, float scale) {
  return (0.5 * sin(a) + 0.5) * scale;
}

#pragma glslify: export(pSin)