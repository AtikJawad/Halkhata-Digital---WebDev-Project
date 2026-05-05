const express = require('express');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// ─── Session Middleware ───────────────────────────────
app.use(session({
  secret: 'halkhata-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 8 * 60 * 60 * 1000 // 8 hours
  }
}));

// ─── Users Helpers ────────────────────────────────────
function readUsers() {
  const fp = path.join(DATA_DIR, 'users.json');
  if (!fs.existsSync(fp)) return [];
  try { return JSON.parse(fs.readFileSync(fp, 'utf8')); }
  catch { return []; }
}

// ─── Auth Middleware ──────────────────────────────────
function checkAuth(req, res, next) {
  if (req.session && req.session.userId) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}

// ─── Multer Setup ─────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `receipt_${Date.now()}${ext}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ─── Data Helpers ─────────────────────────────────────────────────────────────
const DATA_DIR = path.join(__dirname, 'data');

function readJSON(filename) {
  const fp = path.join(DATA_DIR, filename);
  if (!fs.existsSync(fp)) return [];
  try { return JSON.parse(fs.readFileSync(fp, 'utf8')); }
  catch { return []; }
}

function writeJSON(filename, data) {
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2));
}

function readAuth() {
  const fp = path.join(DATA_DIR, 'auth.json');
  return JSON.parse(fs.readFileSync(fp, 'utf8'));
}

function writeAuth(data) {
  fs.writeFileSync(path.join(DATA_DIR, 'auth.json'), JSON.stringify(data, null, 2));
}

// ─── Trust Score Calculator ───────────────────────────────────────────────────
function calculateTrustScore(customerId) {
  const transactions = readJSON('transactions.json');
  const customerTxns = transactions.filter(t => t.customerId === customerId && t.type === 'debit');
  
  if (customerTxns.length === 0) return 75; // New customer default

  let totalDebits = 0;
  let totalRepaid = 0;
  let onTimeCount = 0;
  let lateCount = 0;
  let totalDelayDays = 0;

  customerTxns.forEach(txn => {
    totalDebits += txn.amount;
    if (txn.repaidAmount) totalRepaid += txn.repaidAmount;
    if (txn.dueDate && txn.repaidAt) {
      const due = new Date(txn.dueDate);
      const repaid = new Date(txn.repaidAt);
      const delay = Math.floor((repaid - due) / (1000 * 60 * 60 * 24));
      if (delay <= 0) onTimeCount++;
      else { lateCount++; totalDelayDays += delay; }
    }
  });

  const repaymentRatio = totalDebits > 0 ? (totalRepaid / totalDebits) : 0;
  const totalDecisions = onTimeCount + lateCount;
  const onTimeRatio = totalDecisions > 0 ? (onTimeCount / totalDecisions) : 0.5;
  const avgDelay = lateCount > 0 ? (totalDelayDays / lateCount) : 0;
  const delayPenalty = Math.min(avgDelay * 0.5, 20);

  let score = Math.round(
    (repaymentRatio * 50) +
    (onTimeRatio * 30) +
    20 - delayPenalty
  );

  return Math.max(0, Math.min(100, score));
}

// ─── Auth Routes ──────────────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  const { phone, pin } = req.body;
  if (!phone || !pin) return res.status(400).json({ error: 'Phone and PIN required' });

  const users = readUsers();
  const user = users.find(u => u.phone === phone);
  if (!user) return res.status(401).json({ error: 'ভুল নম্বর বা PIN' });

  const match = await bcrypt.compare(pin, user.pin);
  if (!match) return res.status(401).json({ error: 'ভুল নম্বর বা PIN' });

  req.session.userId = user.id;
  req.session.userName = user.name;

  const auth = readAuth();
  res.json({ success: true, shopName: auth.shopName, ownerName: auth.ownerName, shops: auth.shops });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

app.get('/api/auth/check', (req, res) => {
  if (req.session && req.session.userId) {
    const auth = readAuth();
    return res.json({ loggedIn: true, shopName: auth.shopName, ownerName: auth.ownerName, shops: auth.shops });
  }
  res.json({ loggedIn: false });
});

