"use strict";
/**
 *
 * detectCollision()
 *
 * class Body
 *   draw()
 *   collision()
 *
 * class Triangle, Rect, Circle extends Body
 *
 */
class Body {
    draw() {
    }
    collision() {
    }
}
class Rect extends Body {
    constructor(point, width, height) {
        super();
        this.point = point;
        this.width = width;
        this.height = height;
    }
}
