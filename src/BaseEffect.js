import * as twgl from 'twgl.js';

import BaseVertexSource from './BaseEffect.vert'
import BaseFragmentSource from './BaseEffect.frag'

class BaseEffect {

    constructor() {
        this.gl = null;
        this.arrays = null;
        this.programInfo = null;
        this.bufferInfo = null;

        this.vertexCode = BaseVertexSource
        this.fragmentCode = BaseFragmentSource
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
    }
    shutdown() {
        if (this.programInfo != null) {
            // delete shaders ?? 
            this.gl.deleteProgram(this.programInfo.program);
            this.programInfo = null;
        }

        if (this.bufferInfo != null) {
            for (const attrib of Object.values(this.bufferInfo.attribs)) 
                gl.deleteBuffer(attrib.buffer);
            
            if (this.bufferInfo.indices) 
                gl.deleteBuffer(this.bufferInfo.indices);

            this.bufferInfo = null;
        }
    }
    

    computeUniforms(time) {
        let uniforms = {
            time: time * 0.001,
            resolution: [this.gl.canvas.width, this.gl.canvas.height],
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
