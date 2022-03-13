import Drafter2D from "./Drafter2D.js";
import DrafterGL from "./DrafterGL.js";

function Drafter(canvas) {

    /** @type {WebGLRenderingContext} */
    let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (gl) {
        return new DrafterGL(canvas);
    } else {
        return new Drafter2D(canvas);
    }

}

export default Drafter;