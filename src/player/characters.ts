import { Circle, pivotRect, Rect, Shape } from "../shapes.js";

export class Character {
    shape: Shape;
    turret: pivotRect;
    bulletSpeed: number;
    bulletRadius: number;
    bulletHealth: number;
    bulletLifetime: number;         // how many milliseconds is a bullet alive
    fireRate: number;               // bullets per second
    possibleEvolutions: string[];

    constructor(shape: Shape, turret: pivotRect) {
        this.shape = shape;
        this.turret = turret; 
        this.bulletSpeed = 100;
        this.bulletRadius = 2;
        this.bulletHealth = 10;
        this.bulletLifetime = 5000;
        this.fireRate = 3;
        this.possibleEvolutions = [];
    }

    fire(): Bullet {
        let bullet = new Bullet(new Circle("black", this.shape.center, this.bulletRadius), this.bulletHealth);
        bullet.shape.rotation = this.shape.rotation;
        bullet.shape.speed = this.bulletSpeed; 
        return bullet;
    }

    draw(ctx: CanvasRenderingContext2D, topLeft: { x: number; y: number; }) {
        this.shape.draw(ctx, topLeft);
        this.turret.center = this.shape.center;
        this.turret.rotation = this.shape.rotation;
        this.turret.draw(ctx, topLeft);
    }
}

export class Rifleman extends Character {
    constructor(position: { x: number, y: number }) {
        super(new Circle("red", position, 7), new pivotRect("red", position, 20, 5));
        this.possibleEvolutions = ["Gunner", "Sniper", "Cannoneer"];
    }
}

export class Gunner extends Character {
    constructor(position: { x: number, y: number }) {
        super(new Circle("brown", position, 11), new pivotRect("red", position, 20, 5));
        this.bulletSpeed = 150;
        this.bulletHealth = 15;
        this.fireRate = 3.5;
    }
}

export class Sniper extends Character {
    constructor(position: { x: number, y: number }) {
        super(new Circle("black", position, 13), new pivotRect("red", position, 20, 5));
        this.bulletSpeed = 500;
        this.bulletRadius = 4;
        this.bulletHealth = 50;
        this.fireRate = 0.5;
    }
}

export class Cannoneer extends Character {
    constructor(position: { x: number, y: number }) {
        super(new Circle("brown", position, 12), new pivotRect("red", position, 20, 5));
        this.bulletSpeed = 100;
        this.bulletRadius = 2;
        this.bulletHealth = 10;
        this.fireRate = 3;
    }
}

export class Bullet{
    shape: Circle;
    bulletHealth: number;
    constructor(shape: Circle, bulletHealth: number) {
        this.shape = shape;
        this.bulletHealth = bulletHealth;
    }
    updateHealth(damage: number) {
        this.bulletHealth -= damage;
    }
}
