import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBQLR-QwJKAROvkYR9IGbeJ8xMOhCuVtsY",
    authDomain: "crts-f2514.firebaseapp.com",
    projectId: "crts-f2514",
    storageBucket: "crts-f2514.firebasestorage.app",
    messagingSenderId: "811073916149",
    appId: "1:811073916149:web:6ff683a360fcafa5bfc9bc",
    measurementId: "G-4MCS4HGLC7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Structure for a leaderboard entry
export interface LeaderboardEntry {
    playerName: string;
    lapTime: number;
}

/**
 * Save a player's lap time to the leaderboard
 */
export async function saveLapTime(playerName: string, lapTime: number): Promise<void> {
    try {
        await addDoc(collection(db, "leaderboard"), {
            playerName,
            lapTime,
            timestamp: new Date()
        });
        console.log("Lap time saved to leaderboard");
    } catch (error) {
        console.error("Error saving lap time:", error);
    }
}

/**
 * Get the top lap times from the leaderboard
 */
export async function getTopLapTimes(count: number = 10): Promise<LeaderboardEntry[]> {
    try {
        const q = query(
            collection(db, "leaderboard"),
            orderBy("lapTime", "asc"),  // Ascending order for fastest times
            limit(count)
        );

        const querySnapshot = await getDocs(q);
        const leaderboard: LeaderboardEntry[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            leaderboard.push({
                playerName: data.playerName,
                lapTime: data.lapTime
            });
        });

        return leaderboard;
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return [];
    }
}