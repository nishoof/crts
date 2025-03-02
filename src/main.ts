import Player from "./player/player.js"
import { Circle, Rect, Shape, Triangle } from "./shapes.js";
import { Bike, Car, Truck, Racecar, Moped, Motorcycle, Hoverboard, Cybertruck, UFO, Vehicle } from "./player/vehicles.js";
import { Bomber, Bullet, Cannoneer, Gatling, Gunner, Hitman, Sniper, Sprayer, TripleShot } from "./player/characters.js";
import { drawHUD } from "./hud.js";
import { Orb } from "./spawnables.js";

const c: HTMLCanvasElement = document.getElementById("main-canvas") as HTMLCanvasElement;

let mousePosition = { x: 0, y: 0 };
let screenPosition = { x: 0, y: 0 };        // position of the top left corner of the screen relative to the top left corner of the real map
let plr: Player = new Player({ x: 1000, y: 150 });
let movingInCurrDirection = false;
let movingBack = false;
let turningLeft = false;
let turningRight = false;
let firing = false;
let starting = true;
let nextCheckpoint = 0;
let lapsCompleted = 0;
let lastLapTime: number;
let bestLap = Infinity;
let lapStartTime = 0;

const FPS = 60;
const startTime = performance.now();
let currentFrame = startTime;
let multiplier: number;

function calculateFPSMultiplier(previousFrame: number): [number, number] {
    const now = performance.now();
    return [now, (now - previousFrame) * FPS / 1000];
}

