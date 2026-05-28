/* ===========================================================
 * FFC — Cross-page notification system
 * -----------------------------------------------------------
 * Lắng nghe sự kiện chat (BroadcastChannel + storage event) và
 * hiện toast popup ở góc phải trên bất kỳ trang nào load module.
 *
 * Quy tắc hiển thị:
 *   - role 'admin'    → notify khi customer nhắn
 *   - role 'customer' → notify khi admin/KTV nhắn
 *   - không role      → notify khi customer nhắn (như admin)
 *
 * Click toast:
 *   - Trên index.html  → mở chat panel
 *   - Trên dashboard   → đi tới pane 'support' và mở thread
 *   - Trên admin       → redirect dashboard
 *   - Trên chat.html   → cuộn xuống tin nhắn
 * =========================================================== */

(function () {
  const CHAT_KEY    = 'ffc_chats';
  /* IMPORTANT: seen counts MUST be per-tab (sessionStorage), not shared.
     Otherwise sender's own tab advances the counter before receiver checks. */
  const SEEN_KEY    = 'ffc_notif_seen_counts'; /* sessionStorage — per tab */
  const ROLE_KEY    = 'ffc_role';
  const TOAST_TTL_MS = 6000;

  /* ===== Utilities ===== */
  function loadChats() {
    try { return JSON.parse(localStorage.getItem(CHAT_KEY) || '{}'); }
    catch (_) { return {}; }
  }
  function getRole() { return sessionStorage.getItem(ROLE_KEY); }
  function getSeenCounts() {
    try { return JSON.parse(sessionStorage.getItem(SEEN_KEY) || '{}'); }
    catch (_) { return {}; }
  }
  function setSeenCounts(obj) { sessionStorage.setItem(SEEN_KEY, JSON.stringify(obj)); }

  /* Parse chat timestamp ('YYYY-MM-DDTHH:mm' was UTC but lost the Z). */
  function parseTime(s) {
    if (!s) return 0;
    if (typeof s === 'number') return s;
    let str = String(s);
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(str)) str = str + ':00Z';
    else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(str)) str = str + 'Z';
    const t = Date.parse(str);
    return isNaN(t) ? 0 : t;
  }

  function timeAgo(ts) {
    const diff = (Date.now() - ts) / 1000;
    if (diff < 30)     return 'vừa xong';
    if (diff < 60)     return Math.floor(diff) + ' giây trước';
    if (diff < 3600)   return Math.floor(diff / 60) + ' phút trước';
    if (diff < 86400)  return Math.floor(diff / 3600) + ' giờ trước';
    return Math.floor(diff / 86400) + ' ngày trước';
  }

  /* ===== Container ===== */
  let stackEl = null;
  function ensureStack() {
    if (stackEl) return stackEl;
    stackEl = document.createElement('div');
    stackEl.className = 'ffc-notif-stack';
    stackEl.id = 'ffcNotifStack';
    document.body.appendChild(stackEl);
    return stackEl;
  }

  /* ===== Audio (subtle ping when notification appears) ===== */
  let audioCtx = null;
  function playPing() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch (_) { /* audio blocked → silent */ }
  }

  /* ===== Render a single toast ===== */
  function showToast({ title, preview, meta, time, urgent, onClick }) {
    ensureStack();
    const t = document.createElement('div');
    t.className = 'ffc-notif' + (urgent ? ' urgent' : '');
    t.innerHTML = `
      <div class="ffc-notif-icon">
        <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <span class="pulse"></span>
      </div>
      <div class="ffc-notif-body">
        <div class="ffc-notif-title">
          <span>${escapeHtml(title)}</span>
          ${meta ? `<span class="ffc-notif-meta">${escapeHtml(meta)}</span>` : ''}
        </div>
        <div class="ffc-notif-preview">${escapeHtml(preview)}</div>
        <div class="ffc-notif-time">${escapeHtml(time || 'vừa xong')}</div>
      </div>
      <button class="ffc-notif-close" aria-label="Đóng">×</button>
    `;
    stackEl.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));

    const dismiss = () => {
      t.classList.remove('show');
      t.classList.add('hide');
      setTimeout(() => t.remove(), 350);
    };
    t.querySelector('.ffc-notif-close').addEventListener('click', (e) => {
      e.stopPropagation();
      dismiss();
    });
    t.addEventListener('click', () => {
      if (typeof onClick === 'function') onClick();
      dismiss();
    });

    setTimeout(dismiss, TOAST_TTL_MS);
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[c]);
  }

  /* ===== Determine current page & click action ===== */
  function getCurrentPage() {
    const p = location.pathname.split('/').pop().toLowerCase();
    if (p.includes('dashboard')) return 'dashboard';
    if (p.includes('admin'))     return 'admin';
    if (p.includes('chat'))      return 'chat';
    return 'index';
  }

  function clickAction(threadKey, role) {
    return function () {
      const page = getCurrentPage();
      const isAdmin = role !== 'customer'; /* admin / KTV / not-logged-in viewing dashboard */
      dlog('click — page:', page, '· role:', role, '· isAdmin:', isAdmin, '· threadKey:', threadKey);

      /* === ADMIN / KTV === Always go to dashboard chat with that specific customer */
      if (isAdmin) {
        if (page === 'dashboard') {
          /* Already in dashboard — just switch pane + open thread */
          if (typeof window.goPane === 'function') window.goPane('support');
          setTimeout(() => {
            if (typeof window.openChat === 'function') window.openChat(threadKey);
          }, 250);
        } else {
          /* Anywhere else (index, admin, chat) — redirect to dashboard with target */
          sessionStorage.setItem('ffc_notif_open_thread', threadKey);
          location.href = 'dashboard.html#support';
        }
        return;
      }

      /* === CUSTOMER === Open chat panel (Hỗ trợ FFC widget) on index */
      if (page === 'index') {
        if (typeof window.toggleChatPanel === 'function') window.toggleChatPanel(true);
      } else if (page === 'chat') {
        const msgs = document.querySelector('.chat-messages, #chatMessages, .chat-panel-msgs');
        if (msgs) msgs.scrollTop = msgs.scrollHeight;
      } else {
        /* Customer on admin.html somehow — send back to index */
        location.href = 'index.html';
      }
    };
  }

  /* ===== Detect new messages relevant to current viewer ===== */
  const DEBUG = true; /* set false to silence console logs */
  function dlog(...args) { if (DEBUG) console.log('[FFCNotif]', ...args); }

  function checkAndNotify() {
    const role = getRole();
    const chats = loadChats();
    const seen = getSeenCounts();
    const newMsgs = [];
    let changed = false;

    dlog('check — role:', role, '· threads:', Object.keys(chats).length, '· seen:', seen);

    Object.entries(chats).forEach(([key, thread]) => {
      if (!thread || !Array.isArray(thread.messages)) return;
      const lastIdx = seen[key] || 0;
      const total = thread.messages.length;
      if (total <= lastIdx) return;

      /* Iterate only new messages since last notification */
      for (let i = lastIdx; i < total; i++) {
        const msg = thread.messages[i];
        if (!msg) continue;

        /* Filter by role */
        let relevant = false;
        if (role === 'customer' && msg.from === 'admin')    relevant = true;
        if (role !== 'customer' && msg.from === 'customer') relevant = true;
        if (!relevant) continue;

        const ts = parseTime(msg.at) || Date.now();
        newMsgs.push({
          threadKey: key,
          customer:  thread.customer || thread.name || (msg.from === 'admin' ? 'KTV' : 'Khách hàng'),
          phone:     thread.phone || '',
          text:      msg.text || '',
          ts,
        });
        dlog('  NEW msg #' + i, '· from:', msg.from, '· text:', (msg.text || '').slice(0, 30));
      }

      /* Always advance pointer so we don't re-notify (even non-relevant msgs) */
      seen[key] = total;
      changed = true;
    });

    if (changed) setSeenCounts(seen);

    if (!newMsgs.length) { dlog('  no relevant new messages'); return; }

    /* Group by thread; show latest message per thread to avoid toast spam */
    const byThread = {};
    newMsgs.forEach((m) => {
      if (!byThread[m.threadKey] || m.ts > byThread[m.threadKey].ts) {
        byThread[m.threadKey] = m;
      }
    });

    Object.values(byThread).slice(0, 3).forEach((m) => {
      const isAdminView = role !== 'customer';
      const title = isAdminView ? `Tin nhắn từ ${m.customer}` : 'Tin nhắn mới từ KTV';
      showToast({
        title,
        meta:    m.phone || (isAdminView ? 'Khách hàng' : 'FFC'),
        preview: m.text,
        time:    timeAgo(m.ts),
        onClick: clickAction(m.threadKey, role),
      });
      /* When tab is hidden, also fire OS-level notification (if permission granted) */
      if (document.hidden && 'Notification' in window && Notification.permission === 'granted') {
        try {
          const n = new Notification(title, { body: m.text, tag: m.threadKey });
          n.onclick = () => { window.focus(); clickAction(m.threadKey, role)(); n.close(); };
        } catch (_) {}
      }
    });

    playPing();
  }

  /* ===== Listeners ===== */
  function init() {
    /* On first tab open (sessionStorage empty), seed with current message counts.
       After refresh, sessionStorage persists → don't reseed → new msgs still detected. */
    if (!sessionStorage.getItem(SEEN_KEY)) {
      const initial = {};
      const chats = loadChats();
      Object.entries(chats).forEach(([key, thread]) => {
        if (thread && Array.isArray(thread.messages)) initial[key] = thread.messages.length;
      });
      setSeenCounts(initial);
      dlog('init: first open, seeded seen counts:', initial);
    } else {
      dlog('init: refresh, kept existing counts:', getSeenCounts());
    }
    dlog('init: ready on', getCurrentPage(), '· role:', getRole());

    /* Request browser-level notification permission (silent if denied) */
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }

    /* If user clicked a notification on admin.html and was sent here,
       sessionStorage has the target thread → open it after dashboard inits. */
    if (getCurrentPage() === 'dashboard') {
      const pending = sessionStorage.getItem('ffc_notif_open_thread');
      if (pending) {
        sessionStorage.removeItem('ffc_notif_open_thread');
        setTimeout(() => {
          if (typeof window.goPane === 'function') window.goPane('support');
          setTimeout(() => {
            if (typeof window.openChat === 'function') window.openChat(pending);
          }, 250);
        }, 400);
      }
    }

    /* BroadcastChannel — fires when any tab updates chats */
    try {
      const bc = new BroadcastChannel('ffc_chats');
      bc.addEventListener('message', (e) => {
        dlog('BroadcastChannel fired', e.data);
        setTimeout(checkAndNotify, 50);
      });
      dlog('BroadcastChannel subscribed');
    } catch (err) { dlog('BroadcastChannel error:', err.message); }

    /* Storage event — fires on OTHER tabs when localStorage changes */
    window.addEventListener('storage', (e) => {
      if (e.key === CHAT_KEY) {
        dlog('storage event fired for ffc_chats');
        setTimeout(checkAndNotify, 50);
      }
    });

    /* When tab becomes visible again, re-check (in case events were missed) */
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        dlog('tab visible, re-checking');
        checkAndNotify();
      }
    });

    /* Immediate check on load — catches messages that arrived during refresh */
    setTimeout(checkAndNotify, 200);

    /* Periodic check (some browsers don't fire storage in same tab) */
    setInterval(checkAndNotify, 4000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ===== Expose for manual testing ===== */
  window.FFCNotif = {
    test: function (msg) {
      showToast({
        title:   'Tin nhắn từ Khách Test',
        meta:    '0901 234 567',
        preview: msg || 'Anh ơi cho em hỏi phiếu sửa của em đến đâu rồi ạ?',
        time:    'vừa xong',
        onClick: () => console.log('Notification clicked'),
      });
      playPing();
    },
    check: checkAndNotify,
    reset: () => {
      localStorage.removeItem(SEEN_KEY);
      console.log('[FFCNotif] reset: seen counts cleared, next check() will re-notify all messages');
    },
  };
})();
