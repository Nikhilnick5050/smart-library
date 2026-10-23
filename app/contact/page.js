"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e) {
    e.preventDefault();
    setStatus("");
    if (!form.name || !form.email || !form.subject || !form.message) {
      setStatus("Please fill in all fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setStatus("Please enter a valid email address.");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus(data.error || "Something went wrong.");
      }
    } catch (e) {
      setStatus("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Help</span>
          <h1>Contact / Help</h1>
          <p className="muted">Have a question about the library? Send us a message.</p>
        </div>

        <div className="form-card card">
          {status === "success" ? (
            <div className="alert alert-success">
              <CheckCircle2 size={18} style={{ verticalAlign: "-4px" }} /> Thank you! Your message
              was recorded (demo mode — no email was actually sent).
            </div>
          ) : (
            status && <div className="alert alert-error">{status}</div>
          )}

          <form onSubmit={submit}>
            <div className="form-row">
              <div className="field">
                <label className="label" htmlFor="name">Name</label>
                <input
                  id="name"
                  className="input"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="field">
                <label className="label" htmlFor="email">Email</label>
                <input
                  id="email"
                  className="input"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="subject">Subject</label>
              <input
                id="subject"
                className="input"
                value={form.subject}
                onChange={(e) => update("subject", e.target.value)}
                placeholder="How can we help?"
              />
            </div>
            <div className="field">
              <label className="label" htmlFor="message">Message</label>
              <textarea
                id="message"
                className="textarea"
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="Write your message…"
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={sending}>
              <Send size={18} /> {sending ? "Sending…" : "Send message"}
            </button>
          </form>

          <p className="muted" style={{ fontSize: "0.82rem", marginTop: 16 }}>
            <Mail size={14} style={{ verticalAlign: "-2px" }} /> Demonstration mode: messages are
            validated but not emailed.
          </p>
        </div>
      </div>
    </section>
  );
}