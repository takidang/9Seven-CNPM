/* ============ Block 1: lines 5800-6350 ============ */
  // Tab switching for hero
  document.querySelectorAll('.hero-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.hero-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  /* ==================== AUTH STATE SYNC ====================
     admin.html stores `pa_admin_logged_in` in localStorage when expert logs in.
     Here we check that state and adjust the header accordingly. */
  const ADMIN_KEY = 'pa_admin_logged_in';

  function renderHeaderAuth() {
    const headerActions = document.getElementById('headerActions');
    if (!headerActions) return;

    const loggedIn = sessionStorage.getItem(ADMIN_KEY) === '1';
    const role = sessionStorage.getItem('ffc_role'); /* 'admin' | 'customer' | null */
    const customerMe = (() => { try { return JSON.parse(sessionStorage.getItem('ffc_customer_me') || 'null'); } catch (_) { return null; } })();
    const t = (k) => window.PA_i18n ? PA_i18n.tr(k) : k;
    const themeBtnHtml = `
      <button class="theme-toggle" id="themeToggle" onclick="toggleTheme()" title="Đổi giao diện sáng/tối" aria-label="Đổi giao diện sáng/tối">
        <svg id="themeSun" viewBox="0 0 24 24" style="display:none"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.05" y2="7.05"/><line x1="16.95" y1="16.95" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.05" y2="16.95"/><line x1="16.95" y1="7.05" x2="19.07" y2="4.93"/></svg>
        <svg id="themeMoon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      </button>
    `;
    const langPillHtml = themeBtnHtml + `
      <button class="lang-pill-btn" id="langPillBtn" onclick="toggleLanguage()">
        <span class="flag"></span>
        <span id="langCurrentLabel">VIE</span>
      </button>
    `;

    if (loggedIn) {
      /* Read latest profile data so the header reflects edited name/avatar */
      const profile = (typeof loadProfile === 'function') ? loadProfile() : { fullname: 'Sam Phạm' };
      const initials = (profile.fullname || 'PA')
        .split(/\s+/).map(w => w[0]).slice(-2).join('').toUpperCase();
      const avatarInner = profile.avatar
        ? `<img src="${profile.avatar}" alt="">`
        : initials;

      headerActions.innerHTML = `
        ${langPillHtml}
        <a href="dashboard.html" class="btn btn-primary" style="gap:8px;">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/>
            <rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>
          </svg>
          ${t('user.dashboard')}
        </a>
        <div class="user-menu">
          <button class="user-trigger" onclick="toggleUserDropdown(event)">
            <div class="avatar">${avatarInner}</div>
            <div style="display:flex; flex-direction:column; line-height:1.1; align-items:flex-start;">
              <span class="name">${profile.fullname || 'User'}</span>
              <span class="role-tag">${t('user.role')}</span>
            </div>
            <span class="chevron">▾</span>
          </button>
          <div class="user-dropdown" id="userDropdown">
            <a href="dashboard.html">${t('user.dashboard')}</a>
            <a href="dashboard.html#support">${t('user.chat')}</a>
            <button onclick="openModal('profile')">${t('user.profile')}</button>
            <button onclick="openModal('settings')">${t('user.settings')}</button>
            <div class="divider"></div>
            <button class="logout" onclick="doLogout()">${t('btn.logout')}</button>
          </div>
        </div>
      `;
    } else if (role === 'customer' && customerMe) {
      /* Customer logged in — show a compact user pill (no dashboard link).
         Floating chat widget covers the "Hỗ trợ" need, so this is just
         account identity + logout. */
      const initials = (customerMe.name || 'KH').split(/\s+/).map(w => w[0]).slice(-2).join('').toUpperCase();
      headerActions.innerHTML = `
        ${langPillHtml}
        <button class="btn btn-primary" onclick="toggleChatPanel(true)" style="gap:8px;">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          ${t('chat.title') || 'Chat hỗ trợ'}
        </button>
        <div class="user-menu">
          <button class="user-trigger" onclick="toggleUserDropdown(event)">
            <div class="avatar">${initials}</div>
            <div style="display:flex; flex-direction:column; line-height:1.1; align-items:flex-start;">
              <span class="name">${customerMe.name}</span>
              <span class="role-tag" style="background: rgba(34,197,94,0.15); color:#16A34A;">KHÁCH HÀNG</span>
            </div>
            <span class="chevron">▾</span>
          </button>
          <div class="user-dropdown" id="userDropdown">
            <button onclick="openMyTickets()">📋 Phiếu sửa của tôi</button>
            <button onclick="toggleChatPanel(true)">💬 Chat với KTV</button>
            <button onclick="openModal('profile')">${t('user.profile')}</button>
            <button onclick="openModal('settings')">${t('user.settings')}</button>
            <div style="padding:8px 14px; font-size:12px; color:var(--neutral-500); border-top: 1px solid var(--neutral-200); border-bottom: 1px solid var(--neutral-200);">📞 ${customerMe.phone}</div>
            <button class="logout" onclick="doCustomerLogout()">${t('btn.logout')}</button>
          </div>
        </div>
      `;
    } else {
      headerActions.innerHTML = `
        ${langPillHtml}
        <a href="admin.html" class="btn btn-outline">${t('btn.signin')}</a>
        <a href="#" class="btn btn-primary" onclick="event.preventDefault(); openBookingModal();">${t('btn.start')}</a>
      `;
    }
    updateLangPill();
    if (typeof syncThemeIcons === 'function') syncThemeIcons();
  }

  function doCustomerLogout() {
    if (!confirm('Đăng xuất khỏi tài khoản khách hàng?')) return;
    sessionStorage.removeItem('ffc_role');
    sessionStorage.removeItem('ffc_customer_me');
    /* Close the chat panel — Gizmo itself stays visible (helper for everyone) */
    const panel = document.getElementById('chatPanel');
    if (panel) panel.classList.remove('open');
    renderHeaderAuth();
  }

  function toggleLanguage() {
    const cur = PA_i18n.getLang();
    PA_i18n.setLang(cur === 'vi' ? 'en' : 'vi');
    renderHeaderAuth();
  }

  /* ============================================================
     THEME (light / dark) — shared with dashboard via `ffc_theme` key.
     Theme is applied pre-paint in <head>; here we wire the toggle button
     and keep the sun/moon icons in sync.
     ============================================================ */
  const THEME_KEY = 'ffc_theme';
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
  /* Cross-tab sync — when dashboard toggles theme in another tab */
  window.addEventListener('storage', (e) => {
    if (e.key !== THEME_KEY) return;
    if (e.newValue === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
    syncThemeIcons();
  });
  syncThemeIcons();

  /* Proper SVG flags */
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

  function updateLangPill() {
    const lang = PA_i18n ? PA_i18n.getLang() : 'vi';
    const pill = document.getElementById('langPillBtn');
    const label = document.getElementById('langCurrentLabel');
    if (label) label.textContent = lang === 'en' ? 'ENG' : 'VIE';
    if (pill) {
      pill.classList.toggle('en', lang === 'en');
      const flag = pill.querySelector('.flag');
      if (flag) flag.innerHTML = lang === 'en' ? FLAG_UK : FLAG_VN;
    }
  }

  function toggleUserDropdown(e) {
    e.stopPropagation();
    document.getElementById('userDropdown').classList.toggle('open');
  }

  function doLogout() {
    sessionStorage.removeItem(ADMIN_KEY);
    renderHeaderAuth();
  }

  /* Close dropdown when clicking outside */
  document.addEventListener('click', () => {
    document.getElementById('userDropdown')?.classList.remove('open');
  });

  /* React to login + profile changes from other tabs.
     PROFILE_KEY is declared later in this script — safe to reference here
     because the listener body only runs after a storage event fires. */
  window.addEventListener('storage', (e) => {
    if (e.key === ADMIN_KEY || e.key === PROFILE_KEY) {
      renderHeaderAuth();
      /* If the profile modal is open elsewhere, refresh its hero too. */
      if (document.getElementById('profileModal')?.classList.contains('open')) {
        updateProfileHero(loadProfile());
      }
    }
  });

  /* Polling fallback: file:// URLs don't fire `storage` events across tabs
     in Chrome/Safari. Poll localStorage so dual-monitor users still see
     same-account changes propagate. */
  let _lastAuthSnapshot = sessionStorage.getItem(ADMIN_KEY) + '|' + (localStorage.getItem('pa_profile') || '');
  setInterval(() => {
    const snap = sessionStorage.getItem(ADMIN_KEY) + '|' + (localStorage.getItem('pa_profile') || '');
    if (snap !== _lastAuthSnapshot) {
      _lastAuthSnapshot = snap;
      renderHeaderAuth();
      if (document.getElementById('profileModal')?.classList.contains('open')) {
        updateProfileHero(loadProfile());
      }
    }
  }, 1500);

  /* React to language changes */
  window.addEventListener('langchange', () => renderHeaderAuth());

  /* ==================== MODAL OPEN/CLOSE ==================== */
  function openModal(name) {
    document.getElementById('userDropdown')?.classList.remove('open');
    document.getElementById(name + 'Modal').classList.add('open');
    document.body.style.overflow = 'hidden';
    if (name === 'settings') updateLangOptions();
  }
  function closeModal(name) {
    document.getElementById(name + 'Modal').classList.remove('open');
    document.body.style.overflow = '';
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal('profile');
      closeModal('settings');
    }
  });

  /* ==================== SETTINGS MENU TABS ==================== */
  document.querySelectorAll('.settings-menu button').forEach(btn => {
    btn.addEventListener('click', () => {
      const sec = btn.dataset.section;
      document.querySelectorAll('.settings-menu button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.settings-content > section').forEach(s => s.classList.remove('active'));
      document.querySelector(`[data-pane="${sec}"]`).classList.add('active');
    });
  });

  /* ==================== THEME PICKER (visual only) ==================== */
  document.querySelectorAll('.theme-option[data-theme]').forEach(b => {
    b.addEventListener('click', () => {
      b.parentElement.querySelectorAll('.theme-option').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
    });
  });

  /* ==================== LANGUAGE OPTIONS HIGHLIGHT ==================== */
  function updateLangOptions() {
    const lang = PA_i18n.getLang();
    document.getElementById('optLangVi')?.classList.toggle('active', lang === 'vi');
    document.getElementById('optLangEn')?.classList.toggle('active', lang === 'en');
  }
  window.addEventListener('langchange', updateLangOptions);

  /* ==================== TOAST ==================== */
  function showToast(msg) {
    const t = document.getElementById('toast');
    if (msg) t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2200);
  }

  /* ==================== PROFILE PERSISTENCE ==================== */
  const PROFILE_KEY = 'pa_profile';

  /* Default profile values (used on first load) */
  const DEFAULT_PROFILE = {
    fullname:  'Sam Phạm',
    email:     'sam@ausynclab.io',
    phone:     '+84 901 234 567',
    dob:       '1995-08-15',
    gender:    'male',
    address:   'TP. Hồ Chí Minh, Việt Nam',
    license:   'KTV-FF-2018-04219',
    specialty: 'Sửa iPhone & Macbook',
    years:     '8',
    workplace: 'FFC — Chi nhánh Quận 1',
    bio:       'Kỹ thuật viên với 8 năm kinh nghiệm tại các trung tâm bảo hành uỷ quyền. Chuyên về sửa main iPhone, Macbook, phục hồi dữ liệu và tư vấn nâng cấp cho khách hàng.',
    facebook:  '',
    linkedin:  '',
    youtube:   '',
    website:   '',
    avatar:    ''
  };

  /* In-modal pending avatar (data URL). null = no change since modal opened. */
  let pendingAvatar = null;

  function pickAvatar() {
    document.getElementById('avatarFileInput').click();
  }

  function removeAvatar() {
    pendingAvatar = '';
    const heroAvatar = document.querySelector('#profileModal .avatar-big');
    renderAvatarInto(heroAvatar, '', loadProfile().fullname);
    document.getElementById('avatarRemoveBtn').style.display = 'none';
  }

  /* Resize image via canvas to keep localStorage usage low. */
  function resizeImage(dataUrl, maxSize) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        const ratio = Math.min(1, maxSize / Math.max(width, height));
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = reject;
      img.src = dataUrl;
    });
  }

  document.getElementById('avatarFileInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('Vui lòng chọn file ảnh'); return; }
    if (file.size > 5 * 1024 * 1024) { showToast('Ảnh quá lớn (tối đa 5MB)'); return; }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const resized = await resizeImage(reader.result, 256);
        pendingAvatar = resized;
        const heroAvatar = document.querySelector('#profileModal .avatar-big');
        renderAvatarInto(heroAvatar, resized, loadProfile().fullname);
        document.getElementById('avatarRemoveBtn').style.display = 'inline-flex';
      } catch {
        showToast('Không đọc được ảnh');
      }
    };
    reader.readAsDataURL(file);
  });

  /* Render either an <img> (when src is set) or initials text into an avatar element.
     Preserves the .avatar-edit child if present. */
  function renderAvatarInto(el, src, fullname) {
    if (!el) return;
    const editBtn = el.querySelector('.avatar-edit');
    el.innerHTML = '';
    if (src) {
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      el.appendChild(img);
    } else {
      const initials = (fullname || 'PA').split(/\s+/).map(w => w[0]).slice(-2).join('').toUpperCase();
      el.appendChild(document.createTextNode(initials));
    }
    if (editBtn) el.appendChild(editBtn);
  }

  function loadProfile() {
    try {
      const saved = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
      return { ...DEFAULT_PROFILE, ...saved };
    } catch { return { ...DEFAULT_PROFILE }; }
  }

  /* Populate the form fields when modal opens */
  function fillProfileForm() {
    pendingAvatar = null;
    const data = loadProfile();
    document.querySelectorAll('#profileModal [data-field]').forEach(el => {
      const key = el.dataset.field;
      if (key in data) el.value = data[key];
    });
    /* Update hero name + meta inside modal */
    updateProfileHero(data);
  }

  function updateProfileHero(data) {
    const heroName = document.querySelector('#profileModal .profile-name');
    const heroMeta = document.querySelector('#profileModal .profile-meta');
    const heroAvatar = document.querySelector('#profileModal .avatar-big');
    if (heroName) {
      /* Keep the verified badge intact */
      const badge = heroName.querySelector('.verified-badge');
      heroName.innerHTML = (data.fullname || 'Untitled') + ' ';
      if (badge) heroName.appendChild(badge);
    }
    if (heroMeta) {
      heroMeta.textContent = (data.email || '') + ' · ' + (data.address || '');
    }
    renderAvatarInto(heroAvatar, data.avatar || '', data.fullname);
    const removeBtn = document.getElementById('avatarRemoveBtn');
    if (removeBtn) removeBtn.style.display = data.avatar ? 'inline-flex' : 'none';
  }

  function saveProfile() {
    const existing = loadProfile();
    const data = {};
    document.querySelectorAll('#profileModal [data-field]').forEach(el => {
      data[el.dataset.field] = el.value;
    });
    /* pendingAvatar: null = unchanged, '' = removed, otherwise new data URL */
    data.avatar = pendingAvatar !== null ? pendingAvatar : (existing.avatar || '');
    pendingAvatar = null;
    localStorage.setItem(PROFILE_KEY, JSON.stringify(data));

    /* Re-render the entire header so avatar/name updates */
    renderHeaderAuth();
    /* Update the modal hero card too (in case user opens it again) */
    updateProfileHero(data);
    /* Re-apply translations + lang pill flags after re-render */
    if (window.PA_i18n) PA_i18n.applyTranslations();
    if (typeof updateLangPill === 'function') updateLangPill();

    showToast(PA_i18n ? PA_i18n.tr('profile.saved') : '✓ Đã lưu thay đổi');
    setTimeout(() => closeModal('profile'), 600);
  }

  /* Hook fillProfileForm into openModal('profile') */
  const _origOpenModal = openModal;
  openModal = function(name) {
    _origOpenModal(name);
    if (name === 'profile') {
      /* Customer role uses a separate profile key (per-user) so admin's
         "Sam Phạm" data doesn't leak across role contexts. */
      const role = sessionStorage.getItem('ffc_role');
      if (role === 'customer') {
        fillCustomerProfileForm();
      } else {
        fillProfileForm();
      }
    }
  };

  function fillCustomerProfileForm() {
    let me = null;
    try { me = JSON.parse(sessionStorage.getItem('ffc_customer_me') || 'null'); }
    catch (_) {}
    if (!me) return;

    /* Per-customer profile stored under ffc_customer_profile_<phone> */
    const key = 'ffc_customer_profile_' + (me.phone || 'unknown').replace(/\s/g, '');
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(key) || '{}'); } catch (_) {}

    /* Phone is identity — always sync from session, never from saved.
       Other fields prefer saved (user customizations) then fall back to session. */
    const data = {
      fullname: saved.fullname || me.name || '',
      email:    saved.email    || me.email   || '',
      phone:    me.phone       || saved.phone || '',
      address:  saved.address  || me.address || '',
      bio:      saved.bio      || '',
      title:    saved.title    || '',
      org:      saved.org      || '',
      avatar:   saved.avatar   || '',
    };

    /* Fill form fields */
    document.querySelectorAll('#profileModal [data-field]').forEach(el => {
      if (el.dataset.field in data) el.value = data[el.dataset.field];
    });

    /* Phone is read-only for customers — it's their identity key, can't change */
    const phoneInput = document.querySelector('#profileModal [data-field="phone"]');
    if (phoneInput) {
      phoneInput.setAttribute('readonly', 'readonly');
      phoneInput.style.background = 'rgba(100, 116, 139, 0.08)';
      phoneInput.style.cursor = 'not-allowed';
      phoneInput.title = 'Số điện thoại là định danh tài khoản, không thay đổi được';
    }

    /* Update hero card — replace staff-flavoured labels with customer-flavoured */
    const heroName = document.querySelector('#profileModal .profile-name');
    const heroRole = document.querySelector('#profileModal .profile-role-tag');
    const heroMeta = document.querySelector('#profileModal .profile-meta');
    const heroAvatar = document.querySelector('#profileModal .avatar-big');
    const verified = document.querySelector('#profileModal .verified-badge');
    if (heroName) {
      heroName.innerHTML = (data.fullname || me.name) + ' ';
      if (verified) heroName.appendChild(verified);
    }
    if (heroRole) {
      heroRole.textContent = 'Khách hàng';
      heroRole.style.background = 'rgba(34, 197, 94, 0.15)';
      heroRole.style.color = '#16A34A';
    }
    if (heroMeta) {
      heroMeta.textContent = (data.phone || '') + (data.email ? ' · ' + data.email : '');
    }
    if (heroAvatar) renderAvatarInto(heroAvatar, data.avatar, data.fullname || me.name);
    if (verified) verified.style.display = 'none';

    /* Override save handler so customer profile saves to per-user key */
    const saveBtn = document.querySelector('#profileModal .btn-save');
    if (saveBtn) {
      saveBtn.onclick = (e) => {
        e.preventDefault();
        const out = {};
        document.querySelectorAll('#profileModal [data-field]').forEach(el => {
          out[el.dataset.field] = el.value;
        });
        /* Phone is identity — always force session phone, ignore any manual edit */
        out.phone = me.phone;
        out.avatar = (typeof pendingAvatar !== 'undefined' && pendingAvatar !== null)
          ? pendingAvatar : (saved.avatar || '');
        try { localStorage.setItem(key, JSON.stringify(out)); } catch (_) {}
        /* Also update sessionStorage so header pill + my-tickets reflect the new name */
        try {
          const updatedMe = {
            ...me,
            name:    out.fullname || me.name,
            email:   out.email,
            address: out.address,
          };
          sessionStorage.setItem('ffc_customer_me', JSON.stringify(updatedMe));
        } catch (_) {}
        closeModal('profile');
        renderHeaderAuth();
      };
    }
  }

  /* Render header auth state — must run AFTER PROFILE_KEY / DEFAULT_PROFILE
     are initialized, since renderHeaderAuth() calls loadProfile(). */
  renderHeaderAuth();

