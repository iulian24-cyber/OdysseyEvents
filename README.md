🌌 OdysseyEvents
A modern MERN web application for event discovery, personalization & moderation.
<p align="center"> <img src="https://img.shields.io/badge/MERN-Stack-3C873A?style=for-the-badge&logo=mongodb&logoColor=white" /> <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" /> <img src="https://img.shields.io/badge/Node.js-22-green?style=for-the-badge&logo=node.js&logoColor=white" /> <img src="https://img.shields.io/badge/Express.js-5-black?style=for-the-badge&logo=express" /> <img src="https://img.shields.io/badge/MongoDB-6-brightgreen?style=for-the-badge&logo=mongodb" /> </p> <p align="center"> <img src="https://img.shields.io/badge/Cloudinary-Image_Uploads-blue?style=flat-square&logo=cloudinary" /> <img src="https://img.shields.io/badge/Nodemailer-Email_Notifications-yellow?style=flat-square&logo=mail.ru" /> <img src="https://img.shields.io/badge/Render-Deployment-blueviolet?style=flat-square&logo=render" /> </p>

📖 Table of Contents

✨ Features

🛠️ Tech Stack

🏗️ Architecture (MERN)

📁 Project Structure

🔐 Authentication & Security

🧠 User Roles

⚙️ Environment Variables

🌐 Deployment (Render)

🧪 API Testing

📸 Screenshots (optional)

🤝 Contributors

📜 License

✨ Features
👥 User Features

Secure authentication (JWT)

Personal preferences (follow categories)

"For You" tailored event feed

Browse & explore events

Mobile-ready interface

Event external link preview

Smooth event card UI

🛡️ Moderator Features

Create events

Edit event details

Delete events

Cloudinary image uploads

Email notifications sent to followers

🎨 Frontend Magic

PixelBlast (Three.js shader effect)

Auto-disabled on mobile for performance

Smooth scrolling + preserved scroll position

Modern component-based UI

🛠️ Tech Stack
Layer	Technologies Used
Frontend	React, Vite, CSS3, Three.js, PostProcessing
Backend	Node.js, Express.js
Database	MongoDB, Mongoose
Auth	JWT, bcrypt
File Uploads	Multer, Cloudinary
Emails	Nodemailer
Deployment	Render (Static + Web Service)
🏗️ Architecture (MERN)
+----------------------------+
|         Frontend           |
|        (React + Vite)      |
+-------------+--------------+
              |
              | REST API Calls
              v
+----------------------------+
|         Backend            |
|      Node.js + Express     |
+-------------+--------------+
              |
              | Mongoose ORM
              v
+----------------------------+
|         MongoDB            |
|      Cloud-Hosted DB       |
+----------------------------+

📁 Project Structure
Backend (/server)
server/
 ├── src/
 │   ├── controllers/
 │   ├── routes/
 │   ├── models/
 │   ├── middleware/
 │   ├── utils/
 │   └── index.js
 ├── package.json
 └── .env

Frontend (/client)
client/
 ├── src/
 │   ├── components/
 │   ├── context/
 │   ├── pages/
 │   ├── services/
 │   └── main.jsx
 ├── public/
 ├── .env
 └── package.json

🔐 Authentication & Security
🔒 Password Hashing

Uses bcrypt

Unique salt per user

No plaintext password stored anywhere

🔑 JWT Tokens

Payload contains:

{
  "userId": "mongo-id",
  "role": "user | moderator"
}

🛡️ Protected Routes

Express middleware enforces:

Token existence

Token validity

User ownership

Moderator permissions (create, edit, delete)

🌍 Strict CORS

Allowed origins:

[
  "http://localhost:5173",
  "https://yourfrontend.onrender.com"
]

🧠 User Roles
👤 User

Browse events

Filter events

Access personalized feed

Open external event URLs

🛠️ Moderator

Everything a user can do, plus:

Create event

Edit event

Delete event

Upload images

Trigger email notifications

⚙️ Environment Variables
Backend (server/.env)
MONGO_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
MAIL_USER=
MAIL_PASS=
CORS_ORIGIN=https://yourfrontend.onrender.com

Frontend (client/.env)
VITE_API_URL=https://yourbackend.onrender.com/api

🌐 Deployment (Render)
Frontend (Static Site)

✔ Build command:

npm run build


✔ Publish directory:

dist

Backend (Web Service)

✔ Build command:

npm install


✔ Start command:

node src/index.js


✔ Add all .env values in Render Dashboard.

🧪 API Testing (Postman)
🔐 Auth
Method	Endpoint	Description
POST	/api/auth/register	Create account
POST	/api/auth/login	Login & get token
📅 Events
Method	Endpoint	Description
GET	/api/events	Get events
POST	/api/events	Create event (moderator only)
PATCH	/api/events/:id	Edit event
DELETE	/api/events/:id	Remove event
📸 Screenshots (Optional Placeholder)
Add your images here:
![Home Page](./assets/home.png)
![Event Card](./assets/event-card.png)

🤝 Contributors

Iulian & Team
Full-stack development • Architecture • Deployment • UI/UX

📜 License

MIT License
