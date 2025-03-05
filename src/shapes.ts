import { rotate } from "./helper.js"

// Physical thing on the map (pretend it's an abstract class)
export class Shape {
    color: string;
    center: Point;
    rotation: number;
    speed: number;

    constructor(color: string, center: Point, rotation: number) {
        this.color = color;
        this.center = center;
        this.rotation = rotation;
        this.speed = 0;
    }

    draw(ctx: CanvasRenderingContext2D, topleft: Point, stroke?: boolean) {
        throw new Error("draw() must be implemented in subclass");
    }

    move(speed: number) {
        this.center.x += Math.cos(this.rotation) * speed;
        this.center.y += Math.sin(this.rotation) * speed;
    }

    moveWithRotation(speed: number, rotation: number) {
        this.center.x += Math.cos(rotation) * speed;
        this.center.y += Math.sin(rotation) * speed;
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

    constructor(color: string, center: Point, width: number, height: number, rotation = 0) {
        super(color, center, rotation);
        this.width = width;
        this.height = height;
    }

    draw(ctx: CanvasRenderingContext2D, topleft: Point, stroke?: boolean): void {
        stroke = stroke ?? true;

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

        return false;
    }

    calculatePoints(): Point[] {
        let p1 = rotate(this.center, { x: this.center.x - this.width / 2, y: this.center.y - this.height / 2 }, this.rotation);
        let p2 = rotate(this.center, { x: this.center.x + this.width / 2, y: this.center.y - this.height / 2 }, this.rotation);
        let p3 = rotate(this.center, { x: this.center.x + this.width / 2, y: this.center.y + this.height / 2 }, this.rotation);
        let p4 = rotate(this.center, { x: this.center.x - this.width / 2, y: this.center.y + this.height / 2 }, this.rotation);
        return [p1, p2, p3, p4];
    }
}

export class Circle extends Shape {
    radius: number;

    constructor(color: string, center: Point, radius: number, rotation = 0) {
        super(color, center, rotation);
        this.radius = radius;
    }

    draw(ctx: CanvasRenderingContext2D, topleft: Point, stroke?: boolean) {
        stroke = stroke ?? true;

        ctx.beginPath();
        ctx.arc(this.center.x - topleft.x, this.center.y - topleft.y, this.radius, 0, 2 * Math.PI);

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
    move(speed: number) {
        let deltaX: number = Math.cos(this.rotation) * speed;
        let deltaY: number = Math.sin(this.rotation) * speed;
        this.center.x += deltaX;
        this.center.y += deltaY;
    }
}

export class Triangle extends Shape {
    width: number;
    height: number;

    constructor(color: string, center: Point, width: number, height: number, rotation = 0) {
        super(color, center, rotation);
        this.width = width;
        this.height = height;
    }

    draw(ctx: CanvasRenderingContext2D, topleft: Point, stroke?: boolean) {
        stroke = stroke ?? true;
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
        let p1 = rotate(this.center, { x: this.center.x + this.width / 2, y: this.center.y }, this.rotation);
        let p2 = rotate(this.center, { x: this.center.x - this.width / 2, y: this.center.y + this.height / 2 }, this.rotation);
        let p3 = rotate(this.center, { x: this.center.x - this.width / 2, y: this.center.y - this.height / 2 }, this.rotation);
        return [p1, p2, p3];
    }
}


export class pivotRect extends Rect {
    pivot: Point;
    constructor(color: string, pivot: Point, width: number, height: number, rotation = 0) {
        super(color, { x: pivot.x + width / 2, y: pivot.y }, width, height, rotation);
        this.pivot = pivot;

    }
    calculatePoints(): Point[] {
        let p1 = rotate(this.pivot, { x: this.pivot.x, y: this.pivot.y - this.height / 2 }, this.rotation);
        let p2 = rotate(this.pivot, { x: this.pivot.x + this.width, y: this.pivot.y - this.height / 2 }, this.rotation);
        let p3 = rotate(this.pivot, { x: this.pivot.x + this.width, y: this.pivot.y + this.height / 2 }, this.rotation);
        let p4 = rotate(this.pivot, { x: this.pivot.x, y: this.pivot.y + this.height / 2 }, this.rotation);


        return [p1, p2, p3, p4];
    }
}

type Point = { x: number; y: number };
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
    if (isPointInsidePolygon(circle.center, polygon)) return true;

    // Step 2: Check if any polygon edge is within the circle's radius
    for (let i = 0; i < polygon.length; i++) {
        const nextIndex = (i + 1) % polygon.length;
        const closestPoint = closestPointOnSegment(polygon[i], polygon[nextIndex], circle.center);
        const distSquared = squaredDistance(circle.center, closestPoint);

        if (distSquared <= circle.radius ** 2) {
            return true; // Collision detected
        }
    }

    return false; // No collision
}

function detectCollisionCircleCircle(c1: Circle, c2: Circle): boolean {
    const dx = c1.center.x - c2.center.x;
    const dy = c1.center.y - c2.center.y;
    return Math.sqrt(dx * dx + dy * dy) <= c1.radius + c2.radius;
}