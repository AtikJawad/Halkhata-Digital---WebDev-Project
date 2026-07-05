/* ═══════════════════════════════════════════════════════
   হালখাতা ডিজিটাল — Main Script
═══════════════════════════════════════════════════════ */
// ─── Translation System ───────────────────────────────
const translations = {
  bn: {
    // Navigation
    login:          'লগইন',
    addCustomer:    'নতুন গ্রাহক',
    addTransaction: 'লেনদেন যোগ করুন',
    dashboard:      'ড্যাশবোর্ড',
    customers:      'গ্রাহক',
    transactions:   'লেনদেন',
    overdue:        'বকেয়া',
    report:         'মাসিক রিপোর্ট',
    settings:       'সেটিংস',
    logout:         'লগআউট',
    // Buttons
    save:           'সংরক্ষণ করুন',
    cancel:         'বাতিল',
    delete:         'মুছুন',
    search:         'খুঁজুন',
    add:            'যোগ করুন',
    send:           'পাঠান',
    print:          'প্রিন্ট করুন',
    // Form labels
    name:           'নাম',
    phone:          'ফোন নম্বর',
    address:        'ঠিকানা',
    amount:         'পরিমাণ (৳)',
    note:           'নোট / বিবরণ',
    dueDate:        'পরিশোধের তারিখ',
    creditLimit:    'সর্বোচ্চ বাকির সীমা (৳)',
    branch:         'শাখা',
    photo:          'রসিদ ছবি (ঐচ্ছিক)',
    // Status texts
    paid:           'পরিশোধিত',
    due:            'বাকি',
    overdueStatus:  'মেয়াদ উত্তীর্ণ',
    reminder:       'রিমাইন্ডার পাঠান',
    dueSoon:        'শীঘ্রই বকেয়া ',
    // Stats
    totalReceivable:'মোট পাওনা',
    totalPaid:      'মোট আদায়',
    overdueAmount:  'মেয়াদ উত্তীর্ণ',
    totalCustomers: 'মোট গ্রাহক ',
    // Quick actions
    quickAddCustomer:    'নতুন গ্রাহক যোগ করুন',
    quickAddTransaction: 'বাকি লেনদেন রেকর্ড করুন',
    quickViewDue:        'বকেয়া তালিকা দেখুন',
    quickBackup:         'ডেটা ব্যাকআপ করুন',
    quickLoadDemo:       'ডেমো ডেটা লোড করুন',
    quickActions:        'দ্রুত কাজ',
    recentTransactions:  'সাম্প্রতিক লেনদেন',
    // Report page
    monthlyReport:       'মাসিক আয়-ব্যয় রিপোর্ট',
    reportMonth:         'মাস',
    reportDebit:         'বাকি দেওয়া',
    reportCredit:        'টাকা পাওয়া',
    reportNet:           'নেট',
    reportTxnCount:      'লেনদেন সংখ্যা',
    reportTotal:         'মোট',
    // Settings page
    settingsTitle:       'সেটিংস',
    shopInfo:            'দোকানের তথ্য',
    shopName:            'দোকানের নাম',
    ownerName:           'মালিকের নাম',
    branches:            'শাখাসমূহ',
    newBranch:           'নতুন শাখার নাম',
    changePin:           'PIN পরিবর্তন',
    oldPin:              'পুরানো PIN',
    newPin:              'নতুন PIN',
    dataManagement:      'ডেটা ব্যবস্থাপনা',
    downloadBackup:      'ব্যাকআপ ডাউনলোড',
    clearData:           'সব ডেটা মুছুন',
  },
  en: {
    // Navigation
    login:          'Login',
    addCustomer:    'Add Customer',
    addTransaction: 'Add Transaction',
    dashboard:      'Dashboard',
    customers:      'Customers',
    transactions:   'Transactions',
    overdue:        'Overdue',
    report:         'Monthly Report',
    settings:       'Settings',
    logout:         'Logout',
    // Buttons
    save:           'Save',
    cancel:         'Cancel',
    delete:         'Delete',
    search:         'Search',
    add:            'Add',
    send:           'Send',
    print:          'Print',
    // Form labels
    name:           'Name',
    phone:          'Phone Number',
    address:        'Address',
    amount:         'Amount (৳)',
    note:           'Note / Description',
    dueDate:        'Payment Due Date',
    creditLimit:    'Credit Limit (৳)',
    branch:         'Branch',
    photo:          'Receipt Photo (optional)',
    // Status texts
    paid:           'Paid',
    due:            'Due',
    overdueStatus:  'Overdue',
    reminder:       'Send Reminder',
    dueSoon:        'Due Soon',
    // Stats
    totalReceivable:'Total Receivable',
    totalPaid:      'Total Collections',
    overdueAmount:  'Overdue Amount',
    totalCustomers: 'Total Customers',
    // Quick actions
    quickAddCustomer:    'Add New Customer',
    quickAddTransaction: 'Record Transaction',
    quickViewDue:        'View Due List',
    quickBackup:         'Backup Data',
    quickLoadDemo:       'Load Demo Data',
    quickActions:        'Quick Actions',
    recentTransactions:  'Recent Transactions',
    // Report page
    monthlyReport:       'Monthly Income & Expense Report',
    reportMonth:         'Month',
    reportDebit:         'Credit Given',
    reportCredit:        'Payment Received',
    reportNet:           'Net',
    reportTxnCount:      'Transactions',
    reportTotal:         'Total',
    // Settings page
    settingsTitle:       'Settings',
    shopInfo:            'Shop Information',
    shopName:            'Shop Name',
    ownerName:           'Owner Name',
    branches:            'Branches',
    newBranch:           'New Branch Name',
    changePin:           'Change PIN',
    oldPin:              'Old PIN',
    newPin:              'New PIN',
    dataManagement:      'Data Management',
    downloadBackup:      'Download Backup',
    clearData:           'Clear All Data',
  }
};

function t(key) {
  const lang = localStorage.getItem('lang') || 'bn';
  return (translations[lang] && translations[lang][key]) || key;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
    updateLangButton(localStorage.getItem('lang') || 'bn');
  });
}

function setLang(lang) {
  localStorage.setItem('lang', lang);
  applyTranslations();
}
// ─── State ────────────────────────────────────────────
let currentPage     = 'dashboard';
let currentCustomer = null;
let currentTxnType  = 'debit';
let pinBuffer       = '';
let shopsList       = ['প্রধান শাখা'];
let currentShop     = '';
let isOnline        = navigator.onLine;
let currentTxnMode    = 'sale';    // 'sale' | 'repayment'
let currentPayMode    = 'cash';    // 'cash' | 'credit'
const OFFLINE_QUEUE_KEY = 'halkhata_offline_queue';

// ─── Utility ─────────────────────────────────────────
const $ = id => document.getElementById(id);
const API = async (path, opts = {}) => {
  const resp = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...opts.headers },
    ...opts
  });
  if (resp.status === 401) {
    sessionStorage.removeItem('halkhata_auth');
    window.location.href = '/login.html';
    throw new Error('Session expired');
  }
  if (!resp.ok) throw new Error(`API error ${resp.status}`);
  return resp.json();
};

function formatTaka(n) {
  const num = Math.abs(parseFloat(n) || 0);
  const lang = localStorage.getItem('lang') || 'bn';
  if (lang === 'bn') {
    const formatted = num.toLocaleString('bn-BD');
    return '৳' + formatted;
  }
  return '৳' + num.toLocaleString('en-US');
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDateShort(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' });
}
function formatNumber(num) {
  const lang = localStorage.getItem('lang') || 'bn';
  if (lang === 'bn') {
    return num.toString().replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);
  }
  return num.toString();
}

function groupByDate(items, dateKey) {
  const groups = {};
  items.forEach(item => {
    const key = new Date(item[dateKey]).toLocaleDateString('bn-BD', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });
  return groups;
}

function showToast(msg, type = 'success') {
  const t = $('toast');
  t.textContent = msg;
  t.className = `toast ${type}`;
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 3000);
}

// ─── PIN Login ────────────────────────────────────────

function enterApp(data) {
  $('app').classList.remove('hidden');
  $('sidebar-shop-name').textContent = data.shopName || 'আমার দোকান';
  shopsList = data.shops || ['প্রধান শাখা'];

  populateShopDropdowns();

  // Restore selected shop
  const savedShop = localStorage.getItem('selectedShop');
  if (savedShop) {
    currentShop = savedShop;
    const sel = $('global-shop-filter');
    if (sel) sel.value = savedShop;
  }

  // Restore last page
  const savedPage = localStorage.getItem('currentPage') || 'dashboard';
  navigate(savedPage);

  registerServiceWorker();
  loadOverdueBadge();
  checkDueAlerts();
  applyTranslations();
  // Prime master-data cache in background on login
  if (navigator.onLine) {
    refreshMasterDataCache().catch(() => {});
  }
}

async function logout() {
  await fetch('/api/logout', { method: 'POST' });
  sessionStorage.removeItem('halkhata_auth');
  window.location.href = '/login.html';
}

// Check session on load
window.addEventListener('load', async () => {
  // Check server-side session instead of only sessionStorage
  try {
    const res = await fetch('/api/auth/check');
    const data = await res.json();
    if (data.loggedIn) {
      sessionStorage.setItem('halkhata_auth', JSON.stringify(data));
      enterApp(data);
    } else {
      window.location.href = '/login.html';
    }
  } catch {
    window.location.href = '/login.html';
  }
  setupOfflineDetection();
});

// ─── Navigation ───────────────────────────────────────
function navigate(page) {
  currentPage = page;
  localStorage.setItem('currentPage', page);
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  $(`page-${page}`).classList.add('active');
  document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
  closeSidebar();

  switch (page) {
    case 'dashboard': destroyChart('db2-trend'); loadDashboard(); break;
    case 'customers':    loadCustomers(); break;
    case 'transactions': loadTransactions(); break;
    case 'overdue':      loadOverdue(); break;
    case 'report':  destroyChart('yearly-grouped'); loadReport(); break;
    case 'inventory': loadInventory(); break;
    case 'suppliers': loadSuppliers(); break;
    case 'expenses': loadExpenses(); break;
    case 'settings':     loadSettings(); break;
  }
}

function toggleSidebar() {
  $('sidebar').classList.toggle('open');
}
function closeSidebar() {
  $('sidebar').classList.remove('open');
}

// ─── Shop Filter ──────────────────────────────────────
function populateShopDropdowns() {
  const selects = ['global-shop-filter', 'c-shop', 't-customer'];
  const globalSel = $('global-shop-filter');
  globalSel.innerHTML = '<option value="">সব শাখা</option>';
  shopsList.forEach(s => {
    globalSel.innerHTML += `<option value="${s}">${s}</option>`;
  });

  const cShop = $('c-shop');
  if (cShop) {
    cShop.innerHTML = '';
    shopsList.forEach(s => cShop.innerHTML += `<option value="${s}">${s}</option>`);
  }
}

function onShopChange() {
  const value = $('global-shop-filter').value;
  currentShop = value;
  if (value && value !== 'সব শাখা') {
    localStorage.setItem('selectedShop', value);
  } else {
    localStorage.removeItem('selectedShop');
  }
  navigate(currentPage);
}
// ─── Due Date Helpers ─────────────────────────────────
function getDueStatus(txn) {
  if (txn.type !== 'debit' || !txn.dueDate) return null;
  if ((txn.repaidAmount || 0) >= txn.amount) return null; // fully paid

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(txn.dueDate);
  due.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0)  return { status: 'overdue',  label: `${formatNumber(Math.abs(diffDays))} দিন বাকি ছিল`, diffDays };
  if (diffDays <= 3) return { status: 'due-soon',  label: `${formatNumber(diffDays)} দিন বাকি`,               diffDays };
  return null;
}

async function checkDueAlerts() {
  try {
    const txns = await API('/api/transactions');
    const overdue = txns.filter(t => getDueStatus(t)?.status === 'overdue');
    if (overdue.length > 0) {
      alert(`⚠️ আপনার ${formatNumber(overdue.length)}টি পেমেন্টের মেয়াদ উত্তীর্ণ হয়েছে!`);
    }
  } catch {}
}

// ═══════════════════════════════════════════════════════
// CSV EXPORT HELPERS
// ═══════════════════════════════════════════════════════

function escapeCSV(val) {
  if (val === null || val === undefined) return '';
  const str = String(val);
  // Wrap in quotes if contains comma, quote, or newline
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function rowToCSV(cells) {
  return cells.map(escapeCSV).join(',');
}

function downloadCSV(filename, rows) {
  // BOM for proper UTF-8 / Bengali rendering in Excel
  const BOM     = '\uFEFF';
  const content = BOM + rows.map(r => rowToCSV(r)).join('\r\n');
  const blob    = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url     = URL.createObjectURL(blob);
  const link    = document.createElement('a');
  link.href     = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// ─── Yearly CSV ───────────────────────────────────────
function exportYearlyCSV(data, year) {
  const shop      = currentShop || 'সব শাখা';
  const now       = new Date().toLocaleString('bn-BD');
  const filename  = `report_${year}_${(currentShop || 'all').replace(/\s+/g, '-')}.csv`;

  const totalRevenue = data.months.reduce((s, m) => s + m.totalRevenue,  0);
  const totalExpense = data.months.reduce((s, m) => s + m.totalExpense,  0);
  const totalProfit  = data.months.reduce((s, m) => s + m.profit,        0);
  const totalDebit   = data.months.reduce((s, m) => s + m.totalDebit,    0);
  const totalTxns    = data.months.reduce((s, m) => s + m.transactionCount, 0);
  const totalExpCnt  = data.months.reduce((s, m) => s + m.expenseCount,  0);
  const totalCash    = data.months.reduce((s, m) => s + (m.cashSales || 0), 0);
  const totalCredit  = data.months.reduce((s, m) => s + (m.totalCredit  || 0), 0);

  const rows = [
    ['বার্ষিক আর্থিক রিপোর্ট'],
    ['তৈরি:', now],
    ['বছর:', year],
    ['শাখা:', shop],
    [],
    ['মাস', 'আদায় (৳)', 'খরচ (৳)', 'নেট লাভ/ক্ষতি (৳)',
     'বাকি বিক্রি (৳)', 'নগদ বিক্রি (৳)', 'পরিশোধ আদায় (৳)',
     'লেনদেন সংখ্যা', 'খরচ সংখ্যা'],
    ...data.months.map(m => [
      m.monthName,
      m.totalRevenue,
      m.totalExpense,
      m.profit,
      m.totalDebit,
      m.cashSales  || 0,
      m.totalCredit || 0,
      m.transactionCount,
      m.expenseCount
    ]),
    [],
    ['মোট',
     totalRevenue, totalExpense, totalProfit,
     totalDebit, totalCash, totalCredit,
     totalTxns, totalExpCnt]
  ];

  downloadCSV(filename, rows);
  showToast('CSV ডাউনলোড হচ্ছে 📥');
}

// ─── Monthly CSV ──────────────────────────────────────
function exportMonthlyCSV(d) {
  if (!d) return;
  const shop     = d.shop || 'সব শাখা';
  const filename = `report_${d.year}_${String(d.month).padStart(2,'0')}_${(d.shop || 'all').replace(/\s+/g,'-')}.csv`;
  const s        = d.summary;

  const TXN_TYPE_BN = {
    debit:     'বাকি বিক্রি',
    credit:    'পরিশোধ',
    cash_sale: 'নগদ বিক্রি'
  };
  const PM_BN = {
    cash:'নগদ', bkash:'বিকাশ', nagad:'নগদ (Nagad)',
    rocket:'রকেট', bank:'ব্যাংক', unspecified:'অনির্দিষ্ট'
  };
  const CAT_BN = {
    Transportation:'পরিবহন', 'Supplier Purchase':'পণ্য ক্রয়', Salary:'বেতন',
    Electricity:'বিদ্যুৎ', Rent:'ভাড়া', Internet:'ইন্টারনেট',
    Repair:'মেরামত', Tax:'কর', Packaging:'প্যাকেজিং', Misc:'অন্যান্য'
  };

  const rows = [
    // ── SECTION 1: Summary ──────────────────────────────
    ['━━ অংশ ১: মাসিক সারসংক্ষেপ ━━'],
    ['মাস', 'বছর', 'শাখা', 'আদায় (৳)', 'খরচ (৳)', 'নেট লাভ/ক্ষতি (৳)',
     'বর্তমান বাকি (৳)', 'মেয়াদউত্তীর্ণ (৳)', 'লেনদেন সংখ্যা', 'সক্রিয় গ্রাহক '],
    [d.monthName, d.year, shop,
     s.totalRevenue, s.totalExpense, s.netProfit,
     s.totalCurrentDue, s.overdueAmt,
     s.txnCount, s.customerCount || 0],
    [],

    // ── SECTION 2: Transactions ──────────────────────────
    ['━━ অংশ ২: লেনদেন ━━'],
    ['তারিখ', 'গ্রাহক ', 'পণ্য', 'পরিমাণ', 'মোট (৳)',
     'পরিশোধিত (৳)', 'বাকি (৳)', 'পেমেন্ট মাধ্যম', 'ধরন'],
    ...(d.transactions || []).map(t => [
      new Date(t.date).toLocaleDateString('bn-BD'),
      t.customerName || '—',
      t.productName  || '—',
      t.soldQuantity || '—',
      t.amount,
      t.repaidAmount || 0,
      Math.max(0, t.amount - (t.repaidAmount || 0)),
      PM_BN[t.paymentMethod] || t.paymentMethod || '—',
      TXN_TYPE_BN[t.type]   || t.type
    ]),
    [],

    // ── SECTION 3: Expenses ──────────────────────────────
    ['━━ অংশ ৩: খরচ ━━'],
    ['তারিখ', 'শিরোনাম', 'ক্যাটাগরি', 'নোট', 'পরিমাণ (৳)', 'পেমেন্ট মাধ্যম'],
    ...(d.expenses || []).map(e => [
      new Date(e.date).toLocaleDateString('bn-BD'),
      e.title,
      CAT_BN[e.category] || e.category,
      e.note  || '—',
      e.amount,
      PM_BN[e.paymentMethod] || e.paymentMethod || '—'
    ]),
    [],

    // ── SECTION 4: Top Customers ─────────────────────────
    ['━━ অংশ ৪: শীর্ষ গ্রাহক  ━━'],
    ['গ্রাহক ', 'মোট কেনাকাটা (৳)', 'পরিশোধ (৳)', 'বর্তমান বাকি (৳)', 'বিশ্বস্ততা স্কোর', 'পরিশোধ হার (%)'],
    ...(d.customerStats || []).map(c => [
      c.name,
      c.purchased,
      c.paid,
      c.allTimeDue || 0,
      c.trustScore || '—',
      c.repayPct   || '—'
    ]),
    [],

    // ── SECTION 5: Top Products ──────────────────────────
    ['━━ অংশ ৫: শীর্ষ পণ্য ━━'],
    ['পণ্য', 'বিক্রয় পরিমাণ', 'আদায় (৳)', 'লেনদেন সংখ্যা', 'বর্তমান স্টক'],
    ...(d.productStats || []).map(p => [
      p.name,
      p.qty,
      p.revenue,
      p.txnCount,
      p.currentStock !== null ? p.currentStock : '—'
    ])
  ];

  downloadCSV(filename, rows);
  showToast('মাসিক CSV ডাউনলোড হচ্ছে 📥');
}

// ═══════════════════════════════════════════════════════
// PDF / PRINT EXPORT
// ═══════════════════════════════════════════════════════

function openYearlyPrintView() {
  const ref = window._lastReportData;
  if (!ref) { showToast('প্রথমে রিপোর্ট লোড করুন', 'error'); return; }

  // Capture chart as image before opening new window
  const chartCanvas  = document.getElementById('chart-yearly-grouped');
  const chartDataURL = chartCanvas ? chartCanvas.toDataURL('image/png') : null;

  const html = generateYearlyPrintHTML(ref.data, ref.year, chartDataURL);

  const printWindow = window.open('', '_blank');
  if (!printWindow) { showToast('পপআপ ব্লক করা আছে, অনুমতি দিন', 'error'); return; }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  // Trigger print after fonts/images load
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 600);
  };
}

function generateYearlyPrintHTML(data, year, chartDataURL) {
  const auth      = JSON.parse(sessionStorage.getItem('halkhata_auth') || '{}');
  const shopName  = auth.shopName  || 'হালখাতা ডিজিটাল';
  const ownerName = auth.ownerName || '';
  const shop      = currentShop   || 'সব শাখা';
  const now       = new Date().toLocaleString('bn-BD', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  // ── KPI calculations ──────────────────────────────────
  const totalRevenue  = data.months.reduce((s, m) => s + m.totalRevenue,     0);
  const totalExpense  = data.months.reduce((s, m) => s + m.totalExpense,     0);
  const totalProfit   = data.months.reduce((s, m) => s + m.profit,           0);
  const totalDebit    = data.months.reduce((s, m) => s + m.totalDebit,       0);
  const totalTxns     = data.months.reduce((s, m) => s + m.transactionCount, 0);
  const activeMonths  = data.months.filter(m => m.transactionCount > 0 || m.expenseCount > 0).length;

  const activeData    = data.months.filter(m => m.transactionCount > 0 || m.expenseCount > 0);
  const bestMonth     = activeData.reduce((b, m) => (!b || m.profit > b.profit)           ? m : b, null);
  const highRevMonth  = activeData.reduce((b, m) => m.totalRevenue  > (b?.totalRevenue || 0) ? m : b, null);
  const highExpMonth  = activeData.reduce((b, m) => m.totalExpense  > (b?.totalExpense || 0) ? m : b, null);
  const highColMonth  = activeData.reduce((b, m) => m.totalCredit   > (b?.totalCredit  || 0) ? m : b, null);

  const fmt = n => '৳' + Math.abs(n).toLocaleString('bn-BD');

  // ── Monthly table rows ────────────────────────────────
  const tableRows = data.months.map(m => {
    const profitColor = m.profit < 0 ? '#e63946' : '#2d6a4f';
    const profitSign  = m.profit >= 0 ? '+' : '';
    const rowBg       = m.month % 2 === 0 ? '#f9f9f9' : '#ffffff';
    return `
      <tr style="background:${rowBg}">
        <td>${m.monthName}</td>
        <td class="num green">${fmt(m.totalRevenue)}</td>
        <td class="num red">${fmt(m.totalExpense)}</td>
        <td class="num" style="color:${profitColor}">
          ${profitSign}${fmt(m.profit)}
        </td>
        <td class="num">${m.totalDebit > 0 ? fmt(m.totalDebit) : '—'}</td>
        <td class="num center">${m.transactionCount}</td>
        <td class="num center">${m.expenseCount}</td>
      </tr>`;
  }).join('');

  // ── Insight rows ──────────────────────────────────────
  const insightRows = [
    ['🏆 সর্বোচ্চ আদায়ের মাস',       bestMonth,    bestMonth    ? fmt(bestMonth.profit)         : '—'],
    ['📈 সর্বোচ্চ লাভের মাস',      highRevMonth, highRevMonth ? fmt(highRevMonth.totalRevenue) : '—'],
    ['💸 সর্বোচ্চ খরচের মাস',         highExpMonth, highExpMonth ? fmt(highExpMonth.totalExpense) : '—'],
    ['💰 সর্বোচ্চ পরিশোধ আদায়',        highColMonth, highColMonth ? fmt(highColMonth.totalCredit)  : '—']
  ].map(([label, month, value]) => `
    <tr>
      <td>${label}</td>
      <td>${month ? month.monthName : '—'}</td>
      <td class="num">${value}</td>
    </tr>`).join('');

  // ── Chart image ───────────────────────────────────────
  const chartSection = chartDataURL
    ? `<div class="section">
         <h2 class="section-title">📊 মাসিক আদায় · খরচ · লাভ/ক্ষতি</h2>
         <img src="${chartDataURL}" style="width:100%;max-height:280px;
               object-fit:contain;border:1px solid #e0e0e0;border-radius:6px" />
       </div>`
    : '';

  return `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>বার্ষিক রিপোর্ট ${year} — ${shopName}</title>
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&family=Tiro+Bangla&display=swap"
        rel="stylesheet" />
  <style>
    /* ── Reset & Base ─────────────────────────── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Hind Siliguri', sans-serif;
      font-size: 13px;
      color: #1a1a2e;
      background: #fff;
      padding: 2.5cm 2cm;
      max-width: 21cm;
      margin: 0 auto;
      line-height: 1.55;
    }

    /* ── Header ───────────────────────────────── */
    .report-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 3px solid #1a472a;
      padding-bottom: 1rem;
      margin-bottom: 1.5rem;
    }
    .header-left .app-name {
      font-family: 'Tiro Bangla', serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a472a;
    }
    .header-left .shop-name {
      font-size: 1rem;
      font-weight: 600;
      color: #2d6a4f;
      margin-top: 2px;
    }
    .header-left .owner-name {
      font-size: 0.82rem;
      color: #666;
      margin-top: 2px;
    }
    .header-right {
      text-align: right;
      font-size: 0.82rem;
      color: #555;
    }
    .header-right .report-title {
      font-size: 1rem;
      font-weight: 700;
      color: #1a472a;
      margin-bottom: 4px;
    }

    /* ── Sections ─────────────────────────────── */
    .section {
      margin-bottom: 1.8rem;
      page-break-inside: avoid;
    }
    .section-title {
      font-family: 'Tiro Bangla', serif;
      font-size: 0.95rem;
      font-weight: 700;
      color: #1a472a;
      border-left: 4px solid #40916c;
      padding-left: 0.6rem;
      margin-bottom: 0.8rem;
    }

    /* ── KPI Grid ─────────────────────────────── */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.6rem;
    }
    .kpi-card {
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      padding: 0.7rem 0.9rem;
      border-top: 3px solid #40916c;
    }
    .kpi-label {
      font-size: 0.72rem;
      color: #666;
      margin-bottom: 0.25rem;
    }
    .kpi-value {
      font-size: 1.05rem;
      font-weight: 700;
      color: #1a472a;
    }
    .kpi-value.red    { color: #e63946; }
    .kpi-value.amber  { color: #e9a200; }
    .kpi-value.green  { color: #2d6a4f; }

    /* ── Tables ───────────────────────────────── */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.82rem;
    }
    th {
      background: #f0f5f1;
      color: #1a472a;
      font-weight: 700;
      padding: 0.5rem 0.7rem;
      text-align: left;
      border-bottom: 2px solid #40916c;
    }
    td {
      padding: 0.45rem 0.7rem;
      border-bottom: 1px solid #ebebeb;
      vertical-align: middle;
    }
    .num    { text-align: right; font-variant-numeric: tabular-nums; }
    .center { text-align: center; }
    .green  { color: #2d6a4f; font-weight: 600; }
    .red    { color: #e63946; font-weight: 600; }

    tfoot td {
      font-weight: 700;
      background: #f0f5f1;
      border-top: 2px solid #40916c;
    }

    /* ── Insight table ────────────────────────── */
    .insight-table td:first-child { width: 45%; font-weight: 600; }
    .insight-table td:nth-child(2){ width: 30%; color: #555; }
    .insight-table td:last-child  { text-align: right; font-weight: 700; color: #2d6a4f; }

    /* ── Footer ───────────────────────────────── */
    .report-footer {
      margin-top: 2.5rem;
      padding-top: 0.8rem;
      border-top: 1px solid #ccc;
      text-align: center;
      font-size: 0.75rem;
      color: #999;
    }
    .report-footer span { color: #40916c; font-weight: 600; }

    /* ── Print rules ──────────────────────────── */
    @media print {
      body { padding: 1.2cm 1.5cm; font-size: 12px; }
      .no-print { display: none !important; }
      .section  { page-break-inside: avoid; }
      table     { page-break-inside: auto; }
      tr        { page-break-inside: avoid; page-break-after: auto; }
      thead     { display: table-header-group; }
      tfoot     { display: table-footer-group; }
      @page {
        size: A4;
        margin: 1.5cm 1.2cm;
      }
    }

    /* ── Screen-only print button ─────────────── */
    .print-bar {
      position: fixed;
      top: 0; left: 0; right: 0;
      background: #1a472a;
      color: #fff;
      padding: 0.6rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 999;
      font-family: 'Hind Siliguri', sans-serif;
    }
    .print-bar button {
      background: #e9c46a;
      color: #1a472a;
      border: none;
      border-radius: 5px;
      padding: 0.4rem 1.2rem;
      font-family: 'Hind Siliguri', sans-serif;
      font-size: 0.9rem;
      font-weight: 700;
      cursor: pointer;
    }
    @media print { .print-bar { display: none !important; } body { padding-top: 0; } }
  </style>
</head>
<body>

  <!-- Screen-only top bar -->
  <div class="print-bar no-print">
    <span>🖨️ প্রিন্ট করুন অথবা "Save as PDF" বাছুন</span>
    <button onclick="window.print()">🖨️ প্রিন্ট / PDF সেভ করুন</button>
  </div>
  <div style="height:2.5rem" class="no-print"></div>

  <!-- ── Report Header ───────────────────────── -->
  <div class="report-header">
    <div class="header-left">
      <div class="app-name">হালখাতা ডিজিটাল</div>
      <div class="shop-name">${shopName}</div>
      ${ownerName ? `<div class="owner-name">${ownerName}</div>` : ''}
    </div>
    <div class="header-right">
      <div class="report-title">বার্ষিক আর্থিক রিপোর্ট</div>
      <div>বছর: <strong>${year}</strong></div>
      <div>শাখা: <strong>${shop}</strong></div>
      <div>তৈরি: ${now}</div>
    </div>
  </div>

  <!-- ── Section 1: KPI Summary ──────────────── -->
  <div class="section">
    <h2 class="section-title">📊 বার্ষিক সারসংক্ষেপ</h2>
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-label">💰 মোট আদায়</div>
        <div class="kpi-value green">${fmt(totalRevenue)}</div>
      </div>
      <div class="kpi-card" style="border-top-color:#e63946">
        <div class="kpi-label">🧾 মোট খরচ</div>
        <div class="kpi-value red">${fmt(totalExpense)}</div>
      </div>
      <div class="kpi-card" style="border-top-color:${totalProfit >= 0 ? '#40916c' : '#e63946'}">
        <div class="kpi-label">📈 নেট লাভ/ক্ষতি</div>
        <div class="kpi-value ${totalProfit >= 0 ? 'green' : 'red'}">
          ${totalProfit >= 0 ? '+' : ''}${fmt(totalProfit)}
        </div>
      </div>
      <div class="kpi-card" style="border-top-color:#e9c46a">
        <div class="kpi-label">⏳ বাকিতে বিক্রি</div>
        <div class="kpi-value amber">${fmt(totalDebit)}</div>
      </div>
      <div class="kpi-card" style="border-top-color:#2d6a4f">
        <div class="kpi-label">📋 মোট লেনদেন</div>
        <div class="kpi-value">${totalTxns.toLocaleString('bn-BD')}</div>
      </div>
      <div class="kpi-card" style="border-top-color:#2d6a4f">
        <div class="kpi-label">📅 সক্রিয় মাস</div>
        <div class="kpi-value">${activeMonths.toLocaleString('bn-BD')} / ১২</div>
      </div>
    </div>
  </div>

  <!-- ── Section 2: Insights ─────────────────── -->
  <div class="section">
    <h2 class="section-title">💡 বার্ষিক ইনসাইট</h2>
    <table class="insight-table">
      <thead>
        <tr>
          <th>ইনসাইট</th>
          <th>মাস</th>
          <th style="text-align:right">মান</th>
        </tr>
      </thead>
      <tbody>${insightRows}</tbody>
    </table>
  </div>

  <!-- ── Section 3: Chart ─────────────────────── -->
  ${chartSection}

  <!-- ── Section 4: Monthly Table ────────────── -->
  <div class="section">
    <h2 class="section-title">📅 মাসিক বিবরণ</h2>
    <table>
      <thead>
        <tr>
          <th>মাস</th>
          <th style="text-align:right">আদায় (৳)</th>
          <th style="text-align:right">খরচ (৳)</th>
          <th style="text-align:right">লাভ/ক্ষতি (৳)</th>
          <th style="text-align:right">বাকি বিক্রি (৳)</th>
          <th style="text-align:center">লেনদেন</th>
          <th style="text-align:center">খরচ সংখ্যা</th>
        </tr>
      </thead>
      <tbody>${tableRows}</tbody>
      <tfoot>
        <tr>
          <td>মোট</td>
          <td class="num green">${fmt(totalRevenue)}</td>  <!-- আদায় column -->
          <td class="num red">${fmt(totalExpense)}</td>
          <td class="num ${totalProfit >= 0 ? 'green' : 'red'}">
            ${totalProfit >= 0 ? '+' : ''}${fmt(totalProfit)}
          </td>
          <td class="num">${fmt(totalDebit)}</td>
          <td class="center">${totalTxns.toLocaleString('bn-BD')}</td>
          <td class="center">
            ${data.months.reduce((s,m)=>s+m.expenseCount,0).toLocaleString('bn-BD')}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>

  <!-- ── Footer ───────────────────────────────── -->
  <div class="report-footer">
    তৈরি করা হয়েছে <span>হালখাতা ডিজিটাল</span> দ্বারা &nbsp;·&nbsp;
    ${shopName} &nbsp;·&nbsp; ${now}
  </div>

</body>
</html>`;
}

// ─── Monthly Print / PDF Export ───────────────────────
function openMonthlyPrintView() {
  const d = window._lastMonthData;
  if (!d) { showToast('প্রথমে মাসিক রিপোর্ট লোড করুন', 'error'); return; }

  // Capture all chart canvases as images before opening new window
  const chartImages = {
    summaryBar:  captureCanvas('chart-summary-bar-slot'),
    dailyLine:   captureCanvas('chart-daily-line-slot'),
    productBar:  captureCanvas('chart-product-bar-slot'),
    topBuyers:   captureCanvas('chart-top-buyers-slot'),
    highDue:     captureCanvas('chart-high-due-slot'),
    expDonut:    captureCanvas('chart-expense-donut-slot'),
    payDonut:    captureCanvas('chart-payment-donut-slot')
  };

  const html = generateMonthlyPrintHTML(d, chartImages);

  const printWindow = window.open('', '_blank');
  if (!printWindow) { showToast('পপআপ ব্লক করা আছে, অনুমতি দিন', 'error'); return; }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 600);
  };
}

