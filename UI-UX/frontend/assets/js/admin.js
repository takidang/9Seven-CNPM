  const STORAGE_KEY = 'pa_chat_history';
  const ADMIN_KEY   = 'pa_admin_logged_in';
  const ROLE_KEY    = 'ffc_role';        /* 'admin' | 'customer' */
  const ME_KEY      = 'ffc_customer_me'; /* { name, phone } when role=customer */
  let chats = [];
  let activeChatId = null;
  let currentFilter = 'waiting';

  /* ---------- AUTH ----------
     Two demo roles:
       • admin   /  admin → operations dashboard
       • khach   /  khach → customer chat (identity auto-filled)
     The role gate in chat.html / dashboard.html uses `ffc_role` to decide
     whether a route is allowed for the current session. */
  const role = sessionStorage.getItem(ROLE_KEY);
  if (role === 'admin' && sessionStorage.getItem(ADMIN_KEY) === '1') {
    window.location.href = 'dashboard.html';
  } else if (role === 'customer') {
    window.location.href = 'index.html';
  }

  /* Demo customer account — seeded into ffc_chats so admin inbox sees them */
  const DEMO_CUSTOMER = { name: 'Nguyễn Văn Khách', phone: '0900000001' };
  function seedDemoCustomerThread() {
    const key = 'ffc_chats';
    let all = {};
    try { all = JSON.parse(localStorage.getItem(key) || '{}'); } catch (_) {}
    const k = DEMO_CUSTOMER.phone.replace(/\s/g, '');
    if (!all[k]) {
      const now = new Date().toISOString().slice(0, 16);
      all[k] = {
        name: DEMO_CUSTOMER.name,
        phone: DEMO_CUSTOMER.phone,
        messages: [{
          from: 'system',
          text: `Chào ${DEMO_CUSTOMER.name}, cảm ơn bạn đã liên hệ FFC. Kỹ thuật viên sẽ phản hồi sớm nhất có thể.`,
          at: now
        }],
        customerUnread: 1,
        adminUnread: 0,
        lastAt: now
      };
      localStorage.setItem(key, JSON.stringify(all));
    }
  }

  function login() {
    const u = document.getElementById('loginUser').value.trim().toLowerCase();
    const p = document.getElementById('loginPass').value;

    if (u === 'admin' && p === 'admin') {
      sessionStorage.setItem(ADMIN_KEY, '1');
      sessionStorage.setItem(ROLE_KEY, 'admin');
      window.location.href = 'dashboard.html';
      return;
    }

    if (u === 'khach' && p === 'khach') {
      sessionStorage.setItem(ROLE_KEY, 'customer');
      /* Restore last-saved profile if exists (so name persists across login cycles) */
      const profKey = 'ffc_customer_profile_' + DEMO_CUSTOMER.phone.replace(/\s/g, '');
      let me = { ...DEMO_CUSTOMER };
      try {
        const saved = JSON.parse(localStorage.getItem(profKey) || '{}');
        if (saved.fullname) me.name = saved.fullname;
        if (saved.email)    me.email = saved.email;
        if (saved.address)  me.address = saved.address;
      } catch (_) {}
      sessionStorage.setItem(ME_KEY, JSON.stringify(me));
      seedDemoCustomerThread();
      /* Customer goes back to the normal site — chat widget floats on every page */
      window.location.href = 'index.html';
      return;
    }

    document.getElementById('loginError').textContent = PA_i18n.tr('login.error');
  }

  function logout() {
    sessionStorage.removeItem(ADMIN_KEY);
    sessionStorage.removeItem(ROLE_KEY);
    sessionStorage.removeItem(ME_KEY);
    window.location.href = 'admin.html';
  }

  const EYE_ICON = '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>';
  const EYE_OFF_ICON = '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/>';

  function togglePassword() {
    const pw = document.getElementById('loginPass');
    const icon = document.getElementById('pwEyeIcon');
    const btn = document.getElementById('pwToggle');
    const showing = pw.type === 'password';
    pw.type = showing ? 'text' : 'password';
    icon.innerHTML = showing ? EYE_OFF_ICON : EYE_ICON;
    btn.setAttribute('aria-label', showing ? 'Hide password' : 'Show password');
  }

  /* ---------- Policy modal (PDF viewer) ---------- */
  let pdfZoom = 1;
  function openPolicy(which) {
    const modal = document.getElementById('policyModal');
    const terms = document.getElementById('pdfTerms');
    const priv  = document.getElementById('pdfPrivacy');
    const title = document.getElementById('pdfTitle');

    terms.style.display = which === 'terms' ? 'block' : 'none';
    priv.style.display  = which === 'privacy' ? 'block' : 'none';
    title.textContent   = which === 'terms'
      ? 'Chinh-Sach-Su-Dung.pdf'
      : 'Chinh-Sach-Bao-Mat.pdf';

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.getElementById('pdfPages').scrollTop = 0;
  }

  function closePolicy() {
    document.getElementById('policyModal').classList.remove('open');
    document.body.style.overflow = '';
  }

  function zoomPdf(delta) {
    pdfZoom = Math.max(0.6, Math.min(1.6, pdfZoom + delta));
    document.querySelectorAll('.pdf-page').forEach(p => {
      p.style.transform = `scale(${pdfZoom})`;
      p.style.transformOrigin = 'top center';
    });
  }

  /* ESC to close modal */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePolicy();
  });

  function showApp() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('app').classList.add('shown');
    refresh();
  }

  /* ---------- DATA ---------- */
  function loadChats() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  }
  function saveChats() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  }

  function refresh() {
    chats = loadChats();
    updateStats();
    renderQueue();
    if (activeChatId) renderConversation();
  }

  function updateStats() {
    const waiting = chats.filter(c => c.status === 'waiting_admin').length;
    const active = chats.filter(c => c.status === 'admin_active').length;
    document.getElementById('cnt-waiting').textContent = waiting;
    document.getElementById('cnt-active').textContent = active;
    document.getElementById('cnt-all').textContent = chats.length;
    document.getElementById('totalCount').textContent = chats.length;
    const pill = document.getElementById('urgentPill');
    if (waiting > 0) {
      pill.style.display = 'inline-flex';
      document.getElementById('urgentCount').textContent = waiting;
    } else {
      pill.style.display = 'none';
    }
  }

  function setFilter(f, btn) {
    currentFilter = f;
    document.querySelectorAll('.queue-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    renderQueue();
  }

  function renderQueue() {
    const list = document.getElementById('queueList');
    list.innerHTML = '';

    let filtered = chats;
    if (currentFilter === 'waiting') filtered = chats.filter(c => c.status === 'waiting_admin');
    else if (currentFilter === 'active') filtered = chats.filter(c => c.status === 'admin_active');

    /* Sort: waiting first, then by latest message time */
    filtered = filtered.sort((a, b) => {
      if (a.status === 'waiting_admin' && b.status !== 'waiting_admin') return -1;
      if (b.status === 'waiting_admin' && a.status !== 'waiting_admin') return 1;
      const aTime = a.messages[a.messages.length - 1]?.ts || a.createdAt;
      const bTime = b.messages[b.messages.length - 1]?.ts || b.createdAt;
      return bTime - aTime;
    });

    if (filtered.length === 0) {
      const msg = currentFilter === 'waiting'
        ? PA_i18n.tr('admin.empty.waiting')
        : PA_i18n.tr('admin.empty.all');
      list.innerHTML = `
        <div class="empty-queue">
          <div class="icon">${currentFilter === 'waiting' ? '✓' : '💬'}</div>
          <div>${msg}</div>
        </div>
      `;
      return;
    }

    filtered.forEach(c => {
      const lastUserMsg = [...c.messages].reverse().find(m => m.role === 'user');
      const lastTime = c.messages[c.messages.length - 1]?.ts || c.createdAt;
      const item = document.createElement('div');
      item.className = 'queue-item' + (c.id === activeChatId ? ' active' : '');
      item.onclick = () => selectChat(c.id);
      const statusClass = c.status === 'waiting_admin' ? 'status-waiting'
                        : c.status === 'admin_active'  ? 'status-active'
                        : 'status-bot';
      const statusKey = c.status === 'waiting_admin' ? 'admin.status.waiting'
                      : c.status === 'admin_active'  ? 'admin.status.active'
                      : 'admin.status.bot';
      item.innerHTML = `
        <div class="queue-item-top">
          <div class="queue-item-user">
            <div class="queue-item-avatar">U</div>
            <span>${PA_i18n.tr('admin.student')} #${c.id.slice(-4)}</span>
          </div>
          <span class="queue-item-time">${timeAgo(lastTime)}</span>
        </div>
        <div class="queue-item-preview">${escapeHtml(lastUserMsg?.text || c.title)}</div>
        <span class="queue-item-status ${statusClass}">${PA_i18n.tr(statusKey)}</span>
      `;
      list.appendChild(item);
    });
  }

  function selectChat(id) {
    activeChatId = id;
    /* Mark as admin_active when admin opens */
    const chat = chats.find(c => c.id === id);
    if (chat && chat.status === 'waiting_admin') {
      chat.status = 'admin_active';
      saveChats();
    }
    renderQueue();
    renderConversation();
    updateStats();
  }

  function renderConversation() {
    const conv = document.getElementById('conversation');
    const chat = chats.find(c => c.id === activeChatId);
    if (!chat) return;

    const t = (k) => PA_i18n.tr(k);
    conv.innerHTML = `
      <div class="conv-header">
        <div class="conv-header-left">
          <div class="msg-avatar" style="width:36px;height:36px;background:var(--neutral-800);font-size:13px;">U</div>
          <div class="conv-header-info">
            <div class="name">${t('admin.student')} #${chat.id.slice(-4)}</div>
            <div class="meta">${t('admin.started')} ${timeAgo(chat.createdAt)} · ${chat.messages.length} ${t('admin.messages')}</div>
          </div>
        </div>
        <div class="conv-actions">
          <button onclick="markResolved()">${t('admin.resolve')}</button>
        </div>
      </div>
      <div class="conv-messages">
        <div class="conv-messages-inner" id="convMessages"></div>
      </div>
      <div class="reply-wrap">
        <div class="reply-wrap-inner">
          <div class="reply-templates">
            <button class="template-chip" onclick="useTemplate(PA_i18n.tr('admin.template.greet_text'))">${t('admin.template.greet')}</button>
            <button class="template-chip" onclick="useTemplate(PA_i18n.tr('admin.template.refer_text'))">${t('admin.template.refer')}</button>
            <button class="template-chip" onclick="useTemplate(PA_i18n.tr('admin.template.cite_text'))">${t('admin.template.cite')}</button>
            <button class="template-chip" onclick="useTemplate(PA_i18n.tr('admin.template.disclaimer_text'))">${t('admin.template.disclaimer')}</button>
          </div>
          <div class="reply-bar">
            <textarea id="replyInput" placeholder="${t('admin.reply.placeholder')}" rows="1"
              oninput="autoGrow(this); document.getElementById('replyBtn').disabled=!this.value.trim();"
              onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendReply();}"></textarea>
            <button class="reply-send" id="replyBtn" onclick="sendReply()" disabled>${t('btn.send')}</button>
          </div>
        </div>
      </div>
    `;

    const inner = document.getElementById('convMessages');
    chat.messages.forEach(m => {
      const msg = document.createElement('div');
      msg.className = 'msg ' + m.role;
      const av = m.role === 'user' ? 'U'
              : m.role === 'admin' ? '👨‍⚕️'
              : 'PA';
      msg.innerHTML = `
        <div class="msg-avatar">${av}</div>
        <div class="msg-bubble">${escapeHtml(m.text)}</div>
      `;
      inner.appendChild(msg);
    });
    inner.parentElement.scrollTop = inner.parentElement.scrollHeight;
  }

  function autoGrow(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  }

  function useTemplate(text) {
    const ta = document.getElementById('replyInput');
    ta.value = text;
    ta.focus();
    autoGrow(ta);
    document.getElementById('replyBtn').disabled = false;
  }

  function sendReply() {
    const ta = document.getElementById('replyInput');
    const text = ta.value.trim();
    if (!text || !activeChatId) return;
    const chat = chats.find(c => c.id === activeChatId);
    chat.messages.push({ role: 'admin', text, ts: Date.now() });
    chat.status = 'admin_active';
    saveChats();
    ta.value = '';
    ta.style.height = 'auto';
    document.getElementById('replyBtn').disabled = true;
    renderConversation();
    renderQueue();
    updateStats();
  }

  function markResolved() {
    const chat = chats.find(c => c.id === activeChatId);
    if (!chat) return;
    chat.messages.push({ role: 'system', text: PA_i18n.tr('admin.resolved_msg'), ts: Date.now() });
    chat.status = 'resolved';
    saveChats();
    renderConversation();
    renderQueue();
    updateStats();
  }

  function timeAgo(ts) {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60)    return PA_i18n.tr('time.now');
    if (s < 3600)  return Math.floor(s / 60)    + ' ' + PA_i18n.tr('time.minutes');
    if (s < 86400) return Math.floor(s / 3600)  + ' ' + PA_i18n.tr('time.hours');
    return Math.floor(s / 86400) + ' ' + PA_i18n.tr('time.days');
  }

  /* ---------- Language switcher ---------- */
  function toggleLangDropdown(e) {
    e.stopPropagation();
    document.getElementById('langDropdown').classList.toggle('open');
  }

  function changeLang(lang) {
    PA_i18n.setLang(lang);
    updateLangUI();
    document.getElementById('langDropdown').classList.remove('open');
    /* Re-render dynamic UI parts */
    if (document.getElementById('app').classList.contains('shown')) refresh();
  }

  /* SVG flags — accurate Vietnam (red + yellow 5-point star) and UK Union Jack */
  const FLAG_VN = `<svg viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <rect width="30" height="20" fill="#DA251D"/>
    <polygon points="15,5.5 16.47,10 21.21,10 17.37,12.78 18.84,17.28 15,14.5 11.16,17.28 12.63,12.78 8.79,10 13.53,10" fill="#FFFF00"/>
  </svg>`;
  const FLAG_UK = `<svg viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <clipPath id="t"><rect width="60" height="30"/></clipPath>
    <rect width="60" height="30" fill="#012169"/>
    <g clip-path="url(#t)">
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" stroke-width="6"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" stroke-width="3"/>
      <path d="M30,0 V30 M0,15 H60" stroke="#FFFFFF" stroke-width="10"/>
      <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" stroke-width="6"/>
    </g>
  </svg>`;

  function updateLangUI() {
    const lang = PA_i18n.getLang();
    const trigger = document.getElementById('langTrigger');
    document.getElementById('langCurrentLabel').textContent = lang === 'en' ? 'ENG' : 'VIE';
    trigger.classList.toggle('en', lang === 'en');
    document.getElementById('checkVi').style.display = lang === 'vi' ? 'inline' : 'none';
    document.getElementById('checkEn').style.display = lang === 'en' ? 'inline' : 'none';
    /* Inject SVG flags */
    document.getElementById('langTriggerFlag').innerHTML = lang === 'en' ? FLAG_UK : FLAG_VN;
    document.getElementById('flagVie').innerHTML = FLAG_VN;
    document.getElementById('flagEng').innerHTML = FLAG_UK;
  }

  /* Close lang dropdown on outside click */
  document.addEventListener('click', () => {
    document.getElementById('langDropdown')?.classList.remove('open');
  });

  /* React to language changes from other tabs */
  window.addEventListener('langchange', () => {
    updateLangUI();
    if (document.getElementById('app').classList.contains('shown')) refresh();
  });

  updateLangUI();

  function escapeHtml(s) {
    return (s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  /* ---------- Real-time sync ---------- */
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) refresh();
  });

  /* Auto-refresh time labels every 30s */
  setInterval(refresh, 30000);
