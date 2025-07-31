import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import PopularEvents from "./Components/PopularEvents";
import SignIn from "./Components/signin";
import GoogleEvents from "./Components/Eventsgoogle";
import Footerr from "./Components/Footer";
import MyTickets from "./Components/Mytickets";
import AboutUs from "./Components/Aboutus";
import TMDBMovies from "./Components/Movies";
import Signup from "./Components/Signup";

import AdminPanel from "./Adminpannel1/Adminpannel";
import RequireAdmin from "./Adminpannel1/Requireadmin";

import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../src/Firebase";

// ✅ Admin Header UI
function AdminHeader({ onLogout }) {
  const user = JSON.parse(localStorage.getItem("userInfo")) || {};
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundColor: "white",
        color: "#fff",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "black" }}>
        🎟️ Eventify
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: "bold", color: "black" }}>
            {user.displayName || "Admin"}
          </div>
          <div style={{ fontSize: "0.85rem", color: "black" }}>
            Role: Admin
          </div>
        </div>
        <button
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#ff4081",
            border: "none",
            borderRadius: "5px",
            color: "white",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onClick={async () => {
            try {
              await signOut(auth);
              localStorage.clear();
              onLogout();
              navigate("/");
            } catch (error) {
              console.error("Admin logout error:", error);
            }
          }}
        >
          🔓 Logout
        </button>
      </div>
    </div>
  );
}

// ✅ Main App Content
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(localStorage.getItem("role") || null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        const email = user.email;
        const isAdmin =
          email === "admin@gmail.com" || email === "infosys@gmail.com";
        const userRole = isAdmin ? "admin" : "user";

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", userRole);
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            displayName: user.displayName || "User",
            email,
          })
        );
        setRole(userRole);
      } else {
        setIsLoggedIn(false);
        setRole(null);
        localStorage.clear();
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setRole(null);
      localStorage.clear();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {isAdminRoute && role === "admin" ? (
        <AdminHeader onLogout={handleLogout} />
      ) : (
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      )}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <PopularEvents />
              <Footerr />
            </>
          }
        />

        <Route path="/signin" element={<SignIn onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/events" element={<GoogleEvents />} />
        <Route path="/movies" element={<TMDBMovies />} />

        {/* ✅ My Tickets - accessible by everyone */}
        <Route path="/my-tickets" element={<MyTickets />} />

        {/* ✅ Capitalized redirect fallback */}
        <Route path="/MyTickets" element={<Navigate to="/my-tickets" />} />

        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminPanel />
            </RequireAdmin>
          }
        />

        <Route
          path="/unauthorized"
          element={
            <h2 style={{ textAlign: "center", marginTop: "2rem" }}>
              🚫 Unauthorized Access
            </h2>
          }
        />
      </Routes>
    </>
  );
}

// ✅ Main App Wrapper
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
