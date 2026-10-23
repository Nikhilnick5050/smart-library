// SmartLibrary — data layer (Neon / PostgreSQL)
import { neon } from "@neondatabase/serverless";

let _sql = null;
function sql(...args) {
  if (!_sql) _sql = neon(process.env.DATABASE_URL);
  return _sql(...args);
}

function hash(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = (h * 33) ^ str.charCodeAt(i);
  return "h" + (h >>> 0).toString(16);
}

export function verifyPassword(plain, hashValue) {
  return hash(plain) === hashValue;
}

function mapBook(b) {
  return {
    id: b.id, title: b.title, author: b.author, category: b.category,
    isbn: b.isbn, publisher: b.publisher, edition: b.edition, shelf: b.shelf,
    totalCopies: b.total_copies, availableCopies: b.available_copies,
    description: b.description, addedAt: b.added_at, isNew: b.is_new,
    borrowCount: b.borrow_count,
  };
}

export async function getBooks(filters = {}) {
  const { q, category, availability } = filters;
  const conds = []; const params = [];
  if (q) { params.push(`%${q}%`); conds.push(`(title ILIKE $${params.length} OR author ILIKE $${params.length} OR isbn ILIKE $${params.length})`); }
  if (category) { params.push(category); conds.push(`category = $${params.length}`); }
  if (availability === "available") conds.push("available_copies > 0");
  if (availability === "borrowed") conds.push("available_copies < total_copies");
  let query = "SELECT * FROM books";
  if (conds.length) query += " WHERE " + conds.join(" AND ");
  query += " ORDER BY added_at DESC, id ASC";
  const rows = await sql(query, params);
  return rows.map(mapBook);
}

export async function getBook(id) {
  const rows = await sql("SELECT * FROM books WHERE id = $1", [id]);
  return rows.length ? mapBook(rows[0]) : null;
}

export async function createBook(data) {
  const total = Math.max(0, parseInt(data.totalCopies, 10) || 1);
  const rows = await sql(
    `INSERT INTO books (title, author, category, isbn, publisher, edition, shelf, total_copies, available_copies, description, added_at, is_new, borrow_count)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
    [data.title, data.author, data.category, data.isbn || "", data.publisher || "", data.edition || "", data.shelf || "", total, total, data.description || "", new Date().toISOString().slice(0,10), true, 0]
  );
  return mapBook(rows[0]);
}

export async function updateBook(id, data) {
  const current = await getBook(id);
  if (!current) return null;
  const total = Math.max(0, parseInt(data.totalCopies, 10) || current.totalCopies);
  const borrowed = current.totalCopies - current.availableCopies;
  const available = Math.max(0, total - borrowed);
  const rows = await sql(
    `UPDATE books SET title=$1, author=$2, category=$3, isbn=$4, publisher=$5, edition=$6, shelf=$7, description=$8, total_copies=$9, available_copies=$10 WHERE id=$11 RETURNING *`,
    [data.title ?? current.title, data.author ?? current.author, data.category ?? current.category, data.isbn ?? current.isbn, data.publisher ?? current.publisher, data.edition ?? current.edition, data.shelf ?? current.shelf, data.description ?? current.description, total, available, id]
  );
  return mapBook(rows[0]);
}

export async function deleteBook(id) {
  await sql("DELETE FROM books WHERE id = $1", [id]);
  return true;
}

export async function getStudents() {
  const rows = await sql("SELECT * FROM students ORDER BY name");
  return rows.map((s) => ({ id: s.id, name: s.name, email: s.email, department: s.department, year: s.year }));
}

export async function getStudent(id) {
  const rows = await sql("SELECT * FROM students WHERE id = $1", [id]);
  if (!rows.length) return null;
  const s = rows[0];
  return { id: s.id, name: s.name, email: s.email, department: s.department, year: s.year };
}

export async function getAdminByEmail(email) {
  const rows = await sql("SELECT * FROM admins WHERE lower(email) = lower($1)", [email]);
  if (!rows.length) return null;
  const a = rows[0];
  return { id: a.id, name: a.name, email: a.email, passwordHash: a.password_hash };
}

export async function getSettings() {
  const rows = await sql("SELECT * FROM settings LIMIT 1");
  const s = rows[0];
  return { finePerDay: s.fine_per_day, loanPeriodDays: s.loan_period_days, borrowLimit: s.borrow_limit };
}

export async function updateSettings(settings) {
  const finePerDay = Math.max(0, Number(settings.finePerDay) || 0);
  const loanPeriodDays = Math.max(1, Number(settings.loanPeriodDays) || 14);
  const borrowLimit = Math.max(1, Number(settings.borrowLimit) || 3);
  await sql("UPDATE settings SET fine_per_day=$1, loan_period_days=$2, borrow_limit=$3 WHERE id = 1", [finePerDay, loanPeriodDays, borrowLimit]);
  return { finePerDay, loanPeriodDays, borrowLimit };
}

function mapBorrow(r) {
  return { id: r.id, studentId: r.student_id, bookId: r.book_id, borrowDate: r.borrow_date, dueDate: r.due_date, returnDate: r.return_date, fine: r.fine, status: r.status };
}

export async function createBorrow(bookId, studentId) {
  const book = await getBook(bookId);
  const student = await getStudent(studentId);
  if (!book) return { error: "Book not found.", status: 404 };
  if (!student) return { error: "Student not found.", status: 404 };
  if (book.availableCopies <= 0) return { error: "No copies available to borrow.", status: 400 };
  const settings = await getSettings();
  const active = await sql("SELECT count(*)::int AS c FROM borrows WHERE student_id = $1 AND status = 'borrowed'", [studentId]);
  if (active[0].c >= settings.borrowLimit) return { error: `Borrow limit reached (max ${settings.borrowLimit} books).`, status: 400 };
  const now = new Date();
  const due = new Date(now);
  due.setDate(due.getDate() + settings.loanPeriodDays);
  const rows = await sql(
    `INSERT INTO borrows (student_id, book_id, borrow_date, due_date, return_date, fine, status) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [studentId, bookId, now.toISOString().slice(0,10), due.toISOString().slice(0,10), null, 0, "borrowed"]
  );
  await sql("UPDATE books SET available_copies = available_copies - 1, borrow_count = borrow_count + 1 WHERE id = $1", [bookId]);
  return { record: mapBorrow(rows[0]), book: await getBook(bookId) };
}

