import { Bullet } from "./player/characters.js";
import Player from "./player/player.js";
import { Point, Shape } from "./shapes.js";
import { Orb } from "./spawnables.js";

/**
 * Rotates point around origin by rotation radians.
 * @param origin 
 * @param point 
 * @param rotation 
 * @returns 
 */
export function rotate(origin: Point, point: Point, rotation: number): Point {
    let relX = point.x - origin.x, relY = point.y - origin.y;

    return {
        x: relX * Math.cos(rotation) - relY * Math.sin(rotation) + origin.x,
        y: relX * Math.sin(rotation) + relY * Math.cos(rotation) + origin.y
    };
}

/**
 * applies a multiplier to movement/rotation to account for differences in FPS
 * @param FPS 
 * @param previousFrame time of previous frame
 * @returns [time of current frame, multiplier]
 */
export function calculateFPSMultiplier(FPS: number, previousFrame: number): [number, number] {
    const now = performance.now();
    return [now, (now - previousFrame) * FPS / 1000];
}

export function handlePlayerOrbCollisions(plr: Player, orbs: Orb[]) {
    orbs.forEach((orb) => {
        if (plr.vehicle.shape.detectCollision(orb.shape)) {
            const xDis = orb.shape.center.x - plr.vehicle.shape.center.x;
            const yDis = orb.shape.center.y - plr.vehicle.shape.center.y;
            const distance = Math.sqrt(xDis * xDis + yDis * yDis);


            const pushForce = 3;
            const pushX = (xDis / distance) * pushForce;
            const pushY = (yDis / distance) * pushForce;
            orb.shape.center.x += pushX;
            orb.shape.center.y += pushY;
            plr.currentSpeed *= 0.95;
        }
    });
}

export function handlePlayerWallCollisions(plr: Player, walls: Shape[]) {
    walls.forEach((wall) => {
        while (plr.vehicle.shape.detectCollision(wall)) {
            plr.undoLastMovement();
        }
    });
}

export function handleBulletWallCollisions(bullets: Bullet[], walls: Shape[]) {
    let bulletsRemoved = 0;
    for (let i = 0; i < bullets.length - bulletsRemoved; i++) {
        for (let j = 0; j < walls.length; j++) {

            const bullet = bullets[i];
            const wall = walls[j];
            if (!bullet) {
                console.log("not sigma");
            }

            if (bullet.shape.detectCollision(wall)) {
                bullets.splice(i, 1);
                break;
            }
        }
    }
}

export function handleBulletOrbCollisions(plr: Player, bullets: Bullet[], orbs: Orb[]) {
    let bulletsRemoved = 0;
    let orbsRemoved = 0;
    for (let i = 0; i < bullets.length - bulletsRemoved; i++) {
        for (let j = 0; j < orbs.length - orbsRemoved; j++) {
            const bullet = bullets[i];
            const orb = orbs[j];

            if (bullet.shape.detectCollision(orb.shape)) {
                let orbHealth = orb.health;
                let bulletHealth = bullet.bulletHealth;
                if (bullet.updateHealth(orbHealth) <= 0) {
                    bullets.splice(i, 1);
                    bulletsRemoved++;
                    i--;
                }
                if (orb.updateHealth(bulletHealth) <= 0) {
                    plr.gainScore(orb.exp);
                    orbs.splice(j, 1);
                    orbsRemoved++;
                    j--;
                }
                break;
            }
        }
    }
}