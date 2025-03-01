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
    walls.push(new Rect(wallColor, { x: 0, y: 20 }, 100000, 40));         // top wall
    walls.push(new Rect(wallColor, { x: 20, y: 0 }, 40, 100000));         // left wall
    walls.push(new Rect(wallColor, { x: 20, y: 30000 }, 100000, 40));     // bottom wall
    walls.push(new Rect(wallColor, { x: 30000, y: 0 }, 40, 100000));      // right wall

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
    screenPosition = { x: plrPosition.x - 500, y: plrPosition.y - 500 }

    // Clear screen so we can draw new stuff
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Draw walls
    walls.forEach((wall) => {
        wall.draw(ctx, screenPosition, false);
    })

    // Player turning
    if (turningLeft)
        plr.rotate(-0.03 * multiplier);
    if (turningRight)
        plr.rotate(0.03 * multiplier);
    handlePlayerWallCollisions(plr, walls);

    // Player moving
    if (movingInCurrDirection)
        plr.move(2 * multiplier);
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