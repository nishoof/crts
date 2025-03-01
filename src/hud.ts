import Player from "./player/player.js";

function drawHUD(ctx: CanvasRenderingContext2D, player: Player) {
    // upgrades
    if (player.level > player.vehicle.levelUp) {
        document.getElementById("vehicle-upgrades")!.style.display = "block";
        document.getElementById(`{player.vehicle.name}-upgrades`)!.style.display = "flex";
    }
    // if (player.level > player.character.levelUp) {
    //     document.getElementById("character-upgrades")!.style.display = "block";
    //     document.getElementById(`{player.character.name}-upgrades`)!.style.display = "flex";
    // }

    // bottom display
    document.getElementById("level-progress-bar")!.style.width = "50%"; // update based on player level
}