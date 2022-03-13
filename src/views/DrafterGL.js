const vertexText = `
attribute vec4 vPos;
attribute float vSize;

void main()
{
    gl_Position = vPos;
    gl_PointSize = 5.0;
}
`;

const fragmentText = `
precision lowp float;

void main()
{
    vec4 color = vec4(1.0, 0.0, 0.0, 1.0);
    vec2 coord = gl_PointCoord - vec2(0.5);  //from [0,1] to [-0.5,0.5]
    if(length(coord) > 0.5)                  //outside of circle radius?
        discard;
    gl_FragColor = color;
}
`;
export default class DrafterGL {

    constructor(canvas) {
        this.canvas = canvas;

        /** @type {WebGLRenderingContext} */
        this.gl = this.canvas.getContext("webgl");

        this.init();
    }

    init() {
        const gl = this.gl;
        const vertexShader = this._createShader(gl, gl.VERTEX_SHADER, vertexText);
        const fragmentShader = this._createShader(gl, gl.FRAGMENT_SHADER, fragmentText);

        this.programDot = this._createProgram(gl, vertexShader, fragmentShader);
    }

    dots(dots, color = "#ffffff") {
        const gl = this.gl;

        const data = dots.reduce((acc, cur) => acc.concat(...this._normalizeCoords(500, 500, cur.x, cur.y)), []);

        const positionAttribLocation = gl.getAttribLocation(this.programDot, 'vPos');
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_DRAW);

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.useProgram(this.programDot);

        gl.enableVertexAttribArray(positionAttribLocation);
        const size = 2;
        gl.vertexAttribPointer(
            positionAttribLocation,
            size,
            gl.FLOAT,
            false,
            0,
            0
        );

        gl.clearColor(0.1, 0.1, .5, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.POINTS, 0, data.length / size);

        gl.deleteBuffer(positionBuffer);
    }

    line(dot1, dot2, color) {

    }

    clear() {

    }

    _createProgram(gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        const success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) return program;

        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }

    _createShader(gl, type, source) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }

        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    _normalizeCoords(width, height, _x, _y) {
        if (_x < width / 2) {
            _x = (_x / (width / 2)) - 1;
        } else if (_x > width / 2) {
            _x = (_x / 250) - 1;
        } else {
            _x = 0;
        }

        _y = height - _y;
        if (_y < height / 2) {
            _y = _y / (height / 2) - 1;
        } else if (_y > (height / 2)) {
            _y = (_y / 250) - 1;
        } else {
            _y = 0;
        }

        return [_x, _y];
    }
}