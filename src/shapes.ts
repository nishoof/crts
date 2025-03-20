import { rotate } from "./helper.js"

export type Point = { x: number; y: number };

// Physical thing on the map (pretend it's an abstract class)
export class Shape {
    color: string;
    pivotCenter: Point; // point at which shape is rotated around
    relCenter: Point; // center of shape relative to pivotCenter
    rotation: number;
    /* center and pivotCenter must be independently stored
    as different shapes have different pivots (one might be a corner, one might be center)
    */

    constructor(color: string, pivotCenter: Point, rotation: number, relCenter: Point) {
        this.color = color;
        this.pivotCenter = pivotCenter;
        this.rotation = rotation;
        this.relCenter = relCenter;
    }

    draw(ctx: CanvasRenderingContext2D, topleft: Point, stroke?: boolean) {
        throw new Error("draw() must be implemented in subclass");
    }

    move(delta: number) {
        this.moveAtRotation(delta, this.rotation);
    }

    moveAtRotation(delta: number, rotation: number) {
        // console.log(`${delta}`);
        // this.center.x += Math.cos(rotation) * delta;
        // this.center.y += Math.sin(rotation) * delta;
        this.pivotCenter.x += Math.cos(rotation) * delta;
        this.pivotCenter.y += Math.sin(rotation) * delta;
    }

    rotate(amount: number) {
        this.rotation += amount;
    }

    detectCollision(other: Shape): boolean {
        throw new Error("detectCollision() must be implemented in subclass");
    }
}

export class Rect extends Shape {
    width: number;
    height: number;

    constructor(color: string, pivotCenter: Point, width: number, height: number, rotation = 0, relCenter = { x: 0, y: 0 }) {
        super(color, pivotCenter, rotation, relCenter);
        this.width = width;
        this.height = height;
    }

    draw(ctx: CanvasRenderingContext2D, topleft: Point, stroke = true): void {
        let [p1, p2, p3, p4] = this.calculatePoints();

        let drawing = new Path2D();
        drawing.moveTo(p1.x - topleft.x, p1.y - topleft.y);
        drawing.lineTo(p2.x - topleft.x, p2.y - topleft.y);
        drawing.lineTo(p3.x - topleft.x, p3.y - topleft.y);
        drawing.lineTo(p4.x - topleft.x, p4.y - topleft.y);
        drawing.closePath();

        if (stroke) ctx.stroke(drawing);
        ctx.fillStyle = this.color;
        ctx.fill(drawing);
    }

    detectCollision(other: Shape): boolean {
        const points = this.calculatePoints();

        if (other instanceof Rect) return polygonsCollide(points, other.calculatePoints());
        if (other instanceof Circle) return circleCollidesWithPolygon(other, points);
        if (other instanceof Triangle) return polygonsCollide(points, other.calculatePoints());

        throw new Error("Unknown Shape type for collision detection");
    }

    calculatePoints(): Point[] {
        const center = { x: this.pivotCenter.x + this.relCenter.x, y: this.pivotCenter.y + this.relCenter.y }
        let p1 = rotate(this.pivotCenter, { x: center.x - this.width / 2, y: center.y - this.height / 2 }, this.rotation);
        let p2 = rotate(this.pivotCenter, { x: center.x + this.width / 2, y: center.y - this.height / 2 }, this.rotation);
        let p3 = rotate(this.pivotCenter, { x: center.x + this.width / 2, y: center.y + this.height / 2 }, this.rotation);
        let p4 = rotate(this.pivotCenter, { x: center.x - this.width / 2, y: center.y + this.height / 2 }, this.rotation);
        return [p1, p2, p3, p4];
    }
}

export class Circle extends Shape {
    radius: number;

    constructor(color: string, pivotCenter: Point, radius: number, rotation = 0, relCenter = { x: 0, y: 0 }) {
        super(color, pivotCenter, rotation, relCenter);
        this.radius = radius;
    }

    draw(ctx: CanvasRenderingContext2D, topleft: Point, stroke = true) {

        const rotatedCenter = this.calculateRotatedCenter()

        ctx.beginPath();
        ctx.arc(rotatedCenter.x - topleft.x, rotatedCenter.y - topleft.y, this.radius, 0, 2 * Math.PI);

        if (stroke) ctx.stroke();
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    detectCollision(other: Shape): boolean {
        if (other instanceof Rect) return circleCollidesWithPolygon(this, other.calculatePoints());
        if (other instanceof Circle) return detectCollisionCircleCircle(this, other);
        if (other instanceof Triangle) return circleCollidesWithPolygon(this, other.calculatePoints());

        throw new Error("Unknown Shape type for collision detection");
    }

    calculateRotatedCenter() {
        return rotate(this.pivotCenter, { x: this.pivotCenter.x + this.relCenter.x, y: this.pivotCenter.y + this.relCenter.y }, this.rotation);
    }
}

export class Triangle extends Shape {
    width: number;
    height: number;

    constructor(color: string, pivotCenter: Point, width: number, height: number, rotation = 0, relCenter = { x: 0, y: 0 }) {
        super(color, pivotCenter, rotation, relCenter);
        this.width = width;
        this.height = height;
    }

    draw(ctx: CanvasRenderingContext2D, topleft: Point, stroke = true) {
        let [p1, p2, p3] = this.calculatePoints();

        let drawing = new Path2D();
        drawing.moveTo(p1.x - topleft.x, p1.y - topleft.y);
        drawing.lineTo(p2.x - topleft.x, p2.y - topleft.y);
        drawing.lineTo(p3.x - topleft.x, p3.y - topleft.y);
        drawing.closePath();

        if (stroke) ctx.stroke(drawing);
        ctx.fillStyle = this.color;
        ctx.fill(drawing);
    }