function captureCanvas(id) {
  const canvas = document.getElementById(id);
  if (!canvas) return null;
  try { return canvas.toDataURL('image/png'); }
  catch { return null; }
}

function generateMonthlyPrintHTML(d, chartImages) {
  const auth      = JSON.parse(sessionStorage.getItem('halkhata_auth') || '{}');
  const shopName  = auth.shopName  || 'হালখাতা ডিজিটাল';
  const ownerName = auth.ownerName || '';
  const shop      = d.shop || 'সব শাখা';
  const s         = d.summary;
  const now       = new Date().toLocaleString('bn-BD', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const fmt      = n  => '৳' + Math.abs(n  || 0).toLocaleString('bn-BD');
  const fmtNum   = n  => (n  || 0).toLocaleString('bn-BD');
  const fmtDate  = iso => new Date(iso).toLocaleDateString('bn-BD', { day:'numeric', month:'short' });

  const TXN_BN = { debit:'বাকি বিক্রি', credit:'পরিশোধ', cash_sale:'নগদ বিক্রি' };
  const PM_BN  = { cash:'নগদ', bkash:'বিকাশ', nagad:'নগদ (Nagad)', rocket:'রকেট', bank:'ব্যাংক' };
  const CAT_BN = {
    Transportation:'পরিবহন', 'Supplier Purchase':'পণ্য ক্রয়', Salary:'বেতন',
    Electricity:'বিদ্যুৎ', Rent:'ভাড়া', Internet:'ইন্টারনেট',
    Repair:'মেরামত', Tax:'কর', Packaging:'প্যাকেজিং', Misc:'অন্যান্য'
  };

  // ── Insights ──────────────────────────────────────────
  const topProduct  = (d.productStats  || [])[0] || null;
  const topCustomer = (d.customerStats || [])[0] || null;
  const topCategory = (d.expenseByCategory || [])[0] || null;
  const topPayEntry = Object.entries(d.paymentBreakdown || {})
    .sort(([,a],[,b]) => b - a)[0] || null;
  const bestDay     = d.insights?.highestSaleDay || null;

  const insightRows = [
    ['📦 সেরা পণ্য',          topProduct  ? topProduct.name             : '—',
     topProduct  ? `${fmtNum(topProduct.qty)} বিক্রয় · ${fmt(topProduct.revenue)}` : '—'],
    ['👤 শীর্ষ গ্রাহক ',       topCustomer ? topCustomer.name            : '—',
     topCustomer ? `${fmt(topCustomer.purchased)} কেনাকাটা`             : '—'],
    ['🧾 সর্বোচ্চ খরচ ক্যাট', topCategory ? (CAT_BN[topCategory.category] || topCategory.category) : '—',
     topCategory ? fmt(topCategory.amount)                              : '—'],
    ['📅 সর্বোচ্চ বিক্রির দিন', bestDay   ? fmtDate(bestDay.date)       : '—',
     bestDay     ? `${fmt(bestDay.value)} · ${fmtNum(bestDay.txnCount)} লেনদেন` : '—'],
    ['💳 প্রধান পেমেন্ট মাধ্যম', topPayEntry ? (PM_BN[topPayEntry[0]] || topPayEntry[0]) : '—',
     topPayEntry ? fmt(topPayEntry[1])                                  : '—']
  ].map(([label, name, value]) => `
    <tr>
      <td>${label}</td>
      <td>${name}</td>
      <td style="text-align:right;font-weight:600;color:#2d6a4f">${value}</td>
    </tr>`).join('');

  // ── Transaction table rows (limit 50 for print readability) ──
  const txnRows = (d.transactions || []).slice(0, 50).map((t, i) => `
    <tr style="background:${i%2===0?'#fff':'#f9f9f9'}">
      <td>${fmtDate(t.date)}</td>
      <td>${t.customerName || '—'}</td>
      <td>${t.productName  || '—'}${t.soldQuantity ? ` ×${fmtNum(t.soldQuantity)}` : ''}</td>
      <td style="text-align:right">${fmt(t.amount)}</td>
      <td style="text-align:right;color:#2d6a4f">${fmt(t.repaidAmount || 0)}</td>
      <td style="text-align:right;color:#e63946">
        ${fmt(Math.max(0, t.amount - (t.repaidAmount||0)))}
      </td>
      <td>${PM_BN[t.paymentMethod] || t.paymentMethod || '—'}</td>
      <td>${TXN_BN[t.type] || t.type}</td>
    </tr>`).join('');

  const txnOverflowNote = (d.transactions || []).length > 50
    ? `<p style="font-size:0.75rem;color:#888;margin-top:0.4rem">
         * মোট ${fmtNum(d.transactions.length)} লেনদেনের মধ্যে প্রথম ৫০টি দেখানো হয়েছে।
       </p>` : '';

  // ── Expense rows ──────────────────────────────────────
  const expRows = (d.expenses || []).map((e, i) => `
    <tr style="background:${i%2===0?'#fff':'#f9f9f9'}">
      <td>${fmtDate(e.date)}</td>
      <td>${e.title}</td>
      <td>${CAT_BN[e.category] || e.category}</td>
      <td>${e.note || '—'}</td>
      <td style="text-align:right;color:#e63946;font-weight:600">${fmt(e.amount)}</td>
      <td>${PM_BN[e.paymentMethod] || e.paymentMethod || '—'}</td>
    </tr>`).join('');

  // ── Product rows ──────────────────────────────────────
  const prodRows = (d.productStats || []).map((p, i) => `
    <tr style="background:${i%2===0?'#fff':'#f9f9f9'}">
      <td>${i < 3 ? ['🥇','🥈','🥉'][i] : `${i+1}.`} ${p.name}</td>
      <td style="text-align:right">${fmtNum(p.qty)}</td>
      <td style="text-align:right;color:#2d6a4f;font-weight:600">${fmt(p.revenue)}</td>
      <td style="text-align:right">${fmtNum(p.txnCount)}</td>
      <td style="text-align:right">
        ${p.currentStock !== null ? fmtNum(p.currentStock) : '—'}
      </td>
    </tr>`).join('');

  // ── Customer rows ─────────────────────────────────────
  const custRows = (d.customerStats || []).map((c, i) => `
    <tr style="background:${i%2===0?'#fff':'#f9f9f9'}">
      <td>${i < 3 ? ['🥇','🥈','🥉'][i] : `${i+1}.`} ${c.name}</td>
      <td style="text-align:right;color:#e9a200;font-weight:600">${fmt(c.purchased)}</td>
      <td style="text-align:right;color:#2d6a4f">${fmt(c.paid)}</td>
      <td style="text-align:right;color:#e63946">${fmt(c.allTimeDue || 0)}</td>
      <td style="text-align:center">${fmtNum(c.trustScore || 0)}</td>
      <td style="text-align:right">${fmtNum(c.repayPct || 0)}%</td>
    </tr>`).join('');

  // ── Chart image helper ────────────────────────────────
  const chartImg = (src, caption) => src
    ? `<div style="text-align:center;margin-bottom:0.6rem">
         <img src="${src}" style="max-width:100%;max-height:220px;
               object-fit:contain;border:1px solid #e0e0e0;border-radius:6px" />
         <div style="font-size:0.72rem;color:#888;margin-top:4px">${caption}</div>
       </div>`
    : '';

  return `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8" />
  <title>${d.monthName} ${d.year} রিপোর্ট — ${shopName}</title>
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&family=Tiro+Bangla&display=swap"
        rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Hind Siliguri', sans-serif;
      font-size: 12.5px;
      color: #1a1a2e;
      background: #fff;
      padding: 2cm 1.8cm;
      max-width: 21cm;
      margin: 0 auto;
      line-height: 1.5;
    }

    /* Header */
    .rh {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 3px solid #1a472a;
      padding-bottom: 0.8rem;
      margin-bottom: 1.3rem;
    }
    .rh-app  { font-family:'Tiro Bangla',serif; font-size:1.4rem; font-weight:700; color:#1a472a; }
    .rh-shop { font-size:0.95rem; font-weight:600; color:#2d6a4f; margin-top:2px; }
    .rh-sub  { font-size:0.78rem; color:#666; margin-top:2px; }
    .rh-r    { text-align:right; font-size:0.8rem; color:#555; }
    .rh-r strong { font-size:1rem; color:#1a472a; display:block; margin-bottom:3px; }

    /* Sections */
    .sec { margin-bottom:1.5rem; page-break-inside:avoid; }
    .sec-title {
      font-family:'Tiro Bangla',serif; font-size:0.9rem; font-weight:700;
      color:#1a472a; border-left:4px solid #40916c;
      padding-left:0.6rem; margin-bottom:0.7rem;
    }

    /* KPI */
    .kpi-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:0.5rem; }
    .kpi {
      border:1px solid #e0e0e0; border-radius:5px;
      padding:0.55rem 0.75rem; border-top:3px solid #40916c;
    }
    .kpi-l { font-size:0.68rem; color:#666; margin-bottom:0.2rem; }
    .kpi-v { font-size:0.95rem; font-weight:700; color:#1a472a; }
    .kpi-v.red   { color:#e63946; }
    .kpi-v.amber { color:#e9a200; }
    .kpi-v.green { color:#2d6a4f; }

    /* Charts grid */
    .chart-grid { display:grid; grid-template-columns:1fr 1fr; gap:0.8rem; }

    /* Tables */
    table   { width:100%; border-collapse:collapse; font-size:0.78rem; }
    th      { background:#f0f5f1; color:#1a472a; font-weight:700;
              padding:0.4rem 0.6rem; text-align:left; border-bottom:2px solid #40916c; }
    td      { padding:0.38rem 0.6rem; border-bottom:1px solid #ebebeb; vertical-align:middle; }
    tfoot td{ font-weight:700; background:#f0f5f1; border-top:2px solid #40916c; }

    /* Footer */
    .footer {
      margin-top:2rem; padding-top:0.6rem; border-top:1px solid #ccc;
      text-align:center; font-size:0.72rem; color:#999;
    }
    .footer span { color:#40916c; font-weight:600; }

    /* Print bar */
    .print-bar {
      position:fixed; top:0; left:0; right:0;
      background:#1a472a; color:#fff;
      padding:0.5rem 1.5rem;
      display:flex; justify-content:space-between; align-items:center;
      z-index:999; font-family:'Hind Siliguri',sans-serif;
    }
    .print-bar button {
      background:#e9c46a; color:#1a472a; border:none; border-radius:5px;
      padding:0.35rem 1rem; font-family:'Hind Siliguri',sans-serif;
      font-size:0.88rem; font-weight:700; cursor:pointer;
    }

    @media print {
      .print-bar { display:none !important; }
      body        { padding:1cm 1.2cm; font-size:11.5px; padding-top:0; }
      .sec        { page-break-inside:avoid; }
      .chart-grid { page-break-inside:avoid; }
      thead       { display:table-header-group; }
      tfoot       { display:table-footer-group; }
      @page { size:A4; margin:1.2cm 1cm; }
    }
  </style>
</head>
<body>

  <!-- Screen-only bar -->
  <div class="print-bar">
    <span>🖨️ প্রিন্ট করুন অথবা "Save as PDF" বাছুন</span>
    <button onclick="window.print()">🖨️ PDF সেভ করুন</button>
  </div>
  <div style="height:2.2rem"></div>

  <!-- Header -->
  <div class="rh">
    <div>
      <div class="rh-app">হালখাতা ডিজিটাল</div>
      <div class="rh-shop">${shopName}</div>
      ${ownerName ? `<div class="rh-sub">${ownerName}</div>` : ''}
    </div>
    <div class="rh-r">
      <strong>মাসিক আর্থিক রিপোর্ট</strong>
      <div>${d.monthName} ${d.year}</div>
      <div>শাখা: ${shop}</div>
      <div>তৈরি: ${now}</div>
    </div>
  </div>

  <!-- Section 1: KPI Summary -->
  <div class="sec">
    <h2 class="sec-title">📊 মাসিক সারসংক্ষেপ</h2>
    <div class="kpi-grid">
      <div class="kpi">
        <div class="kpi-l">💰 মোট আদায়</div>
        <div class="kpi-v green">${fmt(s.totalRevenue)}</div>
      </div>
      <div class="kpi" style="border-top-color:#e63946">
        <div class="kpi-l">🧾 মোট খরচ</div>
        <div class="kpi-v red">${fmt(s.totalExpense)}</div>
      </div>
      <div class="kpi" style="border-top-color:${s.netProfit>=0?'#40916c':'#e63946'}">
        <div class="kpi-l">📈 নেট লাভ/ক্ষতি</div>
        <div class="kpi-v ${s.netProfit>=0?'green':'red'}">
          ${s.netProfit>=0?'+':''}${fmt(s.netProfit)}
        </div>
      </div>
      <div class="kpi" style="border-top-color:#e9c46a">
        <div class="kpi-l">⏳ বাকিতে বিক্রি</div>
        <div class="kpi-v amber">${fmt(s.creditSalesAmt)}</div>
      </div>
      <div class="kpi" style="border-top-color:#2d6a4f">
        <div class="kpi-l">✅ আদায় (নগদ বিক্রি)</div>
        <div class="kpi-v green">${fmt(s.cashSalesAmt)}</div>
      </div>
      <div class="kpi" style="border-top-color:#2d6a4f">
        <div class="kpi-l">✅ আদায় (পরিশোধ)</div>
        <div class="kpi-v green">${fmt(s.collectionsAmt)}</div>
      </div>
      <div class="kpi" style="border-top-color:#e63946">
        <div class="kpi-l">⏳ বর্তমান বাকি</div>
        <div class="kpi-v red">${fmt(s.totalCurrentDue)}</div>
      </div>
      <div class="kpi" style="border-top-color:#e63946">
        <div class="kpi-l">🔴 মেয়াদউত্তীর্ণ</div>
        <div class="kpi-v red">${fmt(s.overdueAmt)}</div>
      </div>
      <div class="kpi">
        <div class="kpi-l">📋 লেনদেন / গ্রাহক </div>
        <div class="kpi-v">${fmtNum(s.txnCount)} / ${fmtNum(s.customerCount||0)}</div>
      </div>
    </div>
  </div>

  <!-- Section 2: Insights -->
  <div class="sec">
    <h2 class="sec-title">💡 মাসিক ইনসাইট</h2>
    <table>
      <thead><tr><th>ইনসাইট</th><th>বিষয়</th><th style="text-align:right">মান</th></tr></thead>
      <tbody>${insightRows}</tbody>
    </table>
  </div>

  <!-- Section 3: Charts -->
  ${(chartImages.summaryBar || chartImages.dailyLine || chartImages.expDonut || chartImages.payDonut)
    ? `<div class="sec">
         <h2 class="sec-title">📊 চার্ট</h2>
         <div class="chart-grid">
           ${chartImg(chartImages.summaryBar, 'আদায়  vs খরচ')}
           ${chartImg(chartImages.dailyLine,  'দৈনিক নগদ প্রবাহ')}
           ${chartImg(chartImages.expDonut,   'খরচ ক্যাটাগরি')}
           ${chartImg(chartImages.payDonut,   'পেমেন্ট মাধ্যম')}
           ${chartImg(chartImages.productBar, 'শীর্ষ পণ্য')}
           ${chartImg(chartImages.topBuyers,  'শীর্ষ ক্রেতা')}
         </div>
       </div>`
    : ''}

  <!-- Section 4: Transactions -->
  ${(d.transactions||[]).length ? `
  <div class="sec">
    <h2 class="sec-title">💰 লেনদেন</h2>
    <table>
      <thead>
        <tr>
          <th>তারিখ</th><th>গ্রাহক</th><th>পণ্য</th>
          <th style="text-align:right">মোট</th>
          <th style="text-align:right">পরিশোধ</th>
          <th style="text-align:right">বাকি</th>
          <th>পেমেন্ট</th><th>ধরন</th>
        </tr>
      </thead>
      <tbody>${txnRows}</tbody>
      <tfoot>
        <tr>
          <td colspan="3">মোট</td>
          <td style="text-align:right">${fmt(s.creditSalesAmt + s.cashSalesAmt)}</td>
          <td style="text-align:right">${fmt(s.collectionsAmt + s.cashSalesAmt)}</td> <!-- আদায় -->
          <td style="text-align:right;color:#e63946">${fmt(s.totalCurrentDue)}</td>
          <td colspan="2"></td>
        </tr>
      </tfoot>
    </table>
    ${txnOverflowNote}
  </div>` : ''}

  <!-- Section 5: Expenses -->
  ${(d.expenses||[]).length ? `
  <div class="sec">
    <h2 class="sec-title">🧾 খরচ</h2>
    <table>
      <thead>
        <tr>
          <th>তারিখ</th><th>শিরোনাম</th><th>ক্যাটাগরি</th>
          <th>নোট</th><th style="text-align:right">পরিমাণ</th><th>পেমেন্ট</th>
        </tr>
      </thead>
      <tbody>${expRows}</tbody>
      <tfoot>
        <tr>
          <td colspan="4">মোট খরচ</td>
          <td style="text-align:right;color:#e63946">${fmt(s.totalExpense)}</td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  </div>` : ''}

  <!-- Section 6: Top Products -->
  ${(d.productStats||[]).length ? `
  <div class="sec">
    <h2 class="sec-title">📦 শীর্ষ পণ্য</h2>
    <table>
      <thead>
        <tr>
          <th>পণ্য</th>
          <th style="text-align:right">বিক্রয়</th>
          <th style="text-align:right">আদায় </th>
          <th style="text-align:right">লেনদেন</th>
          <th style="text-align:right">বর্তমান স্টক</th>
        </tr>
      </thead>
      <tbody>${prodRows}</tbody>
    </table>
  </div>` : ''}

  <!-- Section 7: Top Customers -->
  ${(d.customerStats||[]).length ? `
  <div class="sec">
    <h2 class="sec-title">👥 শীর্ষ গ্রাহক</h2>
    <table>
      <thead>
        <tr>
          <th>গ্রাহক</th>
          <th style="text-align:right">কেনাকাটা</th>
          <th style="text-align:right">পরিশোধ</th>
          <th style="text-align:right">বাকি</th>
          <th style="text-align:center">বিশ্বস্ততা</th>
          <th style="text-align:right">পরিশোধ হার</th>
        </tr>
      </thead>
      <tbody>${custRows}</tbody>
    </table>
  </div>` : ''}

  <!-- Footer -->
  <div class="footer">
    তৈরি করা হয়েছে <span>হালখাতা ডিজিটাল</span> দ্বারা &nbsp;·&nbsp;
    ${shopName} &nbsp;·&nbsp; ${d.monthName} ${d.year} &nbsp;·&nbsp; ${now}
  </div>

</body>
</html>`;
}

// ─── Tooltip definitions ──────────────────────────────
const KPI_TIPS = {
  totalReceivable: 'মোট পাওনা\n= গ্রাহকের কাছে এখনো\nবাকি আছে যা আদায় হয়নি',
  totalPaid:       'মোট আদায়\n= নগদ বিক্রি + গ্রাহকের\nপরিশোধ করা বকেয়া',
  overdueAmount:   'মেয়াদউত্তীর্ণ\n= পরিশোধের তারিখ পার\nহয়ে গেছে এমন বকেয়া',
  totalCustomers:  'মোট গ্রাহক \n= অ্যাপে নিবন্ধিত\nসকল সক্রিয় গ্রাহক ',
  totalSales:      'মোট বিক্রি\n= নগদ বিক্রি\n+ বাকিতে বিক্রি',
  totalAdai:       'মোট আদায়\n= নগদ বিক্রি\n+ গ্রাহকের পরিশোধ',
  cashSales:       'নগদ বিক্রি\n= সঙ্গে সঙ্গে টাকা\nপাওয়া বিক্রয়',
  creditSales:     'বাকিতে বিক্রি\n= পরে পরিশোধের\nশর্তে বিক্রয়',
  collections:     'পরিশোধ আদায়\n= গ্রাহক পুরনো\nবাকি পরিশোধ করেছেন',
  netProfit:       'নেট লাভ/ক্ষতি\n= মোট আদায়\n− মোট খরচ',
  totalExpense:    'মোট খরচ\n= দোকানের সকল\nপরিচালনা খরচ',
  currentDue:      'বর্তমান বাকি\n= মোট বাকি বিক্রি\n− মোট পরিশোধ',
  overdueAmt:      'মেয়াদউত্তীর্ণ বকেয়া\n= শেষ তারিখ পেরিয়ে\nগেছে এমন বাকি',
  trustScore:      'বিশ্বস্ততা স্কোর\n= সময়মতো পরিশোধের\nইতিহাসের উপর ভিত্তি করে',
  weeklyCredit:    'এই সপ্তাহের আদায়\n= গত ৭ দিনে\nপ্রাপ্ত অর্থ',
  highRisk:        'ঝুঁকিপূর্ণ গ্রাহক \n= বিশ্বস্ততা স্কোর\n৪০ এর নিচে',
};

// Helper: renders a ? icon with tooltip
function tipIcon(key, extraClass) {
  const tip = KPI_TIPS[key] || '';
  const cls = extraClass ? `kpi-help ${extraClass}` : 'kpi-help';
  return `<button class="${cls}" data-tip="${tip}" tabindex="0" aria-label="সাহায্য">?</button>`;
}

// ─── Body-anchored tooltip engine ─────────────────────
(function initTooltipEngine() {
  // Create single shared bubble appended to body
  const bubble = document.createElement('div');
  bubble.id    = 'kpi-tooltip-bubble';
  document.body.appendChild(bubble);

  let hideTimer = null;

  function show(btn) {
    const tip = btn.getAttribute('data-tip');
    if (!tip) return;

    clearTimeout(hideTimer);
    bubble.textContent = tip;    // safe — no HTML in tips
    bubble.classList.remove('tip-above', 'tip-below', 'visible');

    const rect      = btn.getBoundingClientRect();
    const bubbleW   = 220;
    const margin    = 8;

    // Position: try above first
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    const placeAbove = spaceAbove > 80 || spaceAbove > spaceBelow;

    // Horizontal centre on button, clamped to viewport
    let left = rect.left + rect.width / 2 - bubbleW / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - bubbleW - margin));

    if (placeAbove) {
      bubble.style.top    = `${rect.top - margin}px`;
      bubble.style.left   = `${left}px`;
      bubble.style.transform = 'translateY(-100%)';
      bubble.classList.add('tip-above');
    } else {
      bubble.style.top    = `${rect.bottom + margin}px`;
      bubble.style.left   = `${left}px`;
      bubble.style.transform = 'none';
      bubble.classList.add('tip-below');
    }

    bubble.classList.add('visible');
  }

  function hide() {
    hideTimer = setTimeout(() => bubble.classList.remove('visible'), 80);
  }

  // Delegate — works for dynamically rendered buttons too
  document.addEventListener('mouseover', e => {
    const btn = e.target.closest('.kpi-help');
    if (btn) show(btn);
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('.kpi-help')) hide();
  });
  document.addEventListener('focusin', e => {
    const btn = e.target.closest('.kpi-help');
    if (btn) show(btn);
  });
  document.addEventListener('focusout', e => {
    if (e.target.closest('.kpi-help')) hide();
  });
  // Hide on scroll (position would be stale)
  document.addEventListener('scroll', () => bubble.classList.remove('visible'), true);
})();

// ─── Dashboard ────────────────────────────────────────
async function loadDashboard() {
  try {
    const url  = `/api/dashboard${currentShop ? `?shop=${encodeURIComponent(currentShop)}` : ''}`;
    const data = await API(url);

    const auth      = JSON.parse(sessionStorage.getItem('halkhata_auth') || '{}');
    const ownerName = auth.ownerName || auth.shopName || 'ব্যবসায়ী';
    const todayStr  = new Date().toLocaleDateString('bn-BD', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });

    // ── KPI cards eikhane ───────────────────────────────────────── 
const kpiCards = [
      { icon:'💵', label:'মোট পাওনা',      tipKey:'totalReceivable', value: formatTaka(data.totalReceivable),  border:'#40916c', ibg:'rgba(64,145,108,0.1)',  sub:`এই সপ্তাহে: ${formatTaka(data.weeklyDebit||0)}` },
      { icon:'✅', label:'মোট আদায়',        tipKey:'totalPaid',       value: formatTaka(data.totalPaid),        border:'#52b788', ibg:'rgba(82,183,136,0.1)',  sub:`সপ্তাহে: ${formatTaka(data.weeklyCredit||0)}` },
      { icon:'⚠️', label:'মেয়াদউত্তীর্ণ', tipKey:'overdueAmount',   value: formatTaka(data.overdueAmount),   border:'#e63946', ibg:'rgba(230,57,70,0.09)', sub:`${formatNumber(data.overdueCount||0)} লেনদেন বকেয়া`, danger:true },
      { icon:'👥', label:'মোট গ্রাহক',     tipKey:'totalCustomers',  value: formatNumber(data.totalCustomers), border:'#e9c46a', ibg:'rgba(233,196,106,0.13)', sub:`ঝুঁকিপূর্ণ: ${formatNumber(data.highRiskCustomers||0)} জন` }
    ];

    const kpiHTML = kpiCards.map((k, i) => `
      <div class="db2-kpi" style="border-top-color:${k.border}">
        <div class="db2-kpi-header">
          <div class="db2-kpi-icon" style="background:${k.ibg}">${k.icon}</div>
          <div class="kpi-tooltip-wrap">
            <span class="db2-kpi-lbl">${k.label}</span>
            ${tipIcon(k.tipKey, i >= 2 ? 'tip-left' : '')}
          </div>
        </div>
        <div class="db2-kpi-val ${k.danger?'db2-danger':''}">${k.value}</div>
        <div class="db2-kpi-sub">${k.sub}</div>
      </div>`).join('');

    // ── Wallet mini cards ─────────────────────────────────
    const PM_ICONS = { cash:'💵', bkash:'📱', nagad:'🟠', rocket:'🚀', bank:'🏦' };
    let walletHTML = '';
    if (data.accounts?.length) {
      const totalAbs = data.accounts.reduce((s,a) => s + Math.abs(a.balance), 0) || 1;
      walletHTML = data.accounts.map(a => {
        const pct = Math.round(Math.abs(a.balance) / totalAbs * 100);
        return `
        <div class="db2-wallet">
          <div class="db2-wallet-top">
            <span class="db2-wallet-icon">${PM_ICONS[a.id]||'💰'}</span>
            <span class="db2-wallet-pct">${formatNumber(pct)}%</span>
          </div>
          <div class="db2-wallet-amt ${a.balance<0?'db2-danger':''}">${formatTaka(a.balance)}</div>
          <div class="db2-wallet-name">${a.name}</div>
        </div>`;
      }).join('');
    }

    // ── Recent transactions ───────────────────────────────
    const recentItems = data.recentTransactions || [];
    const TXN_COLORS = {
      debit:    { bg:'#fff8e1', fg:'#e65100', label:'বাকি'  },
      credit:   { bg:'#e8f5e9', fg:'#2e7d32', label:'পেমেন্ট' },
      cash_sale:{ bg:'#e3f2fd', fg:'#1565c0', label:'নগদ'   }
    };
    let recentHTML = recentItems.length
      ? recentItems.map(t => {
          const tc    = TXN_COLORS[t.type] || TXN_COLORS.debit;
          const init  = (t.customerName||'?').charAt(0);
          const sign  = t.type==='credit' ? '−' : '+';
          const amtCl = t.type==='credit' ? 'db2-amt-green' : 'db2-amt-amber';
          return `
          <div class="db2-txn-row" onclick="navigate('transactions')" tabindex="0">
            <div class="db2-txn-av" style="background:${tc.bg};color:${tc.fg}">${init}</div>
            <div class="db2-txn-body">
              <div class="db2-txn-name">${t.customerName||'—'}</div>
              <div class="db2-txn-meta">
                <span class="db2-badge" style="background:${tc.bg};color:${tc.fg}">${tc.label}</span>
                <span>${formatDateShort(t.date)}</span>
                ${t.note ? `<span>· ${t.note.slice(0,18)}</span>` : ''}
              </div>
            </div>
            <div class="db2-txn-amt ${amtCl}">${sign}${formatTaka(t.amount)}</div>
          </div>`;
        }).join('') +
        `<button class="db2-see-all" onclick="navigate('transactions')">সব লেনদেন দেখুন →</button>`
      : `<div class="empty-state"><div class="empty-icon">📋</div><p>কোনো লেনদেন নেই</p></div>`;

    // ── Top due customers ─────────────────────────────────
    let topDueHTML = `<div class="empty-state"><div class="empty-icon">✅</div><p>কোনো বকেয়া নেই</p></div>`;
    try {
      const custs  = await fetchCustomersWithCache(currentShop);
      const ranked = custs.filter(c=>(c.balance||0)>0).sort((a,b)=>b.balance-a.balance).slice(0,5);
      if (ranked.length) {
        const max = ranked[0].balance;
        const MEDALS = ['🥇','🥈','🥉'];
        topDueHTML = ranked.map((c,i) => {
          const pct  = Math.round(c.balance/max*100);
          const rank = i<3 ? `<span class="db2-medal">${MEDALS[i]}</span>`
                           : `<span class="db2-rank-num">#${i+1}</span>`;
          const sev  = pct>75?'var(--red)':pct>40?'var(--amber-dark)':'#e9c46a';
          return `
          <div class="db2-due-row" onclick="openCustomerDetail('${c.id}')" tabindex="0">
            <div class="db2-due-rank">${rank}</div>
            <div class="db2-due-body">
              <div class="db2-due-name">${c.name}</div>
              <div class="db2-due-bar-track">
                <div class="db2-due-bar-fill" style="width:${pct}%;background:${sev}"></div>
              </div>
              <div class="db2-due-phone">${c.phone||'—'}</div>
            </div>
            <div class="db2-due-amt" style="color:${sev}">${formatTaka(c.balance)}</div>
          </div>`;
        }).join('') +
        `<button class="db2-see-all" onclick="navigate('overdue')">সব বকেয়া দেখুন →</button>`;
      }
    } catch {}

    // ── Due summary ───────────────────────────────────────
    const dueSummaryHTML = [
      { icon:'⏳', label:'মোট বকেয়া',     val: formatTaka(data.totalReceivable), color:'var(--amber-dark)' },
      { icon:'🔴', label:'মেয়াদ উত্তীর্ণ', val: formatTaka(data.overdueAmount),   color:'var(--red)'        },
      { icon:'📅', label:'শীঘ্রই বকেয়া',    val: formatNumber(data.overdueCount||0)+' টি', color:'#c87f00'   }
    ].map(d => `
      <div class="db2-duesum">
        <div class="db2-duesum-icon">${d.icon}</div>
        <div>
          <div class="db2-duesum-lbl">${d.label}</div>
          <div class="db2-duesum-val" style="color:${d.color}">${d.val}</div>
        </div>
      </div>`).join('');

    // ── Quick actions ─────────────────────────────────────
    const QUICK = [
      { icon:'👤', label:'নতুন গ্রাহক',    fn:`navigate('customers');setTimeout(openAddCustomer,200)` },
      { icon:'➕', label:'বাকি রেকর্ড',     fn:`openAddTransaction()`  },
      { icon:'📞', label:'বকেয়া তালিকা',   fn:`navigate('overdue')`   },
      { icon:'📈', label:'রিপোর্ট',         fn:`navigate('report')`    },
      { icon:'💾', label:'ব্যাকআপ',         fn:`exportBackup()`        },
      { icon:'🧪', label:'ডেমো ডেটা',      fn:`loadDemoData()`        }
    ];
    const quickHTML = QUICK.map(q => `
      <button class="db2-quick" onclick="${q.fn}">
        <span class="db2-quick-icon">${q.icon}</span>
        <span>${q.label}</span>
      </button>`).join('');

    // ── Inject HTML ───────────────────────────────────────
    document.getElementById('page-dashboard').innerHTML = `

      <!-- HEADER ROW -->
      <div class="db2-header">
        <div class="db2-greeting-block">
          <h2 class="db2-greeting">স্বাগতম, ${ownerName} 👋</h2>
          <p class="db2-subtitle">আপনার দোকানের আজকের সারসংক্ষেপ নিচে দেখুন।</p>
        </div>
        <div class="db2-header-actions">
          <div class="db2-date">${todayStr}</div>
          <button class="btn-primary db2-hero-btn" onclick="openAddTransaction()">+ লেনদেন যোগ করুন</button>
        </div>
      </div>

      <!-- ROW 1: KPI CARDS -->
      <div class="db2-kpi-row">${kpiHTML}</div>

      <!-- ROW 2: WALLET MINI CARDS -->
      ${walletHTML ? `<div class="db2-wallet-row">${walletHTML}</div>` : ''}

      <!-- ROW 3: MAIN 3-COL -->
      <div class="db2-main-row">

        <!-- COL 1: Recent Transactions -->
        <div class="db2-card">
          <div class="db2-card-hdr">📋 সাম্প্রতিক লেনদেন</div>
          <div class="db2-card-body db2-txn-list">${recentHTML}</div>
        </div>

        <!-- COL 2: Income vs Expense Chart -->
        <div class="db2-card">
          <div class="db2-card-hdr" style="justify-content:space-between">
            <span>📈 আয় বনাম খরচ</span>
            <div class="db2-trend-tabs">
              <button class="db2-tab active" onclick="loadDashboardChart(7,this)">৭ দিন</button>
              <button class="db2-tab" onclick="loadDashboardChart(30,this)">৩০ দিন</button>
            </div>
          </div>
          <div class="db2-card-body">
            <div style="position:relative;height:200px">
              <canvas id="chart-db2-trend"></canvas>
            </div>
          </div>
        </div>

        <!-- COL 3: Top Due Customers -->
        <div class="db2-card">
          <div class="db2-card-hdr">🏆 সর্বোচ্চ বাকি গ্রাহক</div>
          <div class="db2-card-body">${topDueHTML}</div>
        </div>

      </div>

      <!-- ROW 4: DUE SUMMARY + QUICK ACTIONS -->
      <div class="db2-bottom-row">

        <div class="db2-card">
          <div class="db2-card-hdr">💰 বকেয়া সারসংক্ষেপ</div>
          <div class="db2-card-body db2-duesum-grid">${dueSummaryHTML}</div>
        </div>

        <div class="db2-card">
          <div class="db2-card-hdr">⚡ দ্রুত কাজ</div>
          <div class="db2-card-body db2-quick-grid">${quickHTML}</div>
        </div>

      </div>`;

    // Draw trend chart
    requestAnimationFrame(() => loadDashboardChart(7));

  } catch (e) {
    console.error('Dashboard error:', e);
  }
}

