// src/Firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // ✅ Realtime DB

const firebaseConfig = {
  apiKey: "Enter_your_api",
  authDomain: "local-ticket.firebaseapp.com",
  projectId: "local-ticket",
  storageBucket: "local-ticket.firebasestorage.app",
  messagingSenderId: "Enter_your_data",
  appId: "enter_your_data"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app); // ✅ Use Realtime DB instead of Firestore

// ✅ Export
export { auth, db };
