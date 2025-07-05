import React from 'react';
import './Footer.css'; 
import { useNavigate } from 'react-router-dom'; 
import { Link } from 'react-router-dom';
export default function Footerr() {
  return (
    
    <footer className="footer">
      <div className="footer-columns">
        {/* Contact Info */}
        <div className="footer-col">
          <h4>Contact info</h4>
          <p><strong>Call us</strong><br />+91-62XXXXXXXX</p>
          <p><strong>Mail</strong><br />eventify@gmail.com</p>
          <div className="social-icons">
            <i className="pi pi-facebook"></i>
            <i className="pi pi-twitter"></i>
            <i className="pi pi-pinterest"></i>
            <i className="pi pi-instagram"></i>
          </div>
        </div>

        {/* Use Eventify */}
        <div className="footer-col footer-col-center">
          <h4>Use Eventify</h4>
          <ul>
            <li>Home</li>
            <li>Events</li>
            <li>Movies</li>
            <li>My Tickets</li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </div>

        {/* Help & Support */}
        <div className="footer-col footer-col-right">
          <h4>Help & Support</h4>
          <ul>
            <li>Contact us</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
            <li>Refund and Cancellation</li>
          </ul>
        </div>
      </div>

      <hr />

      <div className="footer-bottom">
        <h2 className="footer-brand"> 🎟️ Eventify</h2>
        <p>©2025 All Rights Reserved. Eventify.</p>
        
      </div>
    </footer>
  );
}