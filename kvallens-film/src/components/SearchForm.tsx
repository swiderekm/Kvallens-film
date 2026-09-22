import { useState } from "react";
import type { SubmitEvent } from "react"; 

interface SearchFormProps {
  onSearch: (query: string) => void;
  onReset: () => void;
}

export const SearchForm = ({ onSearch, onReset }: SearchFormProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
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
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Sök film..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (error) setError("");
          }}
        />
        <button type="submit">Sök</button>
        {searchTerm && (
          <button type="button" onClick={handleClear} className="btn-secondary">
            Rensa
          </button>
        )}
      </form>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};
