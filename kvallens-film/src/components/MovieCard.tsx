import { Link } from "react-router-dom";
import { useSiteContext } from "../context/SiteContext";
import type { Movie } from "../context/SiteContext";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useSiteContext();
  const saved = isInWatchlist(movie.id);

  const poster = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : "https://via.placeholder.com/300x450?text=Ingen+bild";

  return (
    <div className="movie-card">
      <div className="badge-rating">★ {movie.vote_average.toFixed(1)}</div>
      <Link to={`/movie/${movie.id}`}>
        <img src={poster} alt={movie.title} />
      </Link>
      <div className="card-info">
        <h3>{movie.title}</h3>
        <button
          className={saved ? "btn-saved" : "btn-save"}
          onClick={() => (saved ? removeFromWatchlist(movie.id) : addToWatchlist(movie))}
        >
          {saved ? "Ta bort från lista" : "+ Lägg till i lista"}
        </button>
      </div>
    </div>
  );
};
