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
    return [now, (now-previousFrame) * FPS / 1000];
}

window.onload = function start() {
    console.log("started");

    c.width = window.innerWidth;
    c.height = window.innerHeight;

    const ctx: CanvasRenderingContext2D = c.getContext("2d") as CanvasRenderingContext2D;

    // TODO: Walls
    const walls: Rect[] = [new Rect("rgb(0 0 0)", {x: 50, y: 50}, 100, 40)];

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

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    if (turningLeft)
        plr.vehicle.rotate(-0.03 * multiplier);
    if (turningRight)
        plr.vehicle.rotate(0.03 * multiplier);
    if (movingInCurrDirection)
        plr.moveInCurrentDirection(2 * multiplier);
    plr.draw(ctx, screenPosition);

    walls.forEach((wall) => {
        wall.draw(ctx, screenPosition);
        if (plr.vehicle.shape.detectCollision(wall)) console.log("collide");
    })

    // Rotate the Character to point to the mouse
    const angle = Math.atan2(mousePosition.y - (plr.character.shape.center.y - screenPosition.y), mousePosition.x - (plr.character.shape.center.x - screenPosition.x));
    plr.character.shape.rotation = angle;

    // console.log(plr.character.shape.center.x);
}

// Update mouse position
document.addEventListener("mousemove", (event) => {
    mousePosition = { x: event.clientX, y: event.clientY };
});

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(event: KeyboardEvent) {
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
}

function keyUpHandler(event: KeyboardEvent) {
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
}
