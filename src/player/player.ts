import { Character, Rifleman } from "./characters.js";
import { Vehicle, Bike } from "./vehicles.js"

export default class Player {
    vehicle: Vehicle;
    character: Character;

    score: number;
    level: number;
    progressToNextLevel: number;

    lastTransformation: { movement: boolean, delta: number };
    currentSpeed: number;

    currentHealth: number;

    constructor(position = { x: 0, y: 0 }) {
        this.vehicle = new Bike(position);
        this.character = new Rifleman(position);

        this.score = 0;
        this.level = 0;
        this.progressToNextLevel = 0;

        this.lastTransformation = { movement: false, delta: 0 };
        this.currentSpeed = 0;

        this.currentHealth = this.vehicle.maxHealth;
    }

    draw(ctx: CanvasRenderingContext2D, topLeft: { x: number, y: number }) {
        this.vehicle.draw(ctx, topLeft);
        this.character.draw(ctx, topLeft);
        // draw health bar
    }

    gainScore(amount: number) {
        this.score += amount;
        this.progressToNextLevel += amount;

        if (this.progressToNextLevel >= (this.level-1)*100) {
            this.level++;
            this.progressToNextLevel -= (this.level*100);
        }
    }

    fire() {
        return this.character.fire();
    }

    move(delta: number) {
        this.lastTransformation = { movement: true, delta: delta };
        this._move(delta);
    }

    rotate(delta: number) {
        this.lastTransformation = { movement: false, delta: delta };
        this._rotate(delta);
    }

    undoLastMovement() {
        const lastTransformationWasAMovement = this.lastTransformation.movement;
        const delta = this.lastTransformation.delta;

        if (lastTransformationWasAMovement) {
            this._move(-1 * delta);
        } else {
            this._rotate(-1 * delta);
        }
    }

    getPosition() {
        return this.character.shape.center;
    }

    _move(delta: number) {
        let direction: number = this.vehicle.shape.rotation;
        let deltaX = delta * Math.cos(direction);
        let deltaY = delta * Math.sin(direction);

        this.vehicle.shape.center.x += deltaX;
        this.vehicle.shape.center.y += deltaY;
        this.character.shape.center.x += deltaX;
        this.character.shape.center.y += deltaY;
    }

    _rotate(delta: number) {
        this.vehicle.rotate(delta);
    }
}