    detectCollision(other: Shape): boolean {
        const points = this.calculatePoints();

        if (other instanceof Rect) return polygonsCollide(points, other.calculatePoints());
        if (other instanceof Circle) return circleCollidesWithPolygon(other, points);
        if (other instanceof Triangle) return polygonsCollide(points, other.calculatePoints());

        throw new Error("Unknown Shape type for collision detection");
    }

    calculatePoints(): Point[] {
        const center = { x: this.pivotCenter.x + this.relCenter.x, y: this.pivotCenter.y + this.relCenter.y }
        let p1 = rotate(this.pivotCenter, { x: center.x + this.width / 2, y: center.y }, this.rotation);
        let p2 = rotate(this.pivotCenter, { x: center.x - this.width / 2, y: center.y + this.height / 2 }, this.rotation);
        let p3 = rotate(this.pivotCenter, { x: center.x - this.width / 2, y: center.y - this.height / 2 }, this.rotation);
        return [p1, p2, p3];
    }
}


export class pivotRect extends Rect {
    constructor(color: string, pivot: Point, width: number, height: number, rotation = 0) {
        super(color, pivot, width, height, rotation, { x: width / 2, y: 0 });
    }
}

type Polygon = Point[];

function polygonsCollide(polygon1: Polygon, polygon2: Polygon): boolean {
    function getEdges(polygon: Polygon): Point[] {
        const edges: Point[] = [];
        for (let i = 0; i < polygon.length; i++) {
            const nextIndex = (i + 1) % polygon.length;
            edges.push({
                x: polygon[nextIndex].x - polygon[i].x,
                y: polygon[nextIndex].y - polygon[i].y
            });
        }
        return edges;
    }

    function getPerpendicularAxis(edge: Point): Point {
        return { x: -edge.y, y: edge.x };
    }

    function projectPolygon(polygon: Polygon, axis: Point): { min: number; max: number } {
        let min = Infinity;
        let max = -Infinity;

        for (const point of polygon) {
            const projection = (point.x * axis.x + point.y * axis.y) / Math.sqrt(axis.x ** 2 + axis.y ** 2);
            if (projection < min) min = projection;
            if (projection > max) max = projection;
        }

        return { min, max };
    }

    function isOverlapping(proj1: { min: number; max: number }, proj2: { min: number; max: number }): boolean {
        return !(proj1.max < proj2.min || proj2.max < proj1.min);
    }

    const edges1 = getEdges(polygon1);
    const edges2 = getEdges(polygon2);

    for (const edge of [...edges1, ...edges2]) {
        const axis = getPerpendicularAxis(edge);

        const proj1 = projectPolygon(polygon1, axis);
        const proj2 = projectPolygon(polygon2, axis);

        if (!isOverlapping(proj1, proj2)) {
            return false; // A separating axis was found, so no collision
        }
    }

    return true; // No separating axis found, polygons are colliding
}

function circleCollidesWithPolygon(circle: Circle, polygon: Polygon): boolean {
    function squaredDistance(p1: Point, p2: Point): number {
        return (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
    }

    function isPointInsidePolygon(point: Point, polygon: Polygon): boolean {
        let inside = false;
        const n = polygon.length;

        for (let i = 0, j = n - 1; i < n; j = i++) {
            const xi = polygon[i].x, yi = polygon[i].y;
            const xj = polygon[j].x, yj = polygon[j].y;

            const intersect = yi > point.y !== yj > point.y &&
                point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;

            if (intersect) inside = !inside;
        }

        return inside;
    }

    function closestPointOnSegment(a: Point, b: Point, p: Point): Point {
        const ab = { x: b.x - a.x, y: b.y - a.y };
        const ap = { x: p.x - a.x, y: p.y - a.y };

        const ab2 = ab.x ** 2 + ab.y ** 2;
        const ap_ab = ap.x * ab.x + ap.y * ab.y;
        const t = Math.max(0, Math.min(1, ap_ab / ab2));

        return { x: a.x + t * ab.x, y: a.y + t * ab.y };
    }

    // Step 1: Check if the circle's center is inside the polygon
    const center = { x: circle.pivotCenter.x + circle.relCenter.x, y: circle.pivotCenter.y + circle.relCenter.y }

    if (isPointInsidePolygon(center, polygon)) return true;

    // Step 2: Check if any polygon edge is within the circle's radius
    for (let i = 0; i < polygon.length; i++) {
        const nextIndex = (i + 1) % polygon.length;
        const closestPoint = closestPointOnSegment(polygon[i], polygon[nextIndex], center);
        const distSquared = squaredDistance(center, closestPoint);

        if (distSquared <= circle.radius ** 2) {
            return true; // Collision detected
        }
    }

    return false; // No collision
}

function detectCollisionCircleCircle(c1: Circle, c2: Circle): boolean {
    const c1Center = { x: c1.pivotCenter.x + c1.relCenter.x, y: c1.pivotCenter.y + c1.relCenter.y }
    const c2Center = { x: c2.pivotCenter.x + c2.relCenter.x, y: c2.pivotCenter.y + c2.relCenter.y }
    const dx = c1Center.x - c2Center.x;
    const dy = c1Center.y - c2Center.y;
    return Math.sqrt(dx * dx + dy * dy) <= c1.radius + c2.radius;
}