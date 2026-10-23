"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Login failed.");
      }
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section">
      <div className="container">
        <div className="form-card card" style={{ maxWidth: 440 }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <span className="brand-icon" style={{ width: 52, height: 52 }}>
              <Lock size={24} />
            </span>
            <h1 style={{ marginTop: 12 }}>Librarian Login</h1>
            <p className="muted">Sign in to manage the library.</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={submit}>
            <div className="field">
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="librarian@smartlibrary.demo"
              />
            </div>
            <div className="field">
              <label className="label" htmlFor="password">Password</label>
              <input
                id="password"
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
              <LogIn size={18} /> {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="muted" style={{ fontSize: "0.82rem", marginTop: 16, textAlign: "center" }}>
            Demo credentials — email: librarian@smartlibrary.demo · password: admin123
          </p>
        </div>
      </div>
    </section>
  );
}