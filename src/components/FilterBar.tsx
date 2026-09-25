import type { ChangeEvent } from "react";
import type { FilterState } from "../context/SiteContext";

interface FilterBarProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
  disabled?: boolean;
}

const TMDB_GENRES = [
  { id: "", name: "Alla genrer" },
  { id: "28", name: "Action" },
  { id: "12", name: "Äventyr" },
  { id: "16", name: "Animerat" },
  { id: "35", name: "Komedi" },
  { id: "80", name: "Kriminal" },
  { id: "18", name: "Drama" },
  { id: "14", name: "Fantasy" },
  { id: "27", name: "Skräck" },
  { id: "878", name: "Sci-Fi" },
  { id: "53", name: "Thriller" },
];

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Mest populära" },
  { value: "vote_average.desc", label: "Högst betyg" },
  { value: "primary_release_date.desc", label: "Nyast först" },
  { value: "primary_release_date.asc", label: "Äldst först" },
];

export const FilterBar = ({
  filters,
  onChange,
  onReset,
  disabled = false,
}: FilterBarProps) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({
      ...filters,
      [name]: value,
    });
  };

  const hasActiveFilters =
    Boolean(filters.genre) ||
    Boolean(filters.year) ||
    Boolean(filters.minRating) ||
    filters.sortBy !== "popularity.desc";

  return (
    <div className="filter-bar-wrapper">
      <div className="filter-bar-header">
        <span className="filter-bar-title">Filtrera & sortera</span>
        {hasActiveFilters && (
          <button
            type="button"
            className="filter-reset-btn"
            onClick={onReset}
            disabled={disabled}
            title="Återställ alla filter till standard"
          >
            <span className="reset-icon">✕</span> Rensa alla filter
          </button>
        )}
      </div>

      <div className="filter-bar-grid">
        {/* Genre */}
        <div className="filter-control">
          <label htmlFor="genre">Genre</label>
          <select
            id="genre"
            name="genre"
            value={filters.genre}
            onChange={handleChange}
            disabled={disabled}
          >
            {TMDB_GENRES.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* Utgivningsår */}
        <div className="filter-control">
          <label htmlFor="year">Utgivningsår</label>
          <select
            id="year"
            name="year"
            value={filters.year}
            onChange={handleChange}
            disabled={disabled}
          >
            <option value="">Alla år</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2020">2020</option>
            <option value="2010">2010</option>
            <option value="2000">2000</option>
            <option value="1990">1990-talet</option>
          </select>
        </div>

        {/* Minsta betyg */}
        <div className="filter-control">
          <label htmlFor="minRating">Minsta betyg</label>
          <select
            id="minRating"
            name="minRating"
            value={filters.minRating}
            onChange={handleChange}
            disabled={disabled}
          >
            <option value="">Alla betyg</option>
            <option value="8">★ 8.0 och uppåt</option>
            <option value="7">★ 7.0 och uppåt</option>
            <option value="6">★ 6.0 och uppåt</option>
          </select>
        </div>

        {/* Sortering */}
        <div className="filter-control">
          <label htmlFor="sortBy">Sortera efter</label>
          <select
            id="sortBy"
            name="sortBy"
            value={filters.sortBy}
            onChange={handleChange}
            disabled={disabled}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
