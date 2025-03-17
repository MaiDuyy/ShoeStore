drop database ShoeStore
create database ShoeStore

IF OBJECT_ID(N'Admin', N'U') IS NOT NULL  DROP TABLE Admin;  
IF OBJECT_ID(N'Quantity', N'U') IS NOT NULL  DROP TABLE Quantity; 
IF OBJECT_ID(N'Images', N'U') IS NOT NULL  DROP TABLE Images; 
IF OBJECT_ID(N'Shoes', N'U') IS NOT NULL  DROP TABLE Shoes; 
IF OBJECT_ID(N'Categories', N'U') IS NOT NULL  DROP TABLE Categories;  
IF OBJECT_ID(N'Brand', N'U') IS NOT NULL  DROP TABLE Brand;  
IF OBJECT_ID(N'Color', N'U') IS NOT NULL  DROP TABLE Color;  
IF OBJECT_ID(N'Size', N'U') IS NOT NULL  DROP TABLE Size;  
IF OBJECT_ID(N'Wishlist', N'U') IS NOT NULL  DROP TABLE Wishlist; 
IF OBJECT_ID(N'Cart', N'U') IS NOT NULL  DROP TABLE Cart;  
IF OBJECT_ID(N'OrderItems', N'U') IS NOT NULL  DROP TABLE OrderItems;  
IF OBJECT_ID(N'Orders', N'U') IS NOT NULL  DROP TABLE Orders;  
IF OBJECT_ID(N'Customers', N'U') IS NOT NULL  DROP TABLE Customers; 
GO

USE ShoeStore
GO

-- Tạo bảng Admin
CREATE TABLE Admin (
  id INT IDENTITY(1,1) PRIMARY KEY,
  admin_name NVARCHAR(100) NOT NULL,
  email NVARCHAR(100) UNIQUE NOT NULL,
  admin_pass NVARCHAR(50) NOT NULL,
  phone NVARCHAR(20) UNIQUE NOT NULL
);
GO

INSERT INTO Admin(admin_name, email, admin_pass, phone) -- Sửa tên cột 'sdt' -> 'phone'
VALUES 
('Pham Mai Duy', 'test@gmail.com', 'abc123', '7755632012'),
('Mai Duy', 'test34@gmail.com', 'abc', '8565452152');
GO

-- Tạo bảng Brand
CREATE TABLE Brand (
    brand_id VARCHAR(10) PRIMARY KEY,
    brand_name NVARCHAR(100) NOT NULL,
    description NVARCHAR(MAX)
);
GO

INSERT INTO Brand (brand_id, brand_name, description) VALUES
('B001', 'NIKE', 'Thương hiệu giày thể thao nổi tiếng'),
('B002', 'ADIDAS', 'Thương hiệu giày phong cách và thể thao'),
('B003', 'HUSHPUPPIES', 'Giày thể thao phong cách và bền bỉ');
GO

INSERT INTO Brand (brand_id, brand_name, description)
SELECT 'B004', 'Reebok', 'Thương hiệu giày thể thao và phong cách'
WHERE NOT EXISTS (SELECT 1 FROM Brand WHERE brand_name = 'Reebok');

INSERT INTO Brand (brand_id, brand_name, description)
SELECT 'B005', 'Vans', 'Thương hiệu giày phong cách đường phố'
WHERE NOT EXISTS (SELECT 1 FROM Brand WHERE brand_name = 'Vans');
GO

-- Tạo bảng Categories
CREATE TABLE Categories (
  category_id VARCHAR(10) PRIMARY KEY,
  category_name NVARCHAR(100) NOT NULL,
  brand_id VARCHAR(10) NOT NULL,
  gender NVARCHAR(10) NOT NULL,
  FOREIGN KEY (brand_id) REFERENCES Brand(brand_id)
);
GO

