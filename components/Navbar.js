"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/books", label: "Browse Books" },
  { href: "/my-books", label: "My Books" },
  { href: "/about", label: "About Project" },
  { href: "/contact", label: "Contact / Help" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="brand">
          <span className="brand-icon">
            <BookOpen size={20} />
          </span>
          <span className="brand-name">SmartLibrary</span>
        </Link>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/login" className="btn btn-primary btn-sm nav-login">
            Librarian Login
          </Link>
        </nav>

        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}