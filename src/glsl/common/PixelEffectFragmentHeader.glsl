#version 300 es

precision mediump float;

// output fragment color
out vec4 fragColor;

// input uniforms
uniform vec2 resolution;
uniform float time;

//
// Common includes
//
// Utils.glsl
#pragma glslify: import('./Utils.glsl')

