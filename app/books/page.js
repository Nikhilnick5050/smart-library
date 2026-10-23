"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import BookCard from "@/components/BookCard";

const CATEGORIES = [
  "Computer Science",
  "Electronics",
  "Mechanical Engineering",
  "Civil Engineering",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Management",
  "Competitive Exams",
  "Novels & General Reading",
];

function BooksContent() {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [category, setCategory] = useState(params.get("category") || "");
  const [availability, setAvailability] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setQ(params.get("q") || "");
    setCategory(params.get("category") || "");
  }, [params]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (category) sp.set("category", category);
    if (availability) sp.set("availability", availability);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/books?${sp.toString()}`);
        const data = await res.json();
        if (active) setBooks(data.books || []);
      } catch (e) {
        if (active) setBooks([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 200);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [q, category, availability]);

  function clearFilters() {
    setQ("");
    setCategory("");
    setAvailability("");
  }

  const hasFilters = q || category || availability;

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Catalogue</span>
          <h1>Browse Books</h1>
          <p className="muted">Search and filter the full library collection.</p>
        </div>

        <div style={{ maxWidth: 620, margin: "0 auto 20px" }}>
          <SearchBar value={q} onChange={setQ} />
        </div>

        <div className="filters">
          <div className="filter-group">
            <SlidersHorizontal size={16} />
            <select
              className="select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <select
              className="select"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              aria-label="Filter by availability"
            >
              <option value="">All Availability</option>
              <option value="available">Available</option>
              <option value="borrowed">Borrowed</option>
            </select>
          </div>
          {hasFilters && (
            <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
              <RotateCcw size={15} /> Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <p className="empty">Loading books…</p>
        ) : books.length === 0 ? (
          <div className="empty">
            <div className="icon"><Search size={40} /></div>
            <h3>No books found</h3>
            <p>Try a different title, author or ISBN, or clear your filters.</p>
          </div>
        ) : (
          <>
            <p className="muted" style={{ marginBottom: 16 }}>
              {books.length} book{books.length === 1 ? "" : "s"} found
            </p>
            <div className="grid grid-4">
              {books.map((b) => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={<p className="empty">Loading…</p>}>
      <BooksContent />
    </Suspense>
  );
}