#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')
#pragma glslify: import('./common/Raymarching.glsl')

// https://www.youtube.com/watch?v=PGtv-dBi2wE&list=PLGmrMu-IwbgtMxMiV3x4IrHPlPmg7FD-P&index=2

struct Camera {
    vec3 ro;        // ray origin, position of the camera
    vec3 rd;        // ray direction

    vec3 lookat;    // lookup directeio
    vec3 up;        // up direction on the world
    float zoom;     // zoom value

    int max_steps;      // max ray marching steps
    float max_distance; // max ray marching distance to be considered an object
};


Camera createCamera() {
    Camera camera;
    camera.zoom = 1.0;

    camera.ro = vec3(0.0, 0.0, -2.0);
    camera.lookat = vec3(0.0, 0.0, 0.0);
    camera.up = vec3(0.0, 1.0, 0.0);

    camera.max_steps = 100;
    camera.max_distance = 100.0;
    return camera;
}

void computeCamera(inout Camera camera, in vec2 uv) {
    // compute camera basis vector
    vec3 f = normalize(camera.lookat - camera.ro); // forward
    vec3 r = cross(camera.up, f); // right
    vec3 u = cross(f, r);  // up
    
    // compute the intersection with the screen
    vec3 c = camera.ro + f * camera.zoom; // screen center
    vec3 i = c + uv.x * r + uv.y * u;   // screen intersection point

    // compute the ray direction
    camera.rd = i - camera.ro;
}


float RayMarch(in Camera camera) {
    float dO = 0.0; // distance from origin
    for (int i = 0; i != camera.max_steps; ++i) {

    }
    return dO;
}







float DistLine(in Camera camera, in vec3 p) {
    return length(cross(p - camera.ro, camera.rd)) / length(camera.rd);
}

float DrawPoint(in Camera camera, in vec3 p) {
    float d = DistLine(camera, p);
    d = smoothstep(0.06, 0.05, d);
    return d;
}

void main() {
    vec2 uv = nomalizeCoord(resolution, gl_FragCoord.xy);

    float t = time;

    Camera camera = createCamera();
    camera.ro = vec3(3.0 * sin(t), 2.0, -3.0 * cos(t));
    camera.lookat = vec3(0.5, 0.5, 0.5);
    computeCamera(camera, uv);


    //vec3 ro = vec3(0.0, 1.0, 0.0);                  
    //vec3 rd = normalize(vec3(uv.x, uv.y, 1.0));     // ray direction

    float d = 0.0;

    d += DrawPoint(camera, vec3(0.0, 0.0, 0.0));
    d += DrawPoint(camera, vec3(0.0, 0.0, 1.0));
    d += DrawPoint(camera, vec3(0.0, 1.0, 0.0));
    d += DrawPoint(camera, vec3(0.0, 1.0, 1.0));

    d += DrawPoint(camera, vec3(1.0, 0.0, 0.0));
    d += DrawPoint(camera, vec3(1.0, 0.0, 1.0));
    d += DrawPoint(camera, vec3(1.0, 1.0, 0.0));
    d += DrawPoint(camera, vec3(1.0, 1.0, 1.0));

    fragColor = vec4(d, d, d, 1.0);
}