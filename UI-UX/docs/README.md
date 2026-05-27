# Tài liệu CNPM — FFC

Nơi lưu **toàn bộ tài liệu môn Công nghệ Phần mềm** liên quan đến đồ án FFC. Tách riêng khỏi code để giữ repository sạch và tiện cho việc nộp bài cuối kỳ.

[← Quay lại UI-UX](../README.md) · [↑ Lên root README](../../README.md)

---

## Cấu trúc dự kiến

```
docs/
├── SRS.md                 ← Software Requirements Specification
├── use-case.md            ← Mô tả use-case chi tiết
├── api-spec.md            ← Tài liệu REST API (khi BE hoàn thiện)
├── diagrams/              ← Sơ đồ
│   ├── erd.png            ← Entity-Relationship Diagram
│   ├── class-diagram.png  ← Class diagram (UML)
│   ├── sequence/          ← Sequence diagrams cho các luồng chính
│   └── mockup/            ← Wireframe / mockup Figma export
├── meeting-notes/         ← Biên bản họp nhóm hằng tuần
│   └── YYYY-MM-DD.md      ← Format: theo ngày
├── reports/               ← Báo cáo theo sprint + báo cáo tổng kết
│   ├── sprint-1.md
│   ├── sprint-2.md
│   └── final-report.pdf
└── README.md              ← (File này)
```

---

## Danh mục tài liệu

| Tài liệu | Mô tả | Trạng thái |
| :--- | :--- | :--- |
| **SRS** | Đặc tả yêu cầu phần mềm — chức năng, phi chức năng, ràng buộc | ⏳ Chưa bắt đầu |
| **Use-case** | Use-case diagram + mô tả từng use-case | ⏳ Chưa bắt đầu |
| **ERD** | Mô hình thực thể & quan hệ database | ⏳ Chưa bắt đầu |
| **Class diagram** | Cấu trúc class backend (Domain models) | ⏳ Chưa bắt đầu |
| **Sequence diagrams** | Cho 3-5 luồng chính (đặt lịch, thanh toán...) | ⏳ Chưa bắt đầu |
| **API spec** | OpenAPI / Swagger spec | ⏳ Phụ thuộc BE |
| **Mockup** | Wireframe Figma | 🟡 Một phần (đã có UI HTML thực tế) |
| **Meeting notes** | Biên bản họp nhóm | ⏳ Bắt đầu từ Sprint 1 |
| **Sprint reports** | Báo cáo cuối mỗi sprint | ⏳ Sau Sprint 1 |
| **Final report** | Báo cáo tổng kết đồ án | ⏳ Cuối kỳ |

---

## Quy ước viết tài liệu

- **Ngôn ngữ:** Tiếng Việt (báo cáo cuối kỳ tiếng Việt)
- **Định dạng:** Markdown cho text, PNG / PDF cho hình
- **Tên file:** `kebab-case`, không dấu, không cách
  - ✅ `sprint-1-report.md`
  - ❌ `Báo cáo Sprint 1.md`
- **Hình:** Tối ưu kích thước trước commit (max 1MB / hình)
- **Diagram:** Dùng [draw.io](https://app.diagrams.net/), [Excalidraw](https://excalidraw.com/), hoặc [Mermaid](https://mermaid.js.org/) (text-based, render trên GitHub)

### Ví dụ Mermaid (render trực tiếp trên GitHub)

```markdown
\`\`\`mermaid
sequenceDiagram
  Khách hàng->>Web: Đặt lịch sửa
  Web->>API: POST /orders
  API->>DB: INSERT order
  DB-->>API: order_id
  API-->>Web: 201 Created
  Web-->>Khách hàng: Hiển thị mã phiếu
\`\`\`
```

---

## Liên kết hữu ích

- [Markdown cheatsheet](https://www.markdownguide.org/cheat-sheet/)
- [Mermaid syntax](https://mermaid.js.org/intro/)
- [PlantUML online](http://www.plantuml.com/plantuml/uml/)
- [Conventional Commits](https://www.conventionalcommits.org/)