function start() {
    console.log("started");

    document.getElementById("game")!.style.display = "initial";

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

    // Checkpoints
    const checkpoints: Shape[] = [];
    checkpoints.push(new Rect("rgb(30 30 30)", { x: 1505, y: 350 }, 5, 1000));
    checkpoints.push(new Rect("rgb(30 30 30)", { x: 3495, y: 350 }, 5, 1000));
    checkpoints.push(new Rect("rgb(30 30 30)", { x: 3495, y: 2600 }, 5, 1000));
    checkpoints.push(new Rect("rgb(30 30 30)", { x: 1505, y: 2600 }, 5, 1000));

    // Bullets
    const bullets: Bullet[] = [];

    // Orbs
    const orbs: Orb[] = [];

    while (orbs.length < 100) {
        const center = { x: Math.random() * 5000, y: Math.random() * 3000 };
        const rot = Math.random() * Math.PI/100;
        const type = Math.floor(Math.random() * 3); // 0, 1, or 2

        let orb: Orb;
        switch (type) {
            case 0:
            orb = new Orb(10, 10, rot, new Circle("Yellow", center, 13));
            break;
            case 1:
            orb = new Orb(30, 30, rot, new Triangle("Yellow", center, 29.98, 26));
            break;
            case 2:
            orb = new Orb(50, 50, rot, new Rect("Yellow", center, 26, 26));
            break;
            default:
            throw new Error("Unexpected type");
        }
        if (orbs.every(o => !orb.shape.detectCollision(o.shape)) && mapObjects.every(mObj => !orb.shape.detectCollision(mObj))) {
            orbs.push(orb);
        }
    }

    // Players
    plr.draw(ctx, screenPosition);

    // TODO: fix frame rate shit
    function gameLoop() {
        act(ctx, plr, mapObjects, bullets, checkpoints, orbs);
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
}

// Called every frame. Updates player position and draws
function act(ctx: CanvasRenderingContext2D, plr: Player, mapObjects: Shape[], bullets: Bullet[], checkpoints: Shape[], orbs: Orb[]) {
    [currentFrame, multiplier] = calculateFPSMultiplier(currentFrame);

    // Update current lap time display if race has started
    if (!starting && lastLapTime) {
        const currentTime = performance.now();
        const currentLapTime = Math.round((currentTime - lastLapTime) / 10) / 100;
        document.getElementById("current-lap-time")!.innerHTML = currentLapTime.toFixed(2);
    }

    const plrPosition = plr.getPosition();
    screenPosition = { x: plrPosition.x - window.innerWidth / 2, y: plrPosition.y - window.innerHeight / 2 };

    // Clear screen so we can draw new stuff
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Draw mapObjects
    mapObjects.forEach((obj) => {
        obj.draw(ctx, screenPosition, false);
    });

    // Checkpoint
    // TODO: after hackathon, fix edge case where a player going the wrong way 4 times gets a lap completed. though honestly, at that point I guess they earned the lap
    for (let i = 0; i < 4; i++) {
        const checkpoint: Shape = checkpoints[i];
        if (plr.vehicle.shape.detectCollision(checkpoint)) {
            if (i === nextCheckpoint) {
                if (i === 0) { // completed lap
                    if (starting) { // start behind the line
                        starting = false;
                        nextCheckpoint++;
                        lastLapTime = performance.now();
                        break;
                    }

                    lapsCompleted++;
                    const currentTime = performance.now();
                    plr.gainScore(250);
                    document.getElementById("lap-time")!.innerHTML = `${Math.round((currentTime-lastLapTime)/10)/100}`;

                    if (currentTime - lastLapTime < bestLap) {
                        bestLap = currentTime - lastLapTime;

                        const bestLapElem = document.getElementById("best-lap");
                        bestLapElem!.style.display = "block";
                        document.getElementById("best-lap-time")!.innerHTML = `${Math.round(bestLap/10)/100}`;
                    }

                    lastLapTime = currentTime; // Reset lap timer for new lap
                    const lapPopupElem = document.getElementById("lap-popup");
                    lapPopupElem!.style.display = "block";
                    setTimeout(() => {lapPopupElem!.style.display = "none"}, 5000);
                }

                nextCheckpoint = (nextCheckpoint+1) % 4;
            }
        }
    }
    checkpoints[0].draw(ctx, screenPosition);       // finish line

    // Bullets
    if (firing) {
        const newBullets = plr.fire();
        if (newBullets != null) {
            newBullets.forEach((bullet) => bullets.push(bullet));
        }
    }
    bullets.forEach((bullet) => {
        bullet.move();
        bullet.shape.draw(ctx, screenPosition);
    });

    // Orbs
    orbs.forEach((orb) => {
        orb.draw(ctx, screenPosition);
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
    } else if (movingBack) {
        plr.move(-plr.currentSpeed * multiplier * 0.8);
        if (plr.currentSpeed < plr.vehicle.maxSpeedStat) {
            plr.currentSpeed = Math.min(plr.vehicle.maxSpeedStat, plr.currentSpeed + plr.vehicle.accelerationStat);
        }
    } else {
        plr.currentSpeed = 0;
    }
    handlePlayerWallCollisions(plr, mapObjects);
    handleBulletOrbCollisions(bullets, orbs);
    handleBulletWallCollisions(bullets, mapObjects);
    handlePlayerOrbCollisions(plr, orbs);
    // Rotate the Character to point to the mouse
    const angle = Math.atan2(mousePosition.y - (plr.character.shape.center.y - screenPosition.y), mousePosition.x - (plr.character.shape.center.x - screenPosition.x));
    plr.character.shape.rotation = angle;

    // Draw player
    plr.draw(ctx, screenPosition);

    // Draw HUD
    drawHUD(plr);
}

function handlePlayerOrbCollisions(plr: Player, orbs: Orb[]) {
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
  
function handlePlayerWallCollisions(plr: Player, walls: Shape[]) {
    walls.forEach((wall) => {
        while (plr.vehicle.shape.detectCollision(wall)) {
            plr.undoLastMovement();
        }
    });
}
function handleBulletWallCollisions(bullets: Bullet[], walls: Shape[]){
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
function handleBulletOrbCollisions(bullets: Bullet[], orbs: Orb[]) {
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

document.getElementById("name-input-button")!.addEventListener("click", () => {
    let nameInputElem = document.getElementById("name") as HTMLInputElement;
    plr.name = nameInputElem.value;
    document.getElementById("ign")!.innerHTML = plr.name;

    document.getElementById("name-input")!.style.display = "none";

    start();
});


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
        case "KeyS":
        case "ArrowDown":
            movingBack = true;
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
        case "KeyS":
        case "ArrowDown":
            movingBack = false;
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
// Vehicle
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
// Character
document.getElementById("Gunner-button")!.addEventListener("click", () => {
    plr.character = new Gunner(plr.getPosition());
});
document.getElementById("Sniper-button")!.addEventListener("click", () => {
    plr.character = new Sniper(plr.getPosition());
});
document.getElementById("Cannoneer-button")!.addEventListener("click", () => {
    plr.character = new Cannoneer(plr.getPosition());
});
document.getElementById("Gatling-button")!.addEventListener("click", () => {
    plr.character = new Gatling(plr.getPosition());
});
document.getElementById("Sprayer-button")!.addEventListener("click", () => {
    plr.character = new Sprayer(plr.getPosition());
});
document.getElementById("Hitman-button")!.addEventListener("click", () => {
    plr.character = new Hitman(plr.getPosition());
});
document.getElementById("TripleShot-button")!.addEventListener("click", () => {
    plr.character = new TripleShot(plr.getPosition());
});
document.getElementById("Bomber-button")!.addEventListener("click", () => {
    plr.character = new Bomber(plr.getPosition());
});