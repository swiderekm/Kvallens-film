import { Link } from "react-router-dom";
import { useSiteContext } from "../context/SiteContext";

export const Navbar = () => {
  const { watchlist } = useSiteContext();

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        Kvällens film
      </Link>
      <div className="nav-links">
        <Link to="/">Alla</Link>
        <Link to="/watchlist">Min lista ({watchlist.length})</Link>
        <Link to="/about">Om oss</Link>
      </div>
    </nav>
  );
};
