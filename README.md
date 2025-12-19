# 🌌 OdysseyEvents -- MERN Web Application

A modern, responsive event‑browsing platform built with the MERN stack
(MongoDB, Express, React, Node.js) and deployed on Render.

------------------------------------------------------------------------

## 🚀 Overview

OdysseyEvents allows users to explore upcoming events while moderators
can create and manage them.\
Features include authentication, category filtering, event overlays, and
mobile responsiveness.

------------------------------------------------------------------------

## 🧩 Tech Stack

### **Frontend**

-   React + Vite\
-   Context API authentication\
-   WebGL PixelBlast background\
-   Responsive UI\
-   Hosted as a Render Static Site

### **Backend**

-   Node.js + Express\
-   REST API\
-   JWT Authentication\
-   Multer + Cloudinary image uploads\
-   Nodemailer email notifications\
-   Hosted as a Render Web Service

### **Database**

-   MongoDB Atlas\
-   Mongoose models

------------------------------------------------------------------------

## 🔐 Authentication & Security

### Password Hashing

All passwords hashed using **bcrypt** before database storage.

### JWT Tokens

-   Short‑lived access tokens\
-   Sent in Authorization header\
-   Verified on every protected route

### Environment Variables

    VITE_API_URL=
    MONGO_URI=
    JWT_SECRET=
    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
    MAIL_USER=
    MAIL_PASS=
    CORS_ORIGIN=

------------------------------------------------------------------------

## 🗂 Project Structure

### Backend

    server/
     └── src/
         ├── config/
         ├── routes/
         ├── controllers/
         ├── middleware/
         ├── models/
         ├── utils/
         ├── app.js
         └── index.js

### Frontend

    client/
     └── src/
         ├── components/
         ├── context/
         ├── pages/
         ├── assets/
         ├── services/
         ├── App.jsx
         └── main.jsx

------------------------------------------------------------------------

## 🛣 API Routes

### Authentication

-   POST `/api/auth/register`
-   POST `/api/auth/login`
-   GET `/api/auth/me`

### Events

-   GET `/api/events`
-   POST `/api/events` *(moderators)*
-   PUT `/api/events/:id` *(moderators)*
-   DELETE `/api/events/:id` *(moderators)*

------------------------------------------------------------------------

## 🧑‍🤝‍🧑 User Roles

### User

-   Browse events\
-   Filter by followed categories\
-   Open event links

### Moderator

-   Add, edit, delete events\
-   Access moderator‑only UI buttons

------------------------------------------------------------------------

## 🎨 UI Features

-   Hover overlays on desktop\
-   Tap‑based reveal on mobile\
-   Smooth "Load More" pagination\
-   PixelBlast background animation\
-   Clean navigation with profile dropdown

------------------------------------------------------------------------

## 🔧 Deployment

### Frontend (Render Static Site)

Build command:

    npm run build

Publish directory:

    dist

### Backend (Render Web Service)

Build & start:

    npm install
    npm start

------------------------------------------------------------------------

## 📬 Email Notifications

Users following event categories automatically receive email
notifications using: - Nodemailer\
- Gmail SMTP

------------------------------------------------------------------------

## 📦 Local Setup

Clone repository:

    git clone https://github.com/your-repo/OdysseyEvents.git

### Frontend

    cd client
    npm install
    npm run dev

### Backend

    cd server
    npm install
    npm run dev

------------------------------------------------------------------------

## 🧭 Future Additions

-   Search system\
-   Push notifications\
-   PWA version\
-   User avatars & extended profiles

------------------------------------------------------------------------

## 🪐 License

MIT License © OdysseyEvents Team
