"use strict";
let c = document.getElementById("main-canvas");
const testCanvasSupportDisplay = false;
// player should not be able to get a larger fov with a larger monitor - max frame width and frame height
const maxFrameWidth = 1500;
const maxFrameHeight = 800;
let frameWidth = maxFrameWidth;
let frameHeight = maxFrameHeight;
const worldWidth = 4500;
const worldHeight = 2500;
const squareSize = 50;
const moveSpeed = 10;
class Frame {
    constructor(windowWidth, windowHeight) {
        this.x = 0; // will be immediately updated in run()
        this.y = 0;
        this.width = 0, this.height = 0, this.toPixels = 0; // initialize these values first, then immediately adjust
        this.adjust(windowWidth, windowHeight);
    }
    adjust(windowWidth, windowHeight) {
        // compare ratios - which window dimension, relative to an ideal frame, is smaller?
        let windowtoMaxFrameX = windowWidth / maxFrameWidth;
        let windowtoMaxFrameY = windowHeight / maxFrameHeight;
        if (windowtoMaxFrameX < windowtoMaxFrameY) {
            // if window width is comparatively smaller, we fit the height first
            this.height = windowHeight;
            this.width = this.height * maxFrameWidth / maxFrameHeight;
            this.toPixels = windowWidth / maxFrameWidth;
        }
        else {
            // if window height is comparatively smaller, we fit the width first
            this.width = windowWidth;
            this.height = this.width * maxFrameHeight / maxFrameWidth;
            this.toPixels = windowHeight / maxFrameHeight;
        }
    }
}
class Circle {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }
    display(ctx, frame) {
        // only display if it will be visible in frame
        if (this.x + this.size < frame.x) { // left
            return;
        }
        if (this.x - this.size > frame.x + frameWidth) { // right
            return;
        }
        if (this.y + this.size < frame.y) { // up
            return;
        }
        if (this.y - this.size > frame.y + frameHeight) { // down
            return;
        }
        ctx.fillStyle = this.color;
        let [drawX, drawY] = worldPosToScreenPos(this.x, this.y, frame);
        ctx.beginPath();
        ctx.arc(drawX, drawY, this.size * frame.toPixels, 0, Math.PI * 2, false);
        ctx.fill();
    }
}
class Square {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }
    detectContact(circle) {
        // get x/y distance
        let distX = Math.abs(this.x + this.size / 2 - circle.x);
        let distY = Math.abs(this.y + this.size / 2 - circle.y);
        // if distance is too large, there is no collision
        if (distX > this.size / 2 + circle.size)
            return false;
        if (distY > this.size / 2 + circle.size)
            return false;
        // if distances is close enough, there is collision
        if (distX <= this.size / 2)
            return true;
        if (distY <= this.size / 2)
            return true;
        // check corner
        let cornerDistance_sq = Math.pow(distX - this.size / 2, 2) + Math.pow(distY - this.size / 2, 2);
        return cornerDistance_sq <= circle.size * circle.size;
    }
    draw(ctx, frame) {
        ctx.fillStyle = this.color;
        let [drawX, drawY] = worldPosToScreenPos(this.x, this.y, frame);
        ctx.fillRect(drawX, drawY, this.size * frame.toPixels, this.size * frame.toPixels); // colored body
        ctx.strokeRect(drawX, drawY, this.size * frame.toPixels, this.size * frame.toPixels); // border
    }
}
/**
 * Converts world (x, y) coordinates to screen (x, y) coordinates
 * @param x world x
 * @param y world y
 * @param frame current viewing frame
 */
function worldPosToScreenPos(x, y, frame) {
    let screenX = (x - frame.x) * frame.toPixels;
    let screenY = (y - frame.y) * frame.toPixels;
    return [screenX, screenY];
}
let movingLeft = false;
let movingRight = false;
let movingUp = false;
let movingDown = false;
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
function keyDownHandler(event) {
    switch (event.code) {
        case "ArrowLeft":
            movingLeft = true;
            break;
        case "ArrowRight":
            movingRight = true;
            break;
        case "ArrowUp":
            movingUp = true;
            break;
        case "ArrowDown":
            movingDown = true;
            break;
    }
}
function keyUpHandler(event) {
    switch (event.code) {
        case "ArrowLeft":
            movingLeft = false;
            break;
        case "ArrowRight":
            movingRight = false;
            break;
        case "ArrowUp":
            movingUp = false;
            break;
        case "ArrowDown":
            movingDown = false;
            break;
    }
}
let frame = new Frame(frameWidth, frameHeight);
window.addEventListener("resize", windowResizeHandler);
function windowResizeHandler(event) {
    frame.adjust(window.innerWidth, window.innerHeight);
}
function move(square) {
    if (movingLeft && square.x > -worldWidth / 2) {
        square.x -= moveSpeed;
    }
    else if (movingRight && square.x + squareSize < worldWidth / 2) {
        square.x += moveSpeed;
    }
    if (movingUp && square.y > -worldHeight / 2) {
        square.y -= moveSpeed;
    }
    else if (movingDown && square.y + squareSize < worldHeight / 2) {
        square.y += moveSpeed;
    }
}
function run(c, ctx, frame, square, circles) {
    // move square based on keyboard input
    move(square);
    // update frame location based on square
    frame.x = square.x + squareSize / 2 - frameWidth / 2;
    frame.y = square.y + squareSize / 2 - frameHeight / 2;
    // display ----
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.strokeRect(-worldWidth / 2 - frame.x, -worldHeight / 2 - frame.y, worldWidth, worldHeight); // draw border
    // display each circle
    for (let circle of circles) {
        circle.display(ctx, frame);
        if (square.detectContact(circle)) {
            square.color = circle.color;
        }
    }
    square.draw(ctx, frame);
    window.requestAnimationFrame(() => (run(c, ctx, frame, square, circles)));
}
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
    console.log("laldsadjasduisa");
    let ctx = c.getContext("2d");
    ctx.strokeStyle = "rgb(0 0 0)"; // only time we stroke it's black (square border & world border)
    let frame = new Frame(frameWidth, frameHeight);
    let square = new Square(0, 0, squareSize, "rgb(255, 255, 255)");
    // create circles with random x, y, size, color 
    let circles = new Set();
    let numCircles = 50;
    for (let i = 0; i < numCircles; i++) {
        let x = Math.random() * worldWidth - 0.5 * worldWidth;
        let y = Math.random() * worldHeight - 0.5 * worldHeight;
        let size = Math.random() * 40 + 10;
        let color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
        circles.add(new Circle(x, y, size, color));
    }
    run(c, ctx, frame, square, circles);
}
window.onload = start;