// ─── Dashboard Trend Chart ────────────────────────────
async function loadDashboardChart(days, btnEl) {
  if (btnEl) {
    document.querySelectorAll('.db2-tab').forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');
  }

  try {
    const [txns, exps] = await Promise.all([
      API('/api/transactions').catch(() => []),
      API('/api/expenses').catch(()     => [])
    ]);

    const today   = new Date();
    const labels  = [], revenue = [], expense = [];

    for (let i = days - 1; i >= 0; i--) {
      const d   = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      labels.push(d.toLocaleDateString('bn-BD', { day:'numeric', month:'short' }));

      revenue.push(txns
        .filter(t => t.date.startsWith(key) && (t.type==='credit'||t.type==='cash_sale'))
        .reduce((s,t) => s+t.amount, 0));
      expense.push(exps
        .filter(e => e.date.startsWith(key))
        .reduce((s,e) => s+e.amount, 0));
    }

    destroyChart('db2-trend');
    const canvas = document.getElementById('chart-db2-trend');
    if (!canvas || !window.Chart) return;

    CHARTS['db2-trend'] = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'আদায়', data: revenue,
            borderColor: '#40916c', backgroundColor: 'rgba(64,145,108,0.07)',
            borderWidth: 2, tension: 0.38, fill: true,
            pointRadius: revenue.map(v=>v>0?3:0), pointHoverRadius: 5
          },
          {
            label: 'খরচ', data: expense,
            borderColor: '#e63946', backgroundColor: 'rgba(230,57,70,0.05)',
            borderWidth: 2, tension: 0.38, fill: true,
            pointRadius: expense.map(v=>v>0?3:0), pointHoverRadius: 5
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode:'index', intersect:false },
        plugins: {
          legend: {
            display: true, position: 'top',
            labels: { font:{ family:'Hind Siliguri', size:11 }, boxWidth:12, padding:10 }
          },
          tooltip: {
            callbacks: { label: ctx => ` ${ctx.dataset.label}: ৳${ctx.raw.toLocaleString('bn-BD')}` },
            bodyFont: { family:'Hind Siliguri' }
          }
        },
        scales: {
          x: {
            grid: { display:false },
            ticks: { font:{ family:'Hind Siliguri', size:9 }, maxTicksLimit:10, maxRotation:0 }
          },
          y: {
            beginAtZero: true,
            grid: { color:'rgba(0,0,0,0.04)' },
            ticks: {
              font: { family:'Hind Siliguri', size:9 },
              callback: v => v>=1000 ? '৳'+(v/1000).toFixed(0)+'k' : '৳'+v
            }
          }
        }
      }
    });
  } catch (e) { console.warn('Chart error:', e); }
}

// ─── Customers ────────────────────────────────────────
async function loadCustomers() {
  const search = $('customer-search')?.value || '';
  const url = `/api/customers?search=${encodeURIComponent(search)}${currentShop ? `&shop=${encodeURIComponent(currentShop)}` : ''}`;
  const [customers, allTxns] = await Promise.all([
    fetchCustomersWithCache(currentShop),   // ← replaces direct API call
    API('/api/transactions').catch(() => JSON.parse(localStorage.getItem('offline_transactions_log') || '[]'))
  ]);

  // Annotate each customer with due flags
  customers.forEach(c => {
    const cTxns = allTxns.filter(t => t.customerId === c.id);
    const statuses = cTxns.map(getDueStatus).filter(Boolean);
    c.hasOverdue  = statuses.some(s => s.status === 'overdue');
    c.hasDueSoon  = !c.hasOverdue && statuses.some(s => s.status === 'due-soon');
  });
  const el = $('customer-list');

  if (!customers.length) {
    el.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">👥</div><p>কোনো গ্রাহক পাওয়া যায়নি</p></div>';
    return;
  }

  el.innerHTML = customers.map(c => {
    const trust = c.trustScore || 0;
    const trustClass = trust >= 70 ? 'trust-high' : trust >= 40 ? 'trust-mid' : 'trust-low';
    const trustLabel = trust >= 70 ? 'বিশ্বস্ত' : trust >= 40 ? 'মাঝারি' : 'ঝুঁকিপূর্ণ';
    const balClass = (c.balance || 0) > 0 ? 'balance-positive' : 'balance-zero';

    // Due badge: driven from balance + overdue flag on customer object
    const dueBadge = c.hasOverdue
      ? `<span class="due-tag due-tag--overdue">🔴 বকেয়া</span>`
      : c.hasDueSoon
        ? `<span class="due-tag due-tag--due-soon">🟡 শীঘ্রই</span>`
        : '';

    return `
    <div class="customer-card" onclick="openCustomerDetail('${c.id}')">
      <div class="customer-shop-tag">${c.shop || ''}</div>
      <div class="customer-card-header">
        <div>
          <div class="customer-name">${c.name}</div>
          <div class="customer-phone">${c.phone || '—'}</div>
          ${dueBadge}
        </div>
        <span class="trust-badge ${trustClass}">${trustLabel} (${trust})</span>
      </div>
      <div class="customer-balance">
        <span class="balance-label">বাকি আছে</span>
        <span class="balance-amount ${balClass}">${formatTaka(c.balance || 0)}</span>
      </div>
    </div>`;
  }).join('');
}

function searchCustomers() { loadCustomers(); }

function openAddCustomer() {
  $('customer-modal-title').textContent = 'নতুন গ্রাহক  যোগ করুন';
  $('customer-id').value = '';
  $('c-name').value = '';
  $('c-phone').value = '';
  $('c-address').value = '';
  $('c-limit').value = '5000';
  populateShopDropdowns();
  openModal('modal-customer');
}

async function saveCustomer() {
  const name = $('c-name').value.trim();
  if (!name) return showToast('নাম দিতে হবে!', 'error');
  const id = $('customer-id').value;
  const selectedShop = localStorage.getItem('selectedShop') || 'প্রধান শাখা';
  console.log('Saving customer to shop:', selectedShop);

  const body = {
  name, phone: $('c-phone').value.trim(),
  address: $('c-address').value.trim(),
  creditLimit: $('c-limit').value,
  shop: selectedShop
  };
  try {
    if (id) {
      await API(`/api/customers/${id}`, { method: 'PUT', body: JSON.stringify(body) });
      showToast('গ্রাহকের তথ্য আপডেট হয়েছে');
    } else {
      await API('/api/customers', { method: 'POST', body: JSON.stringify(body) });
      showToast('নতুন গ্রাহক  যোগ হয়েছে ✅');
    }
    closeModal('modal-customer');
    loadCustomers();
  } catch (e) {
    showToast('সংরক্ষণ করতে সমস্যা হয়েছে', 'error');
  }
}

async function openCustomerDetail(id) {
  try {
    const data = await API(`/api/customers/${id}/analytics`);
    currentCustomer = { ...data.customer, balance: data.stats.currentDue };

    const { customer, stats, timeline } = data;
    const trust = customer.trustScore || 0;

    // Avatar initial
    $('detail-avatar').textContent = customer.name.charAt(0);

    // Header
    $('detail-name').textContent = customer.name;
    $('detail-meta').innerHTML   = `
      ${customer.phone ? `📞 ${customer.phone}` : ''}
      ${customer.address ? ` &nbsp;|&nbsp; 📍 ${customer.address}` : ''}
      &nbsp;|&nbsp; 🏪 ${customer.shop || '—'}
    `;

// ── Top stat bar ──────────────────────────────────────
    $('detail-stat-bar').innerHTML = [
      {
        label: 'মোট কেনাকাটা',
        value: formatTaka(stats.totalPurchaseAmt),   // debit + cash_sale
        color: 'var(--amber-dark)'
      },
      {
        label: 'মোট পরিশোধ',
        value: formatTaka(stats.totalPaid),           // cash_sale + repayments
        color: 'var(--green-light)'
      },
      {
        label: 'বর্তমান বাকি',
        value: formatTaka(stats.currentDue),          // debit - repayments only
        color: stats.currentDue > 0 ? 'var(--red)' : 'var(--green-light)'
      },
      {
        label: 'মোট লেনদেন',
        value: formatNumber(stats.txnCount),
        color: 'var(--green-dark)'
      }
    ].map((s, i) => `
      <div style="padding:1rem;text-align:center;
                  ${i < 3 ? 'border-right:1px solid var(--border);' : ''}">
        <div style="font-size:1.3rem;font-weight:700;color:${s.color}">${s.value}</div>
        <div style="font-size:0.75rem;color:var(--ink-light);margin-top:3px">${s.label}</div>
      </div>
    `).join('');

    // ── Analytics row ─────────────────────────────────────
    const lastDate = stats.lastTxnDate
      ? formatDateShort(stats.lastTxnDate)
      : '—';
    const analyticsItems = [
      {
        icon: '📅',
        label: 'শেষ লেনদেন',
        value: stats.lastTxnDate ? formatDateShort(stats.lastTxnDate) : '—'
      },
      {
        icon: '💵',
        label: 'গড় কেনাকাটা',
        value: formatTaka(stats.avgTxnAmount)         // avg over purchase events only
      },
      {
        icon: '✅',
        label: 'পরিশোধ হার',
        value: `${formatNumber(stats.repaymentPct)}%` // repayments vs credit sales
      },
      {
        icon: '⚠️',
        label: 'মেয়াদউত্তীর্ণ',
        value: formatNumber(stats.overdueCount)
      },
      {
        icon: '🛒',
        label: 'ক্রেডিট কেনা',
        value: formatNumber(stats.debitCount)          // debit (credit sale) count
      },
      {
        icon: '💰',
        label: 'নগদ কেনা',
        value: formatNumber(stats.cashSaleCount)       // cash_sale count
      },
      {
        icon: '📦',
        label: 'বেশি কেনা পণ্য',
        value: stats.mostBought
          ? `${stats.mostBought.name} (${formatNumber(stats.mostBought.qty)})`
          : '—'
      }
    ];
    $('detail-analytics-row').innerHTML = analyticsItems.map(a => `
      <div style="display:flex;align-items:center;gap:0.4rem;
                  background:#fff;border-radius:var(--radius-sm);
                  padding:0.45rem 0.75rem;border:1px solid var(--border);
                  font-size:0.82rem;white-space:nowrap">
        <span>${a.icon}</span>
        <span style="color:var(--ink-light)">${a.label}:</span>
        <strong>${a.value}</strong>
      </div>
    `).join('');

    // ── Trust score ───────────────────────────────────────
    const trustColor = trust >= 70 ? 'var(--green-light)' : trust >= 40 ? 'var(--amber-dark)' : 'var(--red)';
    const trustLabel = trust >= 70 ? 'বিশ্বস্ত' : trust >= 40 ? 'মাঝারি' : 'ঝুঁকিপূর্ণ';
    const trustReasons = buildTrustReasons(stats, trust);

    $('detail-trust-section').innerHTML = `
      <div style="position:relative;width:64px;height:64px;flex-shrink:0">
        <svg viewBox="0 0 36 36" style="width:64px;height:64px;transform:rotate(-90deg)">
          <path fill="none" stroke="var(--cream-dark)" stroke-width="3"
            d="M18 2.0845 a15.9155 15.9155 0 0 1 0 31.831 a15.9155 15.9155 0 0 1 0-31.831"/>
          <path fill="none" stroke="${trustColor}" stroke-width="3" stroke-linecap="round"
            stroke-dasharray="${trust},100"
            d="M18 2.0845 a15.9155 15.9155 0 0 1 0 31.831 a15.9155 15.9155 0 0 1 0-31.831"/>
        </svg>
        <span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
                     font-size:0.85rem;font-weight:700;color:${trustColor}">${formatNumber(trust)}</span>
      </div>
      <div>
        <div style="font-weight:700;color:${trustColor};margin-bottom:0.35rem">
          ${trustLabel} গ্রাহক
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:0.3rem">
          ${trustReasons.map(r => `
            <span style="font-size:0.72rem;padding:2px 8px;border-radius:20px;
                         background:${r.bg};color:${r.color}">${r.text}</span>
          `).join('')}
        </div>
      </div>
    `;

    // ── Timeline ──────────────────────────────────────────
    const txnEl = $('detail-transactions');
    if (!timeline.length) {
      txnEl.innerHTML = '<div class="empty-state"><div class="empty-icon">📋</div><p>কোনো লেনদেন নেই</p></div>';
    } else {
      txnEl.innerHTML = timeline.map(t => buildDetailTxnRow(t)).join('');
    }

    openModal('modal-customer-detail');
  } catch (e) {
    console.error(e);
    showToast('লোড করতে সমস্যা হয়েছে', 'error');
  }
}

function buildTrustReasons(stats, trust) {
  const reasons = [];

  if (stats.repaymentPct >= 90)
    reasons.push({ text: `✅ ${formatNumber(stats.repaymentPct)}% পরিশোধিত`, bg: 'var(--green-pale)', color: 'var(--green-dark)' });
  else if (stats.repaymentPct >= 50)
    reasons.push({ text: `⚠️ ${formatNumber(stats.repaymentPct)}% পরিশোধিত`, bg: '#fff3cd', color: '#856404' });
  else
    reasons.push({ text: `❌ মাত্র ${formatNumber(stats.repaymentPct)}% পরিশোধিত`, bg: 'var(--red-pale)', color: 'var(--red)' });

  if (stats.overdueCount === 0)
    reasons.push({ text: '✅ কোনো মেয়াদউত্তীর্ণ নেই', bg: 'var(--green-pale)', color: 'var(--green-dark)' });
  else
    reasons.push({ text: `⚠️ ${formatNumber(stats.overdueCount)}টি মেয়াদউত্তীর্ণ`, bg: 'var(--red-pale)', color: 'var(--red)' });

  if (stats.txnCount >= 10)
    reasons.push({ text: `📊 নিয়মিত (${formatNumber(stats.txnCount)} লেনদেন)`, bg: 'var(--cream-dark)', color: 'var(--ink)' });
  else if (stats.txnCount > 0)
    reasons.push({ text: `📊 নতুন গ্রাহক (${formatNumber(stats.txnCount)} লেনদেন)`, bg: 'var(--cream-dark)', color: 'var(--ink)' });

  return reasons;
}

function buildDetailTxnRow(t) {
  const isDebit    = t.type === 'debit';
  const isCash     = t.type === 'cash_sale';
  const isCredit   = t.type === 'credit';

  const typeLabel  = isDebit  ? 'বাকিতে কিনলেন'
                   : isCash   ? 'নগদে কিনলেন'
                   : 'পরিশোধ করলেন';
  const typeColor  = isDebit  ? 'var(--amber-dark)'
                   : isCash   ? 'var(--green-mid)'
                   : 'var(--green-light)';
  const typeBg     = isDebit  ? '#fff8f0'
                   : isCash   ? 'var(--green-pale)'
                   : '#f0fff4';
  const amtSign    = isCredit ? '−' : '+';

  const PMICONS = { cash: '💵', bkash: '📱', nagad: '🟠', rocket: '🚀', bank: '🏦' };
  const pmIcon  = t.paymentMethod ? (PMICONS[t.paymentMethod] || '💰') : '';

  const dueStatus = getDueStatus(t);
  const dueTag    = dueStatus
    ? `<span class="due-tag due-tag--${dueStatus.status}" style="margin-left:0.4rem">
        ${dueStatus.status === 'overdue' ? '🔴' : '🟡'} ${dueStatus.label}
       </span>`
    : '';

  return `
  <div style="display:flex;gap:0.75rem;padding:0.75rem;margin-bottom:0.5rem;
              background:${typeBg};border-radius:var(--radius-sm);
              border-left:3px solid ${typeColor}">
    <div style="flex:1;min-width:0">
      <div style="display:flex;align-items:center;gap:0.4rem;flex-wrap:wrap;margin-bottom:0.25rem">
        <span style="font-size:0.78rem;font-weight:700;color:${typeColor};
                     padding:1px 7px;border-radius:20px;background:rgba(0,0,0,0.06)">
          ${typeLabel}
        </span>
        ${t.productName
          ? `<span style="font-size:0.78rem;color:var(--ink-light)">
               📦 ${t.productName}${t.soldQuantity ? ` ×${formatNumber(t.soldQuantity)}` : ''}
             </span>`
          : ''}
        ${pmIcon
          ? `<span style="font-size:0.78rem;color:var(--ink-light)">${pmIcon}</span>`
          : ''}
        ${dueTag}
      </div>
      <div style="font-size:0.78rem;color:var(--ink-light)">
        ${formatDate(t.date)}
        ${t.note ? ` &nbsp;·&nbsp; ${t.note}` : ''}
        ${t.shop ? ` &nbsp;·&nbsp; 🏪 ${t.shop}` : ''}
      </div>
    </div>
    <div style="text-align:right;flex-shrink:0">
      <div style="font-size:1rem;font-weight:700;color:${typeColor}">
        ${amtSign}${formatTaka(t.amount)}
      </div>
      <div style="font-size:0.72rem;color:var(--ink-light);margin-top:2px">
        বাকি: ${formatTaka(t.balanceAfter)}
      </div>
      ${t.photo
        ? `<img src="${t.photo}" class="txn-photo-thumb" style="margin-top:4px"
               onclick="event.stopPropagation();showPhoto('${t.photo}')" />`
        : ''}
    </div>
  </div>`;
}

function txnItemHTML(t, showName) {
  const typeClass = t.type === 'debit' ? 'txn-debit' : 'txn-credit';
  const typeLabel = t.type === 'debit' ? '▲ বাকি' : '▼ পেলাম';
  const photoHTML = t.photo
    ? `<img src="${t.photo}" class="txn-photo-thumb" onclick="event.stopPropagation();showPhoto('${t.photo}')" />`
    : '';
  const remindedHTML = t.reminded ? `<span class="txn-badge-reminded">রিমাইন্ড ✓</span>` : '';
  const dueInfo = getDueStatus(t);
  const dueHTML = dueInfo
    ? `<span class="due-tag due-tag--${dueInfo.status}">
        ${dueInfo.status === 'overdue' ? '🔴' : '🟡'} ${dueInfo.label}
       </span>`
    : (t.dueDate ? `<span style="font-size:0.75rem;color:var(--ink-light)">শেষ তারিখ: ${formatDateShort(t.dueDate)}</span>` : '');
  return `
  <div class="txn-item ${typeClass}${dueInfo ? ` txn-${dueInfo.status}` : ''}">
    <div class="txn-indicator"></div>
    <div class="txn-info">
      ${showName ? `<div class="txn-customer-name">${t.customerName || '—'}</div>` : ''}
      <div class="txn-note">${t.note || typeLabel}</div>
      <div class="txn-meta">${formatDate(t.date)} ${dueHTML} ${remindedHTML}</div>
    </div>
    ${photoHTML}
    <div class="txn-amount">${t.type === 'debit' ? '+' : '-'}${formatTaka(t.amount)}</div>
  </div>`;
}

function openAddTransactionForCustomer() {
  closeModal('modal-customer-detail');
  openAddTransaction(currentCustomer?.id);
}

async function deleteCurrentCustomer() {
  if (!currentCustomer) return;
  if (!confirm(`"${currentCustomer.name}" কে মুছবেন? সব লেনদেনও মুছে যাবে।`)) return;
  await API(`/api/customers/${currentCustomer.id}`, { method: 'DELETE' });
  showToast('গ্রাহক  মুছে গেছে');
  closeModal('modal-customer-detail');
  loadCustomers();
}

// ─── Transactions ─────────────────────────────────────
async function loadTransactions() {
  // ── Build query params ────────────────────────────────
  const search    = $('txn-search')?.value.trim().toLowerCase()        || '';
  const typeF     = $('txn-filter-type')?.value                        || '';
  const methodF   = $('txn-filter-method')?.value                      || '';
  const customerF = $('txn-filter-customer')?.value                    || '';
  const dateFrom  = $('txn-date-from')?.value                          || '';
  const dateTo    = $('txn-date-to')?.value                            || '';

  const params = new URLSearchParams();
  if (currentShop) params.set('shop', currentShop);

  let [txns, customers] = await Promise.all([
    API(`/api/transactions?${params}`),
    API('/api/customers')
  ]);

  // Populate customer filter dropdown once
  const custSel = $('txn-filter-customer');
  if (custSel && custSel.options.length <= 1) {
    customers.forEach(c => {
      const opt = document.createElement('option');
      opt.value       = c.id;
      opt.textContent = c.name;
      custSel.appendChild(opt);
    });
  }

  // ── Client-side filtering ─────────────────────────────
  if (typeF)     txns = txns.filter(t => t.type === typeF);
  if (methodF)   txns = txns.filter(t => t.paymentMethod === methodF);
  if (customerF) txns = txns.filter(t => t.customerId === customerF);
  if (dateFrom)  txns = txns.filter(t => t.date >= dateFrom);
  if (dateTo)    txns = txns.filter(t => t.date <= dateTo + 'T23:59:59');
  if (search)    txns = txns.filter(t =>
    (t.customerName  || '').toLowerCase().includes(search) ||
    (t.productName   || '').toLowerCase().includes(search) ||
    (t.note          || '').toLowerCase().includes(search)
  );

  // ── Summary strip ─────────────────────────────────────
  const totalSales = txns.filter(t => t.type === 'debit' || t.type === 'cash_sale')
                         .reduce((s, t) => s + t.amount, 0);
  const totalCol   = txns.filter(t => t.type === 'credit')
                         .reduce((s, t) => s + t.amount, 0);
  const totalDue   = txns.filter(t => t.type === 'debit')
                         .reduce((s, t) => s + Math.max(0, t.amount - (t.repaidAmount || 0)), 0);

  $('txn-summary-strip').innerHTML = `
    <div class="txn-strip-item txn-strip-sales">
      <span>🛒</span><div>
        <div class="txn-strip-val">${formatTaka(totalSales)}</div>
        <div class="txn-strip-lbl">মোট বিক্রি</div>
      </div>
    </div>
    <div class="txn-strip-item txn-strip-col">
      <span>✅</span><div>
        <div class="txn-strip-val">${formatTaka(totalCol)}</div>
        <div class="txn-strip-lbl">মোট আদায়</div>
      </div>
    </div>
    <div class="txn-strip-item txn-strip-due">
      <span>⏳</span><div>
        <div class="txn-strip-val">${formatTaka(totalDue)}</div>
        <div class="txn-strip-lbl">বাকি বকেয়া</div>
      </div>
    </div>
    <div class="txn-strip-item txn-strip-count">
      <span>📋</span><div>
        <div class="txn-strip-val">${formatNumber(txns.length)}</div>
        <div class="txn-strip-lbl">লেনদেন সংখ্যা</div>
      </div>
    </div>
  `;

  // ── Render ────────────────────────────────────────────
  const el = $('transaction-timeline');
  if (!txns.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">💰</div><p>কোনো লেনদেন পাওয়া যায়নি</p></div>';
    return;
  }

  // Group by calendar day
  const groups = {};
  txns.forEach(t => {
    const key = t.date.split('T')[0];
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  });

  el.innerHTML = Object.entries(groups)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([dateKey, items]) => {
      const dayLabel   = getDayLabel(dateKey);
      const daySales   = items.filter(t => t.type === 'debit' || t.type === 'cash_sale').reduce((s,t)=>s+t.amount,0);
      const dayCollect = items.filter(t => t.type === 'credit').reduce((s,t)=>s+t.amount,0);

      return `
      <div class="txn-day-group">
        <div class="txn-day-header">
          <span class="txn-day-label">${dayLabel}</span>
          <div class="txn-day-totals">
            ${daySales   > 0 ? `<span class="txn-day-pill pill-sales">🛒 ${formatTaka(daySales)}</span>`   : ''}
            ${dayCollect > 0 ? `<span class="txn-day-pill pill-collect">✅ ${formatTaka(dayCollect)}</span>` : ''}
          </div>
        </div>
        ${items.map(t => buildRichTxnCard(t)).join('')}
      </div>`;
    }).join('');
}

