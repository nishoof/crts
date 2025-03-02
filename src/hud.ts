import Player from "./player/player.js";

export function drawHUD(player: Player) {
    let showingVehicleMenu = false;
    // upgrades
    const upgradeableVehicles = ["Bike", "Car", "Moped", "Hoverboard"];
    if (player.level >= player.vehicle.levelUp) {
        showingVehicleMenu = true;
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

    const upgradeableCharacters = ["Rifleman", "Gunner", "Sniper", "Cannoneer"];
    if (!showingVehicleMenu && player.level >= player.character.levelUp) {
        document.getElementById("character-upgrades")!.style.display = "block";
        upgradeableCharacters.forEach((characterName) => {
            if (characterName == player.character.name) document.getElementById(`${characterName}-upgrades`)!.style.display = "flex";
            else document.getElementById(`${characterName}-upgrades`)!.style.display = "none";
        });
    } else {
        document.getElementById("character-upgrades")!.style.display = "none";
        upgradeableCharacters.forEach((characterName) => {
            document.getElementById(`${characterName}-upgrades`)!.style.display = "none";
        });
    }

    // bottom display
    document.getElementById("level-progress-text")!.innerHTML = `Level ${player.level}   ${player.progressToNextLevel}/${(player.level + 1) * 50}`;
    document.getElementById("level-progress-bar")!.style.width = `${player.progressToNextLevel / player.calculateNextLevelScore() * 100}%`;
}