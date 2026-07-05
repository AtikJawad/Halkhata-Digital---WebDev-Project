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

// ─── Per-user settings helpers ────────────────────────
function readUserSettings(userId) {
  const row = db.prepare(`SELECT * FROM app_settings WHERE userId = ?`).get(userId);
  if (!row) return { shopName: 'আমার দোকান', ownerName: 'দোকান মালিক', shops: ['প্রধান শাখা'] };
  return {
    shopName:  row.shopName  || 'আমার দোকান',
    ownerName: row.ownerName || 'দোকান মালিক',
    shops:     safeParseShops(row.shops)
  };
}

function writeUserSettings(userId, data) {
  const now   = new Date().toISOString();
  const shops = Array.isArray(data.shops) && data.shops.length ? data.shops : ['প্রধান শাখা'];
  db.prepare(`
    INSERT INTO app_settings (userId, shopName, ownerName, shops, createdAt, updatedAt)
    VALUES (@userId, @shopName, @ownerName, @shops, @createdAt, @updatedAt)
    ON CONFLICT(userId) DO UPDATE SET
      shopName  = excluded.shopName,
      ownerName = excluded.ownerName,
      shops     = excluded.shops,
      updatedAt = excluded.updatedAt
  `).run({ userId, shopName: data.shopName||'আমার দোকান', ownerName: data.ownerName||'দোকান মালিক', shops: JSON.stringify(shops), createdAt: now, updatedAt: now });
}

// ─── Per-user account helpers ─────────────────────────
function ensureUserAccounts(userId) {
  const count = db.prepare(`SELECT COUNT(*) as n FROM accounts WHERE userId = ?`).get(userId).n;
  if (count > 0) return;
  const now = new Date().toISOString();
  const defaults = [
    { id:`${userId}_cash`,  name:'নগদ (Cash)', type:'cash',   balance:0 },
    { id:`${userId}_bkash`, name:'বিকাশ',      type:'mobile', balance:0 },
    { id:`${userId}_nagad`, name:'নগদ (Nagad)',type:'mobile', balance:0 },
    { id:`${userId}_rocket`,name:'রকেট',       type:'mobile', balance:0 },
    { id:`${userId}_bank`,  name:'ব্যাংক',     type:'bank',   balance:0 }
  ];
  const ins = db.prepare(`INSERT OR IGNORE INTO accounts (id,userId,name,type,balance,createdAt) VALUES (?,?,?,?,?,?)`);
  db.transaction(() => defaults.forEach(a => ins.run(a.id, userId, a.name, a.type, a.balance, now)))();
}

// ─── Product & Batch helpers ───────────────────────────
function getProductAggregate(productId, uid) {
  const product = db.prepare(`SELECT * FROM products WHERE id = ? AND userId = ?`).get(productId, uid);
  if (!product) return null;

  const batches = db.prepare(`
    SELECT * FROM inventory_batches
    WHERE productId = ? AND userId = ?
    ORDER BY CASE WHEN expiryDate IS NULL THEN 1 ELSE 0 END ASC, expiryDate ASC, buyDate ASC
  `).all(productId, uid);

  const active      = batches.filter(b => b.remainingQuantity > 0);
  const totalStock  = active.reduce((s, b) => s + b.remainingQuantity, 0);
  const totalValue  = active.reduce((s, b) => s + (b.remainingQuantity * b.buyPrice), 0);
  const avgBuyPrice = totalStock > 0 ? Math.round((totalValue / totalStock) * 100) / 100 : 0;
  const nearest     = active.find(b => b.expiryDate) || null;

  return {
    ...product,
    totalStock,
    avgBuyPrice,
    totalValue,
    batchCount: active.length,
    nearestExpiry: nearest ? nearest.expiryDate : null,
    batches
  };
}

function listProductsAggregated(uid, shop) {
  let query = `SELECT * FROM products WHERE userId = ?`;
  const args = [uid];
  if (shop) { query += ` AND shop = ?`; args.push(shop); }
  query += ` ORDER BY createdAt DESC`;
  return db.prepare(query).all(...args).map(p => getProductAggregate(p.id, uid));
}

// Deducts stock via FIFO (earliest expiry first) or a manually chosen batch.
// Must be called inside a db.transaction() by the caller for atomicity.
function deductStockFIFO(productId, uid, qtyNeeded, manualBatchId = null) {
  const breakdown = [];

  if (manualBatchId) {
    const batch = db.prepare(`SELECT * FROM inventory_batches WHERE id = ? AND productId = ? AND userId = ?`).get(manualBatchId, productId, uid);
    if (!batch) throw new Error('নির্বাচিত ব্যাচ পাওয়া যায়নি');
    if (batch.remainingQuantity < qtyNeeded) throw new Error('এই ব্যাচে পর্যাপ্ত স্টক নেই');
    db.prepare(`UPDATE inventory_batches SET remainingQuantity = remainingQuantity - ? WHERE id = ?`).run(qtyNeeded, batch.id);
    breakdown.push({ batchId: batch.id, qty: qtyNeeded, buyPrice: batch.buyPrice });
    return breakdown;
  }

  const batches = db.prepare(`
    SELECT * FROM inventory_batches
    WHERE productId = ? AND userId = ? AND remainingQuantity > 0
    ORDER BY CASE WHEN expiryDate IS NULL THEN 1 ELSE 0 END ASC, expiryDate ASC, buyDate ASC
  `).all(productId, uid);

  const totalAvailable = batches.reduce((s, b) => s + b.remainingQuantity, 0);
  if (totalAvailable < qtyNeeded) throw new Error('পর্যাপ্ত স্টক নেই');

  let remaining = qtyNeeded;
  const updateStmt = db.prepare(`UPDATE inventory_batches SET remainingQuantity = remainingQuantity - ? WHERE id = ?`);
  for (const b of batches) {
    if (remaining <= 0) break;
    const take = Math.min(b.remainingQuantity, remaining);
    updateStmt.run(take, b.id);
    breakdown.push({ batchId: b.id, qty: take, buyPrice: b.buyPrice });
    remaining -= take;
  }
  return breakdown;
}

function adjustAccountForUser(userId, accountSlug, delta, note='', relatedType=null, relatedId=null) {
  if (!accountSlug || delta === 0) return;
  const accountId = `${userId}_${accountSlug}`;
  const account   = db.prepare(`SELECT id FROM accounts WHERE id = ? AND userId = ?`).get(accountId, userId);
  if (!account) return;
  db.prepare(`UPDATE accounts SET balance = balance + ? WHERE id = ? AND userId = ?`).run(delta, accountId, userId);
  const now = new Date().toISOString();
  db.prepare(`INSERT INTO account_transactions (id,userId,accountId,type,amount,note,relatedType,relatedId,date,createdAt) VALUES (?,?,?,?,?,?,?,?,?,?)`)
    .run(uuidv4(), userId, accountId, delta>0?'credit':'debit', Math.abs(delta), note, relatedType||null, relatedId||null, now, now);
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
function adjustAccount(accountId, delta, note='', relatedType=null, relatedId=null) {
  // Legacy wrapper — requires full accountId (e.g. "userId_cash")
  if (!accountId || delta === 0) return;
  const account = db.prepare(`SELECT id, userId FROM accounts WHERE id = ?`).get(accountId);
  if (!account) return;
  db.prepare(`UPDATE accounts SET balance = balance + ? WHERE id = ?`).run(delta, accountId);
  const now = new Date().toISOString();
  db.prepare(`INSERT INTO account_transactions (id,userId,accountId,type,amount,note,relatedType,relatedId,date,createdAt) VALUES (?,?,?,?,?,?,?,?,?,?)`)
    .run(uuidv4(), account.userId, accountId, delta>0?'credit':'debit', Math.abs(delta), note, relatedType||null, relatedId||null, now, now);
}

// ─── Trust Score Calculator ───────────────────────────────────────────────────
function calculateTrustScore(customerId, userId) {
  const customerTxns = db.prepare(
    `SELECT * FROM transactions WHERE customerId = ? AND userId = ? AND type = 'debit'`
  ).all(customerId, userId);
  if (!customerTxns.length) return 75;
  let totalDebits=0, totalRepaid=0, onTimeCount=0, lateCount=0, totalDelayDays=0;
  customerTxns.forEach(txn => {
    totalDebits += txn.amount;
    if (txn.repaidAmount) totalRepaid += txn.repaidAmount;
    if (txn.dueDate && txn.repaidAt) {
      const delay = Math.floor((new Date(txn.repaidAt)-new Date(txn.dueDate))/(1000*60*60*24));
      if (delay<=0) onTimeCount++; else { lateCount++; totalDelayDays+=delay; }
    }
  });
  const repaymentRatio = totalDebits>0?(totalRepaid/totalDebits):0;
  const onTimeRatio    = (onTimeCount+lateCount)>0?(onTimeCount/(onTimeCount+lateCount)):0.5;
  const delayPenalty   = lateCount>0?Math.min((totalDelayDays/lateCount)*0.5,20):0;
  return Math.max(0, Math.min(100, Math.round((repaymentRatio*50)+(onTimeRatio*30)+20-delayPenalty)));
}

// ─── Auth Routes ──────────────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  const { phone, email, pin } = req.body;
  if (!pin)             return res.status(400).json({ error: 'PIN আবশ্যক' });
  if (!phone && !email) return res.status(400).json({ error: 'ফোন বা ইমেইল দিন' });

  let user = null;
  if (phone) user = db.prepare(`SELECT * FROM users WHERE phone = ?`).get(phone);
  if (!user && email) user = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email.toLowerCase());
  if (!user) return res.status(401).json({ error: 'ভুল তথ্য দেওয়া হয়েছে' });

  const match = await bcrypt.compare(String(pin), user.pinHash);
  if (!match) return res.status(401).json({ error: 'ভুল PIN' });

  req.session.userId    = user.id;
  req.session.userPhone = user.phone;
  req.session.userName  = user.name;

  ensureUserAccounts(user.id);

  const settings = readUserSettings(user.id);
  res.json({
    success:   true,
    userId:    user.id,
    userName:  user.name,
    shopName:  settings.shopName,
    ownerName: settings.ownerName,
    shops:     settings.shops
  });
});

