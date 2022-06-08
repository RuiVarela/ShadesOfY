#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')
#pragma glslify: import('./common/Raymarching.glsl')

// https://www.youtube.com/watch?v=PGtv-dBi2wE&list=PLGmrMu-IwbgtMxMiV3x4IrHPlPmg7FD-P&index=2

#define SPHERE_ID 1.0
#define GROUND_PLANE_ID 2.0
#define BACK_PLANE_ID 3.0
#define LIGHT_ID 4.0

vec3 getLigthPosition() {
    vec3 position = vec3(0.0, 1.5, 0.0);
    position.xz += vec2(sin(time), cos(time)) * 2.0;
    return position;
}

void computeHit(in Camera camera, in vec3 position, inout Hit hit) 
{
    // ground plane at (0)
    float ground_plane_distance = position.y;
    hit.dist = ground_plane_distance;
    hit.object = GROUND_PLANE_ID;
    //hit.dist = min(hit.dist, ground_plane_distance);
    //hit.object = (hit.dist == ground_plane_distance) ? GROUND_PLANE_ID : hit.object;


    float back_distance = abs(position.z - 6.0);
    hit.dist = min(hit.dist, back_distance);
    hit.object = (hit.dist == back_distance) ? BACK_PLANE_ID : hit.object;



    const vec3 spheres[9] = vec3[9] (
        vec3(-1.0, 1.0, -1.0), vec3( 0.0, 1.0, -1.0), vec3( 1.0, 1.0, -1.0),
        vec3(-1.0, 1.0,  0.0), vec3( 0.0, 1.0,  0.0), vec3( 1.0, 1.0,  0.0),
        vec3(-1.0, 1.0,  1.0), vec3( 0.0, 1.0,  1.0), vec3( 1.0, 1.0,  1.0)
    );

 //   spheres[spheres.length() - 1].xyz = getLigthPosition(); 

    for (int i = 0; i != spheres.length(); ++i) {
        float sphere_distance = sdSphere(position, spheres[i], 0.3);
        hit.dist = min(hit.dist, sphere_distance);
        hit.object = (hit.dist == sphere_distance) ? SPHERE_ID : hit.object;
    }

    // light 
    {
        float sphere_distance = sdSphere(position, getLigthPosition() + vec3(0.0, 0.2, 0.0), 0.05);
        hit.dist = min(hit.dist, sphere_distance);
        hit.object = (hit.dist == sphere_distance) ? LIGHT_ID : hit.object;
    }
}

void main() {
    vec2 uv = nomalizeCoord(resolution, gl_FragCoord.xy) * 0.5;

    float t = time;

    vec3 light_position = getLigthPosition();


    Camera camera = createCamera();
    camera.ro = vec3(0.0, 2.0, -5.0);
    camera.lookat = vec3(0.0, 1.0, 0.0);
    computeCamera(camera, uv);

    Hit hit = RayMarch(camera);

    // compute diffuse term
    vec3 light_vector = normalize(light_position - hit.point);
    float diffuse = clamp(dot(hit.normal, light_vector), 0.0, 1.0);

    // compute shadow - reuse camera
    camera.ro = hit.point + (hit.normal * camera.surface_distance * 2.0); // we need to start a bit away from the surface
    camera.rd = light_vector;
    camera.compute_normal = false;
    Hit shadow_march = RayMarch(camera);
    float in_shadow = (shadow_march.dist < distance(light_position, hit.point)) ? 1.0 : 0.0;


    vec3 ambient = vec3(1.0, 0.6, 0.001);


    vec4 color_picker = when_eq(vec4(hit.object), vec4(SPHERE_ID, GROUND_PLANE_ID, BACK_PLANE_ID, LIGHT_ID));
    vec3 object_color = color_picker.x * vec3(1.0, 0.0, 0.0) + 
                        color_picker.y * vec3(0.0, 1.0, 0.0) + 
                        color_picker.z * vec3(0.0, 0.0, 1.0) + 
                        color_picker.w * vec3(0.5, 0.5, 0.0);;

    object_color = object_color * (1.0 - 0.5 * in_shadow); 

    vec3 color = mix(ambient, object_color * diffuse, 0.85);


    fragColor = vec4(color, 1.0);
}