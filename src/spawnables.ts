import { Shape } from "./shapes";

class Orb{
    health: number;
    shape: Shape;
    rotationSpeed: number;
    constructor(health: number, shape: Shape, rotationSpeed: number) {
        this.health = health;
        this.shape = shape;
        this.rotationSpeed = rotationSpeed;
    }
    draw(ctx: CanvasRenderingContext2D, topLeft: {x: number, y: number}) {
        this.shape.rotation += this.rotationSpeed;
        this.shape.draw(ctx, topLeft);
    }
}