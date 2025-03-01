import { Character, Rifleman } from "./characters.js";
import { Vehicle, Bike } from "./vehicles.js"

export default class Player {
    vehicle: Vehicle;
    character: Character;

    score: number;
    level: number;

    constructor() {
        const position = { x: 0, y: 0 };

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
}