INSERT INTO Categories (category_id, category_name, brand_id, gender) 
VALUES 
('LG1','RUNNING', 'B001', 'MEN'),
('LG2','RUNNING', 'B001', 'WOMEN'),
('LG3','FOOTBALL', 'B001', 'WOMEN'),
('LG4','FOOTBALL', 'B001', 'MEN'),
('LG5','CASUAL', 'B001', 'KIDS'),
('LG6','FORMAL', 'B003', 'MEN'),
('LG7','FORMAL', 'B003', 'WOMEN'),
('LG8','CASUAL', 'B003', 'WOMEN'),
('LG9','CASUAL', 'B002', 'KIDS');
GO
INSERT INTO Categories (category_id, category_name, brand_id, gender)
VALUES 
('LG10', 'RUNNING', 'B001', 'WOMEN'), -- Nike Joyride Run Flyknit
('LG11', 'FOOTBALL', 'B001', 'WOMEN'), -- Nike Mercurial Vapor 13 Elite FG, Phantom Vision, Phantom Venom
('LG12', 'FOOTBALL', 'B001', 'MEN'),   -- Nike Mercurial Superfly, Vapor 13 Tech Craft
('LG13', 'CASUAL', 'B001', 'KIDS'),    -- Nike Air Force 1, Air Max 90, Air Max 90 LTR
('LG14', 'RUNNING', 'B001', 'KIDS'),   -- Nike Joyride Dual Run, Renew Run
('LG15', 'CASUAL', 'B003', 'WOMEN'),   -- Hush Puppies SS-MS-0075, SS-PM-0093
('LG16', 'CASUAL', 'B002', 'WOMEN'),   -- Adidas NMD_R1 Flash Red, Superstar
('LG17', 'RUNNING', 'B002', 'KIDS'),   -- Adidas NMD_R1
('LG18', 'CASUAL', 'B004', 'MEN'),     -- Reebok Club C Revenge Mens
('LG19', 'CASUAL', 'B005', 'MEN');     -- Vans SK80-Low, Michael Feburary SK8-Hi
GO
-- Tạo bảng Color
CREATE TABLE Color (
    color_id INT IDENTITY(1,1) PRIMARY KEY,
    color_name NVARCHAR(50) NOT NULL
);
GO

INSERT INTO Color (color_name) VALUES
('Black'), ('White'), ('Red'), ('Blue'), ('Green'), ('Gray');
GO

-- Tạo bảng Size
CREATE TABLE Size (
    size_id INT IDENTITY(1,1) PRIMARY KEY,
    size_name NVARCHAR(10) NOT NULL
);
GO

INSERT INTO Size (size_name) VALUES
('38'), ('39'), ('40'), ('41'), ('42'), ('43'), ('44'), ('45'), ('46');
GO

-- Tạo bảng Shoes
CREATE TABLE Shoes (
    shoes_id INT IDENTITY(1,1) PRIMARY KEY,
    shoes_name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    original_price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2) NOT NULL,
    vat DECIMAL(5,2) NOT NULL,
    is_available BIT NOT NULL,
    slug NVARCHAR(255) UNIQUE,
    category_id VARCHAR(10) NOT NULL,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);
GO

-- Tạo bảng Images
CREATE TABLE Images (
    image_id INT IDENTITY(1,1) PRIMARY KEY,
    shoes_id INT NOT NULL,
    image_url NVARCHAR(255) NOT NULL,
    FOREIGN KEY (shoes_id) REFERENCES Shoes(shoes_id)
);
GO

-- Chèn dữ liệu vào Shoes (ĐÃ LOẠI BỎ size/color)
INSERT INTO Shoes (shoes_name, description, original_price, sale_price, vat, is_available, slug, category_id) 
VALUES 
(N'Nike React Infinity Run Flyknit', NULL, 160.00, 160.00, 0.00, 1, 'nike-react-infinity-run-flyknit', 'LG1'),
(N'Nike React Miler', NULL, 130.00, 130.00, 0.00, 1, 'nike-react-miler', 'LG1'),
(N'Nike Air Zoom Pegasus 37', NULL, 120.00, 120.00, 0.00, 1, 'nike-air-zoom-pegasus-37', 'LG2');
GO

