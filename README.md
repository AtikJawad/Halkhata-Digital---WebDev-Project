# হালখাতা ডিজিটাল (Halkhata Digital)

**A digital ledger management system for small and medium businesses in Bangladesh.**

Halkhata Digital replaces the traditional handwritten হালখাতা (credit ledger book) used by generations of Bangladeshi shop owners, with a lightweight, Bengali-language web application — while keeping the exact workflow shop owners already understand: one customer, one running balance, one always-current history.

---

## 📖 Overview

Small retailers in Bangladesh have long tracked customer credit sales and repayments in a handwritten notebook. It works, but it's fragile — pages get lost or damaged, balances have to be calculated by hand, and there's no way to generate a monthly summary without redoing all the arithmetic.

Halkhata Digital digitizes that exact process: record a sale, mark it cash or credit, record a repayment later, and let the system handle every calculation, backup, and report automatically.

---

## ✨ Features

### Core Ledger
- Customer management with contact details, credit limits, and an automatically computed **trust score**
- Cash sales and credit sales, optionally linked to inventory
- Repayments automatically applied to the customer's **oldest outstanding due first (FIFO)**
- Balances are never cached — always calculated live from transaction history

### Inventory
- Batch-aware stock tracking — one product can have multiple purchase batches, each with its own cost price and expiry date
- Automatic **FIFO stock deduction** by nearest expiry date on every sale
- Manual batch selection available when needed
- Low-stock and expiring-soon indicators

### Suppliers
- A parallel ledger for tracking what the shop owes its own wholesalers
- Supplier transaction history, mirroring the customer ledger design

### Expenses
- Categorized expense tracking (rent, salary, transportation, utilities, etc.)
- Optional receipt photo upload
- Linked to cash/mobile-service account balances

### Dashboard
- Live totals: receivable, collected, and overdue amounts
- Recent transactions feed
- Ranked list of highest-due customers
- Short-term income vs. expense trend chart

### Reports & Analytics
- Monthly and yearly financial reports
- Interactive charts (Chart.js): revenue vs. expense, daily cash flow, category breakdowns
- Product, customer, and payment-method analytics
- Business insights (best month, top customer, highest expense category, etc.)

### Export
- **CSV export** — client-side generation with UTF-8 BOM encoding for correct Bengali rendering in Excel
- **PDF export** — print-optimized HTML rendered via the browser's native print-to-PDF, no server-side PDF library required

### Multi-Branch Support
- One account can manage multiple shop locations
- Branch-level filtering across dashboard, customers, inventory, and reports

### Authentication & Security
- Login via phone number or email + a 4-digit PIN
- PINs hashed with **bcrypt** — never stored or transmitted in plain text
- Server-side session management via `express-session`
- Full per-account data isolation — every query is scoped to the authenticated user

### Settings & Data Management
- Manage shop name, owner name, and branches
- Secure PIN change with current-PIN verification
- Full JSON data backup and restore

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 |
| Styling | CSS3 |
| Client Logic | JavaScript (Vanilla, ES6+) |
| Data Visualization | Chart.js |
| Runtime | Node.js |
| Web Framework | Express.js |
| Database | SQLite (via `better-sqlite3`) |
| Password Hashing | bcryptjs |
| Session Management | express-session |
| File Uploads | Multer |
| Unique IDs | uuid |
| Version Control | Git / GitHub |

No frontend framework, no build step, no external backend-as-a-service — the entire stack is dependency-light by design.

---

## 📁 Project Structure

halkhata/
    ├── server.js            # Express app entry point and all route definitions
    ├── db.js                # SQLite schema, migrations, and shared query helpers
    ├── package.json          # Project metadata and dependencies
    ├── data/                 # SQLite database file
    ├── uploads/               # Uploaded receipt and expense photos
    └── public/
        ├── index.html         # Main single-page application shell
        ├── style.css           # Global stylesheet (CSS variable–driven theme)
        ├── script.js            # All frontend logic and API calls
        ├── login.html           # Login screen
        └── signup.html          # Registration screen

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/halkhata-digital.git
cd halkhata-digital

# Install dependencies
npm install

# Start the server
node server.js
```

The application will be available at `http://localhost:3000` (or whichever port is configured in `server.js`).

### First-Time Setup
1. Navigate to the signup page
2. Register with your name, shop name, phone number or email, and a 4-digit PIN
3. Log in and start adding customers, inventory, and transactions

---

## 🔌 API Overview

All endpoints are prefixed with `/api` and return JSON. Every route except authentication is protected by session middleware and automatically scoped to the logged-in user.

| Group | Endpoints |
|---|---|
| Authentication | `/api/auth/signup`, `/api/auth/login`, `/api/auth/check`, `/api/auth/info`, `/api/auth/setup`, `/api/auth/change-pin` |
| Customers | `/api/customers`, `/api/customers/:id`, `/api/customers/:id/transactions`, `/api/customers/:id/analytics` |
| Transactions & Sales | `/api/transactions`, `/api/sales` |
| Products & Inventory | `/api/products`, `/api/products/:id/batches`, `/api/batches/:id` |
| Suppliers | `/api/suppliers`, `/api/suppliers/:id`, `/api/supplier-transactions` |
| Expenses | `/api/expenses`, `/api/expenses/:id`, `/api/expenses/:id/photo` |
| Accounts | `/api/accounts`, `/api/accounts/:id`, `/api/accounts/:id/transactions` |
| Dashboard & Reports | `/api/dashboard`, `/api/report/monthly`, `/api/report/monthly/:year/:month`, `/api/overdue` |
| Data Management | `/api/backup`, `/api/restore`, `/api/seed` |

---

## 🗄️ Database Schema (Summary)

| Table | Purpose |
|---|---|
| `users` | Registered shop owner accounts and hashed PIN credentials |
| `app_settings` | Per-account shop configuration and branch list |
| `customers` | Registered customers per shop owner |
| `transactions` | Every cash sale, credit sale, and repayment |
| `products` | Aggregate product catalog |
| `inventory_batches` | Individual purchase batches per product (quantity, cost, expiry) |
| `suppliers` | Registered suppliers |
| `supplier_transactions` | Amounts owed to and paid to each supplier |
| `expenses` | Recorded business expenses |
| `accounts` | Cash / bKash / Nagad / Rocket / bank balances |
| `account_transactions` | Ledger of movements into and out of each account |

Every business-data table is scoped by a `userId` foreign key, guaranteeing complete data isolation between shop owner accounts.

---

## 🔒 Security Notes

- PINs are hashed with bcrypt before storage — never stored or logged in plain text
- Authentication state is server-side (session-based), not stored in browser local storage
- Every data-access route independently verifies that the requested record belongs to the authenticated user
- File uploads are restricted by type and stored outside publicly served application code

---

## 🔭 Future Work

- Offline-first support
- Native Android and iOS applications
- Barcode / QR code scanning for inventory
- Cloud synchronization
- SMS notifications for overdue payments
- Dark mode
- Advanced analytics and AI-based credit risk prediction
- Multi-employee accounts with role-based permissions
- Full multi-language interface support



## 📄 License

This project was developed for academic purposes as part of Internet & Web Application Project at Jagannath University, Dhaka