function getDayLabel(dateStr) {
  const d     = new Date(dateStr);
  const today = new Date(); today.setHours(0,0,0,0);
  const yest  = new Date(today); yest.setDate(yest.getDate() - 1);
  const dDay  = new Date(dateStr); dDay.setHours(0,0,0,0);

  if (dDay.getTime() === today.getTime()) return '📅 আজকে';
  if (dDay.getTime() === yest.getTime())  return '📅 গতকাল';
  return '📅 ' + d.toLocaleDateString('bn-BD', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function buildRichTxnCard(t) {
  const isDebit  = t.type === 'debit';
  const isCash   = t.type === 'cash_sale';
  const isCredit = t.type === 'credit';

  // ── Badges ────────────────────────────────────────────
  const badges = [];

  if (isCash)   badges.push({ text: '💵 নগদ',       cls: 'badge-cash'    });
  if (isDebit)  badges.push({ text: '📒 বাকি',       cls: 'badge-credit'  });
  if (isCredit) badges.push({ text: '✅ পরিশোধ',     cls: 'badge-paid'    });

  if (isDebit) {
    const paid    = t.repaidAmount || 0;
    const today   = new Date();
    const overdue = t.dueDate && new Date(t.dueDate) < today && paid < t.amount;
    const partial = paid > 0 && paid < t.amount;
    const full    = paid >= t.amount;

    if (overdue)      badges.push({ text: '🔴 বকেয়া',         cls: 'badge-overdue'  });
    else if (full)    badges.push({ text: '✅ সম্পূর্ণ পরিশোধ', cls: 'badge-full'     });
    else if (partial) badges.push({ text: `⏳ আংশিক (${formatTaka(paid)})`, cls: 'badge-partial' });
    else              badges.push({ text: '⏳ অপরিশোধিত',       cls: 'badge-unpaid'  });
  }

  if (t.paymentMethod) {
    const PM = { cash:'💵 নগদ', bkash:'📱 বিকাশ', nagad:'🟠 নগদ', rocket:'🚀 রকেট', bank:'🏦 ব্যাংক' };
    badges.push({ text: PM[t.paymentMethod] || t.paymentMethod, cls: 'badge-method' });
  }

  // ── Due indicator ─────────────────────────────────────
  const dueInfo   = getDueStatus(t);
  const dueHTML   = dueInfo
    ? `<span class="due-tag due-tag--${dueInfo.status}">
         ${dueInfo.status === 'overdue' ? '🔴' : '🟡'} ${dueInfo.label}
       </span>`
    : '';

  // ── Color scheme ──────────────────────────────────────
  const borderColor = isCredit ? 'var(--green-light)' : isCash ? 'var(--green-mid)' : 'var(--amber-dark)';
  const amtColor    = isCredit ? 'var(--green-light)' : isCash ? 'var(--green-mid)' : 'var(--amber-dark)';
  const amtSign     = isCredit ? '−' : '+';

  // ── Repayment progress bar ────────────────────────────
  let progressHTML = '';
  if (isDebit && t.amount > 0) {
    const pct = Math.min(100, Math.round(((t.repaidAmount || 0) / t.amount) * 100));
    progressHTML = `
      <div style="margin-top:0.5rem">
        <div style="display:flex;justify-content:space-between;
                    font-size:0.7rem;color:var(--ink-light);margin-bottom:3px">
          <span>পরিশোধ অগ্রগতি</span>
          <span>${formatNumber(pct)}%</span>
        </div>
        <div style="height:5px;background:var(--cream-dark);border-radius:3px;overflow:hidden">
          <div style="height:100%;width:${pct}%;border-radius:3px;
                      background:${pct >= 100 ? 'var(--green-light)' : pct > 0 ? 'var(--amber-dark)' : 'var(--border)'}">
          </div>
        </div>
      </div>`;
  }

  return `
  <div class="rich-txn-card" style="border-left-color:${borderColor}">
    <div class="rich-txn-top">
      <div class="rich-txn-left">
        <div class="rich-txn-customer">${t.customerName || '—'}</div>
        <div class="rich-txn-detail">
          ${t.productName
            ? `<span>📦 ${t.productName}${t.soldQuantity ? ` ×${formatNumber(t.soldQuantity)}` : ''}</span>`
            : ''}
          ${t.note && t.note !== t.productName
            ? `<span>· ${t.note}</span>`
            : ''}
          ${t.shop ? `<span>🏪 ${t.shop}</span>` : ''}
        </div>
        <div class="rich-txn-badges">
          ${badges.map(b => `<span class="txn-badge ${b.cls}">${b.text}</span>`).join('')}
          ${dueHTML}
        </div>
        ${progressHTML}
      </div>
      <div class="rich-txn-right">
        <div class="rich-txn-amount" style="color:${amtColor}">
          ${amtSign}${formatTaka(t.amount)}
        </div>
        <div class="rich-txn-time">
          ${new Date(t.date).toLocaleTimeString('bn-BD', { hour:'2-digit', minute:'2-digit' })}
        </div>
        ${t.photo
          ? `<img src="${t.photo}" class="txn-photo-thumb"
               onclick="event.stopPropagation();showPhoto('${t.photo}')" />`
          : ''}
      </div>
    </div>
  </div>`;
}

function clearTxnFilter() {
  $('txn-search').value          = '';
  $('txn-filter-type').value     = '';
  $('txn-filter-method').value   = '';
  $('txn-filter-customer').value = '';
  $('txn-date-from').value       = '';
  $('txn-date-to').value         = '';
  loadTransactions();
}

// ─── Add Transaction Modal ────────────────────────────
async function openAddTransaction(preselectedCustomerId = null) {
  setTxnMode('sale');
  setPaymentMode('cash');

  $('t-amount').value       = '';
  $('t-repay-amount').value = '';
  $('t-note').value         = '';
  $('t-duedate').value      = '';
  $('t-photo').value        = '';
  $('quantity-section').classList.add('hidden');
  $('stock-error').textContent  = '';
  $('t-stock-info').textContent = '';

  // ── Reset all fields cleanly ──────────────────────────
  // Clear visible search inputs
  const custSearch = document.getElementById('t-customer-search');
  const prodSearch = document.getElementById('t-product-search');
  const custHidden = document.getElementById('t-customer');
  const prodHidden = document.getElementById('t-product');
  const custClear  = document.getElementById('t-customer-clear');
  const prodClear  = document.getElementById('t-product-clear');
  const custRes    = document.getElementById('t-customer-results');
  const prodRes    = document.getElementById('t-product-results');

  if (custSearch) { custSearch.value = ''; custSearch.classList.remove('ss-selected'); }
  if (prodSearch) { prodSearch.value = ''; prodSearch.classList.remove('ss-selected'); }
  if (custHidden) { custHidden.value = ''; Object.keys(custHidden.dataset).forEach(k => delete custHidden.dataset[k]); }
  if (prodHidden) { prodHidden.value = ''; Object.keys(prodHidden.dataset).forEach(k => delete prodHidden.dataset[k]); }
  if (custClear)  custClear.classList.remove('visible');
  if (prodClear)  prodClear.classList.remove('visible');
  if (custRes)    { custRes.innerHTML = ''; custRes.classList.remove('open'); }
  if (prodRes)    { prodRes.innerHTML = ''; prodRes.classList.remove('open'); }

  ssCustomer = null;
  ssProduct  = null;
  hideOfflineCacheIndicator();

  // ── Customers ─────────────────────────────────────────
  let offlineCustomers = false;
  let customers;
  try {
    customers = await API(`/api/customers${currentShop ? `?shop=${encodeURIComponent(currentShop)}` : ''}`);
    if (!currentShop) cacheSet(CACHE_KEYS.customers, customers);
  } catch {
    customers        = cacheGetForce(CACHE_KEYS.customers) || [];
    offlineCustomers = true;
    if (customers.length) showOfflineCacheIndicator();
  }

  buildCustomerSS(customers, offlineCustomers);

  // Pre-select customer if provided
  if (preselectedCustomerId) {
    const match = customers.find(c => c.id === preselectedCustomerId);
    if (match && ssCustomer) ssCustomer.setValue(match, match.name);
  }

  // ── Inventory ─────────────────────────────────────────
 // ── Products ──────────────────────────────────────────
  let offlineInventory = false;
  let inventoryItems;
  try {
    inventoryItems = await API(`/api/products${currentShop ? `?shop=${encodeURIComponent(currentShop)}` : ''}`);
    if (!currentShop) cacheSet(CACHE_KEYS.inventory, inventoryItems);
  } catch {
    inventoryItems   = cacheGetForce(CACHE_KEYS.inventory) || [];
    offlineInventory = true;
    if (inventoryItems.length) showOfflineCacheIndicator();
  }
  buildProductSS(inventoryItems, offlineInventory || offlineCustomers);
  $('batch-choice-group').style.display = 'none';
  $('t-choose-batch').checked = false;
  $('t-batch-list').classList.add('hidden');

  openModal('modal-transaction');
}

function onProductChange() {
  const hiddenEl = document.getElementById('t-product');
  const section  = $('quantity-section');
  $('stock-error').textContent  = '';
  $('t-stock-info').textContent = '';
  $('t-quantity').value         = '';
  $('t-amount').value           = '';

  const productId = hiddenEl?.value || '';
  if (!productId) {
    section.classList.add('hidden');
    return;
  }

  section.classList.remove('hidden');
  // Read stock from dataset (set by SS selectItem)
  const stock = parseInt(hiddenEl?.dataset?.quantity ?? hiddenEl?.dataset?.stock ?? '0');
  $('t-stock-info').textContent = `স্টক: ${formatNumber(stock)}`;
}

function onQuantityChange() {
  const hiddenEl  = document.getElementById('t-product');
  const qty       = parseInt($('t-quantity')?.value) || 0;
  const errEl     = $('stock-error');
  errEl.textContent = '';

  const productId = hiddenEl?.value || '';
  if (!productId) return;

  const stock     = parseInt(hiddenEl?.dataset?.quantity ?? hiddenEl?.dataset?.stock ?? '0');
  const sellPrice = parseFloat(hiddenEl?.dataset?.sellPrice ?? hiddenEl?.dataset?.sell ?? '0');

  if (qty > stock) {
    errEl.textContent   = `পর্যাপ্ত স্টক নেই! মাত্র ${formatNumber(stock)}টি আছে।`;
    $('t-amount').value = '';
    return;
  }

  if (qty > 0) $('t-amount').value = (qty * sellPrice).toFixed(2);
}

async function populateProductDropdown() {
  const shop = localStorage.getItem('selectedShop') || '';
  const items = await fetchInventoryWithCache(shop);

  const sel = $('t-product');
  sel.innerHTML = '<option value="">পণ্য বাছুন (ঐচ্ছিক)...</option>';

  items
    .filter(i => i.quantity > 0)
    .forEach(i => {
      const opt           = document.createElement('option');
      opt.value           = i.id;
      opt.textContent     = `${i.name} — ৳${i.sellPrice} (স্টক: ${i.quantity})`;
      opt.dataset.sell    = i.sellPrice;
      opt.dataset.stock   = i.quantity;
      opt.dataset.name    = i.name;
      sel.appendChild(opt);
    });
}

function setTxnType(type) {
  currentTxnType = type;
  $('type-debit') .classList.toggle('active', type === 'debit');
  $('type-credit').classList.toggle('active', type === 'credit');
  $('due-date-group').style.display = type === 'debit' ? 'block' : 'none';

  // Product section always visible regardless of type
  // so both cash sales and credit sales reduce inventory
  $('product-section').style.display = 'block';

  const hasProduct = !!$('t-product').value;
  $('quantity-section').classList.toggle('hidden', !hasProduct);

  if (type === 'credit' && !$('t-product').value) {
    // Pure payment entry — clear product fields
    $('t-quantity').value        = '';
    $('stock-error').textContent = '';
  }
}

function setTxnMode(mode) {
  currentTxnMode = mode;
  $('mode-sale')     .classList.toggle('active', mode === 'sale');
  $('mode-repayment').classList.toggle('active', mode === 'repayment');
  $('sale-fields')      .classList.toggle('hidden', mode !== 'sale');
  $('repayment-fields') .classList.toggle('hidden', mode !== 'repayment');
  $('voice-section')    .classList.toggle('hidden', mode !== 'sale');
}

function setPaymentMode(mode) {
  currentPayMode = mode;
  $('pay-cash')  .classList.toggle('active', mode === 'cash');
  $('pay-credit').classList.toggle('active', mode === 'credit');
  $('sale-due-date-group').classList.toggle('hidden', mode !== 'credit');
}

async function saveTransaction() {
  // ── Read IDs from hidden inputs (set by SS component) ─
  const customerId = (document.getElementById('t-customer')?.value || '').trim();
  const productId  = (document.getElementById('t-product')?.value  || '').trim();
  const productHid = document.getElementById('t-product');

  // ── Customer validation ───────────────────────────────
  if (!customerId) {
    // Check if user typed something but didn't select
    const searchVal = (document.getElementById('t-customer-search')?.value || '').trim();
    if (searchVal) {
      showToast('তালিকা থেকে গ্রাহক বাছুন!', 'error');
    } else {
      showToast('গ্রাহক বাছুন!', 'error');
    }
    return;
  }

  const selectedShop = localStorage.getItem('selectedShop') || 'প্রধান শাখা';

  try {
    if (!isOnline) {
      showToast('অফলাইন — পরে সিঙ্ক হবে 📶');
      closeModal('modal-transaction');
      return;
    }

    // ── PRODUCT SALE ──────────────────────────────────────
    if (currentTxnMode === 'sale') {
      // Product validation
      if (!productId) {
        const searchVal = (document.getElementById('t-product-search')?.value || '').trim();
        showToast(searchVal ? 'তালিকা থেকে পণ্য বাছুন!' : 'পণ্য বাছুন!', 'error');
        return;
      }

      const soldQty   = parseInt($('t-quantity').value) || 0;
      const amount    = parseFloat($('t-amount').value);
      const stockLeft = parseInt(productHid?.dataset?.quantity || productHid?.dataset?.stock || '0');
      const prodName  = productHid?.dataset?.name || '';

      if (soldQty <= 0)           { showToast('পরিমাণ দিন!',          'error'); return; }
      if (!amount || amount <= 0) { showToast('মূল্য দিন!',           'error'); return; }
      if (soldQty > stockLeft)    { showToast('পর্যাপ্ত স্টক নেই!',  'error'); return; }

      // Safety: verify product ID actually exists in cached inventory
      const cachedInv = cacheGetForce(CACHE_KEYS.inventory) || [];
      const invItem   = cachedInv.find(i => i.id === productId);
      if (!invItem && isOnline) {
        // re-verify via API silently — if not found, warn but allow (server validates)
        console.warn('Product not in local cache, server will validate:', productId);
      }

      await API('/api/sales', {
        method: 'POST',
        body: JSON.stringify({
          customerId,
          inventoryId:   productId,
          soldQuantity:  soldQty,
          amount,
          paymentMode:   currentPayMode,
          note:          $('t-note').value.trim() || prodName,
          dueDate:       currentPayMode === 'credit' ? ($('t-duedate').value || null) : null,
          shop:          selectedShop,
          paymentMethod: ($('t-sale-method')?.value || null),
          batchId:       $('t-choose-batch')?.checked ? selectedBatchId : null
        })
      });

      showToast(currentPayMode === 'cash'
        ? 'নগদ বিক্রি রেকর্ড হয়েছে ✅'
        : 'বাকিতে বিক্রি রেকর্ড হয়েছে ✅');
    }

    // ── DEBT REPAYMENT ────────────────────────────────────
    else {
      const amount = parseFloat($('t-repay-amount').value);
      if (!amount || amount <= 0) { showToast('পরিমাণ দিন!', 'error'); return; }

      const txnBody = {
        customerId,
        type:          'credit',
        amount,
        note:          $('t-note').value.trim() || 'বাকি পরিশোধ',
        shop:          selectedShop,
        dueDate:       null,
        inventoryId:   null,
        productName:   null,
        soldQuantity:  null,
        paymentMethod: ($('t-repay-method')?.value || null)
      };

      const txn = await API('/api/transactions', {
        method: 'POST',
        body:   JSON.stringify(txnBody)
      });

      const photoFile = $('t-photo')?.files?.[0];
      if (photoFile && txn?.id) {
        const fd = new FormData();
        fd.append('photo', photoFile);
        await fetch(`/api/transactions/${txn.id}/photo`, { method: 'POST', body: fd });
      }

      showToast('পরিশোধ রেকর্ড হয়েছে ✅');
    }

    closeModal('modal-transaction');

    // Refresh cache after successful transaction
    refreshMasterDataCache().catch(() => {});

    if (currentPage === 'dashboard')     loadDashboard();
    else if (currentPage === 'transactions') loadTransactions();
    else if (currentPage === 'inventory')    loadInventory();
    loadOverdueBadge();

  } catch (e) {
    console.error('saveTransaction error:', e);
    showToast('রেকর্ড করতে সমস্যা হয়েছে — ' + (e?.message || ''), 'error');
  }
}

// ─── Overdue ──────────────────────────────────────────
async function loadOverdue() {
  const url = `/api/overdue${currentShop ? `?shop=${encodeURIComponent(currentShop)}` : ''}`;
  const items = await API(url);
  const el = $('overdue-list');

  if (!items.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">🎉</div><p>কোনো বকেয়া নেই! সব ঠিকঠাক আছে।</p></div>';
    return;
  }

  el.innerHTML = items.map(t => `
    <div class="overdue-item">
      <div class="overdue-info">
        <div class="overdue-name">${t.customerName}</div>
        <div class="overdue-phone">${t.customerPhone || '—'}</div>
        <div class="overdue-days">⚠️ ${formatNumber(t.daysOverdue)} দিন বাকি</div>
        <div class="overdue-amount">${formatTaka(t.outstanding)}</div>
        <div style="font-size:0.78rem;color:var(--ink-light)">${t.note || '—'}</div>
      </div>
      <div>
        <div class="overdue-amount">${formatTaka(t.outstanding)}</div>
        <div class="overdue-actions">
          <button class="btn-outline" style="font-size:0.78rem;padding:0.35rem 0.6rem" 
            onclick="sendReminderDirect('${t.customerId}','${t.id}','${t.customerName}','${t.customerPhone}',${t.outstanding})">
            📲 রিমাইন্ড
          </button>
          <button class="btn-outline" style="font-size:0.78rem;padding:0.35rem 0.6rem"
            onclick="openCustomerDetail('${t.customerId}')">
            👁️ দেখুন
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

async function loadOverdueBadge() {
  try {
    const items = await API('/api/overdue');
    const badge = $('overdue-badge');
    if (items.length > 0) {
      badge.textContent = formatNumber(items.length);
      badge.classList.add('show');
    } else {
      badge.classList.remove('show');
    }
  } catch {}
}

async function sendReminderDirect(customerId, txnId, name, phone, amount) {
  const message = `প্রিয় ${name}, আপনার ${formatTaka(amount)} বকেয়া পরিশোধের অনুরোধ করা হচ্ছে। বিকাশ নম্বর: 01XXXXXXXXX। ধন্যবাদ।`;
  try {
    await API('/api/reminders/send', {
      method: 'POST',
      body: JSON.stringify({ customerId, transactionId: txnId, message })
    });
    showToast(`${name} কে রিমাইন্ডার পাঠানো হয়েছে 📲`);
    loadOverdue();
  } catch {
    showToast('রিমাইন্ডার পাঠাতে সমস্যা হয়েছে', 'error');
  }
}

async function sendReminder() {
  if (!currentCustomer) return;
  const msg = `প্রিয় ${currentCustomer.name}, আপনার বকেয়া ${formatTaka(currentCustomer.balance)} পরিশোধ করুন। ধন্যবাদ।`;
  try {
    await API('/api/reminders/send', {
      method: 'POST',
      body: JSON.stringify({ customerId: currentCustomer.id, message: msg })
    });
    showToast('রিমাইন্ডার পাঠানো হয়েছে 📲');
  } catch {
    showToast('রিমাইন্ডার পাঠাতে সমস্যা হয়েছে', 'error');
  }
}

// ─── Monthly Report ───────────────────────────────────
async function loadReport() {
  const yearSel = $('report-year');
  if (!yearSel.options.length) {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= currentYear - 3; y--) {
      yearSel.innerHTML += `<option value="${y}">${y}</option>`;
    }
  }

  const year = parseInt(yearSel.value) || new Date().getFullYear();
  const url  = `/api/report/monthly?year=${year}${currentShop ? `&shop=${encodeURIComponent(currentShop)}` : ''}`;
  const data = await API(url);

  // ── Yearly KPI calculations ───────────────────────────
  const totalRevenue  = data.months.reduce((s, m) => s + m.totalRevenue,  0);
  const totalExpense  = data.months.reduce((s, m) => s + m.totalExpense,  0);
  const totalProfit   = data.months.reduce((s, m) => s + m.profit,        0);
  const totalDebit    = data.months.reduce((s, m) => s + m.totalDebit,    0);
  const totalTxns     = data.months.reduce((s, m) => s + m.transactionCount, 0);

  // Best performing month (by profit)
  const bestMonth = data.months
    .filter(m => m.transactionCount > 0)
    .reduce((best, m) => (!best || m.profit > best.profit) ? m : best, null);

  // Active months count
  const activeMonths = data.months.filter(m => m.transactionCount > 0).length;

  // ── KPI Cards ─────────────────────────────────────────
const kpiCards = [
      { icon: '💰', label: 'মোট আদায়',      tipKey:'Collections',      value: formatTaka(totalRevenue),  color: 'var(--green-light)', border: 'var(--green-light)' },
      { icon: '🧾', label: 'মোট খরচ',        tipKey:'totalExpense',   value: formatTaka(totalExpense),  color: 'var(--red)',          border: 'var(--red)'         },
      { icon: '📈', label: 'নেট লাভ/ক্ষতি',  tipKey:'netProfit',      value: (totalProfit >= 0 ? '+' : '') + formatTaka(totalProfit),
        color: totalProfit >= 0 ? 'var(--green-light)' : 'var(--red)',
        border: totalProfit >= 0 ? 'var(--green-light)' : 'var(--red)' },
      { icon: '⏳', label: 'বাকিতে বিক্রি',  tipKey:'creditSales',    value: formatTaka(totalDebit),    color: 'var(--amber-dark)',   border: 'var(--amber-dark)'  },
      { icon: '📋', label: 'মোট লেনদেন',     tipKey:null,             value: formatNumber(totalTxns),   color: 'var(--green-dark)',   border: 'var(--green-mid)'   },
      { icon: '📅', label: 'সক্রিয় মাস',     tipKey:null,             value: formatNumber(activeMonths),color: 'var(--green-dark)',   border: 'var(--green-mid)'   },
      { icon: '🏆', label: 'সেরা মাস',        tipKey:null,             value: bestMonth ? bestMonth.monthName : '—', color: 'var(--amber-dark)', border: 'var(--amber-dark)' },
      { icon: '💹', label: 'গড় মাসিক লাভ',   tipKey:'netProfit',      value: activeMonths > 0 ? formatTaka(Math.round(totalProfit / activeMonths)) : '৳০',
        color: totalProfit >= 0 ? 'var(--green-light)' : 'var(--red)',
        border: totalProfit >= 0 ? 'var(--green-light)' : 'var(--red)' }
    ].map((k, i) => `
      <div style="background:#fff;border-radius:var(--radius-sm);padding:0.75rem 0.9rem;
                  border-top:3px solid ${k.border};box-shadow:var(--elev-1)">
        <div style="display:flex;align-items:center;gap:0.3rem;
                    font-size:0.72rem;color:var(--ink-light);margin-bottom:0.3rem">
          ${k.icon}
          <span>${k.label}</span>
          ${k.tipKey ? tipIcon(k.tipKey, i >= 4 ? 'tip-left' : '') : ''}
        </div>
        <div style="font-size:1rem;font-weight:700;color:${k.color};
                    white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
          ${k.value}
        </div>
      </div>`).join('');

  // ── Yearly Insights ───────────────────────────────────
  const activeMonthsData = data.months.filter(m => m.transactionCount > 0 || m.expenseCount > 0);

  // Best/worst calculations
  const highRevMonth  = activeMonthsData.reduce((b, m) => m.totalRevenue > (b?.totalRevenue || 0) ? m : b, null);
  const lowProfMonth  = activeMonthsData.reduce((b, m) => (!b || m.profit < b.profit) ? m : b, null);
  const highExpMonth  = activeMonthsData.reduce((b, m) => m.totalExpense > (b?.totalExpense || 0) ? m : b, null);
  const highColMonth  = activeMonthsData.reduce((b, m) => m.totalCredit > (b?.totalCredit || 0) ? m : b, null);
  const highTxnMonth  = activeMonthsData.reduce((b, m) => m.transactionCount > (b?.transactionCount || 0) ? m : b, null);

  const insightItems = [
    { icon: '🏆', label: 'সর্বোচ্চ আদায়ের মাস',  month: highRevMonth,  value: highRevMonth  ? formatTaka(highRevMonth.totalRevenue)    : '—', color: 'var(--green-light)' },
    { icon: '📉', label: 'সর্বনিম্ন লাভ',    month: lowProfMonth,  value: lowProfMonth  ? (lowProfMonth.profit >= 0 ? '+' : '') + formatTaka(lowProfMonth.profit) : '—',
      color: lowProfMonth && lowProfMonth.profit < 0 ? 'var(--red)' : 'var(--amber-dark)' },
    { icon: '💸', label: 'সর্বোচ্চ খরচের মাস',      month: highExpMonth,  value: highExpMonth  ? formatTaka(highExpMonth.totalExpense)    : '—', color: 'var(--red)'         },
    { icon: '💰', label: 'সর্বোচ্চ পরিশোধ আদায়',    month: highColMonth,  value: highColMonth  ? formatTaka(highColMonth.totalCredit)     : '—', color: 'var(--green-mid)'   },
    { icon: '🔥', label: 'সর্বোচ্চ লেনদেন',  month: highTxnMonth,  value: highTxnMonth  ? formatNumber(highTxnMonth.transactionCount) + 'টি' : '—', color: 'var(--amber-dark)' }
  ];

  const insightsHTML = `
    <div style="margin-bottom:1rem">
      <div style="font-weight:700;color:var(--green-dark);font-size:0.88rem;margin-bottom:0.6rem">
        💡 বার্ষিক ইনসাইট
      </div>
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:0.5rem">
        ${insightItems.map(ins => `
          <div style="background:#fff;border-radius:var(--radius-sm);padding:0.65rem 0.75rem;
                      box-shadow:0 1px 5px var(--shadow);border-top:3px solid ${ins.color};
                      cursor:${ins.month ? 'pointer' : 'default'}"
               ${ins.month ? `onclick="openMonthDetail(${year}, ${ins.month.month})"` : ''}>
            <div style="font-size:0.7rem;color:var(--ink-light);margin-bottom:0.25rem">
              ${ins.icon} ${ins.label}
            </div>
            <div style="font-size:0.88rem;font-weight:700;color:${ins.color};
                        white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
              ${ins.value}
            </div>
            <div style="font-size:0.7rem;color:var(--ink-light);margin-top:2px">
              ${ins.month ? ins.month.monthName : '—'}
            </div>
          </div>`).join('')}
      </div>
    </div>`;

  // ── Month-over-month trend ────────────────────────────
  const currentMonthIdx  = new Date().getMonth(); // 0-based
  const currM            = data.months[currentMonthIdx];
  const prevM            = currentMonthIdx > 0 ? data.months[currentMonthIdx - 1] : null;

  let trendHTML = '';
  if (prevM && (currM.transactionCount > 0 || prevM.transactionCount > 0)) {
    const trends = [
      {
        label:  'আদায়',
        curr:   currM.totalRevenue,
        prev:   prevM.totalRevenue,
        format: formatTaka
      },
      {
        label:  'খরচ',
        curr:   currM.totalExpense,
        prev:   prevM.totalExpense,
        format: formatTaka,
        invertColor: true  // higher expense is bad
      },
      {
        label:  'লাভ/ক্ষতি',
        curr:   currM.profit,
        prev:   prevM.profit,
        format: v => (v >= 0 ? '+' : '') + formatTaka(v)
      },
      {
        label:  'বাকি বিক্রি',
        curr:   currM.totalDebit,
        prev:   prevM.totalDebit,
        format: formatTaka
      }
    ].map(tr => {
      const diff    = tr.curr - tr.prev;
      const pct     = tr.prev !== 0 ? Math.abs(Math.round((diff / tr.prev) * 100)) : null;
      const up      = diff > 0;
      const neutral = diff === 0;
      // For expense: up = bad (red), down = good (green)
      const goodColor = tr.invertColor ? 'var(--green-light)' : 'var(--green-light)';
      const badColor  = tr.invertColor ? 'var(--red)'         : 'var(--red)';
      const color     = neutral ? 'var(--ink-light)'
                      : tr.invertColor
                        ? (up ? badColor : goodColor)
                        : (up ? goodColor : badColor);
      const arrow     = neutral ? '→' : up ? '↑' : '↓';

      return `
        <div style="display:flex;justify-content:space-between;align-items:center;
                    padding:0.35rem 0;border-bottom:1px solid var(--border)">
          <span style="font-size:0.8rem;color:var(--ink-light)">${tr.label}</span>
          <div style="display:flex;align-items:center;gap:0.4rem">
            <span style="font-size:0.78rem;color:var(--ink-light)">
              ${tr.format(tr.prev)}
            </span>
            <span style="color:${color};font-size:0.82rem;font-weight:700">
              ${arrow} ${tr.format(tr.curr)}
              ${pct !== null && !neutral
                ? `<span style="font-size:0.68rem;opacity:0.8">(${formatNumber(pct)}%)</span>`
                : ''}
            </span>
          </div>
        </div>`;
    }).join('');

    trendHTML = `
      <div style="margin-bottom:1rem">
        <div style="font-weight:700;color:var(--green-dark);font-size:0.88rem;margin-bottom:0.6rem">
          📊 মাসিক তুলনা — ${prevM.monthName} → ${currM.monthName}
        </div>
        <div style="background:#fff;border-radius:var(--radius-sm);padding:0.9rem 1rem;
                    box-shadow:0 1px 5px var(--shadow)">
          ${trends}
        </div>
      </div>`;
  }

  // ── Yearly payment method breakdown ──────────────────
  const yearlyPayment = {};
  const PM_BN = {
    cash: '💵 নগদ', bkash: '📱 বিকাশ',
    nagad: '🟠 নগদ (Nagad)', rocket: '🚀 রকেট',
    bank: '🏦 ব্যাংক', unspecified: '❓ অনির্দিষ্ট'
  };

  // Aggregate from monthly cashSales + credit totals
  // Use dailyBreakdown not available at yearly level,
  // so we derive from what we have: totalRevenue per month is cash+credit
  // We fetch yearly payment breakdown from the already-calculated month data
  // Note: paymentBreakdown is per monthly-detail fetch; here we approximate
  // from totalCash and totalCredit as the two main buckets we do have
  data.months.forEach(m => {
    // Use available fields: totalCash (cash_sale) and totalCredit (repayments)
    const cashAmt = (m.cashSales || 0);
    const colAmt  = (m.totalCredit || 0);
    yearlyPayment['cash']  = (yearlyPayment['cash']  || 0) + cashAmt;
    yearlyPayment['other'] = (yearlyPayment['other'] || 0) + colAmt;
  });

  const payTotal = Object.values(yearlyPayment).reduce((s, v) => s + v, 0);
  const hasPayData = payTotal > 0;

  const paymentYearlyHTML = hasPayData
    ? `<div style="margin-bottom:1rem">
         <div style="font-weight:700;color:var(--green-dark);font-size:0.88rem;margin-bottom:0.6rem">
           💳 বার্ষিক আদায় বিভাজন
         </div>
         <div style="background:#fff;border-radius:var(--radius-sm);padding:0.9rem 1rem;
                     box-shadow:0 1px 5px var(--shadow)">
           ${Object.entries(yearlyPayment)
               .filter(([, v]) => v > 0)
               .sort(([, a], [, b]) => b - a)
               .map(([m, amt]) => {
                 const pct   = payTotal > 0 ? Math.round((amt / payTotal) * 100) : 0;
                 const label = m === 'other' ? '💰 আদায় পেমেন্ট' : (PM_BN[m] || m);
                 return `
                   <div style="margin-bottom:0.55rem">
                     <div style="display:flex;justify-content:space-between;
                                 font-size:0.8rem;margin-bottom:3px">
                       <span>${label}</span>
                       <span>
                         <strong>${formatTaka(amt)}</strong>
                         <span style="color:var(--ink-light);margin-left:0.3rem">
                           ${formatNumber(pct)}%
                         </span>
                       </span>
                     </div>
                     <div style="height:6px;background:var(--cream-dark);
                                 border-radius:3px;overflow:hidden">
                       <div style="height:100%;width:${pct}%;
                                   background:var(--green-light);border-radius:3px">
                       </div>
                     </div>
                   </div>`;
               }).join('')}
         </div>
       </div>`
    : '';

  // ── Grouped chart ─────────────────────────────────────
  const chartHTML = `
    <div style="background:#fff;border-radius:var(--radius);padding:1.2rem;
                box-shadow:0 2px 10px var(--shadow);margin-bottom:1rem">
      <div style="font-weight:700;color:var(--green-dark);font-size:0.9rem;margin-bottom:0.8rem">
        📊 মাসিক আদায় · খরচ · লাভ/ক্ষতি — ${year}
      </div>
      <div style="position:relative;height:240px">
        <canvas id="chart-yearly-grouped"></canvas>
      </div>
      <div style="display:flex;gap:1.2rem;justify-content:center;margin-top:0.6rem;flex-wrap:wrap">
        ${[
          ['rgba(64,145,108,0.82)', 'মোট আদায়'],
          ['rgba(106, 176, 233, 0.9)',  'মোট খরচ'],
          ['#f8e008a2', 'নেট লাভ/ক্ষতি']
        ].map(([color, label]) => `
          <div style="display:flex;align-items:center;gap:0.35rem;font-size:0.78rem;color:var(--ink-light)">
            <div style="width:14px;height:8px;border-radius:2px;background:${color}"></div>
            ${label}
          </div>`).join('')}
      </div>
    </div>`;

  // ── Assemble report-chart area ────────────────────────
  // Store data reference for CSV export
    window._lastReportData = { data, year };

    $('report-chart').innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0.6rem;margin-bottom:1rem">
      ${kpiCards}
      </div>
      <div style="display:flex;justify-content:flex-end;margin-bottom:0.6rem">
      <button onclick="openYearlyPrintView()"
        style="background:#fff;color:var(--green-dark);border:1.5px solid var(--green-dark);
               border-radius:var(--radius-sm);padding:0.45rem 0.6rem;
               font-family:'Hind Siliguri',sans-serif;font-size:0.82rem;
               cursor:pointer;display:flex;align-items:center;gap:0.4rem">
        🖨️ PDF ডাউনলোড
      </button>
      
      <button onclick="exportYearlyCSV(window._lastReportData.data, window._lastReportData.year)"
        style="background:var(--green-dark);color:#fff;border:none;border-radius:var(--radius-sm);
               padding:0.45rem 0.7rem;font-family:'Hind Siliguri',sans-serif;font-size:0.82rem;
               cursor:pointer;display:flex;align-items:center;gap:0.4rem">
        📥 বার্ষিক CSV ডাউনলোড
      </button>
      </div>
    ${insightsHTML}
    ${trendHTML}
    ${paymentYearlyHTML}
    ${chartHTML}`;

  requestAnimationFrame(() => drawYearlyGroupedChart(data, year));

  // ── Yearly summary table ──────────────────────────────
  const tableHTML = `
    <table class="report-table">
      <thead>
        <tr>
          <th>${t('reportMonth')}</th>
          <th style="color:var(--amber-dark)">বাকি বিক্রি</th>
          <th style="color:var(--green-light)">আদায়</th>
          <th style="color:var(--red)">খরচ</th>
          <th>লাভ/ক্ষতি</th>
          <th>${t('reportTxnCount')}</th>
        </tr>
      </thead>
      <tbody>
        ${data.months.map(m => {
          const profitClass  = m.profit >= 0 ? 'net-positive' : 'net-negative';
          const hasData      = m.transactionCount > 0 || m.expenseCount > 0;
          const isBestMonth  = bestMonth && m.month === bestMonth.month;
          return `<tr style="cursor:${hasData ? 'pointer' : 'default'};
                             background:${isBestMonth ? 'rgba(64,145,108,0.06)' : ''};
                             transition:background 0.15s"
                        ${hasData ? `
                          onclick="openMonthDetail(${data.year}, ${m.month})"
                          onmouseover="this.style.background='var(--cream-dark)'"
                          onmouseout="this.style.background='${isBestMonth ? 'rgba(64,145,108,0.06)' : ''}'"
                        ` : ''}>
            <td>
              ${isBestMonth ? '🏆 ' : ''}${m.monthName}
              ${hasData ? `<span style="font-size:0.7rem;color:var(--green-light);margin-left:0.3rem">↗</span>` : ''}
            </td>
            <td style="color:var(--amber-dark)">${formatTaka(m.totalDebit)}</td>
            <td style="color:var(--green-light)">${formatTaka(m.totalRevenue)}</td>
            <td style="color:var(--red)">${formatTaka(m.totalExpense)}</td>
            <td class="${profitClass}">${m.profit >= 0 ? '+' : ''}${formatTaka(m.profit)}</td>
            <td>${formatNumber(m.transactionCount + m.expenseCount)}</td>
          </tr>`;
        }).join('')}
      </tbody>
      <tfoot>
        <tr style="font-weight:700;background:var(--cream-dark)">
          <td>${t('reportTotal')}</td>
          <td>${formatTaka(totalDebit)}</td>
          <td>${formatTaka(totalRevenue)}</td>
          <td style="color:var(--red)">${formatTaka(totalExpense)}</td>
          <td class="${totalProfit >= 0 ? 'net-positive' : 'net-negative'}">
            ${totalProfit >= 0 ? '+' : ''}${formatTaka(totalProfit)}
          </td>
          <td></td>
        </tr>
      </tfoot>
    </table>`;

  $('report-table').innerHTML = tableHTML;
}

function drawYearlyGroupedChart(data, year) {
  if (!window.Chart) return;

  const canvas = document.getElementById('chart-yearly-grouped');
  if (!canvas) return;

  destroyChart('yearly-grouped');

  const lang   = localStorage.getItem('lang') || 'bn';
  const months = data.months;
  const labels = months.map(m => m.monthName.substring(0, 3));

  const revenue = months.map(m => m.totalRevenue);
  const expense = months.map(m => m.totalExpense);
  const profit  = months.map(m => m.profit);

  // Profit bars: green for positive, red for negative
  const profitColors  = profit.map(v => v >= 0 ? 'rgba(64,145,108,0.75)' : 'rgba(230,57,70,0.75)');
  const profitBorders = profit.map(v => v >= 0 ? '#40916c' : '#e63946');

  CHARTS['yearly-grouped'] = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label:           lang === 'bn' ? 'আদায়' : 'Collections',
          data:            revenue,
          backgroundColor: 'rgba(64,145,108,0.82)',
          borderColor:     '#40916c',
          borderWidth:     1,
          borderRadius:    3,
          order:           2
        },
        {
          label:           lang === 'bn' ? 'খরচ' : 'Expense',
          data:            expense,
          backgroundColor: 'rgba(106, 176, 233, 0.9)',
          borderColor:     '#55d2f1fb',
          borderWidth:     1,
          borderRadius:    3,
          order:           2
        },
        {
          label:           lang === 'bn' ? 'লাভ/ক্ষতি' : 'Profit',
          data:            profit,
          backgroundColor: profitColors,
          borderColor:     profitBorders,
          borderWidth:     1.5,
          borderRadius:    3,
          type:            'bar',
          order:           1
        }
      ]
    },
    options: {
      responsive:          true,
      maintainAspectRatio: false,
      interaction:         { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title:  items => `${months[items[0].dataIndex].monthName} ${year}`,
            label:  ctx => ` ${ctx.dataset.label}: ৳${Math.abs(ctx.raw).toLocaleString('bn-BD')}${ctx.raw < 0 ? ' (ক্ষতি)' : ''}`
          },
          bodyFont:  { family: 'Hind Siliguri' },
          titleFont: { family: 'Hind Siliguri', weight: 'bold' }
        }
      },
      scales: {
        x: {
          grid:  { display: false },
          ticks: { font: { family: 'Hind Siliguri', size: 11 }, maxRotation: 0 }
        },
        y: {
          beginAtZero: true,
          grid:        { color: 'rgba(0,0,0,0.05)' },
          ticks: {
            font:     { family: 'Hind Siliguri', size: 10 },
            callback: val => {
              if (Math.abs(val) >= 1000) return '৳' + (val/1000).toFixed(0) + 'k';
              return '৳' + val;
            }
          }
        }
      },
      // Click a bar to open that month's detail
      onClick: (evt, elements) => {
        if (!elements.length) return;
        const idx   = elements[0].index;
        const month = months[idx];
        if (month.transactionCount > 0 || month.expenseCount > 0) {
          openMonthDetail(year, month.month);
        }
      },
      onHover: (evt, elements) => {
        evt.native.target.style.cursor = elements.length ? 'pointer' : 'default';
      }
    }
  });
}

