/**
 * @module module:Dot
 */

import { GAME_RULES } from "../controllers/CanvasController.js";

export default class Dot {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} dir 0~360
     * @param {number} speed
     */
    constructor(x, y, dir, speed, state, hp) {
        this.x = x;
        this.y = y;

        this.dir = dir;
        this.speed = speed;

        this.state = state;
        this.hp = hp;
        this.rate = 1;
    }

    /**
     * Atualiza posição e estado proprios
     * @param {Number} canvasWidth 
     * @param {Number} canvasHeight 
     * @returns {0|1} Se o dot continua vivo
     */
    update(canvasWidth, canvasHeight) {
        this.move();

        if (this.state === 'born') {
            if (this.hp >= 100) {
                this.hp = 100;
                this.state = 'idle';
            } else {
                this.hp += this.rate;
            }
        } else if (this.state === 'dying') {
            this.hp -= this.rate;
            if (this.hp <= 0) {
                this.hp = 0;
                return 0;
            }
        }

        if ((this.x < -GAME_RULES.dotDistanceToDie || this.x > canvasWidth + GAME_RULES.dotDistanceToDie) ||
            (this.y < -GAME_RULES.dotDistanceToDie || this.y > canvasHeight + GAME_RULES.dotDistanceToDie)) {
            return 0;
        } else {
            return 1;
        }
    }

    _distanceTo(otherDot) {
        let c1 = this.x - otherDot.x;
        let c2 = this.y - otherDot.y;
        let d = Math.sqrt(c1 ** 2 + c2 ** 2);
        return d;
    }

    _degToRad(deg) {
        return deg * (Math.PI / 180);
    }

    /**
     * Atualiza sua posição
     */
    move() {
        const movX = Math.cos(this._degToRad(this.dir)) * this.speed;
        const movY = Math.sin(this._degToRad(this.dir)) * this.speed;

        this.x += movX;
        this.y += movY;
    }

    die() {
        this.state = 'dying';
    }
}