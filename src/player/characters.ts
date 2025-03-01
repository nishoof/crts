import { Circle, Rect, Shape } from "../shapes.js";

export class Character {
    shape: Shape;
    bulletSpeed: number;
    bulletRadius: number;
    bulletDamage: number;
    bulletLifetime: number;         // how many milliseconds is a bullet alive
    fireRate: number;               // bullets per second
    possibleEvolutions: string[];

    constructor(shape: Shape) {
        this.shape = shape;
        this.bulletSpeed = 100;
        this.bulletRadius = 2;
        this.bulletDamage = 10;
        this.bulletLifetime = 5000;
        this.fireRate = 3;
        this.possibleEvolutions = [];
    }

    fire(mousePoint: { x: number, y: number }): Circle {
        let bullet = new Circle("black", this.shape.center, this.bulletRadius);
        bullet.rotation = Math.atan(mousePoint.x / mousePoint.y);
        bullet.speed = this.bulletSpeed;
        return bullet;
    }

    draw(ctx: CanvasRenderingContext2D, topLeft: { x: number; y: number; }) {
        this.shape.draw(ctx, topLeft);
    }
}

export class Rifleman extends Character {
    constructor(position: { x: number, y: number }) {
        super(new Circle("red", position, 7));
        this.possibleEvolutions = ["Gunner", "Sniper", "Cannoneer"];
    }
}

export class Gunner extends Character {
    constructor(position: { x: number, y: number }) {
        super(new Circle("brown", position, 11));
        this.bulletSpeed = 150;
        this.bulletDamage = 15;
        this.fireRate = 3.5;
    }
}

export class Sniper extends Character {
    constructor(position: { x: number, y: number }) {
        super(new Circle("black", position, 13));
        this.bulletSpeed = 500;
        this.bulletRadius = 4;
        this.bulletDamage = 50;
        this.fireRate = 0.5;
    }
}

export class Cannoneer extends Character {
    constructor(position: { x: number, y: number }) {
        super(new Circle("brown", position, 12));
        this.bulletSpeed = 100;
        this.bulletRadius = 2;
        this.bulletDamage = 10;
        this.fireRate = 3;
    }
}
