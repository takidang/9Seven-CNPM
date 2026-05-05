# 9seven – Pharmacy Academy (Đồ án CNPM)

> Website học tập & tra cứu kiến thức ngành Dược – Đồ án môn Công nghệ Phần mềm.

## 📚 Giới thiệu

**Pharmacy Academy** là nền tảng web hỗ trợ sinh viên ngành Dược học tập, tra cứu thuốc, và trao đổi với giảng viên/đồng môn. Dự án gồm 3 trang chính:

| Trang | Mô tả |
|---|---|
| `index.html` | Trang chủ – giới thiệu, danh mục khóa học, đối tác |
| `admin.html` | Trang quản trị – quản lý nội dung, người dùng, khóa học |
| `chat.html`  | Trang chat – trao đổi giữa người dùng |

## 🗂 Cấu trúc dự án

```
9seven-DoAnCNPM/
├── frontend/           # Giao diện người dùng (HTML/CSS/JS thuần)
│   ├── index.html
│   ├── admin.html
│   ├── chat.html
│   └── assets/
│       ├── images/     # Hình ảnh, logo
│       ├── js/         # JavaScript (i18n, ...)
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

- [x] Thiết kế UI trang chủ, admin, chat
- [x] Đa ngôn ngữ (Việt/Anh) qua `i18n.js`
- [ ] Tách CSS riêng khỏi HTML
- [ ] Xây dựng backend & database
- [ ] Kết nối frontend ↔ backend
- [ ] Triển khai & viết tài liệu CNPM

## 📄 License

MIT – xem file [LICENSE](LICENSE).
