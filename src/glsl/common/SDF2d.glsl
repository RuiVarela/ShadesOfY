//
// https://iquilezles.org/articles/distfunctions2d
//

float sdBox(in vec2 p, in vec2 size) {
    vec2 d = abs(p) - size;
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

float sdCircle(in vec2 p, in float radius) {
    return length(p) - radius;
}

float sdEquilateralTriangle(in vec2 p) {
    const float k = sqrt(3.0);
    p.x = abs(p.x) - 1.0;
    p.y = p.y + 1.0/k;
    if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    p.x -= clamp( p.x, -2.0, 0.0 );
    return -length(p)*sign(p.y);
}

//
//  animate
//
//  float t = iTime/3.0;
//  float n = 3.0 + mod(floor(t),9.0);  // n, number of sides
//  float a = fract(t);                 // angle factor
//  float w = 2.0 + a*a*(n-2.0);        // angle divisor, between 2 and n
//
float sdStar(in vec2 p, in float r, in int n, in float m) {
    // next 4 lines can be precomputed for a given shape
    float an = 3.141593/float(n);
    float en = 3.141593/m;  // m is between 2 and n
    vec2  acs = vec2(cos(an),sin(an));
    vec2  ecs = vec2(cos(en),sin(en)); // ecs=vec2(0,1) for regular polygon

    float bn = mod(atan(p.x,p.y),2.0*an) - an;
    p = length(p)*vec2(cos(bn),abs(sin(bn)));
    p -= r*acs;
    p += ecs*clamp( -dot(p,ecs), 0.0, r*acs.y/ecs.y);
    return length(p)*sign(p.x);
}
