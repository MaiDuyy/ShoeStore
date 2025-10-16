# 🏪 Shoe Store - Hệ thống Quản lý Cửa hàng Giày

Ứng dụng web thương mại điện tử bán giày với đầy đủ tính năng quản lý sản phẩm, giỏ hàng, đơn hàng và tích hợp AI chatbot hỗ trợ khách hàng.

## 📋 Mục lục

- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Cài đặt](#-cài-đặt)
- [Cấu hình](#-cấu-hình)
- [Chạy ứng dụng](#-chạy-ứng-dụng)
- [API Endpoints](#-api-endpoints)

## ✨ Tính năng

### Người dùng
- 🔐 Đăng ký/Đăng nhập với JWT authentication
- 👤 Quản lý thông tin cá nhân
- 🛍️ Xem danh sách sản phẩm với bộ lọc và tìm kiếm
- 📦 Chi tiết sản phẩm
- 🛒 Giỏ hàng (thêm, xóa, cập nhật số lượng)
- 💳 Thanh toán và đặt hàng
- 📋 Theo dõi đơn hàng
- 🤖 AI Chatbot hỗ trợ tư vấn sản phẩm

### Quản trị viên
- 📊 Dashboard thống kê
- 📦 Quản lý sản phẩm (CRUD)
- 📋 Quản lý đơn hàng
- 👥 Quản lý người dùng
- 🔑 Phân quyền (User, Admin, Moderator)

## 🛠 Công nghệ sử dụng

### Back-end
- **Node.js** + **Express.js** - REST API server
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Mã hóa mật khẩu
- **CORS** - Cross-Origin Resource Sharing
- **Cookie Parser** - Xử lý cookies

### Front-end
- **React 18** - UI Library
- **Vite** - Build tool
- **React Router DOM** - Routing
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **Google Generative AI** - AI Chatbot
- **React Icons** - Icons
- **React Toastify** - Notifications

## 📁 Cấu trúc dự án

```
.
├── back-end/                 # Server-side application
│   ├── config/              # Cấu hình (auth, database)
│   ├── controllers/         # Business logic
│   │   ├── admin.controller.js
│   │   ├── auth.controller.js
│   │   ├── cart.controller.js
│   │   ├── order.controller.js
│   │   └── user.controller.js
│   ├── middlewares/         # Middleware (auth, validation)
│   │   ├── authJwt.js
│   │   ├── verifySignUp.js
│   │   └── index.js
│   ├── models/              # Database models
│   │   ├── user.model.js
│   │   ├── product.model.js
│   │   ├── cart.model.js
│   │   ├── order.model.js
│   │   └── role.model.js
│   ├── Router/              # API routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── product.routes.js
│   │   ├── cart.routes.js
│   │   ├── order.routes.js
│   │   └── admin.routes.js
│   ├── .env                 # Environment variables
│   ├── index.js             # Entry point
│   └── package.json
│
└── font-end/                # Client-side application
    ├── src/
    │   ├── assets/          # Images, static files
    │   ├── components/      # React components
    │   │   ├── common/      # Shared components
    │   │   └── ui/          # UI components
    │   ├── config/          # Configuration files
    │   ├── contexts/        # React contexts (Auth, Cart)
    │   ├── hooks/           # Custom hooks
    │   ├── page/            # Page components
    │   │   ├── Home/
    │   │   ├── Auth/        # Login, Register
    │   │   ├── Listing/     # Product listing
    │   │   ├── Cart/
    │   │   ├── Checkout/
    │   │   ├── Orders/
    │   │   ├── Profile/
    │   │   └── Admin/       # Admin dashboard
    │   ├── redux/           # Redux store & slices
    │   ├── service/         # API services
    │   ├── utils/           # Utility functions
    │   ├── App.jsx          # Main app component
    │   └── main.jsx         # Entry point
    ├── .env                 # Environment variables
    ├── package.json
    └── vite.config.js

```

## 🚀 Cài đặt

### Yêu cầu hệ thống
- Node.js >= 16.x
- MongoDB (Local hoặc MongoDB Atlas)
- npm hoặc yarn

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd shoe-store
```

### Bước 2: Cài đặt dependencies

#### Back-end
```bash
cd back-end
npm install
```

#### Front-end
```bash
cd font-end
npm install
```

## ⚙️ Cấu hình

### Back-end (.env)

Tạo file `.env` trong thư mục `back-end/`:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/heartsync
MONGODB_LOCAL=mongodb://localhost:27017/heartsync

# JWT
JWT_SECRET=your-secret-key-here

# Server
PORT=5000

# CORS
CLIENT_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Front-end (.env)

Tạo file `.env` trong thư mục `font-end/`:

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_AI_KEY=your-google-ai-api-key
```

## 🏃 Chạy ứng dụng

### Development Mode

#### Back-end
```bash
cd back-end
npm run dev
```
Server sẽ chạy tại: `http://localhost:5000`

#### Front-end
```bash
cd font-end
npm run dev
```
Client sẽ chạy tại: `http://localhost:5173`

### Production Mode

#### Back-end
```bash
cd back-end
npm start
```

#### Front-end
```bash
cd font-end
npm run build
npm run preview
```

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - Đăng ký tài khoản
- `POST /auth/login` - Đăng nhập
- `POST /auth/logout` - Đăng xuất

### User
- `GET /user/profile` - Lấy thông tin user
- `PUT /user/profile` - Cập nhật thông tin user

### Products
- `GET /products` - Lấy danh sách sản phẩm
- `GET /products/:id` - Lấy chi tiết sản phẩm
- `POST /products` - Tạo sản phẩm mới (Admin)
- `PUT /products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /products/:id` - Xóa sản phẩm (Admin)

### Cart
- `GET /cart` - Lấy giỏ hàng
- `POST /cart` - Thêm sản phẩm vào giỏ
- `PUT /cart/:id` - Cập nhật số lượng
- `DELETE /cart/:id` - Xóa sản phẩm khỏi giỏ

### Orders
- `GET /orders` - Lấy danh sách đơn hàng
- `GET /orders/:id` - Chi tiết đơn hàng
- `POST /orders` - Tạo đơn hàng mới
- `PUT /orders/:id` - Cập nhật trạng thái đơn hàng

### Admin
- `GET /admin/dashboard` - Thống kê dashboard
- `GET /admin/users` - Quản lý người dùng
- `GET /admin/orders` - Quản lý đơn hàng

## 🔒 Phân quyền

Hệ thống có 3 loại role:
- **User**: Người dùng thông thường
- **Moderator**: Người kiểm duyệt
- **Admin**: Quản trị viên (full quyền)

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng tạo Pull Request hoặc Issue.

## 📝 License

MIT License

## 👥 Nhóm phát triển

Pham Mai Duy - Shoe Store Project

---

**Lưu ý**: Đây là dự án học tập. Không sử dụng cho mục đích thương mại.
