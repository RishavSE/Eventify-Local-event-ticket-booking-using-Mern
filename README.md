# 🎟️ EVENTIFY – LOCAL EVENT MANAGEMENT SYSTEM

**Eventify** is a full-stack web application for discovering, booking, and managing local events and movies.  
It supports two roles — **users** and **admins** — with secure Firebase authentication, real-time seat tracking, and an analytics dashboard.

---

## ⚙️ TECHNOLOGY STACK

### 🖥️ Frontend
- ⚛️ **React.js** – Component-based UI
- 🧭 **React Router DOM** – Client-side routing
- 📡 **Axios** – API communication
- 🎨 **Plain CSS** – Responsive UI styling

### 🛠️ Backend
- 🧩 **Node.js + Express.js** – RESTful API for events & movies
- 🔐 **Firebase Authentication** – Email/password login system
- 🗃️ **Firebase Realtime Database / Firestore** – Data storage for users, bookings, events

---

## 🚀 FEATURES

### 👤 User Features
- 🔐 Secure user registration and login
- 🔑 Google OAuth Sign-In
- 🎫 Browse events and movies
- ✅ Real-time ticket booking and availability
- 📋 View “My Tickets”
- 🧾 PDF ticket generation

### 🧑‍💼 Admin Features
- 🔐 Admin-secured dashboard
- 📊 View:
  - 👥 Total Users  
  - 🎟️ Total Tickets Booked
  - 🗂️ Total Events  
  - 🎬 Total Movies
  - 🎟️ Total availability of seats 
- 🪑 Manage seat availability
- 🔁 Auto seat reset every day at **12:00 AM**


📱 𝐑𝐄𝐒𝐏𝐎𝐍𝐒𝐈𝐕𝐄 𝐔𝐈

  🧩 Built with fully responsive design using plain CSS and media queries.

  📱 Optimized for all screen sizes — from mobile phones to large desktops.

  🎯 Flexible layouts using Flexbox, percentage-based widths, and adaptive components.

  🧪 Tested on:

   📱 Android & iOS smartphones

   💻 Laptops & desktops

   📱 Chrome DevTools device simulators
---


---

## 🧠 KEY CONCEPTS

- 🛡️ Role-based access control (User/Admin)
- 🔄 Real-time seat availability and update logic
- 🔐 Persistent Firebase login session with route protection
- ⏰ Auto-reset logic for seat count at midnight
- 🧩 Admin-only features rendered conditionally

---

## 🌄 SCREENSHOTS

link👉:   https://drive.google.com/file/d/1S7SrrOLw0Cg7tkjgWs1DEnxtWJqtSmzN/view?usp=sharing

---

## 🔮 FUTURE ENHANCEMENTS
- 💳 Online payment integration (Stripe/Razorpay)
- 📄 PDF ticket download
- 🔍 Filter events by tags or categories
- 🔔 Push notifications using Firebase Messaging

---

🚀 RUN LOCALLY

🧩 Backend

bash:
cd event-proxy-server
npm install
node Server.js

🖥️ Frontend

bash:
In root:
npm install
npm run dev

## 📄 LICENSE

This project is licensed under the **MIT License** 

This project is developed for learning and demonstration purposes.

© 2025 Rishav Kumar Singh

---



