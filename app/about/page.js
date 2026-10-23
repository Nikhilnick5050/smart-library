import Link from "next/link";
import { BookOpen, Target, Clock, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">About</span>
          <h1>About the Project</h1>
        </div>

        <div className="card" style={{ padding: 32, maxWidth: 760, margin: "0 auto" }}>
          <p style={{ fontSize: "1.1rem" }}>
            SmartLibrary is a student-focused library management system designed to make college
            library use easier. It brings book search, borrowing, returns, and fine tracking into
            one place, allowing students to find books quickly and librarians to manage the library
            without paper registers. The goal is to save time, reduce mistakes, and make the library
            easier to use for everyone.
          </p>

          <div className="grid grid-3" style={{ marginTop: 24 }}>
            <div className="step card">
              <span className="step-num"><Target size={22} /></span>
              <h3>Goal</h3>
              <p>Simplify library use for students and staff.</p>
            </div>
            <div className="step card">
              <span className="step-num"><Clock size={22} /></span>
              <h3>Save Time</h3>
              <p>No more paper registers or manual tracking.</p>
            </div>
            <div className="step card">
              <span className="step-num"><ShieldCheck size={22} /></span>
              <h3>Reliable</h3>
              <p>Protected librarian actions and clear records.</p>
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <h3>Technology Stack</h3>
            <ul>
              <li>Next.js (React) — frontend and API routes</li>
              <li>JSON file storage (demo) — swappable for Supabase/Neon PostgreSQL</li>
              <li>Lucide icons</li>
              <li>Deployed on Vercel</li>
            </ul>
          </div>

          <Link href="/books" className="btn btn-primary" style={{ marginTop: 16 }}>
            <BookOpen size={18} /> Browse books
          </Link>
        </div>
      </div>
    </section>
  );
}