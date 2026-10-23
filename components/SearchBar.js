"use client";

import { Search, X } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="searchbar">
      <Search size={20} className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder || "Search by book title, author, or ISBN…"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search books"
      />
      {value && (
        <button className="search-clear" onClick={() => onChange("")} aria-label="Clear search">
          <X size={18} />
        </button>
      )}
    </div>
  );
}