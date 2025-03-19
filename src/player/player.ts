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
    currentVelocity: number;

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
        this.currentVelocity = 0;

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

    moveForward(multiplier: number) {
        this.currentVelocity += this.vehicle.accelerationStat * multiplier;
        if (this.currentVelocity > this.vehicle.maxSpeedStat)
            this.currentVelocity = this.vehicle.maxSpeedStat;
        this.moveWithHistory(this.currentVelocity * multiplier);
    }

    moveBackwards(multiplier: number) {
        this.currentVelocity -= this.vehicle.accelerationStat * multiplier;
        if (this.currentVelocity < -1 * this.vehicle.maxSpeedStat)
            this.currentVelocity = -1 * this.vehicle.maxSpeedStat;
        this.moveWithHistory(this.currentVelocity * multiplier);
    }

    rotateLeft(multiplier: number) {
        this.rotateWithHistory(-1 * this.vehicle.rotationSpeedStat * multiplier);
    }
    rotateRight(multiplier: number) {
        this.rotateWithHistory(this.vehicle.rotationSpeedStat * multiplier);
    }

    undoLastTransformation() {
        const lastTransformationWasAMovement = this.lastTransformation.movement;
        const delta = this.lastTransformation.delta;

        if (lastTransformationWasAMovement) {
            this.moveNoHistory(-1 * delta);
        } else {
            this.rotateNoHistory(-1 * delta);
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

    private moveWithHistory(delta: number) {
        this.lastTransformation = { movement: true, delta: delta };
        this.moveNoHistory(delta);
    }

    private moveNoHistory(delta: number) {
        this.vehicle.move(delta);
        this.character.move(delta, this.rotation);
    }

    private rotateWithHistory(delta: number) {
        this.lastTransformation = { movement: false, delta: delta };
        this.rotateNoHistory(delta);
    }

    private rotateNoHistory(delta: number) {
        this.rotation += delta;
        this.vehicle.rotate(delta);
    }
}
