import React, { useEffect, useState } from 'react';
import concert from '/concert.webp';
import theatre from '/theatre.jpg';
import cricket from '/cricket.jpg';
import bbq from '/bbq.jpeg';
import stndup from '/stndup.jpeg';
import urbanfestival from '/urbanfestival.jpeg';
import DeadpoolWolverine from '/DeadpoolWolverine.webp';
import legendsleague from '/legendsleague.jpeg';
import standup from '/standup.jpeg';
import football from '/football.jpeg';
import parmishVerma from '/parmishVerma.jpg';
import pathaan from '/pathaan.avif';
import badminton from '/badminton.avif';
import EventCard from './EventCard';
import BookingModal from './BookingModal';
import { useNavigate } from 'react-router-dom';
import { auth } from '../Firebase';
import pic from '/pic6.jpg';

function PopularEvents() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const events = [
    {
      image: pic,
      title: "Rock Concert Night",
      date: "Sat, July 15",
      location: "Mohali Arena",
      price: 799
    },
    {
      image: theatre,
      title: "Shakespeare Play",
      date: "Sun, July 16",
      location: "Mohali Theater",
      price: 499
    },
    {
      image: cricket,
      title: "IND vs AUS Cricket Match",
      date: "Mon, July 17",
      location: "IS Bindra Stadium",
      price: 699
    },
    {
      image: bbq,
      title: "BBQ Food Festival",
      date: "Tue, July 10",
      location: "Sector 17 Plaza",
      price: 849
    },
    {
      image: concert,
      title: "Prem Dhillon Live",
      date: "Sat, July 20",
      location: "Elante Courtyard, Chandigarh",
      price: 999
    },
    {
      image: stndup,
      title: "Anubhav Singh Bassi Stand-up",
      date: "Sun, July 28",
      location: "Panjab University Auditorium",
      price: 899
    },
    {
      image: theatre,
      title: "Courtroom Drama - Hindi Play",
      date: "Sat, July 19",
      location: "Alliance Française, Sector 36",
      price: 599
    },
    {
      image: urbanfestival,
      title: "Punjabi Folk Festival",
      date: "Wed, July 30",
      location: "Sector 17 Plaza",
      price: 549
    },
    {
      image: DeadpoolWolverine,
      title: "Deadpool & Wolverine",
      date: "Fri, July 26",
      location: "Cinepolis, Bestech Mall Mohali",
      price: 499
    },
    {
      image: legendsleague,
      title: "Legends League - India XI vs World XI",
      date: "Sat, August 3",
      location: "Sector 16 Cricket Stadium, Chandigarh",
      price: 799
    },
    {
      image: standup,
      title: "Zakir Khan - Live in Chandigarh",
      date: "Mon, July 22",
      location: "Tagore Theatre, Chandigarh",
      price: 799
    },
    {
      image: football,
      title: "Chandigarh Warriors vs Punjab FC - Football League",
      date: "Sun, July 21",
      location: "Sector 42 Sports Complex, Chandigarh",
      price: 499
    },
    {
      image: parmishVerma,
      title: "Parmish Verma Live in Concert",
      date: "Sat, August 10",
      location: "Indradhanush Auditorium, Panchkula",
      price: 1199
    },
    {
      image: pathaan,
      title: "Pathaan Returns",
      date: "Fri, July 12",
      location: "PVR Cinemas, Elante Mall",
      price: 559
    },
    {
      image: badminton,
      title: "Chandigarh Open Badminton Tournament",
      date: "Tue, July 23",
      location: "St. John’s Indoor Stadium, Sector 26",
      price: 699
    }
  ];

 const handleBookNow = (eventData) => {
  const user = auth.currentUser;

  if (!user) {
    const confirmRedirect = window.confirm("You need to sign in to book this event. Do you want to sign in now?");
    if (confirmRedirect) {
      // sessionStorage.setItem("pendingEvent", JSON.stringify(eventData)); // Save booking intent
      navigate("/signin");
    }
    // If user cancels, do nothing — stay on same page
    return;
  }

  setSelectedEvent(eventData);
  setShowModal(true);
};


  useEffect(() => {
    const user = auth.currentUser;
    const pending = sessionStorage.getItem("pendingEvent");

    if (user && pending) {
      const eventData = JSON.parse(pending);
      setSelectedEvent(eventData);
      setShowModal(true);
      sessionStorage.removeItem("pendingEvent");
    }
  }, []);

  return (
    <div className="popular-events">
      <h2>Popular Events</h2>
      <div className="event-grid">
        {events.map((event, index) => (
          <EventCard key={index} {...event} onBookNow={handleBookNow} />
        ))}
      </div>

      {showModal && selectedEvent && (
        <BookingModal event={selectedEvent} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

export default PopularEvents;