/* ============ Block 2: lines 6361-6500 ============ */
(function () {
  if (!new URLSearchParams(location.search).has('edit')) return;

  const imgs = document.querySelectorAll('.hero-products-row .product img');
  if (!imgs.length) return;

  /* Lift the constraints that normally cap image size + clip overflow.
     These only apply while edit mode is active. */
  const editStyle = document.createElement('style');
  editStyle.textContent = `
    .hero { overflow: visible !important; }
    .hero-products-row,
    .hero-products-row .product { overflow: visible !important; }
    .hero-products-row .product img {
      max-width: none !important;
      max-height: none !important;
    }
  `;
  document.head.appendChild(editStyle);

  /* state per image: dx/dy = translate offset, w = current width in px */
  const state = new Map();
  imgs.forEach(img => state.set(img, { dx: 0, dy: 0, w: img.offsetWidth }));

  /* Floating panel (bottom-right) showing live values + Copy CSS */
  const panel = document.createElement('div');
  panel.style.cssText = `
    position: fixed; bottom: 16px; right: 16px; z-index: 9999;
    background: rgba(255,255,255,0.96); backdrop-filter: blur(10px);
    border: 1px solid #cbd5e1; border-radius: 12px; padding: 14px 16px;
    font: 12px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15); color: #0f172a;
    max-width: 360px; min-width: 280px;
  `;
  panel.innerHTML = `
    <div style="font-weight:700;margin-bottom:6px;color:#1e3a5f">
      Edit mode · drag image | wheel = resize
    </div>
    <pre id="__edit_state" style="margin:0 0 8px;white-space:pre-wrap;font-size:11.5px"></pre>
    <button id="__edit_copy"
      style="background:linear-gradient(135deg,#1e3a5f,#2563eb);color:#fff;
             border:none;border-radius:8px;padding:6px 12px;cursor:pointer;
             font:inherit;font-weight:600">Copy CSS</button>
    <button id="__edit_reset"
      style="margin-left:6px;background:#e2e8f0;color:#0f172a;border:none;
             border-radius:8px;padding:6px 12px;cursor:pointer;font:inherit">Reset</button>
  `;
  document.body.appendChild(panel);

  const stateEl = panel.querySelector('#__edit_state');
  const productClass = (img) =>
    Array.from(img.parentElement.classList).find(c => c.startsWith('product-')) || 'product';

  function applyTransform(img) {
    const s = state.get(img);
    img.style.animation = 'none';                       // freeze float during edit
    img.style.transform = `translate(${s.dx}px, ${s.dy}px)`;
    img.style.width = s.w + 'px';
  }
  function updatePanel() {
    const lines = [];
    state.forEach((s, img) => {
      lines.push(
        `.${productClass(img)} img {\n` +
        `  width: ${Math.round(s.w)}px;\n` +
        `  transform: translate(${Math.round(s.dx)}px, ${Math.round(s.dy)}px);\n` +
        `}`
      );
    });
    stateEl.textContent = lines.join('\n');
  }

  /* Drag handling — single shared mousemove listener */
  let active = null, startX = 0, startY = 0, startDx = 0, startDy = 0;
  imgs.forEach(img => {
    img.style.cursor = 'grab';
    img.style.userSelect = 'none';
    img.style.touchAction = 'none';
    img.draggable = false;

    img.addEventListener('mousedown', (e) => {
      active = img;
      startX = e.clientX; startY = e.clientY;
      const s = state.get(img);
      startDx = s.dx; startDy = s.dy;
      img.style.cursor = 'grabbing';
      e.preventDefault();
    });

    img.addEventListener('wheel', (e) => {
      e.preventDefault();
      const s = state.get(img);
      /* Multiplicative zoom: each notch grows/shrinks by ~6% (or ~1.5%
         with Shift held for fine tuning). Multiplicative scaling stays
         predictable across all sizes — no upper cap. */
      const step = e.shiftKey ? 0.015 : 0.06;
      const direction = e.deltaY > 0 ? -1 : 1;
      s.w = Math.max(40, s.w * (1 + step * direction));
      applyTransform(img);
      updatePanel();
    }, { passive: false });
  });

  document.addEventListener('mousemove', (e) => {
    if (!active) return;
    const s = state.get(active);
    s.dx = startDx + (e.clientX - startX);
    s.dy = startDy + (e.clientY - startY);
    applyTransform(active);
    updatePanel();
  });
  document.addEventListener('mouseup', () => {
    if (active) { active.style.cursor = 'grab'; active = null; }
  });

  panel.querySelector('#__edit_copy').onclick = async () => {
    try {
      await navigator.clipboard.writeText(stateEl.textContent);
      const btn = panel.querySelector('#__edit_copy');
      const orig = btn.textContent;
      btn.textContent = 'Copied ✓';
      setTimeout(() => (btn.textContent = orig), 1200);
    } catch {
      alert(stateEl.textContent); /* fallback if clipboard API blocked */
    }
  };
  panel.querySelector('#__edit_reset').onclick = () => {
    state.forEach((s, img) => {
      s.dx = 0; s.dy = 0; s.w = img.naturalWidth ? img.offsetWidth : s.w;
      img.style.transform = '';
      img.style.width = '';
      img.style.animation = '';
    });
    /* re-measure after reset */
    state.forEach((s, img) => (s.w = img.offsetWidth));
    updatePanel();
  };

  updatePanel();
})();

