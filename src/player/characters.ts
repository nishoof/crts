class Character {
    shape: Shape;
    bulletSpeed: number;
    bulletRadius: number;
    bulletDamage: number;
    fireRate: number;       // bullets per second

    constructor(shape: Shape) {
        this.shape = shape;
        this.bulletSpeed = 100;
        this.bulletRadius = 2;
        this.bulletDamage = 10;
        this.fireRate = 3;
    }
}

class Gunner extends Character {
    constructor(position: { x: number, y: number }) {
        super(new Circle("red", position, 10, 10));
    }
}

class Sniper extends Character {
    constructor(position: { x: number, y: number }) {
        super(new Circle("black", position, 13, 13));
        this.bulletSpeed = 500;
        this.bulletRadius = 4;
        this.bulletDamage = 50;
        this.fireRate = 0.5;
    }
}
