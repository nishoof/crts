

function start() {
    let vehicles: Vehicle[] = [];
    let walls: Rect[] = [];


}

function run(bodies: Shape[]) {
    for (let i = 0; i < bodies.length; i++) {
        for (let j = i+1; j < bodies.length; j++) {
            if (bodies[i].detectCollision(bodies[j])) {

            }
        }
    }
}