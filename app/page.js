"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  BookOpen,
  Search,
  ArrowRight,
  Cpu,
  CircuitBoard,
  Cog,
  Building2,
  Sigma,
  Atom,
  FlaskConical,
  Briefcase,
  Trophy,
  BookMarked,
} from "lucide-react";
import SearchBar from "@/components/SearchBar";
import BookCard from "@/components/BookCard";

const categories = [
  { name: "Computer Science", icon: Cpu, desc: "Programming, algorithms and systems." },
  { name: "Electronics", icon: CircuitBoard, desc: "Circuits, signals and devices." },
  { name: "Mechanical Engineering", icon: Cog, desc: "Machines, design and thermodynamics." },
  { name: "Civil Engineering", icon: Building2, desc: "Structures, surveying and materials." },
  { name: "Mathematics", icon: Sigma, desc: "Calculus, algebra and applied maths." },
  { name: "Physics", icon: Atom, desc: "Mechanics, waves and modern physics." },
  { name: "Chemistry", icon: FlaskConical, desc: "Organic, inorganic and physical." },
  { name: "Management", icon: Briefcase, desc: "Principles, finance and marketing." },
  { name: "Competitive Exams", icon: Trophy, desc: "Aptitude, reasoning and GK." },
  { name: "Novels & General Reading", icon: BookMarked, desc: "Fiction and general reading." },
];

const steps = [
  { n: "1", title: "Search", desc: "Find a book by title, author or ISBN." },
  { n: "2", title: "Borrow", desc: "Borrow an available copy in one click." },
  { n: "3", title: "Return", desc: "Track due dates and return on time." },
];

export default function HomePage() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [newBooks, setNewBooks] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loaded, setLoaded] = useState(false);

  async function loadBooks() {
    if (loaded) return;
    setLoaded(true);
    try {
      const res = await fetch("/api/books");
      const data = await res.json();
      const books = data.books || [];
      setNewBooks(books.filter((b) => b.isNew).slice(0, 4));
      setPopular([...books].sort((a, b) => (b.borrowCount || 0) - (a.borrowCount || 0)).slice(0, 4));
    } catch (e) {
      // ignore — sections simply stay empty
    }
  }

  if (typeof window !== "undefined" && !loaded) {
    loadBooks();
  }

  function submitSearch(e) {
    e.preventDefault();
    router.push(`/books?q=${encodeURIComponent(q)}`);
  }

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Your College Library, Now Online</h1>
          <p className="subtitle">Search, borrow, and track your books — all in one place.</p>
          <form className="hero-search" onSubmit={submitSearch}>
            <SearchBar value={q} onChange={setQ} />
          </form>
          <div className="hero-actions">
            <Link href="/books" className="btn btn-primary">
              Browse Books <ArrowRight size={18} />
            </Link>
            <Link href="/my-books" className="btn btn-outline">
              My Borrowed Books
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Categories</span>
            <h2>Browse by Category</h2>
            <p className="muted">Explore books across every department of your college.</p>
          </div>
          <div className="grid grid-4">
            {categories.map((c) => (
              <Link
                key={c.name}
                href={`/books?category=${encodeURIComponent(c.name)}`}
                className="cat-card card"
              >
                <span className="cat-icon">
                  <c.icon size={22} />
                </span>
                <h3>{c.name}</h3>
                <p>{c.desc}</p>
                <span className="cat-link">View Books →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {newBooks.length > 0 && (
        <section className="section" style={{ background: "var(--blue)" }}>
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Fresh Arrivals</span>
              <h2>Newly Added Books</h2>
            </div>
            <div className="grid grid-4">
              {newBooks.map((b) => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          </div>
        </section>
      )}

      {popular.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Trending</span>
              <h2>Most Borrowed Books</h2>
            </div>
            <div className="grid grid-4">
              {popular.map((b) => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section" style={{ background: "var(--blue)" }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Simple Process</span>
            <h2>How It Works</h2>
          </div>
          <div className="grid grid-3">
            {steps.map((s) => (
              <div key={s.n} className="step card">
                <span className="step-num">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">About</span>
            <h2>About the Project</h2>
            <p className="muted">
              SmartLibrary is a student-focused library management system designed to make
              college library use easier. It brings book search, borrowing, returns, and fine
              tracking into one place — saving time and removing paper registers.
            </p>
            <Link href="/about" className="btn btn-outline" style={{ marginTop: 8 }}>
              Learn more <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}