export async function returnBorrow(recordId) {
  const rows = await sql("SELECT * FROM borrows WHERE id = $1", [recordId]);
  if (!rows.length) return { error: "Record not found.", status: 404 };
  const record = mapBorrow(rows[0]);
  if (record.status === "returned") return { error: "Book already returned.", status: 400 };
  const settings = await getSettings();
  const today = new Date();
  const due = new Date(record.dueDate);
  const daysLate = Math.max(0, Math.floor((today - due) / (1000 * 60 * 60 * 24)));
  const fine = daysLate * settings.finePerDay;
  await sql("UPDATE borrows SET status='returned', return_date=$1, fine=$2 WHERE id=$3", [today.toISOString().slice(0,10), fine, recordId]);
  await sql("UPDATE books SET available_copies = LEAST(total_copies, available_copies + 1) WHERE id = $1", [record.bookId]);
  return { record: { ...record, status: "returned", returnDate: today.toISOString().slice(0,10), fine }, fine };
}

export async function getBorrowsForStudent(studentId) {
  const rows = await sql(
    `SELECT b.*, bk.title AS book_title, bk.author AS book_author FROM borrows b LEFT JOIN books bk ON bk.id = b.book_id WHERE b.student_id = $1 ORDER BY b.borrow_date DESC`,
    [studentId]
  );
  return rows.map((r) => ({ ...mapBorrow(r), bookTitle: r.book_title || "Unknown book", bookAuthor: r.book_author || "" }));
}

export async function getOverdue() {
  const today = new Date().toISOString().slice(0, 10);
  const rows = await sql(
    `SELECT b.*, bk.title AS book_title, s.name AS student_name FROM borrows b LEFT JOIN books bk ON bk.id = b.book_id LEFT JOIN students s ON s.id = b.student_id WHERE b.status = 'borrowed' AND b.due_date < $1 ORDER BY b.due_date ASC`,
    [today]
  );
  return rows.map((r) => ({ ...mapBorrow(r), bookTitle: r.book_title || r.book_id, studentName: r.student_name || r.student_id }));
}

export async function getStats() {
  const today = new Date().toISOString().slice(0, 10);
  const [books, students, borrowed, overdue, copies] = await Promise.all([
    sql("SELECT count(*)::int AS c FROM books"),
    sql("SELECT count(*)::int AS c FROM students"),
    sql("SELECT count(*)::int AS c FROM borrows WHERE status = 'borrowed'"),
    sql("SELECT count(*)::int AS c FROM borrows WHERE status = 'borrowed' AND due_date < $1", [today]),
    sql("SELECT COALESCE(sum(total_copies),0)::int AS total, COALESCE(sum(available_copies),0)::int AS avail FROM books"),
  ]);
  return { totalBooks: books[0].c, totalStudents: students[0].c, borrowed: borrowed[0].c, overdue: overdue[0].c, totalCopies: copies[0].total, availableCopies: copies[0].avail };
}
