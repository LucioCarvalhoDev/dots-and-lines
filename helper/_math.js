/**
 * @module
 */

export const _math = {
    /**
     * Escolhe aleatoriamente item de uma lista
     * @param  {...any} options valores possiveis 
     * @returns {any} valor escolhido
     */
    choose: (...options) => {
        return options[Math.round(Math.random() * (options.length - 1))];
    },
    /**
     * 
     * @param  {[Number, Number]} range 
     * @returns {Number}
     */
    numberBetween: (...range) => {
        const max = Math.max(...range);
        const min = Math.min(...range);
        // console.log(range, max, min);
        return Math.random() * (max - min) + min;
    },
    distanceBetween: (ax, ay, bx, by) => {
        let c1 = ax - bx;
        let c2 = ay - by;
        let d = Math.sqrt(c1 ** 2 + c2 ** 2);
        return d;
    }
}