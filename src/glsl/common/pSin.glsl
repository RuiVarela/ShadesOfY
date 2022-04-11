// positive sin, rescales sin to fit in [0, 1]
float pSin(float a) {
  return (0.5 * sin(a) + 0.5);
}

#pragma glslify: export(pSin)