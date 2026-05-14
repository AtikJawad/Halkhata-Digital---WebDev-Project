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
}

migrateIfNeeded();

module.exports = db;