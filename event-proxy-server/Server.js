// 1️⃣ Import required packages
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

// 2️⃣ Create the Express app
const app = express();
app.use(cors());

// 3️⃣ List of cities to fetch events from
const cities = ["Chandigarh", "Delhi","Amritsar"];

// 4️⃣ Events route
app.get("/api/events", async (req, res) => {
  try {
    const allEvents = [];

    for (const city of cities) {
      const response = await axios.get("https://serpapi.com/search", {
        params: {
          engine: "google_events",
          q: `events in ${city}`,
          hl: "en",
          api_key: process.env.SERPAPI_KEY, // 👈 This must be in your .env file
        },
      });
      allEvents.push(...(response.data.events_results || []));
    }

    res.json({ events_results: allEvents });
  } catch (error) {
    console.error("❌ Error fetching events:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// 5️⃣ Start the server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
