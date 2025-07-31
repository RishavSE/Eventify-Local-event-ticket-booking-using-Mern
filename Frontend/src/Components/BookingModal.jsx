import React, { useState, useEffect } from 'react';
import './Bookingmodel.css';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../Firebase';
import { ref, push, get, update } from 'firebase/database';

const seatPrices = {
  Regular: 500,
  VIP: 1200,
};

const BookingModal = ({ event, onClose }) => {
  const [seatType, setSeatType] = useState('Regular');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    adults: 1,
    children: 0,
    seatPreference: 'Middle',
  });
  const [total, setTotal] = useState(0);
  const [seatAvailability, setSeatAvailability] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const firebaseEventId = 'event1'; // global event ID

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || '',
        name: user.displayName || '',
      }));
    }
  }, []);

  useEffect(() => {
    const payingAdults = Math.max(formData.adults - formData.children, 0);
    setTotal(payingAdults * seatPrices[seatType]);
  }, [seatType, formData.adults, formData.children]);

  useEffect(() => {
    const fetchSeats = async () => {
      const seatRef = ref(db, `events/${firebaseEventId}/seats`);
      const snapshot = await get(seatRef);
      const seats = snapshot.val();
      setSeatAvailability(seats || {});
      setLoading(false);
    };
    fetchSeats();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      sessionStorage.setItem('pendingBooking', JSON.stringify(formData));
      alert('Please sign in to continue your booking.');
      onClose();
      navigate('/signin');
      return;
    }

    const preference = formData.seatPreference.toLowerCase(); // front, middle, back
    const seatRef = ref(db, `events/${firebaseEventId}/seats`);

    try {
      const seatSnap = await get(seatRef);
      const seats = seatSnap.val();

      const payingMembers = Math.max(formData.adults - formData.children, 0);

      if (!seats || seats[preference] < payingMembers) {
        alert(`❌ Sorry, not enough ${formData.seatPreference} seats are available.`);
        return;
      }

      const ticketRef = ref(db, `tickets/${user.uid}`);
      const ticket = {
        eventTitle: event.title,
        location: event.address || 'Online',
        ...formData,
        seatType,
        total,
        seatZone: formData.seatPreference,
        date: new Date().toLocaleString(),
        uid: user.uid,
      };

      await push(ticketRef, ticket);

      // ✅ Reduce seat count by paying members
      await update(seatRef, {
        ...seats,
        [preference]: seats[preference] - payingMembers,
      });

      alert(`✅ Booking Confirmed for ${formData.name}!`);
      onClose();
      navigate('/my-tickets');
    } catch (error) {
      console.error('❌ Booking error:', error);
      alert('Booking failed. Please try again.');
    }
  };

  if (!event) return null;

  return (
    <div className="modal-overlay">
      <div className="modal booking-modal">
        <h2>🎟️ Book Your Ticket</h2>
        <p><strong>Event:</strong> {event.title}</p>
        <p><strong>Location:</strong> {event.address || 'Online'}</p>

        {loading ? (
          <p>🔄 Loading seat availability...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              required
              onChange={handleChange}
              placeholder="Enter your name"
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              required
              onChange={handleChange}
              placeholder="Enter your email"
            />

            <label>Seat Type</label>
            <select value={seatType} onChange={(e) => setSeatType(e.target.value)}>
              <option value="Regular">Regular - ₹500</option>
              <option value="VIP">VIP - ₹1200</option>
            </select>

            <label>Seat Preference</label>
            <select name="seatPreference" value={formData.seatPreference} onChange={handleChange}>
              <option value="Front" disabled={seatAvailability?.front <= 0}>
                Front ({seatAvailability?.front || 0} left)
              </option>
              <option value="Middle" disabled={seatAvailability?.middle <= 0}>
                Middle ({seatAvailability?.middle || 0} left)
              </option>
              <option value="Back" disabled={seatAvailability?.back <= 0}>
                Back ({seatAvailability?.back || 0} left)
              </option>
            </select>

            <label>Number of Adults</label>
            <input
              type="number"
              name="adults"
              min="1"
              value={formData.adults}
              onChange={handleChange}
            />

            <label>Children (Below 5 - Free)</label>
            <input
              type="number"
              name="children"
              min="0"
              max={formData.adults}
              value={formData.children}
              onChange={handleChange}
            />

            <div className="summary">
              <p><strong>💺 Seat Price:</strong> ₹{seatPrices[seatType]}</p>
              <p><strong>👨‍👩‍👧 Paying Members:</strong> {Math.max(formData.adults - formData.children, 0)}</p>
              <p className="total-amount"><strong>Total Payable:</strong> ₹{total}</p>
            </div>

            <button type="submit" className="book-btn">✅ Confirm & Pay</button>
          </form>
        )}

        <button className="close-btn" onClick={onClose}>❌ Close</button>
      </div>
    </div>
  );
};

export default BookingModal;
