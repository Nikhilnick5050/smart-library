import Link from "next/link";
import { BookOpen, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand footer-brand">
            <span className="brand-icon">
              <BookOpen size={18} />
            </span>
            <span className="brand-name">SmartLibrary</span>
          </div>
          <p className="muted">
            Read. Learn. Grow. Your college library, now online.
          </p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><Link href="/books">Browse Books</Link></li>
            <li><Link href="/my-books">My Books</Link></li>
            <li><Link href="/about">About Project</Link></li>
            <li><Link href="/contact">Contact / Help</Link></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul className="contact-list">
            <li><MapPin size={16} /> College Library, Academic Block</li>
            <li><Mail size={16} /> library@smartlibrary.demo</li>
            <li><Phone size={16} /> +91 00000 00000 (demo)</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p className="muted">
            © {new Date().getFullYear()} SmartLibrary — a student project for demonstration.
          </p>
        </div>
      </div>
    </footer>
  );
}