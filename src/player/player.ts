import { Character, Rifleman } from "./characters.js";
import { Vehicle, Bike } from "./vehicles.js"

export default class Player {
    vehicle: Vehicle;
    character: Character;

    score: number;
    level: number;

    constructor(position = { x: 0, y: 0 }) {
        this.vehicle = new Bike(position);
        this.character = new Rifleman(position);

        this.score = 0;
        this.level = 0;
    }

    draw(ctx: CanvasRenderingContext2D, topLeft: { x: number, y: number }) {
        this.vehicle.draw(ctx, topLeft);
        this.character.draw(ctx, topLeft);
    }

    fire(mousePoint: { x: number, y: number }) {
        return this.character.fire(mousePoint);
    }

    move(deltaX: number, deltaY: number) {
        this.vehicle.shape.center.x += deltaX;
        this.vehicle.shape.center.y += deltaY;
        this.character.shape.center.x += deltaX;
        this.character.shape.center.y += deltaY;
    }
}
