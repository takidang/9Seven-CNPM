<div align="center">

# UI / UX — FFC Frontend

### Phần giao diện người dùng của hệ thống Fix Fast Center

HTML5 · CSS3 · Vanilla JavaScript · Chart.js · i18n VI / EN

[← Quay lại README chính](../README.md)

</div>

---

## 1. Giới thiệu

Module này chứa toàn bộ **frontend tĩnh** (HTML/CSS/JS thuần) của hệ thống FFC. Có thể chạy độc lập với backend qua một local HTTP server, hữu ích cho việc thiết kế, kiểm thử UX, và demo độc lập.

| Thông tin | Chi tiết |
| :--- | :--- |
| **Loại** | Static frontend (không build step) |
| **Phụ thuộc runtime** | Chỉ cần một HTTP server (Python, Node, hoặc bất kỳ) |
| **Phụ thuộc CDN** | Chart.js 4.4, Google Fonts (Inter) |
| **Backend liên kết** | [`../9Seven-CNPM/`](../9Seven-CNPM/) (sẽ tích hợp qua REST API) |

---

## 2. Cấu trúc thư mục

```
UI-UX/
├── frontend/
│   ├── index.html          ← Trang khách hàng — landing + đặt lịch sửa
│   ├── admin.html          ← Trang đăng nhập KTV (giao diện brand FFC)
│   ├── dashboard.html      ← Bảng điều khiển nội bộ (KTV / Admin)
│   ├── chat.html           ← Chat khách hàng ↔ KTV
│   └── assets/
│       ├── images/         ← Logo, ảnh team, ảnh hero
│       └── js/
│           └── i18n.js     ← Module đa ngôn ngữ tự viết
├── docs/                   ← Tài liệu thiết kế (xem docs/README.md)
├── backend/                ← Placeholder cũ — backend thật ở /9Seven-CNPM
├── LICENSE                 ← MIT
└── README.md               ← (File này)
```

---

## 3. Các trang chính

| Trang | URL local | Vai trò |
| :--- | :--- | :--- |
| **Landing** | `/index.html` | Trang khách hàng — giới thiệu, đặt lịch sửa, gặp team |
| **Đăng nhập** | `/admin.html` | Form đăng nhập KTV / khách hàng |
| **Dashboard** | `/dashboard.html` | Bảng điều khiển nội bộ — phiếu sửa, kho, báo cáo |
| **Chat** | `/chat.html` | Trò chuyện thời gian thực giữa khách và KTV |

---

## 4. Chạy & kiểm thử

### 4.1. Cách nhanh (khuyến nghị)

```bash
cd UI-UX/frontend
python3 -m http.server 8000
```

Mở <http://localhost:8000/index.html>.

### 4.2. Tài khoản demo

| Vai trò | Username | Password | Redirect đến |
| :--- | :--- | :--- | :--- |
| Kỹ thuật viên | `admin` | `admin` | `dashboard.html` |
| Khách hàng | `khach` | `khach` | `index.html` (chat widget hiện ra) |

### 4.3. Edit mode (chỉnh vị trí ảnh hero)

Mở `index.html?edit=1` — kéo thả 3 ảnh sản phẩm (PC, laptop, iPhone), lăn chuột để zoom (giữ `Shift` để fine-tune), bấm **Copy CSS** để lấy giá trị paste vào stylesheet. Tắt `?edit=1` thì trang trở lại bình thường.

---

## 5. Phong cách code

### 5.1. CSS architecture

- **CSS variables** (`--brand-*`, `--text-*`, `--surface-*`) định nghĩa trong `:root`
- **Dark mode** áp qua attribute `[data-theme="dark"]` trên `<html>` — đồng bộ giữa các tab qua `localStorage`
- **Anti-FOUC**: áp theme trong `<head>` trước khi render → tránh nháy sáng → tối khi load lại

### 5.2. JavaScript

- Vanilla ES6+, không transpile
- Module pattern qua IIFE để tránh ô nhiễm `window`
- Mock data inline (`const TICKETS = [...]`) — sẽ thay bằng `fetch('/api/tickets')` khi tích hợp BE

### 5.3. i18n

```html
<!-- Văn bản -->
<span data-i18n="login.welcome">Chào mừng</span>

<!-- Placeholder / aria-label / title -->
<input data-i18n-attr="placeholder:login.placeholder.user" />
```

Đăng ký key mới trong [`assets/js/i18n.js`](frontend/assets/js/i18n.js):

```js
'login.team_badge': { vi: 'Đang hoạt động', en: 'Online' },
```

---

## 6. Trạng thái phát triển

| Trang / Tính năng | Hoàn thành | Ghi chú |
| :--- | :---: | :--- |
| Landing (`index.html`) | ✅ | Hero, services, team, footer |
| Đăng nhập (`admin.html`) | ✅ | Login form, dual role admin/khách |
| Dashboard — Tổng quan | ✅ | KPI cards, gần đây |
| Dashboard — Tiếp nhận | ✅ | Form tạo phiếu mới |
| Dashboard — Phiếu sửa | ✅ | List + filter + modal chi tiết |
| Dashboard — Khách hàng | ✅ | Bảng + tìm kiếm |
| Dashboard — Chat support | ✅ | UI chat nội bộ |
| Dashboard — Kho linh kiện | ✅ | 15 SKU mẫu + filter + cảnh báo tồn |
| Dashboard — Thanh toán | ✅ | Modal hóa đơn + stats |
| Dashboard — Báo cáo | ✅ | 4 KPI + 4 charts (Chart.js) |
| Dashboard — Nhân viên | ⏳ | Stub — sẽ làm Sprint 3 |
| Dashboard — Cài đặt | ⏳ | Stub — sẽ làm Sprint 3 |
| Chat (`chat.html`) | 🟡 | UI xong, chưa wire realtime backend |

✅ = Hoàn thành · 🟡 = Đang hoàn thiện · ⏳ = Chưa bắt đầu

---

## 7. Việc cần làm

- [ ] Tách CSS ra `assets/css/` (`theme.css`, `components.css`, `pages/*.css`)
- [ ] Tách JS ra `assets/js/` (`theme.js`, `nav.js`, `dashboard.js`...)
- [ ] Xoá toàn bộ inline `onclick=""` → dùng `addEventListener`
- [ ] Tách header / footer ra component dùng chung 4 trang
- [ ] Tối ưu ảnh (compress `F3-FFCenter.png` từ 2MB → ~300KB qua WebP)
- [ ] Đổi tên file ảnh `Nhân viên.png` thành `nhan-vien.png` (bỏ dấu cách + dấu)
- [ ] Tích hợp `fetch` thay mock data khi backend sẵn sàng

---

## 8. License

MIT — xem [LICENSE](LICENSE).