INSERT INTO Shoes (shoes_name, description, original_price, sale_price, vat, is_available, slug, category_id)
VALUES 
-- Nike Joyride Run Flyknit
('Nike Joyride Run Flyknit', NULL, 180.00, 180.00, 0.00, 1, 'nike-joyride-run-flyknit', 'LG10'),
-- Nike Mercurial Vapor 13 Elite FG
('Nike Mercurial Vapor 13 Elite FG', NULL, 250.00, 250.00, 0.00, 1, 'nike-mercurial-vapor-13-elite-fg', 'LG11'),
-- Nike Phantom Vision Elite Dynamic Fit FG
('Nike Phantom Vision Elite Dynamic Fit FG', NULL, 150.00, 150.00, 0.00, 1, 'nike-phantom-vision-elite-dynamic-fit-fg', 'LG11'),
-- Nike Phantom Venom Academy FG
('Nike Phantom Venom Academy FG', NULL, 80.00, 80.00, 0.00, 1, 'nike-phantom-venom-academy-fg', 'LG11'),
-- Nike Mercurial Vapor 13 Elite Tech Craft FG
('Nike Mercurial Vapor 13 Elite Tech Craft FG', NULL, 145.00, 145.00, 0.00, 1, 'nike-mercurial-vapor-13-elite-tech-craft-fg', 'LG12'),
-- Nike Mercurial Superfly 7 Pro MDS FG
('Nike Mercurial Superfly 7 Pro MDS FG', NULL, 137.00, 137.00, 0.00, 1, 'nike-mercurial-superfly-7-pro-mds-fg', 'LG12'),
-- Nike Air Force 1
('Nike Air Force 1', NULL, 90.00, 90.00, 0.00, 1, 'nike-air-force-1', 'LG13'),
-- Nike Air Max 90
('Nike Air Max 90', NULL, 100.00, 100.00, 0.00, 1, 'nike-air-max-90', 'LG13'),
-- Nike Air Max 90 LTR
('Nike Air Max 90 LTR', NULL, 110.00, 110.00, 0.00, 1, 'nike-air-max-90-ltr', 'LG13'),
-- Nike Joyride Dual Run
('Nike Joyride Dual Run', NULL, 110.00, 110.00, 0.00, 0, 'nike-joyride-dual-run', 'LG14'),
-- Nike Renew Run
('Nike Renew Run', NULL, 80.00, 80.00, 0.00, 1, 'nike-renew-run', 'LG14'),
-- Hush Puppies Bridgport Advice
('Bridgport Advice', NULL, 30.00, 30.00, 0.00, 1, 'bridgport-advice', 'LG6'),
-- Hush Puppies Beck
('Beck', NULL, 80.00, 80.00, 0.00, 1, 'beck', 'LG6'),
-- Hush Puppies Fester
('Fester', NULL, 70.00, 70.00, 0.00, 1, 'fester', 'LG6'),
-- Hush Puppies Pixel
('Pixel', NULL, 75.00, 75.00, 0.00, 1, 'pixel', 'LG6'),
-- Hush Puppies Austin
('Austin', NULL, 75.00, 75.00, 0.00, 1, 'austin', 'LG6'),
-- Hush Puppies SS-HL-0135
('SS-HL-0135', NULL, 30.00, 30.00, 0.00, 1, 'ss-hl-0135', 'LG7'),
-- Hush Puppies SS-HL-0136
('SS-HL-0136', NULL, 50.00, 50.00, 0.00, 1, 'ss-hl-0136', 'LG7'),
-- Hush Puppies SS-HL-0128
('SS-HL-0128', NULL, 35.00, 35.00, 0.00, 1, 'ss-hl-0128', 'LG7'),
-- Hush Puppies SS-MS-0075
('SS-MS-0075', NULL, 25.00, 25.00, 0.00, 1, 'ss-ms-0075', 'LG15'),
-- Hush Puppies SS-PM-0093
('SS-PM-0093', NULL, 30.00, 30.00, 0.00, 1, 'ss-pm-0093', 'LG15'),
-- Adidas Nizza X Disney
('Nizza X Disney', NULL, 55.00, 55.00, 0.00, 1, 'nizza-x-disney', 'LG9'),
-- Adidas X_PLR
('X_PLR', NULL, 65.00, 65.00, 0.00, 1, 'x_plr', 'LG9'),
-- Adidas Stan Smith
('Stan Smith', NULL, 55.00, 55.00, 0.00, 1, 'stan-smith', 'LG9'),
-- Adidas NMD_R1
('NMD_R1', NULL, 120.00, 120.00, 0.00, 1, 'nmd_r1', 'LG17'),
-- Adidas NMD_R1 Flash Red
('NMD_R1 Flash Red', NULL, 140.00, 140.00, 0.00, 1, 'nmd_r1-flash-red', 'LG16'),
-- Adidas Superstar
('Superstar', NULL, 90.00, 90.00, 0.00, 1, 'superstar', 'LG16'),
-- Reebok Club C Revenge Mens
('Club C Revenge Mens', NULL, 70.00, 70.00, 0.00, 1, 'club-c-revenge-mens', 'LG18'),
-- Vans SK80-Low
('SK80-Low', NULL, 60.00, 60.00, 0.00, 1, 'sk80-low', 'LG19'),
-- Vans Michael Feburary SK8-Hi
('Michael Feburary SK8-Hi', NULL, 72.00, 72.00, 0.00, 1, 'michael-feburary-sk8-hi', 'LG19');
GO

