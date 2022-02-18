/**
 * @module module:CanvasController
 */

export const GAME_RULES = {
    dotDistanceToDie: 200,
    dotPopulation: localStorage.getItem('dotPopulation') || 35,
    lineMaxLenght: localStorage.getItem('lineMaxLenght') || 255
};

import Dot from "../models/Dot.js";
import Drafter from "../views/Drafter.js";
import { _math } from "../helper/_math.js";

export default class CanvasController {
    /**
     * @constructor
     * @param {HTMLElement} target Elemento canvas
     */
    constructor(target) {
        this.canvas = {
            element: target,
            width: target.clientWidth,
            height: target.clientHeight
        };

        this.drafter = new Drafter(this.canvas.element);

        this.dots = [];
    }

    /**
     * Atualiza o tamanho do canvas
     * @param {Number} _width nova largura 
     * @param {Number} _height nova altura
     */
    display(_width, _height) {
        this.canvas.width = _width;
        this.canvas.height = _height;

        this.canvas.element.width = _width;
        this.canvas.element.height = _height;
    }

    /**
     * Cria uma nova instancia Dot e adiciona a lista
     * @param {Number} _x 
     * @param {Number} _y 
     * @param {Number} _dir 
     * @param {Number} _speed 
     * @param {"Born"|"Idle"} _state 
     * @param {Number} _hp 
     */
    _createDot(_x = undefined, _y = undefined, _dir = undefined, _speed = undefined, _state = undefined, _hp = undefined) {
        const x = _x || _math.numberBetween(-GAME_RULES.dotDistanceToDie, this.canvas.width + GAME_RULES.dotDistanceToDie);
        const y = _y || _math.numberBetween(-GAME_RULES.dotDistanceToDie, this.canvas.height + GAME_RULES.dotDistanceToDie);
        const dir = _dir != undefined ? _dir : Math.round(Math.random() * 360);
        const speed = _speed || Math.random() * 2 + 0.1;
        const state = _state || 'idle';
        const hp = state === 'born' ? 0 : 100;

        const dot = new Dot(x, y, dir, speed, state, hp);
        dot.rate = _math.numberBetween(0.1, 1);
        this.dots.push(dot);
    }

    /**
     * Cria n dots com state 'born'
     * @param {Number} n Quantidade de Dots que devem ser criados
     */
    rePopulate(n = 1) {
        for (let i = 1; i <= n; i++) {
            this._createDot(undefined, undefined, undefined, undefined, 'born');
        }
    }

    /**
     * Cria n dots
     * @param {Number} n 
     */
    populate(n = 1) {
        for (let i = 1; i <= n; i++) {
            this._createDot();
        }
    }

    /**
     * Atualiza o estado e posição de cada dot
     * @returns {Number} Nova população
     */
    updateDots() {
        this.dots.forEach((dot, idx) => {
            if (!dot.update(this.canvas.width, this.canvas.height)) {
                delete this.dots[idx];
            }
        });
        this.dots = this.dots.filter(d => d);
        return this.dots.length;
    }

    /**
     * Muda o state de dots aleatorios para 'dying'
     * @param {Number} n Quantidade de dots para matar
     */
    kill(n) {
        for (let i = 0; i < n; i++) {
            this.dots[i].rate = _math.numberBetween(0.01, 2);
            this.dots[i].die();
        }
    }

    /**
     * Desenha dots visiveis
     * @returns {Number} Quantidade de dots visiveis
     */
    renderDots() {
        this.drafter.brush.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const visibleDots = this.dots.filter(dot =>
            dot.x >= - 5 && dot.x <= this.canvas.width + 5 &&
            dot.y >= - 5 && dot.y <= this.canvas.height + 5
        );

        visibleDots.forEach(dot => {
            const opacity = Math.round(255 * dot.hp / 100)
                .toString(16).padStart(2, '0');

            const color = '#ffffff' + opacity;
            this.drafter.dot(dot.x, dot.y, color);
        });

        return visibleDots.length;
    }

    /**
     * Desenha linhas visiveis
     */
    renderLines() {
        const dotList = [].concat(this.dots);
        const maxDistance = 255 * GAME_RULES.lineMaxLenght / 100;
        const screenWalls = [
            [{ x: 0, y: 0 }, { x: this.canvas.width, y: 0 }],
            [{ x: 0, y: this.canvas.height }, { x: this.canvas.width, y: this.canvas.height }],
            [{ x: 0, y: 0 }, { x: 0, y: this.canvas.height }],
            [{ x: this.canvas.width, y: 0 }, { x: this.canvas.width, y: this.canvas.height }],
        ];
        
        // evita linhas repetidas
        for (let i = 0; i < this.dots.length; i++) {
            const dotStart = dotList.splice(0, 1)[0];
            
            for (let j = i + 1; j < this.dots.length; j++) {
                const dotEnd = this.dots[j];
                
                const distance = dotStart._distanceTo(dotEnd);
                
                if (distance < maxDistance) {
                    const lineWillBeVisible = screenWalls.map(([w1, w2]) => {

                        if ((this._isPointInsideRect(dotStart, [0, 0], [this.canvas.width, this.canvas.height])) ||
                            this._isPointInsideRect(dotEnd, [0, 0], [this.canvas.width, this.canvas.height]))
                            return true;

                        return this._checkIfLinesCross(w1, w2, dotStart, dotEnd);
                    }).reduce((acc, cur) => acc || cur);


                    if (lineWillBeVisible) {
                        const baseLineOpacity = Math.abs((distance / maxDistance) - 1) * 255;
                        const medDotsOpacity = ((dotStart.hp + dotEnd.hp) / 2) / 100;
                        const opacity = Number(Math.round(baseLineOpacity * medDotsOpacity))
                            .toString(16).padStart(2, '0');

                        const color = "#ffffff" + opacity;

                        this.drafter.line(dotStart, dotEnd, color);
                    }
                }
            }
        }
    }

    /**
     * Atalho para atualizar e renderizar tudo
     * @returns {Number} população de dots
     */
    step() {
        const population = this.updateDots();
        this.renderDots();
        this.renderLines();
        return population;
    }

    _checkIfLinesCross(p1, p2, q1, q2) {
        // code from 
        const a = p1.x;
        const b = p1.y;
        const c = p2.x;
        const d = p2.y;
        const p = q1.x;
        const q = q1.y;
        const r = q2.x;
        const s = q2.y;

        var det, gamma, lambda;
        det = (c - a) * (s - q) - (r - p) * (d - b);
        if (det === 0) {
            return false;
        } else {
            lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
            gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
            return ((0 < lambda && lambda < 1) && (0 < gamma && gamma < 1));
        }
    }

    _isPointInsideRect({ x, y }, [x1, y1], [x2, y2]) {
        return (x > x1 && x < x2) && (y > y1 && y < y2);
    }

}