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
    point: { x: number, y: number };
    width: number;
    height: number;

    constructor(point: any, width: number, height: number) {
        super();
        this.point = point;
        this.width = width;
        this.height = height;
    }
}