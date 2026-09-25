import { Link } from "react-router-dom";
import { useSiteContext } from "../context/SiteContext";
import { MovieCard } from "../components/MovieCard";

export const WatchList = () => {
  const { watchlist } = useSiteContext();

  return (
    <main className="container">
      <header className="page-header">
        <h1>Min sparade lista</h1>
        <p>Dina personliga favoriter och filmer du vill se senare</p>
        {watchlist.length > 0 && (
          <div className="header-badge-wrapper">
            <span className="header-count-badge badge-gold">
              🔖 {watchlist.length} {watchlist.length === 1 ? "film att se" : "filmer att se"}
            </span>
          </div>
        )}
      </header>

      {watchlist.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🍿</div>
          <h3>Din lista är tom</h3>
          <p>
            Du har inte sparat några filmer än. Utforska filmer och klicka på{" "}
            <strong>"+ Min lista"</strong> för att spara dem här.
          </p>
          <Link to="/" className="empty-cta-btn">
            Utforska filmer
          </Link>
        </div>
      ) : (
        <section className="movies-grid">
          {watchlist.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </section>
      )}
    </main>
  );
};
