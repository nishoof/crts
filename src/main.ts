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

    console.log(c.width + " " + c.height);


    const ctx: CanvasRenderingContext2D = c.getContext("2d") as CanvasRenderingContext2D;

    // TODO: Walls
    const walls: Rect[] = [new Rect("rgb(30 30 30)", { x: 0, y: 20 }, 10000, 40)];

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

    walls.forEach((wall) => {
        wall.draw(ctx, screenPosition);
    })

    if (turningLeft)
        plr.rotate(-0.03 * multiplier);
    if (turningRight)
        plr.rotate(0.03 * multiplier);
    handlePlayerWallCollisions(plr, walls);

    if (movingInCurrDirection)
        plr.move(2 * multiplier);
    handlePlayerWallCollisions(plr, walls);

    plr.draw(ctx, screenPosition);

    // Rotate the Character to point to the mouse
    const angle = Math.atan2(mousePosition.y - (plr.character.shape.center.y - screenPosition.y), mousePosition.x - (plr.character.shape.center.x - screenPosition.x));
    plr.character.shape.rotation = angle;

    // console.log(plr.character.shape.center.x);
}

function handlePlayerWallCollisions(plr: Player, walls: Rect[]) {
    walls.forEach((wall) => {
        while (plr.vehicle.shape.detectCollision(wall)) {
            plr.undoLastMovement();
        }
    });
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
