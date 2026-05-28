-- ============================================================
--  FFC — FIX FAST CENTER
--  Hệ thống quản lý cửa hàng sửa chữa điện thoại & máy tính
--  Database design — MySQL 8.0+
--  Nhóm 9Seven — Đồ án Công nghệ Phần mềm
-- ============================================================
--  Cách chạy:
--    mysql -u root -p < ffc_database.sql
--  hoặc mở MySQL Workbench → File → Run SQL Script
-- ============================================================

-- ========== 1. TẠO DATABASE ==========
DROP DATABASE IF EXISTS ffc_management;
CREATE DATABASE ffc_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE ffc_management;

-- ============================================================
--  2. TẠO BẢNG (CREATE TABLE)
-- ============================================================

-- ---------- 2.1. Khách hàng ----------
CREATE TABLE Customers (
    CustomerID    INT PRIMARY KEY AUTO_INCREMENT,
    FullName      VARCHAR(100) NOT NULL,
    Phone         VARCHAR(15)  NOT NULL UNIQUE,
    Email         VARCHAR(100) UNIQUE,
    Address       VARCHAR(255),
    CreatedAt     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ---------- 2.2. Kỹ thuật viên ----------
CREATE TABLE Technicians (
    TechnicianID    INT PRIMARY KEY AUTO_INCREMENT,
    FullName        VARCHAR(100) NOT NULL,
    Specialty       VARCHAR(100),                       -- iPhone, Màn hình, Main laptop...
    Phone           VARCHAR(15),
    Status          ENUM('working','leave','off') NOT NULL DEFAULT 'working',
    CommissionRate  DECIMAL(5,2) NOT NULL DEFAULT 0      -- % hoa hồng
                    CHECK (CommissionRate >= 0 AND CommissionRate <= 100)
);

-- ---------- 2.3. Tài khoản (đăng nhập + phân quyền) ----------
CREATE TABLE Accounts (
    AccountID     INT PRIMARY KEY AUTO_INCREMENT,
    Username      VARCHAR(50)  NOT NULL UNIQUE,
    PasswordHash  VARCHAR(255) NOT NULL,
    Role          ENUM('admin','manager','technician','receptionist','customer') NOT NULL,
    TechnicianID  INT,                                  -- NULL nếu là khách / admin thuần
    IsActive      TINYINT(1)   NOT NULL DEFAULT 1,
    FOREIGN KEY (TechnicianID) REFERENCES Technicians(TechnicianID)
);

-- ---------- 2.4. Thiết bị của khách ----------
CREATE TABLE Devices (
    DeviceID      INT PRIMARY KEY AUTO_INCREMENT,
    CustomerID    INT NOT NULL,
    DeviceType    VARCHAR(50)  NOT NULL,                 -- Điện thoại, Laptop, Máy tính bàn...
    Brand         VARCHAR(50),                           -- Apple, Samsung, Dell...
    Model         VARCHAR(100),
    SerialNumber  VARCHAR(100),                          -- IMEI / Serial
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

-- ---------- 2.5. Phiếu sửa chữa ----------
CREATE TABLE RepairOrders (
    OrderID         INT PRIMARY KEY AUTO_INCREMENT,
    OrderCode       VARCHAR(20) NOT NULL UNIQUE,         -- FFC-0094...
    CustomerID      INT NOT NULL,
    TechnicianID    INT,                                 -- KTV phụ trách (có thể chưa gán)
    DeviceID        INT NOT NULL,
    IssueDescription VARCHAR(255) NOT NULL,              -- Mô tả lỗi
    IntakeDate      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    QuotedPrice     DECIMAL(12,2) DEFAULT 0 CHECK (QuotedPrice >= 0),
    Status          ENUM('waiting','in-progress','testing','done','cancelled')
                    NOT NULL DEFAULT 'waiting',
    IsUrgent        TINYINT(1) NOT NULL DEFAULT 0,
    FOREIGN KEY (CustomerID)   REFERENCES Customers(CustomerID),
    FOREIGN KEY (TechnicianID) REFERENCES Technicians(TechnicianID),
    FOREIGN KEY (DeviceID)     REFERENCES Devices(DeviceID)
);

-- ---------- 2.6. Linh kiện / kho ----------
CREATE TABLE Parts (
    PartID        INT PRIMARY KEY AUTO_INCREMENT,
    SKU           VARCHAR(30)  NOT NULL UNIQUE,
    PartName      VARCHAR(100) NOT NULL,
    Category      VARCHAR(50),                           -- Màn hình, Pin, Bàn phím...
    Stock         INT NOT NULL DEFAULT 0 CHECK (Stock >= 0),
    MinStock      INT NOT NULL DEFAULT 0 CHECK (MinStock >= 0),  -- mức cảnh báo
    CostPrice     DECIMAL(10,2) NOT NULL CHECK (CostPrice >= 0), -- giá nhập
    SellPrice     DECIMAL(10,2) NOT NULL CHECK (SellPrice >= 0)  -- giá bán
);

-- ---------- 2.7. Chi tiết linh kiện dùng trong phiếu (bảng trung gian n-n) ----------
CREATE TABLE RepairParts (
    RepairPartID  INT PRIMARY KEY AUTO_INCREMENT,
    OrderID       INT NOT NULL,
    PartID        INT NOT NULL,
    Quantity      INT NOT NULL CHECK (Quantity > 0),
    UnitPrice     DECIMAL(10,2) NOT NULL CHECK (UnitPrice >= 0), -- giá tại thời điểm dùng
    FOREIGN KEY (OrderID) REFERENCES RepairOrders(OrderID),
    FOREIGN KEY (PartID)  REFERENCES Parts(PartID)
);

-- ---------- 2.8. Hóa đơn ----------
CREATE TABLE Invoices (
    InvoiceID     INT PRIMARY KEY AUTO_INCREMENT,
    InvoiceCode   VARCHAR(20) NOT NULL UNIQUE,
    OrderID       INT NOT NULL,
    IssueDate     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    TotalAmount   DECIMAL(12,2) NOT NULL CHECK (TotalAmount >= 0),
    Discount      DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (Discount >= 0),
    FinalAmount   DECIMAL(12,2) NOT NULL CHECK (FinalAmount >= 0),
    PaymentMethod ENUM('cash','transfer','card','ewallet') NOT NULL DEFAULT 'cash',
    PaymentStatus ENUM('pending','paid') NOT NULL DEFAULT 'pending',
    FOREIGN KEY (OrderID) REFERENCES RepairOrders(OrderID)
);

-- ---------- 2.9. Bảo hành ----------
CREATE TABLE Warranties (
    WarrantyID    INT PRIMARY KEY AUTO_INCREMENT,
    OrderID       INT NOT NULL,
    StartDate     DATE NOT NULL,
    EndDate       DATE NOT NULL,
    Terms         VARCHAR(255),                          -- điều kiện bảo hành
    Status        ENUM('active','expired','void') NOT NULL DEFAULT 'active',
    FOREIGN KEY (OrderID) REFERENCES RepairOrders(OrderID),
    CHECK (EndDate >= StartDate)
);

-- ---------- 2.10. Tin nhắn chat ----------
CREATE TABLE ChatMessages (
    MessageID     INT PRIMARY KEY AUTO_INCREMENT,
    CustomerID    INT NOT NULL,
    TechnicianID  INT,                                   -- NULL nếu khách gửi, có giá trị khi KTV trả lời
    SenderType    ENUM('customer','technician','system') NOT NULL,
    Content       TEXT NOT NULL,
    SentAt        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    IsRead        TINYINT(1) NOT NULL DEFAULT 0,
    FOREIGN KEY (CustomerID)   REFERENCES Customers(CustomerID),
    FOREIGN KEY (TechnicianID) REFERENCES Technicians(TechnicianID)
);

-- ---------- 2.11. Ca làm việc ----------
CREATE TABLE Shifts (
    ShiftID       INT PRIMARY KEY AUTO_INCREMENT,
    TechnicianID  INT NOT NULL,
    WorkDate      DATE NOT NULL,
    ShiftType     ENUM('morning','afternoon','full','off') NOT NULL,
    FOREIGN KEY (TechnicianID) REFERENCES Technicians(TechnicianID),
    UNIQUE (TechnicianID, WorkDate)                      -- 1 KTV chỉ 1 ca/ngày
);

-- ============================================================
--  3. THÊM DỮ LIỆU MẪU (INSERT)
-- ============================================================

-- ---------- Customers ----------
INSERT INTO Customers (FullName, Phone, Email, Address) VALUES
('Trần Thu Hà',  '0901234567', 'ha.tran@gmail.com',  'Q.1, TP.HCM'),
('Lê Quốc Anh',  '0908111222', 'anh.le@gmail.com',   'Q.3, TP.HCM'),
('Phạm Minh Tú', '0937555888', 'tu.pham@gmail.com',  'Q.5, TP.HCM'),
('Hoàng Lan',    '0987666333', 'lan.hoang@gmail.com','Q.10, TP.HCM'),
('Đỗ Văn Khoa',  '0945777999', 'khoa.do@gmail.com',  'Q.Bình Thạnh, TP.HCM');

-- ---------- Technicians ----------
INSERT INTO Technicians (FullName, Specialty, Phone, Status, CommissionRate) VALUES
('Minh Triết', 'Sửa iPhone',        '0911000001', 'working', 12.00),
('Trúc Ly',    'Thay màn hình',     '0911000002', 'working', 12.00),
('Tuấn Kiệt',  'Main laptop',       '0911000003', 'working', 15.00),
('Thanh Mai',  'Vệ sinh máy',       '0911000004', 'leave',   10.00),
('Hoài Nam',   'Phục hồi dữ liệu',  '0911000005', 'working', 18.00);

-- ---------- Accounts ----------
INSERT INTO Accounts (Username, PasswordHash, Role, TechnicianID, IsActive) VALUES
('admin',   '$2y$10$adminhashdemo', 'admin',        NULL, 1),
('trietm',  '$2y$10$techhash01',    'technician',   1,    1),
('lytruc',  '$2y$10$techhash02',    'technician',   2,    1),
('kiett',   '$2y$10$techhash03',    'technician',   3,    1),
('letan01', '$2y$10$recephash',     'receptionist', NULL, 1);

-- ---------- Devices ----------
INSERT INTO Devices (CustomerID, DeviceType, Brand, Model, SerialNumber) VALUES
(1, 'Điện thoại', 'Samsung', 'Galaxy S24',   'SN-SS-0001'),
(2, 'Laptop',     'Apple',   'MacBook Pro M2','SN-MB-0002'),
(3, 'Điện thoại', 'Apple',   'iPhone 14',    'IMEI-0003'),
(4, 'Máy tính bảng','Apple', 'iPad Air 5',   'SN-IPAD-0004'),
(5, 'Laptop',     'Asus',    'ROG G15',      'SN-ROG-0005');

-- ---------- RepairOrders ----------
INSERT INTO RepairOrders (OrderCode, CustomerID, TechnicianID, DeviceID, IssueDescription, IntakeDate, QuotedPrice, Status, IsUrgent) VALUES
('FFC-0094', 1, 2, 1, 'Vỡ màn hình',        '2026-05-08 10:24:00', 2400000, 'waiting',     1),
('FFC-0093', 2, 3, 2, 'Chẩn đoán mainboard','2026-05-08 09:18:00', 0,       'in-progress', 0),
('FFC-0092', 3, 1, 3, 'Pin chai',           '2026-05-08 08:55:00', 850000,  'in-progress', 0),
('FFC-0091', 4, 2, 4, 'Không lên màn',      '2026-05-08 08:30:00', 1800000, 'testing',     0),
('FFC-0090', 5, 5, 5, 'Vệ sinh + tra keo',  '2026-05-08 08:12:00', 350000,  'done',        0);

-- ---------- Parts ----------
INSERT INTO Parts (SKU, PartName, Category, Stock, MinStock, CostPrice, SellPrice) VALUES
('IP14-LCD-A',  'Màn hình iPhone 14',   'Màn hình', 12, 5,  2800000, 3500000),
('IP13-BAT',    'Pin iPhone 13',        'Pin',      24, 10, 380000,  720000),
('SS-S24-LCD',  'Màn hình Samsung S24', 'Màn hình', 0,  3,  1900000, 2400000),
('MB-M2-KEY',   'Bàn phím MacBook M2',  'Bàn phím', 3,  5,  1200000, 1800000),
('IPAD-LCD-A5', 'Màn hình iPad Air 5',  'Màn hình', 4,  3,  1300000, 1800000);

-- ---------- RepairParts (linh kiện dùng trong phiếu) ----------
INSERT INTO RepairParts (OrderID, PartID, Quantity, UnitPrice) VALUES
(1, 3, 1, 2400000),   -- FFC-0094 dùng màn Samsung S24
(3, 2, 1, 720000),    -- FFC-0092 dùng pin iPhone 13
(4, 5, 1, 1800000),   -- FFC-0091 dùng màn iPad
(2, 4, 1, 1800000),   -- FFC-0093 dùng bàn phím MacBook
(5, 1, 1, 3500000);   -- FFC-0090 dùng màn iPhone 14

-- Minh họa ràng buộc CHECK (Quantity > 0) — câu dưới SẼ BÁO LỖI nếu bỏ comment:
-- INSERT INTO RepairParts (OrderID, PartID, Quantity, UnitPrice) VALUES (1, 1, 0, 3500000);
-- → MySQL chặn vì vi phạm CHECK (Quantity > 0) — chứng minh toàn vẹn dữ liệu.

-- ---------- Invoices ----------
INSERT INTO Invoices (InvoiceCode, OrderID, IssueDate, TotalAmount, Discount, FinalAmount, PaymentMethod, PaymentStatus) VALUES
('HD-0090', 5, '2026-05-08 11:00:00', 350000,  0,      350000,  'cash',     'paid'),
('HD-0092', 3, '2026-05-08 12:30:00', 720000,  20000,  700000,  'transfer', 'paid'),
('HD-0091', 4, '2026-05-08 14:00:00', 1800000, 0,      1800000, 'card',     'pending'),
('HD-0094', 1, '2026-05-08 15:10:00', 2400000, 100000, 2300000, 'ewallet',  'pending'),
('HD-0093', 2, '2026-05-08 16:45:00', 1800000, 0,      1800000, 'cash',     'pending');

-- ---------- Warranties ----------
INSERT INTO Warranties (OrderID, StartDate, EndDate, Terms, Status) VALUES
(5, '2026-05-08', '2026-06-08', 'Bảo hành vệ sinh 1 tháng',          'active'),
(3, '2026-05-08', '2026-11-08', 'Bảo hành pin 6 tháng',              'active'),
(4, '2026-05-08', '2026-08-08', 'Bảo hành màn hình 3 tháng',         'active'),
(1, '2026-05-08', '2026-08-08', 'Bảo hành màn hình 3 tháng',         'active'),
(2, '2026-05-08', '2027-05-08', 'Bảo hành mainboard 12 tháng',       'active');

-- ---------- ChatMessages ----------
INSERT INTO ChatMessages (CustomerID, TechnicianID, SenderType, Content, SentAt, IsRead) VALUES
(1, NULL, 'customer',   'Phiếu sửa của em đến đâu rồi ạ?',          '2026-05-08 10:30:00', 1),
(1, 2,    'technician', 'Máy của chị đang chờ linh kiện, 2 ngày nữa nhé', '2026-05-08 10:35:00', 1),
(3, NULL, 'customer',   'Thay pin bao lâu xong vậy shop?',          '2026-05-08 09:00:00', 1),
(3, 1,    'technician', 'Khoảng 45 phút là xong ạ',                 '2026-05-08 09:05:00', 0),
(2, NULL, 'customer',   'MacBook em bị lỗi gì vậy ạ?',              '2026-05-08 09:20:00', 0);

-- ---------- Shifts ----------
INSERT INTO Shifts (TechnicianID, WorkDate, ShiftType) VALUES
(1, '2026-05-08', 'morning'),
(2, '2026-05-08', 'full'),
(3, '2026-05-08', 'afternoon'),
(4, '2026-05-08', 'off'),
(5, '2026-05-08', 'full');

-- ============================================================
--  4. CÁC TRUY VẤN MINH HỌA (SELECT / JOIN / UPDATE / DELETE)
-- ============================================================

-- 4.1. Danh sách phiếu sửa kèm tên khách + KTV + thiết bị (JOIN 4 bảng)
SELECT
    ro.OrderCode                       AS 'Mã phiếu',
    c.FullName                         AS 'Khách hàng',
    c.Phone                            AS 'SĐT',
    CONCAT(d.Brand, ' ', d.Model)      AS 'Thiết bị',
    ro.IssueDescription                AS 'Lỗi',
    t.FullName                         AS 'KTV phụ trách',
    ro.QuotedPrice                     AS 'Báo giá',
    ro.Status                          AS 'Trạng thái'
FROM RepairOrders ro
JOIN Customers   c ON ro.CustomerID   = c.CustomerID
JOIN Devices     d ON ro.DeviceID     = d.DeviceID
LEFT JOIN Technicians t ON ro.TechnicianID = t.TechnicianID
ORDER BY ro.IntakeDate DESC;

-- 4.2. Doanh thu theo từng kỹ thuật viên (JOIN + GROUP BY + tính hoa hồng)
SELECT
    t.FullName                                   AS 'Kỹ thuật viên',
    COUNT(DISTINCT ro.OrderID)                   AS 'Số phiếu',
    SUM(i.FinalAmount)                           AS 'Doanh thu',
    ROUND(SUM(i.FinalAmount) * t.CommissionRate / 100) AS 'Hoa hồng'
FROM Technicians t
JOIN RepairOrders ro ON ro.TechnicianID = t.TechnicianID
JOIN Invoices     i  ON i.OrderID = ro.OrderID AND i.PaymentStatus = 'paid'
GROUP BY t.TechnicianID, t.FullName, t.CommissionRate
ORDER BY SUM(i.FinalAmount) DESC;

-- 4.3. Linh kiện sắp hết hàng (tồn <= mức tối thiểu)
SELECT SKU, PartName, Category, Stock, MinStock
FROM Parts
WHERE Stock <= MinStock
ORDER BY Stock ASC;

-- 4.4. Top linh kiện được dùng nhiều nhất (JOIN + GROUP BY)
SELECT
    p.PartName                  AS 'Linh kiện',
    SUM(rp.Quantity)            AS 'Số lượng đã dùng',
    SUM(rp.Quantity * rp.UnitPrice) AS 'Doanh thu linh kiện'
FROM RepairParts rp
JOIN Parts p ON rp.PartID = p.PartID
WHERE rp.Quantity > 0
GROUP BY p.PartID, p.PartName
ORDER BY SUM(rp.Quantity) DESC;

-- 4.5. Phiếu chưa thanh toán (JOIN Invoices)
SELECT
    ro.OrderCode    AS 'Mã phiếu',
    c.FullName      AS 'Khách hàng',
    i.InvoiceCode   AS 'Mã HĐ',
    i.FinalAmount   AS 'Số tiền',
    i.PaymentStatus AS 'Trạng thái'
FROM Invoices i
JOIN RepairOrders ro ON i.OrderID = ro.OrderID
JOIN Customers c     ON ro.CustomerID = c.CustomerID
WHERE i.PaymentStatus = 'pending';

-- 4.6. Lịch sử chat của 1 khách hàng (JOIN)
SELECT
    cm.SentAt        AS 'Thời gian',
    cm.SenderType    AS 'Người gửi',
    cm.Content       AS 'Nội dung'
FROM ChatMessages cm
JOIN Customers c ON cm.CustomerID = c.CustomerID
WHERE c.Phone = '0901234567'
ORDER BY cm.SentAt;

-- 4.7. UPDATE — Cập nhật tồn kho sau khi dùng linh kiện
UPDATE Parts
SET Stock = Stock - 1
WHERE PartID = 2;            -- dùng 1 pin iPhone 13

-- 4.8. UPDATE — Chuyển trạng thái phiếu sang 'done'
UPDATE RepairOrders
SET Status = 'done'
WHERE OrderCode = 'FFC-0091';

-- 4.9. DELETE — Xóa 1 dòng chi tiết linh kiện nhập nhầm
DELETE FROM RepairParts
WHERE RepairPartID = 5;

-- ============================================================
--  5. GHI CHÚ CHUẨN HÓA & TOÀN VẸN DỮ LIỆU
-- ============================================================
--  - Không lưu lặp tên/địa chỉ khách trong mỗi phiếu → tách bảng Customers.
--  - Một phiếu dùng nhiều linh kiện → tách bảng trung gian RepairParts
--    (quan hệ n-n giữa RepairOrders và Parts).
--  - UnitPrice lưu tại RepairParts (giá tại thời điểm dùng) để không bị
--    ảnh hưởng khi Parts.SellPrice thay đổi sau này.
--  - FOREIGN KEY đảm bảo toàn vẹn tham chiếu (không tạo phiếu cho khách
--    không tồn tại).
--  - CHECK (Quantity > 0, Stock >= 0, Price >= 0...) chặn dữ liệu vô lý.
--  - ENUM thay vì VARCHAR cho trạng thái → tránh sai chính tả, dữ liệu sạch.
--  - Database đạt chuẩn 3NF: mỗi thuộc tính phụ thuộc hoàn toàn vào khóa chính,
--    không có phụ thuộc bắc cầu.
-- ============================================================