// ─── Sign Up ──────────────────────────────────────────
app.post('/api/auth/signup', async (req, res) => {
  const { name, shopName, phone, email, pin } = req.body;

  if (!name || !pin)           return res.status(400).json({ error: 'নাম ও PIN আবশ্যক' });
  if (!phone && !email)        return res.status(400).json({ error: 'ফোন বা ইমেইল দিন' });
  if (String(pin).length !== 4) return res.status(400).json({ error: 'PIN ৪ সংখ্যার হতে হবে' });

  // Uniqueness check
  if (phone) {
    const existing = db.prepare(`SELECT id FROM users WHERE phone = ?`).get(phone);
    if (existing) return res.status(409).json({ error: 'এই ফোন নম্বরে ইতিমধ্যে অ্যাকাউন্ট আছে' });
  }
  if (email) {
    const existing = db.prepare(`SELECT id FROM users WHERE email = ?`).get(email.toLowerCase());
    if (existing) return res.status(409).json({ error: 'এই ইমেইলে ইতিমধ্যে অ্যাকাউন্ট আছে' });
  }

  const now     = new Date().toISOString();
  const userId  = uuidv4();
  const hashed  = await bcrypt.hash(String(pin), 10);

  db.prepare(`
    INSERT INTO users (id, phone, email, name, pinHash, role, createdAt, updatedAt)
    VALUES (@id, @phone, @email, @name, @pinHash, @role, @createdAt, @updatedAt)
  `).run({
    id: userId, phone: phone||null, email: email?.toLowerCase()||null,
    name, pinHash: hashed, role: 'owner', createdAt: now, updatedAt: now
  });

  // Create per-user settings
  writeUserSettings(userId, {
    shopName:  shopName || `${name}-এর দোকান`,
    ownerName: name,
    shops:     ['প্রধান শাখা']
  });

  // Create per-user accounts
  ensureUserAccounts(userId);

  res.status(201).json({ success: true, message: 'অ্যাকাউন্ট তৈরি হয়েছে। এখন লগইন করুন।' });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

app.get('/api/auth/check', (req, res) => {
  if (req.session?.userId) {
    const settings = readUserSettings(req.session.userId);
    return res.json({
      loggedIn:  true,
      userId:    req.session.userId,
      userName:  req.session.userName,
      shopName:  settings.shopName,
      ownerName: settings.ownerName,
      shops:     settings.shops
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
  const uid = req.session?.userId;
  if (!uid) return res.status(401).json({ error: 'Not logged in' });

  const { shopName, ownerName, shops } = req.body;
  const current = readUserSettings(uid);

  if (shopName  !== undefined && shopName.trim()  !== '') current.shopName  = shopName.trim();
  if (ownerName !== undefined && ownerName.trim() !== '') current.ownerName = ownerName.trim();

  if (shops !== undefined) {
    const newShops     = (Array.isArray(shops) ? shops : [shops]).map(s => s.trim()).filter(Boolean);
    const removedShops = current.shops.filter(s => !newShops.includes(s));
    if (removedShops.length) {
      const ph = removedShops.map(() => '?').join(',');
      db.prepare(`UPDATE customers  SET shop = 'প্রধান শাখা' WHERE userId = ? AND shop IN (${ph})`).run(uid, ...removedShops);
      db.prepare(`UPDATE inventory  SET shop = 'প্রধান শাখা' WHERE userId = ? AND shop IN (${ph})`).run(uid, ...removedShops);
      db.prepare(`UPDATE expenses   SET shop = 'প্রধান শাখা' WHERE userId = ? AND shop IN (${ph})`).run(uid, ...removedShops);
    }
    current.shops = newShops.length ? newShops : ['প্রধান শাখা'];
  }

  writeUserSettings(uid, current);

  if (ownerName !== undefined && ownerName.trim() !== '') {
    db.prepare(`UPDATE users SET name = ?, updatedAt = ? WHERE id = ?`).run(ownerName.trim(), new Date().toISOString(), uid);
    req.session.userName = ownerName.trim();
  }

  res.json({ success: true, shopName: current.shopName, ownerName: current.ownerName, shops: current.shops });
});

app.get('/api/auth/info', (req, res) => {
  const uid = req.session?.userId;
  if (!uid) return res.status(401).json({ error: 'Not logged in' });
  const s = readUserSettings(uid);
  res.json({ shopName: s.shopName, ownerName: s.ownerName, shops: s.shops });
});

// ─── Protect all routes below this line ──────────────
app.use('/api', checkAuth);

// ─── Customer Routes ──────────────────────────────────────────────────────────
app.get('/api/customers', (req, res) => {
  const uid = req.session.userId;
  const { search, shop } = req.query;
  let query  = `SELECT * FROM customers WHERE userId = ?`;
  const args = [uid];
  if (search) { query += ` AND (name LIKE ? OR phone LIKE ?)`; args.push(`%${search}%`, `%${search}%`); }
  if (shop)   { query += ` AND shop = ?`; args.push(shop); }
  const customers = db.prepare(query).all(...args);
  const result = customers.map(c => {
    const txns       = db.prepare(`SELECT * FROM transactions WHERE customerId = ? AND userId = ?`).all(c.id, uid);
    const totalDebit  = txns.filter(t=>t.type==='debit').reduce((s,t)=>s+t.amount,0);
    const totalCredit = txns.filter(t=>t.type==='credit').reduce((s,t)=>s+t.amount,0);
    return { ...c, balance: totalDebit-totalCredit, totalDebit, totalCredit, trustScore: calculateTrustScore(c.id, uid) };
  });
  res.json(result);
});

app.post('/api/customers', (req, res) => {
  const uid = req.session.userId;
  const { name, phone, address, creditLimit, shop } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  const customer = { id:uuidv4(), userId:uid, name, phone:phone||'', address:address||'', creditLimit:parseFloat(creditLimit)||5000, shop:shop||'প্রধান শাখা', trustScore:75, createdAt:new Date().toISOString() };
  db.prepare(`INSERT INTO customers (id,userId,name,phone,address,creditLimit,shop,trustScore,createdAt) VALUES (@id,@userId,@name,@phone,@address,@creditLimit,@shop,@trustScore,@createdAt)`).run(customer);
  res.status(201).json(customer);
})

app.get('/api/customers/:id', (req, res) => {
  const uid = req.session.userId;
  const c   = db.prepare(`SELECT * FROM customers WHERE id = ? AND userId = ?`).get(req.params.id, uid);
  if (!c) return res.status(404).json({ error: 'Not found' });
  const txns        = db.prepare(`SELECT * FROM transactions WHERE customerId = ? AND userId = ?`).all(c.id, uid);
  const totalDebit  = txns.filter(t=>t.type==='debit').reduce((s,t)=>s+t.amount,0);
  const totalCredit = txns.filter(t=>t.type==='credit').reduce((s,t)=>s+t.amount,0);
  res.json({ ...c, balance:totalDebit-totalCredit, totalDebit, totalCredit, trustScore:calculateTrustScore(c.id,uid) });
});

// ─── Customer Analytics ───────────────────────────────
app.get('/api/customers/:id/analytics', (req, res) => {
  const uid      = req.session.userId;
  const customer = db.prepare(`SELECT * FROM customers WHERE id = ? AND userId = ?`).get(req.params.id, uid);
  if (!customer) return res.status(404).json({ error: 'Not found' });

  const txns      = db.prepare(`SELECT * FROM transactions WHERE customerId = ? AND userId = ? ORDER BY date ASC`).all(req.params.id, uid);
  const debits    = txns.filter(t=>t.type==='debit');
  const credits   = txns.filter(t=>t.type==='credit');
  const cashSales = txns.filter(t=>t.type==='cash_sale');

  const totalDebitAmt    = debits.reduce((s,t)=>s+t.amount,0);
  const totalCashSaleAmt = cashSales.reduce((s,t)=>s+t.amount,0);
  const totalPurchaseAmt = totalDebitAmt + totalCashSaleAmt;
  const totalRepayments  = credits.reduce((s,t)=>s+t.amount,0);
  const totalPaid        = totalCashSaleAmt + totalRepayments;
  const currentDue       = Math.max(0, totalDebitAmt - totalRepayments);
  const repaymentPct     = totalDebitAmt>0?Math.min(100,Math.round((totalRepayments/totalDebitAmt)*100)):100;

  const today        = new Date();
  const overdueCount = debits.filter(t=>t.dueDate&&new Date(t.dueDate)<today&&(t.repaidAmount||0)<t.amount).length;

  const productCounts={};
  [...debits,...cashSales].forEach(t=>{if(t.productName){productCounts[t.productName]=(productCounts[t.productName]||0)+(t.soldQuantity||1);}});
  const mostBought = Object.entries(productCounts).sort((a,b)=>b[1]-a[1])[0]||null;

  const purchaseEvents = debits.length + cashSales.length;
  const avgTxnAmount   = purchaseEvents>0?Math.round(totalPurchaseAmt/purchaseEvents):0;
  const lastTxn        = txns.length?txns[txns.length-1]:null;

  let runningBalance = 0;
  const timeline = txns.map(t=>{
    if(t.type==='debit')   runningBalance+=t.amount;
    if(t.type==='credit')  runningBalance=Math.max(0,runningBalance-t.amount);
    return {...t,balanceAfter:runningBalance};
  }).reverse();

  res.json({
    customer:{ ...customer, trustScore:calculateTrustScore(customer.id,uid) },
    stats:{ totalPurchaseAmt,totalDebitAmt,totalCashSaleAmt,totalPaid,totalRepayments,currentDue,txnCount:txns.length,debitCount:debits.length,creditCount:credits.length,cashSaleCount:cashSales.length,purchaseEvents,repaymentPct,avgTxnAmount,overdueCount,mostBought:mostBought?{name:mostBought[0],qty:mostBought[1]}:null,lastTxnDate:lastTxn?lastTxn.date:null },
    timeline
  });
});

app.put('/api/customers/:id', (req, res) => {
  const uid      = req.session.userId;
  const existing = db.prepare(`SELECT * FROM customers WHERE id = ? AND userId = ?`).get(req.params.id, uid);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  const { name, phone, address, creditLimit, shop } = req.body;
  db.prepare(`UPDATE customers SET name=@name,phone=@phone,address=@address,creditLimit=@creditLimit,shop=@shop WHERE id=@id AND userId=@uid`).run({ id:req.params.id, uid, name, phone, address, creditLimit:parseFloat(creditLimit)||existing.creditLimit, shop });
  res.json(db.prepare(`SELECT * FROM customers WHERE id = ?`).get(req.params.id));
});

app.delete('/api/customers/:id', (req, res) => {
  const uid = req.session.userId;
  db.prepare(`DELETE FROM customers    WHERE id = ? AND userId = ?`).run(req.params.id, uid);
  db.prepare(`DELETE FROM transactions WHERE customerId = ? AND userId = ?`).run(req.params.id, uid);
  res.json({ success: true });
});

// ─── Transaction Routes ───────────────────────────────────────────────────────
app.get('/api/customers/:id/transactions', (req, res) => {
  const uid  = req.session.userId;
  const txns = db.prepare(`SELECT * FROM transactions WHERE customerId = ? AND userId = ? ORDER BY date DESC`).all(req.params.id, uid);
  res.json(txns.map(t=>({...t, reminded:!!t.reminded})));
});

app.get('/api/transactions', (req, res) => {
  const uid = req.session.userId;
  const { date, shop } = req.query;
  const customers = db.prepare(`SELECT * FROM customers WHERE userId = ?`).all(uid);
  let query = `SELECT * FROM transactions WHERE userId = ?`;
  const args = [uid];
  if (date) { query += ` AND date LIKE ?`; args.push(`${date}%`); }
  if (shop) {
    const ids = customers.filter(c=>c.shop===shop).map(c=>c.id);
    if (!ids.length) return res.json([]);
    query += ` AND customerId IN (${ids.map(()=>'?').join(',')})`;
    args.push(...ids);
  }
  query += ` ORDER BY date DESC`;
  const txns = db.prepare(query).all(...args);
  res.json(txns.map(t => {
    const c = customers.find(x=>x.id===t.customerId);
    return { ...t, reminded:!!t.reminded, customerName:c?c.name:'অজানা', customerPhone:c?c.phone:'' };
  }));
});

app.post('/api/transactions', (req, res) => {
  const uid = req.session.userId;
  const { customerId, type, amount, note, dueDate, shop } = req.body;
  if (!customerId||!type||!amount) return res.status(400).json({ error: 'customerId, type, amount required' });
  const customer = db.prepare(`SELECT * FROM customers WHERE id = ? AND userId = ?`).get(customerId, uid);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });
  const txn = {
    id:uuidv4(), userId:uid, customerId, type, amount:parseFloat(amount),
    note:note||'', dueDate:dueDate||null, shop:shop||customer.shop||'প্রধান শাখা',
    date:new Date().toISOString(), photo:null, repaidAmount:0, repaidAt:null, reminded:0,
    inventoryId:req.body.inventoryId||null, productName:req.body.productName||null,
    soldQuantity:req.body.soldQuantity?parseInt(req.body.soldQuantity):null,
    paymentMethod:req.body.paymentMethod||null, saleType:req.body.saleType||null
  };
  db.prepare(`INSERT INTO transactions (id,userId,customerId,type,amount,note,dueDate,shop,date,photo,repaidAmount,repaidAt,reminded,inventoryId,productName,soldQuantity,paymentMethod,saleType) VALUES (@id,@userId,@customerId,@type,@amount,@note,@dueDate,@shop,@date,@photo,@repaidAmount,@repaidAt,@reminded,@inventoryId,@productName,@soldQuantity,@paymentMethod,@saleType)`).run(txn);

if (req.body.inventoryId && req.body.soldQuantity) {
    try {
      const breakdown = db.transaction(() =>
        deductStockFIFO(req.body.inventoryId, uid, parseInt(req.body.soldQuantity), req.body.batchId || null)
      )();
      db.prepare(`UPDATE transactions SET batchBreakdown = ? WHERE id = ?`).run(JSON.stringify(breakdown), txn.id);
    } catch (e) {
      console.warn('Stock deduction warning:', e.message);
    }
  }
  
  if (type==='credit' && req.body.paymentMethod) {
    const accId = `${uid}_${req.body.paymentMethod}`;
    adjustAccount(accId, parseFloat(amount), `খদ্দের পরিশোধ: ${customer.name}`, 'transaction', txn.id);
  }
  if (type==='credit') {
    let remaining = parseFloat(amount);
    const pending = db.prepare(`SELECT * FROM transactions WHERE customerId=? AND userId=? AND type='debit' AND repaidAmount<amount ORDER BY date ASC`).all(customerId,uid);
    const upd     = db.prepare(`UPDATE transactions SET repaidAmount=@r,repaidAt=@at WHERE id=@id`);
    db.transaction(()=>{ for(const d of pending){ if(remaining<=0)break; const out=d.amount-(d.repaidAmount||0); const apply=Math.min(remaining,out); const nr=(d.repaidAmount||0)+apply; upd.run({r:nr,at:nr>=d.amount?new Date().toISOString():null,id:d.id}); remaining-=apply; } })();
  }
  res.status(201).json({...txn, reminded:false});
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
  const uid = req.session.userId;
  const { customerId, inventoryId, soldQuantity, amount, paymentMode, note, dueDate, shop, paymentMethod } = req.body;

  if (!customerId||!inventoryId||!soldQuantity||!amount)
    return res.status(400).json({ error: 'customerId, inventoryId, soldQuantity, amount required' });

  const customer = db.prepare(`SELECT * FROM customers WHERE id = ? AND userId = ?`).get(customerId, uid);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });

// inventoryId now refers to a productId in the batch-aware system
  const invItem = getProductAggregate(inventoryId, uid);
  if (!invItem) return res.status(404).json({ error: 'Product not found' });

  const qty = parseInt(soldQuantity);
  if (invItem.totalStock < qty) return res.status(400).json({ error: 'পর্যাপ্ত স্টক নেই' });

  let batchBreakdown;
  try {
    batchBreakdown = db.transaction(() => deductStockFIFO(inventoryId, uid, qty, req.body.batchId || null))();
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }

 const now     = new Date().toISOString();
  const baseTxn = {
    id:            uuidv4(),
    userId:        uid,
    customerId,
    amount:        parseFloat(amount),
    note:          note || invItem.name,
    dueDate:       null,
    shop:          shop || customer.shop || 'প্রধান শাখা',
    date:          now,
    photo:         null,
    repaidAmount:  0,
    repaidAt:      null,
    reminded:      0,
    inventoryId,
    productName:   invItem.name,
    soldQuantity:  qty,
    paymentMethod: paymentMethod || null,
    saleType:      paymentMode,
    batchBreakdown: JSON.stringify(batchBreakdown)
  };

  const insertTxn = db.prepare(`
    INSERT INTO transactions
      (id, userId, customerId, type, amount, note, dueDate, shop, date,
       photo, repaidAmount, repaidAt, reminded,
       inventoryId, productName, soldQuantity, paymentMethod, saleType, batchBreakdown)
    VALUES
      (@id, @userId, @customerId, @type, @amount, @note, @dueDate, @shop, @date,
       @photo, @repaidAmount, @repaidAt, @reminded,
       @inventoryId, @productName, @soldQuantity, @paymentMethod, @saleType, @batchBreakdown)
  `);
  let txn;
  if (paymentMode==='credit') {
    txn = {...baseTxn, type:'debit', dueDate:dueDate||null};
    insertTxn.run(txn);
  }
  if (paymentMode==='cash') {
    txn = {...baseTxn, type:'cash_sale', repaidAmount:parseFloat(amount), repaidAt:now};
    insertTxn.run(txn);
    if (paymentMethod) {
      const accId = `${uid}_${paymentMethod}`;
      adjustAccount(accId, parseFloat(amount), `নগদ বিক্রি: ${invItem.name}`, 'sale', txn.id);
    }
    if (req.body.createExpense) {
      db.prepare(`INSERT INTO expenses (id,userId,title,category,amount,shop,note,receiptPhoto,paymentMethod,date,createdAt) VALUES (?,?,?,?,?,?,?,?,?,?,?)`)
        .run(uuidv4(),uid,`পণ্য কিনলাম: ${invItem.name}`,'Supplier Purchase',parseFloat(amount),shop||'প্রধান শাখা',`${qty} × ৳${invItem.avgBuyPrice}`,null,paymentMethod||null,now,now);
    }
  }

  const updatedProduct = getProductAggregate(inventoryId, uid);
  res.status(201).json({ success: true, txn: { ...txn, reminded: false }, updatedStock: updatedProduct.totalStock });

});

// ─── Dashboard Route ──────────────────────────────────────────────────────────
app.get('/api/dashboard', (req, res) => {
  const uid   = req.session.userId;
  const { shop } = req.query;

  let customers    = db.prepare(`SELECT * FROM customers WHERE userId = ?`).all(uid);
  let transactions = db.prepare(`SELECT * FROM transactions WHERE userId = ?`).all(uid);

  if (shop) {
    customers    = customers.filter(c => c.shop === shop);
    const ids    = customers.map(c => c.id);
    transactions = ids.length
      ? db.prepare(`SELECT * FROM transactions WHERE userId = ? AND customerId IN (${ids.map(()=>'?').join(',')})`).all(uid, ...ids)
      : [];
  }

  const totalDebit  = transactions.filter(t => t.type === 'debit').reduce((s,t)=>s+t.amount,0);
  const totalCredit = transactions.filter(t => t.type === 'credit').reduce((s,t)=>s+t.amount,0);

  let totalReceivable = 0;
  customers.forEach(c => {
    const cTxns  = transactions.filter(t => t.customerId === c.id);
    const debit  = cTxns.filter(t => t.type === 'debit').reduce((s,t)=>s+t.amount,0);
    const credit = cTxns.filter(t => t.type === 'credit').reduce((s,t)=>s+t.amount,0);
    totalReceivable += Math.max(0, debit - credit);
  });

  const today = new Date();
  const overdue = transactions.filter(t =>
    t.type === 'debit' && t.dueDate && new Date(t.dueDate) < today && (t.repaidAmount||0) < t.amount
  );
  const overdueAmount = overdue.reduce((s,t) => s + (t.amount - (t.repaidAmount||0)), 0);

  const highRisk = customers.filter(c => calculateTrustScore(c.id, uid) < 40).length;

  const weekAgo = new Date(today - 7*24*60*60*1000);
  const weekTxns    = transactions.filter(t => new Date(t.date) > weekAgo);
  const weekCredit  = weekTxns.filter(t => t.type==='credit').reduce((s,t)=>s+t.amount,0);
  const weekDebit   = weekTxns.filter(t => t.type==='debit').reduce((s,t)=>s+t.amount,0);

  const accounts = db.prepare(`SELECT * FROM accounts WHERE userId = ? ORDER BY datetime(createdAt) ASC`).all(uid);

  const recentTransactions = transactions
    .sort((a,b) => new Date(b.date)-new Date(a.date))
    .slice(0,5)
    .map(t => {
      const c = customers.find(x => x.id===t.customerId);
      return { ...t, reminded:!!t.reminded, customerName: c?c.name:'অজানা' };
    });

  res.json({
    totalCustomers:    customers.length,
    totalReceivable:   Math.max(0, totalReceivable),
    totalPaid:         totalCredit,
    totalDebit,
    overdueAmount,
    overdueCount:      overdue.length,
    highRiskCustomers: highRisk,
    weeklyCredit:      weekCredit,
    weeklyDebit:       weekDebit,
    accounts,
    recentTransactions
  });
});

// ─── Monthly P&L Report ───────────────────────────────────────────────────────
app.get('/api/report/monthly', (req, res) => {
  const uid        = req.session.userId;
  const { year, shop } = req.query;
  const targetYear = parseInt(year) || new Date().getFullYear();

  let allCustomers = db.prepare(`SELECT * FROM customers WHERE userId = ?`).all(uid);
  let allTxns      = db.prepare(`SELECT * FROM transactions WHERE userId = ?`).all(uid);
  let expQuery     = `SELECT * FROM expenses WHERE userId = ? AND strftime('%Y', date) = ?`;
  const expArgs    = [uid, String(targetYear)];

  if (shop) {
    allCustomers = allCustomers.filter(c => c.shop === shop);
    const ids    = allCustomers.map(c => c.id);
    allTxns      = ids.length
      ? allTxns.filter(t => ids.includes(t.customerId))
      : [];
    expQuery += ` AND shop = ?`;
    expArgs.push(shop);
  }

  const allExpenses = db.prepare(expQuery).all(...expArgs);

  const months = Array.from({ length: 12 }, (_, i) => {
    const monthTxns = allTxns.filter(t => {
      const d = new Date(t.date);
      return d.getFullYear() === targetYear && d.getMonth() === i;
    });
    const monthExp = allExpenses.filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === targetYear && d.getMonth() === i;
    });

    const debit        = monthTxns.filter(t=>t.type==='debit').reduce((s,t)=>s+t.amount,0);
    const credit       = monthTxns.filter(t=>t.type==='credit').reduce((s,t)=>s+t.amount,0);
    const cashSales    = monthTxns.filter(t=>t.type==='cash_sale').reduce((s,t)=>s+t.amount,0);
    const totalExpense = monthExp.reduce((s,e)=>s+e.amount,0);
    const revenue      = credit + cashSales;
    const profit       = revenue - totalExpense;

    const byCategory = {};
    monthExp.forEach(e => { byCategory[e.category] = (byCategory[e.category]||0) + e.amount; });

    return {
      month:            i + 1,
      monthName:        new Date(targetYear, i).toLocaleString('bn-BD', { month:'long' }),
      totalDebit:       debit,
      totalCredit:      credit,
      cashSales,
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
  const uid   = req.session.userId;
  const year  = parseInt(req.params.year);
  const month = parseInt(req.params.month);
  if (isNaN(year)||isNaN(month)||month<1||month>12) return res.status(400).json({ error: 'Invalid year or month' });

  const { shop } = req.query;
  const dateFrom  = `${year}-${String(month).padStart(2,'0')}-01`;
  const lastDay   = new Date(year, month, 0).getDate();
  const dateTo    = `${year}-${String(month).padStart(2,'0')}-${String(lastDay).padStart(2,'0')}`;
  const tsFrom    = `${dateFrom}T00:00:00.000Z`;
  const tsTo      = `${dateTo}T23:59:59.999Z`;

  let allCustomers = db.prepare(`SELECT * FROM customers WHERE userId = ?`).all(uid);
  let scopedIds    = allCustomers.map(c => c.id);

  if (shop) {
    allCustomers = allCustomers.filter(c => c.shop === shop);
    scopedIds    = allCustomers.map(c => c.id);
    if (!scopedIds.length) return res.json(emptyMonthReport(year, month));
  }

  const idPH = scopedIds.map(()=>'?').join(',');

  const monthTxns = scopedIds.length
    ? db.prepare(`SELECT * FROM transactions WHERE userId = ? AND date >= ? AND date <= ? AND customerId IN (${idPH}) ORDER BY date ASC`).all(uid, tsFrom, tsTo, ...scopedIds)
    : [];

  const allTimeTxns = scopedIds.length
    ? db.prepare(`SELECT * FROM transactions WHERE userId = ? AND customerId IN (${idPH})`).all(uid, ...scopedIds)
    : [];

  let expQuery = `SELECT * FROM expenses WHERE userId = ? AND date >= ? AND date <= ?`;
  const expArgs = [uid, tsFrom, tsTo];
  if (shop) { expQuery += ` AND shop = ?`; expArgs.push(shop); }
  const monthExpenses = db.prepare(expQuery).all(...expArgs);

  const debits    = monthTxns.filter(t=>t.type==='debit');
  const credits   = monthTxns.filter(t=>t.type==='credit');
  const cashSales = monthTxns.filter(t=>t.type==='cash_sale');

  const creditSalesAmt  = debits.reduce((s,t)=>s+t.amount,0);
  const cashSalesAmt    = cashSales.reduce((s,t)=>s+t.amount,0);
  const collectionsAmt  = credits.reduce((s,t)=>s+t.amount,0);
  const totalRevenue    = cashSalesAmt + collectionsAmt;
  const totalExpense    = monthExpenses.reduce((s,e)=>s+e.amount,0);
  const netProfit       = totalRevenue - totalExpense;

  let totalCurrentDue = 0;
  scopedIds.forEach(cid => {
    const cTxns  = allTimeTxns.filter(t=>t.customerId===cid);
    const cDebit = cTxns.filter(t=>t.type==='debit').reduce((s,t)=>s+t.amount,0);
    const cCred  = cTxns.filter(t=>t.type==='credit').reduce((s,t)=>s+t.amount,0);
    totalCurrentDue += Math.max(0, cDebit - cCred);
  });

  const todayISO  = new Date().toISOString();
  const overdueAmt = allTimeTxns
    .filter(t=>t.type==='debit'&&t.dueDate&&t.dueDate<todayISO&&(t.repaidAmount||0)<t.amount)
    .reduce((s,t)=>s+(t.amount-(t.repaidAmount||0)),0);

  const paymentBreakdown = {};
  [...credits,...cashSales].forEach(t=>{const m=t.paymentMethod||'unspecified';paymentBreakdown[m]=(paymentBreakdown[m]||0)+t.amount;});

  const PAYMENT_METHODS = ['cash','bkash','nagad','rocket','bank'];
  const paymentAnalytics = {};
  PAYMENT_METHODS.forEach(m=>{paymentAnalytics[m]={received:0,spent:0,net:0};});
  paymentAnalytics['unspecified']={received:0,spent:0,net:0};
  [...cashSales,...credits].forEach(t=>{const m=t.paymentMethod||'unspecified';if(!paymentAnalytics[m])paymentAnalytics[m]={received:0,spent:0,net:0};paymentAnalytics[m].received+=t.amount;});
  monthExpenses.forEach(e=>{const m=e.paymentMethod||'unspecified';if(!paymentAnalytics[m])paymentAnalytics[m]={received:0,spent:0,net:0};paymentAnalytics[m].spent+=e.amount;});
  Object.keys(paymentAnalytics).forEach(m=>{paymentAnalytics[m].net=paymentAnalytics[m].received-paymentAnalytics[m].spent;});
  const paymentAnalyticsFinal = Object.fromEntries(Object.entries(paymentAnalytics).filter(([,v])=>v.received>0||v.spent>0));

  const EXPENSE_CATEGORIES=['Supplier Purchase','Salary','Transportation','Electricity','Rent','Internet','Repair','Tax','Packaging','Misc'];
  const expCatAnalytics={};
  EXPENSE_CATEGORIES.forEach(cat=>{expCatAnalytics[cat]={amount:0,count:0,pct:0};});
  monthExpenses.forEach(e=>{const cat=e.category||'Misc';if(!expCatAnalytics[cat])expCatAnalytics[cat]={amount:0,count:0,pct:0};expCatAnalytics[cat].amount+=e.amount;expCatAnalytics[cat].count+=1;});
  Object.keys(expCatAnalytics).forEach(cat=>{expCatAnalytics[cat].pct=totalExpense>0?Math.round((expCatAnalytics[cat].amount/totalExpense)*100):0;});
  const expCatFinal=Object.fromEntries(Object.entries(expCatAnalytics).filter(([,v])=>v.amount>0).sort(([,a],[,b])=>b.amount-a.amount));

  const productMap={};
  [...debits,...cashSales].forEach(t=>{if(!t.productName)return;if(!productMap[t.productName])productMap[t.productName]={name:t.productName,qty:0,revenue:0,txnCount:0};productMap[t.productName].qty+=(t.soldQuantity||1);productMap[t.productName].revenue+=t.amount;productMap[t.productName].txnCount+=1;});
  const productStats=Object.values(productMap).sort((a,b)=>b.revenue-a.revenue);

  const productRows = listProductsAggregated(uid);
  const enrichedProductStats = productStats.map(p => {
    const inv = productRows.find(i => i.name === p.name);
    return {
      ...p,
      currentStock: inv ? inv.totalStock    : null,
      sellPrice:    inv ? inv.sellPrice     : null,
      buyPrice:     inv ? inv.avgBuyPrice   : null,
      expiryDate:   inv ? inv.nearestExpiry : null,
      isLowStock:   inv ? inv.totalStock < 10 : false,
      isExpired:    inv && inv.nearestExpiry ? new Date(inv.nearestExpiry) < new Date() : false,
      margin:       inv && inv.avgBuyPrice > 0 ? Math.round(((inv.sellPrice - inv.avgBuyPrice) / inv.avgBuyPrice) * 100) : null
    };
  });

  const lowStockItems = productRows
    .filter(p => p.totalStock < 10)
    .sort((a, b) => a.totalStock - b.totalStock)
    .slice(0, 10)
    .map(p => ({ name: p.name, quantity: p.totalStock }));

  const thirtyDays = new Date(); thirtyDays.setDate(thirtyDays.getDate() + 30);
  const expiringBatches = db.prepare(`
    SELECT b.*, p.name AS productName FROM inventory_batches b
    JOIN products p ON p.id = b.productId
    WHERE b.userId = ? AND b.remainingQuantity > 0
      AND b.expiryDate IS NOT NULL AND b.expiryDate <= ? AND b.expiryDate >= ?
    ORDER BY b.expiryDate ASC LIMIT 10
  `).all(uid, thirtyDays.toISOString(), new Date().toISOString());
  const expiringItems = expiringBatches.map(b => ({ name: b.productName, expiryDate: b.expiryDate, quantity: b.remainingQuantity }));

  const customerMap={};
  monthTxns.forEach(t=>{const c=allCustomers.find(x=>x.id===t.customerId);const name=c?c.name:'অজানা';if(!customerMap[t.customerId])customerMap[t.customerId]={id:t.customerId,name,purchased:0,paid:0,txnCount:0};if(t.type==='debit'||t.type==='cash_sale')customerMap[t.customerId].purchased+=t.amount;if(t.type==='credit'||t.type==='cash_sale')customerMap[t.customerId].paid+=t.amount;customerMap[t.customerId].txnCount+=1;});
  const customerStats=Object.values(customerMap).sort((a,b)=>b.purchased-a.purchased).slice(0,10);
  const enrichedCustomerStats=customerStats.map(c=>{const cAll=allTimeTxns.filter(t=>t.customerId===c.id);const allD=cAll.filter(t=>t.type==='debit').reduce((s,t)=>s+t.amount,0);const allC=cAll.filter(t=>t.type==='credit').reduce((s,t)=>s+t.amount,0);return{...c,allTimeDue:Math.max(0,allD-allC),repayPct:allD>0?Math.min(100,Math.round((allC/allD)*100)):100,trustScore:calculateTrustScore(c.id,uid)};});

  const highDueCustomers=scopedIds.map(cid=>{const c=allCustomers.find(x=>x.id===cid);const cT=allTimeTxns.filter(t=>t.customerId===cid);const d=cT.filter(t=>t.type==='debit').reduce((s,t)=>s+t.amount,0);const cr=cT.filter(t=>t.type==='credit').reduce((s,t)=>s+t.amount,0);return{id:cid,name:c?c.name:'অজানা',due:Math.max(0,d-cr),phone:c?.phone||''};}).filter(c=>c.due>0).sort((a,b)=>b.due-a.due).slice(0,8);

  const overdueCustomerMap={};
  allTimeTxns.filter(t=>t.type==='debit'&&t.dueDate&&t.dueDate<todayISO&&(t.repaidAmount||0)<t.amount&&scopedIds.includes(t.customerId)).forEach(t=>{const out=t.amount-(t.repaidAmount||0);if(!overdueCustomerMap[t.customerId])overdueCustomerMap[t.customerId]={id:t.customerId,overdueAmt:0,overdueCount:0};overdueCustomerMap[t.customerId].overdueAmt+=out;overdueCustomerMap[t.customerId].overdueCount+=1;});
  const overdueCustomers=Object.values(overdueCustomerMap).map(c=>{const cu=allCustomers.find(x=>x.id===c.id);return{...c,name:cu?cu.name:'অজানা',phone:cu?.phone||''};}).sort((a,b)=>b.overdueAmt-a.overdueAmt).slice(0,8);

  const topRepayers=customerStats.filter(c=>c.paid>0).sort((a,b)=>b.paid-a.paid).slice(0,5);

  // Daily cash flow
  const dailyMap={};
  for(let d=1;d<=lastDay;d++){const key=`${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;dailyMap[key]={date:key,cashSales:0,collections:0,creditSales:0,revenue:0,expenses:0,profit:0,txnCount:0,expCount:0};}
  monthTxns.forEach(t=>{const key=t.date.split('T')[0];if(!dailyMap[key])return;if(t.type==='cash_sale'){dailyMap[key].cashSales+=t.amount;dailyMap[key].revenue+=t.amount;}if(t.type==='credit'){dailyMap[key].collections+=t.amount;dailyMap[key].revenue+=t.amount;}if(t.type==='debit')dailyMap[key].creditSales+=t.amount;dailyMap[key].txnCount+=1;});
  monthExpenses.forEach(e=>{const key=e.date.split('T')[0];if(!dailyMap[key])return;dailyMap[key].expenses+=e.amount;dailyMap[key].expCount+=1;});
  const dailyBreakdown=Object.values(dailyMap);
  dailyBreakdown.forEach(d=>{d.profit=d.revenue-d.expenses;});

  let runR=0,runE=0,runP=0;
  const cumulativeFlow=dailyBreakdown.map(d=>{runR+=d.revenue;runE+=d.expenses;runP+=d.profit;return{date:d.date,revenue:runR,expense:runE,profit:runP};});

  // Insights
  const highestSaleDay    = dailyBreakdown.reduce((b,d)=>d.revenue>(b?.revenue||0)?d:b,null);
  const highestExpenseDay = dailyBreakdown.reduce((b,d)=>d.expenses>(b?.expenses||0)?d:b,null);
  const bestProfitDay     = dailyBreakdown.reduce((b,d)=>d.profit>(b?.profit||0)?d:b,null);
  const busiestDay        = dailyBreakdown.reduce((b,d)=>d.txnCount>(b?.txnCount||0)?d:b,null);
  const largestTxn        = [...debits,...cashSales].reduce((b,t)=>t.amount>(b?.amount||0)?t:b,null);
  const largestTxnCust    = largestTxn?allCustomers.find(c=>c.id===largestTxn.customerId):null;
  const largestExpense    = monthExpenses.reduce((b,e)=>e.amount>(b?.amount||0)?e:b,null);
  const mostSoldProduct   = enrichedProductStats.length?enrichedProductStats.reduce((b,p)=>p.qty>(b?.qty||0)?p:b,null):null;
  const mostActiveCust    = enrichedCustomerStats.length?enrichedCustomerStats.reduce((b,c)=>c.txnCount>(b?.txnCount||0)?c:b,null):null;
  const activeDaysCount   = dailyBreakdown.filter(d=>d.revenue>0).length;
  const avgDailyRevenue   = activeDaysCount>0?Math.round(totalRevenue/activeDaysCount):0;

  const insights={
    highestSaleDay:    highestSaleDay?.revenue>0?{date:highestSaleDay.date,value:highestSaleDay.revenue,txnCount:highestSaleDay.txnCount}:null,
    highestExpenseDay: highestExpenseDay?.expenses>0?{date:highestExpenseDay.date,value:highestExpenseDay.expenses,expCount:highestExpenseDay.expCount}:null,
    bestProfitDay:     bestProfitDay?.profit>0?{date:bestProfitDay.date,value:bestProfitDay.profit}:null,
    busiestDay:        busiestDay?.txnCount>0?{date:busiestDay.date,txnCount:busiestDay.txnCount}:null,
    largestTxn:        largestTxn?{amount:largestTxn.amount,type:largestTxn.type,date:largestTxn.date,note:largestTxn.note||null,productName:largestTxn.productName||null,customerName:largestTxnCust?largestTxnCust.name:'অজানা'}:null,
    largestExpense:    largestExpense?{amount:largestExpense.amount,title:largestExpense.title,category:largestExpense.category,date:largestExpense.date}:null,
    mostSoldProduct:   mostSoldProduct?{name:mostSoldProduct.name,qty:mostSoldProduct.qty,revenue:mostSoldProduct.revenue,currentStock:mostSoldProduct.currentStock}:null,
    mostActiveCustomer:mostActiveCust?{id:mostActiveCust.id,name:mostActiveCust.name,txnCount:mostActiveCust.txnCount,purchased:mostActiveCust.purchased}:null,
    avgDailyRevenue,
    activeDaysCount
  };

  res.json({
    year,month,
    monthName:  new Date(year,month-1).toLocaleString('bn-BD',{month:'long'}),
    dateFrom,dateTo,shop:shop||null,
    summary:{creditSalesAmt,cashSalesAmt,collectionsAmt,totalRevenue,totalExpense,netProfit,totalCurrentDue,overdueAmt,txnCount:monthTxns.length,expenseCount:monthExpenses.length,debitCount:debits.length,creditCount:credits.length,cashCount:cashSales.length,customerCount:Object.keys(customerMap).length},
    paymentBreakdown,paymentAnalytics:paymentAnalyticsFinal,expCategoryAnalytics:expCatFinal,
    productStats:enrichedProductStats,lowStockItems,expiringItems,
    customerStats:enrichedCustomerStats,highDueCustomers,overdueCustomers,topRepayers,
    dailyBreakdown,cumulativeFlow,insights,
    transactions:monthTxns.map(t=>{const c=allCustomers.find(x=>x.id===t.customerId);return{...t,customerName:c?c.name:'অজানা'};}),
    expenses:monthExpenses
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
  const uid                          = req.session.userId;
  const { customerId, transactionId, message } = req.body;

  const customer = db.prepare(`SELECT * FROM customers WHERE id = ? AND userId = ?`).get(customerId, uid);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });

  if (transactionId) {
    db.prepare(`UPDATE transactions SET reminded = 1, reminderSentAt = ? WHERE id = ? AND userId = ?`)
      .run(new Date().toISOString(), transactionId, uid);
  }

  const smsLog = { to: customer.phone, name: customer.name, message: message||`প্রিয় ${customer.name}, আপনার বকেয়া পরিশোধ করুন। ধন্যবাদ।`, sentAt: new Date().toISOString(), status: 'simulated' };
  console.log('📱 SMS Simulated:', smsLog);
  res.json({ success: true, smsLog });
});

// ─── Data Backup ──────────────────────────────────────────────────────────────
app.get('/api/backup', (req, res) => {
  const uid = req.session.userId;
  const customers          = db.prepare(`SELECT * FROM customers WHERE userId=?`).all(uid);
  const transactions       = db.prepare(`SELECT * FROM transactions WHERE userId=?`).all(uid);
  const inventory          = db.prepare(`SELECT * FROM inventory WHERE userId=?`).all(uid);
  const suppliers          = db.prepare(`SELECT * FROM suppliers WHERE userId=?`).all(uid);
  const supplierTxns       = db.prepare(`SELECT * FROM supplier_transactions WHERE userId=?`).all(uid);
  const expenses           = db.prepare(`SELECT * FROM expenses WHERE userId=?`).all(uid);
  const accounts           = db.prepare(`SELECT * FROM accounts WHERE userId=?`).all(uid);
  const accountTxns        = db.prepare(`SELECT * FROM account_transactions WHERE userId=?`).all(uid);
  const settings           = readUserSettings(uid);
  const backup = {
    exportedAt:'',version:'3.0',userId:uid,
    customers,transactions,inventory,suppliers,
    supplierTransactions:supplierTxns,expenses,accounts,
    accountTransactions:accountTxns,
    shopName:settings.shopName,ownerName:settings.ownerName,shops:settings.shops
  };
  backup.exportedAt = new Date().toISOString();
  res.setHeader('Content-Disposition',`attachment; filename=halkhata_backup_${Date.now()}.json`);
  res.setHeader('Content-Type','application/json');
  res.json(backup);
});

app.post('/api/restore', (req, res) => {
  const uid                           = req.session.userId;
  const { customers, transactions }   = req.body;

  if (customers) {
    db.prepare(`DELETE FROM customers WHERE userId = ?`).run(uid);
    const ins = db.prepare(`INSERT OR IGNORE INTO customers (id,userId,name,phone,address,creditLimit,shop,trustScore,createdAt) VALUES (@id,@userId,@name,@phone,@address,@creditLimit,@shop,@trustScore,@createdAt)`);
    const now = new Date().toISOString();
    db.transaction(()=>{
      customers.forEach(c => ins.run({ id:c.id, userId:uid, name:c.name||'', phone:c.phone||'', address:c.address||'', creditLimit:c.creditLimit||5000, shop:c.shop||'প্রধান শাখা', trustScore:c.trustScore||75, createdAt:c.createdAt||now }));
    })();
  }

  if (transactions) {
    db.prepare(`DELETE FROM transactions WHERE userId = ?`).run(uid);
    const ins = db.prepare(`INSERT OR IGNORE INTO transactions (id,userId,customerId,type,amount,note,dueDate,shop,date,photo,repaidAmount,repaidAt,reminded,inventoryId,productName,soldQuantity,paymentMethod,saleType) VALUES (@id,@userId,@customerId,@type,@amount,@note,@dueDate,@shop,@date,@photo,@repaidAmount,@repaidAt,@reminded,@inventoryId,@productName,@soldQuantity,@paymentMethod,@saleType)`);
    const now = new Date().toISOString();
    db.transaction(()=>{
      transactions.forEach(t => ins.run({ id:t.id, userId:uid, customerId:t.customerId, type:t.type, amount:t.amount||0, note:t.note||'', dueDate:t.dueDate||null, shop:t.shop||'প্রধান শাখা', date:t.date||now, photo:t.photo||null, repaidAmount:t.repaidAmount||0, repaidAt:t.repaidAt||null, reminded:t.reminded?1:0, inventoryId:t.inventoryId||null, productName:t.productName||null, soldQuantity:t.soldQuantity||null, paymentMethod:t.paymentMethod||null, saleType:t.saleType||null }));
    })();
  }

  res.json({ success: true });
});

// ─── Overdue Check ────────────────────────────────────────────────────────────
app.get('/api/overdue', (req, res) => {
  const uid          = req.session.userId;
  const transactions = db.prepare(`SELECT * FROM transactions WHERE userId = ?`).all(uid);
  const customers    = db.prepare(`SELECT * FROM customers    WHERE userId = ?`).all(uid);
  const today        = new Date();

  const overdue = transactions
    .filter(t => t.type==='debit' && t.dueDate && new Date(t.dueDate)<today && (t.repaidAmount||0)<t.amount)
    .map(t => {
      const c = customers.find(x=>x.id===t.customerId);
      return { ...t, customerName:c?c.name:'অজানা', customerPhone:c?c.phone:'', outstanding:t.amount-(t.repaidAmount||0), daysOverdue:Math.floor((today-new Date(t.dueDate))/(1000*60*60*24)) };
    })
    .sort((a,b)=>b.daysOverdue-a.daysOverdue);

  res.json(overdue);
});

// ─── Inventory Routes ─────────────────────────────────
app.get('/api/inventory', (req, res) => {
  const uid = req.session.userId;
  const products = listProductsAggregated(uid, req.query.shop);
  // Legacy-compatible shape for any code that still expects flat inventory rows
  res.json(products.map(p => ({
    id:           p.id,
    name:         p.name,
    buyPrice:     p.avgBuyPrice,
    sellPrice:    p.sellPrice,
    quantity:     p.totalStock,
    buyDate:      p.batches[0]?.buyDate || null,
    expiryDate:   p.nearestExpiry,
    supplierId:   null,
    shop:         p.shop,
    createdAt:    p.createdAt,
    batchCount:   p.batchCount
  })));
});

app.post('/api/inventory',(req,res)=>{
  const uid=req.session.userId;
  const{name,buyPrice,sellPrice,quantity,buyDate,expiryDate,shop,supplierId}=req.body;
  if(!name)return res.status(400).json({error:'Name required'});
  const item={id:uuidv4(),userId:uid,name,buyPrice:parseFloat(buyPrice)||0,sellPrice:parseFloat(sellPrice)||0,quantity:parseInt(quantity)||0,buyDate:buyDate||null,expiryDate:expiryDate||null,supplierId:supplierId||null,shop:shop||'প্রধান শাখা',createdAt:new Date().toISOString()};
  db.prepare(`INSERT INTO inventory (id,userId,name,buyPrice,sellPrice,quantity,buyDate,expiryDate,supplierId,shop,createdAt) VALUES (@id,@userId,@name,@buyPrice,@sellPrice,@quantity,@buyDate,@expiryDate,@supplierId,@shop,@createdAt)`).run(item);
  if(item.supplierId&&item.quantity>0&&item.buyPrice>0){
    const sup=db.prepare(`SELECT id FROM suppliers WHERE id=? AND userId=?`).get(item.supplierId,uid);
    if(sup){const total=item.quantity*item.buyPrice;const now=new Date().toISOString();db.prepare(`INSERT INTO supplier_transactions (id,userId,supplierId,type,amount,note,date,createdAt) VALUES (?,?,?,?,?,?,?,?)`).run(uuidv4(),uid,item.supplierId,'debit',total,`পণ্য কিনলাম: ${item.name}`,now,now);}
  }
  res.status(201).json(item);
});

app.put('/api/inventory/:id',(req,res)=>{
  const uid=req.session.userId;
  const ex=db.prepare(`SELECT * FROM inventory WHERE id=? AND userId=?`).get(req.params.id,uid);
  if(!ex)return res.status(404).json({error:'Not found'});
  const{name,buyPrice,sellPrice,quantity,buyDate,expiryDate,shop,supplierId}=req.body;
  db.prepare(`UPDATE inventory SET name=@name,buyPrice=@bp,sellPrice=@sp,quantity=@qty,buyDate=@bd,expiryDate=@ed,shop=@shop,supplierId=@sid WHERE id=@id AND userId=@uid`).run({id:req.params.id,uid,name:name??ex.name,bp:parseFloat(buyPrice)??ex.buyPrice,sp:parseFloat(sellPrice)??ex.sellPrice,qty:parseInt(quantity)??ex.quantity,bd:buyDate??ex.buyDate,ed:expiryDate??ex.expiryDate,shop:shop??ex.shop,sid:supplierId??ex.supplierId});
  res.json(db.prepare(`SELECT * FROM inventory WHERE id=?`).get(req.params.id));
});

app.delete('/api/inventory/:id',(req,res)=>{
  const uid=req.session.userId;
  db.prepare(`DELETE FROM inventory WHERE id=? AND userId=?`).run(req.params.id,uid);
  res.json({success:true});
});

// ─── Product Routes (new batch-aware inventory) ───────
app.get('/api/products', (req, res) => {
  const uid = req.session.userId;
  res.json(listProductsAggregated(uid, req.query.shop));
});

app.get('/api/products/:id', (req, res) => {
  const uid = req.session.userId;
  const agg = getProductAggregate(req.params.id, uid);
  if (!agg) return res.status(404).json({ error: 'Product not found' });
  res.json(agg);
});

app.post('/api/products', (req, res) => {
  const uid = req.session.userId;
  const { name, sellPrice, shop, quantity, buyPrice, buyDate, expiryDate, supplierId, autoExpense } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });

  const shopVal  = shop || 'প্রধান শাখা';
  const existing = db.prepare(`SELECT id FROM products WHERE userId = ? AND name = ? AND shop = ?`).get(uid, name, shopVal);
  if (existing) return res.status(409).json({ error: 'এই নামে পণ্য ইতিমধ্যে আছে', existingId: existing.id });

  const now       = new Date().toISOString();
  const productId = uuidv4();

  db.transaction(() => {
    db.prepare(`INSERT INTO products (id,userId,name,sellPrice,shop,createdAt) VALUES (?,?,?,?,?,?)`)
      .run(productId, uid, name, parseFloat(sellPrice) || 0, shopVal, now);

    if (quantity && parseInt(quantity) > 0) {
      const batchId = uuidv4();
      const qty     = parseInt(quantity);
      const bp      = parseFloat(buyPrice) || 0;

      db.prepare(`
        INSERT INTO inventory_batches (id,userId,productId,quantity,remainingQuantity,buyPrice,expiryDate,buyDate,supplierId,shop,createdAt)
        VALUES (?,?,?,?,?,?,?,?,?,?,?)
      `).run(batchId, uid, productId, qty, qty, bp, expiryDate || null, buyDate || now, supplierId || null, shopVal, now);

      if (supplierId && qty > 0 && bp > 0) {
        const sup = db.prepare(`SELECT id FROM suppliers WHERE id=? AND userId=?`).get(supplierId, uid);
        if (sup) {
          db.prepare(`INSERT INTO supplier_transactions (id,userId,supplierId,type,amount,note,date,createdAt) VALUES (?,?,?,?,?,?,?,?)`)
            .run(uuidv4(), uid, supplierId, 'debit', qty * bp, `পণ্য কিনলাম: ${name} (${qty} × ৳${bp})`, now, now);
        }
      }
      if (autoExpense && bp > 0 && qty > 0) {
        db.prepare(`INSERT INTO expenses (id,userId,title,category,amount,shop,note,receiptPhoto,paymentMethod,date,createdAt) VALUES (?,?,?,?,?,?,?,?,?,?,?)`)
          .run(uuidv4(), uid, `পণ্য ক্রয়: ${name}`, 'Supplier Purchase', qty*bp, shopVal, `${qty} × ৳${bp}`, null, null, buyDate || now, now);
      }
    }
  })();

  res.status(201).json(getProductAggregate(productId, uid));
});

app.post('/api/products/:id/batches', (req, res) => {
  const uid     = req.session.userId;
  const product = db.prepare(`SELECT * FROM products WHERE id=? AND userId=?`).get(req.params.id, uid);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const { quantity, buyPrice, buyDate, expiryDate, supplierId, autoExpense } = req.body;
  if (!quantity || parseInt(quantity) <= 0) return res.status(400).json({ error: 'পরিমাণ দিন' });

  const now    = new Date().toISOString();
  const qty    = parseInt(quantity);
  const bp     = parseFloat(buyPrice) || 0;
  const batchId = uuidv4();

  db.transaction(() => {
    db.prepare(`
      INSERT INTO inventory_batches (id,userId,productId,quantity,remainingQuantity,buyPrice,expiryDate,buyDate,supplierId,shop,createdAt)
      VALUES (?,?,?,?,?,?,?,?,?,?,?)
    `).run(batchId, uid, product.id, qty, qty, bp, expiryDate || null, buyDate || now, supplierId || null, product.shop, now);

    if (supplierId && qty > 0 && bp > 0) {
      const sup = db.prepare(`SELECT id FROM suppliers WHERE id=? AND userId=?`).get(supplierId, uid);
      if (sup) {
        db.prepare(`INSERT INTO supplier_transactions (id,userId,supplierId,type,amount,note,date,createdAt) VALUES (?,?,?,?,?,?,?,?)`)
          .run(uuidv4(), uid, supplierId, 'debit', qty*bp, `পণ্য কিনলাম: ${product.name} (${qty} × ৳${bp})`, now, now);
      }
    }
    if (autoExpense && bp > 0 && qty > 0) {
      db.prepare(`INSERT INTO expenses (id,userId,title,category,amount,shop,note,receiptPhoto,paymentMethod,date,createdAt) VALUES (?,?,?,?,?,?,?,?,?,?,?)`)
        .run(uuidv4(), uid, `পণ্য ক্রয়: ${product.name}`, 'Supplier Purchase', qty*bp, product.shop, `${qty} × ৳${bp}`, null, null, buyDate || now, now);
    }
  })();

  res.status(201).json(getProductAggregate(product.id, uid));
});

app.put('/api/products/:id', (req, res) => {
  const uid      = req.session.userId;
  const existing = db.prepare(`SELECT * FROM products WHERE id=? AND userId=?`).get(req.params.id, uid);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  const { name, sellPrice, shop } = req.body;
  db.prepare(`UPDATE products SET name=@name, sellPrice=@sellPrice, shop=@shop WHERE id=@id AND userId=@uid`)
    .run({ id: req.params.id, uid, name: name ?? existing.name, sellPrice: sellPrice!==undefined?parseFloat(sellPrice):existing.sellPrice, shop: shop ?? existing.shop });
  res.json(getProductAggregate(req.params.id, uid));
});

app.delete('/api/products/:id', (req, res) => {
  const uid = req.session.userId;
  db.prepare(`DELETE FROM inventory_batches WHERE productId=? AND userId=?`).run(req.params.id, uid);
  db.prepare(`DELETE FROM products WHERE id=? AND userId=?`).run(req.params.id, uid);
  res.json({ success: true });
});

app.put('/api/batches/:id', (req, res) => {
  const uid   = req.session.userId;
  const batch = db.prepare(`SELECT * FROM inventory_batches WHERE id=? AND userId=?`).get(req.params.id, uid);
  if (!batch) return res.status(404).json({ error: 'Batch not found' });
  const { quantity, remainingQuantity, buyPrice, expiryDate, buyDate } = req.body;
  db.prepare(`UPDATE inventory_batches SET quantity=@q, remainingQuantity=@rq, buyPrice=@bp, expiryDate=@ed, buyDate=@bd WHERE id=@id AND userId=@uid`)
    .run({
      id: req.params.id, uid,
      q:  quantity!==undefined ? parseInt(quantity) : batch.quantity,
      rq: remainingQuantity!==undefined ? parseInt(remainingQuantity) : batch.remainingQuantity,
      bp: buyPrice!==undefined ? parseFloat(buyPrice) : batch.buyPrice,
      ed: expiryDate!==undefined ? expiryDate : batch.expiryDate,
      bd: buyDate!==undefined ? buyDate : batch.buyDate
    });
  res.json(getProductAggregate(batch.productId, uid));
});

app.delete('/api/batches/:id', (req, res) => {
  const uid   = req.session.userId;
  const batch = db.prepare(`SELECT * FROM inventory_batches WHERE id=? AND userId=?`).get(req.params.id, uid);
  if (!batch) return res.status(404).json({ error: 'Batch not found' });
  db.prepare(`DELETE FROM inventory_batches WHERE id=? AND userId=?`).run(req.params.id, uid);
  res.json(getProductAggregate(batch.productId, uid));
});

// ─── Supplier Routes ──────────────────────────────────
app.get('/api/suppliers', (req, res) => {
  const uid       = req.session.userId;
  const suppliers = db.prepare(`SELECT * FROM suppliers WHERE userId = ? ORDER BY createdAt DESC`).all(uid);

  const result = suppliers.map(s => {
    const totals = db.prepare(`
      SELECT
        COALESCE(SUM(CASE WHEN type = 'debit'  THEN amount ELSE 0 END), 0) AS totalOwed,
        COALESCE(SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END), 0) AS totalPaid
      FROM supplier_transactions WHERE supplierId = ? AND userId = ?
    `).get(s.id, uid);
    return { ...s, totalOwed: totals.totalOwed, totalPaid: totals.totalPaid, balance: Math.max(0, totals.totalOwed - totals.totalPaid) };
  });

  res.json(result);
});

app.post('/api/suppliers', (req, res) => {
  const uid              = req.session.userId;
  const { name, phone, address } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });

  const supplier = { id: uuidv4(), userId: uid, name, phone: phone||'', address: address||'', createdAt: new Date().toISOString() };
  db.prepare(`INSERT INTO suppliers (id, userId, name, phone, address, createdAt) VALUES (@id, @userId, @name, @phone, @address, @createdAt)`).run(supplier);
  res.status(201).json(supplier);
});

app.delete('/api/suppliers/:id', (req, res) => {
  const uid = req.session.userId;
  const sup = db.prepare(`SELECT id FROM suppliers WHERE id = ? AND userId = ?`).get(req.params.id, uid);
  if (!sup) return res.status(404).json({ error: 'Not found' });
  // CASCADE in db.js handles supplier_transactions via FK
  db.prepare(`DELETE FROM suppliers WHERE id = ? AND userId = ?`).run(req.params.id, uid);
  res.json({ success: true });
});

app.get('/api/suppliers/:id', (req, res) => {
  const uid      = req.session.userId;
  const supplier = db.prepare(`SELECT * FROM suppliers WHERE id = ? AND userId = ?`).get(req.params.id, uid);
  if (!supplier) return res.status(404).json({ error: 'Not found' });

  const txns   = db.prepare(`SELECT * FROM supplier_transactions WHERE supplierId = ? AND userId = ? ORDER BY date DESC`).all(req.params.id, uid);
  const totals = db.prepare(`
    SELECT
      COALESCE(SUM(CASE WHEN type = 'debit'  THEN amount ELSE 0 END), 0) AS totalOwed,
      COALESCE(SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END), 0) AS totalPaid
    FROM supplier_transactions WHERE supplierId = ? AND userId = ?
  `).get(req.params.id, uid);

  res.json({ ...supplier, totalOwed: totals.totalOwed, totalPaid: totals.totalPaid, balance: Math.max(0, totals.totalOwed - totals.totalPaid), transactions: txns });
});

app.get('/api/suppliers/:id/transactions', (req, res) => {
  const uid  = req.session.userId;
  const txns = db.prepare(`SELECT * FROM supplier_transactions WHERE supplierId = ? AND userId = ? ORDER BY date DESC`).all(req.params.id, uid);
  res.json(txns);
});

app.post('/api/supplier-transactions', (req, res) => {
  const uid                        = req.session.userId;
  const { supplierId, type, amount, note } = req.body;
  if (!supplierId || !type || !amount) return res.status(400).json({ error: 'supplierId, type, amount required' });

  const supplier = db.prepare(`SELECT id FROM suppliers WHERE id = ? AND userId = ?`).get(supplierId, uid);
  if (!supplier) return res.status(404).json({ error: 'Supplier not found' });

  const now = new Date().toISOString();
  const txn = { id: uuidv4(), userId: uid, supplierId, type, amount: parseFloat(amount), note: note||'', date: now, createdAt: now };
  db.prepare(`INSERT INTO supplier_transactions (id, userId, supplierId, type, amount, note, date, createdAt) VALUES (@id, @userId, @supplierId, @type, @amount, @note, @date, @createdAt)`).run(txn);

  if (type === 'credit' && req.body.paymentMethod) {
    const accId = `${uid}_${req.body.paymentMethod}`;
    adjustAccount(accId, -parseFloat(amount), `সরবরাহকারী পেমেন্ট`, 'supplier_transaction', txn.id);
  }

  res.status(201).json(txn);
});

// ─── Expense Routes ───────────────────────────────────
app.get('/api/expenses', (req, res) => {
  const uid                      = req.session.userId;
  const { shop, category, date } = req.query;
  let query  = `SELECT * FROM expenses WHERE userId = ?`;
  const args = [uid];
  if (shop)     { query += ` AND shop = ?`;     args.push(shop); }
  if (category) { query += ` AND category = ?`; args.push(category); }
  if (date)     { query += ` AND date LIKE ?`;   args.push(`${date}%`); }
  query += ` ORDER BY date DESC`;
  res.json(db.prepare(query).all(...args));
});

app.post('/api/expenses', (req, res) => {
  const uid                                    = req.session.userId;
  const { title, category, amount, shop, note, date } = req.body;
  if (!title || !amount) return res.status(400).json({ error: 'title and amount required' });

  const now     = new Date().toISOString();
  const expense = {
    id:            uuidv4(),
    userId:        uid,
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
    INSERT INTO expenses (id, userId, title, category, amount, shop, note, receiptPhoto, paymentMethod, date, createdAt)
    VALUES (@id, @userId, @title, @category, @amount, @shop, @note, @receiptPhoto, @paymentMethod, @date, @createdAt)
  `).run(expense);

  if (req.body.paymentMethod) {
    const accId = `${uid}_${req.body.paymentMethod}`;
    adjustAccount(accId, -parseFloat(amount), `খরচ: ${title}`, 'expense', expense.id);
  }

  res.status(201).json(expense);
});



