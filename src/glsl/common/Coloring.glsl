// https://iquilezles.org/www/articles/palettes/palettes.htm
// http://erkaman.github.io/glsl-cos-palette/
const vec3 ColorIq1[4] = vec3[4](vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.33,0.67));
const vec3 ColorIq2[4] = vec3[4](vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.10,0.20));
const vec3 ColorIq3[4] = vec3[4](vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.3,0.20,0.20));
const vec3 ColorIq4[4] = vec3[4](vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,0.5),vec3(0.8,0.90,0.30));
const vec3 ColorIq5[4] = vec3[4](vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,0.7,0.4),vec3(0.0,0.15,0.20));
const vec3 ColorIq6[4] = vec3[4](vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(2.0,1.0,0.0),vec3(0.5,0.20,0.25));
const vec3 ColorIq7[4] = vec3[4](vec3(0.8,0.5,0.4),vec3(0.2,0.4,0.2),vec3(2.0,1.0,1.0),vec3(0.0,0.25,0.25));

vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d){
    return a + b * cos(6.28318 * (c * t + d));
}

vec3 cosPalette(float t, vec3 parameters[4]){
    return cosPalette(t, parameters[0], parameters[1], parameters[2], parameters[3]);
}

vec3 backgroundPalette(vec2 resolution, vec2 coord, vec3 color[4], float t) {
  float xt = t + coord.x / resolution.x;
  float yt = coord.y / resolution.y;
  vec3 col = cosPalette(xt, color);

  // shadowing
  //col *= 0.5 + 0.5 * sqrt(4.0 * yt * (1.0 - yt));
  col *= 0.2 + 0.8 * sqrt(4.0 * yt * (1.0 - yt));
  return col;
}

