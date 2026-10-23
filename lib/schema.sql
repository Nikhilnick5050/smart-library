-- SmartLibrary — Neon (PostgreSQL) schema + seed
-- Run once against your Neon database (or via the Neon SQL editor).

CREATE TABLE IF NOT EXISTS settings (
  id integer PRIMARY KEY DEFAULT 1,
  fine_per_day integer NOT NULL DEFAULT 2,
  loan_period_days integer NOT NULL DEFAULT 14,
  borrow_limit integer NOT NULL DEFAULT 3
);

CREATE TABLE IF NOT EXISTS students (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  department text NOT NULL,
  year text NOT NULL,
  password_hash text NOT NULL
);

CREATE TABLE IF NOT EXISTS admins (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL
);

CREATE TABLE IF NOT EXISTS books (
  id text PRIMARY KEY,
  title text NOT NULL,
  author text NOT NULL,
  category text NOT NULL,
  isbn text DEFAULT '',
  publisher text DEFAULT '',
  edition text DEFAULT '',
  shelf text DEFAULT '',
  total_copies integer NOT NULL DEFAULT 1,
  available_copies integer NOT NULL DEFAULT 1,
  description text DEFAULT '',
  added_at date NOT NULL DEFAULT CURRENT_DATE,
  is_new boolean NOT NULL DEFAULT true,
  borrow_count integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS borrows (
  id text PRIMARY KEY,
  student_id text NOT NULL REFERENCES students(id),
  book_id text NOT NULL REFERENCES books(id),
  borrow_date date NOT NULL,
  due_date date NOT NULL,
  return_date date,
  fine integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'borrowed'
);

-- Seed settings
INSERT INTO settings (id, fine_per_day, loan_period_days, borrow_limit)
VALUES (1, 2, 14, 3)
ON CONFLICT (id) DO NOTHING;

-- Seed students (password: student123)
INSERT INTO students (id, name, email, department, year, password_hash) VALUES
  ('stu-1', 'Riya Sharma', 'riya@example.com', 'Computer Science', '2nd Year', 'h3dfc73fc'),
  ('stu-2', 'Arjun Patel', 'arjun@example.com', 'Mechanical Engineering', '1st Year', 'h3dfc73fc')
ON CONFLICT (id) DO NOTHING;

-- Seed admin (password: admin123)
INSERT INTO admins (id, name, email, password_hash) VALUES
  ('adm-1', 'Librarian', 'librarian@smartlibrary.demo', 'ha63f45da')
ON CONFLICT (id) DO NOTHING;