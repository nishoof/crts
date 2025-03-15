import { Shape, Rect } from "./shapes.js";

export class Orb{
    health: number;
    maxHealth: number;
    exp: number;
    rotationSpeed: number;
    shape: Shape;
    healthBar: Rect;
    healthBarBorder: Rect;
    constructor(health: number, exp: number, rotationSpeed: number, shape: Shape) {
        this.health = health;
        this.maxHealth = health;
        this.exp = exp;
        this.rotationSpeed = rotationSpeed;
        this.shape = shape;
        this.healthBar = new Rect("White", { x: this.shape.pivotCenter.x, y: this.shape.pivotCenter.y + 40}, 30, 4);
        this.healthBarBorder = new Rect("Black", {x: this.shape.pivotCenter.x, y: this.shape.pivotCenter.y + 40}, 34, 5);

    }
    draw(ctx: CanvasRenderingContext2D, topLeft: {x: number, y: number}) {
        this.shape.rotation += this.rotationSpeed;
        this.shape.draw(ctx, topLeft);
        if (this.maxHealth != this.health) {
            this.healthBar.pivotCenter = { x: this.shape.pivotCenter.x, y: this.shape.pivotCenter.y + 40 };
            this.healthBarBorder.pivotCenter = { x: this.shape.pivotCenter.x, y: this.shape.pivotCenter.y + 40 };
            this.healthBar.width = (this.health / this.maxHealth) * 30;
            this.healthBar.pivotCenter.x = this.shape.pivotCenter.x - 15 + this.healthBar.width/2;
            this.healthBarBorder.draw(ctx, topLeft);
            this.healthBar.draw(ctx, topLeft);
        }
    }
    updateHealth(damage: number): number {
        this.health -= damage;
        return this.health;
    }
}