// SmartLibrary — data layer (demo mode)
// In production this would use a hosted PostgreSQL database (Supabase/Neon).
// For this submission, data is stored in a JSON file so it survives restarts
// and can be demonstrated immediately without external credentials.

import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

const FINE_PER_DAY = 2; // ₹ per day (demo default)
const LOAN_PERIOD_DAYS = 14;
const BORROW_LIMIT = 3;

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function seed() {
  return {
    settings: {
      finePerDay: FINE_PER_DAY,
      loanPeriodDays: LOAN_PERIOD_DAYS,
      borrowLimit: BORROW_LIMIT,
    },
    students: [
      {
        id: "stu-1",
        name: "Riya Sharma",
        email: "riya@example.com",
        department: "Computer Science",
        year: "2nd Year",
        passwordHash: hash("student123"),
      },
      {
        id: "stu-2",
        name: "Arjun Patel",
        email: "arjun@example.com",
        department: "Mechanical Engineering",
        year: "1st Year",
        passwordHash: hash("student123"),
      },
    ],
    admins: [
      {
        id: "adm-1",
        name: "Librarian",
        email: "librarian@smartlibrary.demo",
        passwordHash: hash("admin123"),
      },
    ],
    books: [],
    borrows: [],
  };
}

// Simple deterministic hash (demo only — a real deployment uses bcrypt).
function hash(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = (h * 33) ^ str.charCodeAt(i);
  }
  return "h" + (h >>> 0).toString(16);
}

export function readDB() {
  if (memoryDB) return memoryDB;
  try {
    ensureDir();
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf8");
      const db = JSON.parse(raw);
      if (db.books && db.books.length > 0) {
        memoryDB = db;
        return db;
      }
    }
  } catch (e) {
    // fall through to fresh seed
  }
  const db = seed();
  db.books = sampleBooks();
  writeDB(db);
  return db;
}

let memoryDB = null;

export function writeDB(db) {
  memoryDB = db;
  try {
    ensureDir();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
  } catch (e) {
    // Read-only filesystem (e.g. Vercel serverless): keep data in memory.
  }
}

export function verifyPassword(plain, hashValue) {
  return hash(plain) === hashValue;
}

