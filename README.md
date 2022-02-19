# Dots and Points

Package for creation of a simple and elegant customizable procedural animation like [this](https://luciocarvalhodev.github.io/dots/).

## Installation

For now only by download/clone.

## Usage

```
/* Basic Functions */

import CanvasController from 'dots-and-points';

const canvas = new CanvasController(document.getElementById('myCanvas'));

canvas.populate(30); // instance 30 dots with random props
canvas.renderDots(); // draw all dots in canvas
canvas.renderLines(); // draw lines that connect nearby points

// update positions of each dot based in velocity,
// diretion and current position
canvas.update()

/* Animate */

setInterval(function() {
    const population = canvas.step() // update + render

    if (population < 30) {
        canvas.rePopulate(30 - population);
    } else {
        canvas.kill(population - 30);
    }
}, 30)
```

> Dot population will decay naturally, so it's necessary check the quantity and replace them

## Documentation

* [Docs](https://luciocarvalhodev.github.io/dots-and-lines)
