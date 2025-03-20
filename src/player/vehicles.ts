import vehicleData from "./vehicles.json" with { type: "json" };
import { Point, Circle, Rect, Shape, Triangle } from "../shapes.js";

interface ShapeData {
    type: string;
    color: string;
    width: number;
    height: number;
    offset: Point;
}

interface VehicleStats {
    shapes: ShapeData[];
    accelerationStat: number;
    maxSpeedStat: number;
    rotationSpeedStat: number;
    maxHealth: number;
    possibleEvolutions?: string[];
    levelUp: number;
}

interface VehiclesJSON {
    [key: string]: VehicleStats;
}

const vehicleConfigs: VehiclesJSON = vehicleData;

export class Vehicle {
    name: string;
    // center: Point;
    shapes: Shape[];
    accelerationStat: number;
    maxSpeedStat: number;
    rotationSpeedStat: number;
    maxHealth: number;
    possibleEvolutions: string[];
    levelUp: number;

    constructor(name: string, center: Point, rotation = 0) {
        const vehicleStats = vehicleConfigs[name];

        // shapes
        this.shapes = [];
        for (const shape of vehicleStats.shapes) {
            const offset = { x: shape.offset.x, y: shape.offset.y };
            switch (shape.type) {
                case "Rect":
                    this.shapes.push(new Rect(shape.color, center, shape.width, shape.height, rotation, offset));
                    break;
                case "Triangle":
                    this.shapes.push(new Triangle(shape.color, center, shape.width, shape.height, rotation, offset));
                    break;
                case "Circle":
                    this.shapes.push(new Circle(shape.color, center, shape.width, rotation, offset));
                    break;
                default:
                    throw new Error("Vehicle " + name + " does not have shape");
            }
        }

        // other
        this.name = name;
        this.accelerationStat = vehicleStats.accelerationStat;
        this.maxSpeedStat = vehicleStats.maxSpeedStat;
        this.rotationSpeedStat = vehicleStats.rotationSpeedStat;
        this.maxHealth = vehicleStats.maxHealth;
        this.possibleEvolutions = vehicleStats.possibleEvolutions || [];
        this.levelUp = vehicleStats.levelUp;
    }

    draw(ctx: CanvasRenderingContext2D, topLeft: { x: number; y: number; }) {
        for (const shape of this.shapes) {
            shape.draw(ctx, topLeft);
        }
    }

    move(delta: number, rotation: number) {
        for (const shape of this.shapes) {
            shape.moveAtRotation(delta, rotation);
        }
    }

    rotate(amount: number) {
        for (const shape of this.shapes) {
            shape.rotate(amount);
        }
    }

}

// export class Bike extends Vehicle {
//     constructor(position: { x: number, y: number }) {
//         super("Bike", new Rect("grey", position, 80, 10), 0.01, 4, 0.03, 100);
//         this.possibleEvolutions = ["Car", "Moped", "Hoverboard"];
//         this.levelUp = 5;
//     }
// }

// export class Car extends Vehicle {
//     constructor(position: { x: number, y: number }) {
//         super("Car", new Rect("blue", position, 80, 40), 0.03, 6, 0.02, 150);
//         this.possibleEvolutions = ["Truck", "Racecar"];
//         this.levelUp = 15;
//     }
// }

// export class Truck extends Vehicle {
//     constructor(position: { x: number, y: number }) {
//         super("Truck", new Rect("grey", position, 50, 50), 0.02, 5.5, 0.01, 250);
//     }
// }

// export class Racecar extends Vehicle {
//     constructor(position: { x: number, y: number }) {
//         super("Racecar", new Triangle("green", position, 50, 50), 0.05, 8, 0.02, 120);
//     }
// }

// export class Moped extends Vehicle {
//     constructor(position: { x: number, y: number }) {
//         super("Moped", new Triangle("blue", position, 50, 44), 0.035, 5, 0.35, 100);
//         this.possibleEvolutions = ["Motorcycle"];
//         this.levelUp = 15;
//     }
// }

// export class Motorcycle extends Vehicle {
//     constructor(position: { x: number, y: number }) {
//         super("Motorcycle", new Rect("red", position, 60, 10), 0.04, 6, 0.35, 115);
//     }
// }

// export class Hoverboard extends Vehicle {
//     constructor(position: { x: number, y: number }) {
//         super("Hoverboard", new Circle("white", position, 50, 50), 0.04, 4, 0.5, 90);
//         this.possibleEvolutions = ["Cybertruck", "UFO"];
//         this.levelUp = 15;
//     }
// }

// export class Cybertruck extends Vehicle {
//     constructor(position: { x: number, y: number }) {
//         super("Cybertruck", new Rect("gray", position, 100, 50), 0.05, 6, 0.1, 200);
//     }
// }

// export class UFO extends Vehicle {
//     constructor(position: { x: number, y: number }) {
//         super("UFO", new Circle("green", position, 75, 75), 0.05, 5, 0.5, 140);
//     }
// }