/* ============ Block 3: lines 6533-6594 ============ */
  /* Team lightbox — opens on team card click, supports keyboard arrows */
  const TEAM_PHOTOS = [
    { src: 'assets/images/team-1.jpg?v=2', n: 1 },
    { src: 'assets/images/team-2.jpg?v=2', n: 2 },
    { src: 'assets/images/team-3.jpg?v=2', n: 3 },
    { src: 'assets/images/team-4.jpg?v=2', n: 4 },
  ];
  let teamLbIdx = 0;

  function renderTeamLightbox() {
    const p = TEAM_PHOTOS[teamLbIdx];
    const tr = (k) => window.PA_i18n ? PA_i18n.tr(k) : k;
    const titleK = `team.${p.n}.title`;
    const subK   = `team.${p.n}.sub`;
    const storyK = `team.${p.n}.story`;
    const hlK    = `team.${p.n}.highlights`;

    document.getElementById('lbImg').src = p.src;
    document.getElementById('lbImg').alt = tr(titleK);
    document.getElementById('lbBadge').textContent = p.n;
    document.getElementById('lbStepOf').textContent =
      (PA_i18n && PA_i18n.getLang() === 'en' ? 'Area' : 'Khu vực') + ` ${p.n} / ${TEAM_PHOTOS.length}`;
    document.getElementById('lbTitle').textContent = tr(titleK);
    document.getElementById('lbSub').textContent   = tr(subK);
    document.getElementById('lbStory').textContent = tr(storyK);
    /* Highlights — 3 bullets separated by " · " in i18n */
    document.getElementById('lbHighlights').innerHTML = tr(hlK)
      .split(' · ')
      .map(h => `<span class="pill">${h.trim()}</span>`)
      .join('');
    /* Thumbnails strip */
    document.getElementById('lbThumbs').innerHTML = TEAM_PHOTOS.map((tp, i) => `
      <div class="thumb ${i === teamLbIdx ? 'active' : ''}" onclick="jumpTeamLightbox(${i})">
        <img src="${tp.src}" alt="" />
      </div>
    `).join('');
  }
  function openTeamLightbox(i) {
    teamLbIdx = i;
    renderTeamLightbox();
    document.getElementById('teamLightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeTeamLightbox() {
    document.getElementById('teamLightbox').classList.remove('open');
    document.body.style.overflow = '';
  }
  function navTeamLightbox(delta) {
    teamLbIdx = (teamLbIdx + delta + TEAM_PHOTOS.length) % TEAM_PHOTOS.length;
    renderTeamLightbox();
  }
  function jumpTeamLightbox(i) {
    teamLbIdx = i;
    renderTeamLightbox();
  }
  /* Keyboard nav: ESC close, ←/→ prev/next */
  document.addEventListener('keydown', (e) => {
    if (!document.getElementById('teamLightbox').classList.contains('open')) return;
    if (e.key === 'Escape') closeTeamLightbox();
    if (e.key === 'ArrowLeft')  navTeamLightbox(-1);
    if (e.key === 'ArrowRight') navTeamLightbox(1);
  });

/* ============ Block 4: lines 6651-7019 ============ */
  /* ============================================================
     CUSTOMER CHAT WIDGET — uses Gizmo mascot as the trigger.
     Shares storage with admin dashboard (`ffc_chats`).
     ============================================================ */
  (function () {
    const CHAT_KEY  = 'ffc_chats';
    const ROLE_KEY  = 'ffc_role';
    const ME_KEY    = 'ffc_customer_me';
    const POS_KEY   = 'ffc_gizmo_pos';
    const phoneKey  = (p) => (p || '').replace(/\s/g, '');
    const isCustomer = () => sessionStorage.getItem(ROLE_KEY) === 'customer';
    const isAdmin    = () => sessionStorage.getItem(ROLE_KEY) === 'admin' ||
                             sessionStorage.getItem('pa_admin_logged_in') === '1';
    const getMe = () => { try { return JSON.parse(sessionStorage.getItem(ME_KEY) || 'null'); } catch (_) { return null; } };
    const loadChats = () => { try { return JSON.parse(localStorage.getItem(CHAT_KEY) || '{}'); } catch (_) { return {}; } };
    const saveChats = (o) => localStorage.setItem(CHAT_KEY, JSON.stringify(o));
    const escapeHtml = (s) => (s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

    const gizmo  = document.getElementById('gizmo');
    const badge  = document.getElementById('gizmoBadge');
    const bubble = document.getElementById('gizmoBubble');
    const menu   = document.getElementById('gizmoMenu');
    const panel  = document.getElementById('chatPanel');
    const msgsEl = document.getElementById('chatPanelMsgs');
    const input  = document.getElementById('chatPanelInput');

    /* Gizmo is visible to everyone on index.html (guest / customer / admin).
       The "Chat" action below routes differently based on role. */
    function updateVisibility() {
      gizmo.classList.toggle('visible', true);
    }

    /* ---------- Gizmo position (saved across sessions) ---------- */
    function loadPos() {
      try { return JSON.parse(localStorage.getItem(POS_KEY) || 'null'); }
      catch (_) { return null; }
    }
    function applyPos(pos) {
      if (pos && typeof pos.left === 'number' && typeof pos.top === 'number') {
        gizmo.style.left = pos.left + 'px';
        gizmo.style.top  = pos.top + 'px';
        gizmo.style.right = 'auto';
        gizmo.style.bottom = 'auto';
      }
    }
    applyPos(loadPos());

    /* ---------- Drag-and-drop ---------- */
    let dragging = false, didDrag = false, sx = 0, sy = 0, ox = 0, oy = 0;
    function startDrag(e) {
      const pt = e.touches ? e.touches[0] : e;
      dragging = true;
      didDrag = false;
      sx = pt.clientX; sy = pt.clientY;
      const rect = gizmo.getBoundingClientRect();
      ox = rect.left; oy = rect.top;
      gizmo.classList.add('dragging');
      menu.classList.remove('open');
    }
    function moveDrag(e) {
      if (!dragging) return;
      const pt = e.touches ? e.touches[0] : e;
      const dx = pt.clientX - sx;
      const dy = pt.clientY - sy;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) didDrag = true;
      const W = window.innerWidth, H = window.innerHeight;
      const size = gizmo.offsetWidth;
      const left = Math.max(8, Math.min(W - size - 8, ox + dx));
      const top  = Math.max(8, Math.min(H - size - 8, oy + dy));
      gizmo.style.left = left + 'px';
      gizmo.style.top  = top + 'px';
      gizmo.style.right = 'auto';
      gizmo.style.bottom = 'auto';
      e.preventDefault();
    }
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      gizmo.classList.remove('dragging');
      if (didDrag) {
        const r = gizmo.getBoundingClientRect();
        localStorage.setItem(POS_KEY, JSON.stringify({ left: r.left, top: r.top }));
      } else {
        toggleMenu();
      }
    }
    gizmo.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', moveDrag);
    document.addEventListener('mouseup', endDrag);
    gizmo.addEventListener('touchstart', startDrag, { passive: true });
    document.addEventListener('touchmove', moveDrag, { passive: false });
    document.addEventListener('touchend', endDrag);

    /* ---------- Action menu ---------- */
    function placeMenu() {
      const r = gizmo.getBoundingClientRect();
      const menuRect = { w: 200, h: 240 };
      const W = window.innerWidth;
      let left = r.right - menuRect.w;
      if (r.left < W / 2) left = r.left;
      if (left < 8) left = 8;
      if (left + menuRect.w > W - 8) left = W - menuRect.w - 8;
      let top = r.top - menuRect.h - 12;
      if (top < 8) top = r.bottom + 12;
      menu.style.left = left + 'px';
      menu.style.top  = top + 'px';
    }
    function toggleMenu(force) {
      const willOpen = force === undefined ? !menu.classList.contains('open') : !!force;
      if (willOpen) {
        placeMenu();
        menu.classList.add('open');
        bubble.classList.remove('show');
      } else {
        menu.classList.remove('open');
      }
    }
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#gizmoMenu') && !e.target.closest('#gizmo')) {
        menu.classList.remove('open');
      }
    });

    /* Action handlers — route differently based on the current role */
    window.gizmoAction = function (kind) {
      menu.classList.remove('open');
      if (kind === 'chat') {
        if (isAdmin()) {
          /* Admin browsing the public site → take them to their inbox */
          window.location.href = 'dashboard.html#support';
          return;
        }
        if (!isCustomer() || !getMe()) {
          if (confirm('Bạn cần đăng nhập tài khoản khách hàng để chat. Đi tới trang đăng nhập?')) {
            window.location.href = 'admin.html';
          }
          return;
        }
        return window.toggleChatPanel(true);
      }
      if (kind === 'lookup') return alert('Tra cứu phiếu — đang phát triển. Tạm thời nhập SĐT trong chat để KTV tra giúp.');
      if (kind === 'book')   { document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' }); return; }
      if (kind === 'quote')  { document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); return; }
    };

    /* ---------- Random tooltip messages ---------- */
    const TOOLTIPS = [
      'Xin chào! Bạn cần hỗ trợ gì không ạ? 👋',
      'Máy của bạn có gặp vấn đề gì không?',
      'Nhấn vào tôi để xem các tiện ích nhé! 🛠️',
      'Báo giá sửa chữa miễn phí — bạn muốn thử không?',
      'FFC bảo hành 12 tháng cho linh kiện chính hãng đó!',
      'Có thể kéo tôi đi bất cứ đâu trên trang nhé! ✨',
      'Cần đặt lịch sửa? Tôi có thể giúp bạn ngay!',
      'Gizmo đây! Tôi luôn online nếu bạn cần hỗ trợ 🚀',
      'Tip: bạn có thể chat trực tiếp với KTV qua tôi đó!',
      'Đừng ngại hỏi nhé, KTV FFC luôn sẵn sàng 💙',
    ];
    function placeBubble() {
      const r = gizmo.getBoundingClientRect();
      const bw = bubble.offsetWidth || 220;
      const bh = bubble.offsetHeight || 50;
      const W = window.innerWidth;
      /* Prefer right-aligned (bubble extends LEFT from gizmo) */
      let left = r.left - bw + r.width;
      bubble.classList.remove('bubble-left');
      if (left < 8) {
        /* Gizmo is near left edge — flip bubble to right */
        left = r.right - r.width / 2;
        bubble.classList.add('bubble-left');
      }
      if (left + bw > W - 8) left = W - bw - 8;
      let top = r.top - bh - 14;
      if (top < 8) top = r.bottom + 14;
      bubble.style.left = left + 'px';
      bubble.style.top  = top + 'px';
    }
    let tooltipTimer = null, hideTimer = null;
    function showRandomTooltip() {
      if (menu.classList.contains('open') || panel.classList.contains('open') || dragging) return;
      const msg = TOOLTIPS[Math.floor(Math.random() * TOOLTIPS.length)];
      bubble.textContent = msg;
      placeBubble();
      bubble.classList.add('show');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => bubble.classList.remove('show'), 5000);
    }
    function scheduleNextTooltip() {
      const delay = 25000 + Math.random() * 35000; /* 25-60s */
      tooltipTimer = setTimeout(() => {
        showRandomTooltip();
        scheduleNextTooltip();
      }, delay);
    }
    /* First greeting after 5s of page load */
    setTimeout(() => {
      if (gizmo.classList.contains('visible')) {
        bubble.textContent = TOOLTIPS[0];
        placeBubble();
        bubble.classList.add('show');
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => bubble.classList.remove('show'), 6000);
        scheduleNextTooltip();
      }
    }, 5000);

    /* Reposition bubble/menu on window resize */
    window.addEventListener('resize', () => {
      if (menu.classList.contains('open')) placeMenu();
      if (bubble.classList.contains('show')) placeBubble();
      /* Also keep gizmo within viewport */
      const r = gizmo.getBoundingClientRect();
      if (r.right > window.innerWidth || r.bottom > window.innerHeight) {
        gizmo.style.left = Math.max(8, Math.min(window.innerWidth - r.width - 8, r.left)) + 'px';
        gizmo.style.top  = Math.max(8, Math.min(window.innerHeight - r.height - 8, r.top)) + 'px';
      }
    });

    function renderMsgs() {
      const me = getMe();
      if (!me) return;
      const c = loadChats()[phoneKey(me.phone)];
      if (!c || !c.messages.length) {
        msgsEl.innerHTML = `
          <div class="chat-panel-empty">
            <h3>Chào ${me.name}!</h3>
            <p>Bạn cần hỗ trợ gì? Kỹ thuật viên FFC sẽ phản hồi sớm nhất.</p>
            <div class="suggest">
              <button onclick="window._quickAsk('Khi nào lấy được máy?')">Khi nào lấy máy?</button>
              <button onclick="window._quickAsk('Cho em xem báo giá')">Báo giá</button>
              <button onclick="window._quickAsk('Bảo hành bao lâu?')">Bảo hành</button>
              <button onclick="window._quickAsk('Địa chỉ shop ở đâu?')">Địa chỉ</button>
            </div>
          </div>
        `;
        return;
      }
      msgsEl.innerHTML = c.messages.map(m => {
        const time = (m.at || '').slice(11, 16);
        const author = m.from === 'system' ? '⚙ Hệ thống: ' : '';
        return `<div class="msg ${m.from}">${author ? `<strong>${author}</strong>` : ''}${escapeHtml(m.text)}<span class="at">${time}</span></div>`;
      }).join('');
      msgsEl.scrollTop = msgsEl.scrollHeight;
    }

    function updateBadge() {
      if (!isCustomer()) return;
      const me = getMe();
      if (!me) return;
      const c = loadChats()[phoneKey(me.phone)];
      const unread = c?.customerUnread || 0;
      badge.textContent = unread;
      badge.classList.toggle('hidden', unread === 0 || panel.classList.contains('open'));
    }

    function markRead() {
      const me = getMe();
      if (!me) return;
      const all = loadChats();
      const k = phoneKey(me.phone);
      if (all[k]?.customerUnread) {
        all[k].customerUnread = 0;
        saveChats(all);
        updateBadge();
      }
    }

    window.toggleChatPanel = function (force) {
      const willOpen = force === undefined ? !panel.classList.contains('open') : !!force;
      panel.classList.toggle('open', willOpen);
      if (willOpen) {
        renderMsgs();
        markRead();
        setTimeout(() => input.focus(), 200);
      } else {
        updateBadge();
      }
    };

    window.chatPanelSend = function () {
      const me = getMe();
      if (!me) return;
      const text = input.value.trim();
      if (!text) return;
      const all = loadChats();
      const k = phoneKey(me.phone);
      if (!all[k]) all[k] = { name: me.name, phone: me.phone, messages: [], customerUnread: 0, adminUnread: 0, lastAt: '' };
      const now = new Date().toISOString().slice(0, 16);
      all[k].messages.push({ from: 'customer', text, at: now });
      all[k].adminUnread = (all[k].adminUnread || 0) + 1;
      all[k].lastAt = now;
      saveChats(all);
      try { window._notifyChatUpdate && window._notifyChatUpdate(); } catch (_) {}
      input.value = '';
      renderMsgs();
      /* Demo: auto-reply based on keyword — disabled when admin tab is open
         (admin will reply manually). Kept as fallback for offline demo. */
      setTimeout(() => {
        const all2 = loadChats();
        const c = all2[k];
        if (!c) return;
        const last = c.messages[c.messages.length - 1];
        if (!last || last.from !== 'customer') return;
        /* If admin already replied within 1.4s (manually), skip auto-reply */
        const adminReplied = c.messages.some(m =>
          m.from === 'admin' && m.at >= last.at
        );
        if (adminReplied) return;
        const lt = last.text.toLowerCase();
        let reply = null;
        if (/(khi nào|bao giờ|lấy)/.test(lt))
          reply = 'Em sẽ kiểm tra phiếu và phản hồi ngay. Nếu gấp anh/chị gọi 1900-xxxx ạ.';
        else if (/(giá|báo giá|bao nhiêu)/.test(lt))
          reply = 'Báo giá tham khảo: Thay pin iPhone 720k–1.2tr · Thay màn 800k–4.5tr · Vệ sinh laptop 300k.';
        else if (/(bảo hành|warranty)/.test(lt))
          reply = 'Bảo hành: Linh kiện chính hãng 6–12 tháng · Tương đương 3 tháng · Vệ sinh 1 tháng.';
        else if (/(địa chỉ|ở đâu|map)/.test(lt))
          reply = 'FFC có CN tại Q.1 (123 Nguyễn Huệ) và Q.10 (456 Sư Vạn Hạnh). Mở 8h–21h hàng ngày.';
        if (reply) {
          c.messages.push({ from: 'admin', text: reply, at: new Date().toISOString().slice(0, 16) });
          c.customerUnread = (c.customerUnread || 0) + 1;
          c.lastAt = new Date().toISOString().slice(0, 16);
          all2[k] = c;
          saveChats(all2);
          try { window._notifyChatUpdate && window._notifyChatUpdate(); } catch (_) {}
          if (panel.classList.contains('open')) { renderMsgs(); markRead(); }
          else updateBadge();
        }
      }, 1400);
    };

    window._quickAsk = function (text) { input.value = text; window.chatPanelSend(); };

    /* Cross-tab sync — admin reply in another tab → update widget here.
       Triple layer: BroadcastChannel (primary), storage event, polling fallback. */
    let chatBC = null;
    try { chatBC = new BroadcastChannel('ffc_chats'); } catch (_) {}
    function notifyChatUpdate() { try { chatBC && chatBC.postMessage({ at: Date.now() }); } catch (_) {} }
    window._notifyChatUpdate = notifyChatUpdate;
    function refreshChatUI() {
      if (panel.classList.contains('open')) { renderMsgs(); markRead(); }
      else updateBadge();
    }
    if (chatBC) chatBC.addEventListener('message', refreshChatUI);
    window.addEventListener('storage', (e) => {
      if (e.key === CHAT_KEY) refreshChatUI();
      if (e.key === ROLE_KEY || e.key === ME_KEY) updateVisibility();
    });
    /* Polling fallback — file:// origins sometimes skip storage events */
    let lastChatSig = '';
    setInterval(() => {
      const raw = localStorage.getItem(CHAT_KEY) || '';
      const sig = raw.length + ':' + raw.slice(-80);
      if (sig !== lastChatSig) {
        lastChatSig = sig;
        refreshChatUI();
      }
    }, 2000);

    /* Init */
    updateVisibility();
    updateBadge();

    /* Auto-open chat panel if URL has #chat hash (used when redirected
       from chat.html as a logged-in customer) */
    if (location.hash === '#chat' && isCustomer() && getMe()) {
      setTimeout(() => window.toggleChatPanel(true), 200);
    }
  })();

