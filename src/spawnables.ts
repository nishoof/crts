import { Shape } from "./shapes";

class Orb{
    health: number;
    exp: number;
    rotationSpeed: number;
    shape: Shape;
    constructor(health: number, exp: number, rotationSpeed: number, shape: Shape) {
        this.health = health;
        this.exp = exp;
        this.rotationSpeed = rotationSpeed;
        this.shape = shape;
    }
    draw(ctx: CanvasRenderingContext2D, topLeft: {x: number, y: number}) {
        this.shape.rotation += this.rotationSpeed;
        this.shape.draw(ctx, topLeft);
    }
    updateHealth(damage: number) {
        this.health -= damage;
    }
}