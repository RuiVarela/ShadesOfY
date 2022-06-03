#pragma glslify: import('./common/PixelEffectFragmentHeader.glsl')
#pragma glslify: import('./common/Raymarching.glsl')

// https://www.youtube.com/watch?v=PGtv-dBi2wE&list=PLGmrMu-IwbgtMxMiV3x4IrHPlPmg7FD-P&index=2

#define SPHERE_ID 1.0
#define GROUND_PLANE_ID 2.0
#define BACK_PLANE_ID 3.0

void computeHit(in Camera camera, in vec3 position, inout Hit hit) {
    vec4 sphere = vec4(0.0 + pSin(time * 1.0), 1.0 + pSin(time * 3.0) * 1.0, 6.0, 1.0); //xyz + w=radius
    float sphere_distance = length(position - sphere.xyz) - sphere.w;
    hit.dist = sphere_distance;
    hit.object = SPHERE_ID;
    //hit.dist = min(hit.dist, sphere_distance);
    //hit.object = (hit.dist == sphere_distance) ? SPHERE_ID : hit.object;

    // ground plane at (0)
    float ground_plane_distance = position.y;
    hit.dist = min(hit.dist, ground_plane_distance);
    hit.object = (hit.dist == ground_plane_distance) ? GROUND_PLANE_ID : hit.object;


    float back_distance = abs(position.z - 10.0);
    hit.dist = min(hit.dist, back_distance);
    hit.object = (hit.dist == back_distance) ? BACK_PLANE_ID : hit.object;
}

void main() {
    vec2 uv = nomalizeCoord(resolution, gl_FragCoord.xy);

    float t = time;

    vec3 light_position = vec3(2.0, 2.0, 4.0);
    light_position.xy += vec2(sin(time), cos(time) + 1.0) *2.0;


    Camera camera = createCamera();
    camera.ro = vec3(0.0, 1.0, 0.0);
    camera.lookat = vec3(0.0, 1.0, 6.0);
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


    vec3 color_picker = when_eq(vec3(hit.object), vec3(SPHERE_ID, GROUND_PLANE_ID, BACK_PLANE_ID));
    vec3 object_color = color_picker.x * vec3(1.0, 0.0, 0.0) + 
                        color_picker.y * vec3(0.0, 1.0, 0.0) + 
                        color_picker.z * vec3(0.0, 0.0, 1.0);

    object_color = object_color * (1.0 - 0.5 * in_shadow); 

    vec3 color = object_color * vec3(0.2 + 0.8 * diffuse);


    fragColor = vec4(color, 1.0);
}