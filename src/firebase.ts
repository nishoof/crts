import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, where, updateDoc } from "firebase/firestore";

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
 * If the player already has an entry, update it if the new time is faster
 */
export async function saveLapTime(playerName: string, lapTime: number): Promise<void> {
    try {
        // Check if player already has an entry
        const playerQuery = query(
            collection(db, "leaderboard"),
            where("playerName", "==", playerName)
        );

        const querySnapshot = await getDocs(playerQuery);

        if (!querySnapshot.empty) {
            // Player already has an entry
            let docToUpdate = null;
            let fastestExistingTime = Infinity;

            // Find the player's fastest existing time and document
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.lapTime < fastestExistingTime) {
                    fastestExistingTime = data.lapTime;
                    docToUpdate = doc.ref;
                }
            });

            // Only update if the new time is faster
            if (lapTime < fastestExistingTime && docToUpdate) {
                await updateDoc(docToUpdate, {
                    lapTime,
                    timestamp: new Date()
                });
                console.log("Updated player's best lap time");
            } else {
                console.log("Existing lap time is faster, not updating");
            }
        } else {
            // New player - create new entry
            await addDoc(collection(db, "leaderboard"), {
                playerName,
                lapTime,
                timestamp: new Date()
            });
            console.log("New lap time saved to leaderboard");
        }
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