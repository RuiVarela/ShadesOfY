struct Camera {
    vec3 ro;        // ray origin, position of the camera
    vec3 rd;        // ray direction

    vec3 lookat;    // lookup directeio
    vec3 up;        // up direction on the world
    float zoom;     // zoom value

    int max_steps;          // max ray marching steps
    float max_distance;     // max ray marching distance to be considered an object
    float surface_distance; // distance to consider as a hit
    bool compute_normal;    // should we compute the surface normal
};

struct Hit {
    float object;   // the id of the object hit
    vec3 point;     // the point that was actually hit
    vec3 normal;    // normal of the point
    float dist;     // distance from the ro
};

void computeHit(in Camera camera, in vec3 position, inout Hit hit);

Camera createCamera() {
    Camera camera;
    camera.zoom = 1.0;

    camera.ro = vec3(0.0, 0.0, -2.0);
    camera.lookat = vec3(0.0, 0.0, 0.0);
    camera.up = vec3(0.0, 1.0, 0.0);

    camera.max_steps = 100;
    camera.max_distance = 100.0;
    camera.surface_distance = 0.01;

    camera.compute_normal = true;
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
    camera.rd = normalize(i - camera.ro);

    // alternative
    
    //mat3 camera_mat = mat3(r, u, f);
    //camera.rd = normalize(camera_mat * vec3(uv, camera.zoom));
}

void computeAuxiliaryHitInfo(in Camera camera, in float travel, inout Hit hit) {
    hit.dist = travel;
    hit.point = camera.ro + camera.rd * travel;

    //
    // compute normal
    //
    if (camera.compute_normal) {
        vec2 e = vec2(0.01, 0.0);
        Hit s;
        computeHit(camera, hit.point, s);
        float dist = s.dist;

        computeHit(camera, hit.point - e.xyy, s);
        float dx = s.dist;

        computeHit(camera, hit.point - e.yxy, s);
        float dy = s.dist;

        computeHit(camera, hit.point - e.yyx, s);
        float dz = s.dist;

        hit.normal = normalize(dist - vec3(dx, dy, dz));
    }
}

Hit RayMarch(in Camera camera) {
    float travel = 0.0; // distance from origin
    Hit hit;

    for (int i = 0; i != camera.max_steps; ++i) {
        vec3 position = camera.ro + camera.rd * travel;
        computeHit(camera, position, hit);
        travel += hit.dist;

        if ((travel > camera.max_distance) || (hit.dist < camera.surface_distance)) 
            break;
    }

    computeAuxiliaryHitInfo(camera, travel, hit);
    
    return hit;
}


/*

    float DistLine(in Camera camera, in vec3 p) {
        return length(cross(p - camera.ro, camera.rd)) / length(camera.rd);
    }

    float DrawPoint(in Camera camera, in vec3 p) {
        float d = DistLine(camera, p);
        d = smoothstep(0.06, 0.05, d);
        return d;
    }

    camera.ro = vec3(3.0 * sin(t), 2.0, -3.0 * cos(t));
    d += DrawPoint(camera, vec3(0.0, 0.0, 0.0));
    d += DrawPoint(camera, vec3(0.0, 0.0, 1.0));
    d += DrawPoint(camera, vec3(0.0, 1.0, 0.0));
    d += DrawPoint(camera, vec3(0.0, 1.0, 1.0));

    d += DrawPoint(camera, vec3(1.0, 0.0, 0.0));
    d += DrawPoint(camera, vec3(1.0, 0.0, 1.0));
    d += DrawPoint(camera, vec3(1.0, 1.0, 0.0));
    d += DrawPoint(camera, vec3(1.0, 1.0, 1.0));
*/