app.post('/api/auth/change-pin', async (req, res) => {
  const { oldPin, newPin } = req.body;
  if (!oldPin || !newPin || newPin.length !== 4) 
    return res.status(400).json({ error: 'Invalid PIN format' });
  const auth = readAuth();
  const match = await bcrypt.compare(oldPin, auth.pin);
  if (!match) return res.status(401).json({ error: 'পুরনো PIN ভুল' });
  auth.pin = await bcrypt.hash(newPin, 10);
  writeAuth(auth);
  res.json({ success: true });
});

app.post('/api/auth/setup', async (req, res) => {
  const { shopName, ownerName, shops } = req.body;
  const auth = readAuth();
  if (shopName) auth.shopName = shopName;
  if (ownerName) auth.ownerName = ownerName;
  if (shops) auth.shops = shops;
  writeAuth(auth);
  res.json({ success: true, auth });
});

app.get('/api/auth/info', (req, res) => {
  const auth = readAuth();
  res.json({ shopName: auth.shopName, ownerName: auth.ownerName, shops: auth.shops });
});
// ─── Protect all routes below this line ──────────────
app.use('/api', checkAuth);

// ─── Customer Routes ──────────────────────────────────────────────────────────
app.get('/api/customers', (req, res) => {
  const customers = readJSON('customers.json');
  const transactions = readJSON('transactions.json');
  const { search, shop } = req.query;

  let result = customers.map(c => {
    const txns = transactions.filter(t => t.customerId === c.id);
    const totalCredit = txns.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
    const totalDebit = txns.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
    const balance = totalDebit - totalCredit;
    return { ...c, balance, totalCredit, totalDebit, trustScore: calculateTrustScore(c.id) };
  });

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q))
    );
  }
  if (shop) result = result.filter(c => c.shop === shop);

  res.json(result);
});

app.post('/api/customers', (req, res) => {
  const customers = readJSON('customers.json');
  const { name, phone, address, creditLimit, shop } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const customer = {
    id: uuidv4(),
    name,
    phone: phone || '',
    address: address || '',
    creditLimit: parseFloat(creditLimit) || 5000,
    shop: shop || 'প্রধান শাখা',
    trustScore: 75,
    createdAt: new Date().toISOString()
  };
  customers.push(customer);
  writeJSON('customers.json', customers);
  res.status(201).json(customer);
});

app.get('/api/customers/:id', (req, res) => {
  const customers = readJSON('customers.json');
  const customer = customers.find(c => c.id === req.params.id);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });
  const transactions = readJSON('transactions.json');
  const txns = transactions.filter(t => t.customerId === customer.id);
  const totalDebit = txns.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
  const totalCredit = txns.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  res.json({ ...customer, balance: totalDebit - totalCredit, totalDebit, totalCredit, trustScore: calculateTrustScore(customer.id) });
});

app.put('/api/customers/:id', (req, res) => {
  const customers = readJSON('customers.json');
  const idx = customers.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const { name, phone, address, creditLimit, shop } = req.body;
  customers[idx] = { ...customers[idx], name, phone, address, creditLimit: parseFloat(creditLimit) || customers[idx].creditLimit, shop };
  writeJSON('customers.json', customers);
  res.json(customers[idx]);
});

app.delete('/api/customers/:id', (req, res) => {
  let customers = readJSON('customers.json');
  customers = customers.filter(c => c.id !== req.params.id);
  writeJSON('customers.json', customers);
  let transactions = readJSON('transactions.json');
  transactions = transactions.filter(t => t.customerId !== req.params.id);
  writeJSON('transactions.json', transactions);
  res.json({ success: true });
});

