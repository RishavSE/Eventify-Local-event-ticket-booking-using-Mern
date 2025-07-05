import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { ref, onValue, update, get } from "firebase/database";
import axios from "axios";
import "./Adminpannel.css";

const AdminPanel = () => {
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalMovies, setTotalMovies] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [userStats, setUserStats] = useState([]);

  const [front, setFront] = useState("");
  const [middle, setMiddle] = useState("");
  const [back, setBack] = useState("");

  const [seatStats, setSeatStats] = useState({
    totalFront: 0,
    availableFront: 0,
    totalMiddle: 0,
    availableMiddle: 0,
    totalBack: 0,
    availableBack: 0,
  });

  const TMDB_API_KEY = "e27ed7074beb1b541d30504cd37b496a";

  // ✅ Auto-reset seats at 12AM if needed
  useEffect(() => {
    const eventsRef = ref(db, "events");

    onValue(eventsRef, (snapshot) => {
      const events = snapshot.val();
      if (!events) return;

      const now = new Date();
      const today = now.toISOString().split("T")[0];

      Object.entries(events).forEach(([id, event]) => {
        const lastResetDate = event.lastReset?.split("T")[0];
        if (lastResetDate !== today && event.originalSeats) {
          const eventRef = ref(db, `events/${id}`);
          update(eventRef, {
            seats: event.originalSeats,
            lastReset: now.toISOString(),
          });
        }
      });
    });
  }, []);

  // ✅ Export user data to CSV
  const exportToCSV = (data, filename) => {
    const csvHeader = ["S.NO.", "Name", "Email", "Tickets Booked"];
    const csvRows = data.map((user, index) => [
      index + 1,
      `"${user.name}"`,
      `"${user.email}"`,
      user.ticketCount,
    ]);

    const csvContent = [
      csvHeader.join(","),
      ...csvRows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ Load Users and Tickets Stats
  useEffect(() => {
    const ticketsRef = ref(db, "tickets");
    const usersRef = ref(db, "users");

    onValue(usersRef, (userSnap) => {
      const usersData = userSnap.val() || {};
      const userList = Object.keys(usersData).map((uid) => {
        const email = usersData[uid].email;
        const displayName = usersData[uid].displayName;
        const name = displayName || email?.split("@")[0] || "No Name";
        return { uid, name, email, ticketCount: 0 };
      });

      onValue(ticketsRef, (ticketSnap) => {
        const ticketsData = ticketSnap.val() || {};
        const updatedList = userList.map((user) => {
          const userTickets = ticketsData[user.uid];
          return {
            ...user,
            ticketCount: userTickets ? Object.keys(userTickets).length : 0,
          };
        });

        setUserStats(updatedList);
        setTotalUsers(userList.length);
        setTotalTickets(
          updatedList.reduce((sum, u) => sum + u.ticketCount, 0)
        );
      });
    });
  }, []);

  // ✅ Load Movies and Events
  useEffect(() => {
    const fetchAPIData = async () => {
      try {
        const eventRes = await axios.get("http://localhost:5001/api/events");
        setTotalEvents(eventRes.data.events_results?.length || 0);

        const [popular, topRated] = await Promise.all([
          axios.get("https://api.themoviedb.org/3/movie/popular", {
            params: { api_key: TMDB_API_KEY, language: "en-US", page: 1 },
          }),
          axios.get("https://api.themoviedb.org/3/movie/top_rated", {
            params: { api_key: TMDB_API_KEY, language: "en-US", page: 1 },
          }),
        ]);

        const total =
          (popular.data.results?.length || 0) +
          (topRated.data.results?.length || 0);
        setTotalMovies(total);
      } catch (err) {
        console.error("❌ API Fetch Error:", err.message);
      }
    };

    fetchAPIData();
  }, []);

  // ✅ Handle Global Seat Update
  const handleSeatUpdateForAll = async () => {
    if (!front || !middle || !back) {
      alert("Please enter all seat values.");
      return;
    }

    const newSeats = {
      front: parseInt(front),
      middle: parseInt(middle),
      back: parseInt(back),
    };

    const now = new Date().toISOString();
    const eventsRef = ref(db, "events");

    try {
      const snapshot = await get(eventsRef);
      const events = snapshot.val();

      if (!events) {
        alert("❌ No events found to update.");
        return;
      }

      Object.keys(events).forEach((eventId) => {
        const eventRef = ref(db, `events/${eventId}`);
        update(eventRef, {
          seats: newSeats,
          originalSeats: newSeats,
          lastReset: now,
        });
      });

      alert("✅ All events updated!");
      setFront("");
      setMiddle("");
      setBack("");
    } catch (error) {
      console.error("❌ Error updating events:", error);
      alert("Something went wrong while updating seats.");
    }
  };

  // ✅ Calculate Seat Totals and Availability
  useEffect(() => {
    const eventsRef = ref(db, "events");
    onValue(eventsRef, (snapshot) => {
      const events = snapshot.val();
      if (!events) return;

      let totalFront = 0,
        availableFront = 0,
        totalMiddle = 0,
        availableMiddle = 0,
        totalBack = 0,
        availableBack = 0;

      Object.values(events).forEach((event) => {
        if (event.originalSeats) {
          totalFront += event.originalSeats.front || 0;
          totalMiddle += event.originalSeats.middle || 0;
          totalBack += event.originalSeats.back || 0;
        }
        if (event.seats) {
          availableFront += event.seats.front || 0;
          availableMiddle += event.seats.middle || 0;
          availableBack += event.seats.back || 0;
        }
      });

      setSeatStats({
        totalFront,
        availableFront,
        totalMiddle,
        availableMiddle,
        totalBack,
        availableBack,
      });
    });
  }, []);

  return (
    <div className="admin-panel">
      <div className="dashboard-section">
        <h2>👑 Admin Dashboard</h2>

        <div className="stats-grid">
          <div className="stat-card"><h3>👥Registered Users</h3><p>{totalUsers}</p></div>
          <div className="stat-card"><h3>📅Total Events</h3><p>{totalEvents}</p></div>
          <div className="stat-card"><h3>🎬Total Movies</h3><p>{totalMovies}</p></div>
          <div className="stat-card"><h3>🎫Booked Tickets</h3><p>{totalTickets}</p></div>
        </div>
      </div>

      {/* ✅ Combined Seat Summary */}
      <div className="dashboard-section">
        <h3 style={{ color: "#fff", marginTop: "2rem", textAlign: "center" }}>
          🪑 Seats Summary
        </h3>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Front</h3>
            <p>{seatStats.availableFront} / {seatStats.totalFront} available</p>
          </div>
          <div className="stat-card">
            <h3>Middle</h3>
            <p>{seatStats.availableMiddle} / {seatStats.totalMiddle} available</p>
          </div>
          <div className="stat-card">
            <h3>Back</h3>
            <p>{seatStats.availableBack} / {seatStats.totalBack} available</p>
          </div>
        </div>
      </div>

      {/* ✅ Global Seat Update */}
      <div className="seat-manager-section">
        <h3 style={{ color: "#fff", textAlign: "center", marginTop: "2rem" }}>
          🎯 Set Global Seats for All Events
        </h3>

        <div className="seat-inputs">
          <input type="number" placeholder="Front" value={front} onChange={(e) => setFront(e.target.value)} />
          <input type="number" placeholder="Middle" value={middle} onChange={(e) => setMiddle(e.target.value)} />
          <input type="number" placeholder="Back" value={back} onChange={(e) => setBack(e.target.value)} />
          <button onClick={handleSeatUpdateForAll}>✅ Apply</button>
        </div>
      </div>

      {/* ✅ Users Table */}
      <div className="user-table-section">
        <h3 style={{ marginTop: "2rem", textAlign: "center" }}>📋 Users Data</h3>

        <div className="csv-export-bottom-wrapper">
          <button onClick={() => exportToCSV(userStats, "users_data.csv")} className="csv-export-btn">
            📥 Export Users as CSV
          </button>
        </div>

        <div className="table-wrapper">
          <table className="user-table">
            <thead>
              <tr><th>S.NO.</th><th>Name</th><th>Email</th><th>🎟️ Tickets Booked</th></tr>
            </thead>
            <tbody>
              {userStats.map((user, index) => (
                <tr key={user.uid}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.ticketCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
