import * as twgl from 'twgl.js';

import BaseVertexSource from './glsl/BaseEffect.vert'
import BaseFragmentSource from './glsl/BaseEffect.frag'

class BaseEffect {

    constructor() {
        this.gl = null;
        this.arrays = null;
        this.programInfo = null;
        this.bufferInfo = null;

        this.vertexCode = BaseVertexSource
        this.fragmentCode = BaseFragmentSource

        this.mouse = [0, 0, 0, 0];
        this.mousemove = (event) => {
            this.mouse[0] = event.clientX;
            this.mouse[1] = event.clientY;

            //console.log(`mousemove ${this.mouse}`);
        };

        this.mousedown = (event) => {
            this.mouse[2] = event.clientX;
            this.mouse[3] = event.clientY;

            console.log(`mousedown ${this.mouse}`);
        };

        this.mouseup = (event) => {
            this.mouse[2] = -Math.abs(this.mouse[2]);
            this.mouse[3] = -Math.abs(this.mouse[3]);
            
            console.log(`mouseup ${this.mouse}`);
        };
    }

    render(time) {
        twgl.resizeCanvasToDisplaySize(this.gl.canvas);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    
        let uniforms = this.computeUniforms(time);
    
        this.gl.useProgram(this.programInfo.program);
        twgl.setBuffersAndAttributes(this.gl, this.programInfo, this.bufferInfo);
        twgl.setUniforms(this.programInfo, uniforms);
        twgl.drawBufferInfo(this.gl, this.bufferInfo);
    }

    setup(gl) {
        this.shutdown();

        this.gl = gl;
        this.arrays = {
            position: [
                -1, -1, 0,
                1, -1, 0,
                -1, 1, 0,
                -1, 1, 0,
                1, -1, 0,
                1, 1, 0],
        };

        this.programInfo = twgl.createProgramInfo(this.gl, [this.vertexCode, this.fragmentCode]);
        this.bufferInfo = twgl.createBufferInfoFromArrays(this.gl, this.arrays);

        this.gl.canvas.addEventListener('mousemove', this.mousemove);
        this.gl.canvas.addEventListener('mousedown', this.mousedown);
        this.gl.canvas.addEventListener('mouseup', this.mouseup);
    }
    shutdown() {
        if (this.programInfo != null) {
            // delete shaders ?? 
            this.gl.deleteProgram(this.programInfo.program);
            this.programInfo = null;
        }

        if (this.bufferInfo != null) {
            
            for (const attrib of Object.values(this.bufferInfo.attribs))
                this.gl.deleteBuffer(attrib.buffer);

            if (this.bufferInfo.indices)
                this.gl.deleteBuffer(this.bufferInfo.indices);

            this.bufferInfo = null;
        }

        if (this.gl != null) {
            this.gl.canvas.removeEventListener('mousemove', this.mousemove);
            this.gl.canvas.removeEventListener('mousedown', this.mousedown);
            this.gl.canvas.removeEventListener('mouseup', this.mouseup);
        }
    }
    

    computeUniforms(time) {
        let mouse = [... this.mouse]; // copy

        mouse[1] = this.gl.canvas.height - mouse[1];

        let sign = mouse[3] < 0 ? -1 : 1; 
        mouse[3] = sign * (this.gl.canvas.height - Math.abs(mouse[3]));

        let uniforms = {
            time: time * 0.001,
            resolution: [this.gl.canvas.width, this.gl.canvas.height],
            mouse: mouse
        };


        return uniforms;       
    }
}


class PixelEffect extends BaseEffect {
    constructor(fragment) {
        super();
        this.vertexCode = BaseVertexSource;
        this.fragmentCode = fragment;
    }
}

export { BaseEffect, PixelEffect };
