"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  MapPin,
  User,
  Tag,
  Barcode,
  Building,
  Layers,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/books/${params.id}`);
        const data = await res.json();
        if (res.ok) setBook(data.book);
        else setError(data.error || "Book not found.");
      } catch (e) {
        setError("Could not load the book.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  async function borrow() {
    setBorrowing(true);
    setMsg("");
    try {
      const res = await fetch("/api/borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: book.id, studentId: "stu-1" }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Book borrowed successfully! Due in 14 days.");
        setBook((b) => ({ ...b, availableCopies: b.availableCopies - 1 }));
        setTimeout(() => router.push("/my-books"), 1200);
      } else {
        setMsg(data.error || "Could not borrow the book.");
      }
    } catch (e) {
      setMsg("Something went wrong. Please try again.");
    } finally {
      setBorrowing(false);
    }
  }

  if (loading) return <section className="section"><div className="container"><p className="empty">Loading book…</p></div></section>;

  if (error || !book) {
    return (
      <section className="section">
        <div className="container">
          <div className="empty">
            <AlertCircle size={40} />
            <h3>{error || "Book not found"}</h3>
            <Link href="/books" className="btn btn-primary" style={{ marginTop: 12 }}>
              Back to books
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const available = book.availableCopies > 0;

  return (
    <section className="section">
      <div className="container">
        <Link href="/books" className="back-link">
          <ArrowLeft size={16} /> Back to books
        </Link>

        {msg && (
          <div className={`alert ${msg.startsWith("Book borrowed") ? "alert-success" : "alert-error"}`}>
            {msg}
          </div>
        )}

        <div className="detail-grid">
          <div className="detail-main card">
            <span className="book-cat">{book.category}</span>
            <h1 style={{ marginTop: 8 }}>{book.title}</h1>
            <p className="muted" style={{ fontSize: "1.1rem" }}>by {book.author}</p>
            <p>{book.description}</p>

            <ul className="detail-list">
              <li><span className="k"><Tag size={15} /> Category</span><span className="v">{book.category}</span></li>
              <li><span className="k"><Barcode size={15} /> ISBN</span><span className="v">{book.isbn}</span></li>
              <li><span className="k"><Building size={15} /> Publisher</span><span className="v">{book.publisher}</span></li>
              <li><span className="k"><Layers size={15} /> Edition</span><span className="v">{book.edition}</span></li>
              <li><span className="k"><MapPin size={15} /> Shelf</span><span className="v">{book.shelf}</span></li>
            </ul>

            <p className="muted" style={{ fontSize: "0.85rem" }}>
              Demonstration data — details are samples and can be updated by the librarian.
            </p>
          </div>

          <div className="detail-side card">
            <h3>Availability</h3>
            <p>
              <span className={`badge ${available ? "badge-available" : "badge-borrowed"}`}>
                {available ? "Available" : "Borrowed"}
              </span>
            </p>
            <p className="muted">
              <BookOpen size={16} style={{ verticalAlign: "-3px" }} /> {book.availableCopies} of {book.totalCopies} copies available
            </p>
            <button
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
              onClick={borrow}
              disabled={!available || borrowing}
            >
              {borrowing ? "Borrowing…" : available ? "Borrow this book" : "Not available"}
            </button>
            <p className="muted" style={{ fontSize: "0.82rem", marginTop: 12 }}>
              Borrowing is demo-only and uses the sample student account.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}