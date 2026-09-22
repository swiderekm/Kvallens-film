import { useState } from "react";
import type { SubmitEvent } from "react"; 

interface SearchFormProps {
  onSearch: (query: string) => void;
  onReset: () => void;
}

export const SearchForm = ({ onSearch, onReset }: SearchFormProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setError("Vänligen ange en söksituation eller filmtitel.");
      return;
    }
    setError("");
    onSearch(searchTerm.trim());
  };

  const handleClear = () => {
    setSearchTerm("");
    setError("");
    onReset();
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="modern-search-bar">
        <div className="search-input-wrapper">
          <svg
            className="search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Sök bland tusentals filmer..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (error) setError("");
            }}
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-icon-btn"
              onClick={handleClear}
              aria-label="Rensa sökning"
            >
              ✕
            </button>
          )}
        </div>
        <button type="submit" className="search-submit-btn">
          Sök film
        </button>
      </form>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};