-- Chèn dữ liệu vào Images
INSERT INTO Images (shoes_id, image_url) VALUES
(1, 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-665455a5-45de-40fb-945f-c1852b82400d/react-infinity-run-flyknit-mens-running-shoe-zX42Nc.jpg'),
(2, 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-5cc7de3b-2afc-49c2-a1e4-0508997d09e6/react-miler-mens-running-shoe-DgF6nr.jpg'),
(3, 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-33b0a0a5-c171-46cc-ad20-04a768703e47/air-zoom-pegasus-37-womens-running-shoe-Jl0bDf.jpg');
GO
-- 4. Thêm dữ liệu vào bảng Images
INSERT INTO Images (shoes_id, image_url)
SELECT shoes_id, 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/99a7d3cb-e40c-4474-91c2-0f2e6d231fd2/joyride-run-flyknit-womens-running-shoe-HcfnJd.jpg'
FROM Shoes WHERE slug = 'nike-joyride-run-flyknit'
UNION
SELECT shoes_id, 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/9dda6202-e2ff-4711-9a09-0fcb7d90c164/mercurial-vapor-13-elite-fg-firm-ground-soccer-cleat-14MsF2.jpg'
FROM Shoes WHERE slug = 'nike-mercurial-vapor-13-elite-fg'
UNION
SELECT shoes_id, 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/s1amp7uosrn0nqpsxeue/phantom-vision-elite-dynamic-fit-fg-firm-ground-soccer-cleat-19Kv1V.jpg'
FROM Shoes WHERE slug = 'nike-phantom-vision-elite-dynamic-fit-fg'
UNION
SELECT shoes_id, 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/whegph8z9ornhxklc8rp/phantom-venom-academy-fg-firm-ground-soccer-cleat-6JVNll.jpg'
FROM Shoes WHERE slug = 'nike-phantom-venom-academy-fg'
UNION
SELECT shoes_id, 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/vhbwnkor8sxt8qtecgia/mercurial-vapor-13-elite-tech-craft-fg-firm-ground-soccer-cleat-l38JPj.jpg'
FROM Shoes WHERE slug = 'nike-mercurial-vapor-13-elite-tech-craft-fg'
UNION
SELECT shoes_id, 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-a52a8aec-22dc-4982-961b-75c5f4c72805/mercurial-superfly-7-pro-mds-fg-firm-ground-soccer-cleat-mhcpdN.jpg'
FROM Shoes WHERE slug = 'nike-mercurial-superfly-7-pro-mds-fg'
UNION
SELECT shoes_id, 'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/178b2a46-3ee4-492b-882e-f71efdd53a36/air-force-1-big-kids-shoe-2zqp8D.jpg'
FROM Shoes WHERE slug = 'nike-air-force-1'
UNION
SELECT shoes_id, 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/8439f823-86cf-4086-81d2-4f9ff9a66866/air-max-90-big-kids-shoe-1wzwJM.jpg'
FROM Shoes WHERE slug = 'nike-air-max-90'
UNION
SELECT shoes_id, 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-620aeb37-1b28-44b0-9b14-5572f8cbc948/air-max-90-ltr-big-kids-shoe-hdNLQ5.jpg'
FROM Shoes WHERE slug = 'nike-air-max-90-ltr'
UNION
SELECT shoes_id, 'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/33888130-0320-41a1-ba53-a026decd8aa2/joyride-dual-run-big-kids-running-shoe-1HDJF8.jpg'
FROM Shoes WHERE slug = 'nike-joyride-dual-run'
UNION
SELECT shoes_id, 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-73e54c0b-11a6-478b-9f90-bd97fcde872d/renew-run-big-kids-running-shoe-5Bpz93.jpg'
FROM Shoes WHERE slug = 'nike-renew-run'
UNION
SELECT shoes_id, 'https://cdn.shopify.com/s/files/1/0016/0074/9623/products/BRIDGPORT_ADVICE-BLACK_1_800x800.jpg?v=1576567903'
FROM Shoes WHERE slug = 'bridgport-advice'
UNION
SELECT shoes_id, 'https://cdn.shopify.com/s/files/1/0016/0074/9623/products/Beck-Black_800x800.jpg'
FROM Shoes WHERE slug = 'beck'
UNION
SELECT shoes_id, 'https://cdn.shopify.com/s/files/1/0016/0074/9623/products/fester-Tan_800x800.jpg?v=1575537531'
FROM Shoes WHERE slug = 'fester'
UNION
SELECT shoes_id, 'https://cdn.shopify.com/s/files/1/0016/0074/9623/products/PIXEL-TAN_800x800.jpg?v=1577420506'
FROM Shoes WHERE slug = 'pixel'
UNION
SELECT shoes_id, 'https://cdn.shopify.com/s/files/1/0016/0074/9623/products/Austin-Coffee_800x800.jpg?v=1574772988'
FROM Shoes WHERE slug = 'austin'
UNION
SELECT shoes_id, 'https://cdn.shopify.com/s/files/1/0016/0074/9623/products/009240000-11-SS-HL-0135-Black_800x800.jpg?v=1572264270'
FROM Shoes WHERE slug = 'ss-hl-0135'
UNION
SELECT shoes_id, 'https://cdn.shopify.com/s/files/1/0016/0074/9623/products/009250000-779-SS-HL-0136-Coffee_800x800.jpg?v=1571900372'
FROM Shoes WHERE slug = 'ss-hl-0136'
UNION
SELECT shoes_id, 'https://cdn.shopify.com/s/files/1/0016/0074/9623/products/000300242-484-SS-HL-0128-Blue_800x800.jpg?v=1583235174'
FROM Shoes WHERE slug = 'ss-hl-0128'
UNION
SELECT shoes_id, 'https://cdn.shopify.com/s/files/1/0016/0074/9623/products/009170000-479-SS-MS-0075-Red_800x800.jpg?v=1570688687'
FROM Shoes WHERE slug = 'ss-ms-0075'
UNION
SELECT shoes_id, 'https://cdn.shopify.com/s/files/1/0016/0074/9623/products/SS-PM-0093_1_800x800.jpg?v=1570601253'
FROM Shoes WHERE slug = 'ss-pm-0093'
UNION
SELECT shoes_id, 'https://assets.adidas.com/images/h_320,f_auto,q_auto:sensitive,fl_lossy/ef901c7aeac042578eceab9d0159196c_9366/Nizza_x_Disney_Sport_Goofy_Shoes_White_FW0651_01_standard.jpg'
FROM Shoes WHERE slug = 'nizza-x-disney'
UNION
SELECT shoes_id, 'https://assets.adidas.com/images/h_320,f_auto,q_auto:sensitive,fl_lossy/a36518227134495da766ab9d01772fa2_9366/X_PLR_Shoes_Red_FY9063_01_standard.jpg'
FROM Shoes WHERE slug = 'x_plr'
UNION
SELECT shoes_id, 'https://assets.adidas.com/images/h_320,f_auto,q_auto:sensitive,fl_lossy/d0720712d81e42b1b30fa80800826447_9366/Stan_Smith_Shoes_White_M20607_M20607_01_standard.jpg'
FROM Shoes WHERE slug = 'stan-smith'
UNION
SELECT shoes_id, 'https://assets.adidas.com/images/h_320,f_auto,q_auto:sensitive,fl_lossy/99ca762cb9054caf82fbabc500fd146e_9366/NMD_R1_Shoes_Blue_FY9392_01_standard.jpg'
FROM Shoes WHERE slug = 'nmd_r1'
UNION
SELECT shoes_id, 'https://assets.adidas.com/images/h_320,f_auto,q_auto:sensitive,fl_lossy/90f85768e3894aeaab67aba0014a3379_9366/NMD_R1_Shoes_Red_FY9389_01_standard.jpg'
FROM Shoes WHERE slug = 'nmd_r1-flash-red'
UNION
SELECT shoes_id, 'https://assets.adidas.com/images/h_320,f_auto,q_auto:sensitive,fl_lossy/12365dbc7c424288b7cdab4900dc7099_9366/Superstar_Shoes_White_FW3553_FW3553_01_standard.jpg'
FROM Shoes WHERE slug = 'superstar'
UNION
SELECT shoes_id, 'https://assets.reebok.com/images/h_840,f_auto,q_auto:sensitive,fl_lossy/7599294868804d78a1b1ab6f01718a5e_9366/Club_C_Revenge_Men''s_Shoes_White_FV9877_01_standard.jpg'
FROM Shoes WHERE slug = 'club-c-revenge-mens'
UNION
SELECT shoes_id, 'https://images.vans.com/is/image/Vans/UUK24I-HERO?$583x583$'
FROM Shoes WHERE slug = 'sk80-low'
UNION
SELECT shoes_id, 'https://images.vans.com/is/image/Vans/MV122M-HERO?$583x583$'
FROM Shoes WHERE slug = 'michael-feburary-sk8-hi';
GO

-- Tạo bảng quản lý số lượng theo size/color
CREATE TABLE Quantity (
    quantity_id INT IDENTITY(1,1) PRIMARY KEY,
    shoes_id INT NOT NULL,
    color_id INT NOT NULL,
    size_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (shoes_id) REFERENCES Shoes(shoes_id),
    FOREIGN KEY (color_id) REFERENCES Color(color_id),
    FOREIGN KEY (size_id) REFERENCES Size(size_id)
);
GO

-- Populate dữ liệu Quantity cho từng sản phẩm
-- Giày 1: Nike React Infinity Run Flyknit (color: Black, White, Red, Gray | size: 41-46)
INSERT INTO Quantity (shoes_id, color_id, size_id, quantity)
SELECT 1, c.color_id, s.size_id, 10 
FROM Color c 
CROSS JOIN Size s
WHERE c.color_name IN ('Black', 'White', 'Red', 'Gray')
AND s.size_name IN ('41','42','43','44','45','46');

-- Giày 2: Nike React Miler (color: Blue, White | size: 41-46)
INSERT INTO Quantity (shoes_id, color_id, size_id, quantity)
SELECT 2, c.color_id, s.size_id, 10 
FROM Color c 
CROSS JOIN Size s
WHERE c.color_name IN ('Blue', 'White')
AND s.size_name IN ('41','42','43','44','45','46');

-- Giày 3: Nike Air Zoom Pegasus 37 (color: Red, Black | size: 41-46)
INSERT INTO Quantity (shoes_id, color_id, size_id, quantity)
SELECT 3, c.color_id, s.size_id, 10 
FROM Color c 
CROSS JOIN Size s
WHERE c.color_name IN ('Red', 'Black')
AND s.size_name IN ('41','42','43','44','45','46');
GO

INSERT INTO Quantity (shoes_id, color_id, size_id, quantity)
SELECT s.shoes_id, c.color_id, sz.size_id, 
       CASE 
           WHEN s.slug = 'bridgport-advice' THEN 4
           WHEN s.slug = 'beck' THEN 5
           WHEN s.slug = 'fester' THEN 6
           WHEN s.slug = 'pixel' THEN 7
           WHEN s.slug = 'austin' THEN 2
           WHEN s.slug = 'ss-hl-0135' THEN 6
           WHEN s.slug = 'ss-hl-0136' THEN 4
           WHEN s.slug = 'ss-hl-0128' THEN 3
           WHEN s.slug = 'ss-ms-0075' THEN 7
           WHEN s.slug = 'ss-pm-0093' THEN 3
           WHEN s.slug = 'nizza-x-disney' THEN 6
           WHEN s.slug = 'x_plr' THEN 5
           WHEN s.slug = 'stan-smith' THEN 3
           WHEN s.slug = 'nmd_r1-flash-red' THEN 5
           ELSE 3 -- Mặc định 3 cho các sản phẩm khác
       END AS quantity
FROM Shoes s
JOIN Color c ON c.color_name IN ('Red', 'Black') -- Giả định màu mặc định
JOIN Size sz ON sz.size_name IN ('41','42','43','44','45','46')  -- Giả định kích cỡ mặc định
WHERE s.shoes_id > 3; -- Chỉ thêm cho các sản phẩm mới
GO

-- Tạo bảng Customers
CREATE TABLE Customers (
  customer_id NVARCHAR(50) PRIMARY KEY,
  customer_name NVARCHAR(100),
  email NVARCHAR(100) UNIQUE NOT NULL,
  pass NVARCHAR(50) NOT NULL,
  phone NVARCHAR(20) UNIQUE NOT NULL,
  gender BIT,
  created_at DATETIME DEFAULT GETDATE(),
  address NVARCHAR(250),
  city NVARCHAR(100)
);
GO

INSERT INTO Customers (customer_id, customer_name, email, pass, phone, gender, address, city)
VALUES 
('U1', 'Duy', 'test786@gmail.com', 'abc123', '7546254260', 1, 'ddđ', 'Tuy Hòa'),
('U2', 'Mai Duy', 'amt677@gmail.com', 'abc', '8563201201', 0, 'AJ', 'Tuy Hòa');
GO

-- Các bảng còn lại giữ nguyên cấu trúc
CREATE TABLE Wishlist (
  wishlist_id INT IDENTITY(1,1) PRIMARY KEY,
  customer_id NVARCHAR(50) NOT NULL,
  shoes_id INT NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
  FOREIGN KEY (shoes_id) REFERENCES Shoes(shoes_id)
);
GO

CREATE TABLE Cart (
  cart_id INT IDENTITY(1,1) PRIMARY KEY,
  customer_id NVARCHAR(50) NOT NULL,
  shoes_id INT NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
  FOREIGN KEY (shoes_id) REFERENCES Shoes(shoes_id)
);
GO

CREATE TABLE Orders (
  order_id INT IDENTITY(1,1) PRIMARY KEY,
  customer_id NVARCHAR(50) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status NVARCHAR(100) NOT NULL,
  order_date DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);
GO

CREATE TABLE OrderItems (
  order_item_id INT IDENTITY(1,1) PRIMARY KEY,
  order_id INT NOT NULL,
  shoes_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(18,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES Orders(order_id),
  FOREIGN KEY (shoes_id) REFERENCES Shoes(shoes_id)
);
GO