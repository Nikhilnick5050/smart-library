import Link from "next/link";
import { BookOpen, MapPin } from "lucide-react";

export default function BookCard({ book }) {
  const available = book.availableCopies > 0;
  return (
    <Link href={`/books/${book.id}`} className="book-card card">
      <div className="book-card-top">
        <span className="book-cat">{book.category}</span>
        <span className={`badge ${available ? "badge-available" : "badge-borrowed"}`}>
          {available ? "Available" : "Borrowed"}
        </span>
      </div>
      <h3 className="book-title">{book.title}</h3>
      <p className="book-author muted">{book.author}</p>
      <div className="book-meta">
        <span><MapPin size={14} /> {book.shelf}</span>
        <span><BookOpen size={14} /> {book.availableCopies}/{book.totalCopies} copies</span>
      </div>
    </Link>
  );
}