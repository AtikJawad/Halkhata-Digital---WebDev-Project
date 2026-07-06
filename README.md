# হালখাতা ডিজিটাল 📒
**The Digital Ledger Built for Bangladeshi Shop Owners**

---

## 🚀 Quick Start (3 steps)

### Step 1 — Install Dependencies
```bash
cd halkhata
npm install
```

### Step 2 — Start the Server
```bash
node server.js
# OR for auto-reload during development:
npx nodemon server.js
```

### Step 3 — Open in Browser
```
http://localhost:3000
```

**Default PIN: `1234`** (change it in Settings after login)

---

## 📁 Project Structure

```
halkhata/
├── server.js                  ← Express backend + all REST API routes
├── package.json               ← Dependencies
├── .gitignore
├── data/
│   ├── customers.json         ← Customer records (auto-created)
│   ├── transactions.json      ← All transaction records (auto-created)
│   └── auth.json              ← PIN + shop settings (pre-seeded)
├── uploads/                   ← Receipt photos stored here
└── public/
    ├── index.html             ← Full app UI (login + all pages)
    ├── style.css              ← Complete stylesheet
    ├── script.js              ← All frontend logic
    ├── sw.js                  ← Service Worker (offline support)
    └── manifest.json          ← PWA manifest (install to homescreen)
```

---

## 🧪 Feature Testing Guide

### 1. Login (PIN Auth)
- Open `http://localhost:3000`
- Enter PIN: `1234` using the numpad
- You'll be taken to the Dashboard

### 2. Load Demo Data
- On the Dashboard → click **"ডেমো ডেটা লোড করুন"**
- This populates 4 customers, 6 transactions across 2 shops

### 3. Customer Management
- Click **"খদ্দের"** in sidebar
- Click **"+ নতুন খদ্দের"** → fill form → save
- Click any customer card to open detail view
- Detail view shows: balance, trust score ring, transaction history
- Edit: use the edit button; Delete: red "মুছুন" button

### 4. Add Transaction (Credit/Debit)
- Click **"+ নতুন লেনদেন"** anywhere
- Toggle between "বাকি দিলাম (ধার)" and "টাকা পেলাম"
- Select customer, enter amount, optional note + due date
- Upload receipt photo (optional)
- Hit **"রেকর্ড করুন"**

### 5. Voice Input (Bangla)
- Open Add Transaction modal
- Click the 🎤 microphone button
- Speak in Bangla: *"পাঁচশো টাকা বাকি"* or *"৫০০"*
- The amount field auto-fills

### 6. Customer Trust Score
- Automatically calculated from repayment history
- Score 0–100: Green (≥70 বিশ্বস্ত), Yellow (40–69 মাঝারি), Red (<40 ঝুঁকিপূর্ণ)
- Updates live when payments are recorded

### 7. Dashboard Stats
- Shows: Total Receivable, Total Paid, Overdue Amount, Customer Count
- Recent transactions list
- Changes when you switch shop filter

### 8. Overdue (বকেয়া)
- Click **"বকেয়া"** in sidebar
- Shows all transactions past their due date
- Click **"📲 রিমাইন্ড"** → simulates SMS (logs to server console)

### 9. Monthly Report
- Click **"মাসিক রিপোর্ট"**
- Bar chart shows debit vs credit per month
- Summary table with net flow per month
- Change year from dropdown

### 10. Print Statement
- Open any customer detail
- Click **"🖨️ স্টেটমেন্ট প্রিন্ট"**
- Opens a print-ready window with full transaction history

### 11. Receipt Photo
- During Add Transaction, choose a photo file
- Photo is stored in `/uploads/`
- Appears as thumbnail in transaction list — click to enlarge

### 12. Shop Filter (Multi-Shop)
- After loading demo data, use "শাখা" dropdown in sidebar
- Switch between "প্রধান শাখা" and "শাখা-২"
- Dashboard, customers, transactions, reports all filter by shop

### 13. Offline Mode
- Disconnect your internet
- The app shows "অফলাইন" badge and yellow banner
- Try adding a transaction — it queues locally in localStorage
- Reconnect → it auto-syncs

### 14. Settings
- Change shop name, owner name, branches
- Change PIN (4 digits)
- Download full JSON backup

### 15. Data Backup
- Settings → "💾 ব্যাকআপ ডাউনলোড"
- Or visit `http://localhost:3000/api/backup`
- Downloads complete JSON file

### 16. PWA Install
- In Chrome: address bar → Install icon → "ইনস্টল করুন"
- Works offline after installation

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | PIN login |
| POST | `/api/auth/change-pin` | Change PIN |
| POST | `/api/auth/setup` | Update shop info |
| GET | `/api/customers` | List all customers |
| POST | `/api/customers` | Add customer |
| GET | `/api/customers/:id` | Get customer detail |
| PUT | `/api/customers/:id` | Update customer |
| DELETE | `/api/customers/:id` | Delete customer |
| GET | `/api/customers/:id/transactions` | Customer's transactions |
| GET | `/api/transactions` | All transactions (filterable) |
| POST | `/api/transactions` | Record new transaction |
| POST | `/api/transactions/:id/photo` | Upload receipt photo |
| GET | `/api/dashboard` | Dashboard stats |
| GET | `/api/report/monthly` | Monthly P&L |
| POST | `/api/reminders/send` | Trigger reminder (simulated SMS) |
| GET | `/api/overdue` | All overdue transactions |
| GET | `/api/backup` | Download full JSON backup |
| POST | `/api/restore` | Restore from backup |
| POST | `/api/seed` | Load demo data |

---

## ⚙️ npm packages used
```
express     — Web server & routing
multer      — File upload handling (receipt photos)
bcryptjs    — PIN hashing
cors        — Cross-origin headers
uuid        — Unique IDs for records
```

---

## 🔮 Future Enhancements (from roadmap)
- Real bKash SMS integration via SSL Commerz or bKash API
- MongoDB/PostgreSQL for production scale
- OTP-based phone authentication
- AI-powered bad debt prediction
- Micro-loan feature based on ledger history
