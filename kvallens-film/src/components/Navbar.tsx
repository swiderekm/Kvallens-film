import { Link, useLocation } from "react-router-dom";
import { useSiteContext } from "../context/SiteContext";

export const Navbar = () => {
  const { watchlist, watchedList } = useSiteContext();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🎬</span>
          <span className="logo-text">Kvällens film</span>
        </Link>
        <div className="nav-links">
          <Link
            to="/"
            className={`nav-pill ${location.pathname === "/" ? "nav-pill-active" : ""}`}
          >
            Alla filmer
          </Link>
          <Link
            to="/watchlist"
            className={`nav-pill ${location.pathname === "/watchlist" ? "nav-pill-active" : ""}`}
          >
            Min lista
            {watchlist.length > 0 && (
              <span className="pill-badge">{watchlist.length}</span>
            )}
          </Link>
          <Link
            to="/watched"
            className={`nav-pill ${location.pathname === "/watched" ? "nav-pill-active" : ""}`}
          >
            Sedd
            {watchedList.length > 0 && (
              <span className="pill-badge badge-green">{watchedList.length}</span>
            )}
          </Link>
          <Link
            to="/about"
            className={`nav-pill ${location.pathname === "/about" ? "nav-pill-active" : ""}`}
          >
            Om oss
          </Link>
        </div>
      </div>
    </nav>
  );
};
