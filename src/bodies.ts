// Physical thing on the map (pretend it's an abstract class)
class Shape {
    color: string;
    center: { x: number, y: number };
    rotation: number;
    speed: number;

    constructor(color: string, center: { x: number, y: number }, rotation: number) {
        this.color = color;
        this.center = center;
        this.rotation = rotation;
        this.speed = 0;
    }

    draw() {
        throw new Error("draw() must be implemented in subclass");
    }

    move(speed: number) {
        this.center.x += Math.cos(this.rotation) * speed;
        this.center.y += Math.sin(this.rotation) * speed;
    }

    rotate(amount: number) {
        this.rotation += amount;
    }

    detectCollision(other: Shape) {
        throw new Error("detectCollision() must be implemented in subclass");
    }
}

class Rect extends Shape {
    width: number;
    height: number;

    constructor(color: string, center: { x: number, y: number }, width: number, height: number, rotation = 0) {
        super(color, center, rotation);
        this.width = width;
        this.height = height;
    }

    draw(): void {
        const points = this.calculatePoints();
    }

    detectCollision(other: Shape): boolean {
        const points = this.calculatePoints();

        function detectCollisionRect(other: Rect): boolean {
            return false;
        }

        function detectCollisionCircle(other: Circle): boolean {
            return false;
        }

        function detectCollisionTriangle(other: Triangle): boolean {
            return false;
        }

        if (other instanceof Rect) return detectCollisionRect(other);
        if (other instanceof Circle) return detectCollisionCircle(other);
        if (other instanceof Triangle) return detectCollisionTriangle(other);

        return false;
    }

    calculatePoints() {
        let p1 = rotation(this.center, { x: this.center.x - this.width / 2, y: this.center.y - this.height / 2 }, this.rotation);
        let p2 = rotation(this.center, { x: this.center.x + this.width / 2, y: this.center.y - this.height / 2 }, this.rotation);
        let p3 = rotation(this.center, { x: this.center.x + this.width / 2, y: this.center.y + this.height / 2 }, this.rotation);
        let p4 = rotation(this.center, { x: this.center.x - this.width / 2, y: this.center.y + this.height / 2 }, this.rotation);
        return [p1, p2, p3, p4];
    }
}

class Circle extends Shape {
    radius: number;

    constructor(color: string, center: { x: number, y: number }, radius: number, rotation = 0) {
        super(color, center, rotation);
        this.radius = radius;
    }

    draw() {
    }

    detectCollision(other: Shape): boolean {
        function detectCollisionRect(other: Rect): boolean {
            return false;
        }

        function detectCollisionCircle(other: Circle): boolean {
            return false;
        }

        function detectCollisionTriangle(other: Triangle): boolean {
            return false;
        }

        if (other instanceof Rect) return detectCollisionRect(other);
        if (other instanceof Circle) return detectCollisionCircle(other);
        if (other instanceof Triangle) return detectCollisionTriangle(other);

        throw new Error("Unknown Shape type for collision detection");
    }
}

class Triangle extends Shape {
    width: number;
    height: number;

    constructor(color: string, center: { x: number, y: number }, width: number, height: number, rotation = 0) {
        super(color, center, rotation);
        this.width = width;
        this.height = height;
    }

    draw() {
        const points = this.calculatePoints();
    }

    move(speed: number) {
        this.center.x += Math.cos(this.rotation) * speed;
        this.center.y += Math.sin(this.rotation) * speed;
    }

    rotate(amount: number) {
        this.rotation += amount;
    }

    detectCollision(other: Shape): boolean {
        const points = this.calculatePoints();

        function detectCollisionRect(other: Rect): boolean {
            return false;
        }

        function detectCollisionCircle(other: Circle): boolean {
            return false;
        }

        function detectCollisionTriangle(other: Triangle): boolean {
            return false;
        }

        if (other instanceof Rect) return detectCollisionRect(other);
        if (other instanceof Circle) return detectCollisionCircle(other);
        if (other instanceof Triangle) return detectCollisionTriangle(other);

        throw new Error("Unknown Shape type for collision detection");
    }

    calculatePoints() {
        let p1 = rotation(this.center, { x: this.center.x + this.width / 2, y: this.center.y }, this.rotation);
        let p2 = rotation(this.center, { x: this.center.x - this.width / 2, y: this.center.y + this.height / 2 }, this.rotation);
        let p3 = rotation(this.center, { x: this.center.x - this.width / 2, y: this.center.y - this.height / 2 }, this.rotation);
        return [p1, p2, p3];
    }
}