// ─── Monthly Detail Modal ─────────────────────────────
let currentMonthData = null;
let currentMonthTab  = 'overview';

// Chart instance registry — prevents memory leaks on re-render
const CHARTS = {};

function destroyChart(key) {
  if (CHARTS[key]) {
    CHARTS[key].destroy();
    delete CHARTS[key];
  }
}

function getBnMonthDayLabel(dateStr) {
  // Short day label for X axis e.g. "১৫"
  const d = parseInt(dateStr.split('-')[2]);
  return formatNumber(d);
}

async function openMonthDetail(year, month) {
  const shop    = currentShop ? `&shop=${encodeURIComponent(currentShop)}` : '';
  currentMonthData = await API(`/api/report/monthly/${year}/${month}?${shop}`);
  window._lastMonthData   = currentMonthData;
  currentMonthTab  = 'overview';

  $('month-detail-title').textContent   = `${currentMonthData.monthName} ${year} — বিস্তারিত রিপোর্ট`;
  $('month-detail-subtitle').textContent = `${currentMonthData.dateFrom} → ${currentMonthData.dateTo}${currentShop ? ` | ${currentShop}` : ''}`;

  renderMonthSummaryCards(currentMonthData.summary);
  switchMonthTab('overview');
  openModal('modal-month-detail');
}

function renderMonthSummaryCards(s) {
  const cards = [
    { label: 'মোট বিক্রি',    tipKey:'totalSales',  value: formatTaka(s.cashSalesAmt + s.creditSalesAmt), color: 'var(--amber-dark)'  },
    { label: 'মোট আদায়',     tipKey:'totalAdai',   value: formatTaka(s.totalRevenue),                    color: 'var(--green-light)' },
    { label: 'নেট লাভ/ক্ষতি', tipKey:'netProfit',   value: (s.netProfit >= 0 ? '+' : '') + formatTaka(s.netProfit),
      color: s.netProfit >= 0 ? 'var(--green-light)' : 'var(--red)' }
  ];

  $('month-summary-cards').innerHTML = cards.map((c, i) => `
    <div style="padding:1rem;text-align:center;
                ${i < 2 ? 'border-right:1px solid var(--border);' : ''}">
      <div style="font-size:1.25rem;font-weight:700;color:${c.color}">${c.value}</div>
      <div style="font-size:0.75rem;color:var(--ink-light);margin-top:4px;
                  display:flex;align-items:center;justify-content:center;gap:0.3rem">
        ${c.label}
        ${tipIcon(c.tipKey, i === 2 ? 'tip-left' : '')}
      </div>
    </div>
  `).join('');
}

function switchMonthTab(tab) {
   // Clean up charts if leaving overview
  if (currentMonthTab === 'overview' && tab !== 'overview') {
    destroyChart('summary-bar');
    destroyChart('daily-line');
    destroyChart('payment-donut');
  }
  if (currentMonthTab === 'expenses' && tab !== 'expenses') {
    destroyChart('expense-donut');
  }
  if (currentMonthTab === 'products' && tab !== 'products') {
    destroyChart('product-bar');
  }
  if (currentMonthTab === 'customers' && tab !== 'customers') {
    destroyChart('top-buyers');
    destroyChart('high-due');
  }
  currentMonthTab = tab;

  document.querySelectorAll('.month-tab').forEach(b => b.classList.remove('active'));
  const TAB_LABELS = {
    overview:     'সারসংক্ষেপ',
    transactions: 'লেনদেন',
    expenses:     'খরচ',
    products:     'পণ্য',
    customers:    'গ্রাহক',
    insights:     'ইনসাইট'
  };
  document.querySelectorAll('.month-tab').forEach(b => {
    if (b.textContent.trim() === TAB_LABELS[tab]) b.classList.add('active');
  });

  renderMonthTabContent(tab, currentMonthData);
}

function renderMonthTabContent(tab, d) {
  const el = $('month-tab-content');
  if (!d) return;

  if (tab === 'overview')     el.innerHTML = renderMonthOverview(d);
  if (tab === 'transactions') el.innerHTML = renderMonthTransactions(d);
  if (tab === 'expenses')     el.innerHTML = renderMonthExpenses(d);
  if (tab === 'products')     el.innerHTML = renderMonthProducts(d);
  if (tab === 'customers')    el.innerHTML = renderMonthCustomers(d);
  if (tab === 'insights') el.innerHTML = renderMonthInsights(d);
}

function renderMonthOverview(d) {
  const s  = d.summary;
  const PM = { cash:'💵 নগদ', bkash:'📱 বিকাশ', nagad:'🟠 নগদ',
               rocket:'🚀 রকেট', bank:'🏦 ব্যাংক', unspecified:'❓ অনির্দিষ্ট' };

  // ── KPI cards row ─────────────────────────────────────
const kpis = [
    { icon:'💵', label:'নগদ বিক্রি',       tipKey:'cashSales',    value: formatTaka(s.cashSalesAmt),      color:'var(--green-mid)'   },
    { icon:'📒', label:'বাকিতে বিক্রি',    tipKey:'creditSales',  value: formatTaka(s.creditSalesAmt),    color:'var(--amber-dark)'  },
    { icon:'✅', label:'মোট আদায়',         tipKey:'totalAdai',    value: formatTaka(s.collectionsAmt),    color:'var(--green-light)' },
    { icon:'🧾', label:'মোট খরচ',          tipKey:'totalExpense', value: formatTaka(s.totalExpense),      color:'var(--red)'         },
    { icon:'⏳', label:'বর্তমান বাকি',     tipKey:'currentDue',   value: formatTaka(s.totalCurrentDue),  color:'var(--amber-dark)'  },
    { icon:'🔴', label:'মেয়াদউত্তীর্ণ',   tipKey:'overdueAmt',   value: formatTaka(s.overdueAmt),        color:'var(--red)'         },
    { icon:'📋', label:'লেনদেন সংখ্যা',   tipKey:null,           value: formatNumber(s.txnCount),        color:'var(--green-dark)'  },
    { icon:'👥', label:'সক্রিয় গ্রাহক',   tipKey:'totalCustomers', value: formatNumber(s.customerCount||0), color:'var(--green-dark)' }
  ];

  const kpiHTML = `
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0.6rem;margin-bottom:1rem">
      ${kpis.map((k, i) => `
        <div style="background:#fff;border-radius:var(--radius-sm);padding:0.7rem 0.8rem;
                    border-top:3px solid ${k.color};box-shadow:var(--elev-1)">
          <div style="display:flex;align-items:center;gap:0.3rem;
                      font-size:0.72rem;color:var(--ink-light);margin-bottom:3px">
            ${k.icon}
            <span>${k.label}</span>
            ${k.tipKey ? tipIcon(k.tipKey, i >= 4 ? 'tip-left' : '') : ''}
          </div>
          <div style="font-size:0.95rem;font-weight:700;color:${k.color}">${k.value}</div>
        </div>`).join('')}
    </div>`;

  // ── Profit/loss highlight ──────────────────────────────
  const profitBg    = s.netProfit >= 0 ? 'var(--green-pale)' : 'var(--red-pale)';
  const profitColor = s.netProfit >= 0 ? 'var(--green-dark)' : 'var(--red)';
  const profitLabel = s.netProfit >= 0 ? '✅ লাভ' : '❌ ক্ষতি';
  const profitBar   = `
    <div style="background:${profitBg};border-radius:var(--radius-sm);padding:0.85rem 1rem;
                margin-bottom:1rem;display:flex;justify-content:space-between;align-items:center">
      <div>
        <div style="font-size:0.78rem;color:var(--ink-light)">আদায় − খরচ</div>
        <div style="font-size:0.78rem;color:var(--ink-light)">
          ${formatTaka(s.totalRevenue)} − ${formatTaka(s.totalExpense)}
        </div>
      </div>
      <div style="text-align:right">
        <div style="font-size:0.75rem;color:${profitColor};font-weight:600">${profitLabel}</div>
        <div style="font-size:1.3rem;font-weight:700;color:${profitColor}">
          ${s.netProfit >= 0 ? '+' : ''}${formatTaka(s.netProfit)}
        </div>
      </div>
    </div>`;

  // ── Payment breakdown ─────────────────────────────────
  const payTotal  = Object.values(d.paymentBreakdown).reduce((s,v) => s+v, 0);
  const payRows   = Object.entries(d.paymentBreakdown)
    .sort((a,b) => b[1] - a[1])
    .map(([m, amt]) => {
      const pct = payTotal > 0 ? Math.round((amt / payTotal) * 100) : 0;
      return `
        <div style="margin-bottom:0.5rem">
          <div style="display:flex;justify-content:space-between;
                      font-size:0.82rem;margin-bottom:3px">
            <span>${PM[m] || m}</span>
            <span><strong>${formatTaka(amt)}</strong>
              <span style="color:var(--ink-light);margin-left:0.3rem">(${formatNumber(pct)}%)</span>
            </span>
          </div>
          <div style="height:6px;background:var(--cream-dark);border-radius:3px;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:var(--green-light);border-radius:3px"></div>
          </div>
        </div>`;
    }).join('') || '<p style="font-size:0.83rem;color:var(--ink-light)">কোনো ডেটা নেই</p>';

  // ── Daily breakdown table ─────────────────────────────
  const activeDays = d.dailyBreakdown.filter(day => day.txnCount > 0 || day.expCount > 0);
  const dailyRows  = activeDays.length
    ? activeDays.map(day => {
        const profitCls = day.profit >= 0 ? 'color:var(--green-light)' : 'color:var(--red)';
        return `
        <tr style="border-bottom:1px solid var(--border)">
          <td style="padding:0.45rem 0.7rem;font-size:0.82rem">
            ${new Date(day.date).toLocaleDateString('bn-BD', { day:'numeric', month:'short', weekday:'short' })}
          </td>
          <td style="padding:0.45rem 0.7rem;text-align:right;font-size:0.82rem;color:var(--green-mid)">
            ${day.cashSales > 0 ? formatTaka(day.cashSales) : '—'}
          </td>
          <td style="padding:0.45rem 0.7rem;text-align:right;font-size:0.82rem;color:var(--amber-dark)">
            ${day.creditSales > 0 ? formatTaka(day.creditSales) : '—'}
          </td>
          <td style="padding:0.45rem 0.7rem;text-align:right;font-size:0.82rem;color:var(--green-light)">
            ${day.collections > 0 ? formatTaka(day.collections) : '—'}
          </td>
          <td style="padding:0.45rem 0.7rem;text-align:right;font-size:0.82rem;color:var(--red)">
            ${day.expenses > 0 ? formatTaka(day.expenses) : '—'}
          </td>
          <td style="padding:0.45rem 0.7rem;text-align:right;font-size:0.82rem;font-weight:600;${profitCls}">
            ${day.profit !== 0 ? (day.profit > 0 ? '+' : '') + formatTaka(day.profit) : '—'}
          </td>
          <td style="padding:0.45rem 0.7rem;text-align:right;font-size:0.78rem;color:var(--ink-light)">
            ${formatNumber(day.txnCount)}
          </td>
        </tr>`;
      }).join('')
    : `<tr><td colspan="7" style="padding:1rem;text-align:center;color:var(--ink-light)">
         কোনো কার্যক্রম নেই
       </td></tr>`;

  const chartSection = `
    <div style="margin-bottom:1rem">
      <div style="font-weight:700;color:var(--green-dark);font-size:0.88rem;margin-bottom:0.6rem">
        📊 মাসিক আদায়  ও খরচ
      </div>
      <div style="background:#fff;border-radius:var(--radius-sm);padding:1rem;
                  box-shadow:0 1px 5px var(--shadow);margin-bottom:1rem">
        <div style="position:relative;height:200px">
          <canvas id="chart-summary-bar-slot"></canvas>
        </div>
      </div>
      <div style="font-weight:700;color:var(--green-dark);font-size:0.88rem;margin-bottom:0.6rem">
        📈 দৈনিক নগদ প্রবাহ
      </div>
      <div style="background:#fff;border-radius:var(--radius-sm);padding:1rem;
                  box-shadow:0 1px 5px var(--shadow);margin-bottom:1rem">
        <div style="position:relative;height:200px">
          <canvas id="chart-daily-line-slot"></canvas>
        </div>
      </div>
    </div>`;

  // Schedule chart rendering after DOM paint
  requestAnimationFrame(() => drawMonthCharts(d));

  return chartSection + kpiHTML + profitBar + `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
      <div style="background:var(--cream-dark);border-radius:var(--radius-sm);padding:1rem">
        <div style="font-weight:700;color:var(--green-dark);font-size:0.88rem;margin-bottom:0.75rem">
          💳 পেমেন্ট মাধ্যম (আদায় vs খরচ)
        </div>
        ${renderPaymentAnalytics(d.paymentAnalytics)}
      </div>
      <div style="background:var(--cream-dark);border-radius:var(--radius-sm);padding:1rem">
        <div style="font-weight:700;color:var(--green-dark);font-size:0.88rem;margin-bottom:0.75rem">
          📊 সারাংশ
        </div>
        ${[
          ['বাকিতে বিক্রি',  formatTaka(s.creditSalesAmt),  'var(--amber-dark)'],
          ['নগদ বিক্রি',     formatTaka(s.cashSalesAmt),    'var(--green-mid)'],
          ['মোট আদায়',     formatTaka(s.totalRevenue),    'var(--green-light)'],
          ['মোট খরচ',        formatTaka(s.totalExpense),    'var(--red)'],
          ['বর্তমান বাকি',   formatTaka(s.totalCurrentDue), 'var(--amber-dark)'],
          ['মেয়াদউত্তীর্ণ', formatTaka(s.overdueAmt),      'var(--red)']
        ].map(([l,v,c]) => `
          <div style="display:flex;justify-content:space-between;padding:0.3rem 0;
                      border-bottom:1px solid var(--border)">
            <span style="font-size:0.82rem;color:var(--ink-light)">${l}</span>
            <strong style="font-size:0.82rem;color:${c}">${v}</strong>
          </div>`).join('')}
      </div>
    </div>
    <div style="background:#fff;border-radius:var(--radius-sm);overflow:hidden;
                border:1px solid var(--border)">
      <div style="padding:0.55rem 0.8rem;background:var(--cream-dark);
                  font-weight:700;font-size:0.85rem;color:var(--green-dark)">
        📅 দৈনিক নগদ প্রবাহ
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:var(--cream-dark)">
              <th style="padding:0.45rem 0.7rem;text-align:left;font-size:0.78rem">তারিখ</th>
              <th style="padding:0.45rem 0.7rem;text-align:right;font-size:0.78rem">নগদ বিক্রি</th>
              <th style="padding:0.45rem 0.7rem;text-align:right;font-size:0.78rem">বাকি বিক্রি</th>
              <th style="padding:0.45rem 0.7rem;text-align:right;font-size:0.78rem">আদায়</th>
              <th style="padding:0.45rem 0.7rem;text-align:right;font-size:0.78rem">খরচ</th>
              <th style="padding:0.45rem 0.7rem;text-align:right;font-size:0.78rem">লাভ/ক্ষতি</th>
              <th style="padding:0.45rem 0.7rem;text-align:right;font-size:0.78rem">লেনদেন</th>
            </tr>
          </thead>
          <tbody>${dailyRows}</tbody>
        </table>
      </div>
    </div>`;
}

function renderMonthTransactions(d) {
  if (!d.transactions.length)
    return '<div class="empty-state"><div class="empty-icon">💰</div><p>কোনো লেনদেন নেই</p></div>';
  return d.transactions.slice().reverse().map(t => buildRichTxnCard(t)).join('');
}

function renderMonthExpenses(d) {
  if (!d.expenses.length)
    return '<div class="empty-state"><div class="empty-icon">🧾</div><p>কোনো খরচ নেই</p></div>';

  const ICONS = {
    Transportation:'🚗', 'Supplier Purchase':'📦', Salary:'👷',
    Electricity:'💡', Rent:'🏠', Internet:'📶',
    Repair:'🔧', Tax:'🏛️', Packaging:'📫', Misc:'🧾'
  };
  const LABELS = {
    Transportation:'পরিবহন', 'Supplier Purchase':'পণ্য ক্রয়', Salary:'বেতন',
    Electricity:'বিদ্যুৎ', Rent:'ভাড়া', Internet:'ইন্টারনেট',
    Repair:'মেরামত', Tax:'কর', Packaging:'প্যাকেজিং', Misc:'অন্যান্য'
  };

  // ── Category chart + summary at top ──────────────────
  const hasCatData = d.expCategoryAnalytics && Object.keys(d.expCategoryAnalytics).length > 0;

  const catSummaryHTML = hasCatData
    ? `<div style="margin-bottom:1rem">
         <div style="font-weight:700;color:var(--green-dark);font-size:0.88rem;margin-bottom:0.6rem">
           📊 ক্যাটাগরি অনুযায়ী বিভাজন
         </div>
         <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;
                     background:var(--cream-dark);border-radius:var(--radius-sm);padding:1rem">

           <!-- Doughnut chart -->
           <div style="display:flex;align-items:center;justify-content:center">
             <div style="position:relative;width:160px;height:160px">
               <canvas id="chart-expense-donut-slot"></canvas>
             </div>
           </div>

           <!-- Category breakdown bars -->
           <div style="display:flex;flex-direction:column;justify-content:center">
             ${Object.entries(d.expCategoryAnalytics).map(([cat, data]) => `
               <div style="margin-bottom:0.5rem">
                 <div style="display:flex;justify-content:space-between;
                             font-size:0.8rem;margin-bottom:2px">
                   <span>${ICONS[cat] || '🧾'} ${LABELS[cat] || cat}
                     <span style="color:var(--ink-light);margin-left:0.25rem">
                       (${formatNumber(data.count)}টি)
                     </span>
                   </span>
                   <span>
                     <strong>${formatTaka(data.amount)}</strong>
                     <span style="color:var(--ink-light);margin-left:0.25rem">
                       ${formatNumber(data.pct)}%
                     </span>
                   </span>
                 </div>
                 <div style="height:5px;background:rgba(0,0,0,0.08);
                             border-radius:3px;overflow:hidden">
                   <div style="height:100%;width:${data.pct}%;
                               background:var(--red);border-radius:3px;
                               opacity:${0.4 + (data.pct / 100) * 0.6}">
                   </div>
                 </div>
               </div>`).join('')}
           </div>
         </div>
       </div>`
    : '';

  // Schedule donut chart draw after DOM paints
  if (hasCatData) {
    requestAnimationFrame(() => drawExpenseDonutChart(d));
  }

  // ── Individual expense rows ───────────────────────────
  const expRowsHTML = d.expenses.map(e => `
    <div style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem;
                background:#fff;border-radius:var(--radius-sm);margin-bottom:0.5rem;
                border-left:3px solid var(--red);box-shadow:0 1px 4px var(--shadow)">
      <span style="font-size:1.4rem">${ICONS[e.category] || '🧾'}</span>
      <div style="flex:1;min-width:0">
        <div style="font-weight:600;font-size:0.92rem">${e.title}</div>
        <div style="font-size:0.76rem;color:var(--ink-light);margin-top:2px">
          ${LABELS[e.category] || e.category}
          · ${formatDateShort(e.date)}
          ${e.paymentMethod
            ? ` · ${{ cash:'💵 নগদ', bkash:'📱 বিকাশ', nagad:'🟠 নগদ',
                       rocket:'🚀 রকেট', bank:'🏦 ব্যাংক' }[e.paymentMethod] || e.paymentMethod}`
            : ''}
          ${e.note ? ` · ${e.note}` : ''}
        </div>
      </div>
      <div style="font-weight:700;color:var(--red);flex-shrink:0">
        ${formatTaka(e.amount)}
      </div>
    </div>`).join('');

  return catSummaryHTML + expRowsHTML;
}

function renderPaymentAnalytics(paymentAnalytics) {
  if (!paymentAnalytics || !Object.keys(paymentAnalytics).length)
    return '<p style="font-size:0.83rem;color:var(--ink-light)">কোনো পেমেন্ট ডেটা নেই</p>';

  const PM_LABELS = {
    cash:        '💵 নগদ (Cash)',
    bkash:       '📱 বিকাশ',
    nagad:       '🟠 নগদ (Nagad)',
    rocket:      '🚀 রকেট',
    bank:        '🏦 ব্যাংক',
    unspecified: '❓ অনির্দিষ্ট'
  };

  const maxReceived = Math.max(...Object.values(paymentAnalytics).map(v => v.received), 1);
  const hasReceived = Object.values(paymentAnalytics).some(v => v.received > 0);

  const chartBlock = hasReceived
    ? `<div style="display:flex;justify-content:center;margin-bottom:0.9rem">
         <div style="position:relative;width:150px;height:150px">
           <canvas id="chart-payment-donut-slot"></canvas>
         </div>
       </div>`
    : '';

  // Schedule chart draw after DOM paints
  if (hasReceived) {
    requestAnimationFrame(() => drawPaymentDonutChart(paymentAnalytics));
  }

  const barsHTML = Object.entries(paymentAnalytics)
    .sort(([,a],[,b]) => (b.received + b.spent) - (a.received + a.spent))
    .map(([method, data]) => {
      const pct    = Math.round((data.received / maxReceived) * 100);
      const netPos = data.net >= 0;
      return `
        <div style="margin-bottom:0.7rem">
          <div style="display:flex;justify-content:space-between;
                      font-size:0.8rem;font-weight:600;margin-bottom:3px">
            <span>${PM_LABELS[method] || method}</span>
            <span style="color:${netPos ? 'var(--green-light)' : 'var(--red)'}">
              নেট: ${netPos ? '+' : ''}${formatTaka(data.net)}
            </span>
          </div>
          <div style="height:5px;background:rgba(0,0,0,0.08);border-radius:3px;
                      overflow:hidden;margin-bottom:4px">
            <div style="height:100%;width:${pct}%;background:var(--green-light);border-radius:3px">
            </div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:0.75rem">
            <span style="color:var(--green-light)">↑ আদায়: ${formatTaka(data.received)}</span>
            <span style="color:var(--red)">↓ খরচ: ${formatTaka(data.spent)}</span>
          </div>
        </div>`;
    }).join('');

  return chartBlock + barsHTML;
}

