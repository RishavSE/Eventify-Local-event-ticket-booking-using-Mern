export default function Hero() {
  return (
    <div className="hero">
      <h1>Discover Amazing Events Near You</h1>
      <p>Book tickets for concerts, sports, theater, and more.</p>
      <input type="text" placeholder="Search for events,movies, artists..." />
      <button className="search-btn"><i className="pi pi-search"></i></button>
    </div>
  );
}