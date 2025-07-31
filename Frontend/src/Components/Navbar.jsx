import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../Firebase';
import { signOut } from 'firebase/auth';

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      const storedRole = localStorage.getItem("role");
      setRole(storedRole || '');
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = () => {
    navigate("/signin");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.clear();           // ✅ Fully clear login state
      sessionStorage.clear();         // ✅ Clear sessionStorage too

      navigate("/");
      window.location.reload();       // ✅ Reload to refresh UI (important for admin views)
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const getDisplayName = () => {
    if (!user) return '';
    if (user.displayName) return user.displayName.split(' ')[0];
    return user.email;
  };

  return (
    <nav className="navbar">
      <div className="logo">🎟️ <b>Eventify</b></div>

      {/* Show different navbar for admin */}
      {role === "admin" ? (
        <div className="admin-navbar">
          <span style={{ color: "#fff", marginRight: "1rem" }}>
            Admin: {getDisplayName()}
          </span>
          <Button
            label="Logout"
            className="p-button-sm p-button-danger"
            onClick={handleLogout}
          />
        </div>
      ) : (
        <>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/movies">Movies</Link></li>
            <li><Link to="/my-tickets">My Tickets</Link></li>
          </ul>

          <div className="auth-section">
            {user ? (
              <>
                <span className="welcome-text">Welcome, {getDisplayName()}</span>
                <Button
                  label="Logout"
                  className="p-button-sm p-button-danger"
                  onClick={handleLogout}
                  style={{ marginLeft: '0.5rem' }}
                />
              </>
            ) : (
              <Button
                label="Sign In"
                className="p-button-sm p-button-primary"
                onClick={handleSignIn}
              />
            )}
          </div>
        </>
      )}
    </nav>
  );
}
