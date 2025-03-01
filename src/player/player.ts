class Player {
    vehicle: Vehicle;
    character: Character;

    constructor() {
        const position = { x: 0, y: 0 };
        this.vehicle = new Bike(position);
        this.character = new Rifleman(position);
    }
}
