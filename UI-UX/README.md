# UI/UX — 9Seven · FFC (Fix Fast Center)

> Phần **thiết kế giao diện & trải nghiệm người dùng** của hệ thống quản lý cửa hàng sửa chữa điện thoại / máy tính **FFC (Fix Fast Center)** — Đồ án môn **Công nghệ Phần mềm** của nhóm **9Seven**.

---

## 1. Giới thiệu

**FFC (Fix Fast Center)** là hệ thống quản lý tổng thể cho cửa hàng sửa chữa thiết bị điện tử, hỗ trợ:

- Tiếp nhận yêu cầu sửa chữa từ khách hàng (online + tại quầy).
- Phân công kỹ thuật viên, theo dõi tiến độ đơn sửa.
- Quản lý linh kiện, phụ tùng, bảo hành, báo giá.
- Chat trực tiếp giữa khách hàng và kỹ thuật viên.

Thư mục `UI-UX/` này chứa **toàn bộ phần frontend (HTML/CSS/JS thuần)**, tài liệu thiết kế và placeholder cho backend của dự án.

---

## 2. Cấu trúc thư mục

```
UI-UX/
├── frontend/                 # Giao diện người dùng (HTML/CSS/JS thuần)
│   ├── index.html            # Trang khách hàng – giới thiệu, đặt lịch sửa
│   ├── admin.html            # Trang quản trị / kỹ thuật viên
│   ├── dashboard.html        # Bảng điều khiển nội bộ
│   ├── chat.html             # Chat khách hàng ↔ kỹ thuật viên
│   └── assets/
│       ├── images/           # Logo, ảnh hero (PC, laptop, iPhone), ảnh team
│       └── js/
│           └── i18n.js       # Đa ngôn ngữ Việt / Anh
├── backend/                  # (Placeholder) Server / API / database – sẽ phát triển sau
│   └── README.md
├── docs/                     # Tài liệu CNPM (SRS, use-case, ERD, mockup…)
│   └── README.md
├── .gitignore
├── LICENSE                   # MIT
└── README.md                 # (File này)
```

---

## 3. Các trang chính

| Trang             | Vai trò                                                                 |
| ----------------- | ----------------------------------------------------------------------- |
| `index.html`      | Trang khách hàng — giới thiệu dịch vụ, đội ngũ kỹ thuật viên, đặt lịch  |
| `admin.html`      | Trang quản trị — tiếp nhận yêu cầu, trả lời khách, quản lý đơn          |
| `dashboard.html`  | Bảng điều khiển nội bộ — thống kê, theo dõi tiến độ                     |
| `chat.html`       | Chat trực tiếp giữa khách hàng và kỹ thuật viên                         |

---

## 4. Chạy thử (frontend)

Vì là HTML thuần, có 2 cách:

**Cách 1 — Mở trực tiếp:** double-click vào `frontend/index.html`.

**Cách 2 — Chạy local server (khuyến nghị):**

```bash
cd UI-UX/frontend
python3 -m http.server 8000
```

Sau đó truy cập: <http://localhost:8000/index.html>

### Tài khoản demo (trang admin)

| Field    | Value   |
| -------- | ------- |
| Username | `admin` |
| Password | `admin` |

### Edit mode (chỉnh vị trí 3 ảnh hero)

Mở `index.html?edit=1` → kéo-thả từng ảnh (PC / laptop / iPhone), lăn chuột để zoom (giữ `Shift` để fine-tune), bấm **Copy CSS** để lấy giá trị paste vào stylesheet. Tắt `?edit=1` → trang trở lại bình thường, không ảnh hưởng người dùng cuối.

---

## 5. Công nghệ

| Tầng         | Công nghệ                                                        |
| ------------ | ---------------------------------------------------------------- |
| **Frontend** | HTML5, CSS3, JavaScript (vanilla), i18n Việt / Anh               |
| **Backend**  | _Chưa chốt_ — dự kiến Node.js/Express hoặc PHP/Laravel           |
| **Database** | _Chưa chốt_ — dự kiến MySQL hoặc MongoDB                         |

---

## 6. Tiến độ

- [x] Thiết kế UI trang khách hàng, admin, dashboard, chat
- [x] Đa ngôn ngữ (Việt / Anh) qua `i18n.js`
- [x] Rebrand từ Pharmacy Academy → FFC (Fix Fast Center)
- [ ] Tách CSS riêng khỏi HTML
- [ ] Xây dựng backend & database
- [ ] Chức năng đặt lịch sửa thực tế
- [ ] Quản lý đơn sửa chữa (CRUD)
- [ ] Quản lý linh kiện / kho
- [ ] Hệ thống bảo hành
- [ ] Triển khai & viết tài liệu CNPM

---

## 7. Nhóm 9Seven

| Họ tên           | MSSV | Vai trò |
| ---------------- | ---- | ------- |
| _Cập nhật sau_   |      |         |
| _Cập nhật sau_   |      |         |
| _Cập nhật sau_   |      |         |

---

## 8. License

MIT — xem [LICENSE](LICENSE).
