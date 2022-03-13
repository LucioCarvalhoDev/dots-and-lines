# Dots Galaxy

Package for creation of simple and elegant customizable procedural animations like [this](https://luciocarvalhodev.github.io/dots/).

## Installation

`npm i dots-galaxy`

## Usage

```js
/* Basic Functions */

import CanvasController from "dots-galaxy";

const canvas = new CanvasController(document.getElementById("myCanvas"));

canvas.populate(30); // instance 30 dots with random props
canvas.renderDots(); // draw all dots in canvas
canvas.renderLines(); // draw lines that connect nearby points

// update positions of each dot based in velocity,
// diretion and current position
canvas.update();

/* Animate */

setInterval(function () {
  const population = canvas.step(); // update + render

  if (population < 30) {
    canvas.rePopulate(30 - population);
  } else {
    canvas.kill(population - 30);
  }
}, 30);
```

> Dot population will decay naturally, so it's necessary check the quantity and replace them

```js
/* Customization */

const rules = CanvasController.defaultRules();
/*
{
    screenMargin: 5,
    dotBornMode: 'randomChild',
    dotDirectionRange: [0, 359],
    dotColor: "#00ff00",
    dotFade: true,
    dotPopulation: 100,
    dotSize: 2.5,
    dotSpeed: 1,
    dotSpeedVariation: 0.5,
    lineColor: "#00ff00",
    lineFade: true,
    lineMaxLenght: 0,
};
*/

rules.dotPopulation = 200;
const canvas = new CanvasController(document.getElementById("myCanvas"), rules);
```

```js
/* Update Rules */
const canvas = new CanvasController(document.getElementById("myCanvas"));

const button = document.getElementById("increment");
button.onclick = () => {
  const curPopulation = canvas.rules.dotPopulation;
  canvas.setRules({ dotPopulation: curPopulation + 5 });
};
```

## Documentation

- [Docs](https://luciocarvalhodev.github.io/dots-galaxy)
