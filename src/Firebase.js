// src/Firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // ✅ Realtime DB

const firebaseConfig = {
  apiKey: "AIzaSyD3o7Y1rKgRkualsRc1zwH66mvlkXsewtc",
  authDomain: "local-ticket.firebaseapp.com",
  projectId: "local-ticket",
  storageBucket: "local-ticket.firebasestorage.app",
  messagingSenderId: "862320605976",
  appId: "1:862320605976:web:eac82bffa8df7d8b463c6d"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app); // ✅ Use Realtime DB instead of Firestore

// ✅ Export
export { auth, db };
