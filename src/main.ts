import Player from "./player/player.js"
import { Circle, Rect, Shape, Triangle } from "./shapes.js";
import { Bike, Car, Truck, Racecar, Moped, Motorcycle, Hoverboard, Cybertruck, UFO, Vehicle } from "./player/vehicles.js";
import { Bullet } from "./player/characters.js";

const c: HTMLCanvasElement = document.getElementById("main-canvas") as HTMLCanvasElement;

let mousePosition = { x: 0, y: 0 };
let screenPosition = { x: 0, y: 0 };        // position of the top left corner of the screen relative to the top left corner of the real map
let plr: Player = new Player({ x: 200, y: 200 });
let movingInCurrDirection = false;
let turningLeft = false;
let turningRight = false;
let firing = false;

const FPS = 60;
const startTime = performance.now();
let currentFrame = startTime;
let multiplier: number;

function calculateFPSMultiplier(previousFrame: number): [number, number] {
    const now = performance.now();
    return [now, (now - previousFrame) * FPS / 1000];
}

window.onload = function start() {
    console.log("started");

    c.width = window.innerWidth;
    c.height = window.innerHeight;

    const ctx: CanvasRenderingContext2D = c.getContext("2d") as CanvasRenderingContext2D;

    // Walls
    const wallColor = "rgb(30 30 30)";
    const mapObjects: Shape[] = [];
    mapObjects.push(new Rect(wallColor, { x: 2500, y: -5000 }, 25000, 10000));   // top wall
    mapObjects.push(new Rect(wallColor, { x: -5000, y: 1500 }, 10000, 23000));   // left wall
    mapObjects.push(new Rect(wallColor, { x: 2500, y: 8000 }, 25000, 10000));    // bottom wall
    mapObjects.push(new Rect(wallColor, { x: 10000, y: 1500 }, 10000, 23000));   // right wall
    mapObjects.push(new Rect(wallColor, { x: 2500, y: 1500 }, 2000, 1500));      // middle block
    mapObjects.push(new Rect(wallColor, { x: 900, y: 500 }, 70, 70));
    mapObjects.push(new Circle(wallColor, { x: 1250, y: 650 }, 100));
    mapObjects.push(new Triangle(wallColor, { x: 1900, y: 250 }, 100, 100));
    mapObjects.push(new Rect(wallColor, { x: 2800, y: 600 }, 100, 800));
    mapObjects.push(new Circle(wallColor, { x: 4200, y: 1500 }, 300));
    mapObjects.push(new Triangle(wallColor, { x: 2500, y: 2500 }, 150, 150));
    mapObjects.push(new Triangle(wallColor, { x: 490, y: 1950 }, 1000, 700));
    mapObjects.push(new Rect(wallColor, { x: 1250, y: 1500 }, 1000, 200));

    // Bullets
    const bullets: Bullet[] = [];

    // Players
    plr.draw(ctx, screenPosition);

    // TODO: fix frame rate shit
    function gameLoop() {
        act(ctx, plr, mapObjects, bullets);
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
}

// Called every frame. Updates player position and draws
function act(ctx: CanvasRenderingContext2D, plr: Player, mapObjects: Shape[], bullets: Bullet[]) {
    [currentFrame, multiplier] = calculateFPSMultiplier(currentFrame);

    const plrPosition = plr.getPosition();
    screenPosition = { x: plrPosition.x - window.innerWidth / 2, y: plrPosition.y - window.innerHeight / 2 };

    // Clear screen so we can draw new stuff
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Draw mapObjects
    mapObjects.forEach((obj) => {
        obj.draw(ctx, screenPosition, false);
    })

    // Bullets
    if (firing) {
        const plrPosition = plr.getPosition();
        const rotation = plr.character.shape.rotation;
        const bullet = new Bullet(new Circle("yellow", { x: plrPosition.x, y: plrPosition.y }, 3, rotation), 5);
        bullets.push(bullet);
    }
    bullets.forEach((bullet) => {
        bullet.shape.move(2);
        bullet.shape.draw(ctx, screenPosition);
    });

    // Player turning
    if (turningLeft)
        plr.rotate(-plr.vehicle.rotationSpeedStat * multiplier);
    if (turningRight)
        plr.rotate(plr.vehicle.rotationSpeedStat * multiplier);
    handlePlayerWallCollisions(plr, mapObjects);

    // Player moving
    if (movingInCurrDirection) {
        plr.move(plr.currentSpeed * multiplier);
        if (plr.currentSpeed < plr.vehicle.maxSpeedStat) {
            plr.currentSpeed = Math.min(plr.vehicle.maxSpeedStat, plr.currentSpeed + plr.vehicle.accelerationStat);
        }
    } else {
        plr.currentSpeed = 0;
    }
    handlePlayerWallCollisions(plr, mapObjects);

    // Rotate the Character to point to the mouse
    const angle = Math.atan2(mousePosition.y - (plr.character.shape.center.y - screenPosition.y), mousePosition.x - (plr.character.shape.center.x - screenPosition.x));
    plr.character.shape.rotation = angle;

    // Draw player
    plr.draw(ctx, screenPosition);
}

function handlePlayerWallCollisions(plr: Player, walls: Shape[]) {
    walls.forEach((wall) => {
        while (plr.vehicle.shape.detectCollision(wall)) {
            plr.undoLastMovement();
        }
    });
}

// Update mouse position
document.addEventListener("mousemove", (event: MouseEvent) => {
    mousePosition = { x: event.clientX, y: event.clientY };
});

document.addEventListener("keydown", (event: KeyboardEvent) => {
    switch (event.code) {
        case "KeyW":
        case "ArrowUp":
            movingInCurrDirection = true;
            break;
        case "KeyA":
        case "ArrowLeft":
            turningLeft = true;
            break;
        case "KeyD":
        case "ArrowRight":
            turningRight = true;
            break;
        case "Space":
            firing = true;
            break;
    }
});

document.addEventListener("keyup", (event: KeyboardEvent) => {
    switch (event.code) {
        case "KeyW":
        case "ArrowUp":
            movingInCurrDirection = false;
            break;
        case "KeyA":
        case "ArrowLeft":
            turningLeft = false;
            break;
        case "KeyD":
        case "ArrowRight":
            turningRight = false;
            break;
        case "Space":
            firing = false;
            break;
    }
});

// Upgrade buttons
document.getElementById("Car-button")!.addEventListener("click", () => {
    plr.vehicle = new Car(plr.getPosition());
});
document.getElementById("Truck-button")!.addEventListener("click", () => {
    plr.vehicle = new Truck(plr.getPosition());
});
document.getElementById("Racecar-button")!.addEventListener("click", () => {
    plr.vehicle = new Racecar(plr.getPosition());
});
document.getElementById("Moped-button")!.addEventListener("click", () => {
    plr.vehicle = new Moped(plr.getPosition());
});
document.getElementById("Motorcycle-button")!.addEventListener("click", () => {
    plr.vehicle = new Motorcycle(plr.getPosition());
});
document.getElementById("Hoverboard-button")!.addEventListener("click", () => {
    plr.vehicle = new Hoverboard(plr.getPosition());
});
document.getElementById("Cybertruck-button")!.addEventListener("click", () => {
    plr.vehicle = new Cybertruck(plr.getPosition());
});
document.getElementById("UFO-button")!.addEventListener("click", () => {
    plr.vehicle = new UFO(plr.getPosition());
});