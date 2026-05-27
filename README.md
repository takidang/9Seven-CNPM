<div align="center">

# 9Seven · FFC

### Fix Fast Center — Hệ thống quản lý cửa hàng sửa chữa thiết bị điện tử

Đồ án môn **Công nghệ Phần mềm** · Nhóm **9Seven**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![.NET](https://img.shields.io/badge/.NET-10.0-512BD4.svg)](https://dotnet.microsoft.com/)
[![Frontend](https://img.shields.io/badge/Frontend-HTML%20·%20CSS%20·%20JS-E34F26.svg)](UI-UX/)
[![Workflow](https://img.shields.io/badge/Workflow-Git%20Flow-F05032.svg)](#branch-model)
[![Status](https://img.shields.io/badge/Status-In%20Development-yellow.svg)]()

[Tổng quan](#1-tổng-quan) ·
[Tính năng](#2-tính-năng-chính) ·
[Kiến trúc](#3-kiến-trúc-dự-án) ·
[Bắt đầu](#5-bắt-đầu) ·
[Branch model](#6-branch-model) ·
[Tiến độ](#7-tiến-độ) ·
[Nhóm](#8-nhóm-phát-triển)

</div>

---

## 1. Tổng quan

**FFC (Fix Fast Center)** là hệ thống quản lý tổng thể cho cửa hàng sửa chữa điện thoại, laptop và thiết bị công nghệ. Dự án giải quyết các bài toán thực tế của một trung tâm sửa chữa quy mô vừa: tiếp nhận yêu cầu, phân công kỹ thuật viên, theo dõi tiến độ đơn sửa, quản lý linh kiện, bảo hành, và tương tác trực tiếp khách hàng ↔ kỹ thuật viên.

| Thông tin | Chi tiết |
| :--- | :--- |
| **Project name** | 9Seven-CNPM |
| **Course** | Công nghệ Phần mềm (Software Engineering) |
| **Team** | 9Seven |
| **Methodology** | Scrum — 2-week sprints |
| **PM tool** | [Jira](https://www.atlassian.com/software/jira) (board: `NICE7`) |
| **VCS strategy** | [Git Flow](#branch-model) |
| **Repository** | [github.com/takidang/9Seven-CNPM](https://github.com/takidang/9Seven-CNPM) |

---

## 2. Tính năng chính

### 2.1. Đối với khách hàng

- Đặt lịch sửa online, không cần đến cửa hàng
- Tra cứu trạng thái phiếu sửa theo mã đơn / số điện thoại
- Chat trực tiếp với kỹ thuật viên đang phụ trách
- Tra cứu bảo hành theo IMEI hoặc số phiếu
- Xem báo giá trước khi đồng ý sửa, in hóa đơn điện tử

### 2.2. Đối với kỹ thuật viên & quản trị

- Dashboard tổng quan: đơn mới, doanh thu trong ngày, KPI cá nhân
- Quản lý phiếu sửa: CRUD, lọc theo trạng thái, gán KTV, cập nhật tiến độ
- Quản lý linh kiện: nhập / xuất kho, cảnh báo tồn thấp, danh mục theo loại máy
- Thanh toán: tạo hóa đơn, áp dụng voucher, xuất bill
- Báo cáo & thống kê: doanh thu theo ngày/tháng, top KTV, top linh kiện bán chạy

---

## 3. Kiến trúc dự án

Dự án chia thành **2 module độc lập** trong cùng repository, cho phép FE và BE phát triển song song và có thể demo riêng biệt.

```
┌─────────────────────────┐       ┌─────────────────────────┐
│        FRONTEND         │ ◄───► │         BACKEND         │
│      UI-UX/frontend     │  REST │      9Seven-CNPM/       │
│   HTML · CSS · Vanilla  │   API │      ASP.NET Core 10    │
└─────────────────────────┘       └────────────┬────────────┘
                                                │
                                                ▼
                                   ┌─────────────────────────┐
                                   │        DATABASE         │
                                   │     SQL Server (TBD)    │
                                   └─────────────────────────┘
```

| Module | Đường dẫn | Vai trò |
| :--- | :--- | :--- |
| **Frontend (UI/UX)** | [`UI-UX/`](UI-UX/) | Giao diện người dùng, HTML thuần — chạy độc lập, không cần backend |
| **Backend (API)** | [`9Seven-CNPM/`](9Seven-CNPM/) | REST API + business logic, viết bằng ASP.NET Core MVC |

---

## 4. Công nghệ

<table>
<tr><th>Tầng</th><th>Công nghệ</th><th>Vai trò</th></tr>
<tr>
  <td rowspan="4"><b>Frontend</b></td>
  <td>HTML5 · CSS3</td><td>Cấu trúc & trình bày, không dùng framework để học vững nền tảng</td>
</tr>
<tr><td>Vanilla JavaScript (ES6+)</td><td>Tương tác client, không transpile</td></tr>
<tr><td>Chart.js 4.4</td><td>Biểu đồ trong tab Báo cáo &amp; Thống kê</td></tr>
<tr><td>i18n module (tự viết)</td><td>Đa ngôn ngữ Việt / Anh</td></tr>
<tr>
  <td rowspan="3"><b>Backend</b></td>
  <td>ASP.NET Core MVC (.NET 10)</td><td>Web framework + routing</td>
</tr>
<tr><td>C# 12</td><td>Ngôn ngữ chính</td></tr>
<tr><td>Entity Framework Core <i>(dự kiến)</i></td><td>ORM mapping &rarr; database</td></tr>
<tr>
  <td><b>Database</b></td>
  <td>SQL Server <i>(dự kiến)</i></td>
  <td>Lưu khách hàng, phiếu sửa, linh kiện, bảo hành</td>
</tr>
<tr>
  <td rowspan="4"><b>DevOps</b></td>
  <td>Git Flow</td><td>Branching strategy</td>
</tr>
<tr><td>GitHub</td><td>VCS, code review, issue tracking</td></tr>
<tr><td>Jira (board NICE7)</td><td>Sprint planning, user story, burndown</td></tr>
<tr><td>Visual Studio 2022 / Rider · VS Code</td><td>IDE backend / frontend</td></tr>
</table>

---

## 5. Bắt đầu

### 5.1. Yêu cầu hệ thống

| Tool | Phiên bản | Cần cho |
| :--- | :--- | :--- |
| .NET SDK | 10.0+ | Backend |
| Python | 3.8+ | Local FE server |
| Git | 2.30+ | Mọi thứ |
| (Tuỳ chọn) Visual Studio 2022 / Rider | latest | Develop backend với debugger |

### 5.2. Clone repository

```bash
git clone https://github.com/takidang/9Seven-CNPM.git
cd 9Seven-CNPM
git checkout Develop
```

### 5.3. Chạy Frontend

```bash
cd UI-UX/frontend
python3 -m http.server 8000
```

Mở trình duyệt tại <http://localhost:8000/index.html>.

**Tài khoản demo:**

| Vai trò | Username | Password |
| :--- | :--- | :--- |
| Kỹ thuật viên / Admin | `admin` | `admin` |
| Khách hàng | `khach` | `khach` |

Chi tiết thêm: xem [UI-UX/README.md](UI-UX/README.md).

### 5.4. Chạy Backend

```bash
cd 9Seven-CNPM
dotnet restore
dotnet run
```

Backend chạy tại <http://localhost:5000> (HTTPS: <https://localhost:5001>).

---

## 6. Branch model

Dự án dùng **Git Flow** với 3 nhánh chính:

```
master    ←  Production — code ổn định, demo được cho thầy
  ▲
  │   (merge khi sprint kết thúc)
  │
Develop   ←  Development — nhánh tích hợp các feature
  ▲
  │   (merge qua Pull Request)
  │
feature/* ←  Tính năng đang phát triển
Hotfix    ←  Sửa bug khẩn cấp ở production
```

### 6.1. Quy tắc

| Branch | Mục đích | Direct push |
| :--- | :--- | :--- |
| `master` | Code đã kiểm thử, sẵn sàng demo | ❌ Chỉ qua merge |
| `Develop` | Code đang phát triển, tích hợp | ✅ Cho phép |
| `feature/<tên>` | Tính năng mới | ✅ Tự do |
| `Hotfix` | Bug fix khẩn cấp | ⚠️ Cẩn trọng |

### 6.2. Workflow chuẩn

```bash
# 1. Bắt đầu task — đồng bộ Develop
git checkout Develop && git pull origin Develop

# 2. Tạo feature branch (tên gợi nhớ ticket Jira)
git checkout -b feature/NICE-15-inventory-page

# 3. Code, commit theo conventional commits
git add .
git commit -m "feat(inventory): add CRUD UI + low-stock alert"

# 4. Push & mở Pull Request về Develop
git push -u origin feature/NICE-15-inventory-page
```

### 6.3. Commit message convention

Theo chuẩn [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>
```

| Type | Khi nào dùng | Ví dụ |
| :--- | :--- | :--- |
| `feat` | Thêm tính năng mới | `feat(login): add forgot-password flow` |
| `fix` | Sửa bug | `fix(inventory): correct low-stock threshold` |
| `docs` | Sửa tài liệu | `docs(readme): update tech stack` |
| `style` | Format / whitespace | `style(dashboard): fix indentation` |
| `refactor` | Refactor không đổi behavior | `refactor: extract i18n to module` |
| `test` | Thêm / sửa test | `test(api): add ticket-creation tests` |
| `chore` | Việc lặt vặt | `chore: update .gitignore` |

---

## 7. Tiến độ

### 7.1. Sprint roadmap

| Sprint | Thời gian | Trọng tâm | Trạng thái |
| :---: | :--- | :--- | :--- |
| **0** | _Đã xong_ | Setup repo · Scaffolding · FE prototype | ✅ Hoàn thành |
| **1** | _Đang chạy_ | Đăng nhập · Tiếp nhận máy · Danh sách phiếu | 🟡 In progress |
| **2** | _Kế hoạch_ | Kho linh kiện · Thanh toán | ⏳ Sắp tới |
| **3** | _Kế hoạch_ | Báo cáo · Chat realtime · Bảo hành | ⏳ Sắp tới |

### 7.2. Feature backlog

- [x] Thiết kế UI 4 trang chính (index · admin · dashboard · chat)
- [x] Đa ngôn ngữ Việt / Anh (module i18n custom)
- [x] UI Kho linh kiện (NICE-15)
- [x] UI Báo cáo & thống kê với Chart.js (NICE-17)
- [ ] Tách CSS / JS ra file riêng (đang inline trong HTML)
- [ ] Backend Models: `Customer`, `RepairOrder`, `Technician`, `Part`, `Invoice`
- [ ] DbContext + Entity Framework migrations
- [ ] REST API: Customer / RepairOrder / Inventory / Payment
- [ ] Tích hợp FE ↔ BE qua `fetch`
- [ ] Hệ thống bảo hành (tra cứu theo IMEI)
- [ ] Chat realtime (SignalR)
- [ ] Triển khai (Azure / Vercel)
- [ ] Tài liệu CNPM: SRS · Use-case · ERD · Class diagram

> Tracking chi tiết tại Jira board **NICE7** (User Story + Acceptance Criteria + Story Points).

---

## 8. Nhóm phát triển

| Họ tên | MSSV | Vai trò chính | GitHub |
| :--- | :--- | :--- | :--- |
| _Cập nhật sau_ | _MSSV_ | Backend + Database | [@user](https://github.com/) |
| _Cập nhật sau_ | _MSSV_ | Frontend + UX | [@user](https://github.com/) |
| _Cập nhật sau_ | _MSSV_ | Documentation + Testing | [@user](https://github.com/) |
| _Cập nhật sau_ | _MSSV_ | Scrum Master + Demo | [@user](https://github.com/) |

---

## 9. License

Phân phối theo **MIT License**. Xem [LICENSE](UI-UX/LICENSE) để biết thêm chi tiết.

---

## 10. Liên hệ

- **Repository:** [github.com/takidang/9Seven-CNPM](https://github.com/takidang/9Seven-CNPM)
- **Issues / Bug reports:** [GitHub Issues](https://github.com/takidang/9Seven-CNPM/issues)
- **Project board:** Jira NICE7 (private)

<div align="center">

---

<sub>Made by team <b>9Seven</b> · 2026</sub>

</div>