app.put('/api/expenses/:id', (req, res) => {
  const uid      = req.session.userId;
  const existing = db.prepare(`SELECT * FROM expenses WHERE id = ? AND userId = ?`).get(req.params.id, uid);
  if (!existing) return res.status(404).json({ error: 'Not found' });

  const { title, category, amount, shop, note, date } = req.body;
  db.prepare(`
    UPDATE expenses
    SET title=@title, category=@category, amount=@amount, shop=@shop, note=@note, date=@date
    WHERE id=@id AND userId=@uid
  `).run({
    id:       req.params.id,
    uid,
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
  const uid = req.session.userId;
  db.prepare(`DELETE FROM expenses WHERE id = ? AND userId = ?`).run(req.params.id, uid);
  res.json({ success: true });
});

app.post('/api/expenses/:id/photo', upload.single('photo'), (req, res) => {
  const uid      = req.session.userId;
  const existing = db.prepare(`SELECT * FROM expenses WHERE id = ? AND userId = ?`).get(req.params.id, uid);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  if (!req.file)  return res.status(400).json({ error: 'No file' });
  const photoPath = `/uploads/${req.file.filename}`;
  db.prepare(`UPDATE expenses SET receiptPhoto = ? WHERE id = ? AND userId = ?`).run(photoPath, req.params.id, uid);
  res.json(db.prepare(`SELECT * FROM expenses WHERE id = ?`).get(req.params.id));
});

// ─── Account Routes ───────────────────────────────────
app.get('/api/accounts', (req, res) => {
  const uid = req.session.userId;
  res.json(db.prepare(`SELECT * FROM accounts WHERE userId = ? ORDER BY datetime(createdAt) ASC`).all(uid));
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
  const uid     = req.session.userId;
  const account = db.prepare(`SELECT * FROM accounts WHERE id = ? AND userId = ?`).get(req.params.id, uid);
  if (!account) return res.status(404).json({ error: 'Account not found' });

  const txns = db.prepare(`
    SELECT * FROM account_transactions
    WHERE accountId = ? AND userId = ?
    ORDER BY datetime(date) DESC
  `).all(req.params.id, uid);

  res.json({ account, transactions: txns });
});

app.put('/api/accounts/:id', (req, res) => {
  const uid      = req.session.userId;
  const existing = db.prepare(`SELECT * FROM accounts WHERE id = ? AND userId = ?`).get(req.params.id, uid);
  if (!existing) return res.status(404).json({ error: 'Account not found' });

  if (req.body.name !== undefined)
    db.prepare(`UPDATE accounts SET name = ? WHERE id = ? AND userId = ?`).run(req.body.name, req.params.id, uid);

  if (req.body.balance !== undefined) {
    const newBalance = parseFloat(req.body.balance);
    const delta      = newBalance - (existing.balance || 0);
    db.prepare(`UPDATE accounts SET balance = ? WHERE id = ? AND userId = ?`).run(newBalance, req.params.id, uid);
    if (delta !== 0) {
      const now = new Date().toISOString();
      db.prepare(`INSERT INTO account_transactions (id, userId, accountId, type, amount, note, relatedType, relatedId, date, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(uuidv4(), uid, req.params.id, delta > 0 ? 'credit' : 'debit', Math.abs(delta), 'ম্যানুয়াল সমন্বয়', 'manual', null, now, now);
    }
  }

  res.json(db.prepare(`SELECT * FROM accounts WHERE id = ? AND userId = ?`).get(req.params.id, uid));
});

// ─── Seed Demo Data ───────────────────────────────────────────────────────────
app.post('/api/seed', async (req, res) => {
  const uid = req.session.userId;
  const now = new Date();

  const demoCustomers = [
    { id:uuidv4(), userId:uid, name:'রহিম মিয়া',   phone:'01711223344', address:'ধানমন্ডি, ঢাকা',     creditLimit:10000, shop:'প্রধান শাখা', trustScore:85, createdAt:new Date().toISOString() },
    { id:uuidv4(), userId:uid, name:'করিম উদ্দিন', phone:'01811334455', address:'মিরপুর, ঢাকা',       creditLimit:5000,  shop:'প্রধান শাখা', trustScore:60, createdAt:new Date().toISOString() },
    { id:uuidv4(), userId:uid, name:'ফাতেমা বেগম', phone:'01912445566', address:'মোহাম্মদপুর, ঢাকা', creditLimit:8000,  shop:'শাখা-২',      trustScore:90, createdAt:new Date().toISOString() },
    { id:uuidv4(), userId:uid, name:'সালাম সাহেব', phone:'01615556677', address:'উত্তরা, ঢাকা',       creditLimit:3000,  shop:'শাখা-২',      trustScore:35, createdAt:new Date().toISOString() },
  ];

  const demoTxns = [
    { id:uuidv4(), userId:uid, customerId:demoCustomers[0].id, type:'debit',     amount:2500, note:'চাল, ডাল',      shop:'প্রধান শাখা', dueDate:new Date(now-5*86400000).toISOString(),  date:new Date(now-10*86400000).toISOString(), photo:null, repaidAmount:2500, repaidAt:new Date(now-6*86400000).toISOString(), reminded:0, inventoryId:null, productName:null, soldQuantity:null, paymentMethod:null, saleType:null },
    { id:uuidv4(), userId:uid, customerId:demoCustomers[0].id, type:'debit',     amount:1800, note:'তেল, মশলা',     shop:'প্রধান শাখা', dueDate:new Date(now+5*86400000).toISOString(),  date:new Date(now-3*86400000).toISOString(),  photo:null, repaidAmount:0,    repaidAt:null,                                    reminded:0, inventoryId:null, productName:null, soldQuantity:null, paymentMethod:null, saleType:null },
    { id:uuidv4(), userId:uid, customerId:demoCustomers[1].id, type:'debit',     amount:3200, note:'মাসের বাজার',   shop:'প্রধান শাখা', dueDate:new Date(now-15*86400000).toISOString(), date:new Date(now-20*86400000).toISOString(), photo:null, repaidAmount:1000, repaidAt:null,                                    reminded:1, inventoryId:null, productName:null, soldQuantity:null, paymentMethod:null, saleType:null },
    { id:uuidv4(), userId:uid, customerId:demoCustomers[2].id, type:'debit',     amount:4500, note:'বড় কেনাকাটা',  shop:'শাখা-২',      dueDate:new Date(now+10*86400000).toISOString(), date:new Date(now-2*86400000).toISOString(),  photo:null, repaidAmount:4500, repaidAt:new Date(now-1*86400000).toISOString(), reminded:0, inventoryId:null, productName:null, soldQuantity:null, paymentMethod:null, saleType:null },
    { id:uuidv4(), userId:uid, customerId:demoCustomers[3].id, type:'debit',     amount:1500, note:'সাপ্তাহিক',    shop:'শাখা-২',      dueDate:new Date(now-30*86400000).toISOString(), date:new Date(now-35*86400000).toISOString(), photo:null, repaidAmount:0,    repaidAt:null,                                    reminded:0, inventoryId:null, productName:null, soldQuantity:null, paymentMethod:null, saleType:null },
    { id:uuidv4(), userId:uid, customerId:demoCustomers[1].id, type:'credit',    amount:1000, note:'আংশিক পরিশোধ', shop:'প্রধান শাখা', dueDate:null,                                    date:new Date(now-5*86400000).toISOString(),  photo:null, repaidAmount:0,    repaidAt:null,                                    reminded:0, inventoryId:null, productName:null, soldQuantity:null, paymentMethod:null, saleType:null },
  ];

  // Clear only this user's data
  db.prepare(`DELETE FROM transactions WHERE userId = ?`).run(uid);
  db.prepare(`DELETE FROM customers    WHERE userId = ?`).run(uid);

  const insCust = db.prepare(`INSERT INTO customers (id,userId,name,phone,address,creditLimit,shop,trustScore,createdAt) VALUES (@id,@userId,@name,@phone,@address,@creditLimit,@shop,@trustScore,@createdAt)`);
  const insTxn  = db.prepare(`INSERT INTO transactions (id,userId,customerId,type,amount,note,dueDate,shop,date,photo,repaidAmount,repaidAt,reminded,inventoryId,productName,soldQuantity,paymentMethod,saleType) VALUES (@id,@userId,@customerId,@type,@amount,@note,@dueDate,@shop,@date,@photo,@repaidAmount,@repaidAt,@reminded,@inventoryId,@productName,@soldQuantity,@paymentMethod,@saleType)`);

  db.transaction(()=>{ demoCustomers.forEach(c=>insCust.run(c)); })();
  db.transaction(()=>{ demoTxns.forEach(t=>insTxn.run(t));       })();

  db.prepare(`UPDATE app_settings SET shops = ?, updatedAt = ? WHERE userId = ?`)
    .run(JSON.stringify(['প্রধান শাখা','শাখা-২']), new Date().toISOString(), uid);

  res.json({ success:true, message:'Demo data seeded for current user' });
});

// ─── Serve Login Page ─────────────────────────────────────────────────────────
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
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
║   http://localhost:${PORT}             ║
║   Default PIN: 1234                    ║
╚════════════════════════════════════════╝
  `);
});
