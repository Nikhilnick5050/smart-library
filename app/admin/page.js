"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Settings,
  Plus,
  Pencil,
  Trash2,
  LogOut,
  AlertTriangle,
  Users,
  Library,
  Clock,
} from "lucide-react";

const CATEGORIES = [
  "Computer Science",
  "Electronics",
  "Mechanical Engineering",
  "Civil Engineering",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Management",
  "Competitive Exams",
  "Novels & General Reading",
];

const emptyBook = {
  title: "",
  author: "",
  category: "Computer Science",
  isbn: "",
  publisher: "",
  edition: "",
  shelf: "",
  totalCopies: 1,
  description: "",
};

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState("overview");
  const [authorized, setAuthorized] = useState(null);
  const [stats, setStats] = useState(null);
  const [settings, setSettings] = useState(null);
  const [books, setBooks] = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [msg, setMsg] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyBook);
  const [confirmDelete, setConfirmDelete] = useState(null);

  async function loadAll() {
    try {
      const [adminRes, booksRes] = await Promise.all([
        fetch("/api/admin"),
        fetch("/api/books"),
      ]);
      if (adminRes.status === 401) {
        setAuthorized(false);
        return;
      }
      const admin = await adminRes.json();
      const booksData = await booksRes.json();
      setAuthorized(true);
      setStats(admin.stats);
      setSettings(admin.settings);
      setOverdue(admin.overdue || []);
      setBooks(booksData.books || []);
    } catch (e) {
      setAuthorized(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  function startAdd() {
    setEditing(null);
    setForm(emptyBook);
    setTab("books");
  }

  function startEdit(book) {
    setEditing(book.id);
    setForm({
      title: book.title,
      author: book.author,
      category: book.category,
      isbn: book.isbn,
      publisher: book.publisher,
      edition: book.edition,
      shelf: book.shelf,
      totalCopies: book.totalCopies,
      description: book.description,
    });
    setTab("books");
  }

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function saveBook(e) {
    e.preventDefault();
    setMsg("");
    if (!form.title || !form.author || !form.category) {
      setMsg("Title, author and category are required.");
      return;
    }
    try {
      const url = editing ? `/api/books/${editing}` : "/api/books";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg(editing ? "Book updated successfully." : "Book added successfully.");
        setEditing(null);
        setForm(emptyBook);
        loadAll();
      } else {
        setMsg(data.error || "Could not save the book.");
      }
    } catch (e) {
      setMsg("Something went wrong.");
    }
  }

  async function deleteBook(id) {
    setMsg("");
    try {
      const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMsg("Book deleted.");
        setConfirmDelete(null);
        loadAll();
      } else {
        setMsg("Could not delete the book.");
      }
    } catch (e) {
      setMsg("Something went wrong.");
    }
  }

  async function saveSettings(e) {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch("/api/admin", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Settings saved.");
        setSettings(data.settings);
      } else {
        setMsg("Could not save settings.");
      }
    } catch (e) {
      setMsg("Something went wrong.");
    }
  }

  if (authorized === null) {
    return <section className="section"><div className="container"><p className="empty">Checking access…</p></div></section>;
  }

  if (authorized === false) {
    return (
      <section className="section">
        <div className="container">
          <div className="empty">
            <AlertTriangle size={40} />
            <h3>Unauthorized</h3>
            <p>Please sign in as a librarian to access the dashboard.</p>
            <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => router.push("/login")}>
              Go to login
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
          <h1 style={{ margin: 0 }}>Librarian Dashboard</h1>
          <button className="btn btn-outline btn-sm" onClick={logout}>
            <LogOut size={15} /> Logout
          </button>
        </div>

        {msg && <div className="alert alert-success">{msg}</div>}

        <div className="admin-grid">
          <aside className="admin-side card">
            <ul>
              <li>
                <button className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")}>
                  <LayoutDashboard size={16} style={{ verticalAlign: "-3px", marginRight: 8 }} /> Overview
                </button>
              </li>
              <li>
                <button className={tab === "books" ? "active" : ""} onClick={() => setTab("books")}>
                  <BookOpen size={16} style={{ verticalAlign: "-3px", marginRight: 8 }} /> Manage Books
                </button>
              </li>
              <li>
                <button className={tab === "settings" ? "active" : ""} onClick={() => setTab("settings")}>
                  <Settings size={16} style={{ verticalAlign: "-3px", marginRight: 8 }} /> Settings
                </button>
              </li>
            </ul>
          </aside>

          <div>
            {tab === "overview" && stats && (
              <>
                <div className="grid grid-4">
                  <div className="stat-card card">
                    <div className="stat-num">{stats.totalBooks}</div>
                    <div className="stat-label"><Library size={14} style={{ verticalAlign: "-2px" }} /> Total Books</div>
                  </div>
                  <div className="stat-card card">
                    <div className="stat-num">{stats.totalStudents}</div>
                    <div className="stat-label"><Users size={14} style={{ verticalAlign: "-2px" }} /> Students</div>
                  </div>
                  <div className="stat-card card">
                    <div className="stat-num">{stats.borrowed}</div>
                    <div className="stat-label"><BookOpen size={14} style={{ verticalAlign: "-2px" }} /> Borrowed</div>
                  </div>
                  <div className="stat-card card">
                    <div className="stat-num" style={{ color: "var(--danger)" }}>{stats.overdue}</div>
                    <div className="stat-label"><Clock size={14} style={{ verticalAlign: "-2px" }} /> Overdue</div>
                  </div>
                </div>

                <div className="card" style={{ padding: 20, marginTop: 20 }}>
                  <h3>Overdue Books</h3>
                  {overdue.length === 0 ? (
                    <p className="muted">No overdue books right now.</p>
                  ) : (
                    <div className="table-wrap">
                      <table className="admin-table">
                        <thead>
                          <tr><th>Book</th><th>Student</th><th>Due Date</th><th>Fine</th></tr>
                        </thead>
                        <tbody>
                          {overdue.map((r) => (
                            <tr key={r.id}>
                              <td>{r.bookTitle || r.bookId}</td>
                              <td>{r.studentId}</td>
                              <td>{r.dueDate}</td>
                              <td>₹{Math.max(0, Math.floor((new Date() - new Date(r.dueDate)) / 86400000)) * (settings?.finePerDay || 2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}

            {tab === "books" && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h2 style={{ margin: 0 }}>Books ({books.length})</h2>
                  <button className="btn btn-primary btn-sm" onClick={startAdd}>
                    <Plus size={16} /> Add Book
                  </button>
                </div>

                {(editing || form.title) && (
                  <form className="card" style={{ padding: 20, marginBottom: 20 }} onSubmit={saveBook}>
                    <h3>{editing ? "Edit Book" : "Add New Book"}</h3>
                    <div className="form-row">
                      <div className="field">
                        <label className="label">Title *</label>
                        <input className="input" value={form.title} onChange={(e) => update("title", e.target.value)} />
                      </div>
                      <div className="field">
                        <label className="label">Author *</label>
                        <input className="input" value={form.author} onChange={(e) => update("author", e.target.value)} />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="field">
                        <label className="label">Category *</label>
                        <select className="select" value={form.category} onChange={(e) => update("category", e.target.value)}>
                          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="field">
                        <label className="label">ISBN</label>
                        <input className="input" value={form.isbn} onChange={(e) => update("isbn", e.target.value)} />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="field">
                        <label className="label">Publisher</label>
                        <input className="input" value={form.publisher} onChange={(e) => update("publisher", e.target.value)} />
                      </div>
                      <div className="field">
                        <label className="label">Edition</label>
                        <input className="input" value={form.edition} onChange={(e) => update("edition", e.target.value)} />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="field">
                        <label className="label">Shelf Location</label>
                        <input className="input" value={form.shelf} onChange={(e) => update("shelf", e.target.value)} placeholder="Rack B-3" />
                      </div>
                      <div className="field">
                        <label className="label">Total Copies</label>
                        <input className="input" type="number" min="1" value={form.totalCopies} onChange={(e) => update("totalCopies", e.target.value)} />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label">Description</label>
                      <textarea className="textarea" value={form.description} onChange={(e) => update("description", e.target.value)} />
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button className="btn btn-primary" type="submit">{editing ? "Save changes" : "Add book"}</button>
                      <button className="btn btn-ghost" type="button" onClick={() => { setEditing(null); setForm(emptyBook); }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="table-wrap card" style={{ padding: 8 }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Title</th><th>Category</th><th>Shelf</th><th>Copies</th><th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {books.map((b) => (
                        <tr key={b.id}>
                          <td>{b.title}</td>
                          <td>{b.category}</td>
                          <td>{b.shelf}</td>
                          <td>{b.availableCopies}/{b.totalCopies}</td>
                          <td style={{ whiteSpace: "nowrap" }}>
                            <button className="btn btn-ghost btn-sm" style={{ marginRight: 6 }} onClick={() => startEdit(b)} aria-label="Edit">
                              <Pencil size={15} />
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(b)} aria-label="Delete">
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {tab === "settings" && settings && (
              <form className="card" style={{ padding: 24, maxWidth: 480 }} onSubmit={saveSettings}>
                <h3>Library Settings</h3>
                <div className="field">
                  <label className="label">Fine per day (₹)</label>
                  <input className="input" type="number" min="0" value={settings.finePerDay} onChange={(e) => setSettings({ ...settings, finePerDay: e.target.value })} />
                </div>
                <div className="field">
                  <label className="label">Loan period (days)</label>
                  <input className="input" type="number" min="1" value={settings.loanPeriodDays} onChange={(e) => setSettings({ ...settings, loanPeriodDays: e.target.value })} />
                </div>
                <div className="field">
                  <label className="label">Borrow limit (books)</label>
                  <input className="input" type="number" min="1" value={settings.borrowLimit} onChange={(e) => setSettings({ ...settings, borrowLimit: e.target.value })} />
                </div>
                <button className="btn btn-primary" type="submit">Save settings</button>
              </form>
            )}
          </div>
        </div>

        {confirmDelete && (
          <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
            <div className="modal card" onClick={(e) => e.stopPropagation()}>
              <h3>Delete book?</h3>
              <p>Are you sure you want to delete "{confirmDelete.title}"? This cannot be undone.</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={() => deleteBook(confirmDelete.id)}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}