function renderMonthProducts(d) {
  const hasActivity  = d.productStats && d.productStats.length > 0;
  const hasLowStock  = d.lowStockItems  && d.lowStockItems.length > 0;
  const hasExpiring  = d.expiringItems  && d.expiringItems.length > 0;

  let html = '';

  // ── Best selling this month ───────────────────────────
if (hasActivity) {
    const topProducts = d.productStats.slice(0, 10);
    const maxRev      = Math.max(...topProducts.map(p => p.revenue), 1);

    // Chart canvas slot
    html += `
      <div style="margin-bottom:1.2rem">
        <div style="font-weight:700;color:var(--green-dark);font-size:0.88rem;margin-bottom:0.6rem">
          📊 শীর্ষ পণ্য — বিক্রয় ও আদায়  
        </div>
        <div style="background:#fff;border-radius:var(--radius-sm);padding:1rem;
                    box-shadow:0 1px 5px var(--shadow);margin-bottom:1rem">
          <div style="position:relative;height:${Math.max(160, topProducts.length * 36)}px">
            <canvas id="chart-product-bar-slot"></canvas>
          </div>
        </div>
      </div>`;

    // Schedule chart draw after DOM paints
    requestAnimationFrame(() => drawProductBarChart(d));

    // Detailed product cards below the chart
    html += `
      <div style="margin-bottom:1.2rem">
        <div style="font-weight:700;color:var(--green-dark);font-size:0.88rem;margin-bottom:0.6rem">
          🏆 এই মাসের সেরা বিক্রিত পণ্য
        </div>
        ${topProducts.map((p, i) => {
          const barPct   = Math.round((p.revenue / maxRev) * 100);
          const margin   = p.margin !== null ? `${p.margin}%` : '—';
          const stockTag = p.isExpired
            ? `<span style="font-size:0.7rem;background:var(--red-pale);color:var(--red);
                            padding:1px 6px;border-radius:10px">🚫 মেয়াদ শেষ</span>`
            : p.isLowStock
              ? `<span style="font-size:0.7rem;background:#fff3cd;color:#856404;
                              padding:1px 6px;border-radius:10px">⚠️ কম স্টক</span>`
              : '';
          return `
          <div style="background:#fff;border-radius:var(--radius-sm);padding:0.75rem 0.9rem;
                      margin-bottom:0.5rem;border-left:3px solid var(--green-light);
                      box-shadow:0 1px 4px var(--shadow)">
            <div style="display:flex;justify-content:space-between;
                        align-items:flex-start;margin-bottom:0.4rem">
              <div>
                <span style="font-weight:700;font-size:0.92rem">
                  ${i < 3 ? ['🥇','🥈','🥉'][i] : `${i+1}.`} ${p.name}
                </span>
                ${stockTag}
              </div>
              <strong style="color:var(--green-dark);font-size:0.92rem">
                ${formatTaka(p.revenue)}
              </strong>
            </div>
            <div style="height:5px;background:var(--cream-dark);border-radius:3px;
                        overflow:hidden;margin-bottom:0.4rem">
              <div style="height:100%;width:${barPct}%;background:var(--green-light);
                          border-radius:3px"></div>
            </div>
            <div style="display:flex;gap:1rem;font-size:0.76rem;color:var(--ink-light)">
              <span>📦 বিক্রয়: ${formatNumber(p.qty)}</span>
              <span>🧾 ${formatNumber(p.txnCount)} লেনদেন</span>
              ${p.currentStock !== null
                ? `<span>📊 স্টক: ${formatNumber(p.currentStock)}</span>` : ''}
              ${p.margin !== null
                ? `<span>💹 মার্জিন: ${margin}</span>` : ''}
            </div>
          </div>`;
        }).join('')}
      </div>`;
  } else {
    html += `<div class="empty-state" style="margin-bottom:1rem">
               <div class="empty-icon">📦</div>
               <p>এই মাসে কোনো পণ্য বিক্রি হয়নি</p>
             </div>`;
  }

  // ── Low stock warning ─────────────────────────────────
  if (hasLowStock) {
    html += `
      <div style="margin-bottom:1.2rem">
        <div style="font-weight:700;color:var(--amber-dark);font-size:0.88rem;margin-bottom:0.6rem">
          ⚠️ কম স্টক সতর্কতা
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:0.5rem">
          ${d.lowStockItems.map(item => `
            <div style="background:#fff3cd;border-radius:var(--radius-sm);padding:0.4rem 0.75rem;
                        font-size:0.8rem;border:1px solid #ffc107">
              <strong>${item.name}</strong>
              <span style="color:#856404;margin-left:0.3rem">স্টক: ${formatNumber(item.quantity)}</span>
            </div>`).join('')}
        </div>
      </div>`;
  }

  // ── Expiring soon ─────────────────────────────────────
  if (hasExpiring) {
    html += `
      <div>
        <div style="font-weight:700;color:var(--red);font-size:0.88rem;margin-bottom:0.6rem">
          🚫 শীঘ্রই মেয়াদ শেষ হবে (৩০ দিনের মধ্যে)
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:0.5rem">
          ${d.expiringItems.map(item => `
            <div style="background:var(--red-pale);border-radius:var(--radius-sm);
                        padding:0.4rem 0.75rem;font-size:0.8rem;border:1px solid var(--red)">
              <strong>${item.name}</strong>
              <span style="color:var(--red);margin-left:0.3rem">
                ${formatDateShort(item.expiryDate)}
              </span>
            </div>`).join('')}
        </div>
      </div>`;
  }

  return html || '<div class="empty-state"><div class="empty-icon">📦</div><p>কোনো পণ্য ডেটা নেই</p></div>';
}

function renderMonthCustomers(d) {
  let html = '';

  const hasTopCustomers  = d.customerStats     && d.customerStats.length > 0;
  const hasHighDue       = d.highDueCustomers   && d.highDueCustomers.length > 0;
  const hasOverdue       = d.overdueCustomers   && d.overdueCustomers.length > 0;
  const hasRepayers      = d.topRepayers        && d.topRepayers.length > 0;

  // ── Charts row ────────────────────────────────────────
  const showCharts = hasTopCustomers || hasHighDue;
  if (showCharts) {
    html += `
      <div style="display:grid;grid-template-columns:${hasTopCustomers && hasHighDue ? '1fr 1fr' : '1fr'};
                  gap:1rem;margin-bottom:1.2rem">
        ${hasTopCustomers ? `
          <div style="background:#fff;border-radius:var(--radius-sm);padding:1rem;
                      box-shadow:0 1px 5px var(--shadow)">
            <div style="font-weight:700;color:var(--green-dark);font-size:0.82rem;margin-bottom:0.6rem">
              🛒 শীর্ষ ক্রেতা (কেনাকাটা)
            </div>
            <div style="position:relative;height:180px">
              <canvas id="chart-top-buyers-slot"></canvas>
            </div>
          </div>` : ''}
        ${hasHighDue ? `
          <div style="background:#fff;border-radius:var(--radius-sm);padding:1rem;
                      box-shadow:0 1px 5px var(--shadow)">
            <div style="font-weight:700;color:var(--amber-dark);font-size:0.82rem;margin-bottom:0.6rem">
              💰 সর্বোচ্চ বাকি গ্রাহক
            </div>
            <div style="position:relative;height:180px">
              <canvas id="chart-high-due-slot"></canvas>
            </div>
          </div>` : ''}
      </div>`;

    requestAnimationFrame(() => {
      if (hasTopCustomers) drawTopBuyersChart(d);
      if (hasHighDue)      drawHighDueChart(d);
    });
  }

  // ── Top purchasing customers (detail cards) ───────────
  if (hasTopCustomers) {
    const maxPurch = Math.max(...d.customerStats.map(c => c.purchased), 1);
    html += `
      <div style="margin-bottom:1.2rem">
        <div style="font-weight:700;color:var(--green-dark);font-size:0.88rem;margin-bottom:0.6rem">
          🏆 এই মাসের শীর্ষ ক্রেতা
        </div>
        ${d.customerStats.slice(0, 6).map((c, i) => {
          const barPct     = Math.round((c.purchased / maxPurch) * 100);
          const trustColor = c.trustScore >= 70 ? 'var(--green-light)'
                           : c.trustScore >= 40 ? 'var(--amber-dark)' : 'var(--red)';
          return `
          <div style="background:#fff;border-radius:var(--radius-sm);padding:0.7rem 0.9rem;
                      margin-bottom:0.5rem;box-shadow:0 1px 4px var(--shadow);
                      cursor:pointer;border-left:3px solid ${trustColor}"
               onclick="closeModal('modal-month-detail');openCustomerDetail('${c.id}')">
            <div style="display:flex;justify-content:space-between;
                        align-items:center;margin-bottom:0.35rem">
              <div style="display:flex;align-items:center;gap:0.5rem">
                <span style="font-size:0.85rem">${i < 3 ? ['🥇','🥈','🥉'][i] : `${i+1}.`}</span>
                <span style="font-weight:700;font-size:0.9rem">${c.name}</span>
                <span style="font-size:0.72rem;padding:1px 7px;border-radius:20px;
                             background:${trustColor}22;color:${trustColor}">
                  ${formatNumber(c.trustScore)}
                </span>
              </div>
              <strong style="color:var(--green-dark)">${formatTaka(c.purchased)}</strong>
            </div>
            <div style="height:4px;background:var(--cream-dark);border-radius:2px;
                        overflow:hidden;margin-bottom:0.35rem">
              <div style="height:100%;width:${barPct}%;background:${trustColor};border-radius:2px">
              </div>
            </div>
            <div style="display:flex;gap:1rem;font-size:0.75rem;color:var(--ink-light)">
              <span>✅ পরিশোধ: ${formatTaka(c.paid)}</span>
              <span>⏳ সব বাকি: ${formatTaka(c.allTimeDue)}</span>
              <span>📋 ${formatNumber(c.txnCount)} লেনদেন</span>
              <span>💯 ${formatNumber(c.repayPct)}% পরিশোধ হার</span>
            </div>
          </div>`;
        }).join('')}
      </div>`;
  }

  // ── Highest due customers (detail list) ──────────────
  if (hasHighDue) {
    html += `
      <div style="margin-bottom:1.2rem">
        <div style="font-weight:700;color:var(--amber-dark);font-size:0.88rem;margin-bottom:0.6rem">
          💰 সর্বোচ্চ বাকি গ্রাহক
        </div>
        <div style="background:var(--cream-dark);border-radius:var(--radius-sm);overflow:hidden">
          ${d.highDueCustomers.map((c, i) => `
            <div style="display:flex;justify-content:space-between;align-items:center;
                        padding:0.55rem 0.9rem;border-bottom:1px solid var(--border);
                        cursor:pointer;background:${i % 2 === 0 ? '#fff' : 'transparent'}"
                 onclick="closeModal('modal-month-detail');openCustomerDetail('${c.id}')">
              <div>
                <span style="font-weight:600;font-size:0.88rem">${c.name}</span>
                ${c.phone
                  ? `<span style="font-size:0.75rem;color:var(--ink-light);margin-left:0.4rem">
                       📞 ${c.phone}
                     </span>` : ''}
              </div>
              <span style="font-weight:700;color:var(--amber-dark)">${formatTaka(c.due)}</span>
            </div>`).join('')}
        </div>
      </div>`;
  }

  // ── Overdue customers ─────────────────────────────────
  if (hasOverdue) {
    html += `
      <div style="margin-bottom:1.2rem">
        <div style="font-weight:700;color:var(--red);font-size:0.88rem;margin-bottom:0.6rem">
          🔴 মেয়াদউত্তীর্ণ বকেয়া গ্রাহক
        </div>
        <div style="background:var(--cream-dark);border-radius:var(--radius-sm);overflow:hidden">
          ${d.overdueCustomers.map((c, i) => `
            <div style="display:flex;justify-content:space-between;align-items:center;
                        padding:0.55rem 0.9rem;border-bottom:1px solid var(--border);
                        cursor:pointer;background:${i % 2 === 0 ? '#fff8f8' : 'transparent'}"
                 onclick="closeModal('modal-month-detail');openCustomerDetail('${c.id}')">
              <div>
                <span style="font-weight:600;font-size:0.88rem">${c.name}</span>
                <span style="font-size:0.75rem;color:var(--red);margin-left:0.4rem">
                  ${formatNumber(c.overdueCount)}টি বাকি
                </span>
              </div>
              <span style="font-weight:700;color:var(--red)">${formatTaka(c.overdueAmt)}</span>
            </div>`).join('')}
        </div>
      </div>`;
  }

  // ── Top repayers ──────────────────────────────────────
  if (hasRepayers) {
    html += `
      <div>
        <div style="font-weight:700;color:var(--green-light);font-size:0.88rem;margin-bottom:0.6rem">
          ✅ সেরা পরিশোধকারী (এই মাস)
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:0.5rem">
          ${d.topRepayers.map((c, i) => `
            <div style="background:var(--green-pale);border-radius:var(--radius-sm);
                        padding:0.4rem 0.8rem;font-size:0.82rem;cursor:pointer;
                        border:1px solid var(--green-light)"
                 onclick="closeModal('modal-month-detail');openCustomerDetail('${c.id}')">
              ${i === 0 ? '🥇' : i === 1 ? '🥈' : '✅'}
              <strong>${c.name}</strong>
              <span style="color:var(--green-dark);margin-left:0.3rem">${formatTaka(c.paid)}</span>
            </div>`).join('')}
        </div>
      </div>`;
  }

  return html || '<div class="empty-state"><div class="empty-icon">👥</div><p>কোনো গ্রাহক ডেটা নেই</p></div>';
}

function renderMonthInsights(d) {
  const ins = d.insights;
  if (!ins) return '<div class="empty-state"><div class="empty-icon">💡</div><p>ডেটা নেই</p></div>';

  const CATEGORY_LABELS = {
    Transportation:'পরিবহন', 'Supplier Purchase':'পণ্য ক্রয়', Salary:'বেতন',
    Electricity:'বিদ্যুৎ', Rent:'ভাড়া', Internet:'ইন্টারনেট',
    Repair:'মেরামত', Tax:'কর', Packaging:'প্যাকেজিং', Misc:'অন্যান্য'
  };

  // Helper to render one insight card
  function insightCard(icon, label, primary, secondary = '', extraStyle = '', onClick = '') {
    return `
      <div style="background:#fff;border-radius:var(--radius-sm);padding:0.9rem 1rem;
                  box-shadow:0 1px 5px var(--shadow);border-top:3px solid var(--green-light);
                  ${extraStyle}${onClick ? 'cursor:pointer;' : ''}"
           ${onClick ? `onclick="${onClick}"` : ''}>
        <div style="font-size:0.75rem;color:var(--ink-light);margin-bottom:0.35rem">
          ${icon} ${label}
        </div>
        <div style="font-size:1rem;font-weight:700;color:var(--green-dark);margin-bottom:${secondary ? '0.2rem' : '0'}">
          ${primary}
        </div>
        ${secondary
          ? `<div style="font-size:0.76rem;color:var(--ink-light)">${secondary}</div>`
          : ''}
      </div>`;
  }

  // ── Section 1: Day-level records ──────────────────────
  const dayCards = `
    <div style="margin-bottom:1.2rem">
      <div style="font-weight:700;color:var(--green-dark);font-size:0.88rem;margin-bottom:0.6rem">
        📅 দিন-ভিত্তিক রেকর্ড
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:0.6rem">
        ${ins.highestSaleDay
          ? insightCard('💰', 'সর্বোচ্চ বিক্রির দিন',
              formatTaka(ins.highestSaleDay.value),
              `${new Date(ins.highestSaleDay.date).toLocaleDateString('bn-BD', { day:'numeric', month:'long' })} · ${formatNumber(ins.highestSaleDay.txnCount)} লেনদেন`,
              'border-top-color:var(--green-light);')
          : insightCard('💰', 'সর্বোচ্চ বিক্রির দিন', 'কোনো বিক্রি নেই')}
        ${ins.highestExpenseDay
          ? insightCard('🧾', 'সর্বোচ্চ খরচের দিন',
              formatTaka(ins.highestExpenseDay.value),
              `${new Date(ins.highestExpenseDay.date).toLocaleDateString('bn-BD', { day:'numeric', month:'long' })} · ${formatNumber(ins.highestExpenseDay.expCount)} খরচ`,
              'border-top-color:var(--red);')
          : insightCard('🧾', 'সর্বোচ্চ খরচের দিন', 'কোনো খরচ নেই', '', 'border-top-color:var(--red);')}
        ${ins.bestProfitDay
          ? insightCard('📈', 'সেরা লাভের দিন',
              '+' + formatTaka(ins.bestProfitDay.value),
              new Date(ins.bestProfitDay.date).toLocaleDateString('bn-BD', { day:'numeric', month:'long' }),
              'border-top-color:var(--green-mid);')
          : insightCard('📈', 'সেরা লাভের দিন', 'কোনো লাভ নেই', '', 'border-top-color:var(--green-mid);')}
        ${ins.busiestDay
          ? insightCard('🔥', 'সবচেয়ে ব্যস্ত দিন',
              `${formatNumber(ins.busiestDay.txnCount)} লেনদেন`,
              new Date(ins.busiestDay.date).toLocaleDateString('bn-BD', { day:'numeric', month:'long' }),
              'border-top-color:var(--amber-dark);')
          : insightCard('🔥', 'সবচেয়ে ব্যস্ত দিন', 'কোনো ডেটা নেই', '', 'border-top-color:var(--amber-dark);')}
      </div>
    </div>`;

  // ── Section 2: Transaction records ───────────────────
  const txnCards = `
    <div style="margin-bottom:1.2rem">
      <div style="font-weight:700;color:var(--green-dark);font-size:0.88rem;margin-bottom:0.6rem">
        💳 লেনদেন রেকর্ড
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:0.6rem">
        ${ins.largestTxn
          ? insightCard('💵', 'সর্ববৃহৎ লেনদেন',
              formatTaka(ins.largestTxn.amount),
              `${ins.largestTxn.customerName}${ins.largestTxn.productName ? ` · ${ins.largestTxn.productName}` : ''} · ${new Date(ins.largestTxn.date).toLocaleDateString('bn-BD', { day:'numeric', month:'long' })}`,
              'border-top-color:var(--amber-dark);')
          : insightCard('💵', 'সর্ববৃহৎ লেনদেন', 'কোনো বিক্রি নেই', '', 'border-top-color:var(--amber-dark);')}
        ${ins.largestExpense
          ? insightCard('💸', 'সর্ববৃহৎ খরচ',
              formatTaka(ins.largestExpense.amount),
              `${ins.largestExpense.title} · ${CATEGORY_LABELS[ins.largestExpense.category] || ins.largestExpense.category} · ${new Date(ins.largestExpense.date).toLocaleDateString('bn-BD', { day:'numeric', month:'long' })}`,
              'border-top-color:var(--red);')
          : insightCard('💸', 'সর্ববৃহৎ খরচ', 'কোনো খরচ নেই', '', 'border-top-color:var(--red);')}
        ${insightCard('📊', 'গড় দৈনিক আদায় ',
            formatTaka(ins.avgDailyRevenue),
            `${formatNumber(ins.activeDaysCount)} সক্রিয় দিন`)}
        ${insightCard('🗓️', 'সক্রিয় দিন',
            `${formatNumber(ins.activeDaysCount)} দিন`,
            `মোট ${formatNumber(new Date(d.year, d.month, 0).getDate())} দিনের মধ্যে`)}
      </div>
    </div>`;

  // ── Section 3: Star performers ────────────────────────
  const starCards = `
    <div>
      <div style="font-weight:700;color:var(--green-dark);font-size:0.88rem;margin-bottom:0.6rem">
        ⭐ এই মাসের সেরা
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:0.6rem">
        ${ins.mostSoldProduct
          ? insightCard('📦', 'সর্বোচ্চ বিক্রিত পণ্য',
              ins.mostSoldProduct.name,
              `${formatNumber(ins.mostSoldProduct.qty)} বিক্রিত · ${formatTaka(ins.mostSoldProduct.revenue)}${ins.mostSoldProduct.currentStock !== null ? ` · স্টক: ${formatNumber(ins.mostSoldProduct.currentStock)}` : ''}`,
              'border-top-color:var(--green-mid);')
          : insightCard('📦', 'সর্বোচ্চ বিক্রিত পণ্য', 'কোনো পণ্য বিক্রি হয়নি', '', 'border-top-color:var(--green-mid);')}
        ${ins.mostActiveCustomer
          ? insightCard('👤', 'সবচেয়ে সক্রিয় গ্রাহক',
              ins.mostActiveCustomer.name,
              `${formatNumber(ins.mostActiveCustomer.txnCount)} লেনদেন · ${formatTaka(ins.mostActiveCustomer.purchased)} কেনাকাটা`,
              'border-top-color:var(--green-mid);',
              `closeModal('modal-month-detail');openCustomerDetail('${ins.mostActiveCustomer.id}')`)
          : insightCard('👤', 'সবচেয়ে সক্রিয় গ্রাহক', 'কোনো ডেটা নেই', '', 'border-top-color:var(--green-mid);')}
      </div>
    </div>`;

  return dayCards + txnCards + starCards;
}

function drawMonthCharts(d) {
  if (!d || !window.Chart) return;

  const lang = localStorage.getItem('lang') || 'bn';

  // ── Chart 1: Summary bar (Revenue / Expense / Profit) ─
  const barCanvas = document.getElementById('chart-summary-bar-slot');
  if (barCanvas) {
    destroyChart('summary-bar');

    const s          = d.summary;
    const profitColor = s.netProfit >= 0 ? 'rgba(64,145,108,0.85)' : 'rgba(230,57,70,0.85)';

    CHARTS['summary-bar'] = new Chart(barCanvas, {
      type: 'bar',
      data: {
        labels: [
          lang === 'bn' ? 'মোট আদায়'   : 'Total Collections',
          lang === 'bn' ? 'মোট খরচ'      : 'Total Expense',
          lang === 'bn' ? 'নেট লাভ/ক্ষতি' : 'Net Profit'
        ],
        datasets: [{
          data:            [s.totalRevenue, s.totalExpense, s.netProfit],
          backgroundColor: ['rgba(64,145,108,0.8)', 'rgba(230,57,70,0.75)', profitColor],
          borderColor:     ['#40916c', '#e63946', s.netProfit >= 0 ? '#40916c' : '#e63946'],
          borderWidth:     1.5,
          borderRadius:    5
        }]
      },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ' ৳' + Math.abs(ctx.raw).toLocaleString('bn-BD')
            }
          }
        },
        scales: {
          x: {
            grid:  { display: false },
            ticks: { font: { family: 'Hind Siliguri', size: 11 } }
          },
          y: {
            beginAtZero: true,
            grid:  { color: 'rgba(0,0,0,0.05)' },
            ticks: {
              font:     { family: 'Hind Siliguri', size: 10 },
              callback: val => '৳' + (val >= 1000 ? (val/1000).toFixed(1) + 'k' : val)
            }
          }
        }
      }
    });
  }

  // ── Chart 2: Daily cash flow line chart ───────────────
  const lineCanvas = document.getElementById('chart-daily-line-slot');
  if (lineCanvas && d.dailyBreakdown) {

    destroyChart('daily-line');

    // Only include days with any activity for cleaner chart
    // but keep ALL days for correct X axis continuity
    const days    = d.dailyBreakdown;
    const labels  = days.map(day => getBnMonthDayLabel(day.date));
    const revenue = days.map(day => day.revenue);
    const expense = days.map(day => day.expenses);
    const profit  = days.map(day => day.profit);

    CHARTS['daily-line'] = new Chart(lineCanvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label:           lang === 'bn' ? 'আদায়' : 'Collections',
            data:            revenue,
            borderColor:     '#40916c',
            backgroundColor: 'rgba(64,145,108,0.08)',
            borderWidth:     2,
            pointRadius:     days.map(d => d.revenue > 0 ? 3 : 0),
            pointHoverRadius:5,
            fill:            true,
            tension:         0.3
          },
          {
            label:           lang === 'bn' ? 'খরচ' : 'Expense',
            data:            expense,
            borderColor:     '#e63946',
            backgroundColor: 'rgba(230,57,70,0.06)',
            borderWidth:     2,
            pointRadius:     days.map(d => d.expenses > 0 ? 3 : 0),
            pointHoverRadius:5,
            fill:            true,
            tension:         0.3
          },
          {
            label:           lang === 'bn' ? 'লাভ/ক্ষতি' : 'Profit',
            data:            profit,
            borderColor:     '#e9c46a',
            backgroundColor: 'rgba(233,196,106,0.06)',
            borderWidth:     1.5,
            pointRadius:     days.map(d => d.profit !== 0 ? 2 : 0),
            pointHoverRadius:4,
            borderDash:      [4, 3],
            fill:            false,
            tension:         0.3
          }
        ]
      },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            display:  true,
            position: 'top',
            labels:   { font: { family: 'Hind Siliguri', size: 11 }, boxWidth: 14, padding: 12 }
          },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.dataset.label}: ৳${Math.abs(ctx.raw).toLocaleString('bn-BD')}`
            }
          }
        },
        scales: {
          x: {
            grid:  { display: false },
            ticks: {
              font:        { family: 'Hind Siliguri', size: 10 },
              maxTicksLimit: 15,
              maxRotation:  0
            }
          },
          y: {
            beginAtZero: true,
            grid:        { color: 'rgba(0,0,0,0.05)' },
            ticks: {
              font:     { family: 'Hind Siliguri', size: 10 },
              callback: val => val >= 1000 ? '৳' + (val/1000).toFixed(1) + 'k' : '৳' + val
            }
          }
        }
      }
    });
  }
}

function drawExpenseDonutChart(d) {
  if (!d || !window.Chart) return;

  const canvas = document.getElementById('chart-expense-donut-slot');
  if (!canvas) return;

  destroyChart('expense-donut');

  const catData = d.expCategoryAnalytics;
  if (!catData || !Object.keys(catData).length) return;

  const LABELS_BN = {
    Transportation:     'পরিবহন',
    'Supplier Purchase':'পণ্য ক্রয়',
    Salary:             'বেতন',
    Electricity:        'বিদ্যুৎ',
    Rent:               'ভাড়া',
    Internet:           'ইন্টারনেট',
    Repair:             'মেরামত',
    Tax:                'কর',
    Packaging:          'প্যাকেজিং',
    Misc:               'অন্যান্য'
  };

  // Fixed color palette — one per category slot
  const PALETTE = [
    'rgba(230, 57,  70,  0.82)',   // red
    'rgba(233,196, 106, 0.85)',    // amber
    'rgba( 64,145, 108, 0.80)',    // green
    'rgba( 72,149, 239, 0.80)',    // blue
    'rgba(247,127,   0, 0.80)',    // orange
    'rgba(114, 9, 183,  0.70)',    // purple
    'rgba( 76,201, 240, 0.80)',    // cyan
    'rgba(181,228, 140, 0.85)',    // light green
    'rgba(255,158, 128, 0.80)',    // salmon
    'rgba(168,218, 220, 0.85)'     // teal
  ];

  const entries = Object.entries(catData);
  const labels  = entries.map(([cat]) => LABELS_BN[cat] || cat);
  const amounts = entries.map(([, v]) => v.amount);
  const colors  = entries.map((_, i) => PALETTE[i % PALETTE.length]);

  const lang = localStorage.getItem('lang') || 'bn';

  CHARTS['expense-donut'] = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data:            amounts,
        backgroundColor: colors,
        borderColor:     '#fff',
        borderWidth:     2,
        hoverOffset:     6
      }]
    },
    options: {
      responsive:          true,
      maintainAspectRatio: false,
      cutout:              '62%',
      plugins: {
        legend: { display: false },   // legend replaced by bar breakdown on the right
        tooltip: {
          callbacks: {
            label: ctx => {
              const pct = Math.round((ctx.raw / amounts.reduce((s,v)=>s+v,0)) * 100);
              return ` ${ctx.label}: ৳${ctx.raw.toLocaleString('bn-BD')} (${pct}%)`;
            }
          },
          bodyFont: { family: 'Hind Siliguri' }
        }
      }
    }
  });
}

function drawPaymentDonutChart(paymentAnalytics) {
  if (!paymentAnalytics || !window.Chart) return;

  const canvas = document.getElementById('chart-payment-donut-slot');
  if (!canvas) return;

  destroyChart('payment-donut');

  const PM_LABELS_BN = {
    cash:        'নগদ (Cash)',
    bkash:       'বিকাশ',
    nagad:       'নগদ (Nagad)',
    rocket:      'রকেট',
    bank:        'ব্যাংক',
    unspecified: 'অনির্দিষ্ট'
  };

  const PM_COLORS = {
    cash:        'rgba( 64,145,108, 0.85)',
    bkash:       'rgba(236, 14, 188, 0.82)',
    nagad:       'rgba(247,127,  0, 0.85)',
    rocket:      'rgba( 52,152,219, 0.82)',
    bank:        'rgba( 52, 73, 94, 0.80)',
    unspecified: 'rgba(189,189,189, 0.75)'
  };

  // Only include methods with received > 0
  const entries  = Object.entries(paymentAnalytics).filter(([, v]) => v.received > 0);
  if (!entries.length) return;

  const labels  = entries.map(([m])    => PM_LABELS_BN[m] || m);
  const amounts = entries.map(([, v])  => v.received);
  const colors  = entries.map(([m])    => PM_COLORS[m] || 'rgba(150,150,150,0.7)');
  const total   = amounts.reduce((s, v) => s + v, 0);

  CHARTS['payment-donut'] = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data:            amounts,
        backgroundColor: colors,
        borderColor:     '#fff',
        borderWidth:     2,
        hoverOffset:     6
      }]
    },
    options: {
      responsive:          true,
      maintainAspectRatio: false,
      cutout:              '60%',
      plugins: {
        legend: {
          display:  true,
          position: 'bottom',
          labels: {
            font:      { family: 'Hind Siliguri', size: 10 },
            boxWidth:  12,
            padding:   8,
            generateLabels: chart => {
              const data = chart.data;
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                const pct   = total > 0 ? Math.round((value / total) * 100) : 0;
                return {
                  text:            `${label} ${pct}%`,
                  fillStyle:       data.datasets[0].backgroundColor[i],
                  strokeStyle:     '#fff',
                  lineWidth:       1,
                  hidden:          false,
                  index:           i
                };
              });
            }
          }
        },
        tooltip: {
          callbacks: {
            label: ctx => {
              const pct = total > 0 ? Math.round((ctx.raw / total) * 100) : 0;
              return ` ${ctx.label}: ৳${ctx.raw.toLocaleString('bn-BD')} (${pct}%)`;
            }
          },
          bodyFont: { family: 'Hind Siliguri' }
        }
      }
    }
  });
}

function drawProductBarChart(d) {
  if (!d || !window.Chart) return;

  const canvas = document.getElementById('chart-product-bar-slot');
  if (!canvas) return;

  destroyChart('product-bar');

  const products = (d.productStats || []).slice(0, 10);
  if (!products.length) return;

  // Sort by quantity descending
  const sorted   = [...products].sort((a, b) => b.qty - a.qty);
  const labels   = sorted.map(p => p.name);
  const qtyData  = sorted.map(p => p.qty);
  const revData  = sorted.map(p => p.revenue);

  const lang = localStorage.getItem('lang') || 'bn';

  CHARTS['product-bar'] = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label:           lang === 'bn' ? 'বিক্রয় পরিমাণ' : 'Qty Sold',
          data:            qtyData,
          backgroundColor: 'rgba(64,145,108,0.78)',
          borderColor:     '#40916c',
          borderWidth:     1.5,
          borderRadius:    4,
          yAxisID:         'yQty'
        },
        {
          label:           lang === 'bn' ? 'আদায় (৳)' : 'Collection (৳)',
          data:            revData,
          backgroundColor: 'rgba(233,196,106,0.75)',
          borderColor:     '#e9c46a',
          borderWidth:     1.5,
          borderRadius:    4,
          yAxisID:         'yRev'
        }
      ]
    },
    options: {
      indexAxis:           'y',      // horizontal bars
      responsive:          true,
      maintainAspectRatio: false,
      interaction:         { mode: 'index', intersect: false },
      plugins: {
        legend: {
          display:  true,
          position: 'top',
          labels:   { font: { family: 'Hind Siliguri', size: 11 }, boxWidth: 14, padding: 10 }
        },
        tooltip: {
          callbacks: {
            label: ctx => {
              if (ctx.datasetIndex === 0)
                return ` ${ctx.dataset.label}: ${formatNumber(ctx.raw)}`;
              return ` ${ctx.dataset.label}: ৳${ctx.raw.toLocaleString('bn-BD')}`;
            }
          },
          bodyFont: { family: 'Hind Siliguri' }
        }
      },
      scales: {
        x: { display: false },       // hide both X axes — bars speak for themselves
        xQty: { display: false },
        xRev: { display: false },
        y: {
          grid:  { display: false },
          ticks: {
            font:      { family: 'Hind Siliguri', size: 11 },
            color:     '#4a4a6a',
            crossAlign:'far'
          }
        },
        yQty: {
          display:  false,
          position: 'left',
          beginAtZero: true
        },
        yRev: {
          display:  false,
          position: 'right',
          beginAtZero: true
        }
      }
    }
  });
}

