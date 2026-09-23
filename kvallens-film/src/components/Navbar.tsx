import { Link, useLocation } from "react-router-dom";
import { useSiteContext } from "../context/SiteContext";

export const Navbar = () => {
  const { watchlist, watchedList } = useSiteContext();
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Alla filmer" },
    {
      path: "/watchlist",
      label: "Min lista",
      count: watchlist.length,
      badgeColor: "gold",
    },
    {
      path: "/watched",
      label: "Sedd",
      count: watchedList.length,
      badgeColor: "green",
    },
    { path: "/about", label: "Om oss" },
  ];

  return (
    <header className="navbar-wrapper">
      <nav className="navbar-container">
        {/* Logo z efektem poświaty */}
        <Link to="/" className="navbar-brand">
          <div className="brand-icon-box">
            <span>🎬</span>
          </div>
          <div className="brand-text-group">
            <span className="brand-title">Kvällens Film</span>
            <span className="brand-tag">Premium Guide</span>
          </div>
        </Link>

        {/* Pływające linki nawigacji */}
        <div className="navbar-menu">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? "nav-item-active" : ""}`}
              >
                <span>{item.label}</span>
                {typeof item.count === "number" && item.count > 0 && (
                  <span
                    className={`nav-badge ${
                      item.badgeColor === "green" ? "nav-badge-green" : "nav-badge-gold"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
