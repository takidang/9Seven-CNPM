# Backend — Placeholder

> **Lưu ý:** Backend thật của dự án đã được khởi tạo tại [`/9Seven-CNPM/`](../../9Seven-CNPM/) ở thư mục gốc repository — dùng **ASP.NET Core 10**.
>
> Folder này (`UI-UX/backend/`) giữ lại để tham chiếu cho giai đoạn đầu khi nhóm chưa chốt công nghệ. Sẽ được dọn dẹp khi backend chính thức ổn định.

---

## Backend chính ở đâu?

```
9Seven-CNPM/                ← root repo
├── 9Seven-CNPM/            ← ← ← Backend thật ở đây
│   ├── Controllers/
│   ├── Models/
│   ├── Views/
│   ├── Program.cs
│   └── 9Seven-CNPM.csproj
└── UI-UX/
    └── backend/            ← (folder này — placeholder)
```

---

## Chạy backend

```bash
cd 9Seven-CNPM     # từ root repo
dotnet restore
dotnet run
```

Mặc định chạy tại <http://localhost:5000>.

---

## Dự kiến chức năng

Khi backend được hoàn thiện, sẽ cung cấp REST API cho các nghiệp vụ sau:

- **Authentication** — đăng ký, đăng nhập (JWT), phân quyền (admin / KTV / khách)
- **Repair Orders** — CRUD phiếu sửa, lịch hẹn, lịch sử trạng thái
- **Customers** — quản lý hồ sơ khách hàng + lịch sử
- **Inventory** — linh kiện, nhập / xuất kho, cảnh báo tồn thấp
- **Warranty** — tra cứu bảo hành theo IMEI / mã phiếu
- **Chat** — realtime qua SignalR (khách ↔ KTV)
- **Reports** — doanh thu, KPI KTV, top linh kiện
- **File storage** — ảnh thiết bị trước / sau sửa
