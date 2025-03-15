import { Point, Shape } from "../shapes.js";
import { Character, Rifleman } from "./characters.js";
import { Vehicle } from "./vehicles.js"

export default class Player {
    center: Point; // rotation is done around this point

    vehicle: Vehicle;
    character: Character;
    rotation: number;

    score: number;
    level: number;
    progressToNextLevel: number;

    lastTransformation: { movement: boolean, delta: number };
    currentSpeed: number;

    currentHealth: number;

    name: string;

    constructor(position: Point) {
        this.center = position;

        this.vehicle = new Vehicle("Bike", position);
        this.character = new Rifleman(position);
        this.rotation = 0;

        this.score = 0;
        this.level = 0;
        this.progressToNextLevel = 0;

        this.lastTransformation = { movement: false, delta: 0 };
        this.currentSpeed = 0;

        this.currentHealth = this.vehicle.maxHealth;

        this.name = "";
    }

    draw(ctx: CanvasRenderingContext2D, topLeft: Point) {
        this.vehicle.draw(ctx, topLeft);
        this.character.draw(ctx, topLeft);
        // draw health bar
    }

    gainScore(amount: number) {
        this.score += amount;
        this.progressToNextLevel += amount;

        while (this.progressToNextLevel >= this.calculateNextLevelScore()) {
            this.progressToNextLevel -= this.calculateNextLevelScore();
            this.level++;
        }
    }

    calculateNextLevelScore(): number {
        return (this.level + 1) * 50;
    }

    fire() {
        return this.character.fire(this.center);
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

    getRotation() {
        return this.rotation;
    }

    detectCollision(other: Shape) {
        for (const shape of this.vehicle.shapes) {
            if (other.detectCollision(shape)) return true;
        }
        return false;
    }

    _move(delta: number) {
        this.vehicle.move(delta);
        this.character.move(delta, this.rotation);
    }

    _rotate(delta: number) {
        this.rotation += delta;
        this.vehicle.rotate(delta);
    }
}
