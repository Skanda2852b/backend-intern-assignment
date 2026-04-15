Below is a comprehensive `README.md` file tailored to your project. You can copy it directly into the root of your repository.



<img width="1919" height="935" alt="Screenshot 2026-04-15 205738" src="https://github.com/user-attachments/assets/fedcbe4a-8fd1-415b-987c-bdd0390da133" />



```markdown
# Task Manager API – Backend Developer Intern Assignment

A full‑stack task management application built with **Next.js**, **MongoDB**, and **TypeScript**. It demonstrates secure user authentication, role‑based access control (RBAC), RESTful API design, and a clean frontend for interacting with the API.

---

## 🚀 Live Demo (Optional)

_Add your Vercel deployment URL here if you deploy the app_

---

## 📌 Features

### Backend
- ✅ User registration & login with **JWT authentication** (HTTP‑only cookies)
- ✅ Password hashing using **bcrypt**
- ✅ **Role‑based access** (`user` vs `admin`)
- ✅ Full **CRUD operations** for tasks
- ✅ Input validation with **Zod**
- ✅ API versioning (`/api/v1/`)
- ✅ Centralised error handling & meaningful HTTP status codes
- ✅ **Swagger UI** documentation at `/api/docs`

### Frontend
- ✅ Registration & login pages (Tailwind CSS)
- ✅ Protected dashboard with task management
- ✅ Admin panel for user role management (admin only)
- ✅ Real‑time feedback (success/error messages)
- ✅ Fully responsive UI

### Security & Scalability
- ✅ JWT stored in HTTP‑only cookies (XSS protection)
- ✅ Input sanitisation & validation
- ✅ Modular project structure (ready for microservices)
- ✅ Scalability note included (`SCALABILITY.md`)

---

## 🛠️ Tech Stack

| Category            | Technology                        |
|---------------------|-----------------------------------|
| **Framework**       | Next.js 16 (Pages Router)         |
| **Language**        | TypeScript                        |
| **Database**        | MongoDB (with Mongoose ODM)       |
| **Authentication**  | JWT + bcrypt                      |
| **Validation**      | Zod                               |
| **Styling**         | Tailwind CSS                      |
| **API Docs**        | Swagger UI                        |
| **Version Control** | Git & GitHub                      |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or later
- **npm** 9.x or later (or yarn/pnpm)
- **MongoDB** (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Skanda2852b/backend-intern-assignment.git
cd backend-intern-assignment
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root directory and add the following:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_jwt_secret_key
```

> **Important**:  
> - Replace `your_mongodb_connection_string` with your actual MongoDB URI.  
> - Use a long, random string for `JWT_SECRET` (e.g., generated with `openssl rand -base64 32`).

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 API Documentation (Swagger)

Once the server is running, visit:

```
http://localhost:3000/api/docs
```

You will see an interactive Swagger UI where you can:

- Explore all available endpoints
- View request/response schemas
- Test endpoints directly (use the **Authorize** button to set your JWT token)

### 🔑 Obtaining a JWT Token

1. Register a new user via the frontend (`/register`) or the API.
2. The token is stored in an HTTP‑only cookie.  
   For testing outside the browser, you can extract it from the **Application → Cookies** tab in DevTools and use it in the Swagger **Authorize** dialog as `Bearer <token>`.

---

## 📁 Project Structure

```
backend-intern-assignment/
├── src/
│   ├── lib/                    # Reusable utilities
│   │   ├── auth.ts             # JWT helpers
│   │   ├── dbConnect.ts        # MongoDB connection
│   │   └── validate.ts         # Zod schemas
│   ├── models/                 # Mongoose models
│   │   ├── User.ts
│   │   └── Task.ts
│   ├── pages/                  # Next.js pages & API routes
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── login.ts
│   │   │   │   │   ├── register.ts
│   │   │   │   │   └── me.ts
│   │   │   │   ├── tasks/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── [id].ts
│   │   │   │   └── users/
│   │   │   │       ├── index.ts
│   │   │   │       └── [id]/
│   │   │   │           └── role.ts
│   │   │   └── docs.ts         # Swagger UI handler
│   │   ├── index.tsx           # Home page
│   │   ├── register.tsx
│   │   ├── login.tsx
│   │   ├── dashboard.tsx
│   │   └── _app.tsx
│   ├── styles/                 # Global CSS (Tailwind)
│   │   └── globals.css
│   └── utils/                  # Frontend API client
│       └── api-client.ts
├── public/                     # Static assets
├── .env.local                  # Environment variables (git‑ignored)
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── next.config.js              # Next.js configuration
├── SCALABILITY.md              # Scalability considerations
└── README.md                   # You are here
```

---

## 🧪 Testing the Application

### 1. Register a new user
- Visit `/register` and fill in the form.
- **Note:** The very first registered user is automatically assigned the `admin` role.

### 2. Login
- Use the same credentials at `/login`.

### 3. Dashboard (User View)
- Create, edit, update, and delete your own tasks.
- Statuses: `pending`, `in-progress`, `completed`.

### 4. Admin Features
- If your role is `admin`, you will see a **"Show Admin Panel"** button.
- The admin panel displays all registered users.
- You can promote/demote users between `user` and `admin`.
- The admin also sees **all tasks** from all users in the dashboard.

### 5. API Testing
- Use **Postman** or the built‑in **Swagger UI** (`/api/docs`) to test all endpoints.

---

## 📈 Scalability Note

A separate document `SCALABILITY.md` outlines how this application can be scaled for production workloads. It covers:

- Database indexing
- Caching with Redis
- Stateless JWT for horizontal scaling
- Microservices readiness
- Containerisation (Docker)
- Load balancing and monitoring

---

## ✅ Assignment Deliverables Checklist

- [x] Backend project hosted on GitHub with detailed `README.md`
- [x] Working authentication & CRUD APIs
- [x] Functional frontend UI (Next.js + Tailwind)
- [x] API documentation (Swagger UI)
- [x] Scalability note (`SCALABILITY.md`)
- [x] Role‑based access control demonstrated
- [x] Proper error handling and validation

---

## 📝 Submission Instructions

This project was developed as part of the **Backend Developer Intern** hiring task.  
The submission form link provided in the assignment email must be used.

**Repository URL:**  
https://github.com/Skanda2852b/backend-intern-assignment.git



## 👤 Author

**Your Name**  
[Your GitHub Profile](https://github.com/Skanda2852b)  
[Your LinkedIn Profile](https://www.linkedin.com/in/skanda-s-544834301/)

---

## 📄 License

```
