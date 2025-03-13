import Player from "./player/player.js";

function drawVehicleMenu(player: Player): boolean {
    // set displays to none initially
    const upgradeableVehicles = ["Bike", "Car", "Moped", "Hoverboard"];
    document.getElementById("vehicle-upgrades")!.style.display = "none";
    upgradeableVehicles.forEach((vehicleName) => {
        document.getElementById(`${vehicleName}-upgrades`)!.style.display = "none";
    });

    if (player.vehicle.levelUp == -1) return false; // max level
    if (player.level < player.vehicle.levelUp) return false;

    // show valid upgrades
    document.getElementById("vehicle-upgrades")!.style.display = "block";
    upgradeableVehicles.forEach((vehicleName) => {
        if (vehicleName == player.vehicle.name) document.getElementById(`${vehicleName}-upgrades`)!.style.display = "flex";
        else document.getElementById(`${vehicleName}-upgrades`)!.style.display = "none";
    });

    return true;    
}

function drawCharacterMenu(player: Player) {
    // set displays to none initially
    const upgradeableCharacters = ["Rifleman", "Gunner", "Sniper", "Cannoneer"];
    document.getElementById("character-upgrades")!.style.display = "none";
    upgradeableCharacters.forEach((characterName) => {
        document.getElementById(`${characterName}-upgrades`)!.style.display = "none";
    });
    
    if (player.character.levelUp == -1) return; // max level
    if (player.level < player.character.levelUp) return;

    // show valid upgrades
    document.getElementById("character-upgrades")!.style.display = "block";
    upgradeableCharacters.forEach((characterName) => {
        if (characterName == player.character.name) document.getElementById(`${characterName}-upgrades`)!.style.display = "flex";
        else document.getElementById(`${characterName}-upgrades`)!.style.display = "none";
    }); 
}

export function drawHUD(player: Player) {
    // upgrade menu
    if (!drawVehicleMenu(player)) drawCharacterMenu(player);

    // bottom display
    document.getElementById("level-progress-text")!.innerHTML = `Level ${player.level}   ${player.progressToNextLevel}/${(player.level + 1) * 50}`;
    document.getElementById("level-progress-bar")!.style.width = `${player.progressToNextLevel / player.calculateNextLevelScore() * 100}%`;

    // speedometer
    document.getElementById("speedometer-fill")!.style.height = `${player.currentSpeed/ player.vehicle.maxSpeedStat* 100}%`;
}