/* ============ Block 5: lines 7024-7147 ============ */
  (function () {
    const BOOKINGS_KEY = 'ffc_online_bookings';
    let bookingCounter = 1;

    /* Read counter from existing bookings so new ones don't collide */
    try {
      const existing = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
      bookingCounter = existing.length + 1;
    } catch (_) {}

    /* Toggle onsite preview based on selected method */
    function syncOnsitePreview() {
      const checked = document.querySelector('#bookingForm input[name="method"]:checked');
      const preview = document.getElementById('bkOnsitePreview');
      if (preview) preview.style.display = (checked && checked.value === 'onsite') ? '' : 'none';
    }
    document.addEventListener('change', (e) => {
      if (e.target.name === 'method') syncOnsitePreview();
    });

    window.openBookingModal = function () {
      const modal = document.getElementById('bookingModal');
      if (!modal) return;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      syncOnsitePreview();
      /* Pre-fill name/phone if customer is logged in */
      try {
        const me = JSON.parse(sessionStorage.getItem('ffc_customer_me') || 'null');
        if (me) {
          const form = document.getElementById('bookingForm');
          if (form) {
            if (!form.customer.value) form.customer.value = me.name || '';
            if (!form.phone.value) form.phone.value = me.phone || '';
          }
        }
      } catch (_) {}
      /* Default date = tomorrow */
      const dateInput = document.querySelector('#bookingForm input[name="date"]');
      if (dateInput && !dateInput.value) {
        const t = new Date();
        t.setDate(t.getDate() + 1);
        dateInput.value = t.toISOString().slice(0, 10);
        dateInput.min = new Date().toISOString().slice(0, 10);
      }
    };

    window.closeBookingModal = function () {
      const modal = document.getElementById('bookingModal');
      if (!modal) return;
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeBookingModal();
    });

    window.submitBooking = function (e) {
      e.preventDefault();
      const form = e.target;
      const data = Object.fromEntries(new FormData(form).entries());

      const code = 'FFC-ONL-' + String(bookingCounter++).padStart(3, '0');
      const now = new Date().toISOString().slice(0, 16).replace('T', ' ');

      const booking = {
        code,
        customer: data.customer,
        phone: data.phone,
        email: data.email || '',
        device: data.device,
        issue: data.issue,
        serviceType: data.serviceType,
        method: data.method,
        address: data.address || '',
        date: data.date,
        timeSlot: data.timeSlot,
        note: data.note || '',
        status: 'pending', /* admin chưa xác nhận */
        source: 'online',
        createdAt: now,
      };

      try {
        const list = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
        list.unshift(booking);
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list));
      } catch (_) {}

      /* Also push a system chat msg if customer has phone key in chat */
      try {
        const CHAT_KEY = 'ffc_chats';
        const all = JSON.parse(localStorage.getItem(CHAT_KEY) || '{}');
        const k = (data.phone || '').replace(/\s/g, '');
        if (!all[k]) {
          all[k] = {
            name: data.customer, phone: data.phone, messages: [],
            customerUnread: 0, adminUnread: 0, lastAt: ''
          };
        }
        const methodLabel = ({store: 'tại tiệm', ship: 'ship máy đến tiệm', onsite: 'KTV đến nhà'})[data.method] || data.method;
        all[k].messages.push({
          from: 'system',
          text: `Khách ${data.customer} đã đặt lịch online ${code} — ${data.device} (${data.issue}). Hẹn ${data.date} ${data.timeSlot}, hình thức: ${methodLabel}.`,
          at: now,
        });
        all[k].adminUnread = (all[k].adminUnread || 0) + 1;
        all[k].lastAt = now;
        localStorage.setItem(CHAT_KEY, JSON.stringify(all));
      } catch (_) {}

      closeBookingModal();
      form.reset();

      /* Show success toast */
      const toast = document.getElementById('bookingToast');
      document.getElementById('bkToastTitle').textContent = '✓ Đặt lịch thành công!';
      document.getElementById('bkToastMsg').textContent =
        `Mã: ${code} · KTV sẽ gọi xác nhận trong 15 phút qua SĐT ${data.phone}`;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 5000);
    };
  })();

