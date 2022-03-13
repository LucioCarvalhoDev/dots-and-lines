/**
 * @module module:Drafter2D
 */

import Dot from "../models/Dot.js";

export default class Drafter2D {
    /**
     *
     * @param {HTMLElement} canvas
     */
    constructor(canvas) {
        this.canvas = canvas;

        this.brush = this.canvas.getContext("2d");
    }

    /**
     * 
     * @param {Number} width screen width 
     * @param {Number} height screen height 
     */
    clear(width, height) {
        this.brush.clearRect(0, 0, width, height);
    }

    /**
     *
     * @param {Number} x
     * @param {Number} y
     * @param {String} color
     */
    dots(dots, color = "#ffffff") {

        dots.forEach(dot => {
            this.brush.beginPath();
            this.brush.arc(dot.x, dot.y, 2.5, 0, Math.PI * 2);
            this.brush.fillStyle = color;
            this.brush.fill();
            this.brush.closePath();
        });

    }

    /**
     *
     * @param {Dot} dot1
     * @param {Dot} dot2
     * @param {Sting} color
     */
    line(dot1, dot2, color) {
        this.brush.beginPath();

        this.brush.moveTo(dot1.x, dot1.y);
        this.brush.lineTo(dot2.x, dot2.y);

        // Fill with gradient
        this.brush.strokeStyle = color;
        this.brush.stroke();

        this.brush.closePath();
    }
}
