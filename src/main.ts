import Player from "./player/player.js"
import { Rect } from "./shapes.js";

const c: HTMLCanvasElement = document.getElementById("main-canvas") as HTMLCanvasElement;

let mousePosition = { x: 0, y: 0 };
let screenPosition = { x: 0, y: 0 };        // position of the top left corner of the screen relative to the top left corner of the real map
let plr: Player = new Player({ x: 200, y: 200 });
let movingInCurrDirection = false;
let turningLeft = false;
let turningRight = false;

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
    const walls: Rect[] = [];
    walls.push(new Rect(wallColor, { x: 2500, y: -5000 }, 25000, 10000));   // top wall
    walls.push(new Rect(wallColor, { x: -5000, y: 1500 }, 10000, 23000));   // left wall
    walls.push(new Rect(wallColor, { x: 2500, y: 8000 }, 25000, 10000));    // bottom wall
    walls.push(new Rect(wallColor, { x: 10000, y: 1500 }, 10000, 23000));   // right wall
    walls.push(new Rect(wallColor, { x: 2500, y: 1500 }, 2000, 1500));      // middle block

    // Players
    plr.draw(ctx, screenPosition);

    // TODO: fix frame rate shit
    function gameLoop() {
        act(ctx, plr, walls);
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
}

// Called every frame. Updates player position and draws
function act(ctx: CanvasRenderingContext2D, plr: Player, walls: Rect[]) {
    [currentFrame, multiplier] = calculateFPSMultiplier(currentFrame);

    const plrPosition = plr.getPosition();
    screenPosition = { x: plrPosition.x - window.innerWidth / 2, y: plrPosition.y - window.innerHeight / 2 };

    // Clear screen so we can draw new stuff
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Draw walls
    walls.forEach((wall) => {
        wall.draw(ctx, screenPosition, false);
    })

    // Player turning
    if (turningLeft)
        plr.rotate(-plr.vehicle.rotationSpeedStat * multiplier);
    if (turningRight)
        plr.rotate(plr.vehicle.rotationSpeedStat * multiplier);
    handlePlayerWallCollisions(plr, walls);

    // Player moving
    if (movingInCurrDirection) {
        console.log(`moving at ${plr.currentSpeed} maxSpeed = ${plr.vehicle.maxSpeedStat}`);
        plr.move(plr.currentSpeed * multiplier);
        if (plr.currentSpeed < plr.vehicle.maxSpeedStat) {
            plr.currentSpeed = Math.min(plr.vehicle.maxSpeedStat, plr.currentSpeed + plr.vehicle.accelerationStat);
            console.log("here");
        }
    } else {
        plr.currentSpeed = 0;
    }
    handlePlayerWallCollisions(plr, walls);

    // Rotate the Character to point to the mouse
    const angle = Math.atan2(mousePosition.y - (plr.character.shape.center.y - screenPosition.y), mousePosition.x - (plr.character.shape.center.x - screenPosition.x));
    plr.character.shape.rotation = angle;

    // Draw player
    plr.draw(ctx, screenPosition);
}

function handlePlayerWallCollisions(plr: Player, walls: Rect[]) {
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
    }
});