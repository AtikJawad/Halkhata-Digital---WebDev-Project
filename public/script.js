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
// ─── Dashboard ────────────────────────────────────────
async function loadDashboard() {
  try {
    const url = `/api/dashboard${currentShop ? `?shop=${encodeURIComponent(currentShop)}` : ''}`;
    const data = await API(url);
    $('stat-receivable').textContent = formatTaka(data.totalReceivable);
    $('stat-paid').textContent       = formatTaka(data.totalPaid);
    $('stat-overdue').textContent    = formatTaka(data.overdueAmount);
    $('stat-customers').textContent  = formatNumber(data.totalCustomers);
    
     // Wallet summary
    const walletEl = $('wallet-summary');
    if (data.accounts && walletEl) {
      const ICONS = { cash:'💵', bkash:'📱', nagad:'🟠', rocket:'🚀', bank:'🏦' };
      walletEl.innerHTML = data.accounts.map(a => `
        <div class="wallet-card">
          <span class="wallet-icon">${ICONS[a.id] || '💰'}</span>
          <div>
            <div class="wallet-name">${a.name}</div>
            <div class="wallet-bal ${a.balance < 0 ? 'wallet-neg' : ''}">${formatTaka(a.balance)}</div>
          </div>
        </div>
      `).join('');
    }

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
  // Reset mode
  setTxnMode('sale');
  setPaymentMode('cash');

  $('t-amount').value       = '';
  $('t-repay-amount').value = '';
  $('t-note').value         = '';
  $('t-duedate').value      = '';
  $('t-photo').value        = '';
  $('t-product').value      = '';
  $('t-quantity').value     = '';
  $('stock-error').textContent  = '';
  $('t-stock-info').textContent = '';
  $('quantity-section').classList.add('hidden');

  // Reset payment method dropdowns
  if ($('t-sale-method'))  $('t-sale-method').value  = '';
  if ($('t-repay-method')) $('t-repay-method').value = '';
  

  // Customers
  const customers = await API('/api/customers');
  const sel = $('t-customer');
  sel.innerHTML = '<option value="">খদ্দের বাছুন...</option>';
  customers.forEach(c => {
    const opt = document.createElement('option');
    opt.value       = c.id;
    opt.textContent = `${c.name} — ${c.phone || ''}`;
    if (c.id === preselectedCustomerId) opt.selected = true;
    sel.appendChild(opt);
  });

  await populateProductDropdown();
  openModal('modal-transaction');
}

function onProductChange() {
  const sel     = $('t-product');
  const option  = sel.options[sel.selectedIndex];
  const section = $('quantity-section');
  $('stock-error').textContent  = '';
  $('t-stock-info').textContent = '';
  $('t-quantity').value         = '';
  $('t-amount').value           = '';

  if (!sel.value) {
    section.classList.add('hidden');
    return;
  }

  section.classList.remove('hidden');
  const stock = parseInt(option.dataset.stock) || 0;
  $('t-stock-info').textContent = `স্টক: ${formatNumber(stock)}`;
}

function onQuantityChange() {
  const sel    = $('t-product');
  const option = sel.options[sel.selectedIndex];
  const qty    = parseInt($('t-quantity').value) || 0;
  const errEl  = $('stock-error');
  errEl.textContent = '';

  if (!sel.value || !option.dataset.sell) return;

  const stock     = parseInt(option.dataset.stock)  || 0;
  const sellPrice = parseFloat(option.dataset.sell) || 0;

  if (qty > stock) {
    errEl.textContent   = `পর্যাপ্ত স্টক নেই! মাত্র ${formatNumber(stock)}টি আছে।`;
    $('t-amount').value = '';
    return;
  }

  if (qty > 0) $('t-amount').value = (qty * sellPrice).toFixed(2);
}

async function populateProductDropdown() {
  const shop = localStorage.getItem('selectedShop') || '';
  const url  = `/api/inventory${shop ? `?shop=${encodeURIComponent(shop)}` : ''}`;
  try {
    const items = await API(url);
    const sel   = $('t-product');
    sel.innerHTML = '<option value="">পণ্য বাছুন (ঐচ্ছিক)...</option>';
    items
      .filter(i => i.quantity > 0)
      .forEach(i => {
        const opt = document.createElement('option');
        opt.value           = i.id;
        opt.textContent     = `${i.name} — ৳${i.sellPrice} (স্টক: ${i.quantity})`;
        opt.dataset.sell    = i.sellPrice;
        opt.dataset.stock   = i.quantity;
        opt.dataset.name    = i.name;
        sel.appendChild(opt);
      });
  } catch {}
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
  const customerId = $('t-customer').value;
  if (!customerId) return showToast('খদ্দের বাছুন!', 'error');

  const selectedShop = localStorage.getItem('selectedShop') || 'প্রধান শাখা';

  try {
    if (!isOnline) {
      showToast('অফলাইন — পরে সিঙ্ক হবে 📶');
      closeModal('modal-transaction');
      return;
    }

    // ── PRODUCT SALE ─────────────────────────────────────
    if (currentTxnMode === 'sale') {
      const productSel = $('t-product');
      const productOpt = productSel.options[productSel.selectedIndex];
      const soldQty    = parseInt($('t-quantity').value) || 0;
      const amount     = parseFloat($('t-amount').value);

      if (!productSel.value)         return showToast('পণ্য বাছুন!',         'error');
      if (soldQty <= 0)              return showToast('পরিমাণ দিন!',          'error');
      if (!amount || amount <= 0)    return showToast('মূল্য দিন!',           'error');

      const stock = parseInt(productOpt.dataset.stock) || 0;
      if (soldQty > stock)           return showToast('পর্যাপ্ত স্টক নেই!',  'error');

      await API('/api/sales', {
        method: 'POST',
        body: JSON.stringify({
          customerId,
          inventoryId:  productSel.value,
          soldQuantity: soldQty,
          amount,
          paymentMode:  currentPayMode,
          note:         $('t-note').value.trim() || productOpt.dataset.name,
          paymentMethod: $('t-sale-method').value || null,
          dueDate:      currentPayMode === 'credit' ? ($('t-duedate').value || null) : null,
          shop:         selectedShop
        })
      });

      showToast(currentPayMode === 'cash' ? 'নগদ বিক্রি রেকর্ড হয়েছে ✅' : 'বাকিতে বিক্রি রেকর্ড হয়েছে ✅');
    }

    // ── DEBT REPAYMENT ────────────────────────────────────
    else {
      const amount = parseFloat($('t-repay-amount').value);
      if (!amount || amount <= 0) return showToast('পরিমাণ দিন!', 'error');

      const body = {
        customerId, type: 'credit',
        amount,
        note:  $('t-note').value.trim() || 'বাকি পরিশোধ',
        shop:  selectedShop,
        dueDate: null,
        inventoryId:  null,
        productName:  null,
        paymentMethod: $('t-repay-method').value || null,
        soldQuantity: null
      };
      const txn = await API('/api/transactions', { method: 'POST', body: JSON.stringify(body) });

      const photoFile = $('t-photo').files[0];
      if (photoFile && txn.id) {
        const fd = new FormData();
        fd.append('photo', photoFile);
        await fetch(`/api/transactions/${txn.id}/photo`, { method: 'POST', body: fd });
      }

      showToast('পরিশোধ রেকর্ড হয়েছে ✅');
    }

    closeModal('modal-transaction');
    if (currentPage === 'dashboard')     loadDashboard();
    else if (currentPage === 'transactions') loadTransactions();
    else if (currentPage === 'inventory')    loadInventory();
    loadOverdueBadge();

  } catch (e) {
    showToast('রেকর্ড করতে সমস্যা হয়েছে', 'error');
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
  const totalExpense = data.months.reduce((s, m) => s + m.totalExpense, 0);
  const totalRevenue = data.months.reduce((s, m) => s + m.totalRevenue, 0);
  const totalProfit  = data.months.reduce((s, m) => s + m.profit, 0);

  const tableHTML = `
    <table class="report-table">
      <thead>
        <tr>
          <th>${t('reportMonth')}</th>
          <th style="color:var(--amber-dark)">বাকি দেওয়া</th>
          <th style="color:var(--green-light)">আয় (নগদ+পেমেন্ট)</th>
          <th style="color:var(--red)">খরচ</th>
          <th>লাভ/ক্ষতি</th>
          <th>${t('reportTxnCount')}</th>
        </tr>
      </thead>
      <tbody>
        ${data.months.map(m => {
          const profitClass = m.profit >= 0 ? 'net-positive' : 'net-negative';
          return `<tr>
            <td>${m.monthName}</td>
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
          <td>${formatTaka(data.months.reduce((s,m)=>s+m.totalDebit,0))}</td>
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
  if (!confirm(`"${name}" শাখাটি মুছবেন?\nএই শাখার সব খদ্দের ও ইনভেন্টরি "প্রধান শাখা"-তে চলে যাবে।`)) return;

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
        shops:     [...shopsList]
      })
    });
    // Sync session + dropdowns
    auth.shops = updated.shops;
    sessionStorage.setItem('halkhata_auth', JSON.stringify(auth));
    populateShopDropdowns();
    showToast('শাখা আপডেট হয়েছে ✅');
  } catch {
    showToast('শাখা সংরক্ষণে সমস্যা হয়েছে', 'error');
  }
}

