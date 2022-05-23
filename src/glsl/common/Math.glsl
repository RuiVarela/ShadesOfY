//
// constants
//
const float PI = 3.14159265359;
const float TWO_PI = 6.28318530718;
const float E = 2.71828182845904523;

//
// Rotations
// https://github.com/dmnsgn/glsl-rotate
//
mat2 rotation2d(float angle) {
	float s = sin(angle);
	float c = cos(angle);

	return mat2(
		c, -s,
		s, c
	);
}

mat3 rotation3dX(float angle) {
	float s = sin(angle);
	float c = cos(angle);

	return mat3(
		1.0, 0.0, 0.0,
		0.0, c, s,
		0.0, -s, c
	);
}

mat3 rotation3dY(float angle) {
	float s = sin(angle);
	float c = cos(angle);

	return mat3(
		c, 0.0, -s,
		0.0, 1.0, 0.0,
		s, 0.0, c
	);
}

mat3 rotation3dZ(float angle) {
	float s = sin(angle);
	float c = cos(angle);

	return mat3(
		c, s, 0.0,
		-s, c, 0.0,
		0.0, 0.0, 1.0
	);
}

mat4 rotation3d(vec3 axis, float angle) {
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;

  return mat4(
		oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
        oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
        oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
		0.0,                                0.0,                                0.0,                                1.0
	);
}

vec2 rotate(vec2 v, float angle) {
	return rotation2d(angle) * v;
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
	return (rotation3d(axis, angle) * vec4(v, 1.0)).xyz;
}

vec3 rotateX(vec3 v, float angle) {
	return rotation3dX(angle) * v;
}

vec3 rotateY(vec3 v, float angle) {
	return rotation3dY(angle) * v;
}

vec3 rotateZ(vec3 v, float angle) {
	return rotation3dZ(angle) * v;
}

//
// https://iquilezles.org/articles/functions/
// Sinc curve
//
float sincZero( float x, float k )
{
    float a = PI*(k*x-1.0);
    return sin(a)/a;
}

//
// Computes the distance from a point p to a line segment [a, b]
//
float distanceToLineSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float projection = dot(pa, ba) / dot(ba, ba);
    float t = clamp(projection, 0.0, 1.0); // line segment

    return length(pa - (ba * t));
}