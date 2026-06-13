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
  CREATE TABLE IF NOT EXISTS customers (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    phone       TEXT DEFAULT '',
    address     TEXT DEFAULT '',
    creditLimit REAL DEFAULT 5000,
    shop        TEXT DEFAULT 'প্রধান শাখা',
    trustScore  REAL DEFAULT 75,
    createdAt   TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id            TEXT PRIMARY KEY,
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
    FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_txn_customer ON transactions(customerId);
  CREATE INDEX IF NOT EXISTS idx_txn_date     ON transactions(date);
  CREATE INDEX IF NOT EXISTS idx_txn_type     ON transactions(type);

  CREATE TABLE IF NOT EXISTS inventory (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    buyPrice    REAL DEFAULT 0,
    sellPrice   REAL DEFAULT 0,
    quantity    INTEGER DEFAULT 0,
    buyDate     TEXT,
    expiryDate  TEXT,
    supplierId  TEXT,
    shop        TEXT DEFAULT 'প্রধান শাখা',
    createdAt   TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_inv_shop     ON inventory(shop);
  CREATE INDEX IF NOT EXISTS idx_inv_supplier ON inventory(supplierId);

  CREATE TABLE IF NOT EXISTS suppliers (
    id        TEXT PRIMARY KEY,
    name      TEXT NOT NULL,
    phone     TEXT DEFAULT '',
    address   TEXT DEFAULT '',
    createdAt TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_sup_name ON suppliers(name);

  CREATE TABLE IF NOT EXISTS supplier_transactions (
    id         TEXT PRIMARY KEY,
    supplierId TEXT NOT NULL,
    type       TEXT NOT NULL,
    amount     REAL NOT NULL,
    note       TEXT DEFAULT '',
    date       TEXT NOT NULL,
    createdAt  TEXT NOT NULL,
    FOREIGN KEY (supplierId) REFERENCES suppliers(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_suptxn_supplier ON supplier_transactions(supplierId);
  CREATE INDEX IF NOT EXISTS idx_suptxn_date     ON supplier_transactions(date);

  CREATE TABLE IF NOT EXISTS expenses (
    id            TEXT PRIMARY KEY,
    title         TEXT NOT NULL,
    category      TEXT DEFAULT 'Misc',
    amount        REAL NOT NULL,
    shop          TEXT DEFAULT 'প্রধান শাখা',
    note          TEXT DEFAULT '',
    receiptPhoto  TEXT,
    paymentMethod TEXT,
    date          TEXT NOT NULL,
    createdAt     TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_exp_shop     ON expenses(shop);
  CREATE INDEX IF NOT EXISTS idx_exp_category ON expenses(category);
  CREATE INDEX IF NOT EXISTS idx_exp_date     ON expenses(date);

  CREATE TABLE IF NOT EXISTS accounts (
    id        TEXT PRIMARY KEY,
    name      TEXT NOT NULL,
    type      TEXT DEFAULT 'general',
    balance   REAL DEFAULT 0,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS account_transactions (
    id          TEXT PRIMARY KEY,
    accountId   TEXT NOT NULL,
    type        TEXT NOT NULL,
    amount      REAL NOT NULL,
    note        TEXT DEFAULT '',
    relatedType TEXT,
    relatedId   TEXT,
    date        TEXT NOT NULL,
    createdAt   TEXT NOT NULL,
    FOREIGN KEY (accountId) REFERENCES accounts(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_acctxn_account ON account_transactions(accountId);
  CREATE INDEX IF NOT EXISTS idx_acctxn_date    ON account_transactions(date);

  CREATE TABLE IF NOT EXISTS app_settings (
    id        INTEGER PRIMARY KEY CHECK (id = 1),
    shopName  TEXT DEFAULT 'আমার দোকান',
    ownerName TEXT DEFAULT 'দোকান মালিক',
    shops     TEXT DEFAULT '["প্রধান শাখা"]',
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS users (
    id        TEXT PRIMARY KEY,
    phone     TEXT NOT NULL UNIQUE,
    name      TEXT NOT NULL,
    pinHash   TEXT NOT NULL,
    role      TEXT DEFAULT 'owner',
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE UNIQUE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

`);

// ─── One-time JSON → SQLite migration ────────────────
function migrateIfNeeded() {
  const alreadyMigrated = db.prepare(
    `SELECT COUNT(*) as n FROM customers`
  ).get().n > 0;

  if (alreadyMigrated) return;

  // Migrate customers
  const custFile = path.join(DATA_DIR, 'customers.json');
  if (fs.existsSync(custFile)) {
    let customers = [];
    try { customers = JSON.parse(fs.readFileSync(custFile, 'utf8')); } catch {}

    const insertCust = db.prepare(`
      INSERT OR IGNORE INTO customers
        (id, name, phone, address, creditLimit, shop, trustScore, createdAt)
      VALUES
        (@id, @name, @phone, @address, @creditLimit, @shop, @trustScore, @createdAt)
    `);

    const migrateCusts = db.transaction(rows => {
      for (const c of rows) insertCust.run({
        id:          c.id,
        name:        c.name        || '',
        phone:       c.phone       || '',
        address:     c.address     || '',
        creditLimit: c.creditLimit || 5000,
        shop:        c.shop        || 'প্রধান শাখা',
        trustScore:  c.trustScore  || 75,
        createdAt:   c.createdAt   || new Date().toISOString()
      });
    });
    migrateCusts(customers);
    console.log(`✅ Migrated ${customers.length} customers to SQLite`);
  }

  // Migrate transactions
  const txnFile = path.join(DATA_DIR, 'transactions.json');
  if (fs.existsSync(txnFile)) {
    let transactions = [];
    try { transactions = JSON.parse(fs.readFileSync(txnFile, 'utf8')); } catch {}

    const insertTxn = db.prepare(`
      INSERT OR IGNORE INTO transactions
        (id, customerId, type, amount, note, dueDate, shop, date,
         photo, repaidAmount, repaidAt, reminded,
         inventoryId, productName, soldQuantity, paymentMethod, saleType)
      VALUES
        (@id, @customerId, @type, @amount, @note, @dueDate, @shop, @date,
         @photo, @repaidAmount, @repaidAt, @reminded,
         @inventoryId, @productName, @soldQuantity, @paymentMethod, @saleType)
    `);

    const migrateTxns = db.transaction(rows => {
      for (const t of rows) insertTxn.run({
        id:            t.id,
        customerId:    t.customerId,
        type:          t.type,
        amount:        t.amount        || 0,
        note:          t.note          || '',
        dueDate:       t.dueDate       || null,
        shop:          t.shop          || 'প্রধান শাখা',
        date:          t.date          || new Date().toISOString(),
        photo:         t.photo         || null,
        repaidAmount:  t.repaidAmount  || 0,
        repaidAt:      t.repaidAt      || null,
        reminded:      t.reminded ? 1 : 0,
        inventoryId:   t.inventoryId   || null,
        productName:   t.productName   || null,
        soldQuantity:  t.soldQuantity  || null,
        paymentMethod: t.paymentMethod || null,
        saleType:      t.saleType      || null
      });
    });
    migrateTxns(transactions);
    console.log(`✅ Migrated ${transactions.length} transactions to SQLite`);
  }

  // Migrate inventory
  const invFile = path.join(DATA_DIR, 'inventory.json');
  const invCount = db.prepare(`SELECT COUNT(*) as n FROM inventory`).get().n;
  if (invCount === 0 && fs.existsSync(invFile)) {
    let items = [];
    try { items = JSON.parse(fs.readFileSync(invFile, 'utf8')); } catch {}

    const insertInv = db.prepare(`
      INSERT OR IGNORE INTO inventory
        (id, name, buyPrice, sellPrice, quantity, buyDate, expiryDate, supplierId, shop, createdAt)
      VALUES
        (@id, @name, @buyPrice, @sellPrice, @quantity, @buyDate, @expiryDate, @supplierId, @shop, @createdAt)
    `);

    db.transaction(rows => {
      for (const i of rows) insertInv.run({
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

    console.log(`✅ Migrated ${items.length} inventory items to SQLite`);
  }

  // Migrate suppliers
  const supFile  = path.join(DATA_DIR, 'suppliers.json');
  const supCount = db.prepare(`SELECT COUNT(*) as n FROM suppliers`).get().n;

  if (supCount === 0 && fs.existsSync(supFile)) {
    let suppliers = [];
    try { suppliers = JSON.parse(fs.readFileSync(supFile, 'utf8')); } catch {}

    const insertSup = db.prepare(`
      INSERT OR IGNORE INTO suppliers (id, name, phone, address, createdAt)
      VALUES (@id, @name, @phone, @address, @createdAt)
    `);

    db.transaction(rows => {
      for (const s of rows) insertSup.run({
        id:        s.id,
        name:      s.name      || '',
        phone:     s.phone     || '',
        address:   s.address   || '',
        createdAt: s.createdAt || new Date().toISOString()
      });
    })(suppliers);

    console.log(`✅ Migrated ${suppliers.length} suppliers to SQLite`);
  }

  // Migrate supplier_transactions
  const supTxnFile  = path.join(DATA_DIR, 'supplier_transactions.json');
  const supTxnCount = db.prepare(`SELECT COUNT(*) as n FROM supplier_transactions`).get().n;

  if (supTxnCount === 0 && fs.existsSync(supTxnFile)) {
    let txns = [];
    try { txns = JSON.parse(fs.readFileSync(supTxnFile, 'utf8')); } catch {}

    const insertSupTxn = db.prepare(`
      INSERT OR IGNORE INTO supplier_transactions
        (id, supplierId, type, amount, note, date, createdAt)
      VALUES
        (@id, @supplierId, @type, @amount, @note, @date, @createdAt)
    `);

    db.transaction(rows => {
      for (const t of rows) insertSupTxn.run({
        id:         t.id,
        supplierId: t.supplierId,
        type:       t.type,
        amount:     t.amount     || 0,
        note:       t.note       || '',
        date:       t.date       || new Date().toISOString(),
        createdAt:  t.createdAt  || t.date || new Date().toISOString()
      });
    })(txns);

    console.log(`✅ Migrated ${txns.length} supplier transactions to SQLite`);
  }

  // Migrate expenses
  const expFile  = path.join(DATA_DIR, 'expenses.json');
  const expCount = db.prepare(`SELECT COUNT(*) as n FROM expenses`).get().n;

  if (expCount === 0 && fs.existsSync(expFile)) {
    let expenses = [];
    try { expenses = JSON.parse(fs.readFileSync(expFile, 'utf8')); } catch {}

    const insertExp = db.prepare(`
      INSERT OR IGNORE INTO expenses
        (id, title, category, amount, shop, note, receiptPhoto, paymentMethod, date, createdAt)
      VALUES
        (@id, @title, @category, @amount, @shop, @note, @receiptPhoto, @paymentMethod, @date, @createdAt)
    `);

    db.transaction(rows => {
      for (const e of rows) insertExp.run({
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
    })(expenses);

    console.log(`✅ Migrated ${expenses.length} expenses to SQLite`);
  }

  // Migrate accounts
  const accFile  = path.join(DATA_DIR, 'accounts.json');
  const accCount = db.prepare(`SELECT COUNT(*) as n FROM accounts`).get().n;

  if (accCount === 0) {
    // Always seed default accounts if table is empty
    const defaults = [
      { id: 'cash',   name: 'নগদ (Cash)',  type: 'cash',   balance: 0 },
      { id: 'bkash',  name: 'বিকাশ',       type: 'mobile', balance: 0 },
      { id: 'nagad',  name: 'নগদ (Nagad)', type: 'mobile', balance: 0 },
      { id: 'rocket', name: 'রকেট',        type: 'mobile', balance: 0 },
      { id: 'bank',   name: 'ব্যাংক',      type: 'bank',   balance: 0 }
    ];

    // If JSON exists, use its balances over defaults
    let jsonAccounts = [];
    if (fs.existsSync(accFile)) {
      try { jsonAccounts = JSON.parse(fs.readFileSync(accFile, 'utf8')); } catch {}
    }

    const insertAcc = db.prepare(`
      INSERT OR IGNORE INTO accounts (id, name, type, balance, createdAt)
      VALUES (@id, @name, @type, @balance, @createdAt)
    `);

    db.transaction(() => {
      for (const def of defaults) {
        const fromJson = jsonAccounts.find(a => a.id === def.id);
        insertAcc.run({
          id:        def.id,
          name:      fromJson?.name    || def.name,
          type:      fromJson?.type    || def.type,
          balance:   fromJson?.balance || def.balance,
          createdAt: new Date().toISOString()
        });
      }
      // Also import any extra accounts from JSON not in defaults
      for (const a of jsonAccounts) {
        if (!defaults.find(d => d.id === a.id)) {
          insertAcc.run({
            id:        a.id,
            name:      a.name    || '',
            type:      a.type    || 'general',
            balance:   a.balance || 0,
            createdAt: a.createdAt || new Date().toISOString()
          });
        }
      }
    })();

    console.log(`✅ Migrated accounts to SQLite`);
  }

  // Migrate account_transactions
  const accTxnFile  = path.join(DATA_DIR, 'account_transactions.json');
  const accTxnCount = db.prepare(`SELECT COUNT(*) as n FROM account_transactions`).get().n;

  if (accTxnCount === 0 && fs.existsSync(accTxnFile)) {
    let accTxns = [];
    try { accTxns = JSON.parse(fs.readFileSync(accTxnFile, 'utf8')); } catch {}

    const insertAccTxn = db.prepare(`
      INSERT OR IGNORE INTO account_transactions
        (id, accountId, type, amount, note, relatedType, relatedId, date, createdAt)
      VALUES
        (@id, @accountId, @type, @amount, @note, @relatedType, @relatedId, @date, @createdAt)
    `);

    db.transaction(rows => {
      for (const t of rows) insertAccTxn.run({
        id:          t.id,
        accountId:   t.accountId,
        type:        t.type,
        amount:      t.amount      || 0,
        note:        t.note        || '',
        relatedType: t.relatedType || null,
        relatedId:   t.relatedId   || null,
        date:        t.date        || new Date().toISOString(),
        createdAt:   t.createdAt   || t.date || new Date().toISOString()
      });
    })(accTxns);

    console.log(`✅ Migrated ${accTxns.length} account transactions to SQLite`);
  }

  // ── app_settings: clean schema migration ──────────────
  // Step 1: drop legacy pinHash column if it exists
  (function cleanAppSettings() {
    const cols = db.prepare(`PRAGMA table_info(app_settings)`).all().map(c => c.name);

    if (cols.includes('pinHash')) {
      console.log('⚙️  Removing legacy pinHash from app_settings...');
      db.exec(`
        CREATE TABLE IF NOT EXISTS app_settings_clean (
          id        INTEGER PRIMARY KEY CHECK (id = 1),
          shopName  TEXT DEFAULT 'আমার দোকান',
          ownerName TEXT DEFAULT 'দোকান মালিক',
          shops     TEXT DEFAULT '["প্রধান শাখা"]',
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        );

        INSERT OR IGNORE INTO app_settings_clean
          (id, shopName, ownerName, shops, createdAt, updatedAt)
        SELECT
          id, shopName, ownerName, shops, createdAt, updatedAt
        FROM app_settings;

        DROP TABLE app_settings;

        ALTER TABLE app_settings_clean RENAME TO app_settings;
      `);
      console.log('✅ pinHash column removed from app_settings');
    }
  })();

  // Step 2: seed default row if table is empty
  const settingsRow = db.prepare(`SELECT id FROM app_settings WHERE id = 1`).get();

  if (!settingsRow) {
    let shopName  = 'আমার দোকান';
    let ownerName = 'দোকান মালিক';
    let shops     = ['প্রধান শাখা'];

    const authFile = path.join(DATA_DIR, 'auth.json');
    if (fs.existsSync(authFile)) {
      try {
        const raw = JSON.parse(fs.readFileSync(authFile, 'utf8'));
        if (raw.shopName)                                  shopName  = raw.shopName;
        if (raw.ownerName)                                 ownerName = raw.ownerName;
        if (Array.isArray(raw.shops) && raw.shops.length)  shops     = raw.shops;
      } catch {}
    }

    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO app_settings (id, shopName, ownerName, shops, createdAt, updatedAt)
      VALUES (1, @shopName, @ownerName, @shops, @createdAt, @updatedAt)
    `).run({
      shopName,
      ownerName,
      shops:     JSON.stringify(shops),
      createdAt: now,
      updatedAt: now
    });

    console.log('✅ app_settings default row created');
  }

  // Migrate users.json → users table
  const usersFile  = path.join(DATA_DIR, 'users.json');
  const usersCount = db.prepare(`SELECT COUNT(*) as n FROM users`).get().n;

  if (usersCount === 0) {
    let jsonUsers = [];
    if (fs.existsSync(usersFile)) {
      try { jsonUsers = JSON.parse(fs.readFileSync(usersFile, 'utf8')); } catch {}
    }

    // If no JSON users exist, seed the default account
    if (!jsonUsers.length) {
      jsonUsers = [{
        id:    '1',
        phone: '01700000000',
        name:  'দোকান মালিক',
        // default PIN: 1234
        pin:   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
      }];
    }

    const insertUser = db.prepare(`
      INSERT OR IGNORE INTO users (id, phone, name, pinHash, role, createdAt, updatedAt)
      VALUES (@id, @phone, @name, @pinHash, @role, @createdAt, @updatedAt)
    `);

    const now = new Date().toISOString();
    db.transaction(rows => {
      for (const u of rows) insertUser.run({
        id:        u.id        || u.phone,
        phone:     u.phone,
        name:      u.name      || 'দোকান মালিক',
        pinHash:   u.pin       || u.pinHash || '',
        role:      u.role      || 'owner',
        createdAt: u.createdAt || now,
        updatedAt: u.updatedAt || now
      });
    })(jsonUsers);

    console.log(`✅ Migrated ${jsonUsers.length} users to SQLite`);
  }
}

migrateIfNeeded();

module.exports = db;