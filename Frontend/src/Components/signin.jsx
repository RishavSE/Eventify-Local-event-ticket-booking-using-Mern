import React, { useState } from "react";
import "./signin.css";
import "./Changepass.css";
import { FcGoogle } from "react-icons/fc";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, db } from "../Firebase";
import { ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";

const SignIn = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const ADMIN_EMAIL = "infosys@gmail.com";

  // 🔐 Email & Password Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const isAdmin = user.email === ADMIN_EMAIL;

      localStorage.setItem("userInfo", JSON.stringify(user));
      localStorage.setItem("role", isAdmin ? "admin" : "user");
      localStorage.setItem("isLoggedIn", "true");

      if (onLogin) onLogin();
      navigate(isAdmin ? "/admin" : "/my-tickets");

    } catch (error) {
      console.error("Login error:", error.message);
      alert("Invalid email or password");
    }
  };

  // 🔐 Google Sign-In + Save to DB + Redirect
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user to Realtime DB
      await set(ref(db, `users/${user.uid}`), {
        name: user.displayName || "Google User",
        email: user.email,
      });

      const isAdmin = user.email === ADMIN_EMAIL;

      localStorage.setItem("userInfo", JSON.stringify(user));
      localStorage.setItem("role", isAdmin ? "admin" : "user");
      localStorage.setItem("isLoggedIn", "true");

      if (onLogin) onLogin();
      navigate(isAdmin ? "/admin" : "/my-tickets");

    } catch (error) {
      console.error("Google login error:", error.message);
      alert("Google sign-in failed");
    }
  };

  // 🔄 Reset Modal Logic
  const resetModalFields = () => {
    setResetEmail("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Reset request:", { email: resetEmail, newPassword });
    alert("Password reset request sent.");
    resetModalFields();
    setShowResetModal(false);
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2 className="signin-title">Welcome Back 👋</h2>

        <form onSubmit={handleSubmit} className="signin-form">
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="signin-links">
            <span
              onClick={() => setShowResetModal(true)}
              style={{ cursor: "pointer", color: "#7b2ff7" }}
            >
              Forgot Password?
            </span>
            <span
              style={{ color: "#7b2ff7", cursor: "pointer" }}
              onClick={() => navigate("/signup")}
            >
              Create Account
            </span>
          </div>

          <button type="submit">Sign In</button>
        </form>

        <hr />
        <div className="continue">
          <h6>Continue with</h6>
        </div>
        <button className="google-login-icon" onClick={handleGoogleLogin}>
          <FcGoogle />
        </button>
      </div>

      {/* 🔄 Password Reset Modal */}
      {showResetModal && (
        <div
          className="changepass-container"
          onClick={() => {
            setShowResetModal(false);
            resetModalFields();
          }}
        >
          <div className="changepass-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="changepass-title">🔒 Reset Password</h2>
            <form onSubmit={handleResetSubmit} className="changepass-form">
              <label>Enter Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />

              <label>Set New Password</label>
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <label>Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />

              <button type="submit" className="changepass-btn">
                Reset Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetModal(false);
                  resetModalFields();
                }}
                className="changepass-btn cancel-btn"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;
