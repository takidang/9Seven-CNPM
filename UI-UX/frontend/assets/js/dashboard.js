  /* ============================================================
     Mock data — replace with API calls once backend is live.
     Stored in memory only; refresh = fresh data.
     ============================================================ */
  const TICKETS = [
    { code: 'FFC-0094', customer: 'Trần Thu Hà',   phone: '0901 234 567', device: 'Samsung S24',     issue: 'Vỡ màn',          tech: 'Trúc Ly',     date: '2026-05-08 10:24', quote: 2400000, status: 'waiting',    urgent: true },
    { code: 'FFC-0093', customer: 'Lê Quốc Anh',   phone: '0908 111 222', device: 'MacBook Pro M2',  issue: 'Chẩn đoán main',  tech: 'Tuấn Kiệt',   date: '2026-05-08 09:18', quote: 0,       status: 'in-progress' },
    { code: 'FFC-0092', customer: 'Phạm Minh Tú',  phone: '0937 555 888', device: 'iPhone 14',       issue: 'Pin chai',        tech: 'Minh Triết',  date: '2026-05-08 08:55', quote: 850000,  status: 'in-progress' },
    { code: 'FFC-0091', customer: 'Hoàng Lan',     phone: '0987 666 333', device: 'iPad Air 5',      issue: 'Không lên màn',   tech: 'Trúc Ly',     date: '2026-05-08 08:30', quote: 1800000, status: 'testing'  },
    { code: 'FFC-0090', customer: 'Đỗ Văn Khoa',   phone: '0945 777 999', device: 'Asus ROG G15',    issue: 'Vệ sinh + keo',   tech: 'Thanh Mai',   date: '2026-05-08 08:12', quote: 350000,  status: 'in-progress' },
    { code: 'FFC-0089', customer: 'Nguyễn Trí',    phone: '0902 333 444', device: 'iPhone 13',       issue: 'Thay pin',        tech: 'Minh Triết',  date: '2026-05-07 17:22', quote: 720000,  status: 'done'     },
    { code: 'FFC-0088', customer: 'Vũ Thu',        phone: '0976 234 567', device: 'Oppo Reno 8',     issue: 'Loa rè',          tech: 'Trúc Ly',     date: '2026-05-07 16:48', quote: 480000,  status: 'in-progress' },
    { code: 'FFC-0087', customer: 'Bùi Hải Đăng',  phone: '0918 555 222', device: 'MacBook Air M1',  issue: 'Phục hồi dữ liệu',tech: 'Hoài Nam',    date: '2026-05-07 14:15', quote: 1200000, status: 'waiting',    urgent: true },
    { code: 'FFC-0086', customer: 'Trịnh Nhi',     phone: '0901 999 888', device: 'Xiaomi 13T',      issue: 'Vỡ kính sau',     tech: 'Trúc Ly',     date: '2026-05-07 11:40', quote: 580000,  status: 'testing'  },
    { code: 'FFC-0085', customer: 'Lý Phong',      phone: '0936 124 657', device: 'Dell XPS 13',     issue: 'Nâng cấp SSD 1TB',tech: 'Tuấn Kiệt',   date: '2026-05-07 10:22', quote: 1250000, status: 'done'     },
    { code: 'FFC-0084', customer: 'Trương Hằng',   phone: '0918 333 111', device: 'iPhone 12 Pro',   issue: 'Không sạc được',  tech: 'Minh Triết',  date: '2026-05-07 09:55', quote: 380000,  status: 'in-progress' },
    { code: 'FFC-0083', customer: 'Nguyễn Khánh',  phone: '0902 777 666', device: 'Lenovo ThinkPad', issue: 'Bàn phím lỗi',    tech: 'Tuấn Kiệt',   date: '2026-05-07 08:30', quote: 0,       status: 'waiting',    urgent: true },
  ];

  /* Danh sách kỹ thuật viên — phải khớp với field `tech` của TICKETS */
  const TECHNICIANS = [
    { name: 'Minh Triết', role: 'iPhone',           color: '#2563eb' },
    { name: 'Trúc Ly',    role: 'Thay màn hình',    color: '#f59e0b' },
    { name: 'Tuấn Kiệt',  role: 'Main laptop',      color: '#7c3aed' },
    { name: 'Thanh Mai',  role: 'Vệ sinh',          color: '#10b981' },
    { name: 'Hoài Nam',   role: 'Phục hồi dữ liệu', color: '#dc2626' },
  ];
  const techInitials = (name) => name.split(/\s+/).map(w => w[0]).slice(-2).join('').toUpperCase();

  /* Dynamic status label — lookup runs at render time so language toggle
     redraws with the active locale. */
  const tr = (k) => (window.PA_i18n ? window.PA_i18n.tr(k) : k);
  const statusLabel = (s) => tr('dash.status.' + s);
  const urgentLabel = () => tr('dash.status.urgent');

  const fmtMoney = (n) => n > 0 ? n.toLocaleString('vi-VN') + '₫' : '—';

  /* ============================================================
     Render
     ============================================================ */
  function renderDashTable() {
    const tbody = document.querySelector('#dashTable tbody');
    tbody.innerHTML = TICKETS.slice(0, 5).map(t => `
      <tr style="cursor:pointer" onclick="openTicket('${t.code}')">
        <td><span class="ticket-code">${t.code}</span></td>
        <td><div class="device">${t.customer}<div class="meta">${t.phone}</div></div></td>
        <td><div class="device">${t.device}<div class="meta">${t.issue}</div></div></td>
        <td><span class="badge ${t.status}"><span class="dot"></span>${statusLabel(t.status)}</span></td>
        <td><div class="icon-row"><button title="Xem chi tiết" onclick="event.stopPropagation(); openTicket('${t.code}')">
          <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
        </button></div></td>
      </tr>
    `).join('');
  }

  let ticketFilter = 'all';
  let ticketTechFilter = '';
  let searchQuery = '';
  function matchesSearch(t, q) {
    if (!q) return true;
    q = q.toLowerCase();
    return (t.code.toLowerCase().includes(q) ||
            t.customer.toLowerCase().includes(q) ||
            t.phone.replace(/\s/g, '').includes(q.replace(/\s/g, '')) ||
            t.device.toLowerCase().includes(q));
  }
  function renderTicketsTable() {
    let list = ticketFilter === 'all' ? TICKETS : TICKETS.filter(t => t.status === ticketFilter);
    if (ticketTechFilter) list = list.filter(t => t.tech === ticketTechFilter);
    if (searchQuery) list = list.filter(t => matchesSearch(t, searchQuery));
    const tbody = document.querySelector('#ticketsTable tbody');
    tbody.innerHTML = list.length ? list.map(t => `
      <tr style="cursor:pointer" onclick="openTicket('${t.code}')">
        <td>
          <span class="ticket-code">${t.code}</span>
          ${t.source === 'online' ? `<br><span class="badge" style="margin-top:4px; background:rgba(37,99,235,0.10); color:var(--blue); border:1px solid rgba(37,99,235,0.25); font-weight:600;">🌐 Online</span>` : ''}
          ${t.urgent ? `<br><span class="badge urgent" style="margin-top:4px;">${urgentLabel()}</span>` : ''}
        </td>
        <td><div class="device">${t.customer}<div class="meta">${t.phone}</div></div></td>
        <td><div class="device">${t.device}<div class="meta">${t.issue}</div></div></td>
        <td>${t.tech}</td>
        <td style="font-size:12px; color:var(--text-2)">${t.date}</td>
        <td>${fmtMoney(t.quote)}</td>
        <td><span class="badge ${t.status}"><span class="dot"></span>${statusLabel(t.status)}</span></td>
        <td>
          <div class="icon-row">
            <button title="Chi tiết" onclick="event.stopPropagation(); openTicket('${t.code}')">
              <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('') : `<tr><td colspan="8" style="text-align:center; padding:40px; color:var(--text-3);">Không có phiếu nào khớp</td></tr>`;
  }

  /* ============================================================
     CUSTOMERS pane — derived from TICKETS (group by phone)
     ============================================================ */
  let customerSearch = '';
  function getCustomers() {
    const byPhone = new Map();
    TICKETS.forEach(t => {
      const key = t.phone.replace(/\s/g, '');
      if (!byPhone.has(key)) {
        byPhone.set(key, { name: t.customer, phone: t.phone, tickets: [], total: 0, lastDate: t.date });
      }
      const c = byPhone.get(key);
      c.tickets.push(t);
      c.total += t.quote;
      if (t.date > c.lastDate) c.lastDate = t.date;
    });
    return Array.from(byPhone.values()).sort((a, b) => b.lastDate.localeCompare(a.lastDate));
  }
  function renderCustomers() {
    let list = getCustomers();
    if (customerSearch) {
      const q = customerSearch.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) ||
                              c.phone.replace(/\s/g, '').includes(q.replace(/\s/g, '')));
    }
    const tbody = document.querySelector('#customersTable tbody');
    tbody.innerHTML = list.length ? list.map(c => `
      <tr style="cursor:pointer" onclick="openCustomer('${c.phone.replace(/\s/g, '')}')">
        <td><div class="device">${c.name}</div></td>
        <td>${c.phone}</td>
        <td><span style="font-weight:700; color:var(--blue)">${c.tickets.length}</span></td>
        <td style="font-size:12px; color:var(--text-2)">${c.lastDate}</td>
        <td>${fmtMoney(c.total)}</td>
        <td><div class="icon-row"><button onclick="event.stopPropagation(); openCustomer('${c.phone.replace(/\s/g, '')}')">
          <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
        </button></div></td>
      </tr>
    `).join('') : `<tr><td colspan="6" style="text-align:center; padding:40px; color:var(--text-3);">Không có khách hàng nào khớp</td></tr>`;
  }

  /* ============================================================
     KTV — assignee dropdown, filter, workload widget
     ============================================================ */
  function populateTechDropdowns() {
    /* Intake form */
    const intakeSel = document.getElementById('intakeAssignee');
    if (intakeSel) {
      const noneOpt = intakeSel.querySelector('option[value=""]');
      intakeSel.innerHTML = '';
      if (noneOpt) intakeSel.appendChild(noneOpt);
      TECHNICIANS.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.name;
        opt.textContent = `KTV. ${t.name} (${t.role})`;
        intakeSel.appendChild(opt);
      });
    }
    /* Tickets pane filter */
    const techFilterSel = document.getElementById('techFilter');
    if (techFilterSel) {
      const allOpt = techFilterSel.querySelector('option[value=""]');
      techFilterSel.innerHTML = '';
      if (allOpt) techFilterSel.appendChild(allOpt);
      TECHNICIANS.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.name;
        opt.textContent = t.name;
        techFilterSel.appendChild(opt);
      });
    }
  }

  function renderTechWorkload() {
    const host = document.getElementById('techWorkload');
    if (!host) return;
    const activeStatuses = ['waiting', 'in-progress', 'testing'];
    const counts = new Map();
    TECHNICIANS.forEach(t => counts.set(t.name, 0));
    TICKETS.forEach(t => {
      if (activeStatuses.includes(t.status) && counts.has(t.tech)) {
        counts.set(t.tech, counts.get(t.tech) + 1);
      }
    });
    host.innerHTML = TECHNICIANS.map(t => {
      const n = counts.get(t.name) || 0;
      let cls = 'zero';
      if (n >= 4) cls = 'overload';
      else if (n >= 2) cls = 'heavy';
      else if (n >= 1) cls = '';
      return `
        <div class="tech-row" onclick="filterTicketsByTech('${t.name}')" title="Xem phiếu của ${t.name}">
          <div class="tech-avatar" style="background:${t.color};">${techInitials(t.name)}</div>
          <div class="tech-info">
            <div class="tech-name">${t.name}</div>
            <div class="tech-role">${t.role}</div>
          </div>
          <div class="tech-count ${cls}">${n}</div>
        </div>
      `;
    }).join('');
  }

  function filterTicketsByTech(name) {
    ticketTechFilter = name;
    const sel = document.getElementById('techFilter');
    if (sel) sel.value = name;
    renderTicketsTable();
    goPane('tickets');
  }

  /* Wire tech filter dropdown */
  document.addEventListener('change', (e) => {
    if (e.target.id === 'techFilter') {
      ticketTechFilter = e.target.value;
      renderTicketsTable();
    }
  });

  /* ============================================================
     MODALS — ticket detail + customer history + status update
     ============================================================ */
  const STATUS_FLOW = ['waiting', 'in-progress', 'testing', 'done', 'delivered'];
  let currentTicketCode = null;

  function openModal(id) {
    document.getElementById(id).classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(id) {
    document.getElementById(id).classList.remove('open');
    document.body.style.overflow = '';
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
      document.body.style.overflow = '';
    }
  });

  function showToast(msg) {
    const t = document.getElementById('toast');
    document.getElementById('toast-msg').textContent = msg;
    t.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => t.classList.remove('show'), 2400);
  }

  function openTicket(code) {
    const t = TICKETS.find(x => x.code === code);
    if (!t) return;
    currentTicketCode = code;

    document.getElementById('tm-code').textContent = t.code;
    const badge = document.getElementById('tm-badge');
    badge.className = 'badge ' + t.status;
    document.getElementById('tm-badge-label').textContent = statusLabel(t.status);
    document.getElementById('tm-customer').textContent = t.customer;
    document.getElementById('tm-phone').textContent = t.phone;
    document.getElementById('tm-device').textContent = t.device;
    document.getElementById('tm-tech').textContent = t.tech;
    document.getElementById('tm-issue').textContent = t.issue;
    document.getElementById('tm-date').textContent = t.date;
    document.getElementById('tm-quote').textContent = fmtMoney(t.quote);

    /* Build clickable timeline */
    const currentIdx = STATUS_FLOW.indexOf(t.status);
    document.getElementById('tm-timeline').innerHTML = STATUS_FLOW.map((s, i) => {
      const cls = i < currentIdx ? 'done' : i === currentIdx ? 'current' : '';
      return `<div class="status-step ${cls}" onclick="setStatus('${s}')">
                <span class="num">${i + 1}</span>${statusLabel(s)}
              </div>`;
    }).join('');

    /* "Advance →" button label hint */
    const next = STATUS_FLOW[currentIdx + 1];
    const advBtn = document.getElementById('tm-advance');
    if (next) {
      advBtn.style.display = '';
      advBtn.textContent = '→ ' + statusLabel(next);
      advBtn.onclick = () => setStatus(next);
    } else {
      advBtn.style.display = 'none';
    }

    openModal('ticketModal');
  }

  function setStatus(newStatus) {
    const t = TICKETS.find(x => x.code === currentTicketCode);
    if (!t || t.status === newStatus) return;
    t.status = newStatus;
    t.lastStatusAt = new Date().toISOString().slice(0, 16).replace('T', ' ');
    if (newStatus === 'in-progress' || newStatus === 'done') t.urgent = false;
    openTicket(t.code); /* re-render modal */
    renderDashTable();
    renderTicketsTable();
    renderCustomers();
    if (typeof renderPaymentTable === 'function') renderPaymentTable();
    if (typeof renderTechWorkload === 'function') renderTechWorkload();
    updateCounts();
    persistTickets();
    showToast(`${t.code} → ${statusLabel(newStatus)}`);
  }

  function openCustomer(phoneKey) {
    const c = getCustomers().find(c => c.phone.replace(/\s/g, '') === phoneKey);
    if (!c) return;
    document.getElementById('cm-name').textContent = c.name;
    document.getElementById('cm-phone').textContent = c.phone;
    document.getElementById('cm-count').textContent = c.tickets.length;
    document.getElementById('cm-total').textContent = fmtMoney(c.total);
    const tbody = document.querySelector('#cm-history tbody');
    tbody.innerHTML = c.tickets.map(t => `
      <tr style="cursor:pointer" onclick="closeModal('customerModal'); setTimeout(()=>openTicket('${t.code}'), 200)">
        <td><span class="ticket-code">${t.code}</span></td>
        <td><div class="device">${t.device}<div class="meta">${t.issue}</div></div></td>
        <td style="font-size:12px; color:var(--text-2)">${t.date}</td>
        <td>${fmtMoney(t.quote)}</td>
        <td><span class="badge ${t.status}"><span class="dot"></span>${statusLabel(t.status)}</span></td>
      </tr>
    `).join('');
    openModal('customerModal');
  }

  function openCustomerModal() {
    showToast('Thêm khách hàng mới — đang phát triển');
  }

  /* Customer pane search input */
  document.addEventListener('input', (e) => {
    if (e.target.id === 'custSearch') {
      customerSearch = e.target.value.trim();
      renderCustomers();
    }
  });

  /* ============================================================
     PAYMENT — thu tiền, in hoá đơn
     ============================================================ */
  const payMethodLabel = (m) => tr('dash.payment.method.' + m);
  const fmtVND = (n) => (+n || 0).toLocaleString('vi-VN') + '₫';
  let invoiceCounter = 141;
  let paymentFilter = 'pending';
  let paymentSearch = '';
  let currentPaymentCode = null;

  /* Seed một hoá đơn đã thu hôm nay để demo */
  (function seedPayments() {
    const today = new Date().toISOString().slice(0, 10);
    const t = TICKETS.find(x => x.code === 'FFC-0085');
    if (t) {
      const discount = 5;
      const discountAmt = Math.round(t.quote * discount / 100);
      Object.assign(t, {
        paid: true,
        paidMethod: 'bank',
        discount,
        discountAmt,
        finalAmount: t.quote - discountAmt,
        paidAt: today + ' 09:18',
        invoiceNo: 'INV-' + new Date().getFullYear() + '-0141',
        status: 'delivered',
      });
    }
  })();

  /* Merge online booking requests (from index.html "Đặt Lịch Ngay") into
     TICKETS so admin sees them in pane Phiếu sửa chữa with badge "Online". */
  /* Persist current TICKETS to localStorage so customer side ("Phiếu của tôi"
     modal on index.html) can read and display them filtered by phone. */
  const TICKETS_KEY = 'ffc_tickets';
  function persistTickets() {
    try { localStorage.setItem(TICKETS_KEY, JSON.stringify(TICKETS)); }
    catch (_) {}
  }

  (function mergeOnlineBookings() {
    try {
      const list = JSON.parse(localStorage.getItem('ffc_online_bookings') || '[]');
      list.forEach(b => {
        /* Skip if already merged (same code already in TICKETS) */
        if (TICKETS.some(t => t.code === b.code)) return;
        TICKETS.unshift({
          code: b.code,
          customer: b.customer,
          phone: b.phone,
          device: b.device,
          issue: b.issue + (b.method === 'ship' ? ' · 🚚 Ship đến tiệm' :
                            b.method === 'onsite' ? ' · 🏠 KTV đến nhà' : ''),
          tech: 'Chưa phân',
          date: b.createdAt || new Date().toLocaleString('sv-SE').slice(0, 16),
          quote: 0,
          status: 'waiting',
          urgent: true,
          source: 'online',
          bookingDate: b.date,
          bookingSlot: b.timeSlot,
          bookingMethod: b.method,
          bookingAddress: b.address,
          bookingNote: b.note,
        });
      });
    } catch (_) {}
    persistTickets();
  })();

  /* Live-refresh when a new booking comes in from another tab */
  window.addEventListener('storage', (e) => {
    if (e.key === 'ffc_online_bookings') {
      /* Reload page to re-merge — simplest approach for demo */
      try {
        const list = JSON.parse(e.newValue || '[]');
        list.forEach(b => {
          if (TICKETS.some(t => t.code === b.code)) return;
          TICKETS.unshift({
            code: b.code, customer: b.customer, phone: b.phone, device: b.device,
            issue: b.issue + (b.method === 'ship' ? ' · 🚚 Ship đến tiệm' :
                              b.method === 'onsite' ? ' · 🏠 KTV đến nhà' : ''),
            tech: 'Chưa phân',
            date: b.createdAt || new Date().toLocaleString('sv-SE').slice(0, 16),
            quote: 0, status: 'waiting', urgent: true, source: 'online',
            bookingDate: b.date, bookingSlot: b.timeSlot,
            bookingMethod: b.method, bookingAddress: b.address, bookingNote: b.note,
          });
        });
        if (typeof renderDashTable === 'function') renderDashTable();
        if (typeof renderTicketsTable === 'function') renderTicketsTable();
        if (typeof renderCustomers === 'function') renderCustomers();
        if (typeof updateCounts === 'function') updateCounts();
        if (typeof showToast === 'function') showToast('Có phiếu đặt lịch online mới!');
      } catch (_) {}
    }
  });

  function eligibleForPayment(t) {
    return t.quote > 0 && (t.status === 'done' || t.status === 'delivered' || t.paid);
  }

  function getPaymentList() {
    let list = TICKETS.filter(eligibleForPayment);
    if (paymentFilter === 'pending') list = list.filter(t => !t.paid);
    else if (paymentFilter === 'paid') list = list.filter(t => t.paid);
    if (paymentSearch) {
      const q = paymentSearch.toLowerCase();
      list = list.filter(t => t.code.toLowerCase().includes(q) ||
                              t.customer.toLowerCase().includes(q) ||
                              t.phone.replace(/\s/g, '').includes(q.replace(/\s/g, '')));
    }
    return list.sort((a, b) => (b.paidAt || b.date).localeCompare(a.paidAt || a.date));
  }

  function renderPaymentTable() {
    const tbody = document.querySelector('#paymentTable tbody');
    if (!tbody) return;
    const list = getPaymentList();
    tbody.innerHTML = list.length ? list.map(t => {
      const amount = t.paid ? t.finalAmount : t.quote;
      const paidLbl = tr('dash.payment.status.paid');
      const pendingLbl = tr('dash.payment.status.pending');
      const collectLbl = tr('dash.payment.btn.collect');
      return `
        <tr>
          <td><span class="ticket-code">${t.code}</span>${t.invoiceNo ? `<div style="font-size:11px; color:var(--text-3); margin-top:2px;">${t.invoiceNo}</div>` : ''}</td>
          <td><div class="device">${t.customer}<div class="meta">${t.phone}</div></div></td>
          <td><div class="device">${t.device}<div class="meta">${t.issue}</div></div></td>
          <td>${t.tech}</td>
          <td style="font-weight:700;">${fmtVND(amount)}</td>
          <td><span class="pay-status-badge ${t.paid ? 'paid' : 'pending'}"><span class="dot"></span>${t.paid ? paidLbl : pendingLbl}</span></td>
          <td>${t.paid ? `<span class="pay-method-pill">${payMethodLabel(t.paidMethod)}</span><div style="font-size:11px; color:var(--text-3); margin-top:3px;">${(t.paidAt || '').slice(11, 16)}</div>` : '—'}</td>
          <td>
            <div class="icon-row">
              ${t.paid
                ? `<button title="Xem hoá đơn" onclick="viewInvoice('${t.code}')"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></button>`
                : `<button class="btn btn-primary" style="height:32px; padding:0 14px; font-size:13px;" onclick="openPayment('${t.code}')">${collectLbl}</button>`
              }
            </div>
          </td>
        </tr>
      `;
    }).join('') : `<tr><td colspan="8" style="text-align:center; padding:40px; color:var(--text-3);">${paymentFilter === 'pending' ? 'Không có phiếu nào chờ thu' : 'Không có hoá đơn nào'}</td></tr>`;
    updatePaymentCounts();
  }

  function updatePaymentCounts() {
    const eligible = TICKETS.filter(eligibleForPayment);
    const pending = eligible.filter(t => !t.paid);
    const paid = eligible.filter(t => t.paid);
    const today = new Date().toISOString().slice(0, 10);
    const paidToday = paid.filter(t => (t.paidAt || '').startsWith(today));
    const setText = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    setText('pf-pending', pending.length);
    setText('pf-paid', paid.length);
    setText('pf-all', eligible.length);
    setText('payStatPending', pending.length);
    setText('payStatPendingMeta', fmtVND(pending.reduce((s, t) => s + t.quote, 0)));
    setText('payStatToday', paidToday.length);
    setText('payStatTodayMeta', fmtVND(paidToday.reduce((s, t) => s + (t.finalAmount || 0), 0)));
    setText('payStatTotal', fmtVND(paid.reduce((s, t) => s + (t.finalAmount || 0), 0)));
    setText('payStatTotalMeta', paid.length + ' ' + tr('dash.payment.stat.invoices'));
  }

  /* Payment filter buttons */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('#paymentFilters button');
    if (btn) {
      paymentFilter = btn.dataset.pfilter;
      document.querySelectorAll('#paymentFilters button').forEach(b => b.classList.toggle('active', b === btn));
      renderPaymentTable();
    }
    const opt = e.target.closest('#pm-methods .pay-method-opt');
    if (opt) {
      document.querySelectorAll('#pm-methods .pay-method-opt').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    }
  });
  document.addEventListener('input', (e) => {
    if (e.target.id === 'paySearch') {
      paymentSearch = e.target.value.trim();
      renderPaymentTable();
    }
    if (e.target.id === 'pm-discount') refreshPaymentTotals();
    if (e.target.id === 'pm-received') {
      const digits = e.target.value.replace(/[^0-9]/g, '');
      e.target.value = digits ? (+digits).toLocaleString('vi-VN') : '';
      refreshPaymentTotals();
    }
  });

  function openPayment(code) {
    const t = TICKETS.find(x => x.code === code);
    if (!t) return;
    currentPaymentCode = code;
    document.getElementById('pm-code').textContent = t.code;
    document.getElementById('pm-customer').textContent = t.customer;
    document.getElementById('pm-phone').textContent = t.phone;
    document.getElementById('pm-device').textContent = t.device;
    document.getElementById('pm-tech').textContent = t.tech;
    document.getElementById('pm-issue').textContent = t.issue;
    document.getElementById('pm-discount').value = 0;
    document.getElementById('pm-received').value = '';
    document.getElementById('pm-note').value = '';
    document.querySelectorAll('#pm-methods .pay-method-opt').forEach(o => o.classList.toggle('selected', o.dataset.method === 'cash'));
    refreshPaymentTotals();
    openModal('paymentModal');
  }

  function refreshPaymentTotals() {
    const t = TICKETS.find(x => x.code === currentPaymentCode);
    if (!t) return;
    const discount = Math.max(0, Math.min(100, +document.getElementById('pm-discount').value || 0));
    const discountAmt = Math.round(t.quote * discount / 100);
    const total = t.quote - discountAmt;
    document.getElementById('pm-subtotal').textContent = fmtVND(t.quote);
    document.getElementById('pm-discountAmt').textContent = discountAmt > 0 ? '-' + fmtVND(discountAmt) : '0₫';
    document.getElementById('pm-total').textContent = fmtVND(total);
    const received = +(document.getElementById('pm-received').value.replace(/[^0-9]/g, '')) || 0;
    const changeRow = document.getElementById('pm-changeRow');
    if (received > total) {
      changeRow.style.display = '';
      document.getElementById('pm-change').textContent = fmtVND(received - total);
    } else {
      changeRow.style.display = 'none';
    }
  }

  function confirmPayment() {
    const t = TICKETS.find(x => x.code === currentPaymentCode);
    if (!t) return;
    const method = document.querySelector('#pm-methods .pay-method-opt.selected')?.dataset.method || 'cash';
    const discount = Math.max(0, Math.min(100, +document.getElementById('pm-discount').value || 0));
    const discountAmt = Math.round(t.quote * discount / 100);
    const final = t.quote - discountAmt;
    const note = document.getElementById('pm-note').value.trim();

    invoiceCounter++;
    const invNo = 'INV-' + new Date().getFullYear() + '-' + String(invoiceCounter).padStart(4, '0');
    const nowStr = new Date().toISOString().slice(0, 16).replace('T', ' ');

    Object.assign(t, {
      paid: true,
      paidMethod: method,
      discount,
      discountAmt,
      finalAmount: final,
      paidAt: nowStr,
      invoiceNo: invNo,
      paidNote: note,
      status: 'delivered',
    });

    /* Notify customer via chat */
    const all = loadChats();
    const k = phoneKey(t.phone);
    if (!all[k]) {
      all[k] = { name: t.customer, phone: t.phone, messages: [], customerUnread: 0, adminUnread: 0, lastAt: '' };
    }
    all[k].messages.push({
      from: 'system',
      text: `Phiếu ${t.code} đã thanh toán xong (${fmtVND(final)} · ${payMethodLabel(method)}). Mã HĐ: ${invNo}. Cảm ơn quý khách!`,
      at: nowStr,
    });
    all[k].customerUnread = (all[k].customerUnread || 0) + 1;
    all[k].lastAt = nowStr;
    saveChats(all);
    notifyChatUpdate();

    closeModal('paymentModal');
    persistTickets();
    renderPaymentTable();
    renderDashTable();
    renderTicketsTable();
    renderCustomers();
    renderTechWorkload();
    renderChatList();
    updateCounts();
    showToast(`Đã thu ${fmtVND(final)} · ${invNo}`);

    /* Auto-open invoice after 500ms so toast is visible */
    setTimeout(() => viewInvoice(t.code), 500);
  }

  function viewInvoice(code) {
    const t = TICKETS.find(x => x.code === code);
    if (!t || !t.paid) return;
    const w = window.open('', '_blank', 'width=480,height=720');
    if (!w) {
      showToast('Trình duyệt chặn pop-up. Bật pop-up để xem hoá đơn.');
      return;
    }
    w.document.open();
    w.document.write(buildInvoiceHTML(t));
    w.document.close();
  }

  function buildInvoiceHTML(t) {
    const subtotal = t.quote;
    const discount = t.discountAmt || 0;
    const total = t.finalAmount || t.quote;
    return `<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><title>Hoá đơn ${t.invoiceNo}</title>
<style>
*{box-sizing:border-box}
body{font-family:-apple-system,'Segoe UI',Roboto,system-ui,sans-serif;max-width:420px;margin:30px auto;padding:24px;color:#1e293b}
.head{text-align:center;border-bottom:2px dashed #94a3b8;padding-bottom:14px;margin-bottom:14px}
.head h1{font-size:22px;margin:0 0 4px;color:#2563eb;letter-spacing:1px}
.head .sub{font-size:12px;color:#64748b}
.head .addr{font-size:11px;color:#64748b;margin-top:6px;line-height:1.5}
h2{font-size:13px;margin:14px 0 8px;text-transform:uppercase;letter-spacing:1.5px;text-align:center;color:#334155}
.row{display:flex;justify-content:space-between;font-size:13px;padding:4px 0;gap:10px}
.row .k{color:#64748b;flex-shrink:0}
.row .v{font-weight:600;text-align:right;word-break:break-word}
.items{border-top:1px dashed #cbd5e1;border-bottom:1px dashed #cbd5e1;padding:10px 0;margin:14px 0}
.total-row{font-size:18px;font-weight:800;color:#2563eb;padding:10px 0 2px;border-top:1px solid #cbd5e1;margin-top:6px}
.foot{text-align:center;font-size:11px;color:#64748b;margin-top:22px;padding-top:14px;border-top:1px dashed #94a3b8;line-height:1.6}
.stamp{display:inline-block;margin-top:10px;padding:6px 14px;border:2px dashed #15803d;color:#15803d;font-weight:700;transform:rotate(-3deg);letter-spacing:2px;font-size:13px}
.actions{display:flex;gap:10px;margin:18px 0 0}
.actions button{flex:1;padding:10px;border:none;border-radius:8px;background:#2563eb;color:#fff;font:inherit;font-weight:600;cursor:pointer}
.actions button.ghost{background:#e2e8f0;color:#334155}
@media print{body{margin:0;padding:12px;max-width:none}.actions{display:none}}
</style></head><body>
<div class="head">
  <h1>FFC — FIX FAST CENTER</h1>
  <div class="sub">Sửa chữa thiết bị điện tử chuyên nghiệp</div>
  <div class="addr">227 Nguyễn Văn Cừ, Q.5, TP.HCM<br>Hotline: 1900 0095 · ffcenter.vn</div>
</div>
<h2>Hoá đơn thanh toán</h2>
<div class="row"><span class="k">Số HĐ</span><span class="v">${t.invoiceNo}</span></div>
<div class="row"><span class="k">Mã phiếu</span><span class="v">${t.code}</span></div>
<div class="row"><span class="k">Ngày</span><span class="v">${t.paidAt}</span></div>
<div class="row"><span class="k">Hình thức</span><span class="v">${payMethodLabel(t.paidMethod)}</span></div>
<div class="items">
  <div style="font-size:13px;font-weight:700;margin-bottom:6px">Khách hàng</div>
  <div class="row"><span class="k">Tên</span><span class="v">${t.customer}</span></div>
  <div class="row"><span class="k">SĐT</span><span class="v">${t.phone}</span></div>
  <div style="font-size:13px;font-weight:700;margin:10px 0 6px">Dịch vụ</div>
  <div class="row"><span class="k">Thiết bị</span><span class="v">${t.device}</span></div>
  <div class="row"><span class="k">Mô tả</span><span class="v">${t.issue}</span></div>
  <div class="row"><span class="k">KTV</span><span class="v">${t.tech}</span></div>
</div>
<div class="row"><span class="k">Tạm tính</span><span class="v">${fmtVND(subtotal)}</span></div>
${discount > 0 ? `<div class="row"><span class="k">Giảm giá (${t.discount}%)</span><span class="v" style="color:#dc2626">-${fmtVND(discount)}</span></div>` : ''}
<div class="row total-row"><span class="k">TỔNG CỘNG</span><span class="v">${fmtVND(total)}</span></div>
${t.paidNote ? `<div style="font-size:12px;color:#64748b;margin-top:14px;padding:8px;background:#f1f5f9;border-radius:6px"><strong>Ghi chú:</strong> ${t.paidNote}</div>` : ''}
<div class="foot">
  <div class="stamp">ĐÃ THANH TOÁN</div>
  <div style="margin-top:14px">Cảm ơn quý khách đã sử dụng dịch vụ!</div>
  <div>Bảo hành: 6 tháng kể từ ngày thanh toán</div>
</div>
<div class="actions">
  <button onclick="window.print()">In hoá đơn</button>
  <button class="ghost" onclick="window.close()">Đóng</button>
</div>
</body></html>`;
  }

  /* ============================================================
     CHAT SUPPORT — shared storage between admin and customer side.
     Schema (localStorage 'ffc_chats'):
       { "<phoneKey>": {
           name, phone, customerUnread, adminUnread, lastAt,
           messages: [{ from: 'customer'|'admin'|'system', text, at }]
       } }
     Cross-tab sync via `storage` event so admin reply appears on the
     customer's open chat.html immediately.
     ============================================================ */
  const CHAT_KEY = 'ffc_chats';
  const phoneKey = (p) => (p || '').replace(/\s/g, '');
  function loadChats() {
    try { return JSON.parse(localStorage.getItem(CHAT_KEY) || '{}'); }
    catch (_) { return {}; }
  }
  function saveChats(obj) {
    localStorage.setItem(CHAT_KEY, JSON.stringify(obj));
  }
  /* Seed sample threads so admin sees something on first load (only if empty) */
  function seedChats() {
    if (Object.keys(loadChats()).length) return;
    const now = new Date();
    const ago = (mins) => new Date(now - mins * 60000).toISOString().slice(0, 16);
    const sample = {};
    [
      { phone: '0901 234 567', name: 'Trần Thu Hà', msgs: [
        { from: 'customer', text: 'Anh ơi, khi nào em lấy được máy Samsung S24 đã sửa vậy?', mins: 35 },
        { from: 'admin',    text: 'Chào chị Hà, máy đã thay xong màn, đang test cuối — khoảng 30 phút nữa chị ghé được.', mins: 32 },
        { from: 'system',   text: 'Phiếu FFC-0094 đã chuyển sang [Đang test]', mins: 30 },
      ]},
      { phone: '0908 111 222', name: 'Lê Quốc Anh', msgs: [
        { from: 'customer', text: 'MacBook em bị lỗi gì vậy ạ?', mins: 90 },
      ]},
      { phone: '0918 555 222', name: 'Bùi Hải Đăng', msgs: [
        { from: 'customer', text: 'Phục hồi dữ liệu có lấy được hết ảnh không anh?', mins: 180 },
        { from: 'admin',    text: 'Anh Đăng, em đã quét xong, lấy được ~92% file. Chiều mai có kết quả cụ thể.', mins: 175 },
      ]},
    ].forEach(({ phone, name, msgs }) => {
      const k = phoneKey(phone);
      const messages = msgs.map(m => ({ from: m.from, text: m.text, at: ago(m.mins) }));
      const adminUnread = messages.filter(m => m.from === 'customer').length -
                          messages.filter(m => m.from === 'admin').length;
      sample[k] = {
        name, phone,
        messages,
        customerUnread: 0,
        adminUnread: Math.max(0, adminUnread),
        lastAt: messages[messages.length - 1].at,
      };
    });
    saveChats(sample);
  }

  let currentChatKey = null;
  let chatFilter = 'all';

  function renderChatList() {
    const all = loadChats();
    const items = Object.entries(all)
      .map(([k, c]) => ({ k, ...c }))
      .filter(c => chatFilter === 'all' || c.adminUnread > 0)
      .sort((a, b) => (b.lastAt || '').localeCompare(a.lastAt || ''));

    const listEl = document.getElementById('chatList');
    if (!listEl) return;
    listEl.innerHTML = items.length ? items.map(c => {
      const initials = (c.name || '?').split(/\s+/).map(w => w[0]).slice(-2).join('').toUpperCase();
      const lastMsg = c.messages[c.messages.length - 1];
      const prefix = lastMsg ? (lastMsg.from === 'admin' ? 'Bạn: ' : lastMsg.from === 'system' ? '⚙ ' : '') : '';
      return `
        <div class="chat-row ${c.k === currentChatKey ? 'active' : ''}" onclick="openChat('${c.k}')">
          <div class="avatar">${initials}</div>
          <div class="info">
            <div class="name">${c.name}</div>
            <div class="last">${prefix}${(lastMsg?.text || '').slice(0, 50)}</div>
          </div>
          <div class="meta">
            ${(c.lastAt || '').slice(11, 16)}
            ${c.adminUnread > 0 ? `<div class="badge-unread">${c.adminUnread}</div>` : ''}
          </div>
        </div>
      `;
    }).join('') : `<div class="chat-empty" style="height:100%"><div data-i18n="dash.chat.no_threads">Chưa có cuộc trò chuyện nào</div></div>`;

    /* Update sidebar badge (sum admin unread) */
    const totalUnread = Object.values(all).reduce((s, c) => s + (c.adminUnread || 0), 0);
    const badge = document.getElementById('supportBadge');
    if (badge) {
      badge.textContent = totalUnread;
      badge.style.display = totalUnread > 0 ? '' : 'none';
    }
  }

  window.openChat = openChat;
  function openChat(key) {
    const all = loadChats();
    const c = all[key];
    if (!c) return;
    currentChatKey = key;

    /* Mark all as read for admin */
    if (c.adminUnread) {
      c.adminUnread = 0;
      all[key] = c;
      saveChats(all);
    }

    const thread = document.getElementById('chatThread');
    const initials = (c.name || '?').split(/\s+/).map(w => w[0]).slice(-2).join('').toUpperCase();
    const msgs = c.messages.map(m => {
      const cls = m.from;
      const time = (m.at || '').slice(11, 16);
      const author = m.from === 'system' ? '⚙ Hệ thống' : '';
      return `<div class="msg ${cls}">${author ? `<strong>${author}:</strong> ` : ''}${escapeHtml(m.text)}<span class="at">${time}</span></div>`;
    }).join('');

    thread.innerHTML = `
      <div class="chat-thread-head">
        <div class="avatar">${initials}</div>
        <div class="who">
          <div class="name">${c.name}</div>
          <div class="meta">${c.phone} · ${c.messages.length} tin nhắn</div>
        </div>
      </div>
      <div class="chat-msgs" id="chatMsgs">${msgs}</div>
      <form class="chat-reply" onsubmit="event.preventDefault(); sendAdminReply()">
        <input id="adminReplyInput" type="text" placeholder="Trả lời ${c.name}..." autocomplete="off" />
        <button type="submit">
          <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          <span data-i18n="dash.chat.send">Gửi</span>
        </button>
      </form>
    `;
    const msgsEl = document.getElementById('chatMsgs');
    if (msgsEl) msgsEl.scrollTop = msgsEl.scrollHeight;
    renderChatList();
  }

  function sendAdminReply() {
    const input = document.getElementById('adminReplyInput');
    if (!input || !currentChatKey) return;
    const text = input.value.trim();
    if (!text) return;

    const all = loadChats();
    const c = all[currentChatKey];
    if (!c) return;
    const now = new Date().toISOString().slice(0, 16);
    c.messages.push({ from: 'admin', text, at: now });
    c.customerUnread = (c.customerUnread || 0) + 1;
    c.lastAt = now;
    all[currentChatKey] = c;
    saveChats(all);
    notifyChatUpdate();

    input.value = '';
    openChat(currentChatKey);
    showToast('Đã gửi tin nhắn');
  }

  function escapeHtml(s) {
    return (s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  /* Filter buttons in chat list */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('#chatFilter button');
    if (btn) {
      document.querySelectorAll('#chatFilter button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      chatFilter = btn.dataset.filter;
      renderChatList();
    }
  });

  /* Cross-tab sync via BroadcastChannel (works under file://) + storage event + polling.
     file:// origin in Chrome sometimes doesn't fire `storage` events between tabs,
     so we use BroadcastChannel as the primary, with polling as the last-resort. */
  let chatBC = null;
  try { chatBC = new BroadcastChannel('ffc_chats'); } catch (_) {}
  function notifyChatUpdate() { try { chatBC && chatBC.postMessage({ at: Date.now() }); } catch (_) {} }
  function refreshChatUI() {
    renderChatList();
    if (currentChatKey) openChat(currentChatKey);
  }
  if (chatBC) chatBC.addEventListener('message', refreshChatUI);
  window.addEventListener('storage', (e) => {
    if (e.key === CHAT_KEY) refreshChatUI();
  });
  /* Polling fallback: every 2s, compare a small snapshot signature */
  let lastChatSig = '';
  setInterval(() => {
    const raw = localStorage.getItem(CHAT_KEY) || '';
    const sig = raw.length + ':' + raw.slice(-80);
    if (sig !== lastChatSig) {
      lastChatSig = sig;
      refreshChatUI();
    }
  }, 2000);

  /* Hook: when status changes in modal → push system message into that
     customer's chat thread so they get notified automatically. */
  const _origSetStatus = setStatus;
  setStatus = function (newStatus) {
    const t = TICKETS.find(x => x.code === currentTicketCode);
    if (!t) return _origSetStatus(newStatus);
    const oldStatus = t.status;
    _origSetStatus(newStatus);
    if (oldStatus !== newStatus) {
      const all = loadChats();
      const k = phoneKey(t.phone);
      if (!all[k]) {
        all[k] = { name: t.customer, phone: t.phone, messages: [],
                   customerUnread: 0, adminUnread: 0, lastAt: '' };
      }
      const now = new Date().toISOString().slice(0, 16);
      all[k].messages.push({
        from: 'system',
        text: `Phiếu ${t.code} đã chuyển sang [${statusLabel(newStatus)}]`,
        at: now
      });
      all[k].customerUnread = (all[k].customerUnread || 0) + 1;
      all[k].lastAt = now;
      saveChats(all);
      notifyChatUpdate();
      renderChatList();
    }
  };

  /* ============================================================
     Topbar global search — live dropdown showing matched tickets
     ============================================================ */
  (function wireTopSearch() {
    const input = document.getElementById('topSearch');
    const results = document.getElementById('topSearchResults');
    if (!input || !results) return;

    function update() {
      const q = input.value.trim();
      if (!q) { results.classList.remove('open'); return; }
      const matches = TICKETS.filter(t => matchesSearch(t, q)).slice(0, 8);
      if (!matches.length) {
        results.innerHTML = `<div class="empty">Không tìm thấy phiếu nào khớp "${q}"</div>`;
      } else {
        results.innerHTML = matches.map(t => `
          <div class="item" onclick="openFromSearch('${t.code}')">
            <span class="code">${t.code}</span>
            <div class="desc">${t.customer} — ${t.device}<div class="meta">${t.phone} · ${t.issue}</div></div>
            <span class="badge ${t.status}" style="flex-shrink:0;"><span class="dot"></span>${statusLabel(t.status)}</span>
          </div>
        `).join('');
      }
      results.classList.add('open');
    }

    input.addEventListener('input', update);
    input.addEventListener('focus', () => { if (input.value.trim()) update(); });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search')) results.classList.remove('open');
    });
    /* Enter → push search query into tickets-pane filter + jump there */
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        results.classList.remove('open');
        searchQuery = input.value.trim();
        ticketFilter = 'all';
        document.querySelectorAll('#ticketFilters button').forEach(b => b.classList.toggle('active', b.dataset.filter === 'all'));
        renderTicketsTable();
        goPane('tickets');
      }
    });
  })();

  function openFromSearch(code) {
    document.getElementById('topSearchResults').classList.remove('open');
    document.getElementById('topSearch').value = '';
    openTicket(code);
  }

  /* Filter buttons */
  document.querySelectorAll('#ticketFilters button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#ticketFilters button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      ticketFilter = btn.dataset.filter;
      renderTicketsTable();
    });
  });

  /* Update filter counts */
  function updateCounts() {
    const counts = TICKETS.reduce((m, t) => { m[t.status] = (m[t.status] || 0) + 1; return m; }, {});
    document.getElementById('cf-all').textContent = TICKETS.length;
    document.getElementById('cf-waiting').textContent = counts.waiting || 0;
    document.getElementById('cf-in-progress').textContent = counts['in-progress'] || 0;
    document.getElementById('cf-testing').textContent = counts.testing || 0;
    document.getElementById('cf-done').textContent = counts.done || 0;
    document.getElementById('urgentBadge').textContent = TICKETS.filter(t => t.urgent).length;
  }

  /* ============================================================
     Pane switching (hash-driven)
     ============================================================ */
  const PANE_KEYS = ['dashboard','intake','tickets','customers','support','inventory','payment','staff','reports','settings'];
  let currentPane = 'dashboard';

  function applyPaneTitle() {
    document.getElementById('paneTitle').firstChild.textContent =
      tr('dash.title.' + currentPane) + ' ';
    document.getElementById('paneSubtitle').textContent = tr('dash.sub.' + currentPane);
  }

  function goPane(name) {
    if (!PANE_KEYS.includes(name)) name = 'dashboard';
    currentPane = name;

    document.querySelectorAll('.pane').forEach(p => p.classList.remove('active'));
    document.getElementById('pane-' + name)?.classList.add('active');

    document.querySelectorAll('.nav-list a').forEach(a => {
      a.classList.toggle('active', a.dataset.pane === name);
    });

    applyPaneTitle();

    if (location.hash !== '#' + name) location.hash = name;

    document.querySelector('.main').scrollTop = 0;

    /* Lazy-render charts: canvases need to be visible for Chart.js to size correctly. */
    if (name === 'reports' && typeof renderReports === 'function') renderReports();
  }

  document.querySelectorAll('.nav-list a').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      goPane(a.dataset.pane);
    });
  });

  window.addEventListener('hashchange', () => {
    const name = location.hash.replace('#', '') || 'dashboard';
    goPane(name);
  });

  /* ============================================================
     Intake form handling (mock — just adds to in-memory list)
     ============================================================ */
  function nextCode() {
    const max = TICKETS.reduce((m, t) => Math.max(m, parseInt(t.code.slice(4))), 0);
    return 'FFC-' + String(max + 1).padStart(4, '0');
  }

  function submitIntake(e) {
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form).entries());
    const code = document.getElementById('intakeCode').textContent;
    TICKETS.unshift({
      code,
      customer: data.customer,
      phone:    data.phone,
      device:   data.model,
      issue:    data.issue,
      tech:     data.assignee || 'Chưa phân',
      date:     new Date().toLocaleString('sv-SE').slice(0, 16),
      quote:    parseInt(data.quote) || 0,
      status:   'waiting',
      urgent:   data.priority === 'Gấp' || data.priority === 'VIP',
    });
    persistTickets();
    showToast(`Đã tạo phiếu ${code} cho ${data.customer}`);
    form.reset();
    document.getElementById('intakeCode').textContent = nextCode();
    updateCounts();
    renderDashTable();
    renderTicketsTable();
    renderCustomers();
    renderTechWorkload();
    goPane('tickets');
  }

  function resetIntake() {
    document.getElementById('intakeForm').reset();
  }

  /* ============================================================
     Auth
     ============================================================ */
  const ADMIN_KEY = 'pa_admin_logged_in';
  function logout() {
    sessionStorage.removeItem(ADMIN_KEY);
    sessionStorage.removeItem('ffc_role');
    sessionStorage.removeItem('ffc_customer_me');
    window.location.href = 'admin.html';
  }
  /* Allow opening dashboard.html directly during dev (no auth gate)
     — uncomment to enforce login:
  if (sessionStorage.getItem(ADMIN_KEY) !== '1') {
    window.location.href = 'admin.html';
  }
  */

  /* ============================================================
     Theme (light / dark) — persisted in localStorage.
     Applied via [data-theme="dark"] on <html>.
     ============================================================ */
  const THEME_KEY = 'ffc_theme';
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    /* Swap sun/moon icons */
    const sun = document.getElementById('themeIconSun');
    const moon = document.getElementById('themeIconMoon');
    if (sun && moon) {
      sun.style.display  = theme === 'dark' ? 'block' : 'none';
      moon.style.display = theme === 'dark' ? 'none'  : 'block';
    }
  }
  function toggleTheme() {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  }
  /* Load saved theme on first render — runs immediately so no flash. */
  applyTheme(localStorage.getItem(THEME_KEY) || 'light');
  /* Cross-tab sync (e.g. switch theme in another tab → this one follows) */
  window.addEventListener('storage', (e) => {
    if (e.key === THEME_KEY) applyTheme(e.newValue || 'light');
  });

  /* ============================================================
     i18n integration — re-render dynamic content on language toggle
     ============================================================ */
  function applyLang() {
    /* i18n.js auto-applies data-i18n on load. After it runs, we still need
       to redraw tables (status badges) + topbar title since those are
       built by JS template literals. */
    renderDashTable();
    renderTicketsTable();
    renderCustomers();
    if (typeof renderPaymentTable === 'function') renderPaymentTable();
    if (typeof renderTechWorkload === 'function') renderTechWorkload();
    applyPaneTitle();
  }
  window.addEventListener('langchange', applyLang);
  window.addEventListener('storage', (e) => {
    if (e.key === 'pa_lang') applyLang();
  });

  /* Floating language toggle (bottom-right) — small pill that swaps
     between VI / EN. Calls PA_i18n.setLang() which fires `langchange`. */
  (function injectLangToggle() {
    const btn = document.createElement('button');
    btn.id = 'langToggle';
    btn.style.cssText = `
      position: fixed; bottom: 20px; right: 20px; z-index: 100;
      height: 40px; padding: 0 16px;
      background: var(--surface); backdrop-filter: blur(14px);
      border: 1px solid var(--border); border-radius: 999px;
      font: inherit; font-size: 13px; font-weight: 700;
      color: var(--navy); cursor: pointer;
      box-shadow: 0 4px 14px rgba(30, 58, 95, 0.15);
      display: inline-flex; align-items: center; gap: 8px;
      transition: all 0.15s;
    `;
    btn.onmouseenter = () => { btn.style.background = '#fff'; btn.style.borderColor = 'var(--sky)'; };
    btn.onmouseleave = () => { btn.style.background = 'var(--surface)'; btn.style.borderColor = 'var(--border)'; };
    function paint() {
      const lang = window.PA_i18n ? window.PA_i18n.getLang() : 'vi';
      btn.innerHTML = lang === 'vi' ? '🇻🇳 VIE' : '🇬🇧 ENG';
      btn.title = lang === 'vi' ? 'Click để chuyển sang English' : 'Click to switch to Vietnamese';
    }
    btn.addEventListener('click', () => {
      if (!window.PA_i18n) return;
      const next = window.PA_i18n.getLang() === 'vi' ? 'en' : 'vi';
      window.PA_i18n.setLang(next);
      paint();
    });
    document.body.appendChild(btn);
    paint();
  })();

  /* ============================================================
     Inventory (NICE-15) — mock parts + render
     ============================================================ */
  const PARTS = [
    { sku:'IP14-LCD-A',     name:'Màn hình iPhone 14',       cat:'Màn hình',   stock:12, min:5,  cost:2800000, price:3500000 },
    { sku:'IP13-BAT',       name:'Pin iPhone 13',            cat:'Pin',        stock:24, min:10, cost:380000,  price:720000  },
    { sku:'MB-M2-KEY',      name:'Bàn phím MacBook M2',      cat:'Bàn phím',   stock:3,  min:5,  cost:1200000, price:1800000 },
    { sku:'SS-S24-LCD',     name:'Màn hình Samsung S24',     cat:'Màn hình',   stock:0,  min:3,  cost:1900000, price:2400000 },
    { sku:'DELL-XPS-SSD',   name:'SSD 1TB Dell XPS',         cat:'Lưu trữ',    stock:8,  min:4,  cost:1850000, price:2500000 },
    { sku:'IP12-CHARGE',    name:'Cổng sạc iPhone 12',       cat:'Sạc',        stock:15, min:8,  cost:180000,  price:380000  },
    { sku:'LP-FAN-UNI',     name:'Quạt laptop universal',    cat:'Tản nhiệt',  stock:6,  min:5,  cost:220000,  price:350000  },
    { sku:'IP14-CAM',       name:'Camera sau iPhone 14',     cat:'Camera',     stock:2,  min:4,  cost:1400000, price:2100000 },
    { sku:'OPPO-SPK',       name:'Loa Oppo Reno 8',          cat:'Loa',        stock:9,  min:4,  cost:250000,  price:480000  },
    { sku:'IPAD-LCD-A5',    name:'Màn hình iPad Air 5',      cat:'Màn hình',   stock:4,  min:3,  cost:1300000, price:1800000 },
    { sku:'XIAOMI-13T-BACK',name:'Kính sau Xiaomi 13T',      cat:'Kính',       stock:11, min:5,  cost:280000,  price:580000  },
    { sku:'TPASTE-MX4',     name:'Keo tản nhiệt MX-4',       cat:'Phụ liệu',   stock:1,  min:5,  cost:80000,   price:150000  },
    { sku:'IP15-LCD-A',     name:'Màn hình iPhone 15',       cat:'Màn hình',   stock:7,  min:4,  cost:3200000, price:4100000 },
    { sku:'ASUS-ROG-FAN',   name:'Quạt Asus ROG G15',        cat:'Tản nhiệt',  stock:0,  min:2,  cost:480000,  price:720000  },
    { sku:'LENOVO-KB-T490', name:'Bàn phím Lenovo T490',     cat:'Bàn phím',   stock:5,  min:3,  cost:680000,  price:950000  },
  ];
  const fmtVnd = (n) => (n || 0).toLocaleString('vi-VN') + '₫';
  const stockState = (p) => p.stock === 0 ? 'out' : (p.stock <= p.min ? 'low' : 'ok');

  let invFilter = 'all';
  let invCatFilter = '';
  let invSearchQuery = '';

  function renderInventoryStats() {
    const lowCount = PARTS.filter(p => stockState(p) === 'low').length;
    const outCount = PARTS.filter(p => stockState(p) === 'out').length;
    const totalValue = PARTS.reduce((sum, p) => sum + p.stock * p.cost, 0);
    document.getElementById('invStatSku').textContent   = PARTS.length;
    document.getElementById('invStatLow').textContent   = lowCount;
    document.getElementById('invStatOut').textContent   = outCount;
    document.getElementById('invStatValue').textContent = fmtVnd(totalValue);
    document.getElementById('if-all').textContent = PARTS.length;
    document.getElementById('if-low').textContent = lowCount;
    document.getElementById('if-out').textContent = outCount;
  }

  function renderInventoryTable() {
    let list = PARTS.slice();
    if (invFilter !== 'all')  list = list.filter(p => stockState(p) === invFilter);
    if (invCatFilter)         list = list.filter(p => p.cat === invCatFilter);
    if (invSearchQuery) {
      const q = invSearchQuery.toLowerCase();
      list = list.filter(p => p.sku.toLowerCase().includes(q) || p.name.toLowerCase().includes(q));
    }
    const tbody = document.querySelector('#inventoryTable tbody');
    if (!list.length) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:32px; color:var(--text-3);">Không có linh kiện nào khớp bộ lọc</td></tr>`;
      return;
    }
    tbody.innerHTML = list.map(p => {
      const st = stockState(p);
      const stockCls = st === 'out' ? 'zero' : (st === 'low' ? 'warn' : '');
      const pillLabel = st === 'out' ? 'Hết hàng' : (st === 'low' ? 'Sắp hết' : 'Còn hàng');
      const margin = Math.round((p.price - p.cost) / p.cost * 100);
      return `
        <tr>
          <td><span class="ticket-code">${p.sku}</span></td>
          <td><div class="device">${p.name}<div class="meta">Lãi ~${margin}%</div></div></td>
          <td><span class="cat-pill">${p.cat}</span></td>
          <td><span class="stock-num ${stockCls}">${p.stock}</span><span class="stock-min">/ min ${p.min}</span></td>
          <td>${fmtVnd(p.cost)}</td>
          <td><strong>${fmtVnd(p.price)}</strong></td>
          <td><span class="stock-pill ${st}"><span class="dot"></span>${pillLabel}</span></td>
          <td><div class="icon-row">
            <button title="Nhập thêm" onclick="alert('Nhập thêm ${p.sku} — đang phát triển')"><svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
            <button title="Sửa" onclick="alert('Sửa ${p.sku} — đang phát triển')"><svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
          </div></td>
        </tr>`;
    }).join('');
  }

  function populateCatDropdown() {
    const sel = document.getElementById('catFilter');
    const cats = [...new Set(PARTS.map(p => p.cat))].sort();
    cats.forEach(c => sel.insertAdjacentHTML('beforeend', `<option value="${c}">${c}</option>`));
  }

  function renderInventory() {
    renderInventoryStats();
    renderInventoryTable();
  }

  document.getElementById('invFilters')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-ifilter]');
    if (!btn) return;
    document.querySelectorAll('#invFilters button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    invFilter = btn.dataset.ifilter;
    renderInventoryTable();
  });
  document.getElementById('catFilter')?.addEventListener('change', (e) => {
    invCatFilter = e.target.value;
    renderInventoryTable();
  });
  document.getElementById('invSearch')?.addEventListener('input', (e) => {
    invSearchQuery = e.target.value;
    renderInventoryTable();
  });

  /* ============================================================
     Reports (NICE-17) — Chart.js KPIs + charts
     ============================================================ */
  const PARTS_SALES = [
    { name:'Pin iPhone 13',          sold:42 },
    { name:'Màn hình iPhone 14',     sold:31 },
    { name:'Cổng sạc iPhone 12',     sold:28 },
    { name:'Loa Oppo Reno 8',        sold:24 },
    { name:'Quạt laptop universal',  sold:19 },
  ];

  let reportRange = 7;
  const reportCharts = {};

  function genRevenueSeries(days) {
    const labels = [];
    const data = [];
    const today = new Date();
    let base = 3500000;
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today); d.setDate(d.getDate() - i);
      labels.push((d.getDate() + '/' + (d.getMonth() + 1)));
      const wave = Math.sin(i / 3) * 600000;
      const noise = (Math.random() - 0.5) * 900000;
      data.push(Math.max(800000, Math.round(base + wave + noise + i * 12000)));
    }
    return { labels, data };
  }

  function chartColors() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      grid: dark ? 'rgba(148,163,184,0.15)' : 'rgba(0,0,0,0.06)',
      text: dark ? '#CBD5E1' : '#475569',
      blue: '#2563EB', sky:'#60A5FA', green:'#16A34A', amber:'#F59E0B', red:'#DC2626', purple:'#7C3AED',
    };
  }

  function destroyCharts() {
    Object.values(reportCharts).forEach(c => c?.destroy());
  }

  function renderReports() {
    if (typeof Chart === 'undefined') return;
    destroyCharts();
    const c = chartColors();

    /* KPIs */
    const series = genRevenueSeries(reportRange);
    const revenue = series.data.reduce((a, b) => a + b, 0);
    const doneCount = TICKETS.filter(t => t.status === 'done').length * Math.ceil(reportRange / 7);
    const avg = Math.round(revenue / Math.max(1, doneCount));
    const repeatRate = 38 + Math.floor(Math.random() * 8);
    document.getElementById('kpiRevenue').textContent = fmtVnd(revenue);
    document.getElementById('kpiDone').textContent    = doneCount;
    document.getElementById('kpiAvg').textContent     = fmtVnd(avg);
    document.getElementById('kpiRepeat').textContent  = repeatRate + '%';
    document.getElementById('kpiRevenueDelta').textContent = '↑ ' + (10 + Math.floor(Math.random() * 12)) + '% vs kỳ trước';
    document.getElementById('kpiDoneDelta').textContent    = '↑ ' + (5 + Math.floor(Math.random() * 10)) + '% vs kỳ trước';
    document.getElementById('kpiAvgDelta').textContent     = '↑ ' + (3 + Math.floor(Math.random() * 7)) + '% vs kỳ trước';
    document.getElementById('kpiRepeatDelta').textContent  = '↓ ' + (1 + Math.floor(Math.random() * 4)) + '% vs kỳ trước';

    /* Revenue line chart */
    reportCharts.revenue = new Chart(document.getElementById('chartRevenue'), {
      type: 'line',
      data: {
        labels: series.labels,
        datasets: [{
          label: 'Doanh thu',
          data: series.data,
          borderColor: c.blue,
          backgroundColor: 'rgba(37,99,235,0.10)',
          fill: true,
          tension: 0.35,
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => fmtVnd(ctx.parsed.y) } } },
        scales: {
          x: { grid: { color: c.grid }, ticks: { color: c.text, font:{ size:11 } } },
          y: { grid: { color: c.grid }, ticks: { color: c.text, font:{ size:11 }, callback: (v) => (v / 1000000).toFixed(1) + 'M' } },
        },
      },
    });

    /* Status doughnut */
    const counts = { waiting:0, 'in-progress':0, testing:0, done:0 };
    TICKETS.forEach(t => { counts[t.status] = (counts[t.status] || 0) + 1; });
    reportCharts.status = new Chart(document.getElementById('chartStatus'), {
      type: 'doughnut',
      data: {
        labels: ['Chờ', 'Đang sửa', 'Test', 'Xong'],
        datasets: [{
          data: [counts.waiting, counts['in-progress'], counts.testing, counts.done],
          backgroundColor: [c.amber, c.blue, c.purple, c.green],
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '62%',
        plugins: { legend: { position: 'bottom', labels: { color: c.text, font:{ size:12 }, boxWidth: 12, padding: 12 } } },
      },
    });

    /* Top tech bar */
    const byTech = {};
    TICKETS.forEach(t => { byTech[t.tech] = (byTech[t.tech] || 0) + (t.quote || 0); });
    const techRows = Object.entries(byTech).map(([k, v]) => ({ tech:k, rev:v })).sort((a, b) => b.rev - a.rev).slice(0, 5);
    reportCharts.tech = new Chart(document.getElementById('chartTech'), {
      type: 'bar',
      data: {
        labels: techRows.map(r => r.tech),
        datasets: [{
          label: 'Doanh thu',
          data: techRows.map(r => r.rev),
          backgroundColor: c.blue,
          borderRadius: 6,
          maxBarThickness: 36,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false, indexAxis: 'y',
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => fmtVnd(ctx.parsed.x) } } },
        scales: {
          x: { grid: { color: c.grid }, ticks: { color: c.text, font:{ size:11 }, callback: (v) => (v / 1000000).toFixed(1) + 'M' } },
          y: { grid: { display: false }, ticks: { color: c.text, font:{ size:12 } } },
        },
      },
    });

    /* Top parts bar */
    reportCharts.parts = new Chart(document.getElementById('chartParts'), {
      type: 'bar',
      data: {
        labels: PARTS_SALES.map(p => p.name),
        datasets: [{
          label: 'Đã bán',
          data: PARTS_SALES.map(p => p.sold),
          backgroundColor: c.sky,
          borderRadius: 6,
          maxBarThickness: 36,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false, indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: c.grid }, ticks: { color: c.text, font:{ size:11 } } },
          y: { grid: { display: false }, ticks: { color: c.text, font:{ size:12 } } },
        },
      },
    });
  }

  document.getElementById('rangeTabs')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-range]');
    if (!btn) return;
    document.querySelectorAll('#rangeTabs button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    reportRange = Number(btn.dataset.range);
    renderReports();
  });

  /* ============================================================
     Staff (Nhân viên & ca làm) — mock + render
     ============================================================ */
  const STAFF = [
    { name:'Minh Triết', role:'KTV iPhone',      status:'working', tickets:24, revenue:18500000, commission:12, color:'#2563eb' },
    { name:'Trúc Ly',    role:'KTV Màn hình',    status:'working', tickets:31, revenue:22400000, commission:12, color:'#f59e0b' },
    { name:'Tuấn Kiệt',  role:'KTV Main laptop', status:'working', tickets:18, revenue:26800000, commission:15, color:'#7c3aed' },
    { name:'Thanh Mai',  role:'KTV Vệ sinh',     status:'leave',   tickets:12, revenue:5400000,  commission:10, color:'#10b981' },
    { name:'Hoài Nam',   role:'KTV Phục hồi DL', status:'working', tickets:9,  revenue:14200000, commission:18, color:'#dc2626' },
    { name:'Bảo Long',   role:'Lễ tân',          status:'working', tickets:0,  revenue:0,        commission:0,  color:'#0ea5e9' },
    { name:'Khánh An',   role:'KTV iPhone',      status:'off',     tickets:14, revenue:9800000,  commission:12, color:'#a855f7' },
    { name:'Phương Vy',  role:'Quản lý cửa hàng',status:'working', tickets:0,  revenue:0,        commission:5,  color:'#ec4899' },
  ];
  const SHIFT_PLAN = {
    'Minh Triết':  ['morning','full','morning','off','full','afternoon','off'],
    'Trúc Ly':     ['full','morning','afternoon','full','morning','full','off'],
    'Tuấn Kiệt':   ['afternoon','full','full','morning','off','full','morning'],
    'Thanh Mai':   ['off','off','off','off','morning','afternoon','full'],
    'Hoài Nam':    ['full','afternoon','morning','full','full','off','afternoon'],
    'Bảo Long':    ['morning','morning','morning','morning','morning','full','off'],
    'Khánh An':    ['off','full','afternoon','full','morning','off','full'],
    'Phương Vy':   ['full','full','full','full','full','morning','off'],
  };
  const SHIFT_LABEL = { morning:'Sáng', afternoon:'Chiều', full:'Cả ngày', off:'Off' };
  const staffInitials = (n) => n.split(/\s+/).map(w => w[0]).slice(-2).join('').toUpperCase();
  const STATUS_LABEL = { working:'Đang làm', leave:'Nghỉ phép', off:'Off' };

  let staffFilter = 'all';

  function renderStaffStats() {
    const working = STAFF.filter(s => s.status === 'working').length;
    const leave   = STAFF.filter(s => s.status === 'leave').length;
    const off     = STAFF.filter(s => s.status === 'off').length;
    const totalCommission = STAFF.reduce((sum, s) => sum + Math.round(s.revenue * s.commission / 100), 0);
    document.getElementById('staffStatTotal').textContent      = STAFF.length;
    document.getElementById('staffStatWorking').textContent    = working;
    document.getElementById('staffStatLeave').textContent      = leave;
    document.getElementById('staffStatCommission').textContent = fmtVnd(totalCommission);
    document.getElementById('sf-all').textContent      = STAFF.length;
    document.getElementById('sf-working').textContent  = working;
    document.getElementById('sf-leave').textContent    = leave;
    document.getElementById('sf-off').textContent      = off;
  }

  function renderStaffGrid() {
    const list = staffFilter === 'all' ? STAFF : STAFF.filter(s => s.status === staffFilter);
    const grid = document.getElementById('staffGrid');
    if (!list.length) {
      grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:32px; color:var(--text-3);">Không có nhân viên nào khớp bộ lọc</div>`;
      return;
    }
    grid.innerHTML = list.map(s => `
      <div class="staff-card">
        <div class="staff-head">
          <div class="staff-avatar" style="background:${s.color};">${staffInitials(s.name)}</div>
          <div class="staff-info">
            <div class="staff-name">${s.name}</div>
            <div class="staff-role">${s.role}</div>
          </div>
          <span class="staff-status ${s.status}"><span class="dot"></span>${STATUS_LABEL[s.status]}</span>
        </div>
        <div class="staff-metrics">
          <div class="staff-metric"><div class="v">${s.tickets}</div><div class="l">Phiếu</div></div>
          <div class="staff-metric"><div class="v">${(s.revenue / 1000000).toFixed(1)}M</div><div class="l">Doanh thu</div></div>
          <div class="staff-metric"><div class="v">${s.commission}%</div><div class="l">Hoa hồng</div></div>
        </div>
      </div>
    `).join('');
  }

  function renderShiftTable() {
    const tbody = document.querySelector('#shiftTable tbody');
    tbody.innerHTML = STAFF.map(s => {
      const plan = SHIFT_PLAN[s.name] || ['off','off','off','off','off','off','off'];
      return `<tr>
        <td class="tech-cell">${s.name}</td>
        ${plan.map(shift => `<td><span class="shift-pill ${shift}">${SHIFT_LABEL[shift]}</span></td>`).join('')}
      </tr>`;
    }).join('');
  }

  function renderStaff() {
    renderStaffStats();
    renderStaffGrid();
    renderShiftTable();
  }

  document.getElementById('staffFilters')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-sfilter]');
    if (!btn) return;
    document.querySelectorAll('#staffFilters button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    staffFilter = btn.dataset.sfilter;
    renderStaffGrid();
  });

  /* ============================================================
     Init
     ============================================================ */
  document.getElementById('intakeCode').textContent = nextCode();
  seedChats();
  populateTechDropdowns();
  populateCatDropdown();
  renderDashTable();
  renderTicketsTable();
  renderCustomers();
  renderPaymentTable();
  renderTechWorkload();
  renderChatList();
  renderInventory();
  renderStaff();
  updateCounts();

  const startPane = location.hash.replace('#', '') || 'dashboard';
  goPane(startPane);
