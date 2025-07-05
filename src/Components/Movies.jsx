import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Eventsgoogle.css";
import BookingModal from "./BookingModal";
import { auth } from "../Firebase";
import { useNavigate } from "react-router-dom";

const TMDBMovies = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const locations = [
    "PVR VR Punjab", "Delhi", "Mohali", "Noida", "Himachal",
    "Nexus Elante Chandigarh", "Sector 43 Chandigarh", "Lucknow",
    "Sector 17 Chandigarh", "Chandigarh", "Amritsar", "Bangalore"
  ];

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [popularRes, topRatedRes] = await Promise.all([
          axios.get("https://api.themoviedb.org/3/movie/popular", {
            params: {
              api_key: "e27ed7074beb1b541d30504cd37b496a",
              language: "en-US",
              page: 1,
            },
          }),
          axios.get("https://api.themoviedb.org/3/movie/top_rated", {
            params: {
              api_key: "e27ed7074beb1b541d30504cd37b496a",
              language: "en-US",
              page: 1,
            },
          }),
        ]);
        setPopularMovies(popularRes.data.results);
        setTopRatedMovies(topRatedRes.data.results);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };

    fetchMovies();
  }, []);

  const openModal = (movie, location) => {
    const user = auth.currentUser;

    const formattedMovie = {
      title: movie.title,
      release_date: movie.release_date,
      address: location,
    };

    if (!user) {
    const confirmRedirect = window.confirm("You need to sign in to book this movie. Do you want to sign in now?");
    if (confirmRedirect) {
      // sessionStorage.setItem("pendingEvent", JSON.stringify(formattedMovie));
      navigate("/signin");
    }
    return; // Don't proceed to modal if user cancels
  }

  setSelectedMovie(formattedMovie);
  setShowModal(true);
};

  // Auto-reopen modal if redirected after login
  useEffect(() => {
    const user = auth.currentUser;
    const saved = sessionStorage.getItem("pendingEvent");

    if (user && saved) {
      const parsed = JSON.parse(saved);
      setSelectedMovie(parsed);
      setShowModal(true);
      sessionStorage.removeItem("pendingEvent");
    }
  }, []);

  const renderMovieCard = (movie) => {
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];

    return (
      <div className="event-card" key={movie.id}>
        <div className="event-image-wrapper">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : `/concert.webp`
            }
            alt={movie.title}
            className="event-image"
            onError={(e) => {
              const fallbackImages = ["/concert.webp", "/theatre.jpg", "/stndup.jpeg"];
              const randomImage = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
              e.currentTarget.onerror = null;
              e.currentTarget.src = randomImage;
            }}
          />
        </div>
        <div className="event-info">
          <h3>{movie.title}</h3>
          <p><strong>Release:</strong> {movie.release_date}</p>
          <p><strong>Language:</strong> {movie.original_language.toUpperCase()}</p>
          <p><strong>Location:</strong> {randomLocation}</p>
          <button className="book-btn" onClick={() => openModal(movie, randomLocation)}>
            Book Now
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="google-events">
      <h2>🎬 Popular Movies</h2>
      <div className="events-grid">
        {popularMovies.map(renderMovieCard)}
      </div>

      <h2 style={{ marginTop: "3rem" }}>🌟 Top Rated Movies</h2>
      <div className="events-grid">
        {topRatedMovies.map(renderMovieCard)}
      </div>

      {showModal && selectedMovie && (
        <BookingModal event={selectedMovie} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default TMDBMovies;
