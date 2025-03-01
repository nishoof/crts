/**
 * Rotates point around origin by rotation radians.
 * @param origin 
 * @param point 
 * @param rotation 
 * @returns 
 */
function rotation(origin: { x: number, y: number }, point: { x: number, y: number }, rotation: number): { x: number, y: number } {
    let relX = point.x - origin.x, relY = point.y - origin.y;

    return {
        x: relX * Math.cos(rotation) - relY * Math.sin(rotation) + origin.x,
        y: relX * Math.sin(rotation) + relY * Math.cos(rotation) + origin.y
    };
}