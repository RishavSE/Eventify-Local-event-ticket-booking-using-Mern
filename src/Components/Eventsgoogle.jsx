import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Eventsgoogle.css";
import BookingModal from "./BookingModal";
import { auth } from "../Firebase";
import { useNavigate } from "react-router-dom";

const GoogleEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/events");
        const results = response.data.events_results;
        setEvents(Array.isArray(results) ? results : []);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleBookNow = (eventData) => {
   const user = auth.currentUser;
 
   if (!user) {
     const confirmRedirect = window.confirm("You need to sign in to book this event. Do you want to sign in now?");
     if (confirmRedirect) {
      //  sessionStorage.setItem("pendingEvent", JSON.stringify(eventData)); // Save booking intent
       navigate("/signin");
     }
     // If user cancels, do nothing — stay on same page
     return;
   }
 
   setSelectedEvent(eventData);
   setShowModal(true);
 };

  // Auto-open modal after login if event was pending
  useEffect(() => {
    const user = auth.currentUser;
    const saved = sessionStorage.getItem("pendingEvent");

    if (user && saved) {
      const parsedEvent = JSON.parse(saved);
      setSelectedEvent(parsedEvent);
      setShowModal(true);
      sessionStorage.removeItem("pendingEvent");
    }
  }, []);

  return (
    <div className="google-events">
      <h2>🎉 Events in Chandigarh, Delhi & Amritsar</h2>
      {loading ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="events-grid">
          {events.map((event, idx) => (
            <div key={idx} className="event-card">
              <div className="event-image-wrapper">
                <img
                  src={
                    event.image && event.image.includes("http")
                      ? event.image
                      : `https://source.unsplash.com/1600x900/?${encodeURIComponent(
                          event.title
                        )},event`
                  }
                  alt={event.title}
                  className="event-image"
                  onError={(e) => {
                    const fallbackImages = [
                      "/pic1.jpg",
                      "/pic2.jpg",
                      "/pic3.jpg",
                      "/pic4.jpg",
                      "/pic5.jpg",
                      "/pic6.jpg",
                      "/pic7.jpg",
                      "/pic8.jpg",
                    ];
                    const randomIndex = Math.floor(Math.random() * fallbackImages.length);
                    e.currentTarget.src = fallbackImages[randomIndex];
                  }}
                />
              </div>
              <div className="event-info">
                <h3>{event.title}</h3>
                <p>
                  <strong>Date:</strong> {event.date?.start_date || "TBD"}
                </p>
                <p>
                  <strong>Location:</strong> {event.address || "Online"}
                </p>
                <button className="book-btn" onClick={() => handleBookNow(event)}>
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedEvent && (
        <BookingModal event={selectedEvent} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default GoogleEvents;
