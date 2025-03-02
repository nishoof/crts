import { getTopLapTimes, LeaderboardEntry } from "./firebase.js";

/**
 * Loads the leaderboard data and renders it
 */
export async function loadLeaderboard(): Promise<void> {
  try {
    const leaderboardData = await getTopLapTimes(10);
    renderLeaderboard(leaderboardData);
  } catch (error) {
    console.error("Error loading leaderboard:", error);
    document.getElementById("leaderboard-content")!.innerHTML =
      "<p>Failed to load leaderboard data</p>";
  }
}

/**
 * Refreshes the leaderboard data
 */
export function refreshLeaderboard(): void {
  loadLeaderboard();
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
          <th>#</th>
          <th>Player</th>
          <th>Time</th>
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