#version 300 es

precision mediump float;

// output fragment color
out vec4 fragColor;

// input uniforms
uniform vec2 resolution;
uniform float time;
uniform vec4 mouse;    // xy = current mouse coords. abs(zw) = click pixel, zw > 0 = beeing dragged

//
// Common includes
//
#pragma glslify: import('./Utils.glsl')
#pragma glslify: import('./Coloring.glsl')
#pragma glslify: import('./Math.glsl')

