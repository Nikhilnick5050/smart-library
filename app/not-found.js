import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container">
        <div className="empty">
          <h1>404</h1>
          <h3>Page not found</h3>
          <p>The page you're looking for doesn't exist.</p>
          <Link href="/" className="btn btn-primary" style={{ marginTop: 12 }}>
            Go home
          </Link>
        </div>
      </div>
    </section>
  );
}