function drawTopBuyersChart(d) {
  if (!d || !window.Chart) return;

  const canvas = document.getElementById('chart-top-buyers-slot');
  if (!canvas) return;

  destroyChart('top-buyers');

  const top    = (d.customerStats || []).slice(0, 5);
  if (!top.length) return;

  const sorted   = [...top].sort((a, b) => b.purchased - a.purchased);
  const labels   = sorted.map(c => c.name.length > 10 ? c.name.slice(0,10) + '…' : c.name);
  const purchase = sorted.map(c => c.purchased);
  const paid     = sorted.map(c => c.paid);
  const lang     = localStorage.getItem('lang') || 'bn';

  CHARTS['top-buyers'] = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label:           lang === 'bn' ? 'কেনাকাটা' : 'Purchased',
          data:            purchase,
          backgroundColor: 'rgba(233,196,106,0.82)',
          borderColor:     '#e9c46a',
          borderWidth:     1.5,
          borderRadius:    4
        },
        {
          label:           lang === 'bn' ? 'পরিশোধ' : 'Paid',
          data:            paid,
          backgroundColor: 'rgba(64,145,108,0.78)',
          borderColor:     '#40916c',
          borderWidth:     1.5,
          borderRadius:    4
        }
      ]
    },
    options: {
      responsive:          true,
      maintainAspectRatio: false,
      interaction:         { mode: 'index', intersect: false },
      plugins: {
        legend: {
          display:  true,
          position: 'top',
          labels:   { font: { family: 'Hind Siliguri', size: 10 }, boxWidth: 12, padding: 8 }
        },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ৳${ctx.raw.toLocaleString('bn-BD')}`
          },
          bodyFont: { family: 'Hind Siliguri' }
        }
      },
      scales: {
        x: {
          grid:  { display: false },
          ticks: { font: { family: 'Hind Siliguri', size: 10 }, maxRotation: 0 }
        },
        y: {
          beginAtZero: true,
          grid:        { color: 'rgba(0,0,0,0.05)' },
          ticks: {
            font:     { family: 'Hind Siliguri', size: 9 },
            callback: val => val >= 1000 ? '৳' + (val/1000).toFixed(1) + 'k' : '৳' + val
          }
        }
      }
    }
  });
}

function drawHighDueChart(d) {
  if (!d || !window.Chart) return;

  const canvas = document.getElementById('chart-high-due-slot');
  if (!canvas) return;

  destroyChart('high-due');

  const top = (d.highDueCustomers || []).slice(0, 5);
  if (!top.length) return;

  const sorted = [...top].sort((a, b) => b.due - a.due);
  const labels = sorted.map(c => c.name.length > 10 ? c.name.slice(0,10) + '…' : c.name);
  const dues   = sorted.map(c => c.due);
  const lang   = localStorage.getItem('lang') || 'bn';

  // Color gradient: highest due = most saturated red
  const maxDue = Math.max(...dues, 1);
  const colors = dues.map(v => {
    const intensity = 0.45 + (v / maxDue) * 0.45;
    return `rgba(230,57,70,${intensity.toFixed(2)})`;
  });

  CHARTS['high-due'] = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label:           lang === 'bn' ? 'বাকি' : 'Due',
        data:            dues,
        backgroundColor: colors,
        borderColor:     dues.map(() => '#e63946'),
        borderWidth:     1.5,
        borderRadius:    4
      }]
    },
    options: {
      indexAxis:           'y',
      responsive:          true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` বাকি: ৳${ctx.raw.toLocaleString('bn-BD')}`
          },
          bodyFont: { family: 'Hind Siliguri' }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          grid:        { color: 'rgba(0,0,0,0.05)' },
          ticks: {
            font:     { family: 'Hind Siliguri', size: 9 },
            callback: val => val >= 1000 ? '৳' + (val/1000).toFixed(1) + 'k' : '৳' + val
          }
        },
        y: {
          grid:  { display: false },
          ticks: { font: { family: 'Hind Siliguri', size: 10 }, color: '#4a4a6a' }
        }
      }
    }
  });
}
// ─── Settings ─────────────────────────────────────────
async function loadSettings() {
  try {
    const info = await API('/api/auth/info');

    const shopEl  = document.getElementById('setting-shop-name');
    const ownEl   = document.getElementById('setting-owner-name');

    if (shopEl) {
      shopEl.value    = info.shopName  || '';
      shopEl.disabled = false;
      shopEl.removeAttribute('readonly');
    }
    if (ownEl) {
      ownEl.value    = info.ownerName || '';
      ownEl.disabled = false;
      ownEl.removeAttribute('readonly');
    }

    shopsList = info.shops || ['প্রধান শাখা'];
    renderShopList();
    updateBranchCountBadge();
  } catch (e) {
    showToast('সেটিংস লোড করতে সমস্যা হয়েছে', 'error');
  }
}
function renderShopList() {
  const el = document.getElementById('shop-list');
  if (!el) return;

  updateBranchCountBadge();

  if (!shopsList.length) {
    el.innerHTML = `<div class="stg-branch-empty">কোনো শাখা নেই</div>`;
    return;
  }

  el.innerHTML = shopsList.map((s, i) => `
    <div class="stg-branch-row">
      <span class="stg-branch-num">${formatNumber(i + 1)}</span>
      <span class="stg-branch-name">${s}</span>
      ${shopsList.length > 1
        ? `<button onclick="deleteShop(${i})" class="stg-branch-del"
                   title="${s} মুছুন">✕</button>`
        : `<span class="stg-branch-protected" title="শেষ শাখা মুছতে পারবেন না">🔒</span>`}
    </div>`).join('');
}

function addShop() {
  const input = document.getElementById('new-shop-input');
  const errEl = document.getElementById('shop-error');
  const name  = input.value.trim();

  errEl.textContent = '';
  if (!name)                    { errEl.textContent = 'শাখার নাম দিন';           return; }
  if (shopsList.includes(name)) { errEl.textContent = 'এই শাখা ইতিমধ্যে আছে';  return; }

  shopsList.push(name);
  input.value = '';
  renderShopList();
  persistShops();   // ← save immediately
}

function deleteShop(index) {
  const name = shopsList[index];
  if (shopsList.length <= 1) {
    showToast('অন্তত একটি শাখা রাখতে হবে!', 'error');
    return;
  }
  if (!confirm(`"${name}" শাখাটি মুছবেন?\nএই শাখার সব গ্রাহক ও ইনভেন্টরি "প্রধান শাখা"-তে চলে যাবে।`)) return;

  shopsList.splice(index, 1);

  // If deleted branch was selected, fall back to first branch
  const saved = localStorage.getItem('selectedShop');
  if (saved === name) {
    localStorage.setItem('selectedShop', shopsList[0]);
    currentShop = shopsList[0];
  }

  renderShopList();
  persistShops();   // ← save immediately
}

async function persistShops() {
  const auth = JSON.parse(sessionStorage.getItem('halkhata_auth') || '{}');
  try {
    const updated = await API('/api/auth/setup', {
      method: 'POST',
      body: JSON.stringify({
        shopName:  auth.shopName  || '',
        ownerName: auth.ownerName || '',
        shops:     [...shopsList]   // always array
      })
    });

    auth.shops     = updated.shops;
    auth.shopName  = updated.shopName;
    auth.ownerName = updated.ownerName;
    sessionStorage.setItem('halkhata_auth', JSON.stringify(auth));

    shopsList = updated.shops;
    populateShopDropdowns();
    showToast('শাখা আপডেট হয়েছে ✅');
  } catch {
    showToast('শাখা সংরক্ষণে সমস্যা হয়েছে', 'error');
  }
}

async function saveSettings() {
  const shopEl  = document.getElementById('setting-shop-name');
  const ownEl   = document.getElementById('setting-owner-name');
  const shopName  = (shopEl?.value  || '').trim();
  const ownerName = (ownEl?.value   || '').trim();

  if (!shopName)  { showToast('দোকানের নাম দিন!',  'error'); shopEl?.focus(); return; }
  if (!ownerName) { showToast('মালিকের নাম দিন!',  'error'); ownEl?.focus();  return; }
  if (!shopsList.length) { showToast('অন্তত একটি শাখা থাকতে হবে!', 'error'); return; }

  try {
    const updated = await API('/api/auth/setup', {
      method: 'POST',
      body:   JSON.stringify({ shopName, ownerName, shops: [...shopsList] })
    });

    // Update session
    const auth = JSON.parse(sessionStorage.getItem('halkhata_auth') || '{}');
    auth.shopName  = updated.shopName;
    auth.ownerName = updated.ownerName;
    auth.shops     = updated.shops;
    sessionStorage.setItem('halkhata_auth', JSON.stringify(auth));

    // Update sidebar
    const sidebarShop = document.getElementById('sidebar-shop-name');
    if (sidebarShop) sidebarShop.textContent = updated.shopName;

    shopsList = updated.shops;
    populateShopDropdowns();
    updateBranchCountBadge();

    // Show inline success
    const feedback = document.getElementById('stg-shop-saved');
    if (feedback) {
      feedback.classList.remove('hidden');
      setTimeout(() => feedback.classList.add('hidden'), 3000);
    }

    // Record last backup time in localStorage
    localStorage.setItem('stg_last_settings_save', new Date().toLocaleString('bn-BD'));

  } catch (e) {
    console.error('saveSettings error:', e);
    showToast('সংরক্ষণে সমস্যা হয়েছে — সার্ভার চেক করুন', 'error');
  }
}

async function changePin() {
  const oldPin     = document.getElementById('old-pin')?.value     || '';
  const newPin     = document.getElementById('new-pin')?.value     || '';
  const confirmPin = document.getElementById('confirm-pin')?.value || '';

  if (!oldPin)              { showToast('পুরানো PIN দিন!',           'error'); return; }
  if (newPin.length !== 4)  { showToast('নতুন PIN ৪ সংখ্যার হতে হবে!', 'error'); return; }
  if (newPin !== confirmPin){ showToast('নতুন PIN দুটি মিলছে না!',    'error'); return; }

  try {
    await API('/api/auth/change-pin', {
      method: 'POST',
      body:   JSON.stringify({ oldPin, newPin })
    });

    document.getElementById('old-pin').value     = '';
    document.getElementById('new-pin').value     = '';
    document.getElementById('confirm-pin').value = '';

    const msg = document.getElementById('pin-match-msg');
    if (msg) { msg.textContent = ''; }
    updatePinRules('', '');

    const feedback = document.getElementById('stg-pin-saved');
    if (feedback) {
      feedback.classList.remove('hidden');
      setTimeout(() => feedback.classList.add('hidden'), 3000);
    }
  } catch (e) {
    showToast('পুরানো PIN ভুল হয়েছে!', 'error');
  }
}

// ─── PIN helpers ──────────────────────────────────────
function togglePinVisibility(inputId, btn) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  if (inp.type === 'password') {
    inp.type = 'text';
    btn.textContent = '🙈';
  } else {
    inp.type = 'password';
    btn.textContent = '👁';
  }
}

function validatePinMatch() {
  const newPin     = document.getElementById('new-pin')?.value     || '';
  const confirmPin = document.getElementById('confirm-pin')?.value || '';
  updatePinRules(newPin, confirmPin);
}

function updatePinRules(newPin, confirmPin) {
  const lenRule   = document.getElementById('pin-rule-len');
  const matchRule = document.getElementById('pin-rule-match');
  const matchMsg  = document.getElementById('pin-match-msg');
  if (!lenRule || !matchRule) return;

  const lenOk   = newPin.length === 4;
  const matchOk = newPin.length > 0 && newPin === confirmPin;

  lenRule.textContent  = lenOk   ? '✅ ঠিক ৪ সংখ্যা'     : '○ ঠিক ৪ সংখ্যা';
  lenRule.className    = `stg-pin-rule ${lenOk   ? 'stg-rule-ok' : ''}`;

  matchRule.textContent = matchOk ? '✅ PIN দুটি মিলছে'   : '○ PIN দুটি মিলছে';
  matchRule.className   = `stg-pin-rule ${matchOk ? 'stg-rule-ok' : ''}`;

  if (matchMsg) {
    if (confirmPin.length > 0 && !matchOk) {
      matchMsg.textContent = 'PIN মিলছে না';
      matchMsg.className   = 'stg-pin-match-msg stg-pin-no-match';
    } else if (matchOk) {
      matchMsg.textContent = '✅ PIN মিলছে';
      matchMsg.className   = 'stg-pin-match-msg stg-pin-ok';
    } else {
      matchMsg.textContent = '';
      matchMsg.className   = 'stg-pin-match-msg';
    }
  }
}

// ─── Branch count badge ───────────────────────────────
function updateBranchCountBadge() {
  const badge = document.getElementById('stg-branch-count');
  if (badge) badge.textContent = `${formatNumber(shopsList.length)} টি শাখা`;
}

// ─── Restore from JSON file ───────────────────────────
function openRestoreDialog() {
  if (!confirm('JSON ব্যাকআপ ফাইল থেকে ডেটা পুনরুদ্ধার করবেন?\nবর্তমান ডেটা প্রতিস্থাপিত হবে।')) return;
  document.getElementById('stg-restore-file')?.click();
}

async function handleRestoreFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const text    = await file.text();
    const backup  = JSON.parse(text);
    if (!backup.customers && !backup.transactions) {
      showToast('ভুল ফাইল ফরম্যাট!', 'error');
      return;
    }
    await API('/api/restore', {
      method: 'POST',
      body:   JSON.stringify({
        customers:    backup.customers    || [],
        transactions: backup.transactions || []
      })
    });
    showToast('ডেটা পুনরুদ্ধার হয়েছে ✅ — পেজ রিলোড হচ্ছে...');
    setTimeout(() => location.reload(), 1500);
  } catch {
    showToast('পুনরুদ্ধার ব্যর্থ হয়েছে', 'error');
  }
  event.target.value = '';
}

async function exportBackup() {
  const link = document.createElement('a');
  link.href = '/api/backup';
  link.download = `halkhata_backup_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  showToast('ব্যাকআপ ডাউনলোড শুরু হয়েছে 💾');
}

async function confirmClearData() {
  if (!confirm('সতর্কতা: সব ডেটা মুছে যাবে! আপনি কি নিশ্চিত?')) return;
  if (!confirm('দ্বিতীয়বার নিশ্চিত করুন — এটি পূর্বাবস্থায় ফেরানো যাবে না!')) return;
  await API('/api/restore', {
    method: 'POST',
    body: JSON.stringify({ customers: [], transactions: [] })
  });
  showToast('সব ডেটা মুছে গেছে');
  loadDashboard();
}

// ─── Voice Input (Bangla) ─────────────────────────────
let recognition = null;
function startVoice() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;

  if (!SR) {
    showToast('আপনার ব্রাউজার ভয়েস ইনপুট সাপোর্ট করে না। Chrome ব্যবহার করুন।', 'error');
    return;
  }

  try {
    recognition = new SR();
    recognition.lang = 'bn-BD';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    $('voice-status').classList.remove('hidden');
    $('voice-status').textContent = '🎤 বলুন... (যেমন: "পাঁচশো টাকা বাকি")';
    document.querySelector('.mic-btn').classList.add('recording');

    recognition.start();

    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      $('voice-status').textContent = `শুনলাম: "${transcript}"`;
      parseVoiceInput(transcript);
    };

    recognition.onerror = function(e) {
      const messages = {
        'not-allowed':  'মাইক্রোফোনের অনুমতি দিন (browser settings)',
        'no-speech':    'কোনো কথা শোনা যায়নি, আবার চেষ্টা করুন',
        'network':      'নেটওয়ার্ক সমস্যা, ইন্টারনেট চেক করুন',
        'aborted':      'ভয়েস ইনপুট বাতিল হয়েছে',
      };
      $('voice-status').textContent = messages[e.error] || `সমস্যা হয়েছে: ${e.error}`;
      document.querySelector('.mic-btn').classList.remove('recording');
    };

    recognition.onend = function() {
      document.querySelector('.mic-btn').classList.remove('recording');
      setTimeout(() => $('voice-status').classList.add('hidden'), 3000);
    };

  } catch (e) {
    showToast('ভয়েস ইনপুট চালু করা যায়নি', 'error');
    document.querySelector('.mic-btn').classList.remove('recording');
  }
}

function parseVoiceInput(text) {
  // Extract amount from Bangla speech
  const numMap = { 'শূন্য':0,'এক':1,'দুই':2,'তিন':3,'চার':4,'পাঁচ':5,'ছয়':6,'সাত':7,'আট':8,'নয়':9,
    'দশ':10,'বিশ':20,'ত্রিশ':30,'চল্লিশ':40,'পঞ্চাশ':50,'ষাট':60,'সত্তর':70,'আশি':80,'নব্বই':90,
    'একশো':100,'দুইশো':200,'তিনশো':300,'চারশো':400,'পাঁচশো':500,'ছয়শো':600,'সাতশো':700,'আটশো':800,'নয়শো':900,
    'এক হাজার':1000,'দুই হাজার':2000,'পাঁচ হাজার':5000,'দশ হাজার':10000 };

  let amount = 0;
  for (const [word, val] of Object.entries(numMap)) {
    if (text.includes(word)) { amount = val; break; }
  }

  // Try to extract Arabic numerals
  const numMatch = text.match(/[\d৯৮৭৬৫৪৩২১০]+/);
  if (numMatch) {
    const converted = numMatch[0].replace(/[০-৯]/g, d => '০১২৩৪৫৬৭৮৯'.indexOf(d));
    amount = parseInt(converted) || amount;
  }

  if (amount > 0) {
    $('t-amount').value = amount;
    showToast(`পরিমাণ: ৳${amount} সেট হয়েছে`);
  }

  // Extract note
  $('t-note').value = text;
}

// ─── Print Statement ──────────────────────────────────
function printStatement() {
  if (!currentCustomer) return;
  const printWin = window.open('', '_blank');
  printWin.document.write(`
    <!DOCTYPE html><html lang="bn"><head>
    <meta charset="UTF-8"/>
    <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&family=Tiro+Bangla&display=swap" rel="stylesheet"/>
    <style>
      body { font-family: 'Hind Siliguri', sans-serif; padding: 2rem; color: #222; }
      h1 { font-family: 'Tiro Bangla', serif; color: #1a472a; }
      table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
      th, td { padding: 0.5rem 0.8rem; border: 1px solid #ddd; text-align: left; }
      th { background: #f0f0f0; }
      .header { display: flex; justify-content: space-between; border-bottom: 2px solid #1a472a; padding-bottom: 1rem; margin-bottom: 1rem; }
      .total { font-weight: 700; font-size: 1.2rem; color: #e63946; margin-top: 1rem; }
    </style></head><body>
    <div class="header">
      <div><h1>হালখাতা ডিজিটাল</h1><p>গ্রাহক স্টেটমেন্ট</p></div>
      <div style="text-align:right"><p><strong>${currentCustomer.name}</strong></p>
        <p>${currentCustomer.phone || ''}</p><p>${new Date().toLocaleDateString('bn-BD')}</p></div>
    </div>
    <div id="print-body">লোড হচ্ছে...</div>
    <script>
      fetch('/api/customers/${currentCustomer.id}/transactions')
        .then(r=>r.json()).then(txns=>{
          let html='<table><thead><tr><th>তারিখ</th><th>ধরন</th><th>বিবরণ</th><th>পরিমাণ</th></tr></thead><tbody>';
          txns.forEach(t=>{
            html+='<tr><td>'+new Date(t.date).toLocaleDateString('bn-BD')+'</td>'
              +'<td>'+(t.type==='debit'?'বাকি':'পেমেন্ট')+'</td>'
              +'<td>'+(t.note||'—')+'</td>'
              +'<td style="color:'+(t.type==='debit'?'#e87d28':'#40916c')+'">৳'+t.amount+'</td></tr>';
          });
          html+='</tbody></table>';
          html+='<p class="total">মোট বকেয়া: ৳${currentCustomer.balance || 0}</p>';
          document.getElementById('print-body').innerHTML=html;
          setTimeout(()=>window.print(),500);
        });
    <\/script></body></html>
  `);
}

// ─── Photo Modal ──────────────────────────────────────
function showPhoto(url) {
  $('photo-preview').src = url;
  openModal('modal-photo');
}

// ─── Modal Helpers ────────────────────────────────────
function openModal(id) {
  $(id).classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  $(id).classList.add('hidden');
  document.body.style.overflow = '';

   // Destroy charts when modal closes to free memory
  if (id === 'modal-month-detail') {
    destroyChart('summary-bar');
    destroyChart('daily-line');
    destroyChart('expense-donut');
    destroyChart('payment-donut');
    destroyChart('product-bar');
    destroyChart('top-buyers');
    destroyChart('high-due');
  }
}

// Close modal on overlay click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    closeModal(e.target.id);
  }
});

// Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(m => closeModal(m.id));
  }
});

// ─── Demo Data ────────────────────────────────────────
async function loadDemoData() {
  if (!confirm('ডেমো ডেটা লোড করবেন? বিদ্যমান ডেটা প্রতিস্থাপিত হবে।')) return;
  try {
    await API('/api/seed', { method: 'POST' });
    shopsList = ['প্রধান শাখা', 'শাখা-২'];
    populateShopDropdowns();
    const auth = JSON.parse(sessionStorage.getItem('halkhata_auth') || '{}');
    auth.shops = shopsList;
    sessionStorage.setItem('halkhata_auth', JSON.stringify(auth));
    showToast('ডেমো ডেটা লোড হয়েছে ✅');
    navigate('dashboard');
    loadOverdueBadge();
  } catch (e) {
    showToast('ডেমো ডেটা লোড করতে সমস্যা হয়েছে', 'error');
  }
}

// ─── Offline Support ──────────────────────────────────
function setupOfflineDetection() {
  window.addEventListener('online', async () => {
    isOnline = true;
    updateOnlineStatus();
    hideOfflineCacheIndicator();
    await syncOfflineQueue();
    await refreshMasterDataCache();        // ← refresh master data on reconnect
  });
  window.addEventListener('offline', () => {
    isOnline = false;
    updateOnlineStatus();
  });
  updateOnlineStatus();
}

function updateOnlineStatus() {
  const badge = $('offline-badge');
  const banner = $('sync-banner');
  if (!isOnline) {
    badge.classList.add('show');
    banner.classList.remove('hidden');
  } else {
    badge.classList.remove('show');
    banner.classList.add('hidden');
  }
}

function queueOfflineTxn(body) {
  const queue = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
  queue.push({ ...body, queuedAt: new Date().toISOString() });
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
}

async function syncOfflineQueue() {
  const queue = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
  if (!queue.length) return;
  let synced = 0;
  const failed = [];
  for (const txn of queue) {
    try {
      await API('/api/transactions', { method: 'POST', body: JSON.stringify(txn) });
      synced++;
    } catch {
      failed.push(txn);
    }
  }
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(failed));
  if (synced > 0) {
    showToast(`${synced}টি অফলাইন লেনদেন সিঙ্ক হয়েছে ✅`);
    loadDashboard();
    loadOverdueBadge();
  }
}

// ═══════════════════════════════════════════════════════
// OFFLINE MASTER-DATA CACHE
// ═══════════════════════════════════════════════════════
const CACHE_KEYS = {
  customers:  'offline_customers',
  inventory:  'offline_inventory',
  shops:      'offline_shops'
};

// ─── Write to cache ────────────────────────────────────
function cacheSet(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({
      data,
      cachedAt: Date.now()
    }));
  } catch (e) {
    console.warn('Cache write failed:', key, e);
  }
}

// ─── Read from cache ───────────────────────────────────
function cacheGet(key, maxAgeMs = 24 * 60 * 60 * 1000) {
  try {
    const raw     = localStorage.getItem(key);
    if (!raw) return null;
    const parsed  = JSON.parse(raw);
    const age     = Date.now() - (parsed.cachedAt || 0);
    if (age > maxAgeMs) return null;    // treat stale cache as miss
    return parsed.data;
  } catch {
    return null;
  }
}

// ─── Force-read cache (ignore age) ─────────────────────
function cacheGetForce(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw).data;
  } catch {
    return null;
  }
}

// ─── Fetch customers with offline fallback ─────────────
async function fetchCustomersWithCache(shopFilter) {
  const url = `/api/customers${shopFilter ? `?shop=${encodeURIComponent(shopFilter)}` : ''}`;
  try {
    const customers = await API(url);
    // Cache the full unfiltered list so offline works across shops
    if (!shopFilter) cacheSet(CACHE_KEYS.customers, customers);
    return customers;
  } catch {
    let cached = cacheGetForce(CACHE_KEYS.customers) || [];
    if (shopFilter) cached = cached.filter(c => c.shop === shopFilter);
    if (cached.length) showOfflineCacheIndicator();
    return cached;
  }
}

// ─── Fetch inventory with offline fallback ─────────────
async function fetchInventoryWithCache(shopFilter) {
  const url = `/api/inventory${shopFilter ? `?shop=${encodeURIComponent(shopFilter)}` : ''}`;
  try {
    const items = await API(url);
    if (!shopFilter) cacheSet(CACHE_KEYS.inventory, items);
    return items;
  } catch {
    let cached = cacheGetForce(CACHE_KEYS.inventory) || [];
    if (shopFilter) cached = cached.filter(i => i.shop === shopFilter);
    if (cached.length) showOfflineCacheIndicator();
    return cached;
  }
}

// ─── Refresh cache when back online ────────────────────
async function refreshMasterDataCache() {
  try {
    const [customers, inventory] = await Promise.all([
      API('/api/customers'),
      API('/api/inventory')
    ]);
    cacheSet(CACHE_KEYS.customers, customers);
    cacheSet(CACHE_KEYS.inventory, inventory);
    cacheSet(CACHE_KEYS.shops,     shopsList);
    console.log('✅ Master-data cache refreshed');
  } catch (e) {
    console.warn('Cache refresh failed:', e);
  }
}

// ─── Offline indicator ─────────────────────────────────
let _cacheIndicatorShown = false;
function showOfflineCacheIndicator() {
  if (_cacheIndicatorShown) return;
  _cacheIndicatorShown = true;
  const el = document.getElementById('offline-cache-note');
  if (el) el.style.display = 'flex';
}

function hideOfflineCacheIndicator() {
  _cacheIndicatorShown = false;
  const el = document.getElementById('offline-cache-note');
  if (el) el.style.display = 'none';
}

// ═══════════════════════════════════════════════════════
// SEARCHABLE SELECT COMPONENT
// ═══════════════════════════════════════════════════════