// ─── Transaction Routes ───────────────────────────────────────────────────────
app.get('/api/customers/:id/transactions', (req, res) => {
  const transactions = readJSON('transactions.json');
  const txns = transactions
    .filter(t => t.customerId === req.params.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(txns);
});

app.get('/api/transactions', (req, res) => {
  const transactions = readJSON('transactions.json');
  const customers = readJSON('customers.json');
  const { date, shop } = req.query;

  let result = transactions.map(t => {
    const customer = customers.find(c => c.id === t.customerId);
    return { ...t, customerName: customer ? customer.name : 'অজানা', customerPhone: customer ? customer.phone : '' };
  });

  if (date) {
    result = result.filter(t => t.date.startsWith(date));
  }
  if (shop) {
    const shopCustomerIds = customers.filter(c => c.shop === shop).map(c => c.id);
    result = result.filter(t => shopCustomerIds.includes(t.customerId));
  }

  result.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(result);
});

app.post('/api/transactions', (req, res) => {
  const { customerId, type, amount, note, dueDate, shop } = req.body;
  if (!customerId || !type || !amount) 
    return res.status(400).json({ error: 'customerId, type, amount required' });
  
  const customers = readJSON('customers.json');
  const customer = customers.find(c => c.id === customerId);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });

  const transactions = readJSON('transactions.json');
  const txn = {
    id: uuidv4(),
    customerId,
    type, // 'debit' = customer owes, 'credit' = customer paid
    amount: parseFloat(amount),
    note: note || '',
    dueDate: dueDate || null,
    shop: shop || customer.shop || 'প্রধান শাখা',
    date: new Date().toISOString(),
    photo: null,
    repaidAmount: 0,
    repaidAt: null,
    reminded: false
  };

  transactions.push(txn);
  writeJSON('transactions.json', transactions);

  // If it's a credit (payment), mark corresponding debits as repaid
  if (type === 'credit') {
    let remaining = txn.amount;
    const pendingDebits = transactions
      .filter(t => t.customerId === customerId && t.type === 'debit' && (t.repaidAmount || 0) < t.amount)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    for (const debit of pendingDebits) {
      if (remaining <= 0) break;
      const outstanding = debit.amount - (debit.repaidAmount || 0);
      const toApply = Math.min(remaining, outstanding);
      const di = transactions.findIndex(t => t.id === debit.id);
      transactions[di].repaidAmount = (transactions[di].repaidAmount || 0) + toApply;
      if (transactions[di].repaidAmount >= transactions[di].amount) {
        transactions[di].repaidAt = new Date().toISOString();
      }
      remaining -= toApply;
    }
    writeJSON('transactions.json', transactions);
  }

  res.status(201).json(txn);
});

app.post('/api/transactions/:id/photo', upload.single('photo'), (req, res) => {
  const transactions = readJSON('transactions.json');
  const idx = transactions.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Transaction not found' });
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  transactions[idx].photo = `/uploads/${req.file.filename}`;
  writeJSON('transactions.json', transactions);
  res.json(transactions[idx]);
});

// ─── Dashboard Route ──────────────────────────────────────────────────────────
app.get('/api/dashboard', (req, res) => {
  const customers = readJSON('customers.json');
  const transactions = readJSON('transactions.json');
  const { shop } = req.query;

  let filteredCustomers = customers;
  let filteredTxns = transactions;

  if (shop) {
    filteredCustomers = customers.filter(c => c.shop === shop);
    const ids = filteredCustomers.map(c => c.id);
    filteredTxns = transactions.filter(t => ids.includes(t.customerId));
  }

  const totalDebit = filteredTxns.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
  const totalCredit = filteredTxns.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  let totalReceivable = 0;
  filteredCustomers.forEach(c => {
    const cTxns  = filteredTxns.filter(t => t.customerId === c.id);
    const debit  = cTxns.filter(t => t.type === 'debit') .reduce((s, t) => s + t.amount, 0);
    const credit = cTxns.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
    totalReceivable += Math.max(0, debit - credit);
  });

  const today = new Date();
  const overdue = filteredTxns.filter(t =>
    t.type === 'debit' && t.dueDate &&
    new Date(t.dueDate) < today &&
    (t.repaidAmount || 0) < t.amount
  );
  const overdueAmount = overdue.reduce((s, t) => s + (t.amount - (t.repaidAmount || 0)), 0);

  const highRisk = filteredCustomers.filter(c => calculateTrustScore(c.id) < 40).length;

  // This week's transactions
  const weekAgo = new Date(today - 7 * 24 * 60 * 60 * 1000);
  const weekTxns = filteredTxns.filter(t => new Date(t.date) > weekAgo);
  const weekCredit = weekTxns.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const weekDebit = weekTxns.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);

  res.json({
    totalCustomers: filteredCustomers.length,
    totalReceivable: Math.max(0, totalReceivable),
    totalPaid: totalCredit,
    totalDebit,
    overdueAmount,
    overdueCount: overdue.length,
    highRiskCustomers: highRisk,
    weeklyCredit: weekCredit,
    weeklyDebit: weekDebit,
    recentTransactions: filteredTxns
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map(t => {
        const c = customers.find(x => x.id === t.customerId);
        return { ...t, customerName: c ? c.name : 'অজানা' };
      })
  });
});

