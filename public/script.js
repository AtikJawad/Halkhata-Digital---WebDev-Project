/* ═══════════════════════════════════════════════════════
   হালখাতা ডিজিটাল — Main Script
   All features: Auth, Customers, Transactions, Dashboard,
   Voice Input, Offline Sync, Reports, Reminders, etc.
═══════════════════════════════════════════════════════ */
// ─── Translation System ───────────────────────────────
const translations = {
  bn: {
    // Navigation
    login:          'লগইন',
    addCustomer:    'নতুন গ্রাহক',
    addTransaction: 'লেনদেন যোগ করুন',
    dashboard:      'ড্যাশবোর্ড',
    customers:      'খদ্দের',
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
    dueSoon:        'শীঘ্রই দেয়',
    // Stats
    totalReceivable:'মোট পাওনা',
    totalPaid:      'মোট আদায়',
    overdueAmount:  'মেয়াদ উত্তীর্ণ',
    totalCustomers: 'মোট খদ্দের',
    // Quick actions
    quickAddCustomer:    'নতুন খদ্দের যোগ করুন',
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
    totalPaid:      'Total Paid',
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
    window.location.href = '/login';
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
}

async function logout() {
  await fetch('/api/logout', { method: 'POST' });
  sessionStorage.removeItem('halkhata_auth');
  window.location.href = '/login';
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
      window.location.href = '/login';
    }
  } catch {
    window.location.href = '/login';
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
    case 'dashboard':    loadDashboard(); break;
    case 'customers':    loadCustomers(); break;
    case 'transactions': loadTransactions(); break;
    case 'overdue':      loadOverdue(); break;
    case 'report':       loadReport(); break;
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
// ─── Dashboard ────────────────────────────────────────
async function loadDashboard() {
  try {
    const url = `/api/dashboard${currentShop ? `?shop=${encodeURIComponent(currentShop)}` : ''}`;
    const data = await API(url);
    $('stat-receivable').textContent = formatTaka(data.totalReceivable);
$('stat-paid').textContent       = formatTaka(data.totalPaid);
$('stat-overdue').textContent    = formatTaka(data.overdueAmount);
$('stat-customers').textContent  = formatNumber(data.totalCustomers);

    const recentEl = $('recent-transactions');
    if (!data.recentTransactions.length) {
      recentEl.innerHTML = '<div class="empty-state"><div class="empty-icon">📋</div><p>এখনো কোনো লেনদেন নেই</p></div>';
      return;
    }
    recentEl.innerHTML = data.recentTransactions.map(t => txnItemHTML(t, true)).join('');
  } catch (e) {
    console.error('Dashboard load error:', e);
  }
}

// ─── Customers ────────────────────────────────────────
async function loadCustomers() {
  const search = $('customer-search')?.value || '';
  const url = `/api/customers?search=${encodeURIComponent(search)}${currentShop ? `&shop=${encodeURIComponent(currentShop)}` : ''}`;
  const [customers, allTxns] = await Promise.all([
    API(url),
    API('/api/transactions')
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
    el.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">👥</div><p>কোনো খদ্দের পাওয়া যায়নি</p></div>';
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
  $('customer-modal-title').textContent = 'নতুন খদ্দের যোগ করুন';
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
      showToast('খদ্দেরের তথ্য আপডেট হয়েছে');
    } else {
      await API('/api/customers', { method: 'POST', body: JSON.stringify(body) });
      showToast('নতুন খদ্দের যোগ হয়েছে ✅');
    }
    closeModal('modal-customer');
    loadCustomers();
  } catch (e) {
    showToast('সংরক্ষণ করতে সমস্যা হয়েছে', 'error');
  }
}

async function openCustomerDetail(id) {
  try {
    const c = await API(`/api/customers/${id}`);
    currentCustomer = c;
    $('detail-name').textContent    = c.name;
    $('detail-phone').textContent   = `📞 ${c.phone || '—'}`;
    $('detail-address').textContent = `📍 ${c.address || '—'}`;
    $('detail-shop').textContent    = `🏪 ${c.shop || '—'}`;
    $('detail-balance').textContent = formatTaka(c.balance || 0);

    const trust = c.trustScore || 0;
    $('detail-trust-val').textContent = trust;
    $('detail-trust-ring').setAttribute('stroke-dasharray', `${trust}, 100`);
    const ring = $('detail-trust-ring');
    ring.style.stroke = trust >= 70 ? 'var(--green-light)' : trust >= 40 ? 'var(--amber-dark)' : 'var(--red)';

    const txns = await API(`/api/customers/${id}/transactions`);
    const detailEl = $('detail-transactions');
    if (!txns.length) {
      detailEl.innerHTML = '<div class="empty-state"><div class="empty-icon">📋</div><p>কোনো লেনদেন নেই</p></div>';
    } else {
      detailEl.innerHTML = txns.map(t => txnItemHTML({ ...t, customerName: c.name }, false)).join('');
    }
    openModal('modal-customer-detail');
  } catch (e) {
    showToast('লোড করতে সমস্যা হয়েছে', 'error');
  }
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
  showToast('খদ্দের মুছে গেছে');
  closeModal('modal-customer-detail');
  loadCustomers();
}

// ─── Transactions ─────────────────────────────────────
async function loadTransactions() {
  const dateFilter = $('txn-date-filter')?.value || '';
  let url = '/api/transactions';
  const params = [];
  if (dateFilter) params.push(`date=${dateFilter}`);
  if (currentShop) params.push(`shop=${encodeURIComponent(currentShop)}`);
  if (params.length) url += '?' + params.join('&');

  const txns = await API(url);
  const el = $('transaction-timeline');
  if (!txns.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">💰</div><p>কোনো লেনদেন পাওয়া যায়নি</p></div>';
    return;
  }

  const grouped = groupByDate(txns, 'date');
  el.innerHTML = Object.entries(grouped).map(([date, items]) => `
    <div class="timeline-group">
      <div class="timeline-date-header">${date}</div>
      ${items.map(t => txnItemHTML(t, true)).join('')}
    </div>
  `).join('');
}

function clearTxnFilter() {
  $('txn-date-filter').value = '';
  loadTransactions();
}

// ─── Add Transaction Modal ────────────────────────────
async function openAddTransaction(preselectedCustomerId = null) {
  setTxnType('debit');
  $('t-amount').value = '';
  $('t-note').value = '';
  $('t-duedate').value = '';
  $('t-photo').value = '';

  // Populate customer dropdown
  const customers = await API('/api/customers');
  const sel = $('t-customer');
  sel.innerHTML = '<option value="">খদ্দের বাছুন...</option>';
  customers.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.name} — ${c.phone || ''}`;
    if (c.id === preselectedCustomerId) opt.selected = true;
    sel.appendChild(opt);
  });

  openModal('modal-transaction');
}

function setTxnType(type) {
  currentTxnType = type;
  $('type-debit').classList.toggle('active', type === 'debit');
  $('type-credit').classList.toggle('active', type === 'credit');
  $('due-date-group').style.display = type === 'debit' ? 'block' : 'none';
}

async function saveTransaction() {
  const customerId = $('t-customer').value;
  const amount     = $('t-amount').value;
  if (!customerId) return showToast('খদ্দের বাছুন!', 'error');
  if (!amount || parseFloat(amount) <= 0) return showToast('পরিমাণ দিন!', 'error');

  const selectedShop = localStorage.getItem('selectedShop') || 'প্রধান শাখা';
  console.log('Saving transaction to shop:', selectedShop);

  const body = {
  customerId, type: currentTxnType,
  amount: parseFloat(amount),
  note: $('t-note').value.trim(),
  dueDate: $('t-duedate').value || null,
  shop: selectedShop
  };

  let txnId = null;
  try {
    if (!isOnline) {
      queueOfflineTxn(body);
      showToast('অফলাইন — পরে সিঙ্ক হবে 📶', 'success');
      closeModal('modal-transaction');
      return;
    }
    const txn = await API('/api/transactions', { method: 'POST', body: JSON.stringify(body) });
    txnId = txn.id;

    // Upload photo if any
    const photoFile = $('t-photo').files[0];
    if (photoFile && txnId) {
      const fd = new FormData();
      fd.append('photo', photoFile);
      await fetch(`/api/transactions/${txnId}/photo`, { method: 'POST', body: fd });
    }

    showToast(currentTxnType === 'debit' ? 'বাকি রেকর্ড হয়েছে ✅' : 'পেমেন্ট রেকর্ড হয়েছে ✅');
    closeModal('modal-transaction');
    if (currentPage === 'dashboard') loadDashboard();
    else if (currentPage === 'transactions') loadTransactions();
    loadOverdueBadge();
  } catch (e) {
    showToast('লেনদেন সংরক্ষণে সমস্যা হয়েছে', 'error');
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

  const year = yearSel.value || new Date().getFullYear();
  const url = `/api/report/monthly?year=${year}${currentShop ? `&shop=${encodeURIComponent(currentShop)}` : ''}`;
  const data = await API(url);

  // Draw bar chart
  const maxVal = Math.max(...data.months.flatMap(m => [m.totalDebit, m.totalCredit]), 1);
  const chartHTML = `
    <div style="margin-bottom:0.5rem;display:flex;gap:1rem;font-size:0.8rem">
      <span><span style="display:inline-block;width:12px;height:12px;background:var(--amber-dark);border-radius:2px;margin-right:4px"></span>বাকি দেওয়া</span>
      <span><span style="display:inline-block;width:12px;height:12px;background:var(--green-light);border-radius:2px;margin-right:4px"></span>টাকা পাওয়া</span>
    </div>
    <div class="bar-chart">
      ${data.months.map(m => {
        const dh = Math.round((m.totalDebit / maxVal) * 140);
        const ch = Math.round((m.totalCredit / maxVal) * 140);
        return `
        <div class="bar-group">
          <div class="bar-wrap">
            <div class="bar bar-debit" style="height:${dh}px" title="${m.monthName}: ${formatTaka(m.totalDebit)}"></div>
            <div class="bar bar-credit" style="height:${ch}px" title="${m.monthName}: ${formatTaka(m.totalCredit)}"></div>
          </div>
          <div class="bar-month-label">${m.monthName.substring(0,3)}</div>
        </div>`;
      }).join('')}
    </div>
  `;
  $('report-chart').innerHTML = chartHTML;

  // Table
  const totalDebit  = data.months.reduce((s, m) => s + m.totalDebit, 0);
  const totalCredit = data.months.reduce((s, m) => s + m.totalCredit, 0);
  const tableHTML = `
    <table class="report-table">
      <thead>
        <tr>
          <th>${t('reportMonth')}</th>
          <th>${t('reportDebit')}</th>
          <th>${t('reportCredit')}</th>
          <th>${t('reportNet')}</th>
          <th>${t('reportTxnCount')}</th>
        </tr>
      </thead>
      <tbody>
        ${data.months.map(m => {
          const net = m.totalCredit - m.totalDebit;
          const netClass = net >= 0 ? 'net-positive' : 'net-negative';
          return `<tr>
            <td>${m.monthName}</td>
            <td style="color:var(--amber-dark)">${formatTaka(m.totalDebit)}</td>
            <td style="color:var(--green-light)">${formatTaka(m.totalCredit)}</td>
            <td class="${netClass}">${net >= 0 ? '+' : ''}${formatTaka(net)}</td>
            <td>${formatNumber(m.transactionCount)}</td>
          </tr>`;
        }).join('')}
      </tbody>
      <tfoot>
        <tr style="font-weight:700;background:var(--cream-dark)">
          <td>${t('reportTotal')}</td>
          <td>${formatTaka(totalDebit)}</td>
          <td>${formatTaka(totalCredit)}</td>
          <td class="${totalCredit - totalDebit >= 0 ? 'net-positive' : 'net-negative'}">${formatTaka(totalCredit - totalDebit)}</td>
          <td></td>
        </tr>
      </tfoot>
      </table>`;
  $('report-table').innerHTML = tableHTML;
}

// ─── Settings ─────────────────────────────────────────
async function loadSettings() {
  try {
    const info = await API('/api/auth/info');
    $('setting-shop-name').value  = info.shopName || '';
    $('setting-owner-name').value = info.ownerName || '';
    shopsList = info.shops || [];
    renderShopList();
  } catch {}
}
function renderShopList() {
  const el = document.getElementById('shop-list');
  if (!el) return;
  if (!shopsList.length) {
    el.innerHTML = '<p style="font-size:0.82rem;color:var(--ink-light)">কোনো শাখা নেই</p>';
    return;
  }
  el.innerHTML = shopsList.map((s, i) => `
    <div style="display:flex;align-items:center;justify-content:space-between;
                padding:0.5rem 0.75rem;margin-bottom:0.4rem;background:var(--cream-dark);
                border:1px solid var(--border);border-radius:var(--radius-sm)">
      <span style="font-size:0.92rem">${s}</span>
      <button onclick="deleteShop(${i})"
        style="background:none;border:none;cursor:pointer;font-size:1rem;
               color:var(--red);padding:0 0.2rem;line-height:1"
        title="মুছুন">❌</button>
    </div>
  `).join('');
}

function addShop() {
  const input = document.getElementById('new-shop-input');
  const errEl = document.getElementById('shop-error');
  const name  = input.value.trim();

  errEl.textContent = '';
  if (!name) { errEl.textContent = 'শাখার নাম দিন'; return; }
  if (shopsList.includes(name)) { errEl.textContent = 'এই শাখা ইতিমধ্যে আছে'; return; }

  shopsList.push(name);
  input.value = '';
  renderShopList();
}

function deleteShop(index) {
  const name = shopsList[index];
  if (!confirm(`"${name}" শাখাটি মুছবেন?`)) return;
  shopsList.splice(index, 1);
  renderShopList();
}

async function saveSettings() {
  const shopName  = $('setting-shop-name').value.trim();
  const ownerName = $('setting-owner-name').value.trim();
  const shops = [...shopsList];
  if (!shops.length) { showToast('অন্তত একটি শাখা থাকতে হবে!', 'error'); return; }

  await API('/api/auth/setup', {
    method: 'POST',
    body: JSON.stringify({ shopName, ownerName, shops })
  });

  shopsList = shops;
  $('sidebar-shop-name').textContent = shopName;
  populateShopDropdowns();
  const gf = $('global-shop-filter');
  gf.innerHTML = '<option value="">সব শাখা</option>';
  shops.forEach(s => gf.innerHTML += `<option value="${s}">${s}</option>`);

  const auth = JSON.parse(sessionStorage.getItem('halkhata_auth') || '{}');
  auth.shopName = shopName;
  auth.shops = shops;
  sessionStorage.setItem('halkhata_auth', JSON.stringify(auth));

  showToast('সেটিংস সংরক্ষিত হয়েছে ✅');
}

async function changePin() {
  const oldPin = $('old-pin').value;
  const newPin = $('new-pin').value;
  if (newPin.length !== 4) return showToast('নতুন PIN ৪ সংখ্যার হতে হবে!', 'error');
  try {
    await API('/api/auth/change-pin', {
      method: 'POST',
      body: JSON.stringify({ oldPin, newPin })
    });
    $('old-pin').value = '';
    $('new-pin').value = '';
    showToast('PIN পরিবর্তন হয়েছে ✅');
  } catch {
    showToast('পুরানো PIN ভুল!', 'error');
  }
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
      <div><h1>হালখাতা ডিজিটাল</h1><p>খদ্দের স্টেটমেন্ট</p></div>
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
  window.addEventListener('online',  () => { isOnline = true;  updateOnlineStatus(); syncOfflineQueue(); });
  window.addEventListener('offline', () => { isOnline = false; updateOnlineStatus(); });
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
