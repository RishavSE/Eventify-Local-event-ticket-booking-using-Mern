import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./Mytickets.css";
import { auth, db } from "../Firebase";
import { ref, onValue } from "firebase/database";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchUserTickets = () => {
      const user = auth.currentUser;
      if (!user) return;

      const userTicketsRef = ref(db, `tickets/${user.uid}`);
      onValue(userTicketsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const fetched = Object.entries(data).map(([id, ticket]) => ({
            id,
            ...ticket,
          }));
          setTickets(fetched.reverse());
        } else {
          setTickets([]);
        }
      });
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchUserTickets();
    });

    return () => unsubscribe();
  }, []);

  const downloadPDF = (ticket) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Eventify Event-Ticket", 20, 20);

    const tableData = [
      ["Event", ticket.eventTitle],
      ["Location", ticket.location],
      ["Name", ticket.name],
      ["Email", ticket.email],
      ["Seat Type", ticket.seatType],
      ["Seat Preference", ticket.seatPreference],
      ["Adults", ticket.adults],
      ["Children (Free)", ticket.children],
      ["Total Paid", `Rs.${ticket.total}`],
      ["Booking Time", ticket.date],
    ];

    autoTable(doc, {
      startY: 30,
      head: [["Field", "Details"]],
      body: tableData,
    });

    doc.save(`Ticket_${ticket.name}.pdf`);
  };

  return (
    <div className="my-tickets-page">
      <h2>🎫 My Booked Tickets</h2>

      {tickets.length === 0 ? (
        <p>No tickets booked yet.</p>
      ) : (
        <div className="tickets-container">
          {tickets.map((ticket) => (
            <div className="ticket-card" key={ticket.id}>
              <h3>{ticket.eventTitle}</h3>
              <p><strong>Name:</strong> {ticket.name}</p>
              <p><strong>Email:</strong> {ticket.email}</p>
              <p><strong>Seat:</strong> {ticket.seatType} ({ticket.seatPreference})</p>
              <p><strong>Adults:</strong> {ticket.adults} | <strong>Children:</strong> {ticket.children}</p>
              <p className="price"><strong>Total Paid:</strong> ₹{ticket.total}</p>
              <p className="timestamp"><strong>Booked On:</strong> {ticket.date}</p>

              <button className="pdf-btn" onClick={() => downloadPDF(ticket)}>⬇️ Download PDF</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;