async function saveSettings() {
  const shopName  = $('setting-shop-name').value.trim();
  const ownerName = $('setting-owner-name').value.trim();

  // shops are persisted immediately on add/delete — no need to read them here
  if (!shopsList.length) { showToast('অন্তত একটি শাখা থাকতে হবে!', 'error'); return; }

  try {
    await API('/api/auth/setup', {
      method: 'POST',
      body: JSON.stringify({ shopName, ownerName, shops: [...shopsList] })
    });

    const auth = JSON.parse(sessionStorage.getItem('halkhata_auth') || '{}');
    auth.shopName  = shopName;
    auth.ownerName = ownerName;
    auth.shops     = [...shopsList];
    sessionStorage.setItem('halkhata_auth', JSON.stringify(auth));

    $('sidebar-shop-name').textContent = shopName;
    populateShopDropdowns();
    showToast('সেটিংস সংরক্ষিত হয়েছে ✅');
  } catch {
    showToast('সংরক্ষণে সমস্যা হয়েছে', 'error');
  }
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

// ═══════════════════════════════════════════════════════
// INVENTORY
// ═══════════════════════════════════════════════════════
let inventoryData = [];

function getItemStatus(item) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (item.expiryDate && new Date(item.expiryDate) < today) return 'expired';
  if (item.quantity < 10) return 'low';
  return 'ok';
}

