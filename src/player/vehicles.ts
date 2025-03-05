import vehicleData from "./vehicles.json" assert { type: "json" };
import { Point, Circle, Rect, Shape, Triangle } from "../shapes.js";

interface ShapeData{
    type: string; 
    color: string;
    width: number; 
    height: number;
}

interface VehicleStats{
    shape: ShapeData;
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
    shape: Shape;
    accelerationStat: number;
    maxSpeedStat: number;
    rotationSpeedStat: number;
    maxHealth: number;
    possibleEvolutions: string[];
    levelUp: number;

    constructor(name: string, center: Point) {
        const vehicleStats = vehicleConfigs[name];
        console.log(name);
        switch (vehicleStats.shape.type) {
            case "Rect":
                this.shape = new Rect(vehicleStats.shape.color, center, vehicleStats.shape.width, vehicleStats.shape.height);
                break;
            case "Triangle":
                this.shape = new Triangle(vehicleStats.shape.color, center, vehicleStats.shape.width, vehicleStats.shape.height);
                break;
            case "Circle":
                this.shape = new Circle(vehicleStats.shape.color, center, vehicleStats.shape.width);
                break;
            default:
                throw new Error("Vehicle " + name + " does not have shape");
        }
        this.name = name;
        this.accelerationStat = vehicleStats.accelerationStat;
        this.maxSpeedStat = vehicleStats.maxSpeedStat;
        this.rotationSpeedStat = vehicleStats.rotationSpeedStat;
        this.maxHealth = vehicleStats.maxHealth;
        this.possibleEvolutions = vehicleStats.possibleEvolutions || [];
        this.levelUp = vehicleStats.levelUp;
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

    rotate(amount: number) {
        this.shape.rotate(amount);
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
