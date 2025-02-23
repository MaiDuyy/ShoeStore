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

-- Chèn dữ liệu vào Images
INSERT INTO Images (shoes_id, image_url) VALUES
(1, 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-665455a5-45de-40fb-945f-c1852b82400d/react-infinity-run-flyknit-mens-running-shoe-zX42Nc.jpg'),
(2, 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-5cc7de3b-2afc-49c2-a1e4-0508997d09e6/react-miler-mens-running-shoe-DgF6nr.jpg'),
(3, 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-33b0a0a5-c171-46cc-ad20-04a768703e47/air-zoom-pegasus-37-womens-running-shoe-Jl0bDf.jpg');
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