# SmartLibrary — College Library Management System

**Tagline:** Read. Learn. Grow.

A complete, modern, responsive website that helps students and library staff manage and use the college library easily. Students can search for books, check availability, borrow and return books, and track due dates and fines — while the librarian manages everything from one protected dashboard.

## Features

- **Homepage** with hero search, 10 category cards, newly added books, most borrowed books, "How It Works", about and footer.
- **Book search & filtering** by title, author or ISBN, plus category and availability filters, with a friendly "No books found" state and clear-filters action.
- **Book details page** for every book (title, author, category, ISBN, publisher, edition, shelf, copies, description) with a Borrow button.
- **Borrowing, returns & fines** — available copies go down on borrow, due date is 14 days, overdue books are highlighted, and fines are ₹2/day (configurable).
- **My Books page** showing borrowed books, due dates, days left and a Return action.
- **Librarian dashboard** with secure login, add/edit/delete books (with confirmation), settings for fine/loan period/borrow limit, and overview stats.
- **Contact form** with validation and a clearly labelled demo mode.
- **30+ sample books** across all 10 categories for immediate demonstration.

## Technology Stack

- **Next.js (React)** — frontend and API routes
- **JSON file storage** — demo data layer that survives restarts (swappable for Supabase/Neon PostgreSQL)
- **Lucide** icons
- **Vercel** hosting

## Getting Started

```bash
# install dependencies
npm install

# run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo Accounts

- **Librarian:** `librarian@smartlibrary.demo` / `admin123`
- **Student (sample):** Riya Sharma — borrowing uses this account automatically in demo mode.

## Project Structure

```
app/            pages and API routes
  api/          backend routes (books, borrow, return, auth, admin, contact)
  books/        browse and book-detail pages
  my-books/     borrowed books
  admin/        librarian dashboard
  login/        librarian login
components/     Navbar, Footer, BookCard, SearchBar
lib/            data layer (db.js) and auth (auth.js)
data/           db.json (created automatically on first run)
```

## Notes

- All book details, ISBNs and shelf locations are **demonstration data**, clearly marked and editable by the librarian.
- Passwords are hashed (demo hash) and librarian actions are protected on the backend.
- The contact form is demo-only and does not send real emails.