export function sampleBooks() {
  const cats = [
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
  const base = [
    ["Data Structures Using C", "Reema Thareja", "Computer Science", "9780198099307", "Oxford University Press", "2nd Edition", "Rack B-3", 5, 4, "A complete introduction to data structures and algorithms with C programming examples."],
    ["Engineering Mathematics", "B.S. Grewal", "Mathematics", "9788174091955", "Khanna Publishers", "44th Edition", "Rack M-1", 6, 5, "Core mathematics for engineering students covering calculus, algebra and more."],
    ["Basic Electrical Engineering", "D.P. Kothari & I.J. Nagrath", "Electronics", "9780070146112", "McGraw Hill", "4th Edition", "Rack E-2", 4, 3, "Fundamentals of electrical circuits, machines and power systems."],
    ["Operating System Concepts", "Abraham Silberschatz", "Computer Science", "9781119456339", "Wiley", "10th Edition", "Rack B-1", 4, 4, "Classic text on operating systems, processes, memory and file systems."],
    ["Digital Electronics", "Morris Mano", "Electronics", "9780131989245", "Pearson", "3rd Edition", "Rack E-1", 3, 2, "Principles of digital logic design, combinational and sequential circuits."],
    ["Theory of Machines", "R.S. Khurmi", "Mechanical Engineering", "9788121925242", "S. Chand", "14th Edition", "Rack ME-1", 4, 3, "Mechanisms, kinematics and dynamics of machines for mechanical students."],
    ["Strength of Materials", "R.K. Bansal", "Civil Engineering", "9788131808146", "Laxmi Publications", "6th Edition", "Rack C-2", 5, 5, "Stress, strain, beams and columns — fundamentals of structural mechanics."],
    ["Concrete Technology", "M.S. Shetty", "Civil Engineering", "9788121900034", "S. Chand", "7th Edition", "Rack C-1", 3, 2, "Properties of concrete, mix design and construction practices."],
    ["Higher Engineering Mathematics", "B.V. Ramana", "Mathematics", "9780070634190", "McGraw Hill", "1st Edition", "Rack M-2", 5, 4, "Advanced topics in engineering mathematics with solved examples."],
    ["Concepts of Physics Vol 1", "H.C. Verma", "Physics", "9788177091878", "Bharati Bhawan", "1st Edition", "Rack P-1", 6, 6, "Conceptual physics with clear explanations and numerical problems."],
    ["Fundamentals of Physics", "Halliday, Resnick & Walker", "Physics", "9781118230718", "Wiley", "10th Edition", "Rack P-2", 4, 3, "Comprehensive introduction to mechanics, waves and thermodynamics."],
    ["Organic Chemistry", "Morrison & Boyd", "Chemistry", "9780136436690", "Pearson", "7th Edition", "Rack CH-1", 4, 4, "Structure, reactions and mechanisms in organic chemistry."],
    ["Physical Chemistry", "P.W. Atkins", "Chemistry", "9780198814740", "Oxford University Press", "11th Edition", "Rack CH-2", 3, 2, "Thermodynamics, kinetics and quantum chemistry fundamentals."],
    ["Principles of Management", "Harold Koontz", "Management", "9780070618374", "McGraw Hill", "1st Edition", "Rack MG-1", 4, 3, "Planning, organising, leading and controlling for management students."],
    ["Financial Management", "Prasanna Chandra", "Management", "9789339213053", "McGraw Hill", "9th Edition", "Rack MG-2", 3, 3, "Investment, financing and dividend decisions explained clearly."],
    ["Quantitative Aptitude", "R.S. Aggarwal", "Competitive Exams", "9788121904986", "S. Chand", "Revised Edition", "Rack CE-1", 6, 5, "Practice problems for competitive exam quantitative aptitude."],
    ["A Modern Approach to Verbal Reasoning", "R.S. Aggarwal", "Competitive Exams", "9788121905518", "S. Chand", "Revised Edition", "Rack CE-2", 5, 4, "Verbal and non-verbal reasoning for competitive examinations."],
    ["The Alchemist", "Paulo Coelho", "Novels & General Reading", "9780062315007", "HarperOne", "25th Anniversary", "Rack N-1", 4, 4, "A fable about following your dreams."],
    ["Wings of Fire", "A.P.J. Abdul Kalam", "Novels & General Reading", "9788173711466", "Universities Press", "1st Edition", "Rack N-2", 5, 5, "Autobiography of Dr. A.P.J. Abdul Kalam."],
    ["Thermodynamics: An Engineering Approach", "Yunus Cengel", "Mechanical Engineering", "9780073398174", "McGraw Hill", "8th Edition", "Rack ME-2", 3, 2, "Energy, entropy and cycles for mechanical engineering."],
    ["Signals and Systems", "Alan V. Oppenheim", "Electronics", "9780138147570", "Pearson", "2nd Edition", "Rack E-3", 3, 3, "Continuous and discrete-time signals and systems."],
    ["Surveying Vol 1", "B.C. Punmia", "Civil Engineering", "9788170088530", "Laxmi Publications", "16th Edition", "Rack C-3", 3, 2, "Fundamentals of surveying and levelling."],
    ["Discrete Mathematics", "Kenneth Rosen", "Computer Science", "9780070681880", "McGraw Hill", "7th Edition", "Rack B-2", 4, 3, "Logic, sets, graphs and combinatorics for computer science."],
    ["Inorganic Chemistry", "J.D. Lee", "Chemistry", "9780198788126", "Oxford University Press", "5th Edition", "Rack CH-3", 3, 3, "Concise inorganic chemistry for undergraduates."],
    ["Modern Physics", "Arthur Beiser", "Physics", "9780070151550", "McGraw Hill", "6th Edition", "Rack P-3", 3, 2, "Relativity, quantum theory and atomic physics."],
    ["Marketing Management", "Philip Kotler", "Management", "9789332587403", "Pearson", "15th Edition", "Rack MG-3", 3, 2, "Core concepts of modern marketing management."],
    ["General Knowledge 2026", "Manohar Pandey", "Competitive Exams", "9789355012340", "Arihant", "Latest Edition", "Rack CE-3", 4, 4, "Current affairs and general knowledge for exams."],
    ["The Great Gatsby", "F. Scott Fitzgerald", "Novels & General Reading", "9780743273565", "Scribner", "1st Edition", "Rack N-3", 3, 3, "A classic novel of the Jazz Age."],
    ["Fluid Mechanics", "R.K. Bansal", "Mechanical Engineering", "9788131808153", "Laxmi Publications", "9th Edition", "Rack ME-3", 3, 2, "Properties of fluids, flow and hydraulic machines."],
    ["Linear Algebra", "Gilbert Strang", "Mathematics", "9780980232776", "Wellesley-Cambridge Press", "5th Edition", "Rack M-3", 3, 3, "Vectors, matrices and linear transformations."],
  ];
  return base.map((b, i) => ({
    id: "book-" + (i + 1),
    title: b[0],
    author: b[1],
    category: b[2],
    isbn: b[3],
    publisher: b[4],
    edition: b[5],
    shelf: b[6],
    totalCopies: b[7],
    availableCopies: b[8],
    description: b[9],
    addedAt: "2026-10-01",
    isNew: i < 6,
    borrowCount: (i * 7) % 40,
  }));
}