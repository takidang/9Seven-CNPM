# 9seven – FFC (Fix Fast Center) (Đồ án CNPM)

> Hệ thống quản lý tổng thể cho cửa hàng sửa chữa điện thoại & máy tính – Đồ án môn Công nghệ Phần mềm.

## 📚 Giới thiệu

**FFC (Fix Fast Center)** là hệ thống quản lý tổng thể giúp cửa hàng sửa chữa điện thoại & máy tính:
- Tiếp nhận yêu cầu sửa chữa từ khách hàng (online + tại quầy).
- Phân công kỹ thuật viên, theo dõi tiến độ đơn sửa.
- Quản lý linh kiện / phụ tùng, bảo hành, báo giá.
- Hỗ trợ chat trực tiếp giữa khách hàng và kỹ thuật viên.

Dự án gồm 3 trang chính:

| Trang | Mô tả |
|---|---|
| `index.html` | Trang khách hàng – giới thiệu dịch vụ, đội ngũ kỹ thuật viên, đặt lịch sửa |
| `admin.html` | Trang quản trị / kỹ thuật viên – nhận yêu cầu, trả lời khách hàng, quản lý đơn |
| `chat.html`  | Trang chat khách hàng ↔ kỹ thuật viên |

## 🗂 Cấu trúc dự án

```
9seven-DoAnCNPM/
├── frontend/           # Giao diện người dùng (HTML/CSS/JS thuần)
│   ├── index.html
│   ├── admin.html
│   ├── chat.html
│   └── assets/
│       ├── images/     # logo-ffc.png + ảnh sản phẩm hero (PC, laptop, iPhone)
│       ├── js/         # i18n.js (đa ngôn ngữ Việt/Anh)
│       └── css/        # CSS tách riêng (sẽ bổ sung)
├── backend/            # Server, API, database (sẽ phát triển sau)
├── docs/               # Tài liệu CNPM: SRS, use case, ERD, mockup
├── README.md
├── .gitignore
└── LICENSE
```

## 🚀 Chạy thử (frontend)

Vì là HTML thuần, có thể mở trực tiếp file `frontend/index.html` bằng trình duyệt, hoặc chạy local server:

```bash
cd frontend
python3 -m http.server 8000
```

Sau đó truy cập: <http://localhost:8000/index.html>

**Tài khoản demo (trang admin):**
- Username: `admin`
- Password: `admin`

**Chỉnh vị trí 3 ảnh hero (PC/laptop/iPhone) bằng kéo thả:**

Mở `index.html?edit=1` → kéo thả từng ảnh, lăn chuột để zoom (Shift để fine-tune), bấm "Copy CSS" để lấy giá trị paste vào stylesheet. Tắt `?edit=1` → mọi thứ trở lại bình thường, không ảnh hưởng người dùng cuối.

## 🛠 Công nghệ dự kiến

- **Frontend:** HTML5, CSS3, JavaScript (vanilla), i18n (Việt/Anh)
- **Backend:** _(sẽ chốt sau – Node.js/Express hoặc PHP/Laravel)_
- **Database:** _(sẽ chốt sau – MySQL/MongoDB)_

## 👥 Thành viên nhóm 9seven

| Họ tên | MSSV | Vai trò |
|---|---|---|
| _Cập nhật sau_ | | |
| _Cập nhật sau_ | | |
| _Cập nhật sau_ | | |

## 📅 Tiến độ

- [x] Thiết kế UI trang khách hàng, admin, chat
- [x] Đa ngôn ngữ (Việt/Anh) qua `i18n.js`
- [x] Rebrand từ Pharmacy Academy → FFC (Fix Fast Center)
- [ ] Tách CSS riêng khỏi HTML
- [ ] Xây dựng backend & database
- [ ] Chức năng đặt lịch sửa thực tế
- [ ] Quản lý đơn sửa chữa (CRUD)
- [ ] Quản lý linh kiện / kho
- [ ] Hệ thống bảo hành
- [ ] Triển khai & viết tài liệu CNPM

## 📄 License

MIT – xem file [LICENSE](LICENSE).
