"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, CheckCircle2, AlertTriangle, RotateCcw } from "lucide-react";

export default function MyBooksPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/my-books");
      const data = await res.json();
      setRecords(data.records || []);
      setLoading(false);
    } catch (e) {
      setRecords([]);
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function returnBook(recordId) {
    setMsg("");
    try {
      const res = await fetch("/api/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg(`Book returned. Fine: ₹${data.fine}.`);
        load();
      } else {
        setMsg(data.error || "Could not return the book.");
      }
    } catch (e) {
      setMsg("Something went wrong.");
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Your Account</span>
          <h1>My Borrowed Books</h1>
          <p className="muted">Track due dates, days left and fines for your borrowed books.</p>
        </div>

        {msg && (
          <div className={`alert ${msg.startsWith("Book returned") ? "alert-success" : "alert-error"}`}>
            {msg}
          </div>
        )}

        {loading ? (
          <p className="empty">Loading your books…</p>
        ) : records.length === 0 ? (
          <div className="empty">
            <BookOpen size={40} />
            <h3>No borrowed books</h3>
            <p>You haven't borrowed any books yet.</p>
            <Link href="/books" className="btn btn-primary" style={{ marginTop: 12 }}>
              Browse books
            </Link>
          </div>
        ) : (
          records.map((r) => {
            const overdue = r.dueDate < today;
            const daysLeft = Math.ceil((new Date(r.dueDate) - new Date(today)) / (1000 * 60 * 60 * 24));
            return (
              <div key={r.id} className="borrow-row card">
                <div className="borrow-info">
                  <h3>{r.bookTitle || "Book"}</h3>
                  <p>
                    Borrowed: {r.borrowDate} · Due: {r.dueDate}
                  </p>
                  {overdue ? (
                    <p className="days-overdue">
                      <AlertTriangle size={15} style={{ verticalAlign: "-3px" }} /> Overdue by {Math.abs(daysLeft)} day{Math.abs(daysLeft) === 1 ? "" : "s"} — fine ₹{Math.abs(daysLeft) * 2}
                    </p>
                  ) : (
                    <p className="days-left">
                      <CheckCircle2 size={15} style={{ verticalAlign: "-3px" }} /> {daysLeft} day{daysLeft === 1 ? "" : "s"} left
                    </p>
                  )}
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => returnBook(r.id)}>
                  <RotateCcw size={15} /> Return
                </button>
              </div>
            );
          })
        )}

        <p className="muted" style={{ fontSize: "0.85rem", marginTop: 16 }}>
          Demo mode: this uses the sample student account (Riya Sharma).
        </p>
      </div>
    </section>
  );
}