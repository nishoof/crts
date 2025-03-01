import Player from "./player/player.js"
import { Rect } from "./shapes.js";

const c: HTMLCanvasElement = document.getElementById("main-canvas") as HTMLCanvasElement;

function start() {
    console.log("started");

    c.width = window.innerWidth;
    c.height = window.innerHeight;

    const ctx: CanvasRenderingContext2D = c.getContext("2d") as CanvasRenderingContext2D;
    // ctx.strokeStyle = "rgb(0 0 0)";

    const walls: Rect[] = [];
    console.log("lalala");

    let plr: Player = new Player();
    plr.draw(ctx, { x: 0, y: 0 });

    // let x = plr;
    let xsdflkjsdf = plr;

    console.log("lalala");
    console.log("lsdfkljsdf");

}

window.onload = start;