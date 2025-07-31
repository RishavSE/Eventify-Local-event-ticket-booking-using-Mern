import React from 'react';
import './Aboutus.css';
// import Navbar from './Navbar';
// import Footerr from './Footerr';
import { useNavigate } from 'react-router-dom';

export default function AboutUs() {
    const Navigate = useNavigate();
  const sections = [
    {
      title: "Who We Are",
      content:
        "Eventify is a newly launched platform built to make discovering and booking events near you simple, fast, and enjoyable. Whether you're into music, sports, food, or movies — we’ve got you covered."
    },
    {
      title: "What We Offer",
      content: (
        <ul>
          <li>🎟 Hassle-free ticket booking for all event types</li>
          <li>🔍 Easy search by category, location, or artist</li>
          <li>📍 Personalized recommendations near you</li>
          <li>💳 Secure and fast payment process</li>
          <li>🖥️ Clean and responsive modern interface</li>
        </ul>
      )
    },
    {
      title: "Why We Started",
      content:
        "We saw that existing ticketing platforms were either outdated or too complicated. So we created Eventify — a modern, intuitive solution for discovering and booking events effortlessly."
    },
    {
      title: "Our Vision",
      content:
        "To become your favorite place for finding and booking local events, while helping organizers connect with the right audience."
    },
    {
  title: "Ready to Explore?",
  content: (
    <>
      <p>Start discovering exciting local events with Eventify today.</p>
      <button className="btn-primary" onClick={()=>Navigate('/signin')}>Browse Events</button>
    </>
  )
},
{
  title: "Contact Info",
  content: (
    <ul>
      <li>📞 Phone: +91-62XXXXXXXX</li>
      <li>📧 Email: eventify@gmail.com</li>
      <li>📍 Location: Mohali, Punjab, India</li>
    </ul>
  )
}

  ];

  return (
    <div className="about-container">
      <div className="about-hero">
        <h1>About 🎟️Eventify</h1>
        <p>Your New Destination for Local Event Discovery & Booking</p>
      </div>

      <div className="about-cards">
        {sections.map((sec, i) => (
          <div className="about-card" key={i}>
            <h2>{sec.title}</h2>
            <div className="card-content">{sec.content}</div>
          </div>
        ))}
      </div>
      
    </div>
    
  );
}