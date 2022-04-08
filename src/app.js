import * as twgl from 'twgl.js';

import vert_source from './fx_base/base.vert'
import frag_source from './fx_base/base.frag'

const gl = document.querySelector("#gl_canvas").getContext("webgl");
const programInfo = twgl.createProgramInfo(gl, [
    vert_source,
    frag_source
]);

const arrays = {
    position: [
        -1, -1, 0,
        1, -1, 0,
        -1, 1, 0,
        -1, 1, 0,
        1, -1, 0,
        1, 1, 0],
};
const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

function render(time) {
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    const uniforms = {
        time: time * 0.001,
        resolution: [gl.canvas.width, gl.canvas.height],
    };

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, uniforms);
    twgl.drawBufferInfo(gl, bufferInfo);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);