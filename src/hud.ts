import Player from "./player/player.js";

export function drawHUD(ctx: CanvasRenderingContext2D, player: Player) {
    // upgrades
    const upgradeableVehicles = ["Bike", "Car", "Moped", "Hoverboard"];
    if (player.level >= player.vehicle.levelUp) {
        document.getElementById("vehicle-upgrades")!.style.display = "block";
        upgradeableVehicles.forEach((vehicleName) => {
            if (vehicleName == player.vehicle.name) document.getElementById(`${vehicleName}-upgrades`)!.style.display = "flex";
            else document.getElementById(`${vehicleName}-upgrades`)!.style.display = "none";
        });
    } else {
        document.getElementById("vehicle-upgrades")!.style.display = "none";
        upgradeableVehicles.forEach((vehicleName) => {
            document.getElementById(`${vehicleName}-upgrades`)!.style.display = "none";
        });
    }
    // if (player.level > player.character.levelUp) {
    //     document.getElementById("character-upgrades")!.style.display = "block";
    //     document.getElementById(`{player.character.name}-upgrades`)!.style.display = "flex";
    // }

    // bottom display
    document.getElementById("level-progress-text")!.innerHTML = `Level ${player.level}   ${player.progressToNextLevel}/${(player.level+1)*100}`;
    document.getElementById("level-progress-bar")!.style.width = `${player.progressToNextLevel/(player.level+1)}%`;
}