/* ============ Block 6: lines 7152-7308 ============ */
  (function () {
    const TICKETS_KEY = 'ffc_tickets';
    const BOOKINGS_KEY = 'ffc_online_bookings';
    const STATUS_FLOW = ['waiting', 'in-progress', 'testing', 'done', 'delivered'];
    const STATUS_LABEL = {
      waiting: 'Chờ xử lý', 'in-progress': 'Đang sửa',
      testing: 'Đang test', done: 'Xong', delivered: 'Đã giao',
    };
    const METHOD_LABEL = {
      store: '🏪 Tại tiệm', ship: '🚚 Ship máy', onsite: '🏠 KTV đến nhà',
    };

    function getCustomerTickets() {
      let me = null;
      try { me = JSON.parse(sessionStorage.getItem('ffc_customer_me') || 'null'); }
      catch (_) {}
      if (!me) return { me: null, list: [] };

      const phoneKey = (me.phone || '').replace(/\s/g, '');

      /* Tickets from admin dashboard (admin-created + merged bookings) */
      let tickets = [];
      try { tickets = JSON.parse(localStorage.getItem(TICKETS_KEY) || '[]'); }
      catch (_) {}

      /* If dashboard hasn't run yet (TICKETS_KEY missing), fall back to
         online bookings — at least show customer their own bookings. */
      if (tickets.length === 0) {
        try {
          const bookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
          tickets = bookings.map(b => ({
            code: b.code, customer: b.customer, phone: b.phone,
            device: b.device, issue: b.issue, tech: 'Chưa phân',
            date: b.createdAt, quote: 0, status: 'waiting',
            source: 'online',
            bookingDate: b.date, bookingSlot: b.timeSlot,
            bookingMethod: b.method,
          }));
        } catch (_) {}
      }

      const myTickets = tickets.filter(t =>
        (t.phone || '').replace(/\s/g, '') === phoneKey
      );

      /* Sort: most recent first (paid/delivered last) */
      myTickets.sort((a, b) => {
        const aDone = a.status === 'delivered' || a.paid ? 1 : 0;
        const bDone = b.status === 'delivered' || b.paid ? 1 : 0;
        if (aDone !== bDone) return aDone - bDone;
        return (b.date || '').localeCompare(a.date || '');
      });

      return { me, list: myTickets };
    }

    function fmtVND(n) { return (+n || 0).toLocaleString('vi-VN') + '₫'; }

    function renderMyTickets() {
      const host = document.getElementById('mtList');
      if (!host) return;
      const { me, list } = getCustomerTickets();

      if (!me) {
        host.innerHTML = `
          <div class="mt-empty">
            <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <p>Bạn cần đăng nhập để xem phiếu sửa.</p>
            <a href="admin.html" class="btn btn-primary">Đăng nhập</a>
          </div>`;
        return;
      }

      if (list.length === 0) {
        host.innerHTML = `
          <div class="mt-empty">
            <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <p>Bạn chưa có phiếu sửa nào.<br>Đặt lịch để FFC hỗ trợ bạn nhé!</p>
            <button class="btn btn-primary" onclick="closeMyTickets(); openBookingModal();">📝 Đặt lịch sửa</button>
          </div>`;
        return;
      }

      host.innerHTML = list.map(t => {
        const curIdx = STATUS_FLOW.indexOf(t.status);
        const timeline = STATUS_FLOW.map((s, i) => {
          const cls = i < curIdx ? 'done' : i === curIdx ? 'current' : '';
          return `<div class="mt-step ${cls}">
            <div class="mt-step-dot">${i < curIdx ? '✓' : i + 1}</div>
            <div class="mt-step-label">${STATUS_LABEL[s]}</div>
          </div>`;
        }).join('');

        const methodTag = t.bookingMethod
          ? `<span class="mt-status-badge" style="background:rgba(37,99,235,0.10); color:var(--blue);">${METHOD_LABEL[t.bookingMethod] || t.bookingMethod}</span>`
          : '';
        const sourceTag = t.source === 'online'
          ? `<span class="mt-status-badge" style="background:rgba(124,58,237,0.10); color:#7c3aed;">🌐 Online</span>`
          : '';

        return `
          <div class="mt-card">
            <div class="mt-card-head">
              <div>
                <div class="mt-code">${t.code}</div>
                <div class="mt-meta">Tiếp nhận: ${t.date || '—'}${t.lastStatusAt ? ` · Cập nhật: ${t.lastStatusAt}` : ''}</div>
              </div>
              <div style="display:flex; gap:6px; flex-wrap:wrap; justify-content:flex-end;">
                ${sourceTag}
                ${methodTag}
                <span class="mt-status-badge ${t.status}">${STATUS_LABEL[t.status] || t.status}</span>
              </div>
            </div>

            <div class="mt-device">${t.device || '—'}</div>
            <div class="mt-issue">${t.issue || '—'}</div>

            <div class="mt-timeline">${timeline}</div>

            <div class="mt-info-grid">
              <div class="mt-info-row"><span class="k">👨‍🔧 KTV:</span><span class="v">${t.tech || 'Chưa phân'}</span></div>
              ${t.bookingDate ? `<div class="mt-info-row"><span class="k">📅 Hẹn:</span><span class="v">${t.bookingDate} ${t.bookingSlot || ''}</span></div>` : ''}
              ${t.bookingAddress ? `<div class="mt-info-row" style="grid-column:1/-1;"><span class="k">📍 Địa chỉ:</span><span class="v">${t.bookingAddress}</span></div>` : ''}
            </div>

            ${t.quote > 0 ? `<div class="mt-quote"><span>Báo giá dự kiến</span><span class="v">${fmtVND(t.quote)}</span></div>` : ''}
            ${t.paid ? `<div class="mt-paid"><span>✓ Đã thanh toán · ${t.paidMethod === 'cash' ? 'Tiền mặt' : t.paidMethod === 'bank' ? 'Chuyển khoản' : 'Thẻ'}</span><span style="font-weight:800;">${fmtVND(t.finalAmount)}</span></div>` : ''}
          </div>
        `;
      }).join('');
    }

    window.openMyTickets = function () {
      document.getElementById('userDropdown')?.classList.remove('open');
      document.getElementById('myTicketsModal').classList.add('open');
      document.body.style.overflow = 'hidden';
      renderMyTickets();
    };

    window.closeMyTickets = function () {
      document.getElementById('myTicketsModal').classList.remove('open');
      document.body.style.overflow = '';
    };

    /* Live sync — re-render when admin updates ticket status in another tab */
    window.addEventListener('storage', (e) => {
      if (e.key === TICKETS_KEY || e.key === BOOKINGS_KEY) {
        if (document.getElementById('myTicketsModal')?.classList.contains('open')) {
          renderMyTickets();
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMyTickets();
    });
  })();

/* ============ Block 7: lines 7313-7537 ============ */
  (function () {
    const VALID_PAGES = ['home', 'laptop', 'mac', 'phone', 'services', 'pricing', 'training', 'buildpc', 'blog'];

    function goPage(name, skipScroll) {
      if (!VALID_PAGES.includes(name)) name = 'home';
      document.querySelectorAll('.page').forEach(p => {
        p.classList.toggle('active', p.dataset.page === name);
      });
      document.querySelectorAll('[data-page-link]').forEach(a => {
        a.classList.toggle('active', a.dataset.pageLink === name);
      });
      if (!skipScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handleHash() {
      const raw = (location.hash || '').replace('#', '');
      /* Reserved hashes — don't trigger page routing */
      if (raw === 'chat') return;
      goPage(raw || 'home');
    }

    window.addEventListener('hashchange', handleHash);
    /* Initial route on load */
    handleHash();

    /* Build PC calculator */
    function updateBuildPCTotal() {
      const ids = ['bpCpu', 'bpGpu', 'bpRam', 'bpSsd', 'bpPsu', 'bpCase'];
      let parts = 0;
      ids.forEach(id => {
        const sel = document.getElementById(id);
        if (sel && sel.options[sel.selectedIndex]) {
          parts += parseInt(sel.options[sel.selectedIndex].dataset.price || '0', 10);
        }
      });
      const assembly = 500000;
      const fmt = (n) => n.toLocaleString('vi-VN') + '₫';
      const partsEl = document.getElementById('bpParts');
      const totalEl = document.getElementById('bpTotal');
      if (partsEl) partsEl.textContent = fmt(parts);
      if (totalEl) totalEl.textContent = fmt(parts + assembly);
    }
    document.querySelectorAll('#bpCpu, #bpGpu, #bpRam, #bpSsd, #bpPsu, #bpCase').forEach(s => {
      s.addEventListener('change', updateBuildPCTotal);
    });
    updateBuildPCTotal();

    /* Shop category pills — visual only for now */
    document.querySelectorAll('.pill-row .pill').forEach(p => {
      p.addEventListener('click', () => {
        document.querySelectorAll('.pill-row .pill').forEach(x => x.classList.remove('active'));
        p.classList.add('active');
      });
    });

    /* ============ MacBook service catalog (iCare-style) ============ */
    const MAC_SERVICES = [
      { part: 'screen',   emoji: '📺', title: 'Thay màn hình MacBook Air 13" M2/M3 Retina', price: 5500000, warranty: '6 tháng', badge: 'hot' },
      { part: 'screen',   emoji: '📺', title: 'Thay màn hình MacBook Pro 14" M1/M2/M3 Pro', price: 8500000, warranty: '6 tháng' },
      { part: 'screen',   emoji: '📺', title: 'Thay màn hình MacBook Pro 16" M2/M3 Max', price: 12500000, warranty: '6 tháng' },
      { part: 'screen',   emoji: '🖥️', title: 'Thay màn hình iMac 24" M1/M3 Retina 4.5K', price: 7500000, warranty: '6 tháng' },
      { part: 'battery',  emoji: '🔋', title: 'Thay pin MacBook Air 13" — Apple original', price: 1800000, warranty: '6 tháng', badge: 'hot' },
      { part: 'battery',  emoji: '🔋', title: 'Thay pin MacBook Pro 14" — Apple original', price: 2500000, warranty: '6 tháng' },
      { part: 'battery',  emoji: '🔋', title: 'Thay pin MacBook Pro 16" — Apple original', price: 3200000, warranty: '6 tháng' },
      { part: 'keyboard', emoji: '⌨️', title: 'Thay Magic Keyboard MacBook Air M2/M3 (top case)', price: 2800000, warranty: '3 tháng' },
      { part: 'keyboard', emoji: '⌨️', title: 'Thay Magic Keyboard MacBook Pro 14"/16"', price: 3500000, warranty: '3 tháng' },
      { part: 'ssd',      emoji: '💾', title: 'Nâng cấp SSD MacBook Pro 2019 Intel 256GB → 1TB', price: 2800000, warranty: '12 tháng' },
      { part: 'ssd',      emoji: '💾', title: 'Nâng cấp SSD MacBook Pro 2017 Intel → 2TB NVMe', price: 4500000, warranty: '12 tháng' },
      { part: 'mainboard',emoji: '🧠', title: 'Sửa main MacBook M1 — lỗi nguồn, không lên', price: 1800000, warranty: '3 tháng' },
      { part: 'mainboard',emoji: '🧠', title: 'Sửa main MacBook M2 — hấp main, sửa nguồn cấp', price: 2500000, warranty: '3 tháng' },
      { part: 'mainboard',emoji: '🧠', title: 'Sửa main MacBook M3 Pro/Max — chuyên sâu', price: 3200000, warranty: '3 tháng' },
      { part: 'ram',      emoji: '📊', title: 'Nâng cấp RAM iMac 27" 2017-2020 từ 8GB → 32GB', price: 2400000, warranty: '12 tháng' },
      { part: 'clean',    emoji: '🧹', title: 'Vệ sinh + tra keo MacBook Air — giảm nhiệt 10°C', price: 350000, warranty: '3 tháng' },
      { part: 'clean',    emoji: '🧹', title: 'Vệ sinh + tra keo Liquid Metal MacBook Pro 16"', price: 600000, warranty: '3 tháng', badge: 'hot' },
      { part: 'fan',      emoji: '🌬️', title: 'Thay quạt tản nhiệt MacBook Pro 14"/16"', price: 850000, warranty: '6 tháng' },
      { part: 'speaker',  emoji: '🔊', title: 'Thay loa MacBook Pro 16" — loa hi-fi 6 củ', price: 1200000, warranty: '3 tháng' },
      { part: 'hinge',    emoji: '🔗', title: 'Sửa / thay bản lề MacBook Pro', price: 950000, warranty: '6 tháng' },
      { part: 'case',     emoji: '📦', title: 'Thay vỏ A/B/C/D MacBook Air bị móp', price: 1500000, warranty: '3 tháng' },
      { part: 'charger',  emoji: '⚡', title: 'Sạc MagSafe 3 USB-C 96W — chính hãng Apple', price: 850000, warranty: '12 tháng' },
      { part: 'charger',  emoji: '⚡', title: 'Sạc MagSafe 3 USB-C 140W — MacBook Pro 16"', price: 1300000, warranty: '12 tháng' },
    ];

    let macFilter = 'all';
    let macSort = 'popular';

    function renderMacServices() {
      const host = document.getElementById('macServiceGrid');
      if (!host) return;
      let list = macFilter === 'all' ? MAC_SERVICES.slice() : MAC_SERVICES.filter(s => s.part === macFilter);
      const sorters = {
        popular: (a, b) => (b.badge === 'hot' ? 1 : 0) - (a.badge === 'hot' ? 1 : 0),
        'price-asc':  (a, b) => a.price - b.price,
        'price-desc': (a, b) => b.price - a.price,
        name: (a, b) => a.title.localeCompare(b.title, 'vi'),
      };
      list.sort(sorters[macSort] || sorters.popular);
      const fmt = (n) => n.toLocaleString('vi-VN') + '₫';
      host.innerHTML = list.length ? list.map(s => `
        <div class="service-card">
          <div class="thumb">
            ${s.badge ? `<div class="badge-corner ${s.badge === 'hot' ? 'hot' : ''}">${s.badge === 'hot' ? 'HOT' : 'MỚI'}</div>` : ''}
            ${s.emoji}
          </div>
          <div class="body">
            <div class="title">${s.title}</div>
            <div class="meta">
              <span class="price">${fmt(s.price)}</span>
              <span class="warranty-tag">BH ${s.warranty}</span>
            </div>
          </div>
        </div>
      `).join('') : `<div style="grid-column:1/-1; text-align:center; padding:60px 20px; color:var(--text-3);">Không có dịch vụ nào trong nhóm này</div>`;
    }

    document.addEventListener('click', (e) => {
      const chip = e.target.closest('#macPartChips .chip-icon');
      if (chip) {
        e.preventDefault();
        macFilter = chip.dataset.part;
        document.querySelectorAll('#macPartChips .chip-icon').forEach(c => c.classList.toggle('active', c === chip));
        renderMacServices();
      }
    });
    const macSortEl = document.getElementById('macSortSelect');
    if (macSortEl) {
      macSortEl.addEventListener('change', (e) => {
        macSort = e.target.value;
        renderMacServices();
      });
    }
    renderMacServices();

    /* ============ Phone service catalog (iCare-style) ============ */
    const PHONE_SERVICES = [
      { part: 'screen',    emoji: '📱', title: 'Thay màn iPhone 15 Pro Max OLED zin Apple', price: 7200000, warranty: '6 tháng', badge: 'hot' },
      { part: 'screen',    emoji: '📱', title: 'Thay màn iPhone 14 Pro Hard OLED chính hãng', price: 4800000, warranty: '6 tháng' },
      { part: 'screen',    emoji: '📱', title: 'Thay màn iPhone 13/13 Pro OLED loại 1', price: 2800000, warranty: '6 tháng', badge: 'hot' },
      { part: 'screen',    emoji: '📱', title: 'Thay màn iPhone 12 LCD INCELL — giá rẻ', price: 1200000, warranty: '3 tháng' },
      { part: 'screen',    emoji: '📱', title: 'Thay màn Samsung S24 Ultra original (service pack)', price: 6800000, warranty: '6 tháng' },
      { part: 'screen',    emoji: '📱', title: 'Thay màn Xiaomi 13T Pro AMOLED', price: 2400000, warranty: '6 tháng' },
      { part: 'battery',   emoji: '🔋', title: 'Thay pin iPhone 15 Pro Max — Apple original', price: 1500000, warranty: '6 tháng', badge: 'hot' },
      { part: 'battery',   emoji: '🔋', title: 'Thay pin iPhone 14/14 Pro Pisen — dung lượng cao', price: 650000, warranty: '6 tháng' },
      { part: 'battery',   emoji: '🔋', title: 'Thay pin iPhone 13/13 Pro chính hãng', price: 580000, warranty: '6 tháng', badge: 'hot' },
      { part: 'battery',   emoji: '🔋', title: 'Thay pin Samsung Note 20 Ultra', price: 850000, warranty: '6 tháng' },
      { part: 'camera',    emoji: '📷', title: 'Thay camera sau iPhone 14 Pro Max — cụm 3 mắt', price: 2400000, warranty: '3 tháng' },
      { part: 'camera',    emoji: '📷', title: 'Thay camera trước iPhone 13 — Face ID giữ nguyên', price: 1200000, warranty: '3 tháng' },
      { part: 'camera',    emoji: '📷', title: 'Thay camera tele 5x iPhone 15 Pro Max', price: 3500000, warranty: '3 tháng' },
      { part: 'speaker',   emoji: '🔊', title: 'Thay loa trong iPhone 13/14 — loa nghe điện thoại', price: 480000, warranty: '3 tháng' },
      { part: 'speaker',   emoji: '🔊', title: 'Thay loa ngoài iPhone 14 — loa thoại + nhạc', price: 580000, warranty: '3 tháng' },
      { part: 'speaker',   emoji: '🎙️', title: 'Thay mic dưới iPhone 12/13 — sửa lỗi không nghe được', price: 380000, warranty: '3 tháng' },
      { part: 'touch',     emoji: '👆', title: 'Sửa IC cảm ứng iPhone XS/XR — lỗi đơ touch', price: 750000, warranty: '3 tháng' },
      { part: 'touch',     emoji: '👆', title: 'Thay cụm cảm ứng Samsung Galaxy S22', price: 1800000, warranty: '3 tháng' },
      { part: 'charging',  emoji: '🔌', title: 'Sửa chân sạc iPhone 11/12 — lỗi không sạc được', price: 450000, warranty: '6 tháng' },
      { part: 'charging',  emoji: '🔌', title: 'Thay cụm chân sạc Samsung Note 20', price: 680000, warranty: '6 tháng' },
      { part: 'glass',     emoji: '💎', title: 'Ép kính iPhone 14 Pro Max — máy ép chân không', price: 450000, warranty: '1 tháng', badge: 'hot' },
      { part: 'glass',     emoji: '💎', title: 'Ép kính iPhone 13/13 Pro — giữ nguyên cảm ứng', price: 380000, warranty: '1 tháng' },
      { part: 'glass',     emoji: '🔷', title: 'Thay kính lưng iPhone 13 Pro Max', price: 580000, warranty: '3 tháng' },
      { part: 'glass',     emoji: '🔷', title: 'Thay kính lưng iPhone 15 Pro Titanium', price: 950000, warranty: '3 tháng' },
      { part: 'button',    emoji: '⏺️', title: 'Thay nút Home Touch ID iPhone 7/8 Plus', price: 350000, warranty: '3 tháng' },
      { part: 'button',    emoji: '⏺️', title: 'Thay nút Power + nút âm lượng iPhone X/11', price: 420000, warranty: '3 tháng' },
      { part: 'mainboard', emoji: '🧠', title: 'Sửa main iPhone 11 — IC nguồn không sạc', price: 850000, warranty: '3 tháng' },
      { part: 'mainboard', emoji: '🧠', title: 'Sửa main iPhone X/XS — IC âm thanh, đèn flash', price: 680000, warranty: '3 tháng' },
      { part: 'mainboard', emoji: '🧠', title: 'Sửa main Samsung — đóng chip CPU/RAM', price: 1500000, warranty: '3 tháng' },
      { part: 'water',     emoji: '💧', title: 'Vệ sinh + xử lý iPhone ngấm nước (cứu cấp 24h)', price: 800000, warranty: '—', badge: 'hot' },
      { part: 'water',     emoji: '💧', title: 'Xử lý điện thoại Android ngấm nước', price: 500000, warranty: '—' },
      { part: 'unlock',    emoji: '🔓', title: 'Mở mạng iPhone — Lock SK / Viettel / Mobi', price: 1200000, warranty: 'vĩnh viễn' },
      { part: 'unlock',    emoji: '🔓', title: 'Xoá iCloud Owner iPhone (máy có nguồn gốc hợp lệ)', price: 1800000, warranty: '—' },
    ];

    let phoneFilter = 'all';
    let phoneSort = 'popular';

    function renderPhoneServices() {
      const host = document.getElementById('phoneServiceGrid');
      if (!host) return;
      let list = phoneFilter === 'all' ? PHONE_SERVICES.slice() : PHONE_SERVICES.filter(s => s.part === phoneFilter);
      const sorters = {
        popular: (a, b) => (b.badge === 'hot' ? 1 : 0) - (a.badge === 'hot' ? 1 : 0),
        'price-asc':  (a, b) => a.price - b.price,
        'price-desc': (a, b) => b.price - a.price,
        name: (a, b) => a.title.localeCompare(b.title, 'vi'),
      };
      list.sort(sorters[phoneSort] || sorters.popular);
      const fmt = (n) => n.toLocaleString('vi-VN') + '₫';
      host.innerHTML = list.length ? list.map(s => `
        <div class="service-card">
          <div class="thumb">
            ${s.badge ? `<div class="badge-corner ${s.badge === 'hot' ? 'hot' : ''}">${s.badge === 'hot' ? 'HOT' : 'MỚI'}</div>` : ''}
            ${s.emoji}
          </div>
          <div class="body">
            <div class="title">${s.title}</div>
            <div class="meta">
              <span class="price">${fmt(s.price)}</span>
              <span class="warranty-tag">BH ${s.warranty}</span>
            </div>
          </div>
        </div>
      `).join('') : `<div style="grid-column:1/-1; text-align:center; padding:60px 20px; color:var(--text-3);">Không có dịch vụ nào trong nhóm này</div>`;
    }

    document.addEventListener('click', (e) => {
      const chip = e.target.closest('#phonePartChips .chip-icon');
      if (chip) {
        e.preventDefault();
        phoneFilter = chip.dataset.part;
        document.querySelectorAll('#phonePartChips .chip-icon').forEach(c => c.classList.toggle('active', c === chip));
        renderPhoneServices();
      }
    });
    const phoneSortEl = document.getElementById('phoneSortSelect');
    if (phoneSortEl) {
      phoneSortEl.addEventListener('change', (e) => {
        phoneSort = e.target.value;
        renderPhoneServices();
      });
    }
    renderPhoneServices();

    /* Re-render service catalogs on language change */
    window.addEventListener('langchange', () => {
      renderMacServices();
      renderPhoneServices();
    });
  })();
