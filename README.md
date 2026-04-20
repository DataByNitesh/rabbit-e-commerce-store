# Rabbit E-Commerce Store

Rabbit is a full-stack e-commerce web application built using the MERN stack.
It allows users to browse products, place orders, and pay securely, while admins can manage products, users, and orders through an admin dashboard.

**Live Demo:** https://rabbit-e-store.vercel.app

---

## Features

### User

* User registration and login with **JWT authentication**
* Browse the **product catalog**
* Add items to **cart**
* Secure checkout using **Razorpay**
* View **order history**

### Admin

* Add, edit, and delete products
* Upload product images using **Cloudinary**
* View and manage orders
* View registered users

---

## Tech Stack

### Frontend

* React (Vite)
* Redux Toolkit
* React Router
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* Cloudinary (image uploads)
* Razorpay (payments)

---

## Project Structure

```
rabbit-ecommerce
│
├── frontend
│
└── backend
```

---

## Local Setup

### 1. Clone the repository

```
git clone <repo-url>
cd rabbit-ecommerce
```

### 2. Backend Setup

```
cd backend
npm install
```

Create a `.env` file inside the **backend** folder.

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

Run the backend server:

```
npm run dev
```

---

### 3. Frontend Setup

```
cd frontend
npm install
```

Create a `.env` file inside the **frontend** folder.

```
VITE_API_BASE_URL=http://localhost:5000
```

Run the frontend:

```
npm run dev
```

---

## Deployment

Frontend → Vercel
Backend → Render
