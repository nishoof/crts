// import { initializeApp } from "./dep/app.js";
// import { 
//   getDatabase, 
//   ref, 
//   set, 
//   update, 
//   push, 
//   remove, 
//   get, 
//   onValue 
// } from 'firebase/database';

// // Your Firebase configuration
// // Replace these with your actual Firebase project config
// const firebaseConfig = {
//     apiKey: "AIzaSyBQLR-QwJKAROvkYR9IGbeJ8xMOhCuVtsY",
//     authDomain: "crts-f2514.firebaseapp.com",
//     projectId: "crts-f2514",
//     storageBucket: "crts-f2514.firebasestorage.app",
//     messagingSenderId: "811073916149",
//     appId: "1:811073916149:web:6ff683a360fcafa5bfc9bc",
//     measurementId: "G-4MCS4HGLC7"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);

// /**
//  * Create or update a record at a specific path
//  */
// export async function setData(path: string, data: any): Promise<void> {
//   const dbRef = ref(db, path);
//   try {
//     await set(dbRef, data);
//     console.log(`Data successfully written at ${path}`);
//   } catch (error) {
//     console.error("Error writing data: ", error);
//     throw error;
//   }
// }

// /**
//  * Update specific fields without overwriting the entire object
//  */
// export async function updateData(path: string, updates: any): Promise<void> {
//   const dbRef = ref(db, path);
//   try {
//     await update(dbRef, updates);
//     console.log(`Data successfully updated at ${path}`);
//   } catch (error) {
//     console.error("Error updating data: ", error);
//     throw error;
//   }
// }

// /**
//  * Create a new record with a unique key
//  */
// export async function createRecord(path: string, data: any): Promise<string> {
//   const dbRef = ref(db, path);
//   try {
//     const newRef = push(dbRef);
//     await set(newRef, data);
//     console.log(`New record created at ${newRef.key}`);
//     return newRef.key as string;
//   } catch (error) {
//     console.error("Error creating record: ", error);
//     throw error;
//   }
// }

// /**
//  * Delete a record at the specified path
//  */
// export async function deleteData(path: string): Promise<void> {
//   const dbRef = ref(db, path);
//   try {
//     await remove(dbRef);
//     console.log(`Data successfully deleted at ${path}`);
//   } catch (error) {
//     console.error("Error deleting data: ", error);
//     throw error;
//   }
// }

// /**
//  * Read data once from the specified path
//  */
// export async function readData(path: string): Promise<any> {
//   const dbRef = ref(db, path);
//   try {
//     const snapshot = await get(dbRef);
//     if (snapshot.exists()) {
//       console.log(`Data retrieved from ${path}`);
//       return snapshot.val();
//     } else {
//       console.log(`No data available at ${path}`);
//       return null;
//     }
//   } catch (error) {
//     console.error("Error reading data: ", error);
//     throw error;
//   }
// }

// /**
//  * Subscribe to real-time updates at the specified path
//  */
// export function subscribeToData(path: string, callback: (data: any) => void): () => void {
//   const dbRef = ref(db, path);
//   const unsubscribe = onValue(dbRef, (snapshot) => {
//     if (snapshot.exists()) {
//       callback(snapshot.val());
//     } else {
//       callback(null);
//     }
//   }, (error) => {
//     console.error("Error subscribing to data: ", error);
//   });
  
//   return unsubscribe;
// }

// // Example usage
// async function exampleUsage() {
//   // Set data
//   await setData('/users/123', {
//     name: 'John Doe',
//     email: 'john@example.com',
//     age: 30
//   });
  
//   // Update specific fields
//   await updateData('/users/123', {
//     age: 31,
//     lastLogin: new Date().toISOString()
//   });
  
//   // Create a new record with auto-generated ID
//   const newProductId = await createRecord('/products', {
//     name: 'Awesome Product',
//     price: 99.99,
//     inStock: true
//   });
  
//   // Read data
//   const userData = await readData('/users/123');
//   console.log('User data:', userData);
  
//   // Subscribe to real-time updates
//   const unsubscribe = subscribeToData('/users/123', (userData) => {
//     console.log('User data updated:', userData);
//   });
  
//   // Later, when you want to stop listening
//   // unsubscribe();
  
//   // Delete data
//   // await deleteData('/users/123');
// }

// // Run the example
// exampleUsage().catch(console.error);