import React from "react";

function EventCard({ image, title, date, location, price, onBookNow }) {
  const handleBookNow = () => {
    if (onBookNow) {
      onBookNow({
        image,
        title,
        date,
        location,
        price,
      });
    }
  };

  return (
    <div className="event-card">
      <img src={image} alt={title} />
      <div className="event-info">
        <h3>{title}</h3>
        <p><i className="pi pi-calendar"></i> {date}</p>
        <p><i className="pi pi-map-marker"></i> {location}</p>
        <p className="price">₹{price}</p>
        <button className="book-btn" onClick={handleBookNow}>
          Book Now
        </button>
      </div>
    </div>
  );
}

export default EventCard;
