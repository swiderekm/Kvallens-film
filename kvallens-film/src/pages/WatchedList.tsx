import { Link } from "react-router-dom";
import { useSiteContext } from "../context/SiteContext";
import { MovieCard } from "../components/MovieCard";

export const WatchedList = () => {
  const { watchedList } = useSiteContext();

  return (
    <main className="container">
      <div className="watchlist-header">
        <div>
          <h2>Filmer jag har sett</h2>
          <p className="watchlist-subtitle">
            Här samlas alla filmer du redan har bockat av och sett
          </p>
        </div>
        {watchedList.length > 0 && (
          <span className="watchlist-count count-green">
            {watchedList.length} {watchedList.length === 1 ? "film" : "filmer"}
          </span>
        )}
      </div>

      {watchedList.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎬</div>
          <h3>Inga sedda filmer än</h3>
          <p>
            När du har sett en film, klicka på ögon-ikonen (<strong>👁</strong>)
            på filmen för att spara den i din sedda-historik.
          </p>
          <Link to="/" className="empty-cta-btn">
            Bläddra bland filmer
          </Link>
        </div>
      ) : (
        <section className="movies-grid">
          {watchedList.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </section>
      )}
    </main>
  );
};
