  /* ============================================================
     Shared storage with dashboard's admin inbox.
     ============================================================ */
  const CHAT_KEY = 'ffc_chats';
  const ME_KEY   = 'ffc_customer_me'; /* { phone, name } */
  const THEME_KEY = 'ffc_theme';

  const phoneKey = (p) => (p || '').replace(/\s/g, '');

  function loadChats() {
    try { return JSON.parse(localStorage.getItem(CHAT_KEY) || '{}'); }
    catch (_) { return {}; }
  }
  function saveChats(obj) { localStorage.setItem(CHAT_KEY, JSON.stringify(obj)); }
  function loadMe() {
    try { return JSON.parse(sessionStorage.getItem(ME_KEY) || 'null'); }
    catch (_) { return null; }
  }
  function saveMe(me) { sessionStorage.setItem(ME_KEY, JSON.stringify(me)); }
  function escapeHtml(s) {
    return (s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  /* ============================================================
     Identity flow — ask phone on first visit, persist in localStorage.
     ============================================================ */
  function showIdentityPrompt() {
    document.getElementById('identityPrompt').classList.add('open');
    setTimeout(() => document.getElementById('promptPhone').focus(), 200);
  }
  function hideIdentityPrompt() {
    document.getElementById('identityPrompt').classList.remove('open');
  }
  function confirmIdentity() {
    const phone = document.getElementById('promptPhone').value.trim();
    const name  = document.getElementById('promptName').value.trim() || 'Khách hàng';
    if (!phone) return;
    saveMe({ phone, name });
    hideIdentityPrompt();
    renderIdentity();
    /* Ensure this customer's thread exists in storage */
    ensureThread();
    render();
  }
  function switchIdentity() {
    showIdentityPrompt();
    const me = loadMe();
    if (me) {
      document.getElementById('promptPhone').value = me.phone;
      document.getElementById('promptName').value  = me.name;
    }
  }
  function renderIdentity() {
    const me = loadMe();
    const bar = document.getElementById('identityBar');
    if (me) {
      document.getElementById('youLabel').textContent = `${me.name} · ${me.phone}`;
      bar.style.display = '';
    } else {
      bar.style.display = 'none';
    }
  }

  function ensureThread() {
    const me = loadMe();
    if (!me) return;
    const all = loadChats();
    const k = phoneKey(me.phone);
    if (!all[k]) {
      all[k] = {
        name: me.name, phone: me.phone,
        messages: [],
        customerUnread: 0, adminUnread: 0, lastAt: ''
      };
      saveChats(all);
    } else if (all[k].name !== me.name) {
      /* Update name if customer changed it */
      all[k].name = me.name;
      saveChats(all);
    }
  }

  /* ============================================================
     Render thread
     ============================================================ */
  function render() {
    const me = loadMe();
    const msgs = document.getElementById('msgs');
    if (!me) {
      msgs.innerHTML = `
        <div class="empty">
          <div class="ic"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
          <h2 data-i18n="chat.welcome.title">Chào mừng đến với FFC</h2>
          <p data-i18n="chat.welcome.sub">Vui lòng nhập thông tin để bắt đầu nhắn với kỹ thuật viên.</p>
        </div>
      `;
      if (window.PA_i18n) PA_i18n.applyTranslations();
      return;
    }
    const all = loadChats();
    const c = all[phoneKey(me.phone)];

    if (!c || !c.messages.length) {
      msgs.innerHTML = `
        <div class="empty">
          <div class="ic"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
          <h2 data-i18n="chat.start.title">Hỏi gì cũng được</h2>
          <p data-i18n="chat.start.sub">Kỹ thuật viên FFC sẽ phản hồi nhanh chóng. Bạn có thể bắt đầu bằng các gợi ý:</p>
          <div class="suggest">
            <button onclick="quickSend(this.textContent)">Khi nào lấy được máy?</button>
            <button onclick="quickSend(this.textContent)">Cho em xem báo giá</button>
            <button onclick="quickSend(this.textContent)">Bảo hành bao lâu?</button>
            <button onclick="quickSend(this.textContent)">Địa chỉ shop ở đâu?</button>
          </div>
        </div>
      `;
      if (window.PA_i18n) PA_i18n.applyTranslations();
      return;
    }

    msgs.innerHTML = c.messages.map(m => {
      const time = (m.at || '').slice(11, 16);
      const cls = m.from;
      const author = m.from === 'system' ? '⚙ Hệ thống: ' : '';
      return `<div class="msg ${cls}">${author ? `<strong>${author}</strong>` : ''}${escapeHtml(m.text)}<span class="at">${time}</span></div>`;
    }).join('');

    msgs.scrollTop = msgs.scrollHeight;

    /* Mark as read on customer side */
    if (c.customerUnread) {
      c.customerUnread = 0;
      all[phoneKey(me.phone)] = c;
      saveChats(all);
    }
  }

  function quickSend(text) {
    document.getElementById('replyInput').value = text;
    send();
  }

  function send() {
    const me = loadMe();
    if (!me) { showIdentityPrompt(); return; }
    const input = document.getElementById('replyInput');
    const text = input.value.trim();
    if (!text) return;

    const all = loadChats();
    const k = phoneKey(me.phone);
    if (!all[k]) {
      all[k] = { name: me.name, phone: me.phone, messages: [], customerUnread: 0, adminUnread: 0, lastAt: '' };
    }
    const now = new Date().toISOString().slice(0, 16);
    all[k].messages.push({ from: 'customer', text, at: now });
    all[k].adminUnread = (all[k].adminUnread || 0) + 1;
    all[k].lastAt = now;
    saveChats(all);

    input.value = '';
    render();

    /* Auto-reply from "bot" after a short delay if no real admin response.
       Demo flavor — in production this would be removed in favor of waiting
       for a real KTV reply. */
    setTimeout(() => maybeAutoReply(k), 1500);
  }

  function maybeAutoReply(k) {
    const all = loadChats();
    const c = all[k];
    if (!c) return;
    const last = c.messages[c.messages.length - 1];
    if (!last || last.from !== 'customer') return; /* already replied */
    const lt = last.text.toLowerCase();
    let reply = null;
    if (/(khi nào|bao giờ|lấy)/.test(lt))
      reply = 'Xin lỗi anh/chị, kỹ thuật viên đang bận. Em sẽ kiểm tra phiếu và phản hồi trong vài phút. Nếu gấp anh/chị gọi 1900-xxxx ạ.';
    else if (/(giá|báo giá|bao nhiêu)/.test(lt))
      reply = 'Báo giá tham khảo: Thay pin iPhone 720k–1.2tr, Thay màn 800k–4.5tr, Vệ sinh laptop 300k. Giá chính xác cần KTV kiểm tra trực tiếp.';
    else if (/(bảo hành|warranty)/.test(lt))
      reply = 'FFC bảo hành: Linh kiện chính hãng 6–12 tháng, linh kiện tương đương 3 tháng, vệ sinh/nâng cấp 1 tháng. Không áp dụng cho vào nước hoặc rơi vỡ.';
    else if (/(địa chỉ|ở đâu|map)/.test(lt))
      reply = 'FFC có chi nhánh tại Q.1 (123 Nguyễn Huệ) và Q.10 (456 Sư Vạn Hạnh). Giờ mở cửa 8h–21h hàng ngày.';

    if (reply) {
      const now = new Date().toISOString().slice(0, 16);
      c.messages.push({ from: 'admin', text: reply, at: now });
      c.customerUnread = (c.customerUnread || 0) + 1;
      c.lastAt = now;
      all[k] = c;
      saveChats(all);
      render();
    }
  }

  /* ============================================================
     Cross-tab sync — admin replies in another tab → update here
     ============================================================ */
  window.addEventListener('storage', (e) => {
    if (e.key === CHAT_KEY) render();
    if (e.key === THEME_KEY) {
      if (e.newValue === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
      else document.documentElement.removeAttribute('data-theme');
      syncThemeIcons();
    }
  });

  /* ============================================================
     Logout (customer side) — clears identity + role, back to login
     ============================================================ */
  function logout() {
    if (!confirm('Đăng xuất khỏi tài khoản khách hàng?')) return;
    sessionStorage.removeItem('ffc_role');
    sessionStorage.removeItem('ffc_customer_me');
    window.location.href = 'admin.html';
  }

  /* ============================================================
     Theme toggle
     ============================================================ */
  function syncThemeIcons() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    const sun = document.getElementById('themeSun');
    const moon = document.getElementById('themeMoon');
    if (sun)  sun.style.display  = dark ? 'block' : 'none';
    if (moon) moon.style.display = dark ? 'none'  : 'block';
  }
  function toggleTheme() {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    if (next === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
    localStorage.setItem(THEME_KEY, next);
    syncThemeIcons();
  }

  /* ============================================================
     Init
     ============================================================ */
  syncThemeIcons();
  const me = loadMe();
  if (!me) {
    showIdentityPrompt();
  } else {
    ensureThread();
  }
  renderIdentity();
  render();