// ─── Monthly P&L Report ───────────────────────────────────────────────────────
app.get('/api/report/monthly', (req, res) => {
  const transactions = readJSON('transactions.json');
  const customers = readJSON('customers.json');
  const { year, shop } = req.query;
  const targetYear = parseInt(year) || new Date().getFullYear();

  let filteredTxns = transactions;
  if (shop) {
    const ids = customers.filter(c => c.shop === shop).map(c => c.id);
    filteredTxns = transactions.filter(t => ids.includes(t.customerId));
  }

  const months = Array.from({ length: 12 }, (_, i) => {
    const monthTxns = filteredTxns.filter(t => {
      const d = new Date(t.date);
      return d.getFullYear() === targetYear && d.getMonth() === i;
    });
    const debit = monthTxns.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
    const credit = monthTxns.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
    return {
      month: i + 1,
      monthName: new Date(targetYear, i).toLocaleString('bn-BD', { month: 'long' }),
      totalDebit: debit,
      totalCredit: credit,
      netFlow: credit - debit,
      transactionCount: monthTxns.length
    };
  });

  res.json({ year: targetYear, months });
});

// ─── Reminder Route ───────────────────────────────────────────────────────────
app.post('/api/reminders/send', (req, res) => {
  const { customerId, transactionId, message } = req.body;
  const customers = readJSON('customers.json');
  const transactions = readJSON('transactions.json');

  const customer = customers.find(c => c.id === customerId);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });

  // Mark as reminded
  if (transactionId) {
    const idx = transactions.findIndex(t => t.id === transactionId);
    if (idx !== -1) {
      transactions[idx].reminded = true;
      transactions[idx].reminderSentAt = new Date().toISOString();
      writeJSON('transactions.json', transactions);
    }
  }

  // Simulate SMS
  const smsLog = {
    to: customer.phone,
    name: customer.name,
    message: message || `প্রিয় ${customer.name}, আপনার বকেয়া পরিশোধ করুন। বিকাশ: 01XXXXXXXXX`,
    sentAt: new Date().toISOString(),
    status: 'simulated'
  };

  console.log('📱 SMS Simulated:', smsLog);
  res.json({ success: true, smsLog });
});

// ─── Data Backup ──────────────────────────────────────────────────────────────
app.get('/api/backup', (req, res) => {
  const customers = readJSON('customers.json');
  const transactions = readJSON('transactions.json');
  const auth = readAuth();
  const backup = {
    exportedAt: new Date().toISOString(),
    version: '1.0',
    customers,
    transactions,
    shopName: auth.shopName,
    ownerName: auth.ownerName,
    shops: auth.shops
  };
  res.setHeader('Content-Disposition', `attachment; filename=halkhata_backup_${Date.now()}.json`);
  res.setHeader('Content-Type', 'application/json');
  res.json(backup);
});

app.post('/api/restore', (req, res) => {
  const { customers, transactions } = req.body;
  if (customers) writeJSON('customers.json', customers);
  if (transactions) writeJSON('transactions.json', transactions);
  res.json({ success: true });
});

// ─── Overdue Check ────────────────────────────────────────────────────────────
app.get('/api/overdue', (req, res) => {
  const transactions = readJSON('transactions.json');
  const customers = readJSON('customers.json');
  const today = new Date();

  const overdue = transactions
    .filter(t =>
      t.type === 'debit' &&
      t.dueDate &&
      new Date(t.dueDate) < today &&
      (t.repaidAmount || 0) < t.amount
    )
    .map(t => {
      const c = customers.find(x => x.id === t.customerId);
      return {
        ...t,
        customerName: c ? c.name : 'অজানা',
        customerPhone: c ? c.phone : '',
        outstanding: t.amount - (t.repaidAmount || 0),
        daysOverdue: Math.floor((today - new Date(t.dueDate)) / (1000 * 60 * 60 * 24))
      };
    })
    .sort((a, b) => b.daysOverdue - a.daysOverdue);

  res.json(overdue);
});

