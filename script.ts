let c: HTMLCanvasElement = document.getElementById("main-canvas") as HTMLCanvasElement;
const testCanvasSupportDisplay = false;

// player should not be able to get a larger fov with a larger monitor - max frame width and frame height
const maxFrameWidth = 1500;
const maxFrameHeight = 800;
let frameWidth = maxFrameWidth;
let frameHeight = maxFrameHeight;

const worldWidth = 4500;
const worldHeight = 2500;

function start() {
    // set up canvas & context
    c.width = window.innerWidth;
    c.height = window.innerHeight;

    if (!c.getContext || testCanvasSupportDisplay) {
        let canvasSupport = document.getElementById("canvas-support");
        if (canvasSupport) {
            canvasSupport.style.display = "block";
        }
        return;
    }

    console.log("Canvas works :D");

    let ctx: CanvasRenderingContext2D = c.getContext("2d") as CanvasRenderingContext2D;
    ctx.strokeStyle = "rgb(0 0 0)"; // only time we stroke it's black (square border & world border)
}

window.onload = start;

