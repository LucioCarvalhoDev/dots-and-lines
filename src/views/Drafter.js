/**
 * @module module:Drafter
 */

import Dot from "../models/Dot.js";

export default class Drafter {
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
     * @param {Number} x 
     * @param {Number} y
     * @param {String} color 
     */
    dot(x, y, size, color = "#ffffff") {
        this.brush.beginPath();

        this.brush.arc(x, y, size, 0, Math.PI * 2);
        this.brush.fillStyle = color;
        this.brush.fill();

        this.brush.closePath();
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