async function loadInventory() {
  const url = `/api/inventory${currentShop ? `?shop=${encodeURIComponent(currentShop)}` : ''}`;
  [inventoryData, suppliersData] = await Promise.all([
    API(url),
    API('/api/suppliers')
  ]);
  renderInventory();
}

function renderInventory() {
  const search    = (document.getElementById('inv-search')?.value || '').toLowerCase();
  const filter    = document.getElementById('inv-filter')?.value || 'all';

  let items = [...inventoryData];
  if (search) items = items.filter(i => i.name.toLowerCase().includes(search));
  if (filter === 'low')     items = items.filter(i => getItemStatus(i) === 'low');
  if (filter === 'expired') items = items.filter(i => getItemStatus(i) === 'expired');

  // Summary bar
  const totalItems   = inventoryData.length;
  const lowCount     = inventoryData.filter(i => getItemStatus(i) === 'low').length;
  const expiredCount = inventoryData.filter(i => getItemStatus(i) === 'expired').length;
  const totalValue   = inventoryData.reduce((s, i) => s + (i.buyPrice * i.quantity), 0);

  document.getElementById('inv-summary').innerHTML = `
    <div style="background:#fff;border-radius:var(--radius);padding:0.9rem 1.2rem;
                box-shadow:0 2px 8px var(--shadow);display:flex;align-items:center;gap:0.75rem;flex:1;min-width:140px">
      <span style="font-size:1.5rem">📦</span>
      <div><div style="font-size:0.78rem;color:var(--ink-light)">মোট পণ্য</div>
           <div style="font-size:1.2rem;font-weight:700">${formatNumber(totalItems)}</div></div>
    </div>
    <div style="background:#fff;border-radius:var(--radius);padding:0.9rem 1.2rem;
                box-shadow:0 2px 8px var(--shadow);display:flex;align-items:center;gap:0.75rem;flex:1;min-width:140px;
                border-left:4px solid var(--amber-dark)">
      <span style="font-size:1.5rem">⚠️</span>
      <div><div style="font-size:0.78rem;color:var(--ink-light)">কম স্টক</div>
           <div style="font-size:1.2rem;font-weight:700;color:var(--amber-dark)">${formatNumber(lowCount)}</div></div>
    </div>
    <div style="background:#fff;border-radius:var(--radius);padding:0.9rem 1.2rem;
                box-shadow:0 2px 8px var(--shadow);display:flex;align-items:center;gap:0.75rem;flex:1;min-width:140px;
                border-left:4px solid var(--red)">
      <span style="font-size:1.5rem">🚫</span>
      <div><div style="font-size:0.78rem;color:var(--ink-light)">মেয়াদ উত্তীর্ণ</div>
           <div style="font-size:1.2rem;font-weight:700;color:var(--red)">${formatNumber(expiredCount)}</div></div>
    </div>
    <div style="background:#fff;border-radius:var(--radius);padding:0.9rem 1.2rem;
                box-shadow:0 2px 8px var(--shadow);display:flex;align-items:center;gap:0.75rem;flex:1;min-width:140px;
                border-left:4px solid var(--green-light)">
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

  el.innerHTML = `
    <div style="background:#fff;border-radius:var(--radius);overflow:hidden;box-shadow:0 2px 10px var(--shadow)">
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="background:var(--cream-dark)">
            <th style="padding:0.75rem 1rem;text-align:left;font-size:0.85rem;color:var(--green-dark)">পণ্যের নাম</th>
            <th style="padding:0.75rem 1rem;text-align:right;font-size:0.85rem;color:var(--green-dark)">ক্রয়</th>
            <th style="padding:0.75rem 1rem;text-align:right;font-size:0.85rem;color:var(--green-dark)">বিক্রয়</th>
            <th style="padding:0.75rem 1rem;text-align:right;font-size:0.85rem;color:var(--green-dark)">স্টক</th>
            <th style="padding:0.75rem 1rem;text-align:center;font-size:0.85rem;color:var(--green-dark)">মেয়াদ</th>
            <th style="padding:0.75rem 1rem;text-align:center;font-size:0.85rem;color:var(--green-dark)">অবস্থা</th>
            <th style="padding:0.75rem 1rem;text-align:center;font-size:0.85rem;color:var(--green-dark)">কাজ</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => {
            const status = getItemStatus(item);
            const rowBg  = status === 'expired' ? '#fff8f8' : status === 'low' ? '#fffdf0' : '#fff';
            const statusHTML = status === 'expired'
              ? `<span class="due-tag due-tag--overdue">🚫 মেয়াদ শেষ</span>`
              : status === 'low'
                ? `<span class="due-tag due-tag--due-soon">⚠️ কম স্টক</span>`
                : `<span class="due-tag" style="background:var(--green-pale);color:var(--green-dark)">✅ ঠিক আছে</span>`;
            const profit = item.sellPrice - item.buyPrice;
            return `
            <tr style="border-top:1px solid var(--border);background:${rowBg}">
              <td style="padding:0.75rem 1rem">
                <div style="font-weight:600;color:var(--ink)">${item.name}</div>
                <div style="font-size:0.75rem;color:var(--ink-light)">${item.shop || ''}</div>
              </td>
              <td style="padding:0.75rem 1rem;text-align:right;font-size:0.9rem">${formatTaka(item.buyPrice)}</td>
              <td style="padding:0.75rem 1rem;text-align:right;font-size:0.9rem">
                ${formatTaka(item.sellPrice)}
                ${profit > 0 ? `<div style="font-size:0.7rem;color:var(--green-light)">+${formatTaka(profit)}</div>` : ''}
              </td>
              <td style="padding:0.75rem 1rem;text-align:right;font-weight:700;
                         color:${item.quantity < 10 ? 'var(--amber-dark)' : 'var(--ink)'}">
                ${formatNumber(item.quantity)}
              </td>
              <td style="padding:0.75rem 1rem;text-align:center;font-size:0.82rem;color:var(--ink-light)">
                ${item.expiryDate ? formatDateShort(item.expiryDate) : '—'}
              </td>
              <td style="padding:0.75rem 1rem;text-align:center">${statusHTML}</td>
              <td style="padding:0.75rem 1rem;text-align:center;display:flex;gap:0.4rem;justify-content:center">
                <button onclick="openEditInventory('${item.id}')"
                  style="background:none;border:1px solid var(--border);border-radius:4px;
                         padding:3px 8px;cursor:pointer;font-size:0.8rem">✏️</button>
                <button onclick="deleteInventoryItem('${item.id}')"
                  style="background:none;border:1px solid var(--red);border-radius:4px;
                         padding:3px 8px;cursor:pointer;font-size:0.8rem;color:var(--red)">🗑️</button>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
}

function openAddInventory() {
  $('inv-modal-title').textContent = 'নতুন পণ্য যোগ করুন';
  $('inv-id').value          = '';
  $('inv-name').value        = '';
  $('inv-buy-price').value   = '';
  $('inv-sell-price').value  = '';
  $('inv-quantity').value    = '';
  $('inv-buy-date').value    = '';
  $('inv-expiry-date').value = '';

  const shopSel = $('inv-shop');
  shopSel.innerHTML = '';
  shopsList.forEach(s => shopSel.innerHTML += `<option value="${s}">${s}</option>`);
  const saved = localStorage.getItem('selectedShop');
  if (saved) shopSel.value = saved;

  // Populate supplier dropdown
  const supSel = document.getElementById('inv-supplier');
  if (supSel) {
    supSel.innerHTML = '<option value="">সরবরাহকারী বাছুন...</option>';
    suppliersData.forEach(s => {
      supSel.innerHTML += `<option value="${s.id}">${s.name}</option>`;
    });
  }

  openModal('modal-inventory');
}

function openEditInventory(id) {
  const item = inventoryData.find(i => i.id === id);
  if (!item) return;
  $('inv-modal-title').textContent = 'পণ্য সম্পাদনা করুন';
  $('inv-id').value          = item.id;
  $('inv-name').value        = item.name;
  $('inv-buy-price').value   = item.buyPrice;
  $('inv-sell-price').value  = item.sellPrice;
  $('inv-quantity').value    = item.quantity;
  $('inv-buy-date').value    = item.buyDate    ? item.buyDate.split('T')[0]    : '';
  $('inv-expiry-date').value = item.expiryDate ? item.expiryDate.split('T')[0] : '';

  const shopSel = $('inv-shop');
  shopSel.innerHTML = '';
  shopsList.forEach(s => shopSel.innerHTML += `<option value="${s}">${s}</option>`);
  shopSel.value = item.shop || '';

  openModal('modal-inventory');
}

async function saveInventoryItem() {
  const name = $('inv-name').value.trim();
  if (!name) return showToast('পণ্যের নাম দিন!', 'error');

  const body = {
    name,
    buyPrice:   $('inv-buy-price').value,
    sellPrice:  $('inv-sell-price').value,
    quantity:   $('inv-quantity').value,
    buyDate:    $('inv-buy-date').value    || null,
    expiryDate: $('inv-expiry-date').value || null,
    shop:       $('inv-shop').value || localStorage.getItem('selectedShop') || 'প্রধান শাখা',
    supplierId: $('inv-supplier')?.value   || null
  };

  try {
    const id = $('inv-id').value;
    if (id) {
      await API(`/api/inventory/${id}`, { method: 'PUT', body: JSON.stringify(body) });
      showToast('পণ্য আপডেট হয়েছে ✅');
    } else {
      const saved = await API('/api/inventory', { method: 'POST', body: JSON.stringify(body) });

      // Auto-create expense entry if checkbox is checked
      if (document.getElementById('inv-auto-expense')?.checked) {
        const expAmt = (parseFloat(body.buyPrice) || 0) * (parseInt(body.quantity) || 0);
        if (expAmt > 0) {
          await API('/api/expenses', {
            method: 'POST',
            body: JSON.stringify({
              title:    `পণ্য ক্রয়: ${body.name}`,
              category: 'Supplier Purchase',
              amount:   expAmt,
              shop:     body.shop,
              note:     `${body.quantity} × ৳${body.buyPrice}`,
              date:     body.buyDate || new Date().toISOString().split('T')[0]
            })
          });
        }
      }
      showToast('নতুন পণ্য যোগ হয়েছে ✅');
    }
    closeModal('modal-inventory');
    loadInventory();
  } catch {
    showToast('সংরক্ষণ করতে সমস্যা হয়েছে', 'error');
  }
}

async function deleteInventoryItem(id) {
  const item = inventoryData.find(i => i.id === id);
  if (!confirm(`"${item?.name}" মুছবেন?`)) return;
  await API(`/api/inventory/${id}`, { method: 'DELETE' });
  showToast('পণ্য মুছে গেছে');
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
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem">
        <div>
          <div style="font-family:'Tiro Bangla',serif;font-size:1.3rem;color:var(--green-dark);font-weight:700">${s.name}</div>
          <div style="color:var(--ink-light);margin-top:4px">📞 ${s.phone || '—'}</div>
        </div>
        <div style="display:flex;gap:1.5rem">
          <div style="text-align:center">
            <div style="font-size:0.75rem;color:var(--ink-light)">মোট ধার</div>
            <div style="font-size:1.2rem;font-weight:700;color:var(--amber-dark)">${formatTaka(s.totalOwed)}</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:0.75rem;color:var(--ink-light)">মোট দিয়েছি</div>
            <div style="font-size:1.2rem;font-weight:700;color:var(--green-light)">${formatTaka(s.totalPaid)}</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:0.75rem;color:var(--ink-light)">বাকি</div>
            <div style="font-size:1.2rem;font-weight:700;color:var(--red)">${formatTaka(s.balance)}</div>
          </div>
        </div>
        <div style="display:flex;gap:0.5rem">
          <button class="btn-outline danger" onclick="deleteSupplier('${s.id}')">🗑️ মুছুন</button>
        </div>
      </div>
    `;

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