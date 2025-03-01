class Vehicle{
    shape: Body;
    acceleration: number;
    rotVelocity: number;

    constructor(shape: Body, speed: number) {
        this.shape = shape;
        this.acceleration = 0;
        this.rotVelocity = 0;
        shape.speed = speed;
    }
    accelerate() {
        throw new Error("accelrate() must be implemented in subclasses.");
    }
    
    run() {
        throw new Error("run() must be implemented in subclasses.")
    }

}
//Thin rectangle
class Bike extends Vehicle{

}


//Normal rectangle
class Car extends Vehicle{

}

//Square
class Truck extends Car{

}

//Long triangle
class RaceCar extends Car{

}

//Equaliteral triangle 
class Moped extends Vehicle{

}

//Circle
class Hoverboard extends Vehicle{

}

//Big rectangle
class Cybertruck extends Hoverboard{

}

//Larger circle
class UFO extends Hoverboard{

}
