const c: HTMLCanvasElement = document.getElementById("main-canvas") as HTMLCanvasElement;

function start() {
    c.width = window.innerWidth;
    c.height = window.innerHeight;

    const ctx: CanvasRenderingContext2D = c.getContext("2d") as CanvasRenderingContext2D;
    // ctx.strokeStyle = "rgb(0 0 0)";

    // vehicle upgrade tree
    const vehicles: Vehicle[] = [];
    
    // character upgrade tree
    const characters = [];

    // walls
    const walls: Rect[] = [];

    let bodies: Shape[] = [];
    vehicles.forEach((vehicle) => {bodies.push(vehicle.shape)});
    walls.forEach((wall) => {bodies.push(wall)});

    run(bodies);
}

function run(bodies: Shape[]) {
    for (let i = 0; i < bodies.length; i++) {
        for (let j = i+1; j < bodies.length; j++) {
            if (bodies[i].detectCollision(bodies[j])) {

            }
        }
    }
}