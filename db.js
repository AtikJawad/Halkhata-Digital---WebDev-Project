const { v4: uuidv4 } = require('uuid');
const Database = require('better-sqlite3');
const path     = require('path');
const fs       = require('fs');

const DB_PATH   = path.join(__dirname, 'data', 'database.db');
const DATA_DIR  = path.join(__dirname, 'data');

const db = new Database(DB_PATH);

// ─── Performance pragmas ──────────────────────────────
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ─── Schema ───────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id        TEXT PRIMARY KEY,
    phone     TEXT UNIQUE,
    email     TEXT UNIQUE,
    name      TEXT NOT NULL,
    pinHash   TEXT NOT NULL,
    role      TEXT DEFAULT 'owner',
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE UNIQUE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
  CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);

  CREATE TABLE IF NOT EXISTS app_settings (
    userId    TEXT PRIMARY KEY,
    shopName  TEXT DEFAULT 'আমার দোকান',
    ownerName TEXT DEFAULT 'দোকান মালিক',
    shops     TEXT DEFAULT '["প্রধান শাখা"]',
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS customers (
    id          TEXT PRIMARY KEY,
    userId      TEXT NOT NULL DEFAULT 'legacy',
    name        TEXT NOT NULL,
    phone       TEXT DEFAULT '',
    address     TEXT DEFAULT '',
    creditLimit REAL DEFAULT 5000,
    shop        TEXT DEFAULT 'প্রধান শাখা',
    trustScore  REAL DEFAULT 75,
    createdAt   TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_cust_user ON customers(userId);

  CREATE TABLE IF NOT EXISTS transactions (
    id            TEXT PRIMARY KEY,
    userId        TEXT NOT NULL DEFAULT 'legacy',
    customerId    TEXT NOT NULL,
    type          TEXT NOT NULL,
    amount        REAL NOT NULL,
    note          TEXT DEFAULT '',
    dueDate       TEXT,
    shop          TEXT DEFAULT 'প্রধান শাখা',
    date          TEXT NOT NULL,
    photo         TEXT,
    repaidAmount  REAL DEFAULT 0,
    repaidAt      TEXT,
    reminded      INTEGER DEFAULT 0,
    inventoryId   TEXT,
    productName   TEXT,
    soldQuantity  INTEGER,
    paymentMethod TEXT,
    saleType      TEXT,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_txn_customer ON transactions(customerId);
  CREATE INDEX IF NOT EXISTS idx_txn_date     ON transactions(date);
  CREATE INDEX IF NOT EXISTS idx_txn_type     ON transactions(type);
  CREATE INDEX IF NOT EXISTS idx_txn_user ON transactions(userId);

  CREATE TABLE IF NOT EXISTS inventory (
    id          TEXT PRIMARY KEY,
    userId      TEXT NOT NULL DEFAULT 'legacy',
    name        TEXT NOT NULL,
    buyPrice    REAL DEFAULT 0,
    sellPrice   REAL DEFAULT 0,
    quantity    INTEGER DEFAULT 0,
    buyDate     TEXT,
    expiryDate  TEXT,
    supplierId  TEXT,
    shop        TEXT DEFAULT 'প্রধান শাখা',
    createdAt   TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_inv_user    ON inventory(userId);
  CREATE INDEX IF NOT EXISTS idx_inv_shop    ON inventory(shop);
  CREATE INDEX IF NOT EXISTS idx_inv_supplier ON inventory(supplierId);

  CREATE TABLE IF NOT EXISTS products (
    id        TEXT PRIMARY KEY,
    userId    TEXT NOT NULL,
    name      TEXT NOT NULL,
    sellPrice REAL DEFAULT 0,
    shop      TEXT DEFAULT 'প্রধান শাখা',
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_prod_user ON products(userId);
  CREATE INDEX IF NOT EXISTS idx_prod_name ON products(userId, name, shop);

  CREATE TABLE IF NOT EXISTS inventory_batches (
    id                TEXT PRIMARY KEY,
    userId            TEXT NOT NULL,
    productId         TEXT NOT NULL,
    quantity          INTEGER NOT NULL,
    remainingQuantity INTEGER NOT NULL,
    buyPrice          REAL DEFAULT 0,
    expiryDate        TEXT,
    buyDate           TEXT,
    supplierId        TEXT,
    shop              TEXT DEFAULT 'প্রধান শাখা',
    createdAt         TEXT NOT NULL,
    FOREIGN KEY (userId)    REFERENCES users(id)    ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_batch_user    ON inventory_batches(userId);
  CREATE INDEX IF NOT EXISTS idx_batch_product ON inventory_batches(productId);
  CREATE INDEX IF NOT EXISTS idx_batch_expiry  ON inventory_batches(expiryDate);

  CREATE TABLE IF NOT EXISTS suppliers (
    id        TEXT PRIMARY KEY,
    userId    TEXT NOT NULL DEFAULT 'legacy',
    name      TEXT NOT NULL,
    phone     TEXT DEFAULT '',
    address   TEXT DEFAULT '',
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_sup_user ON suppliers(userId);
  CREATE INDEX IF NOT EXISTS idx_sup_name ON suppliers(name);

  CREATE TABLE IF NOT EXISTS supplier_transactions (
    id         TEXT PRIMARY KEY,
    userId     TEXT NOT NULL DEFAULT 'legacy',
    supplierId TEXT NOT NULL,
    type       TEXT NOT NULL,
    amount     REAL NOT NULL,
    note       TEXT DEFAULT '',
    date       TEXT NOT NULL,
    createdAt  TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (supplierId) REFERENCES suppliers(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_suptxn_user     ON supplier_transactions(userId);
  CREATE INDEX IF NOT EXISTS idx_suptxn_supplier ON supplier_transactions(supplierId);
  CREATE INDEX IF NOT EXISTS idx_suptxn_date     ON supplier_transactions(date);

  CREATE TABLE IF NOT EXISTS expenses (
    id            TEXT PRIMARY KEY,
    userId        TEXT NOT NULL DEFAULT 'legacy',
    title         TEXT NOT NULL,
    category      TEXT DEFAULT 'Misc',
    amount        REAL NOT NULL,
    shop          TEXT DEFAULT 'প্রধান শাখা',
    note          TEXT DEFAULT '',
    receiptPhoto  TEXT,
    paymentMethod TEXT,
    date          TEXT NOT NULL,
    createdAt     TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_exp_user     ON expenses(userId);
  CREATE INDEX IF NOT EXISTS idx_exp_shop     ON expenses(shop);
  CREATE INDEX IF NOT EXISTS idx_exp_category ON expenses(category);
  CREATE INDEX IF NOT EXISTS idx_exp_date     ON expenses(date);

  CREATE TABLE IF NOT EXISTS accounts (
    id        TEXT PRIMARY KEY,
    userId    TEXT NOT NULL DEFAULT 'legacy',
    name      TEXT NOT NULL,
    type      TEXT DEFAULT 'general',
    balance   REAL DEFAULT 0,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE UNIQUE INDEX IF NOT EXISTS idx_acc_user_type ON accounts(userId, id);

  CREATE TABLE IF NOT EXISTS account_transactions (
    id          TEXT PRIMARY KEY,
    userId      TEXT NOT NULL DEFAULT 'legacy',
    accountId   TEXT NOT NULL,
    type        TEXT NOT NULL,
    amount      REAL NOT NULL,
    note        TEXT DEFAULT '',
    relatedType TEXT,
    relatedId   TEXT,
    date        TEXT NOT NULL,
    createdAt   TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_acctxn_user    ON account_transactions(userId);
  CREATE INDEX IF NOT EXISTS idx_acctxn_account ON account_transactions(accountId);
  CREATE INDEX IF NOT EXISTS idx_acctxn_date    ON account_transactions(date);
`);

// ─── One-time JSON → SQLite migration ────────────────
function migrateIfNeeded() {
  const now = new Date().toISOString();

  // ── Step 1: Add missing columns to existing tables ────
  function addColumnIfMissing(table, column, definition) {
    const cols = db.prepare(`PRAGMA table_info(${table})`).all().map(c => c.name);
    if (!cols.includes(column)) {
      db.prepare(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`).run();
      console.log(`✅ Added column ${table}.${column}`);
    }
  }

  // Add userId to all data tables (safe — ignored if already exists)
  const dataTables = ['customers','transactions','inventory','suppliers',
                      'supplier_transactions','expenses','accounts','account_transactions'];
  dataTables.forEach(t => {
    try { addColumnIfMissing(t, 'userId', "TEXT NOT NULL DEFAULT 'legacy'"); } catch {}
  });

  // Add email to users table
  try { addColumnIfMissing('users', 'email', 'TEXT'); } catch {}
  try { addColumnIfMissing('users', 'name',  'TEXT NOT NULL DEFAULT ""'); } catch {}

  // ── Step 2: Migrate app_settings from integer id=1 to userId ──
  const settingsCols = db.prepare(`PRAGMA table_info(app_settings)`).all().map(c => c.name);
  if (settingsCols.includes('pinHash')) {
    // Legacy schema — recreate without pinHash
    db.exec(`
      CREATE TABLE IF NOT EXISTS app_settings_v2 (
        userId    TEXT PRIMARY KEY,
        shopName  TEXT DEFAULT 'আমার দোকান',
        ownerName TEXT DEFAULT 'দোকান মালিক',
        shops     TEXT DEFAULT '["প্রধান শাখা"]',
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);
    // Copy existing row using first user's id
    const firstUser = db.prepare(`SELECT id FROM users ORDER BY createdAt ASC LIMIT 1`).get();
    const oldSettings = db.prepare(`SELECT * FROM app_settings WHERE id = 1`).get();
    if (firstUser && oldSettings) {
      db.prepare(`INSERT OR IGNORE INTO app_settings_v2 (userId,shopName,ownerName,shops,createdAt,updatedAt) VALUES (?,?,?,?,?,?)`)
        .run(firstUser.id, oldSettings.shopName, oldSettings.ownerName, oldSettings.shops, now, now);
    }
    db.exec(`DROP TABLE app_settings; ALTER TABLE app_settings_v2 RENAME TO app_settings;`);
    console.log('✅ Migrated app_settings to per-user schema');
  }

  // ── Step 3: Ensure owner account exists ───────────────
  let ownerId = null;
  const firstUser = db.prepare(`SELECT id FROM users ORDER BY createdAt ASC LIMIT 1`).get();
  if (!firstUser) {
    // Create default owner from auth.json if exists
    const authFile = require('path').join(__dirname, 'data', 'auth.json');
    let defaultPin = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
    if (require('fs').existsSync(authFile)) {
      try { defaultPin = JSON.parse(require('fs').readFileSync(authFile, 'utf8')).pin || defaultPin; } catch {}
    }
    ownerId = require('crypto').randomUUID?.() || require('uuid')?.v4?.() || 'owner-001';
    db.prepare(`INSERT OR IGNORE INTO users (id,phone,email,name,pinHash,role,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?)`)
      .run(ownerId, '01700000000', null, 'দোকান মালিক', defaultPin, 'owner', now, now);
    console.log('✅ Created default owner account');
  } else {
    ownerId = firstUser.id;
  }

  // ── Step 4: Assign all legacy data to owner ───────────
  dataTables.forEach(t => {
    try {
      const updated = db.prepare(`UPDATE ${t} SET userId = ? WHERE userId = 'legacy' OR userId = ''`).run(ownerId);
      if (updated.changes > 0) console.log(`✅ Migrated ${updated.changes} rows in ${t} → userId=${ownerId}`);
    } catch (e) { console.warn(`Migration skip ${t}:`, e.message); }
  });

  // ── Step 5: Ensure app_settings row exists for owner ──
  const ownerSettings = db.prepare(`SELECT userId FROM app_settings WHERE userId = ?`).get(ownerId);
  if (!ownerSettings) {
    const authFile = require('path').join(__dirname, 'data', 'auth.json');
    let shopName = 'আমার দোকান', ownerName = 'দোকান মালিক', shops = ['প্রধান শাখা'];
    if (require('fs').existsSync(authFile)) {
      try {
        const raw = JSON.parse(require('fs').readFileSync(authFile, 'utf8'));
        if (raw.shopName)  shopName  = raw.shopName;
        if (raw.ownerName) ownerName = raw.ownerName;
        if (Array.isArray(raw.shops) && raw.shops.length) shops = raw.shops;
      } catch {}
    }
    db.prepare(`INSERT OR IGNORE INTO app_settings (userId,shopName,ownerName,shops,createdAt,updatedAt) VALUES (?,?,?,?,?,?)`)
      .run(ownerId, shopName, ownerName, JSON.stringify(shops), now, now);
    console.log('✅ Created app_settings for owner');
  }

  // ── Step 6: Ensure accounts exist for owner ───────────
  const ownerAccounts = db.prepare(`SELECT COUNT(*) as n FROM accounts WHERE userId = ?`).get(ownerId).n;
  if (ownerAccounts === 0) {
    const defaults = [
      { id: `${ownerId}_cash`,   name: 'নগদ (Cash)',  type: 'cash',   balance: 0 },
      { id: `${ownerId}_bkash`,  name: 'বিকাশ',       type: 'mobile', balance: 0 },
      { id: `${ownerId}_nagad`,  name: 'নগদ (Nagad)', type: 'mobile', balance: 0 },
      { id: `${ownerId}_rocket`, name: 'রকেট',        type: 'mobile', balance: 0 },
      { id: `${ownerId}_bank`,   name: 'ব্যাংক',      type: 'bank',   balance: 0 }
    ];
    const insAcc = db.prepare(`INSERT OR IGNORE INTO accounts (id,userId,name,type,balance,createdAt) VALUES (?,?,?,?,?,?)`);
    db.transaction(() => defaults.forEach(a => insAcc.run(a.id, ownerId, a.name, a.type, a.balance, now)))();
    console.log('✅ Created default accounts for owner');
  }

  // ── Step 7: Migrate JSON files (safe, idempotent) ─────
  migrateJSONFiles(ownerId, now);

  // ── Migrate flat inventory → products + batches ───────
  (function migrateInventoryToBatches() {
    const productsCount = db.prepare(`SELECT COUNT(*) as n FROM products`).get().n;
    if (productsCount > 0) return; // already migrated

    const oldRows = db.prepare(`SELECT * FROM inventory`).all();
    if (!oldRows.length) return;

    // Group old inventory rows by (userId, name, shop)
    const groups = {};
    oldRows.forEach(row => {
      const key = `${row.userId}::${row.name}::${row.shop || 'প্রধান শাখা'}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(row);
    });

    const insProduct = db.prepare(`
      INSERT INTO products (id, userId, name, sellPrice, shop, createdAt)
      VALUES (@id, @userId, @name, @sellPrice, @shop, @createdAt)
    `);
    const insBatch = db.prepare(`
      INSERT INTO inventory_batches
        (id, userId, productId, quantity, remainingQuantity, buyPrice, expiryDate, buyDate, supplierId, shop, createdAt)
      VALUES
        (@id, @userId, @productId, @quantity, @remainingQuantity, @buyPrice, @expiryDate, @buyDate, @supplierId, @shop, @createdAt)
    `);

    let productCount = 0, batchCount = 0;

    db.transaction(() => {
      for (const key in groups) {
        const rows = groups[key];
        const first = rows[0];
        const productId = uuidv4();

        insProduct.run({
          id: productId,
          userId: first.userId,
          name: first.name,
          sellPrice: first.sellPrice || 0,
          shop: first.shop || 'প্রধান শাখা',
          createdAt: first.createdAt || new Date().toISOString()
        });
        productCount++;

        rows.forEach(r => {
          insBatch.run({
            id: uuidv4(),
            userId: r.userId,
            productId,
            quantity: r.quantity || 0,
            remainingQuantity: r.quantity || 0,   // assume full stock still available — safest default
            buyPrice: r.buyPrice || 0,
            expiryDate: r.expiryDate || null,
            buyDate: r.buyDate || r.createdAt || new Date().toISOString(),
            supplierId: r.supplierId || null,
            shop: r.shop || 'প্রধান শাখা',
            createdAt: r.createdAt || new Date().toISOString()
          });
          batchCount++;
        });
      }
    })();

    console.log(`✅ Inventory migrated: ${productCount} products, ${batchCount} batches created from ${oldRows.length} legacy rows`);
  })();

  // ── Add batchBreakdown column to transactions (traceability) ──
  (function addBatchBreakdownColumn() {
    const cols = db.prepare(`PRAGMA table_info(transactions)`).all().map(c => c.name);
    if (!cols.includes('batchBreakdown')) {
      db.prepare(`ALTER TABLE transactions ADD COLUMN batchBreakdown TEXT`).run();
      console.log('✅ Added transactions.batchBreakdown column');
    }
  })();
}

function migrateJSONFiles(ownerId, now) {
  const fs   = require('fs');
  const path = require('path');
  const DATA = path.join(__dirname, 'data');

  // Customers
  const custFile = path.join(DATA, 'customers.json');
  if (fs.existsSync(custFile)) {
    let rows = []; try { rows = JSON.parse(fs.readFileSync(custFile,'utf8')); } catch {}
    const check = db.prepare(`SELECT id FROM customers WHERE id = ?`);
    const ins   = db.prepare(`INSERT OR IGNORE INTO customers (id,userId,name,phone,address,creditLimit,shop,trustScore,createdAt) VALUES (?,?,?,?,?,?,?,?,?)`);
    let n = 0;
    db.transaction(() => { for (const c of rows) { if (!check.get(c.id)) { ins.run(c.id,ownerId,c.name||'',c.phone||'',c.address||'',c.creditLimit||5000,c.shop||'প্রধান শাখা',c.trustScore||75,c.createdAt||now); n++; } } })();
    if (n) console.log(`✅ customers.json: ${n} imported`);
  }

  // Transactions
  const txnFile = path.join(DATA, 'transactions.json');
  if (fs.existsSync(txnFile)) {
    let rows = []; try { rows = JSON.parse(fs.readFileSync(txnFile,'utf8')); } catch {}
    const check = db.prepare(`SELECT id FROM transactions WHERE id = ?`);
    const ins   = db.prepare(`INSERT OR IGNORE INTO transactions (id,userId,customerId,type,amount,note,dueDate,shop,date,photo,repaidAmount,repaidAt,reminded,inventoryId,productName,soldQuantity,paymentMethod,saleType) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);
    let n = 0;
    db.transaction(() => { for (const t of rows) { if (!check.get(t.id)) { ins.run(t.id,ownerId,t.customerId,t.type,t.amount||0,t.note||'',t.dueDate||null,t.shop||'প্রধান শাখা',t.date||now,t.photo||null,t.repaidAmount||0,t.repaidAt||null,t.reminded?1:0,t.inventoryId||null,t.productName||null,t.soldQuantity||null,t.paymentMethod||null,t.saleType||null); n++; } } })();
    if (n) console.log(`✅ transactions.json: ${n} imported`);
  }
}

migrateIfNeeded();

module.exports = db;