function setupSearchableSelect({
  inputId,        // text input id
  hiddenId,       // hidden value input id
  resultsId,      // results dropdown div id
  clearId,        // clear button id
  items,          // array of data objects
  labelRenderer,  // fn(item) → { main, sub, badge?, badgeCls? }
  searchFields,   // fn(item) → array of strings to search
  onSelect,       // fn(item) called on selection
  isOffline       // bool — show offline note
}) {
  const input   = document.getElementById(inputId);
  const hidden  = document.getElementById(hiddenId);
  const results = document.getElementById(resultsId);
  const clearBtn = clearId ? document.getElementById(clearId) : null;

  if (!input || !hidden || !results) return;

  let filtered    = [];
  let activeIdx   = -1;
  let isOpen      = false;

  // ── Render results list ───────────────────────────────
  function render(list) {
    results.innerHTML = '';

    if (isOffline) {
      const note = document.createElement('div');
      note.className = 'ss-offline-note';
      note.innerHTML = '📴 অফলাইন সংরক্ষিত ডেটা';
      results.appendChild(note);
    }

    if (!list.length) {
      const empty = document.createElement('div');
      empty.className = 'ss-empty';
      empty.textContent = 'কোনো ফলাফল পাওয়া যায়নি';
      results.appendChild(empty);
      return;
    }

    list.forEach((item, i) => {
      const lbl = labelRenderer(item);
      const div = document.createElement('div');
      div.className = 'ss-item';
      div.dataset.idx = i;
      div.innerHTML = `
        <div class="ss-item-main">
          ${lbl.main}
          ${lbl.badge !== undefined
            ? `<span class="ss-item-badge ${lbl.badgeCls || ''}">${lbl.badge}</span>`
            : ''}
        </div>
        ${lbl.sub ? `<div class="ss-item-sub">${lbl.sub}</div>` : ''}`;
      div.addEventListener('mousedown', e => {
        e.preventDefault();   // prevent blur before click
        selectItem(item, lbl.main);
      });
      results.appendChild(div);
    });
  }

  // ── Highlight active row ──────────────────────────────
  function setActive(idx) {
    const rows = results.querySelectorAll('.ss-item');
    rows.forEach(r => r.classList.remove('ss-active'));
    if (idx >= 0 && idx < rows.length) {
      rows[idx].classList.add('ss-active');
      rows[idx].scrollIntoView({ block: 'nearest' });
    }
    activeIdx = idx;
  }

  // ── Open / close ──────────────────────────────────────
  function open() {
    results.classList.add('open');
    isOpen = true;
    activeIdx = -1;
  }

  function close() {
    results.classList.remove('open');
    isOpen = false;
    activeIdx = -1;
  }

  // ── Select item ───────────────────────────────────────
  function selectItem(item, displayText) {
    input.value  = displayText;

    // Robustly set the hidden input value
    const hid = document.getElementById(hiddenId);
    if (hid) {
      hid.value = item.id || item._id || '';

      // Copy all item fields as dataset so downstream logic can read them
      Object.keys(item).forEach(k => {
        hid.dataset[k] = item[k] !== null && item[k] !== undefined ? item[k] : '';
      });
    }

    input.classList.add('ss-selected');
    if (clearBtn) clearBtn.classList.add('visible');
    close();
    if (onSelect) onSelect(item);
  }

  // ── Clear selection ───────────────────────────────────
function clearSelection() {
    input.value  = '';
    input.classList.remove('ss-selected');
    if (clearBtn) clearBtn.classList.remove('visible');

    const hid = document.getElementById(hiddenId);
    if (hid) {
      hid.value = '';
      // Clear all dataset fields
      Object.keys(hid.dataset).forEach(k => delete hid.dataset[k]);
    }

    filtered = [...items];
    render(filtered);
    close();
    if (onSelect) onSelect(null);
  }

  // ── Filter items ──────────────────────────────────────
  function filterItems(query) {
    const q = query.toLowerCase().trim();
    if (!q) return [...items];
    return items.filter(item =>
      searchFields(item).some(f => f && String(f).toLowerCase().includes(q))
    );
  }

  // ── Input events ─────────────────────────────────────
  input.addEventListener('input', () => {
    hidden.value = '';   // clear selection when typing
    input.classList.remove('ss-selected');
    if (clearBtn) {
      if (input.value) clearBtn.classList.add('visible');
      else             clearBtn.classList.remove('visible');
    }
    filtered = filterItems(input.value);
    render(filtered);
    open();
  });

  input.addEventListener('focus', () => {
    filtered = filterItems(input.value);
    render(filtered);
    open();
  });

  input.addEventListener('blur', () => {
    // Slight delay so mousedown on item fires first
    setTimeout(close, 160);
  });

  input.addEventListener('keydown', e => {
    if (!isOpen) return;
    const rows = results.querySelectorAll('.ss-item');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(Math.min(activeIdx + 1, rows.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(Math.max(activeIdx - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0 && filtered[activeIdx]) {
        const lbl = labelRenderer(filtered[activeIdx]);
        selectItem(filtered[activeIdx], lbl.main);
      }
    } else if (e.key === 'Escape') {
      close();
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('mousedown', e => {
      e.preventDefault();
      clearSelection();
    });
  }

  // ── Outside click ─────────────────────────────────────
  document.addEventListener('click', e => {
    const wrap = input.closest('.searchable-select');
    if (wrap && !wrap.contains(e.target)) close();
  });

  // ── Initial render ────────────────────────────────────
  filtered = [...items];

  // ── Public API ────────────────────────────────────────
  return {
    refresh(newItems, offline) {
      items     = newItems;
      filtered  = filterItems(input.value);
      isOffline = !!offline;
      if (isOpen) render(filtered);
    },
    clear: clearSelection,
    setValue(item, displayText) {
      selectItem(item, displayText);
    }
  };
}

// ─── SS instances (created when modal opens) ──────────
let ssCustomer = null;
let ssProduct  = null;

function buildCustomerSS(customers, isOffline) {
  ssCustomer = setupSearchableSelect({
    inputId:       't-customer-search',
    hiddenId:      't-customer',
    resultsId:     't-customer-results',
    clearId:       't-customer-clear',
    items:         customers,
    isOffline,
    searchFields:  c => [c.name, c.phone, c.address],
    labelRenderer: c => {
      const balance = c.balance || 0;
      return {
        main:     c.name,
        sub:      `${c.phone || '—'} · ${c.shop || ''}`,
        badge:    balance > 0 ? `বাকি: ৳${balance}` : null,
        badgeCls: balance > 0 ? 'low' : ''
      };
    },
    onSelect: customer => {
      // No extra action needed — hidden input holds the ID
    }
  });
}

function buildProductSS(items, isOffline) {
  ssProduct = setupSearchableSelect({
    inputId: 't-product-search', hiddenId: 't-product', resultsId: 't-product-results', clearId: 't-product-clear',
    items: items.filter(i => i.totalStock >= 0),
    isOffline,
    searchFields: i => [i.name],
    labelRenderer: i => {
      const cls = i.totalStock===0?'zero':i.totalStock<10?'low':'';
      return { main: i.name, sub: `৳${i.sellPrice} · গড় ক্রয়: ৳${i.avgBuyPrice}`, badge: `স্টক: ${i.totalStock}`, badgeCls: cls };
    },
    onSelect: item => {
      const hid = document.getElementById('t-product');
      if (!item) {
        $('quantity-section').classList.add('hidden');
        $('batch-choice-group').style.display = 'none';
        $('t-quantity').value=''; $('t-amount').value=''; $('stock-error').textContent='';
        return;
      }
      if (hid) {
        hid.dataset.sell = item.sellPrice; hid.dataset.sellPrice = item.sellPrice;
        hid.dataset.stock = item.totalStock; hid.dataset.quantity = item.totalStock;
        hid.dataset.name = item.name; hid.dataset.buyPrice = item.avgBuyPrice;
      }
      $('batch-choice-group').style.display = item.batchCount > 1 ? 'block' : 'none';
      onProductChange();
    }
  });
}

async function toggleBatchChoice() {
  const checked    = $('t-choose-batch').checked;
  const listEl     = $('t-batch-list');
  const productId  = $('t-product')?.value;
  if (!checked || !productId) { listEl.classList.add('hidden'); return; }

  const product = await API(`/api/products/${productId}`);
  const active  = product.batches.filter(b => b.remainingQuantity > 0);

  listEl.innerHTML = active.map(b => `
    <label style="display:flex;align-items:center;gap:0.5rem;padding:0.5rem 0.7rem;
                  background:var(--cream-dark);border-radius:var(--radius-sm);margin-bottom:0.3rem;cursor:pointer">
      <input type="radio" name="t-batch-radio" value="${b.id}"
             onchange="selectBatch('${b.id}', ${b.remainingQuantity}, ${b.buyPrice})" />
      <span>অবশিষ্ট: ${formatNumber(b.remainingQuantity)} · ক্রয়: ৳${b.buyPrice}
        ${b.expiryDate ? `· মেয়াদ: ${formatDateShort(b.expiryDate)}` : ''}</span>
    </label>`).join('');
  listEl.classList.remove('hidden');
}

let selectedBatchId = null;
function selectBatch(batchId, remaining, buyPrice) {
  selectedBatchId = batchId;
  $('t-stock-info').textContent = `নির্বাচিত ব্যাচে স্টক: ${formatNumber(remaining)}`;
}

// ─── Service Worker ───────────────────────────────────
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('Service Worker registered'))
      .catch(e => console.warn('SW registration failed:', e));
  }
}

function toggleLang() {
  const current = localStorage.getItem('lang') || 'bn';
  const next    = current === 'bn' ? 'en' : 'bn';
  localStorage.setItem('lang', next);
  location.reload();
}

function updateLangButton(lang) {
  const label = lang === 'bn' ? '🌐 EN' : '🌐 বাং';
  const btn1 = document.getElementById('lang-toggle');
  const btn2 = document.getElementById('lang-toggle-sidebar');
  if (btn1) btn1.textContent = label;
  if (btn2) btn2.textContent = `🌐 ${lang === 'bn' ? 'EN / বাং' : 'বাং / EN'}`;
}

// ═══════════════════════════════════════════════════════
// INVENTORY
// ═══════════════════════════════════════════════════════
let inventoryData = [];

function getItemStatus(p) {
  const today = new Date(); today.setHours(0,0,0,0);
  if (p.nearestExpiry && new Date(p.nearestExpiry) < today) return 'expired';
  if (p.totalStock < 10) return 'low';
  return 'ok';
}

async function loadInventory() {
  const url = `/api/products${currentShop ? `?shop=${encodeURIComponent(currentShop)}` : ''}`;
  [inventoryData, suppliersData] = await Promise.all([
    API(url),
    API('/api/suppliers')
  ]);
  renderInventory();
}

let expandedProducts = new Set();

function toggleProductExpand(productId) {
  if (expandedProducts.has(productId)) expandedProducts.delete(productId);
  else expandedProducts.add(productId);
  renderInventory();
} 

function renderInventory() {
  const search = (document.getElementById('inv-search')?.value || '').toLowerCase();
  const filter = document.getElementById('inv-filter')?.value || 'all';

  let items = [...inventoryData];
  if (search) items = items.filter(i => i.name.toLowerCase().includes(search));
  if (filter === 'low')     items = items.filter(i => getItemStatus(i) === 'low');
  if (filter === 'expired') items = items.filter(i => getItemStatus(i) === 'expired');

  const totalItems   = inventoryData.length;
  const lowCount     = inventoryData.filter(i => getItemStatus(i) === 'low').length;
  const expiredCount = inventoryData.filter(i => getItemStatus(i) === 'expired').length;
  const totalValue   = inventoryData.reduce((s, i) => s + i.totalValue, 0);

  document.getElementById('inv-summary').innerHTML = `
    <div style="background:#fff;border-radius:var(--radius);padding:0.9rem 1.2rem;box-shadow:var(--elev-1);display:flex;align-items:center;gap:0.75rem;flex:1;min-width:140px">
      <span style="font-size:1.5rem">📦</span>
      <div><div style="font-size:0.78rem;color:var(--ink-light)">মোট পণ্য</div>
           <div style="font-size:1.2rem;font-weight:700">${formatNumber(totalItems)}</div></div>
    </div>
    <div style="background:#fff;border-radius:var(--radius);padding:0.9rem 1.2rem;box-shadow:var(--elev-1);display:flex;align-items:center;gap:0.75rem;flex:1;min-width:140px;border-left:4px solid var(--amber-dark)">
      <span style="font-size:1.5rem">⚠️</span>
      <div><div style="font-size:0.78rem;color:var(--ink-light)">কম স্টক</div>
           <div style="font-size:1.2rem;font-weight:700;color:var(--amber-dark)">${formatNumber(lowCount)}</div></div>
    </div>
    <div style="background:#fff;border-radius:var(--radius);padding:0.9rem 1.2rem;box-shadow:var(--elev-1);display:flex;align-items:center;gap:0.75rem;flex:1;min-width:140px;border-left:4px solid var(--red)">
      <span style="font-size:1.5rem">🚫</span>
      <div><div style="font-size:0.78rem;color:var(--ink-light)">মেয়াদ উত্তীর্ণ</div>
           <div style="font-size:1.2rem;font-weight:700;color:var(--red)">${formatNumber(expiredCount)}</div></div>
    </div>
    <div style="background:#fff;border-radius:var(--radius);padding:0.9rem 1.2rem;box-shadow:var(--elev-1);display:flex;align-items:center;gap:0.75rem;flex:1;min-width:140px;border-left:4px solid var(--green-light)">
      <span style="font-size:1.5rem">💰</span>
      <div><div style="font-size:0.78rem;color:var(--ink-light)">মোট মূল্য</div>
           <div style="font-size:1.2rem;font-weight:700;color:var(--green-dark)">${formatTaka(totalValue)}</div></div>
    </div>
  `;

  const el = document.getElementById('inventory-list');
  if (!items.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">📦</div><p>কোনো পণ্য পাওয়া যায়নি</p></div>';
    return;
  }

  el.innerHTML = items.map(p => {
    const status      = getItemStatus(p);
    const isExpanded   = expandedProducts.has(p.id);
    const statusBadge  = status === 'expired'
      ? `<span class="due-tag due-tag--overdue">🚫 মেয়াদ শেষ</span>`
      : status === 'low'
        ? `<span class="due-tag due-tag--due-soon">⚠️ কম স্টক</span>`
        : `<span class="due-tag" style="background:var(--green-pale);color:var(--green-dark)">✅ ঠিক আছে</span>`;
    const margin = p.sellPrice - p.avgBuyPrice;

    return `
    <div class="inv-product-card">
      <div class="inv-product-main" onclick="toggleProductExpand('${p.id}')">
        <div class="inv-expand-icon">${isExpanded ? '▼' : '▶'}</div>
        <div class="inv-product-info">
          <div class="inv-product-name">${p.name}</div>
          <div class="inv-product-meta">${p.shop || ''} · ${formatNumber(p.batchCount)} ব্যাচ</div>
        </div>
        <div class="inv-product-stat">
          <div class="inv-stat-label">মোট স্টক</div>
          <div class="inv-stat-val" style="color:${p.totalStock<10?'var(--amber-dark)':'var(--ink)'}">${formatNumber(p.totalStock)}</div>
        </div>
        <div class="inv-product-stat">
          <div class="inv-stat-label">গড় ক্রয় মূল্য</div>
          <div class="inv-stat-val">${formatTaka(p.avgBuyPrice)}</div>
        </div>
        <div class="inv-product-stat">
          <div class="inv-stat-label">বিক্রয় মূল্য</div>
          <div class="inv-stat-val">${formatTaka(p.sellPrice)}
            ${margin>0?`<span style="font-size:0.7rem;color:var(--green-light)">+${formatTaka(margin)}</span>`:''}
          </div>
        </div>
        <div class="inv-product-stat">
          <div class="inv-stat-label">মেয়াদ</div>
          <div class="inv-stat-val" style="font-size:0.82rem">${p.nearestExpiry?formatDateShort(p.nearestExpiry):'—'}</div>
        </div>
        <div class="inv-product-stat">${statusBadge}</div>
        <div class="inv-product-actions" onclick="event.stopPropagation()">
          <button onclick="openRestockProduct('${p.id}')" title="স্টক যোগ করুন">➕</button>
          <button onclick="openEditProduct('${p.id}')" title="সম্পাদনা">✏️</button>
          <button onclick="deleteProduct('${p.id}')" title="মুছুন">🗑️</button>
        </div>
      </div>
      ${isExpanded ? renderBatchTable(p) : ''}
    </div>`;
  }).join('');
}

function renderBatchTable(p) {
  if (!p.batches.length) return `<div class="inv-batch-empty">কোনো ব্যাচ নেই</div>`;
  return `
    <div class="inv-batch-wrap">
      <table class="inv-batch-table">
        <thead>
          <tr>
            <th>ব্যাচ</th><th>পরিমাণ</th><th>অবশিষ্ট</th><th>ক্রয় মূল্য</th>
            <th>ক্রয় তারিখ</th><th>মেয়াদ</th><th></th>
          </tr>
        </thead>
        <tbody>
          ${p.batches.map((b, i) => {
            const expired = b.expiryDate && new Date(b.expiryDate) < new Date();
            return `
            <tr style="${b.remainingQuantity===0?'opacity:0.45':''}">
              <td>ব্যাচ ${i+1}</td>
              <td>${formatNumber(b.quantity)}</td>
              <td style="font-weight:700;color:${b.remainingQuantity<5&&b.remainingQuantity>0?'var(--amber-dark)':'inherit'}">${formatNumber(b.remainingQuantity)}</td>
              <td>${formatTaka(b.buyPrice)}</td>
              <td>${b.buyDate?formatDateShort(b.buyDate):'—'}</td>
              <td style="color:${expired?'var(--red)':'inherit'}">${b.expiryDate?formatDateShort(b.expiryDate):'—'}</td>
              <td><button onclick="deleteBatch('${b.id}','${p.id}')" style="background:none;border:none;color:var(--red);cursor:pointer;font-size:0.78rem">🗑️</button></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
}

async function openAddInventory() {
  $('inv-modal-title').textContent = 'নতুন পণ্য / স্টক যোগ করুন';
  $('inv-product-id').value      = '';
  $('inv-name-search').value     = '';
  $('inv-name-hidden').value     = '';
  $('inv-sell-price').value      = '';
  $('inv-quantity').value        = '';
  $('inv-buy-price').value       = '';
  $('inv-buy-date').value        = '';
  $('inv-expiry-date').value     = '';
  $('inv-existing-note').classList.add('hidden');
  $('inv-sellprice-group').style.display = '';

  const shopSel = $('inv-shop');
  shopSel.innerHTML = '';
  shopsList.forEach(s => shopSel.innerHTML += `<option value="${s}">${s}</option>`);
  const saved = localStorage.getItem('selectedShop');
  if (saved) shopSel.value = saved;

  const supSel = $('inv-supplier');
  supSel.innerHTML = '<option value="">সরবরাহকারী বাছুন...</option>';
  suppliersData.forEach(s => supSel.innerHTML += `<option value="${s.id}">${s.name}</option>`);

  setupSearchableSelect({
    inputId: 'inv-name-search', hiddenId: 'inv-name-hidden', resultsId: 'inv-name-results',
    items: inventoryData,
    searchFields: i => [i.name],
    labelRenderer: i => ({ main: i.name, sub: `স্টক: ${i.totalStock} · ৳${i.sellPrice}` }),
    onSelect: item => {
      if (item) {
        $('inv-product-id').value = item.id;
        $('inv-sell-price').value = item.sellPrice;
        $('inv-existing-note').classList.remove('hidden');
        $('inv-sellprice-group').style.display = 'none';
      } else {
        $('inv-product-id').value = '';
        $('inv-existing-note').classList.add('hidden');
        $('inv-sellprice-group').style.display = '';
      }
    }
  });

  openModal('modal-inventory');
}

function openRestockProduct(productId) {
  openAddInventory().then(() => {
    const p = inventoryData.find(x => x.id === productId);
    if (p) {
      $('inv-product-id').value  = p.id;
      $('inv-name-search').value = p.name;
      $('inv-existing-note').classList.remove('hidden');
      $('inv-sellprice-group').style.display = 'none';
      $('inv-modal-title').textContent = `${p.name} — নতুন স্টক যোগ করুন`;
    }
  });
}

async function saveInventoryItem() {
  const productId = $('inv-product-id').value;
  const name       = $('inv-name-search').value.trim();
  const quantity   = $('inv-quantity').value;
  const buyPrice   = $('inv-buy-price').value;

  if (!name)                     return showToast('পণ্যের নাম দিন!', 'error');
  if (!quantity || quantity<=0)  return showToast('পরিমাণ দিন!', 'error');
  if (!buyPrice || buyPrice<=0)  return showToast('ক্রয় মূল্য দিন!', 'error');

  const shop = $('inv-shop').value || localStorage.getItem('selectedShop') || 'প্রধান শাখা';

  try {
    if (productId) {
      // Existing product → add batch
      await API(`/api/products/${productId}/batches`, {
        method: 'POST',
        body: JSON.stringify({
          quantity, buyPrice,
          buyDate: $('inv-buy-date').value || null,
          expiryDate: $('inv-expiry-date').value || null,
          supplierId: $('inv-supplier').value || null,
          autoExpense: $('inv-auto-expense').checked
        })
      });
      showToast('নতুন ব্যাচ যোগ হয়েছে ✅');
    } else {
      const sellPrice = $('inv-sell-price').value;
      if (!sellPrice) return showToast('বিক্রয় মূল্য দিন!', 'error');
      await API('/api/products', {
        method: 'POST',
        body: JSON.stringify({
          name, sellPrice, shop, quantity, buyPrice,
          buyDate: $('inv-buy-date').value || null,
          expiryDate: $('inv-expiry-date').value || null,
          supplierId: $('inv-supplier').value || null,
          autoExpense: $('inv-auto-expense').checked
        })
      });
      showToast('নতুন পণ্য যোগ হয়েছে ✅');
    }
    closeModal('modal-inventory');
    loadInventory();
  } catch (e) {
    showToast(e.message || 'সংরক্ষণে সমস্যা হয়েছে', 'error');
  }
}

function openEditProduct(productId) {
  const p = inventoryData.find(x => x.id === productId);
  if (!p) return;
  $('ep-product-id').value = p.id;
  $('ep-name').value       = p.name;
  $('ep-sell-price').value = p.sellPrice;
  const shopSel = $('ep-shop');
  shopSel.innerHTML = '';
  shopsList.forEach(s => shopSel.innerHTML += `<option value="${s}">${s}</option>`);
  shopSel.value = p.shop;
  openModal('modal-edit-product');
}

async function saveEditProduct() {
  const id = $('ep-product-id').value;
  await API(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ name: $('ep-name').value.trim(), sellPrice: $('ep-sell-price').value, shop: $('ep-shop').value })
  });
  showToast('পণ্য আপডেট হয়েছে ✅');
  closeModal('modal-edit-product');
  loadInventory();
}

async function deleteProduct(productId) {
  const p = inventoryData.find(x => x.id === productId);
  if (!confirm(`"${p?.name}" এবং এর সব ব্যাচ মুছবেন?`)) return;
  await API(`/api/products/${productId}`, { method: 'DELETE' });
  showToast('পণ্য মুছে গেছে');
  loadInventory();
}

async function deleteBatch(batchId, productId) {
  if (!confirm('এই ব্যাচ মুছবেন?')) return;
  await API(`/api/batches/${batchId}`, { method: 'DELETE' });
  showToast('ব্যাচ মুছে গেছে');
  loadInventory();
}

// ═══════════════════════════════════════════════════════
// SUPPLIERS
// ═══════════════════════════════════════════════════════
let suppliersData  = [];
let currentSupplier = null;
let currentSupTxnType = 'debit';

async function loadSuppliers() {
  suppliersData = await API('/api/suppliers');
  const el = document.getElementById('supplier-list');

  if (!suppliersData.length) {
    el.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">🏭</div><p>কোনো সরবরাহকারী নেই</p></div>';
    return;
  }

  el.innerHTML = suppliersData.map(s => `
    <div class="customer-card" onclick="loadSupplierDetail('${s.id}')">
      <div class="customer-card-header">
        <div>
          <div class="customer-name">${s.name}</div>
          <div class="customer-phone">${s.phone || '—'}</div>
        </div>
        <span class="trust-badge ${s.balance > 0 ? 'trust-low' : 'trust-high'}">
          ${s.balance > 0 ? 'বকেয়া আছে' : 'পরিশোধিত'}
        </span>
      </div>
      <div class="customer-balance">
        <span class="balance-label">আমরা দেব</span>
        <span class="balance-amount ${s.balance > 0 ? 'balance-positive' : 'balance-zero'}">${formatTaka(s.balance)}</span>
      </div>
    </div>
  `).join('');
}

async function loadSupplierDetail(id) {
  try {
    const s  = await API(`/api/suppliers/${id}`);
    currentSupplier = s;

document.getElementById('supplier-detail-top').innerHTML = `
      <!-- Supplier identity row -->
      <div style="display:flex;justify-content:space-between;align-items:flex-start;
                  margin-bottom:1.2rem;flex-wrap:wrap;gap:0.75rem">
        <div>
          <div style="font-family:'Tiro Bangla',serif;font-size:1.35rem;
                      color:var(--green-dark);font-weight:700;letter-spacing:-0.01em">
            ${s.name}
          </div>
          <div style="font-size:0.82rem;color:var(--ink-light);margin-top:4px;
                      display:flex;align-items:center;gap:0.5rem">
            ${s.phone ? `<span>📞 ${s.phone}</span>` : ''}
            <span style="font-size:0.7rem;color:var(--border)">|</span>
            <span>🏭 সরবরাহকারী</span>
          </div>
        </div>
        <button class="btn-outline danger" onclick="deleteSupplier('${s.id}')"
                style="font-size:0.82rem;padding:0.42rem 0.85rem">
          🗑️ মুছুন
        </button>
      </div>

      <!-- KPI cards row -->
      <div class="sup-kpi-row">

        <!-- Card 1: Total borrowed -->
        <div class="sup-kpi-card" style="border-top-color:#f4a261">
          <div class="sup-kpi-top">
            <div class="sup-kpi-icon" style="background:rgba(244,162,97,0.12);color:#e07c3a">⬇️</div>
            <span class="sup-kpi-label">মোট ধার নিয়েছি</span>
          </div>
          <div class="sup-kpi-value" style="color:#c96a1a">${formatTaka(s.totalOwed)}</div>
          <div class="sup-kpi-sub">এ পর্যন্ত সরবরাহকারীর কাছ থেকে</div>
        </div>

        <!-- Card 2: Total repaid -->
        <div class="sup-kpi-card" style="border-top-color:var(--green-light)">
          <div class="sup-kpi-top">
            <div class="sup-kpi-icon" style="background:rgba(64,145,108,0.11);color:var(--green-mid)">⬆️</div>
            <span class="sup-kpi-label">মোট পরিশোধ করেছি</span>
          </div>
          <div class="sup-kpi-value" style="color:var(--green-mid)">${formatTaka(s.totalPaid)}</div>
          <div class="sup-kpi-sub">এ পর্যন্ত আমি পরিশোধ করেছি</div>
        </div>

        <!-- Card 3: Current balance -->
        <div class="sup-kpi-card"
             style="border-top-color:${s.balance > 0 ? 'var(--red)' : 'var(--green-light)'}">
          <div class="sup-kpi-top">
            <div class="sup-kpi-icon"
                 style="background:${s.balance > 0 ? 'rgba(230,57,70,0.10)' : 'rgba(64,145,108,0.10)'};
                        color:${s.balance > 0 ? 'var(--red)' : 'var(--green-mid)'}">
              ${s.balance > 0 ? '🔴' : '✅'}
            </div>
            <span class="sup-kpi-label">বর্তমান বাকি</span>
          </div>
          <div class="sup-kpi-value"
               style="color:${s.balance > 0 ? 'var(--red)' : 'var(--green-mid)'}">
            ${formatTaka(s.balance)}
          </div>
          <div class="sup-kpi-sub">
            ${s.balance > 0 ? 'এখনো পরিশোধ বাকি আছে' : 'সম্পূর্ণ পরিশোধিত'}
          </div>
        </div>

       </div>`;

    const txns = s.transactions || [];
    const txnEl = document.getElementById('supplier-detail-txns');
    if (!txns.length) {
      txnEl.innerHTML = '<div class="empty-state"><div class="empty-icon">📋</div><p>কোনো লেনদেন নেই</p></div>';
    } else {
      txnEl.innerHTML = txns.map(t => {
        const isDebit  = t.type === 'debit';
        const colorCls = isDebit ? 'txn-debit' : 'txn-credit';
        return `
        <div class="txn-item ${colorCls}" style="margin-bottom:0.5rem">
          <div class="txn-indicator"></div>
          <div class="txn-info">
            <div class="txn-note">${t.note || (isDebit ? 'ধার নেওয়া' : 'পরিশোধ করা')}</div>
            <div class="txn-meta">${formatDate(t.date)}</div>
          </div>
          <div class="txn-amount">${isDebit ? '+' : '-'}${formatTaka(t.amount)}</div>
        </div>`;
      }).join('');
    }

    // Switch to detail page without saving to nav history
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-supplier-detail').classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelector('[data-page="suppliers"]')?.classList.add('active');
  } catch {
    showToast('লোড করতে সমস্যা হয়েছে', 'error');
  }
}

function openAddSupplier() {
  $('sup-name').value  = '';
  $('sup-phone').value = '';
  openModal('modal-supplier');
}

async function saveSupplier() {
  const name = $('sup-name').value.trim();
  if (!name) return showToast('নাম দিন!', 'error');
  try {
    await API('/api/suppliers', {
      method: 'POST',
      body: JSON.stringify({ name, phone: $('sup-phone').value.trim() })
    });
    showToast('সরবরাহকারী যোগ হয়েছে ✅');
    closeModal('modal-supplier');
    loadSuppliers();
  } catch {
    showToast('সংরক্ষণে সমস্যা হয়েছে', 'error');
  }
}

async function deleteSupplier(id) {
  if (!confirm('এই সরবরাহকারী এবং সব লেনদেন মুছবেন?')) return;
  await API(`/api/suppliers/${id}`, { method: 'DELETE' });
  showToast('মুছে গেছে');
  navigate('suppliers');
}

function openAddSupplierTxn() {
  if (!currentSupplier) return;
  $('sup-txn-supplier-id').value = currentSupplier.id;
  $('sup-txn-amount').value      = '';
  $('sup-txn-note').value        = '';
  setSupTxnType('debit');
  openModal('modal-supplier-txn');
}

function setSupTxnType(type) {
  currentSupTxnType = type;
  $('sup-type-debit') .classList.toggle('active', type === 'debit');
  $('sup-type-credit').classList.toggle('active', type === 'credit');
}

async function saveSupplierTxn() {
  const amount = $('sup-txn-amount').value;
  if (!amount || parseFloat(amount) <= 0) return showToast('পরিমাণ দিন!', 'error');
  try {
    await API('/api/supplier-transactions', {
      method: 'POST',
      body: JSON.stringify({
        supplierId: $('sup-txn-supplier-id').value,
        type:   currentSupTxnType,
        amount: parseFloat(amount),
        note:   $('sup-txn-note').value.trim(),
        paymentMethod: $('sup-txn-method').value || null
      })
    });
    showToast(currentSupTxnType === 'debit' ? 'ধার রেকর্ড হয়েছে ✅' : 'পেমেন্ট রেকর্ড হয়েছে ✅');
    closeModal('modal-supplier-txn');
    loadSupplierDetail(currentSupplier.id);
  } catch {
    showToast('রেকর্ড করতে সমস্যা হয়েছে', 'error');
  }
}

// ═══════════════════════════════════════════════════════
// EXPENSES
// ═══════════════════════════════════════════════════════
const EXPENSE_ICONS = {
  Transportation:     '🚗', 'Supplier Purchase': '📦',
  Salary:             '👷', Electricity:         '💡',
  Rent:               '🏠', Internet:            '📶',
  Repair:             '🔧', Tax:                 '🏛️',
  Packaging:          '📫', Misc:                '🧾'
};

const EXPENSE_LABELS_BN = {
  Transportation:     'পরিবহন',   'Supplier Purchase': 'পণ্য ক্রয়',
  Salary:             'বেতন',      Electricity:         'বিদ্যুৎ',
  Rent:               'ভাড়া',     Internet:            'ইন্টারনেট',
  Repair:             'মেরামত',    Tax:                 'কর',
  Packaging:          'প্যাকেজিং', Misc:                'অন্যান্য'
};

let expensesData = [];

async function loadExpenses() {
  const category = document.getElementById('exp-filter-category')?.value || '';
  const date     = document.getElementById('exp-filter-date')?.value     || '';
  const params   = new URLSearchParams();
  if (currentShop) params.set('shop',     currentShop);
  if (category)    params.set('category', category);
  if (date)        params.set('date',     date);

  expensesData = await API(`/api/expenses?${params}`);
  renderExpenses();
}

function renderExpenses() {
  // ── Summary cards ─────────────────────────────────────
  const total      = expensesData.reduce((s, e) => s + e.amount, 0);
  const thisMonth  = expensesData.filter(e => {
    const d = new Date(e.date);
    const n = new Date();
    return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
  }).reduce((s, e) => s + e.amount, 0);

  const topCat = Object.entries(
    expensesData.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc; }, {})
  ).sort((a, b) => b[1] - a[1])[0];

  document.getElementById('expense-summary').innerHTML = `
    <div style="background:#fff;border-radius:var(--radius);padding:0.9rem 1.2rem;
                box-shadow:0 2px 8px var(--shadow);display:flex;align-items:center;
                gap:0.75rem;flex:1;min-width:160px;border-left:4px solid var(--red)">
      <span style="font-size:1.5rem">🧾</span>
      <div><div style="font-size:0.78rem;color:var(--ink-light)">মোট খরচ</div>
           <div style="font-size:1.2rem;font-weight:700;color:var(--red)">${formatTaka(total)}</div></div>
    </div>
    <div style="background:#fff;border-radius:var(--radius);padding:0.9rem 1.2rem;
                box-shadow:0 2px 8px var(--shadow);display:flex;align-items:center;
                gap:0.75rem;flex:1;min-width:160px;border-left:4px solid var(--amber-dark)">
      <span style="font-size:1.5rem">📅</span>
      <div><div style="font-size:0.78rem;color:var(--ink-light)">এই মাসে</div>
           <div style="font-size:1.2rem;font-weight:700;color:var(--amber-dark)">${formatTaka(thisMonth)}</div></div>
    </div>
    <div style="background:#fff;border-radius:var(--radius);padding:0.9rem 1.2rem;
                box-shadow:0 2px 8px var(--shadow);display:flex;align-items:center;
                gap:0.75rem;flex:1;min-width:160px;border-left:4px solid var(--green-light)">
      <span style="font-size:1.5rem">${topCat ? EXPENSE_ICONS[topCat[0]] || '🧾' : '—'}</span>
      <div><div style="font-size:0.78rem;color:var(--ink-light)">সর্বোচ্চ ক্যাটাগরি</div>
           <div style="font-size:1rem;font-weight:700">${topCat ? (EXPENSE_LABELS_BN[topCat[0]] || topCat[0]) : '—'}</div></div>
    </div>
  `;

  // ── Category breakdown ────────────────────────────────
  const byCategory = expensesData.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});
  const bdEl = document.getElementById('expense-category-breakdown');
  if (Object.keys(byCategory).length) {
    bdEl.style.display = 'block';
    bdEl.innerHTML = `
      <div style="font-weight:600;color:var(--green-dark);margin-bottom:0.75rem;
                  font-family:'Tiro Bangla',serif">ক্যাটাগরি অনুযায়ী</div>
      <div style="display:flex;flex-wrap:wrap;gap:0.5rem">
        ${Object.entries(byCategory).sort((a,b) => b[1]-a[1]).map(([cat, amt]) => `
          <div style="background:var(--cream-dark);border-radius:var(--radius-sm);
                      padding:0.4rem 0.75rem;font-size:0.82rem;display:flex;gap:0.4rem;align-items:center">
            <span>${EXPENSE_ICONS[cat] || '🧾'}</span>
            <span>${EXPENSE_LABELS_BN[cat] || cat}</span>
            <strong>${formatTaka(amt)}</strong>
          </div>`).join('')}
      </div>`;
  } else {
    bdEl.style.display = 'none';
  }

  // ── List ──────────────────────────────────────────────
  const el = document.getElementById('expense-list');
  if (!expensesData.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">🧾</div><p>কোনো খরচ নেই</p></div>';
    return;
  }

  el.innerHTML = expensesData.map(e => `
    <div style="background:#fff;border-radius:var(--radius);padding:1rem 1.2rem;
                margin-bottom:0.6rem;display:flex;align-items:center;gap:1rem;
                box-shadow:0 1px 6px var(--shadow);border-left:4px solid var(--red)">
      <div style="font-size:1.6rem">${EXPENSE_ICONS[e.category] || '🧾'}</div>
      <div style="flex:1">
        <div style="font-weight:600;color:var(--ink)">${e.title}</div>
        <div style="font-size:0.78rem;color:var(--ink-light);margin-top:2px">
          ${EXPENSE_LABELS_BN[e.category] || e.category} • ${formatDateShort(e.date)} • ${e.shop || ''}
        </div>
        ${e.note ? `<div style="font-size:0.78rem;color:var(--ink-light)">${e.note}</div>` : ''}
      </div>
      ${e.receiptPhoto
        ? `<img src="${e.receiptPhoto}" class="txn-photo-thumb"
               onclick="showPhoto('${e.receiptPhoto}')" />`
        : ''}
      <div style="text-align:right">
        <div style="font-size:1.05rem;font-weight:700;color:var(--red)">${formatTaka(e.amount)}</div>
        <div style="display:flex;gap:0.3rem;margin-top:0.4rem;justify-content:flex-end">
          <button onclick="openEditExpense('${e.id}')"
            style="background:none;border:1px solid var(--border);border-radius:4px;
                   padding:2px 7px;cursor:pointer;font-size:0.78rem">✏️</button>
          <button onclick="deleteExpense('${e.id}')"
            style="background:none;border:1px solid var(--red);border-radius:4px;
                   padding:2px 7px;cursor:pointer;font-size:0.78rem;color:var(--red)">🗑️</button>
        </div>
      </div>
    </div>
  `).join('');
}

function clearExpenseFilters() {
  document.getElementById('exp-filter-category').value = '';
  document.getElementById('exp-filter-date').value     = '';
  loadExpenses();
}

function openAddExpense(prefill = {}) {
  $('expense-modal-title').textContent = 'নতুন খরচ যোগ করুন';
  $('exp-id').value       = '';
  $('exp-title').value    = prefill.title    || '';
  $('exp-category').value = prefill.category || 'Misc';
  $('exp-amount').value   = prefill.amount   || '';
  $('exp-note').value     = prefill.note     || '';
  $('exp-date').value     = new Date().toISOString().split('T')[0];
  $('exp-photo').value    = '';

  const shopSel = $('exp-shop');
  shopSel.innerHTML = '';
  shopsList.forEach(s => shopSel.innerHTML += `<option value="${s}">${s}</option>`);
  const saved = localStorage.getItem('selectedShop');
  if (saved) shopSel.value = saved;

  openModal('modal-expense');
}

function openEditExpense(id) {
  const e = expensesData.find(x => x.id === id);
  if (!e) return;
  $('expense-modal-title').textContent = 'খরচ সম্পাদনা করুন';
  $('exp-id').value       = e.id;
  $('exp-title').value    = e.title;
  $('exp-category').value = e.category;
  $('exp-amount').value   = e.amount;
  $('exp-note').value     = e.note || '';
  $('exp-date').value     = e.date.split('T')[0];

  const shopSel = $('exp-shop');
  shopSel.innerHTML = '';
  shopsList.forEach(s => shopSel.innerHTML += `<option value="${s}">${s}</option>`);
  shopSel.value = e.shop || '';

  openModal('modal-expense');
}

async function saveExpense() {
  const title  = $('exp-title').value.trim();
  const amount = $('exp-amount').value;
  if (!title)                    return showToast('শিরোনাম দিন!',  'error');
  if (!amount || amount <= 0)    return showToast('পরিমাণ দিন!',  'error');

  const body = {
    title, amount,
    category: $('exp-category').value,
    shop:     $('exp-shop').value || localStorage.getItem('selectedShop') || 'প্রধান শাখা',
    note:     $('exp-note').value.trim(),
    date:     $('exp-date').value || new Date().toISOString().split('T')[0],
    paymentMethod: $('exp-method').value || null
  };

  try {
    const id = $('exp-id').value;
    let saved;
    if (id) {
      saved = await API(`/api/expenses/${id}`, { method: 'PUT', body: JSON.stringify(body) });
      showToast('খরচ আপডেট হয়েছে ✅');
    } else {
      saved = await API('/api/expenses', { method: 'POST', body: JSON.stringify(body) });
      showToast('খরচ যোগ হয়েছে ✅');
    }

    // Upload photo if provided
    const photoFile = $('exp-photo').files[0];
    if (photoFile && saved.id) {
      const fd = new FormData();
      fd.append('photo', photoFile);
      await fetch(`/api/expenses/${saved.id}/photo`, { method: 'POST', body: fd });
    }

    closeModal('modal-expense');
    loadExpenses();
  } catch {
    showToast('সংরক্ষণে সমস্যা হয়েছে', 'error');
  }
}

async function deleteExpense(id) {
  if (!confirm('এই খরচ মুছবেন?')) return;
  await API(`/api/expenses/${id}`, { method: 'DELETE' });
  showToast('মুছে গেছে');
  loadExpenses();
}