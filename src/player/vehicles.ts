class Vehicle {
    shape: Shape;
    accelerationStat: number;
    maxSpeedStat: number;
    rotationSpeedStat: number;
    possibleEvolutions: string[];
    currentHealth: number;
    maxHealth: number;

    constructor(shape: Shape) {
        this.shape = shape;
        this.accelerationStat = 0;
        this.maxSpeedStat = 0;
        this.rotationSpeedStat = 0;
        this.possibleEvolutions = [];
        this.currentHealth = 100;
        this.maxHealth = 100;
    }

    // TODO:

    // accelerate() {
    //     throw new Error("accelrate() must be implemented in subclasses.");
    // }

    // run() {
    //     throw new Error("run() must be implemented in subclasses.")
    // }

    draw(ctx: CanvasRenderingContext2D, topLeft: { x: number; y: number; }) {
        this.shape.draw(ctx, topLeft);
    }

}

class Bike extends Vehicle {
    constructor(position: { x: number, y: number }) {
        super(new Rect("grey", position, 80, 10));
        this.possibleEvolutions = ["Car", "Moped", "Hoverboard"];
    }
}

class Car extends Vehicle {
    constructor(position: { x: number, y: number }) {
        super(new Rect("blue", position, 80, 40));
        this.possibleEvolutions = ["Truck", "Racecar"];
    }
}

class Truck extends Vehicle {
    constructor(position: { x: number, y: number }) {
        super(new Rect("grey", position, 50, 50));
    }
}

class RaceCar extends Vehicle {
    constructor(position: { x: number, y: number }) {
        super(new Triangle("green", position, 50, 50));
    }
}

class Moped extends Vehicle {
    constructor(position: { x: number, y: number }) {
        super(new Triangle("green", position, 50, 44));
        this.possibleEvolutions = ["Motorcycle"];
    }
}

class Motorcycle extends Vehicle {
    constructor(position: { x: number, y: number }) {
        super(new Rect("red", position, 60, 10));
    }
}

class Hoverboard extends Vehicle {
    constructor(position: { x: number, y: number }) {
        super(new Circle("white", position, 50, 50));
        this.possibleEvolutions = ["Cybertruck", "UFO"];
    }
}

class Cybertruck extends Vehicle {
    constructor(position: { x: number, y: number }) {
        super(new Rect("gray", position, 100, 50));
    }
}

class UFO extends Vehicle {
    constructor(position: { x: number, y: number }) {
        super(new Circle("green", position, 75, 75));
    }
}
