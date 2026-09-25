import { Link } from "react-router-dom";
import { useSiteContext } from "../context/SiteContext";
import { MovieCard } from "../components/MovieCard";

export const WatchedList = () => {
  const { watchedList } = useSiteContext();

  return (
    <main className="container">
      <header className="page-header">
        <h1>Filmer jag har sett</h1>
        <p>Här samlas alla filmer du redan har bockat av och sett</p>
        {watchedList.length > 0 && (
          <div className="header-badge-wrapper">
            <span className="header-count-badge badge-green">
              ✓ {watchedList.length} {watchedList.length === 1 ? "sedd film" : "sedda filmer"}
            </span>
          </div>
        )}
      </header>

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