// ─── Seed Demo Data ───────────────────────────────────────────────────────────
app.post('/api/seed', async (req, res) => {
  const demoCustomers = [
    { id: uuidv4(), name: 'রহিম মিয়া', phone: '01711223344', address: 'ধানমন্ডি, ঢাকা', creditLimit: 10000, shop: 'প্রধান শাখা', trustScore: 85, createdAt: new Date().toISOString() },
    { id: uuidv4(), name: 'করিম উদ্দিন', phone: '01811334455', address: 'মিরপুর, ঢাকা', creditLimit: 5000, shop: 'প্রধান শাখা', trustScore: 60, createdAt: new Date().toISOString() },
    { id: uuidv4(), name: 'ফাতেমা বেগম', phone: '01912445566', address: 'মোহাম্মদপুর, ঢাকা', creditLimit: 8000, shop: 'শাখা-২', trustScore: 90, createdAt: new Date().toISOString() },
    { id: uuidv4(), name: 'সালাম সাহেব', phone: '01615556677', address: 'উত্তরা, ঢাকা', creditLimit: 3000, shop: 'শাখা-২', trustScore: 35, createdAt: new Date().toISOString() },
  ];

  const now = new Date();
  const demoTxns = [
    { id: uuidv4(), customerId: demoCustomers[0].id, type: 'debit', amount: 2500, note: 'চাল, ডাল কিনেছেন', shop: 'প্রধান শাখা', dueDate: new Date(now - 5 * 86400000).toISOString(), date: new Date(now - 10 * 86400000).toISOString(), photo: null, repaidAmount: 2500, repaidAt: new Date(now - 6 * 86400000).toISOString(), reminded: false },
    { id: uuidv4(), customerId: demoCustomers[0].id, type: 'debit', amount: 1800, note: 'তেল, মশলা', shop: 'প্রধান শাখা', dueDate: new Date(now + 5 * 86400000).toISOString(), date: new Date(now - 3 * 86400000).toISOString(), photo: null, repaidAmount: 0, repaidAt: null, reminded: false },
    { id: uuidv4(), customerId: demoCustomers[1].id, type: 'debit', amount: 3200, note: 'মাসের বাজার', shop: 'প্রধান শাখা', dueDate: new Date(now - 15 * 86400000).toISOString(), date: new Date(now - 20 * 86400000).toISOString(), photo: null, repaidAmount: 1000, repaidAt: null, reminded: true },
    { id: uuidv4(), customerId: demoCustomers[2].id, type: 'debit', amount: 4500, note: 'বড় কেনাকাটা', shop: 'শাখা-২', dueDate: new Date(now + 10 * 86400000).toISOString(), date: new Date(now - 2 * 86400000).toISOString(), photo: null, repaidAmount: 4500, repaidAt: new Date(now - 1 * 86400000).toISOString(), reminded: false },
    { id: uuidv4(), customerId: demoCustomers[3].id, type: 'debit', amount: 1500, note: 'সাপ্তাহিক বাজার', shop: 'শাখা-২', dueDate: new Date(now - 30 * 86400000).toISOString(), date: new Date(now - 35 * 86400000).toISOString(), photo: null, repaidAmount: 0, repaidAt: null, reminded: false },
    { id: uuidv4(), customerId: demoCustomers[1].id, type: 'credit', amount: 1000, note: 'আংশিক পরিশোধ', shop: 'প্রধান শাখা', dueDate: null, date: new Date(now - 5 * 86400000).toISOString(), photo: null, repaidAmount: 0, repaidAt: null, reminded: false },
  ];

  writeJSON('customers.json', demoCustomers);
  writeJSON('transactions.json', demoTxns);

  const auth = readAuth();
  auth.shops = ['প্রধান শাখা', 'শাখা-২'];
  writeAuth(auth);

  res.json({ success: true, message: 'Demo data loaded' });
});

// ─── Serve Login Page ─────────────────────────────────────────────────────────
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   হালখাতা ডিজিটাল সার্ভার চালু       ║
║   Server running at:                   ║
║   http://localhost:${PORT}               ║
║   Default PIN: 1234                    ║
╚════════════════════════════════════════╝
  `);
});
