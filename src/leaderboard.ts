import { getTopLapTimes, LeaderboardEntry } from "./firebase.js";

/**
 * Shows the leaderboard UI with fastest lap times
 */
export async function showLeaderboard(): Promise<void> {
    const leaderboardContainer = document.getElementById("leaderboard-container");
    if (!leaderboardContainer) return;

    leaderboardContainer.style.display = "block";

    try {
        const leaderboardData = await getTopLapTimes(10);
        renderLeaderboard(leaderboardData);
    } catch (error) {
        console.error("Error showing leaderboard:", error);
        document.getElementById("leaderboard-content")!.innerHTML =
            "<p>Failed to load leaderboard data</p>";
    }
}

/**
 * Hides the leaderboard UI
 */
export function hideLeaderboard(): void {
    const leaderboardContainer = document.getElementById("leaderboard-container");
    if (leaderboardContainer) {
        leaderboardContainer.style.display = "none";
    }
}

/**
 * Renders leaderboard data into the UI
 */
function renderLeaderboard(data: LeaderboardEntry[]): void {
    const contentElement = document.getElementById("leaderboard-content");
    if (!contentElement) return;

    if (data.length === 0) {
        contentElement.innerHTML = "<p>No lap times recorded yet!</p>";
        return;
    }

    let html = `
    <table class="leaderboard-table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Player</th>
          <th>Lap Time</th>
        </tr>
      </thead>
      <tbody>
  `;

    data.forEach((entry, index) => {
        const formattedTime = (entry.lapTime / 1000).toFixed(2);

        html += `
      <tr class="${index === 0 ? 'first-place' : ''}">
        <td>${index + 1}</td>
        <td>${entry.playerName}</td>
        <td>${formattedTime}s</td>
      </tr>
    `;
    });

    html += `
      </tbody>
    </table>
  `;

    contentElement.innerHTML = html;
}