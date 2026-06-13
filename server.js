const express = require('express');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const db = require('./db');

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
  return db.prepare(`SELECT * FROM users ORDER BY datetime(createdAt) ASC`).all()
    .map(u => ({ ...u, pin: u.pinHash }));   // alias pinHash → pin for backward compat
}
function writeUsers(rows) {
  // Bulk-replace — used only by restore operations
  db.prepare(`DELETE FROM users`).run();
  const ins = db.prepare(`
    INSERT OR IGNORE INTO users (id, phone, name, pinHash, role, createdAt, updatedAt)
    VALUES (@id, @phone, @name, @pinHash, @role, @createdAt, @updatedAt)
  `);
  const now = new Date().toISOString();
  db.transaction(items => {
    for (const u of items) ins.run({
      id:        u.id        || u.phone,
      phone:     u.phone,
      name:      u.name      || '',
      pinHash:   u.pin       || u.pinHash || '',
      role:      u.role      || 'owner',
      createdAt: u.createdAt || now,
      updatedAt: u.updatedAt || now
    });
  })(rows);
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

function safeParseShops(raw) {
  if (!raw) return ['প্রধান শাখা'];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : ['প্রধান শাখা'];
  } catch {
    // Handle legacy comma-separated string just in case
    const arr = raw.split(',').map(s => s.trim()).filter(Boolean);
    return arr.length ? arr : ['প্রধান শাখা'];
  }
}

function readAuth() {
  const row = db.prepare(`SELECT * FROM app_settings WHERE id = 1`).get();
  if (!row) {
    return {
      shopName:  'আমার দোকান',
      ownerName: 'দোকান মালিক',
      shops:     ['প্রধান শাখা']
    };
  }
  return {
    shopName:  row.shopName  || 'আমার দোকান',
    ownerName: row.ownerName || 'দোকান মালিক',
    shops:     safeParseShops(row.shops)
  };
}
function writeAuth(data) {
  const now   = new Date().toISOString();
  const shops = Array.isArray(data.shops) && data.shops.length
    ? data.shops
    : ['প্রধান শাখা'];

  // Read existing row to preserve legacy pinHash if column still exists
  const existing = db.prepare(`SELECT * FROM app_settings WHERE id = 1`).get();
  const cols      = db.prepare(`PRAGMA table_info(app_settings)`).all().map(c => c.name);
  const hasPinCol = cols.includes('pinHash');

  if (hasPinCol) {
    // Temporarily include pinHash to satisfy NOT NULL constraint
    // Authentication is users.pinHash only — this value is unused for auth
    const safePinHash = existing?.pinHash
      || '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

    db.prepare(`
      INSERT INTO app_settings (id, shopName, ownerName, shops, pinHash, createdAt, updatedAt)
      VALUES (1, @shopName, @ownerName, @shops, @pinHash, @createdAt, @updatedAt)
      ON CONFLICT(id) DO UPDATE SET
        shopName  = excluded.shopName,
        ownerName = excluded.ownerName,
        shops     = excluded.shops,
        pinHash   = excluded.pinHash,
        updatedAt = excluded.updatedAt
    `).run({
      shopName:  data.shopName  || 'আমার দোকান',
      ownerName: data.ownerName || 'দোকান মালিক',
      shops:     JSON.stringify(shops),
      pinHash:   safePinHash,
      createdAt: existing?.createdAt || now,
      updatedAt: now
    });
  } else {
    // Clean schema — no pinHash column
    db.prepare(`
      INSERT INTO app_settings (id, shopName, ownerName, shops, createdAt, updatedAt)
      VALUES (1, @shopName, @ownerName, @shops, @createdAt, @updatedAt)
      ON CONFLICT(id) DO UPDATE SET
        shopName  = excluded.shopName,
        ownerName = excluded.ownerName,
        shops     = excluded.shops,
        updatedAt = excluded.updatedAt
    `).run({
      shopName:  data.shopName  || 'আমার দোকান',
      ownerName: data.ownerName || 'দোকান মালিক',
      shops:     JSON.stringify(shops),
      createdAt: existing?.createdAt || now,
      updatedAt: now
    });
  }
}

function readInventory() {
  return db.prepare(`SELECT * FROM inventory`).all();
}

function writeInventory(items) {
  // writeInventory is kept for interface compatibility but should not be
  // called in bulk — individual SQLite ops are used instead.
  // This bulk-replace is used only by restore/seed operations.
  db.prepare(`DELETE FROM inventory`).run();
  const ins = db.prepare(`
    INSERT INTO inventory
      (id, name, buyPrice, sellPrice, quantity, buyDate, expiryDate, supplierId, shop, createdAt)
    VALUES
      (@id, @name, @buyPrice, @sellPrice, @quantity, @buyDate, @expiryDate, @supplierId, @shop, @createdAt)
  `);
  db.transaction(rows => {
    for (const i of rows) ins.run({
      id:         i.id,
      name:       i.name        || '',
      buyPrice:   i.buyPrice    || 0,
      sellPrice:  i.sellPrice   || 0,
      quantity:   i.quantity    || 0,
      buyDate:    i.buyDate     || null,
      expiryDate: i.expiryDate  || null,
      supplierId: i.supplierId  || null,
      shop:       i.shop        || 'প্রধান শাখা',
      createdAt:  i.createdAt   || new Date().toISOString()
    });
  })(items);
}

function readSuppliers() {
  return db.prepare(`SELECT * FROM suppliers ORDER BY createdAt DESC`).all();
}

function writeSuppliers(rows) {
  // Bulk-replace used only by restore operations
  db.prepare(`DELETE FROM suppliers`).run();
  const ins = db.prepare(`
    INSERT OR IGNORE INTO suppliers (id, name, phone, address, createdAt)
    VALUES (@id, @name, @phone, @address, @createdAt)
  `);
  db.transaction(items => {
    for (const s of items) ins.run({
      id:        s.id,
      name:      s.name      || '',
      phone:     s.phone     || '',
      address:   s.address   || '',
      createdAt: s.createdAt || new Date().toISOString()
    });
  })(rows);
}

function readSupplierTxns() {
  return db.prepare(
    `SELECT * FROM supplier_transactions ORDER BY date DESC`
  ).all();
}

function writeSupplierTxns(rows) {
  // Bulk-replace — used only by restore operations
  db.prepare(`DELETE FROM supplier_transactions`).run();
  const ins = db.prepare(`
    INSERT OR IGNORE INTO supplier_transactions
      (id, supplierId, type, amount, note, date, createdAt)
    VALUES
      (@id, @supplierId, @type, @amount, @note, @date, @createdAt)
  `);
  db.transaction(items => {
    for (const t of items) ins.run({
      id:         t.id,
      supplierId: t.supplierId,
      type:       t.type,
      amount:     t.amount    || 0,
      note:       t.note      || '',
      date:       t.date      || new Date().toISOString(),
      createdAt:  t.createdAt || t.date || new Date().toISOString()
    });
  })(rows);
}

function readExpenses() {
  return db.prepare(`SELECT * FROM expenses ORDER BY date DESC`).all();
}

function writeExpenses(rows) {
  // Bulk-replace — used only by restore operations
  db.prepare(`DELETE FROM expenses`).run();
  const ins = db.prepare(`
    INSERT OR IGNORE INTO expenses
      (id, title, category, amount, shop, note, receiptPhoto, paymentMethod, date, createdAt)
    VALUES
      (@id, @title, @category, @amount, @shop, @note, @receiptPhoto, @paymentMethod, @date, @createdAt)
  `);
  db.transaction(items => {
    for (const e of items) ins.run({
      id:            e.id,
      title:         e.title         || '',
      category:      e.category      || 'Misc',
      amount:        e.amount        || 0,
      shop:          e.shop          || 'প্রধান শাখা',
      note:          e.note          || '',
      receiptPhoto:  e.receiptPhoto  || null,
      paymentMethod: e.paymentMethod || null,
      date:          e.date          || new Date().toISOString(),
      createdAt:     e.createdAt     || e.date || new Date().toISOString()
    });
  })(rows);
}

function readAccounts() {
  return db.prepare(`SELECT * FROM accounts ORDER BY datetime(createdAt) ASC`).all();
}

function writeAccounts(rows) {
  // Bulk-replace — used only by restore operations
  db.prepare(`DELETE FROM accounts`).run();
  const ins = db.prepare(`
    INSERT OR IGNORE INTO accounts (id, name, type, balance, createdAt)
    VALUES (@id, @name, @type, @balance, @createdAt)
  `);
  db.transaction(items => {
    for (const a of items) ins.run({
      id:        a.id,
      name:      a.name      || '',
      type:      a.type      || 'general',
      balance:   a.balance   || 0,
      createdAt: a.createdAt || new Date().toISOString()
    });
  })(rows);
}

