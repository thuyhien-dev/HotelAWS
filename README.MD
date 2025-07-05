# 🏨 Hệ Thống Quản Lý Khách Sạn

## 📘 Mô tả

Dự án này giúp xây dựng một hệ thống quản lý khách sạn toàn diện bằng cách sử dụng **ReactJS** ở Frontend và **NodeJS** ở Backend và tích hợp các dịch vụ của **AWS** như DynamoDB, S3, CloudFront, và Cognito.

---

## 🛠️ Công nghệ sử dụng

- **Frontend**: 
  - [ReactJS](https://reactjs.org/)
  - [Redux](https://redux.js.org/)
  - [Redux Saga](https://redux-saga.js.org/)
  - [React Router](https://reactrouter.com/)
  - [Chakra UI](https://chakra-ui.com/)

- **Backend**:
  - AWS Cognito (xác thực người dùng)
  - AWS DynamoDB (cơ sở dữ liệu NoSQL)
  - AWS S3 (lưu trữ ảnh phòng)
  - AWS CloudFront (phân phối nội dung nhanh toàn cầu)

- **Khác**:
  - SSR (Server Side Rendering)
  - SPA (Single Page Application)
  - Hosting: AWS S3 + CloudFront

---

## 🔐 Tính năng chính

### 👤 Xác thực người dùng
- [x] Đăng nhập
- [x] Quên mật khẩu và gửi email đặt lại
- [x] Xác minh OTP qua email
- [x] Đổi mật khẩu
- [x] Cập nhật thông tin cá nhân

### 🏨 Quản lý hệ thống
- [x] Quản lý tài khoản người dùng (Cognito)
- [x] Quản lý loại phòng
- [x] Quản lý phòng (upload ảnh lên S3)
- [x] Quản lý dịch vụ
- [x] Quản lý khách hàng
- [x] Quản lý đặt trả phòng
- [x] Quản lý thanh toán
- [x] Báo cáo và thống kê
- [x] Sửa lỗi và xử lý ngoại lệ

---

## 📁 Cấu trúc thư mục

```bash
hotelaws/
│
├── frontend/              # Frontend ReactJS
│   ├── public/
│   ├── src/
│   └── ...
│
├── backend/              # Backend NodeJS
│   └── ...
│
├── .env                 # Biến môi trường
├── ssr.sh               # Script chạy SSR
├── package.json
└── README.md
```


---

### Cài đặt và chạy dự án
⚠️ Yêu cầu: Node >= 14, Yarn hoặc npm, Git, AWS CLI
### 🔧 Cài đặt frontend
```bash
cd frontend

# Cài đặt dependencies
npm install

# Chạy chế độ phát triển
npm start

```

---

### 🌍 Frontend
- [x] Build frontend React: npm run build

- [x] Upload thư mục /build lên AWS S3

- [x] Tạo CloudFront phân phối từ bucket S3


---
### 🔐 Authentication
- [x] Cấu hình User Pool trong AWS Cognito

- [x] Tích hợp đăng nhập/đăng ký vào frontend

---
### 💾 Database
- [x] Tạo bảng DynamoDB: users, rooms, services, bookings, invoices

- [x] Sử dụng AWS SDK để thao tác dữ liệu

---
### 🖼️ Upload ảnh
- [x] Tích hợp AWS S3 để lưu ảnh phòng