import * as twgl from 'twgl.js';

import vert_source from './base.vert'
import frag_source from './base.frag'

class BaseEffect {

    constructor() {
        this.gl = null;
        this.arrays = null;
        this.programInfo = null;
        this.bufferInfo = null;
    }

    render(time) {
        twgl.resizeCanvasToDisplaySize(this.gl.canvas);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    
        const uniforms = this.computeUniforms(time);
    
        this.gl.useProgram(this.programInfo.program);
        twgl.setBuffersAndAttributes(this.gl, this.programInfo, this.bufferInfo);
        twgl.setUniforms(this.programInfo, uniforms);
        twgl.drawBufferInfo(this.gl, this.bufferInfo);
    }

    setup(gl, vert, frag) {
        this.shutdown();

        if (!vert)
            vert = vert_source;

        if (!frag)
            frag = frag_source;

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

        this.programInfo = twgl.createProgramInfo(this.gl, [vert,frag]);
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
        const uniforms = {
            time: time * 0.001,
            resolution: [this.gl.canvas.width, this.gl.canvas.height],
        };
        return uniforms;       
    }
}
export default BaseEffect;