// Helper: adjust account balance
function adjustAccount(accountId, delta, note = '', relatedType = null, relatedId = null) {
  if (!accountId || delta === 0) return;
  const account = db.prepare(`SELECT id FROM accounts WHERE id = ?`).get(accountId);
  if (!account) return;

  // Update balance
  db.prepare(`UPDATE accounts SET balance = balance + ? WHERE id = ?`).run(delta, accountId);

  // Log to account_transactions
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO account_transactions
      (id, accountId, type, amount, note, relatedType, relatedId, date, createdAt)
    VALUES
      (@id, @accountId, @type, @amount, @note, @relatedType, @relatedId, @date, @createdAt)
  `).run({
    id:          uuidv4(),
    accountId,
    type:        delta > 0 ? 'credit' : 'debit',
    amount:      Math.abs(delta),
    note,
    relatedType: relatedType || null,
    relatedId:   relatedId   || null,
    date:        now,
    createdAt:   now
  });
}

// ─── Trust Score Calculator ───────────────────────────────────────────────────
function calculateTrustScore(customerId) {
  const customerTxns = db.prepare(
    `SELECT * FROM transactions WHERE customerId = ? AND type = 'debit'`
  ).all(customerId);

  if (!customerTxns.length) return 75;

  let totalDebits = 0, totalRepaid = 0;
  let onTimeCount = 0, lateCount = 0, totalDelayDays = 0;

  customerTxns.forEach(txn => {
    totalDebits += txn.amount;
    if (txn.repaidAmount) totalRepaid += txn.repaidAmount;
    if (txn.dueDate && txn.repaidAt) {
      const delay = Math.floor(
        (new Date(txn.repaidAt) - new Date(txn.dueDate)) / (1000 * 60 * 60 * 24)
      );
      if (delay <= 0) onTimeCount++;
      else { lateCount++; totalDelayDays += delay; }
    }
  });

  const repaymentRatio = totalDebits > 0 ? (totalRepaid / totalDebits) : 0;
  const totalDecisions = onTimeCount + lateCount;
  const onTimeRatio    = totalDecisions > 0 ? (onTimeCount / totalDecisions) : 0.5;
  const avgDelay       = lateCount > 0 ? (totalDelayDays / lateCount) : 0;
  const delayPenalty   = Math.min(avgDelay * 0.5, 20);

  const score = Math.round((repaymentRatio * 50) + (onTimeRatio * 30) + 20 - delayPenalty);
  return Math.max(0, Math.min(100, score));
}

// ─── Auth Routes ──────────────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  const { phone, pin } = req.body;
  if (!phone || !pin) return res.status(400).json({ error: 'Phone and PIN required' });

  const user = db.prepare(`SELECT * FROM users WHERE phone = ?`).get(phone);
  if (!user) return res.status(401).json({ error: 'ভুল নম্বর বা PIN' });

  const match = await bcrypt.compare(String(pin), user.pinHash);
  if (!match) return res.status(401).json({ error: 'ভুল নম্বর বা PIN' });

  req.session.userId    = user.id;
  req.session.userPhone = user.phone;
  req.session.userName  = user.name;

  const row = db.prepare(`SELECT * FROM app_settings WHERE id = 1`).get();
  res.json({
    success:   true,
    userId:    user.id,
    userName:  user.name,
    shopName:  row ? (row.shopName  || 'আমার দোকান')  : 'আমার দোকান',
    ownerName: row ? (row.ownerName || 'দোকান মালিক')  : 'দোকান মালিক',
    shops:     row ? safeParseShops(row.shops)         : ['প্রধান শাখা']
  });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

app.get('/api/auth/check', (req, res) => {
  if (req.session && req.session.userId) {
    const row = db.prepare(`SELECT * FROM app_settings WHERE id = 1`).get();
    return res.json({
      loggedIn:  true,
      shopName:  row ? (row.shopName  || 'আমার দোকান')  : 'আমার দোকান',
      ownerName: row ? (row.ownerName || 'দোকান মালিক')  : 'দোকান মালিক',
      shops:     row ? safeParseShops(row.shops)         : ['প্রধান শাখা']
    });
  }
  res.json({ loggedIn: false });
});

app.post('/api/auth/change-pin', async (req, res) => {
  const { oldPin, newPin } = req.body;
  if (!oldPin || !newPin || String(newPin).length !== 4)
    return res.status(400).json({ error: 'Invalid PIN format' });

  const userId = req.session?.userId;
  if (!userId) return res.status(401).json({ error: 'Not logged in' });

  const user = db.prepare(`SELECT * FROM users WHERE id = ?`).get(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const match = await bcrypt.compare(String(oldPin), user.pinHash);
  if (!match) return res.status(401).json({ error: 'পুরানো PIN ভুল' });

  const hashed = await bcrypt.hash(String(newPin), 10);
  db.prepare(`UPDATE users SET pinHash = ?, updatedAt = ? WHERE id = ?`)
    .run(hashed, new Date().toISOString(), userId);

  // Explicitly do NOT touch app_settings here
  res.json({ success: true });
});

app.post('/api/auth/setup', (req, res) => {
  const { shopName, ownerName, shops } = req.body;
  const auth = readAuth();

  if (shopName  !== undefined && shopName.trim()  !== '') auth.shopName  = shopName.trim();
  if (ownerName !== undefined && ownerName.trim() !== '') auth.ownerName = ownerName.trim();

  if (shops !== undefined) {
    const newShops     = (Array.isArray(shops) ? shops : [shops]).map(s => s.trim()).filter(Boolean);
    const removedShops = auth.shops.filter(s => !newShops.includes(s));

    if (removedShops.length) {
      const placeholders = removedShops.map(() => '?').join(',');
      db.prepare(`UPDATE customers SET shop = 'প্রধান শাখা' WHERE shop IN (${placeholders})`).run(...removedShops);
      db.prepare(`UPDATE inventory  SET shop = 'প্রধান শাখা' WHERE shop IN (${placeholders})`).run(...removedShops);
      db.prepare(`UPDATE expenses   SET shop = 'প্রধান শাখা' WHERE shop IN (${placeholders})`).run(...removedShops);
    }

    auth.shops = newShops.length ? newShops : ['প্রধান শাখা'];
  }

  writeAuth(auth);

  // Sync ownerName → users table for the logged-in user
  if (ownerName !== undefined && ownerName.trim() !== '' && req.session?.userId) {
    db.prepare(`UPDATE users SET name = ?, updatedAt = ? WHERE id = ?`)
      .run(ownerName.trim(), new Date().toISOString(), req.session.userId);
    req.session.userName = ownerName.trim();
  }

  res.json({
    success:   true,
    shopName:  auth.shopName,
    ownerName: auth.ownerName,
    shops:     auth.shops
  });
});
app.get('/api/auth/info', (req, res) => {
  const row = db.prepare(`SELECT * FROM app_settings WHERE id = 1`).get();
  if (!row) return res.json({ shopName: 'আমার দোকান', ownerName: 'দোকান মালিক', shops: ['প্রধান শাখা'] });

  res.json({
    shopName:  row.shopName  || 'আমার দোকান',
    ownerName: row.ownerName || 'দোকান মালিক',
    shops:     safeParseShops(row.shops)
  });
});
// ─── Protect all routes below this line ──────────────
app.use('/api', checkAuth);

// ─── Customer Routes ──────────────────────────────────────────────────────────
app.get('/api/customers', (req, res) => {
  const { search, shop } = req.query;

  let query  = `SELECT * FROM customers WHERE 1=1`;
  const args = [];

  if (search) {
    query += ` AND (name LIKE ? OR phone LIKE ?)`;
    args.push(`%${search}%`, `%${search}%`);
  }
  if (shop) {
    query += ` AND shop = ?`;
    args.push(shop);
  }

  const customers = db.prepare(query).all(...args);

  const result = customers.map(c => {
    const txns       = db.prepare(`SELECT * FROM transactions WHERE customerId = ?`).all(c.id);
    const totalDebit  = txns.filter(t => t.type === 'debit') .reduce((s, t) => s + t.amount, 0);
    const totalCredit = txns.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
    const balance     = totalDebit - totalCredit;
    return { ...c, balance, totalDebit, totalCredit, trustScore: calculateTrustScore(c.id) };
  });

  res.json(result);
});

app.post('/api/customers', (req, res) => {
  const { name, phone, address, creditLimit, shop } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  const customer = {
    id:          require('uuid').v4(),
    name,
    phone:       phone       || '',
    address:     address     || '',
    creditLimit: parseFloat(creditLimit) || 5000,
    shop:        shop        || 'প্রধান শাখা',
    trustScore:  75,
    createdAt:   new Date().toISOString()
  };

  db.prepare(`
    INSERT INTO customers (id, name, phone, address, creditLimit, shop, trustScore, createdAt)
    VALUES (@id, @name, @phone, @address, @creditLimit, @shop, @trustScore, @createdAt)
  `).run(customer);

  res.status(201).json(customer);
});

app.get('/api/customers/:id', (req, res) => {
  const customer = db.prepare(`SELECT * FROM customers WHERE id = ?`).get(req.params.id);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });

  const txns        = db.prepare(`SELECT * FROM transactions WHERE customerId = ?`).all(customer.id);
  const totalDebit  = txns.filter(t => t.type === 'debit') .reduce((s, t) => s + t.amount, 0);
  const totalCredit = txns.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);

  res.json({
    ...customer,
    balance:     totalDebit - totalCredit,
    totalDebit,
    totalCredit,
    trustScore:  calculateTrustScore(customer.id)
  });
});

// ─── Customer Analytics ───────────────────────────────
app.get('/api/customers/:id/analytics', (req, res) => {
  const customer = db.prepare(`SELECT * FROM customers WHERE id = ?`).get(req.params.id);
  if (!customer) return res.status(404).json({ error: 'Not found' });

  const txns = db.prepare(
    `SELECT * FROM transactions WHERE customerId = ? ORDER BY date ASC`
  ).all(req.params.id);

  // ── Classify transactions ─────────────────────────────
  const debits   = txns.filter(t => t.type === 'debit');       // credit sales (customer owes)
  const credits  = txns.filter(t => t.type === 'credit');      // repayments received
  const cashSales = txns.filter(t => t.type === 'cash_sale');  // instant cash sales

  // ── Total Purchases ───────────────────────────────────
  // ALL product purchases historically — cash + credit sales
  const totalDebitAmt    = debits.reduce((s, t) => s + t.amount, 0);
  const totalCashSaleAmt = cashSales.reduce((s, t) => s + t.amount, 0);
  const totalPurchaseAmt = totalDebitAmt + totalCashSaleAmt;

  // ── Total Paid ────────────────────────────────────────
  // Cash sales (paid instantly) + credit repayments received
  const totalRepayments = credits.reduce((s, t) => s + t.amount, 0);
  const totalPaid       = totalCashSaleAmt + totalRepayments;

  // ── Current Due ───────────────────────────────────────
  // Only from credit sales minus repayments — cash sales never create dues
  const currentDue = Math.max(0, totalDebitAmt - totalRepayments);

  // ── Repayment percentage ──────────────────────────────
  // How much of the credit (debit) sales has been repaid
  const repaymentPct = totalDebitAmt > 0
    ? Math.min(100, Math.round((totalRepayments / totalDebitAmt) * 100))
    : 100;

  // ── Overdue count ─────────────────────────────────────
  const today = new Date();
  const overdueCount = debits.filter(t =>
    t.dueDate &&
    new Date(t.dueDate) < today &&
    (t.repaidAmount || 0) < t.amount
  ).length;

  // ── Average purchase amount ───────────────────────────
  // Based on all purchase events (debit + cash_sale)
  const purchaseEvents = debits.length + cashSales.length;
  const avgTxnAmount   = purchaseEvents > 0
    ? Math.round(totalPurchaseAmt / purchaseEvents)
    : 0;

  // ── Most bought product ───────────────────────────────
  const productCounts = {};
  [...debits, ...cashSales].forEach(t => {
    if (t.productName) {
      productCounts[t.productName] =
        (productCounts[t.productName] || 0) + (t.soldQuantity || 1);
    }
  });
  const mostBought = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])[0] || null;

  // ── Last transaction date ─────────────────────────────
  const lastTxn = txns.length ? txns[txns.length - 1] : null;

  // ── Running balance timeline ──────────────────────────
  // Balance = cumulative debit - cumulative credit
  // cash_sale does NOT affect running balance (paid instantly)
  let runningBalance = 0;
  const timeline = txns.map(t => {
    if (t.type === 'debit')      runningBalance += t.amount;
    if (t.type === 'credit')     runningBalance  = Math.max(0, runningBalance - t.amount);
    // cash_sale: no balance change
    return {
      ...t,
      balanceAfter: runningBalance
    };
  }).reverse(); // most recent first

  res.json({
    customer: {
      ...customer,
      trustScore: calculateTrustScore(customer.id)
    },
    stats: {
      totalPurchaseAmt,   // debit + cash_sale combined
      totalDebitAmt,      // credit sales only
      totalCashSaleAmt,   // cash sales only
      totalPaid,          // cash_sale + repayments
      totalRepayments,    // repayments only
      currentDue,         // debit - repayments
      txnCount:      txns.length,
      debitCount:    debits.length,
      creditCount:   credits.length,
      cashSaleCount: cashSales.length,
      purchaseEvents,
      repaymentPct,
      avgTxnAmount,
      overdueCount,
      mostBought:    mostBought ? { name: mostBought[0], qty: mostBought[1] } : null,
      lastTxnDate:   lastTxn ? lastTxn.date : null
    },
    timeline
  });
});

app.put('/api/customers/:id', (req, res) => {
  const existing = db.prepare(`SELECT * FROM customers WHERE id = ?`).get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });

  const { name, phone, address, creditLimit, shop } = req.body;
  db.prepare(`
    UPDATE customers SET name=@name, phone=@phone, address=@address,
      creditLimit=@creditLimit, shop=@shop WHERE id=@id
  `).run({
    id: req.params.id, name, phone, address,
    creditLimit: parseFloat(creditLimit) || existing.creditLimit,
    shop
  });

  res.json(db.prepare(`SELECT * FROM customers WHERE id = ?`).get(req.params.id));
});

app.delete('/api/customers/:id', (req, res) => {
  // CASCADE deletes transactions too (FK enabled in db.js)
  db.prepare(`DELETE FROM customers WHERE id = ?`).run(req.params.id);
  res.json({ success: true });
});

// ─── Transaction Routes ───────────────────────────────────────────────────────
app.get('/api/customers/:id/transactions', (req, res) => {
  const txns = db.prepare(
    `SELECT * FROM transactions WHERE customerId = ? ORDER BY date DESC`
  ).all(req.params.id);
  res.json(txns.map(t => ({ ...t, reminded: !!t.reminded })));
});

app.get('/api/transactions', (req, res) => {
  const { date, shop } = req.query;
  const customers = db.prepare(`SELECT * FROM customers`).all();

  let query  = `SELECT * FROM transactions WHERE 1=1`;
  const args = [];

  if (date) { query += ` AND date LIKE ?`;  args.push(`${date}%`); }
  if (shop) {
    const ids = customers.filter(c => c.shop === shop).map(c => c.id);
    if (!ids.length) return res.json([]);
    query += ` AND customerId IN (${ids.map(() => '?').join(',')})`;
    args.push(...ids);
  }

  query += ` ORDER BY date DESC`;
  const txns = db.prepare(query).all(...args);

  res.json(txns.map(t => {
    const c = customers.find(x => x.id === t.customerId);
    return { ...t, reminded: !!t.reminded, customerName: c ? c.name : 'অজানা', customerPhone: c ? c.phone : '' };
  }));
});

app.post('/api/transactions', (req, res) => {
  const { customerId, type, amount, note, dueDate, shop } = req.body;
  if (!customerId || !type || !amount)
    return res.status(400).json({ error: 'customerId, type, amount required' });

  const customer = db.prepare(`SELECT * FROM customers WHERE id = ?`).get(customerId);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });

  const txn = {
    id:            uuidv4(),
    customerId,
    type,
    amount:        parseFloat(amount),
    note:          note || '',
    dueDate:       dueDate || null,
    shop:          shop || customer.shop || 'প্রধান শাখা',
    date:          new Date().toISOString(),
    photo:         null,
    repaidAmount:  0,
    repaidAt:      null,
    reminded:      0,
    inventoryId:   req.body.inventoryId   || null,
    productName:   req.body.productName   || null,
    soldQuantity:  req.body.soldQuantity  ? parseInt(req.body.soldQuantity) : null,
    paymentMethod: req.body.paymentMethod || null,
    saleType:      req.body.saleType      || null
  };

  db.prepare(`
    INSERT INTO transactions
      (id, customerId, type, amount, note, dueDate, shop, date,
       photo, repaidAmount, repaidAt, reminded,
       inventoryId, productName, soldQuantity, paymentMethod, saleType)
    VALUES
      (@id, @customerId, @type, @amount, @note, @dueDate, @shop, @date,
       @photo, @repaidAmount, @repaidAt, @reminded,
       @inventoryId, @productName, @soldQuantity, @paymentMethod, @saleType)
  `).run(txn);

  // Inventory deduction
  if (req.body.inventoryId && req.body.soldQuantity) {
    const deductQty = parseInt(req.body.soldQuantity);
    db.prepare(`
      UPDATE inventory SET quantity = MAX(0, quantity - ?) WHERE id = ?
    `).run(deductQty, req.body.inventoryId);
  }

  // Account balance: credit received → increase account
  if (type === 'credit' && req.body.paymentMethod) {
    adjustAccount(
      req.body.paymentMethod,
      parseFloat(amount),
      `খদ্দের পরিশোধ: ${customer.name}`,
      'transaction',
      txn.id
    );
  }

  // Apply credit repayment to oldest unpaid debits
  if (type === 'credit') {
    let remaining = parseFloat(amount);
    const pendingDebits = db.prepare(`
      SELECT * FROM transactions
      WHERE customerId = ? AND type = 'debit' AND repaidAmount < amount
      ORDER BY date ASC
    `).all(customerId);

    const updateRepaid = db.prepare(`
      UPDATE transactions SET repaidAmount = @repaidAmount, repaidAt = @repaidAt WHERE id = @id
    `);

    const applyRepayments = db.transaction(() => {
      for (const debit of pendingDebits) {
        if (remaining <= 0) break;
        const outstanding = debit.amount - (debit.repaidAmount || 0);
        const toApply     = Math.min(remaining, outstanding);
        const newRepaid   = (debit.repaidAmount || 0) + toApply;
        updateRepaid.run({
          id:           debit.id,
          repaidAmount: newRepaid,
          repaidAt:     newRepaid >= debit.amount ? new Date().toISOString() : null
        });
        remaining -= toApply;
      }
    });
    applyRepayments();
  }

  res.status(201).json({ ...txn, reminded: false });
});

app.post('/api/transactions/:id/photo', upload.single('photo'), (req, res) => {
  const txn = db.prepare(`SELECT * FROM transactions WHERE id = ?`).get(req.params.id);
  if (!txn)     return res.status(404).json({ error: 'Transaction not found' });
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const photoPath = `/uploads/${req.file.filename}`;
  db.prepare(`UPDATE transactions SET photo = ? WHERE id = ?`).run(photoPath, req.params.id);
  res.json({ ...txn, photo: photoPath });
});

// ─── Product Sale Route ───────────────────────────────
// Handles inventory deduction + optional debit creation
app.post('/api/sales', async (req, res) => {
  const { customerId, inventoryId, soldQuantity, amount, paymentMode,
          note, dueDate, shop, paymentMethod } = req.body;

  if (!customerId || !inventoryId || !soldQuantity || !amount)
    return res.status(400).json({ error: 'customerId, inventoryId, soldQuantity, amount required' });

  // ── Customer from SQLite ──────────────────────────────
  const customer = db.prepare(`SELECT * FROM customers WHERE id = ?`).get(customerId);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });

  const invItem = db.prepare(`SELECT * FROM inventory WHERE id = ?`).get(inventoryId);
  if (!invItem) return res.status(404).json({ error: 'Inventory item not found' });

  const qty = parseInt(soldQuantity);
  if (invItem.quantity < qty)
    return res.status(400).json({ error: 'Insufficient stock' });

  // 1. Deduct inventory
  db.prepare(`UPDATE inventory SET quantity = quantity - ? WHERE id = ?`).run(qty, inventoryId);

  // 2. Build base txn shape
// baseTxn — replace inventory[itemIdx].name with invItem.name
  const baseTxn = {
    id:            uuidv4(),
    customerId,
    amount:        parseFloat(amount),
    note:          note || invItem.name,
    dueDate:       null,
    shop:          shop || customer.shop || 'প্রধান শাখা',
    date:          new Date().toISOString(),
    photo:         null,
    repaidAmount:  0,
    repaidAt:      null,
    reminded:      0,
    inventoryId,
    productName:   invItem.name,
    soldQuantity:  qty,
    paymentMethod: paymentMethod || null,
    saleType:      paymentMode
  };

  // 3. Insert into SQLite
  if (paymentMode === 'credit') {
    const txn = { ...baseTxn, type: 'debit', dueDate: dueDate || null };
    db.prepare(`
      INSERT INTO transactions
        (id, customerId, type, amount, note, dueDate, shop, date,
         photo, repaidAmount, repaidAt, reminded,
         inventoryId, productName, soldQuantity, paymentMethod, saleType)
      VALUES
        (@id, @customerId, @type, @amount, @note, @dueDate, @shop, @date,
         @photo, @repaidAmount, @repaidAt, @reminded,
         @inventoryId, @productName, @soldQuantity, @paymentMethod, @saleType)
    `).run(txn);
    const updatedItem = db.prepare(`SELECT quantity FROM inventory WHERE id = ?`).get(inventoryId);
    res.status(201).json({ success: true, txn: { ...txn, reminded: false }, updatedStock: updatedItem.quantity });
  }

  if (paymentMode === 'cash') {
    const txn = { ...baseTxn, type: 'cash_sale', repaidAmount: parseFloat(amount), repaidAt: new Date().toISOString() };
    db.prepare(`
      INSERT INTO transactions
        (id, customerId, type, amount, note, dueDate, shop, date,
         photo, repaidAmount, repaidAt, reminded,
         inventoryId, productName, soldQuantity, paymentMethod, saleType)
      VALUES
        (@id, @customerId, @type, @amount, @note, @dueDate, @shop, @date,
         @photo, @repaidAmount, @repaidAt, @reminded,
         @inventoryId, @productName, @soldQuantity, @paymentMethod, @saleType)
    `).run(txn);

    // Cash received → increase account
    if (paymentMode === 'cash' && paymentMethod) {
      adjustAccount(
        paymentMethod,
        parseFloat(amount),
        `নগদ বিক্রি: ${invItem.name}`,
        'sale',
        baseTxn.id
      );
    }

    // Auto-expense if requested
    if (req.body.createExpense) {
      const now = new Date().toISOString();
      db.prepare(`
        INSERT INTO expenses
          (id, title, category, amount, shop, note, receiptPhoto, paymentMethod, date, createdAt)
        VALUES
          (@id, @title, @category, @amount, @shop, @note, @receiptPhoto, @paymentMethod, @date, @createdAt)
      `).run({
        id:            uuidv4(),
        title:         `পণ্য কিনলাম: ${invItem.name}`,
        category:      'Supplier Purchase',
        amount:        parseFloat(amount),
        shop:          shop || 'প্রধান শাখা',
        note:          `${qty} × ৳${invItem.buyPrice}`,
        receiptPhoto:  null,
        paymentMethod: paymentMethod || null,
        date:          now,
        createdAt:     now
      });
    }

    const updatedItem = db.prepare(`SELECT quantity FROM inventory WHERE id = ?`).get(inventoryId);
    res.status(201).json({ success: true, txn: { ...txn, reminded: false }, updatedStock: updatedItem.quantity });
  }
});
// ─── Dashboard Route ──────────────────────────────────────────────────────────
app.get('/api/dashboard', (req, res) => {
  const customers    = db.prepare(`SELECT * FROM customers`).all();
  const transactions = db.prepare(`SELECT * FROM transactions`).all();
  const { shop } = req.query;

  let filteredCustomers = customers;
  let filteredTxns = transactions;

  if (shop) {
    filteredCustomers = customers.filter(c => c.shop === shop);
    const ids = filteredCustomers.map(c => c.id);
    filteredTxns = transactions.filter(t => ids.includes(t.customerId));
  }

  const totalDebit  = filteredTxns.filter(t => t.type === 'debit') .reduce((s, t) => s + t.amount, 0);
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
  const accounts = db.prepare(`SELECT * FROM accounts ORDER BY datetime(createdAt) ASC`).all();

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
    accounts,
    recentTransactions: filteredTxns
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map(t => {
        const c = db.prepare(`SELECT name FROM customers WHERE id = ?`).get(t.customerId);
        return { ...t, reminded: !!t.reminded, customerName: c ? c.name : 'অজানা' };
      })
  });
});

// ─── Monthly P&L Report ───────────────────────────────────────────────────────
app.get('/api/report/monthly', (req, res) => {
  const transactions = db.prepare(`SELECT * FROM transactions`).all();
  const customers    = db.prepare(`SELECT * FROM customers`).all();
  const { year, shop } = req.query;
  const targetYear   = parseInt(year) || new Date().getFullYear();

  let expQuery = `SELECT * FROM expenses WHERE strftime('%Y', date) = ?`;
  const expArgs = [String(targetYear)];

  if (shop) {
    expQuery += ` AND shop = ?`; expArgs.push(shop); }
  const expenses = db.prepare(expQuery).all(...expArgs);

  let filteredTxns     = transactions;
  let filteredExpenses = expenses;

  if (shop) {
    const ids = customers.filter(c => c.shop === shop).map(c => c.id);
    filteredTxns     = transactions.filter(t => ids.includes(t.customerId));
    filteredExpenses = expenses.filter(e => e.shop === shop);
  }

  const months = Array.from({ length: 12 }, (_, i) => {
    const monthTxns = filteredTxns.filter(t => {
      const d = new Date(t.date);
      return d.getFullYear() === targetYear && d.getMonth() === i;
    });
    const monthExp = filteredExpenses.filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === targetYear && d.getMonth() === i;
    });

    const debit    = monthTxns.filter(t => t.type === 'debit')    .reduce((s, t) => s + t.amount, 0);
    const credit   = monthTxns.filter(t => t.type === 'credit')   .reduce((s, t) => s + t.amount, 0);
    const cashSale = monthTxns.filter(t => t.type === 'cash_sale').reduce((s, t) => s + t.amount, 0);
    const totalExpense = monthExp.reduce((s, e) => s + e.amount, 0);
    const revenue  = credit + cashSale;   // actual money received
    const profit   = revenue - totalExpense;

    // Category breakdown
    const byCategory = {};
    monthExp.forEach(e => {
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
    });

    return {
      month:            i + 1,
      monthName:        new Date(targetYear, i).toLocaleString('bn-BD', { month: 'long' }),
      totalDebit:       debit,
      totalCredit:      credit,
      cashSales:        cashSale,
      totalRevenue:     revenue,
      totalExpense,
      profit,
      transactionCount: monthTxns.length,
      expenseCount:     monthExp.length,
      byCategory
    };
  });

  res.json({ year: targetYear, months });
});

// ─── Detailed Monthly Report ──────────────────────────
app.get('/api/report/monthly/:year/:month', (req, res) => {
  const year  = parseInt(req.params.year);
  const month = parseInt(req.params.month);
  if (isNaN(year) || isNaN(month) || month < 1 || month > 12)
    return res.status(400).json({ error: 'Invalid year or month' });

  const { shop } = req.query;

  // ── Date range ────────────────────────────────────────
  const dateFrom    = `${year}-${String(month).padStart(2,'0')}-01`;
  const lastDay     = new Date(year, month, 0).getDate();
  const dateTo      = `${year}-${String(month).padStart(2,'0')}-${String(lastDay).padStart(2,'0')}`;
  const tsFrom      = `${dateFrom}T00:00:00.000Z`;
  const tsTo        = `${dateTo}T23:59:59.999Z`;

  // ── Load customers ────────────────────────────────────
  const allCustomers = db.prepare(`SELECT * FROM customers`).all();
  let scopedIds      = allCustomers.map(c => c.id);
  if (shop) {
    scopedIds = allCustomers.filter(c => c.shop === shop).map(c => c.id);
    if (!scopedIds.length) return res.json(emptyMonthReport(year, month));
  }

  const idPlaceholders = scopedIds.map(() => '?').join(',');

  // ── Transactions this month ───────────────────────────
  const monthTxns = db.prepare(`
    SELECT * FROM transactions
    WHERE date >= ? AND date <= ?
    AND customerId IN (${idPlaceholders})
    ORDER BY date ASC
  `).all(tsFrom, tsTo, ...scopedIds);

  // ── ALL-TIME transactions for due/overdue calculation ─
  const allTimeTxns = db.prepare(`
    SELECT * FROM transactions
    WHERE customerId IN (${idPlaceholders})
  `).all(...scopedIds);

  // ── Expenses this month ───────────────────────────────
  let expQuery = `SELECT * FROM expenses WHERE date >= ? AND date <= ?`;
  const expArgs = [tsFrom, tsTo];
  if (shop) { expQuery += ` AND shop = ?`; expArgs.push(shop); }
  const monthExpenses = db.prepare(expQuery).all(...expArgs);

  // ── Classify month transactions ───────────────────────
  const debits    = monthTxns.filter(t => t.type === 'debit');
  const credits   = monthTxns.filter(t => t.type === 'credit');
  const cashSales = monthTxns.filter(t => t.type === 'cash_sale');

  // ── Core financials ───────────────────────────────────
  const creditSalesAmt  = debits.reduce((s, t) => s + t.amount, 0);
  const cashSalesAmt    = cashSales.reduce((s, t) => s + t.amount, 0);
  const collectionsAmt  = credits.reduce((s, t) => s + t.amount, 0);
  const totalRevenue    = cashSalesAmt + collectionsAmt;
  const totalExpense    = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const netProfit       = totalRevenue - totalExpense;

  // ── Current due (all-time scope) ──────────────────────
  // Per customer: sum(debit) - sum(credit) — cash_sale never creates due
  let totalCurrentDue = 0;
  scopedIds.forEach(cid => {
    const cTxns      = allTimeTxns.filter(t => t.customerId === cid);
    const cDebit     = cTxns.filter(t => t.type === 'debit') .reduce((s,t) => s + t.amount, 0);
    const cCredit    = cTxns.filter(t => t.type === 'credit').reduce((s,t) => s + t.amount, 0);
    totalCurrentDue += Math.max(0, cDebit - cCredit);
  });

  // ── Overdue (all-time unpaid debits with expired due dates) ──
  const today      = new Date().toISOString();
  const overdueAmt = allTimeTxns
    .filter(t =>
      t.type === 'debit' &&
      t.dueDate &&
      t.dueDate < today &&
      (t.repaidAmount || 0) < t.amount
    )
    .reduce((s, t) => s + (t.amount - (t.repaidAmount || 0)), 0);

  // ── Payment method breakdown ──────────────────────────
  const paymentBreakdown = {};
  [...credits, ...cashSales].forEach(t => {
    const m = t.paymentMethod || 'unspecified';
    paymentBreakdown[m] = (paymentBreakdown[m] || 0) + t.amount;
  });

  // ── Payment method: received vs spent ─────────────────
  const PAYMENT_METHODS = ['cash', 'bkash', 'nagad', 'rocket', 'bank'];

  const paymentAnalytics = {};
  PAYMENT_METHODS.forEach(m => {
    paymentAnalytics[m] = { received: 0, spent: 0, net: 0 };
  });
  paymentAnalytics['unspecified'] = { received: 0, spent: 0, net: 0 };

  // Received: cash sales + credit repayments
  [...cashSales, ...credits].forEach(t => {
    const m = t.paymentMethod || 'unspecified';
    if (!paymentAnalytics[m]) paymentAnalytics[m] = { received: 0, spent: 0, net: 0 };
    paymentAnalytics[m].received += t.amount;
  });

  // Spent: expenses
  monthExpenses.forEach(e => {
    const m = e.paymentMethod || 'unspecified';
    if (!paymentAnalytics[m]) paymentAnalytics[m] = { received: 0, spent: 0, net: 0 };
    paymentAnalytics[m].spent += e.amount;
  });

  // Net per method
  Object.keys(paymentAnalytics).forEach(m => {
    paymentAnalytics[m].net =
      paymentAnalytics[m].received - paymentAnalytics[m].spent;
  });

  // Remove zero-activity methods from response
  const paymentAnalyticsFinal = Object.fromEntries(
    Object.entries(paymentAnalytics)
      .filter(([, v]) => v.received > 0 || v.spent > 0)
  );

  // ── Expense category analytics ────────────────────────
  const EXPENSE_CATEGORIES = [
    'Supplier Purchase', 'Salary', 'Transportation',
    'Electricity', 'Rent', 'Internet',
    'Repair', 'Tax', 'Packaging', 'Misc'
  ];

  const expCategoryAnalytics = {};
  EXPENSE_CATEGORIES.forEach(cat => {
    expCategoryAnalytics[cat] = { amount: 0, count: 0, pct: 0 };
  });

  monthExpenses.forEach(e => {
    const cat = e.category || 'Misc';
    if (!expCategoryAnalytics[cat])
      expCategoryAnalytics[cat] = { amount: 0, count: 0, pct: 0 };
    expCategoryAnalytics[cat].amount += e.amount;
    expCategoryAnalytics[cat].count  += 1;
  });

  // Calculate percentage of total expenses
  Object.keys(expCategoryAnalytics).forEach(cat => {
    expCategoryAnalytics[cat].pct = totalExpense > 0
      ? Math.round((expCategoryAnalytics[cat].amount / totalExpense) * 100)
      : 0;
  });

  // Only return categories that have data
  const expCategoryAnalyticsFinal = Object.fromEntries(
    Object.entries(expCategoryAnalytics)
      .filter(([, v]) => v.amount > 0)
      .sort(([, a], [, b]) => b.amount - a.amount)
  );

  // ── Product stats ─────────────────────────────────────
  const productMap = {};
  [...debits, ...cashSales].forEach(t => {
    if (!t.productName) return;
    if (!productMap[t.productName])
      productMap[t.productName] = { name: t.productName, qty: 0, revenue: 0, txnCount: 0 };
    productMap[t.productName].qty      += (t.soldQuantity || 1);
    productMap[t.productName].revenue  += t.amount;
    productMap[t.productName].txnCount += 1;
  });
  const productStats = Object.values(productMap).sort((a,b) => b.revenue - a.revenue);

  // ── Customer stats ────────────────────────────────────
  const customerMap = {};
  monthTxns.forEach(t => {
    const c = allCustomers.find(x => x.id === t.customerId);
    if (!customerMap[t.customerId])
      customerMap[t.customerId] = {
        id: t.customerId, name: c ? c.name : 'অজানা',
        purchased: 0, paid: 0, txnCount: 0
      };
    if (t.type === 'debit' || t.type === 'cash_sale') customerMap[t.customerId].purchased += t.amount;
    if (t.type === 'credit' || t.type === 'cash_sale') customerMap[t.customerId].paid     += t.amount;
    customerMap[t.customerId].txnCount += 1;
  });
  const customerStats = Object.values(customerMap)
    .sort((a,b) => b.purchased - a.purchased)
    .slice(0, 10);

  // ── Expense category breakdown ────────────────────────
  const expCategoryMap = {};
  monthExpenses.forEach(e => {
    expCategoryMap[e.category] = (expCategoryMap[e.category] || 0) + e.amount;
  });
  const expenseByCategory = Object.entries(expCategoryMap)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a,b) => b.amount - a.amount);

  // ── Daily cash flow ───────────────────────────────────
  // Build a row for every calendar day in the month
  const dailyMap = {};
  for (let d = 1; d <= lastDay; d++) {
    const key = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    dailyMap[key] = {
      date:       key,
      cashSales:  0,
      collections:0,
      creditSales:0,
      revenue:    0,
      expenses:   0,
      profit:     0,
      txnCount:   0,
      expCount:   0
    };
  }

  monthTxns.forEach(t => {
    const key = t.date.split('T')[0];
    if (!dailyMap[key]) return;
    if (t.type === 'cash_sale')  { dailyMap[key].cashSales   += t.amount; dailyMap[key].revenue += t.amount; }
    if (t.type === 'credit')     { dailyMap[key].collections += t.amount; dailyMap[key].revenue += t.amount; }
    if (t.type === 'debit')      { dailyMap[key].creditSales += t.amount; }
    dailyMap[key].txnCount += 1;
  });

  monthExpenses.forEach(e => {
    const key = e.date.split('T')[0];
    if (!dailyMap[key]) return;
    dailyMap[key].expenses += e.amount;
    dailyMap[key].expCount += 1;
  });

  Object.values(dailyMap).forEach(d => {
    d.profit = d.revenue - d.expenses;
  });

  const dailyBreakdown = Object.values(dailyMap);

  // ── Cumulative running totals (for future charts) ─────
  let runRevenue = 0, runExpense = 0, runProfit = 0;
  const cumulativeFlow = dailyBreakdown.map(d => {
    runRevenue += d.revenue;
    runExpense += d.expenses;
    runProfit  += d.profit;
    return { date: d.date, revenue: runRevenue, expense: runExpense, profit: runProfit };
  });

  // ── Extended product analytics ────────────────────────
  // Already have productStats (revenue-sorted), enrich it
  const enrichedProductStats = productStats.map(p => {
    const invItem = db.prepare(`SELECT * FROM inventory WHERE name = ? LIMIT 1`).get(p.name);
    return {
      ...p,
      currentStock: invItem ? invItem.quantity        : null,
      sellPrice:    invItem ? invItem.sellPrice        : null,
      buyPrice:     invItem ? invItem.buyPrice         : null,
      expiryDate:   invItem ? invItem.expiryDate       : null,
      isLowStock:   invItem ? invItem.quantity < 10    : false,
      isExpired:    invItem && invItem.expiryDate
                    ? new Date(invItem.expiryDate) < new Date()
                    : false,
      margin:       invItem && invItem.buyPrice > 0
                    ? Math.round(((invItem.sellPrice - invItem.buyPrice) / invItem.buyPrice) * 100)
                    : null
    };
  });

  // Low stock items (from inventory, not just sold this month)
  const lowStockItems = db.prepare(
    `SELECT * FROM inventory WHERE quantity < 10 AND quantity >= 0 ORDER BY quantity ASC LIMIT 10`
  ).all();

  // Expiring items (within 30 days)
  const thirtyDaysLater = new Date();
  thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
  const expiringItems = db.prepare(
    `SELECT * FROM inventory
     WHERE expiryDate IS NOT NULL
     AND expiryDate <= ?
     AND expiryDate >= ?
     ORDER BY expiryDate ASC LIMIT 10`
  ).all(thirtyDaysLater.toISOString(), new Date().toISOString());

  // ── Extended customer analytics ───────────────────────
  // Top purchasers (already have customerStats for month)
  // Enrich with all-time balance
  const enrichedCustomerStats = customerStats.map(c => {
    const cAllTxns  = allTimeTxns.filter(t => t.customerId === c.id);
    const allDebit  = cAllTxns.filter(t => t.type === 'debit') .reduce((s,t) => s+t.amount, 0);
    const allCredit = cAllTxns.filter(t => t.type === 'credit').reduce((s,t) => s+t.amount, 0);
    const allTimeDue = Math.max(0, allDebit - allCredit);
    const repayPct   = allDebit > 0 ? Math.round((allCredit / allDebit) * 100) : 100;
    return { ...c, allTimeDue, repayPct, trustScore: calculateTrustScore(c.id) };
  });

  // Highest due customers (all-time, not just this month)
  const highDueCustomers = scopedIds.map(cid => {
    const cust     = allCustomers.find(x => x.id === cid);
    const cTxns    = allTimeTxns.filter(t => t.customerId === cid);
    const cDebit   = cTxns.filter(t => t.type === 'debit') .reduce((s,t) => s+t.amount, 0);
    const cCredit  = cTxns.filter(t => t.type === 'credit').reduce((s,t) => s+t.amount, 0);
    const due      = Math.max(0, cDebit - cCredit);
    return { id: cid, name: cust ? cust.name : 'অজানা', due, phone: cust?.phone || '' };
  })
  .filter(c => c.due > 0)
  .sort((a,b) => b.due - a.due)
  .slice(0, 8);

  // Overdue customers (have unpaid debits past due date)
  const today2 = new Date().toISOString();
  const overdueCustomerMap = {};
  allTimeTxns
    .filter(t =>
      t.type === 'debit' &&
      t.dueDate &&
      t.dueDate < today2 &&
      (t.repaidAmount || 0) < t.amount &&
      scopedIds.includes(t.customerId)
    )
    .forEach(t => {
      const outstanding = t.amount - (t.repaidAmount || 0);
      if (!overdueCustomerMap[t.customerId])
        overdueCustomerMap[t.customerId] = { id: t.customerId, overdueAmt: 0, overdueCount: 0 };
      overdueCustomerMap[t.customerId].overdueAmt   += outstanding;
      overdueCustomerMap[t.customerId].overdueCount += 1;
    });
  const overdueCustomers = Object.values(overdueCustomerMap)
    .map(c => {
      const cust = allCustomers.find(x => x.id === c.id);
      return { ...c, name: cust ? cust.name : 'অজানা', phone: cust?.phone || '' };
    })
    .sort((a,b) => b.overdueAmt - a.overdueAmt)
    .slice(0, 8);

  // Top repaying customers this month
  const topRepayers = customerStats
    .filter(c => c.paid > 0)
    .sort((a,b) => b.paid - a.paid)
    .slice(0, 5);

    // ── Business insights ─────────────────────────────────

  // Highest sale day (by revenue: cash + collections)
  const highestSaleDay = dailyBreakdown.reduce(
    (best, d) => d.revenue > (best?.revenue || 0) ? d : best,
    null
  );

  // Highest expense day
  const highestExpenseDay = dailyBreakdown.reduce(
    (best, d) => d.expenses > (best?.expenses || 0) ? d : best,
    null
  );

  // Largest single transaction (debit or cash_sale by amount)
  const largestTxn = [...debits, ...cashSales].reduce(
    (best, t) => t.amount > (best?.amount || 0) ? t : best,
    null
  );
  const largestTxnCustomer = largestTxn
    ? allCustomers.find(c => c.id === largestTxn.customerId)
    : null;

  // Largest single expense
  const largestExpense = monthExpenses.reduce(
    (best, e) => e.amount > (best?.amount || 0) ? e : best,
    null
  );

  // Most sold product (by quantity)
  const mostSoldProduct = enrichedProductStats.length
    ? enrichedProductStats.reduce((best, p) => p.qty > (best?.qty || 0) ? p : best, null)
    : null;

  // Most active customer (by transaction count this month)
  const mostActiveCustomer = enrichedCustomerStats.length
    ? enrichedCustomerStats.reduce(
        (best, c) => c.txnCount > (best?.txnCount || 0) ? c : best,
        null
      )
    : null;

  // Busiest day overall (txn count)
  const busiestDay = dailyBreakdown.reduce(
    (best, d) => d.txnCount > (best?.txnCount || 0) ? d : best,
    null
  );

  // Average daily revenue (active days only)
  const activeDaysCount = dailyBreakdown.filter(d => d.revenue > 0).length;
  const avgDailyRevenue = activeDaysCount > 0
    ? Math.round(totalRevenue / activeDaysCount)
    : 0;

  // Best profit day
  const bestProfitDay = dailyBreakdown.reduce(
    (best, d) => d.profit > (best?.profit || 0) ? d : best,
    null
  );

  const insights = {
    highestSaleDay:      highestSaleDay?.revenue > 0
      ? { date: highestSaleDay.date,    value: highestSaleDay.revenue,   txnCount: highestSaleDay.txnCount }
      : null,
    highestExpenseDay:   highestExpenseDay?.expenses > 0
      ? { date: highestExpenseDay.date, value: highestExpenseDay.expenses, expCount: highestExpenseDay.expCount }
      : null,
    bestProfitDay:       bestProfitDay?.profit > 0
      ? { date: bestProfitDay.date,     value: bestProfitDay.profit }
      : null,
    busiestDay:          busiestDay?.txnCount > 0
      ? { date: busiestDay.date,        txnCount: busiestDay.txnCount }
      : null,
    largestTxn:          largestTxn
      ? { amount:       largestTxn.amount,
          type:         largestTxn.type,
          date:         largestTxn.date,
          note:         largestTxn.note        || null,
          productName:  largestTxn.productName || null,
          customerName: largestTxnCustomer ? largestTxnCustomer.name : 'অজানা' }
      : null,
    largestExpense:      largestExpense
      ? { amount:   largestExpense.amount,
          title:    largestExpense.title,
          category: largestExpense.category,
          date:     largestExpense.date }
      : null,
    mostSoldProduct:     mostSoldProduct
      ? { name:         mostSoldProduct.name,
          qty:          mostSoldProduct.qty,
          revenue:      mostSoldProduct.revenue,
          currentStock: mostSoldProduct.currentStock }
      : null,
    mostActiveCustomer:  mostActiveCustomer
      ? { id:       mostActiveCustomer.id,
          name:     mostActiveCustomer.name,
          txnCount: mostActiveCustomer.txnCount,
          purchased:mostActiveCustomer.purchased }
      : null,
    avgDailyRevenue,
    activeDaysCount
   };
  res.json({
    year, month,
    monthName:  new Date(year, month - 1).toLocaleString('bn-BD', { month: 'long' }),
    dateFrom, dateTo,
    shop: shop || null,

    summary: {
      // Revenue
      cashSalesAmt,
      creditSalesAmt,
      collectionsAmt,
      totalRevenue,

      // Costs
      totalExpense,
      netProfit,

      // Receivables
      totalCurrentDue,
      overdueAmt,

      // Counts
      txnCount:     monthTxns.length,
      expenseCount: monthExpenses.length,
      debitCount:   debits.length,
      creditCount:  credits.length,
      cashCount:    cashSales.length,
      customerCount: Object.keys(customerMap).length
    },

    paymentBreakdown,
    paymentAnalytics:    paymentAnalyticsFinal,
    expCategoryAnalytics: expCategoryAnalyticsFinal,
    productStats:          enrichedProductStats,
    lowStockItems,
    expiringItems,
    customerStats:         enrichedCustomerStats,
    highDueCustomers,
    overdueCustomers,
    topRepayers,
    insights,
    expenseByCategory,
    dailyBreakdown,
    cumulativeFlow,

    transactions: monthTxns.map(t => {
      const c = allCustomers.find(x => x.id === t.customerId);
      return { ...t, customerName: c ? c.name : 'অজানা' };
    }),
    expenses: monthExpenses
  });
 });

 function emptyMonthReport(year, month) {
  return {
    year, month,
    monthName: new Date(year, month - 1).toLocaleString('bn-BD', { month: 'long' }),
    summary: { totalDebit:0, totalCredit:0, totalCash:0, totalRevenue:0, totalExpense:0, netProfit:0, txnCount:0 },
    paymentBreakdown: {}, productStats: [], customerStats: [],
    expenseByCategory: [], dailyBreakdown: [], transactions: [], expenses: []
  };
}

// ─── Reminder Route ───────────────────────────────────────────────────────────
app.post('/api/reminders/send', (req, res) => {
  const { customerId, transactionId, message } = req.body;
  const transactions = db.prepare(`SELECT * FROM transactions`).all();
  
  const customer = db.prepare(`SELECT * FROM customers WHERE id = ?`).get(customerId);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });

  if (transactionId) {
    db.prepare(`UPDATE transactions SET reminded = 1, reminderSentAt = ? WHERE id = ?`)
      .run(new Date().toISOString(), transactionId);
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
  const customers         = db.prepare(`SELECT * FROM customers`).all();
  const transactions      = db.prepare(`SELECT * FROM transactions`).all();
  const inventory         = db.prepare(`SELECT * FROM inventory`).all();
  const suppliers         = db.prepare(`SELECT * FROM suppliers`).all();
  const supplierTxns      = db.prepare(`SELECT * FROM supplier_transactions`).all();
  const expenses          = db.prepare(`SELECT * FROM expenses`).all();
  const accounts          = db.prepare(`SELECT * FROM accounts ORDER BY datetime(createdAt) ASC`).all();
  const accountTxns       = db.prepare(`SELECT * FROM account_transactions`).all();
  const auth              = readAuth();
  const users = db.prepare(`SELECT id, phone, name, role, createdAt FROM users`).all();

  const backup = {
    exportedAt:          new Date().toISOString(),
    version:             '2.0',
    customers,
    transactions,
    inventory,
    suppliers,
    supplierTransactions: supplierTxns,
    expenses,
    accounts,
    accountTransactions:  accountTxns,
    users,  
    shopName:             auth.shopName,
    ownerName:            auth.ownerName,
    shops:                auth.shops
  };

  res.setHeader('Content-Disposition', `attachment; filename=halkhata_backup_${Date.now()}.json`);
  res.setHeader('Content-Type', 'application/json');
  res.json(backup);
});

app.post('/api/restore', (req, res) => {
  const { customers, transactions } = req.body;

  if (customers) {
    db.prepare(`DELETE FROM customers`).run();
    const ins = db.prepare(`
      INSERT OR IGNORE INTO customers
        (id, name, phone, address, creditLimit, shop, trustScore, createdAt)
      VALUES
        (@id, @name, @phone, @address, @creditLimit, @shop, @trustScore, @createdAt)
    `);
    db.transaction(() => customers.forEach(c => ins.run({
      id: c.id, name: c.name || '', phone: c.phone || '', address: c.address || '',
      creditLimit: c.creditLimit || 5000, shop: c.shop || 'প্রধান শাখা',
      trustScore: c.trustScore || 75, createdAt: c.createdAt || new Date().toISOString()
    })))();
  }

  if (transactions) {
    db.prepare(`DELETE FROM transactions`).run();
    const ins = db.prepare(`
      INSERT OR IGNORE INTO transactions
        (id, customerId, type, amount, note, dueDate, shop, date,
         photo, repaidAmount, repaidAt, reminded,
         inventoryId, productName, soldQuantity, paymentMethod, saleType)
      VALUES
        (@id, @customerId, @type, @amount, @note, @dueDate, @shop, @date,
         @photo, @repaidAmount, @repaidAt, @reminded,
         @inventoryId, @productName, @soldQuantity, @paymentMethod, @saleType)
    `);
    db.transaction(() => transactions.forEach(t => ins.run({
      id: t.id, customerId: t.customerId, type: t.type, amount: t.amount || 0,
      note: t.note || '', dueDate: t.dueDate || null, shop: t.shop || 'প্রধান শাখা',
      date: t.date || new Date().toISOString(), photo: t.photo || null,
      repaidAmount: t.repaidAmount || 0, repaidAt: t.repaidAt || null,
      reminded: t.reminded ? 1 : 0, inventoryId: t.inventoryId || null,
      productName: t.productName || null, soldQuantity: t.soldQuantity || null,
      paymentMethod: t.paymentMethod || null, saleType: t.saleType || null
    })))();
  }

  res.json({ success: true });
});

// ─── Overdue Check ────────────────────────────────────────────────────────────
app.get('/api/overdue', (req, res) => {
  const transactions = db.prepare(`SELECT * FROM transactions`).all();
  const customers    = db.prepare(`SELECT * FROM customers`).all();
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

// ─── Inventory Routes ─────────────────────────────────
app.get('/api/inventory', (req, res) => {
  const { shop } = req.query;
  let query = `SELECT * FROM inventory WHERE 1=1`;
  const args = [];
  if (shop) { query += ` AND shop = ?`; args.push(shop); }
  query += ` ORDER BY createdAt DESC`;
  res.json(db.prepare(query).all(...args));
});

app.post('/api/inventory', (req, res) => {
  const { name, buyPrice, sellPrice, quantity, buyDate, expiryDate, shop, supplierId } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });

  const item = {
    id:         uuidv4(),
    name,
    buyPrice:   parseFloat(buyPrice)  || 0,
    sellPrice:  parseFloat(sellPrice) || 0,
    quantity:   parseInt(quantity)    || 0,
    buyDate:    buyDate     || null,
    expiryDate: expiryDate  || null,
    supplierId: supplierId  || null,
    shop:       shop        || 'প্রধান শাখা',
    createdAt:  new Date().toISOString()
  };

  db.prepare(`
    INSERT INTO inventory
      (id, name, buyPrice, sellPrice, quantity, buyDate, expiryDate, supplierId, shop, createdAt)
    VALUES
      (@id, @name, @buyPrice, @sellPrice, @quantity, @buyDate, @expiryDate, @supplierId, @shop, @createdAt)
  `).run(item);

  if (item.supplierId && item.quantity > 0 && item.buyPrice > 0) {
    const supplierExists = db.prepare(`SELECT id FROM suppliers WHERE id = ?`).get(item.supplierId);
    if (supplierExists) {
      const total = item.quantity * item.buyPrice;
      const now   = new Date().toISOString();
      db.prepare(`
        INSERT INTO supplier_transactions
          (id, supplierId, type, amount, note, date, createdAt)
        VALUES
          (@id, @supplierId, @type, @amount, @note, @date, @createdAt)
      `).run({
        id:         uuidv4(),
        supplierId: item.supplierId,
        type:       'debit',
        amount:     total,
        note:       `পণ্য কিনলাম: ${item.name} (${item.quantity} × ৳${item.buyPrice})`,
        date:       now,
        createdAt:  now
      });
    }
  }

  if (req.body.autoExpense && item.buyPrice > 0 && item.quantity > 0) {
    const expAmt = item.buyPrice * item.quantity;
    const now    = new Date().toISOString();
    db.prepare(`
      INSERT INTO expenses
        (id, title, category, amount, shop, note, receiptPhoto, paymentMethod, date, createdAt)
      VALUES
        (@id, @title, @category, @amount, @shop, @note, @receiptPhoto, @paymentMethod, @date, @createdAt)
    `).run({
      id:            uuidv4(),
      title:         `পণ্য ক্রয়: ${item.name}`,
      category:      'Supplier Purchase',
      amount:        expAmt,
      shop:          item.shop,
      note:          `${item.quantity} × ৳${item.buyPrice}`,
      receiptPhoto:  null,
      paymentMethod: req.body.paymentMethod || null,
      date:          item.buyDate || now,
      createdAt:     now
    });
  }

  res.status(201).json(item);
});

app.put('/api/inventory/:id', (req, res) => {
  const existing = db.prepare(`SELECT * FROM inventory WHERE id = ?`).get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Item not found' });

  const { name, buyPrice, sellPrice, quantity, buyDate, expiryDate, shop, supplierId } = req.body;

  db.prepare(`
    UPDATE inventory
    SET name=@name, buyPrice=@buyPrice, sellPrice=@sellPrice, quantity=@quantity,
        buyDate=@buyDate, expiryDate=@expiryDate, shop=@shop, supplierId=@supplierId
    WHERE id=@id
  `).run({
    id:         req.params.id,
    name:       name        ?? existing.name,
    buyPrice:   parseFloat(buyPrice)  ?? existing.buyPrice,
    sellPrice:  parseFloat(sellPrice) ?? existing.sellPrice,
    quantity:   parseInt(quantity)    ?? existing.quantity,
    buyDate:    buyDate     ?? existing.buyDate,
    expiryDate: expiryDate  ?? existing.expiryDate,
    shop:       shop        ?? existing.shop,
    supplierId: supplierId  ?? existing.supplierId
  });

  res.json(db.prepare(`SELECT * FROM inventory WHERE id = ?`).get(req.params.id));
});

app.delete('/api/inventory/:id', (req, res) => {
  db.prepare(`DELETE FROM inventory WHERE id = ?`).run(req.params.id);
  res.json({ success: true });
});

// ─── Supplier Routes ──────────────────────────────────
app.get('/api/suppliers', (req, res) => {
  const suppliers = db.prepare(`SELECT * FROM suppliers ORDER BY createdAt DESC`).all();

  const result = suppliers.map(s => {
    const totals = db.prepare(`
      SELECT
        COALESCE(SUM(CASE WHEN type = 'debit'  THEN amount ELSE 0 END), 0) as totalOwed,
        COALESCE(SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END), 0) as totalPaid
      FROM supplier_transactions WHERE supplierId = ?
    `).get(s.id);

    return {
      ...s,
      totalOwed: totals.totalOwed,
      totalPaid: totals.totalPaid,
      balance:   Math.max(0, totals.totalOwed - totals.totalPaid)
    };
  });

  res.json(result);
});

app.post('/api/suppliers', (req, res) => {
  const { name, phone, address } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });

  const supplier = {
    id:        uuidv4(),
    name,
    phone:     phone   || '',
    address:   address || '',
    createdAt: new Date().toISOString()
  };

  db.prepare(`
    INSERT INTO suppliers (id, name, phone, address, createdAt)
    VALUES (@id, @name, @phone, @address, @createdAt)
  `).run(supplier);

  res.status(201).json(supplier);
});

app.delete('/api/suppliers/:id', (req, res) => {
  // CASCADE in db.js handles supplier_transactions deletion automatically
  db.prepare(`DELETE FROM suppliers WHERE id = ?`).run(req.params.id);
  res.json({ success: true });
});

app.get('/api/suppliers/:id', (req, res) => {
  const supplier = db.prepare(`SELECT * FROM suppliers WHERE id = ?`).get(req.params.id);
  if (!supplier) return res.status(404).json({ error: 'Not found' });

  const txns = db.prepare(
    `SELECT * FROM supplier_transactions WHERE supplierId = ? ORDER BY date DESC`
  ).all(req.params.id);

  const totals = db.prepare(`
    SELECT
      COALESCE(SUM(CASE WHEN type = 'debit'  THEN amount ELSE 0 END), 0) as totalOwed,
      COALESCE(SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END), 0) as totalPaid
    FROM supplier_transactions WHERE supplierId = ?
  `).get(req.params.id);

  res.json({
    ...supplier,
    totalOwed:    totals.totalOwed,
    totalPaid:    totals.totalPaid,
    balance:      Math.max(0, totals.totalOwed - totals.totalPaid),
    transactions: txns
  });
});

app.get('/api/suppliers/:id/transactions', (req, res) => {
  const txns = db.prepare(
    `SELECT * FROM supplier_transactions WHERE supplierId = ? ORDER BY date DESC`
  ).all(req.params.id);
  res.json(txns);
});

app.post('/api/supplier-transactions', (req, res) => {
  const { supplierId, type, amount, note } = req.body;
  if (!supplierId || !type || !amount)
    return res.status(400).json({ error: 'supplierId, type, amount required' });

  const supplier = db.prepare(`SELECT id FROM suppliers WHERE id = ?`).get(supplierId);
  if (!supplier) return res.status(404).json({ error: 'Supplier not found' });

  const now = new Date().toISOString();
  const txn = {
    id:         uuidv4(),
    supplierId,
    type,
    amount:     parseFloat(amount),
    note:       note || '',
    date:       now,
    createdAt:  now
  };

  db.prepare(`
    INSERT INTO supplier_transactions
      (id, supplierId, type, amount, note, date, createdAt)
    VALUES
      (@id, @supplierId, @type, @amount, @note, @date, @createdAt)
  `).run(txn);

  // We paid supplier → money leaves account
  if (type === 'credit' && req.body.paymentMethod) {
    adjustAccount(
      req.body.paymentMethod,
      -parseFloat(amount),
      `সরবরাহকারী পেমেন্ট: ${txn.note || supplierId}`,
      'supplier_transaction',
      txn.id
    );
  }

  res.status(201).json(txn);
});

// ─── Expense Routes ───────────────────────────────────
app.get('/api/expenses', (req, res) => {
  const { shop, category, date } = req.query;
  let query = `SELECT * FROM expenses WHERE 1=1`;
  const args = [];

  if (shop)     { query += ` AND shop = ?`;          args.push(shop); }
  if (category) { query += ` AND category = ?`;      args.push(category); }
  if (date)     { query += ` AND date LIKE ?`;        args.push(`${date}%`); }

  query += ` ORDER BY date DESC`;
  res.json(db.prepare(query).all(...args));
});

app.post('/api/expenses', (req, res) => {
  const { title, category, amount, shop, note, date } = req.body;
  if (!title || !amount) return res.status(400).json({ error: 'title and amount required' });

  const now     = new Date().toISOString();
  const expense = {
    id:            uuidv4(),
    title,
    category:      category            || 'Misc',
    amount:        parseFloat(amount),
    shop:          shop                || 'প্রধান শাখা',
    note:          note                || '',
    receiptPhoto:  null,
    paymentMethod: req.body.paymentMethod || null,
    date:          date ? new Date(date).toISOString() : now,
    createdAt:     now
  };

  db.prepare(`
    INSERT INTO expenses
      (id, title, category, amount, shop, note, receiptPhoto, paymentMethod, date, createdAt)
    VALUES
      (@id, @title, @category, @amount, @shop, @note, @receiptPhoto, @paymentMethod, @date, @createdAt)
  `).run(expense);

  // Expense → money leaves account
  if (req.body.paymentMethod) {
    adjustAccount(
      req.body.paymentMethod,
      -parseFloat(amount),
      `খরচ: ${title}`,
      'expense',
      expense.id
    );
  }

  res.status(201).json(expense);
});



app.put('/api/expenses/:id', (req, res) => {
  const existing = db.prepare(`SELECT * FROM expenses WHERE id = ?`).get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });

  const { title, category, amount, shop, note, date } = req.body;

  db.prepare(`
    UPDATE expenses
    SET title=@title, category=@category, amount=@amount,
        shop=@shop, note=@note, date=@date
    WHERE id=@id
  `).run({
    id:       req.params.id,
    title:    title    ?? existing.title,
    category: category ?? existing.category,
    amount:   parseFloat(amount) || existing.amount,
    shop:     shop     ?? existing.shop,
    note:     note     ?? existing.note,
    date:     date ? new Date(date).toISOString() : existing.date
  });

  res.json(db.prepare(`SELECT * FROM expenses WHERE id = ?`).get(req.params.id));
});

app.delete('/api/expenses/:id', (req, res) => {
  db.prepare(`DELETE FROM expenses WHERE id = ?`).run(req.params.id);
  res.json({ success: true });
});

app.post('/api/expenses/:id/photo', upload.single('photo'), (req, res) => {
  const existing = db.prepare(`SELECT * FROM expenses WHERE id = ?`).get(req.params.id);
  if (!existing)  return res.status(404).json({ error: 'Not found' });
  if (!req.file)  return res.status(400).json({ error: 'No file' });

  const photoPath = `/uploads/${req.file.filename}`;
  db.prepare(`UPDATE expenses SET receiptPhoto = ? WHERE id = ?`).run(photoPath, req.params.id);
  res.json(db.prepare(`SELECT * FROM expenses WHERE id = ?`).get(req.params.id));
});

// ─── Account Routes ───────────────────────────────────
app.get('/api/accounts', (req, res) => {
  res.json(db.prepare(`SELECT * FROM accounts ORDER BY datetime(createdAt) ASC`).all());
});

// ─── User Management Routes ───────────────────────────
app.get('/api/users', (req, res) => {
  const users = db.prepare(`SELECT id, phone, name, role, createdAt FROM users ORDER BY datetime(createdAt) ASC`).all();
  res.json(users);  // pinHash intentionally excluded
});

app.post('/api/users', async (req, res) => {
  const { phone, name, pin, role } = req.body;
  if (!phone || !pin || !name) return res.status(400).json({ error: 'phone, name, pin required' });
  if (String(pin).length !== 4) return res.status(400).json({ error: 'PIN must be 4 digits' });

  const existing = db.prepare(`SELECT id FROM users WHERE phone = ?`).get(phone);
  if (existing) return res.status(409).json({ error: 'Phone already registered' });

  const now    = new Date().toISOString();
  const hashed = await bcrypt.hash(String(pin), 10);
  const user   = {
    id:        uuidv4(),
    phone,
    name,
    pinHash:   hashed,
    role:      role || 'owner',
    createdAt: now,
    updatedAt: now
  };

  db.prepare(`
    INSERT INTO users (id, phone, name, pinHash, role, createdAt, updatedAt)
    VALUES (@id, @phone, @name, @pinHash, @role, @createdAt, @updatedAt)
  `).run(user);

  res.status(201).json({ id: user.id, phone: user.phone, name: user.name, role: user.role });
});

app.delete('/api/users/:id', (req, res) => {
  const count = db.prepare(`SELECT COUNT(*) as n FROM users`).get().n;
  if (count <= 1) return res.status(400).json({ error: 'Cannot delete the only user' });
  db.prepare(`DELETE FROM users WHERE id = ?`).run(req.params.id);
  res.json({ success: true });
});

app.get('/api/accounts/:id/transactions', (req, res) => {
  const account = db.prepare(`SELECT * FROM accounts WHERE id = ?`).get(req.params.id);
  if (!account) return res.status(404).json({ error: 'Account not found' });

  const txns = db.prepare(`
    SELECT * FROM account_transactions
    WHERE accountId = ?
    ORDER BY datetime(date) DESC
  `).all(req.params.id);

  res.json({ account, transactions: txns });
});

app.put('/api/accounts/:id', (req, res) => {
  const existing = db.prepare(`SELECT * FROM accounts WHERE id = ?`).get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Account not found' });

  if (req.body.name !== undefined)
    db.prepare(`UPDATE accounts SET name = ? WHERE id = ?`).run(req.body.name, req.params.id);

  if (req.body.balance !== undefined) {
    const newBalance = parseFloat(req.body.balance);
    const delta      = newBalance - (existing.balance || 0);
    db.prepare(`UPDATE accounts SET balance = ? WHERE id = ?`).run(newBalance, req.params.id);

    // Log manual adjustment only if balance actually changed
    if (delta !== 0) {
      const now = new Date().toISOString();
      db.prepare(`
        INSERT INTO account_transactions
          (id, accountId, type, amount, note, relatedType, relatedId, date, createdAt)
        VALUES
          (@id, @accountId, @type, @amount, @note, @relatedType, @relatedId, @date, @createdAt)
      `).run({
        id:          uuidv4(),
        accountId:   req.params.id,
        type:        delta > 0 ? 'credit' : 'debit',
        amount:      Math.abs(delta),
        note:        'ম্যানুয়াল সমন্বয়',
        relatedType: 'manual',
        relatedId:   null,
        date:        now,
        createdAt:   now
      });
    }
  }

  res.json(db.prepare(`SELECT * FROM accounts WHERE id = ?`).get(req.params.id));
});

// ─── Seed Demo Data ───────────────────────────────────────────────────────────
app.post('/api/seed', async (req, res) => {
  const { v4: uuid } = require('uuid');
  const demoCustomers = [
    { id: uuid(), name: 'রহিম মিয়া',    phone: '01711223344', address: 'ধানমন্ডি, ঢাকা',     creditLimit: 10000, shop: 'প্রধান শাখা', trustScore: 85, createdAt: new Date().toISOString() },
    { id: uuid(), name: 'করিম উদ্দিন',  phone: '01811334455', address: 'মিরপুর, ঢাকা',       creditLimit:  5000, shop: 'প্রধান শাখা', trustScore: 60, createdAt: new Date().toISOString() },
    { id: uuid(), name: 'ফাতেমা বেগম',  phone: '01912445566', address: 'মোহাম্মদপুর, ঢাকা', creditLimit:  8000, shop: 'শাখা-২',      trustScore: 90, createdAt: new Date().toISOString() },
    { id: uuid(), name: 'সালাম সাহেব',  phone: '01615556677', address: 'উত্তরা, ঢাকা',       creditLimit:  3000, shop: 'শাখা-২',      trustScore: 35, createdAt: new Date().toISOString() },
  ];

  const now = new Date();
  const demoTxns = [
    { id: uuid(), customerId: demoCustomers[0].id, type: 'debit',  amount: 2500, note: 'চাল, ডাল',      shop: 'প্রধান শাখা', dueDate: new Date(now - 5*86400000).toISOString(),  date: new Date(now - 10*86400000).toISOString(), photo: null, repaidAmount: 2500, repaidAt: new Date(now - 6*86400000).toISOString(), reminded: 0, inventoryId: null, productName: null, soldQuantity: null, paymentMethod: null, saleType: null },
    { id: uuid(), customerId: demoCustomers[0].id, type: 'debit',  amount: 1800, note: 'তেল, মশলা',     shop: 'প্রধান শাখা', dueDate: new Date(now + 5*86400000).toISOString(),  date: new Date(now -  3*86400000).toISOString(), photo: null, repaidAmount: 0,    repaidAt: null,                                      reminded: 0, inventoryId: null, productName: null, soldQuantity: null, paymentMethod: null, saleType: null },
    { id: uuid(), customerId: demoCustomers[1].id, type: 'debit',  amount: 3200, note: 'মাসের বাজার',   shop: 'প্রধান শাখা', dueDate: new Date(now - 15*86400000).toISOString(), date: new Date(now - 20*86400000).toISOString(), photo: null, repaidAmount: 1000, repaidAt: null,                                      reminded: 1, inventoryId: null, productName: null, soldQuantity: null, paymentMethod: null, saleType: null },
    { id: uuid(), customerId: demoCustomers[2].id, type: 'debit',  amount: 4500, note: 'বড় কেনাকাটা',  shop: 'শাখা-২',      dueDate: new Date(now + 10*86400000).toISOString(), date: new Date(now -  2*86400000).toISOString(), photo: null, repaidAmount: 4500, repaidAt: new Date(now - 1*86400000).toISOString(), reminded: 0, inventoryId: null, productName: null, soldQuantity: null, paymentMethod: null, saleType: null },
    { id: uuid(), customerId: demoCustomers[3].id, type: 'debit',  amount: 1500, note: 'সাপ্তাহিক বাজার', shop: 'শাখা-২',   dueDate: new Date(now - 30*86400000).toISOString(), date: new Date(now - 35*86400000).toISOString(), photo: null, repaidAmount: 0,    repaidAt: null,                                      reminded: 0, inventoryId: null, productName: null, soldQuantity: null, paymentMethod: null, saleType: null },
    { id: uuid(), customerId: demoCustomers[1].id, type: 'credit', amount: 1000, note: 'আংশিক পরিশোধ', shop: 'প্রধান শাখা', dueDate: null,                                       date: new Date(now -  5*86400000).toISOString(), photo: null, repaidAmount: 0,    repaidAt: null,                                      reminded: 0, inventoryId: null, productName: null, soldQuantity: null, paymentMethod: null, saleType: null },
  ];

  // Clear and re-seed SQLite
  db.prepare(`DELETE FROM transactions`).run();
  db.prepare(`DELETE FROM customers`).run();

  const insCust = db.prepare(`INSERT INTO customers (id,name,phone,address,creditLimit,shop,trustScore,createdAt) VALUES (@id,@name,@phone,@address,@creditLimit,@shop,@trustScore,@createdAt)`);
  const insTxn  = db.prepare(`INSERT INTO transactions (id,customerId,type,amount,note,dueDate,shop,date,photo,repaidAmount,repaidAt,reminded,inventoryId,productName,soldQuantity,paymentMethod,saleType) VALUES (@id,@customerId,@type,@amount,@note,@dueDate,@shop,@date,@photo,@repaidAmount,@repaidAt,@reminded,@inventoryId,@productName,@soldQuantity,@paymentMethod,@saleType)`);

  db.transaction(() => { demoCustomers.forEach(c => insCust.run(c)); })();
  db.transaction(() => { demoTxns.forEach(t     => insTxn.run(t));  })();

  const auth = readAuth();
  auth.shops = ['প্রধান শাখা', 'শাখা-২'];
  
  // Update shops in SQLite settings only — no pin involved
  db.prepare(`UPDATE app_settings SET shops = ?, updatedAt = ? WHERE id = 1`)
    .run(JSON.stringify(['প্রধান শাখা', 'শাখা-২']), new Date().toISOString());

  res.json({ success: true, message: 'Demo data seeded into SQLite' });
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
║   HalKhata digital                     ║
║   Server running at:                   ║
║   http://localhost:${PORT}              ║
║   Default PIN: 1234                    ║
╚════════════════════════════════════════╝
  `);
});
