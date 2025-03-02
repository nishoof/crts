import { Circle, pivotRect, Rect, Triangle, Shape } from "../shapes.js";

type Point = { x: number, y: number };

export class Character {
    name: string;
    shape: Shape;
    turret: pivotRect;
    bulletSpeed: number;
    bulletHealth: number; // pierce and damage
    fireRate: number;               // bullets per second
    bulletRadius: number;
    bulletLifetime: number;         // how many milliseconds is a bullet alive
    possibleEvolutions: string[];
    levelUp: number;

    lastShot: number; // time of last shot

    constructor(name: string, shape: Shape, turret: pivotRect, bulletSpeed: number, bulletHealth: number, fireRate: number, bulletRadius=2, bulletLifetime=5000) {
        this.name = name;
        this.shape = shape;
        this.turret = turret;
        this.bulletSpeed = bulletSpeed;
        this.bulletHealth = bulletHealth;
        this.fireRate = fireRate;

        this.bulletRadius = bulletRadius;
        this.bulletLifetime = bulletLifetime;

        this.possibleEvolutions = [];
        this.levelUp = Infinity;

        this.lastShot = 0;
    }

    fire(): Bullet | null {
        let now = performance.now();
        // firing too soon
        console.log("atempting to fire");
        if (now-this.lastShot < 1000/this.fireRate) {
            console.log("too early");
            return null;
        }

        this.lastShot = now;

        let bullet = new Bullet(new Circle("black", {x: this.shape.center.x, y: this.shape.center.y}, this.bulletRadius), this.bulletHealth);
        bullet.shape.rotation = this.shape.rotation;
        bullet.shape.speed = this.bulletSpeed;
        return bullet;
    }

    draw(ctx: CanvasRenderingContext2D, topLeft: Point) {
        this.shape.draw(ctx, topLeft);
        this.turret.center = this.shape.center;
        this.turret.rotation = this.shape.rotation;
        this.turret.draw(ctx, topLeft);
    }
}

export class Rifleman extends Character {
    constructor(position: Point) {
        super("Rifleman", new Circle("red", position, 7), new pivotRect("red", position, 20, 5), 100, 10, 3);
        this.possibleEvolutions = ["Gunner", "Sniper", "Cannoneer"];
        this.levelUp = 10;
    }
}

export class Gunner extends Character {
    constructor(position: Point) {
        super("Gunner", new Circle("blue", position, 11), new pivotRect("red", position, 20, 5), 100, 10, 5);
        this.possibleEvolutions = ["Gatling", "Sprayer"];
        this.levelUp = 20;
    }
}

export class Sniper extends Character {
    constructor(position: Point) {
        super("Sniper", new Triangle("gray", position, 20, 26), new pivotRect("gray", position, 20, 5), 300, 40, 2.5, 3, 10000);
        this.possibleEvolutions = ["Hitman"];
        this.levelUp = 20;
    }
}

export class Cannoneer extends Character {
    constructor(position: Point) {
        super("Cannoneer", new Rect("brown", position, 12, 12), new pivotRect("red", position, 20, 5), 80, 35, 2.5, 6);
        this.possibleEvolutions = ["Triple Shot", "Bomber"];
        this.levelUp = 20;
    }
}

export class Gatling extends Character {
    constructor(position: Point) {
        super("Gatling", new Circle("green", position, 12), new pivotRect("darkgreen", position, 20, 5), 100, 10, 7);
    }
}

export class Hitman extends Character {
    constructor(position: Point) {
        super("Hitman", new Triangle("black", position, 20, 30), new pivotRect("black", position, 20, 5), 300, 70, 2, 3, 10000);
    }
}

export class Bomber extends Character {
    constructor(position: Point) {
        super("Bomber", new Rect("gray", position, 12, 12), new pivotRect("black", position, 20, 10), 80, 40, 2.5, 9);
    }
}

export class Bullet {
    shape: Circle;
    bulletHealth: number;
    spawnTime: number;

    constructor(shape: Circle, bulletHealth: number) {
        this.shape = shape;
        this.bulletHealth = bulletHealth;
        this.spawnTime = performance.now();
    }

    updateHealth(damage: number): number{
        this.bulletHealth -= damage;
        return this.bulletHealth;
    }
}
