import { useSiteContext } from "../context/SiteContext";
import { MovieCard } from "../components/MovieCard";

export const WatchList = () => {
  const { watchlist } = useSiteContext();

  return (
    <main className="container">
      <h2>Min lista ({watchlist.length})</h2>
      {watchlist.length === 0 ? (
        <p className="status-text">Du har inga sparade filmer i din lista än.</p>
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
