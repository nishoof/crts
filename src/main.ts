import Player from "./player/player.js"
import { Rect } from "./shapes.js";

const c: HTMLCanvasElement = document.getElementById("main-canvas") as HTMLCanvasElement;

let screenPosition = { x: 0, y: 0 };        // position of the top left corner of the screen relative to the top left corner of the real map

function start() {
    console.log("started");

    c.width = window.innerWidth;
    c.height = window.innerHeight;

    const ctx: CanvasRenderingContext2D = c.getContext("2d") as CanvasRenderingContext2D;
    // ctx.strokeStyle = "rgb(0 0 0)";

    const walls: Rect[] = [];

    let plr: Player = new Player({ x: 200, y: 200 });
    plr.draw(ctx, screenPosition);

    // TODO: fix frame rate shit
    function gameLoop() {
        draw(ctx, plr);
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
}

// Called every frame
function draw(ctx: CanvasRenderingContext2D, plr: Player) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // console.log("run");

    plr.move(1, 1);
    plr.draw(ctx, screenPosition);

    // console.log(plr.character.shape.center.x);
}

window.onload = start;