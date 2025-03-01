/**
 * 
 * detectCollision()
 * 
 * class Body
 *   draw()
 *   collision()
 * 
 * class Triangle, Rect, Circle extends Body
 * 
 */

class Body {
    color: string;
    velX: number;
    velY: number;

    constructor(color: string) {
        this.color = color;
        this.velX = 0, this.velY = 0;
    }

    draw() {
        throw new Error("draw() must be implemented in subclass");
    }

    move(speed: number) {
        throw new Error("move() must be implemented in subclass");
    }

    detectCollision(other: Body) {
        throw new Error("detectCollision() must be implemented in subclass");

    }
}

class Rect extends Body {
    center: { x: number, y: number };
    width: number;
    height: number;
    rotation: number;

    constructor(color: string, center: { x: number, y: number }, width: number, height: number, rotation=0) {
        super(color);
        this.center = center;
        this.width = width;
        this.height = height;
        this.rotation = rotation;
    }

    draw(): void {
        let p1 = rotation(this.center, {x: this.center.x-this.width/2, y: this.center.y-this.height/2}, this.rotation);
        let p2 = rotation(this.center, {x: this.center.x+this.width/2, y: this.center.y-this.height/2}, this.rotation);
        let p3 = rotation(this.center, {x: this.center.x+this.width/2, y: this.center.y+this.height/2}, this.rotation);
        let p4 = rotation(this.center, {x: this.center.x-this.width/2, y: this.center.y+this.height/2}, this.rotation);
    }

    move(speed: number) {
        this.center.x += Math.cos(this.rotation)*speed;
        this.center.y += Math.sin(this.rotation)*speed;
    }

    rotate(amount: number) {
        this.rotation += amount;
    }

    detectCollision(other: Body): boolean {
        let p1 = rotation(this.center, {x: this.center.x-this.width/2, y: this.center.y-this.height/2}, this.rotation);
        let p2 = rotation(this.center, {x: this.center.x+this.width/2, y: this.center.y-this.height/2}, this.rotation);
        let p3 = rotation(this.center, {x: this.center.x+this.width/2, y: this.center.y+this.height/2}, this.rotation);
        let p4 = rotation(this.center, {x: this.center.x-this.width/2, y: this.center.y+this.height/2}, this.rotation);

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
    }
}

class Circle extends Body {
    point: { x: number, y: number };
    radius: number;
    rotation: number;

    constructor(color: string, point: { x: number, y: number }, radius: number, rotation=0) {
        super(color);
        this.point = point;
        this.radius = radius;
        this.rotation = rotation;
    }

    draw() {

    }

    move(speed: number) {
        this.point.x += Math.cos(this.rotation)*speed;
        this.point.y += Math.sin(this.rotation)*speed;
    }

    rotate(amount: number) {
        this.rotation += amount;
    }

    detectCollision(other: Body): boolean {
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
    }
}

class Triangle extends Body {
    center: { x: number, y: number };
    width: number;
    height: number;
    rotation: number;

    constructor(color: string, center: { x: number, y: number }, width: number, height: number, rotation=0) {
        super(color);
        this.center = center;
        this.width = width;
        this.height = height;
        this.rotation = rotation;
    }

    draw() {
        let p1 = rotation(this.center, {x: this.center.x+this.width/2, y: this.center.y}, this.rotation);
        let p2 = rotation(this.center, {x: this.center.x-this.width/2, y: this.center.y+this.height/2}, this.rotation);
        let p3 = rotation(this.center, {x: this.center.x-this.width/2, y: this.center.y-this.height/2}, this.rotation);
    }

    move(speed: number) {
        this.center.x += Math.cos(this.rotation)*speed;
        this.center.y += Math.sin(this.rotation)*speed;        
    }

    rotate(amount: number) {
        this.rotation += amount;
    }

    detectCollision(other: Body): boolean {
        let p1 = rotation(this.center, {x: this.center.x+this.width/2, y: this.center.y}, this.rotation);
        let p2 = rotation(this.center, {x: this.center.x-this.width/2, y: this.center.y+this.height/2}, this.rotation);
        let p3 = rotation(this.center, {x: this.center.x-this.width/2, y: this.center.y-this.height/2}, this.rotation);

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
    }
}