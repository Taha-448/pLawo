# ⚖️ pLawo - AI-Driven Legal Connection Platform (MERN Stack)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tech: React](https://img.shields.io/badge/Frontend-React%2019-blue)](https://reactjs.org/)
[![Tech: Node](https://img.shields.io/badge/Backend-Node.js%20Express-green)](https://nodejs.org/)
[![Database: MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-forestgreen)](https://www.mongodb.com/)
[![AI: OpenAI](https://img.shields.io/badge/AI-GPT--4o--mini-orange)](https://openai.com/)
[![Storage: Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-blueviolet)](https://cloudinary.com/)

**pLawo** is a premier legal technology platform designed specifically for the Pakistani legal landscape. It bridges the gap between citizens seeking legal assistance and qualified legal professionals using state-of-the-art AI-driven matching. Now fully migrated to a robust MERN stack for enhanced scalability and deployment flexibility.

---

## 🚩 Problem Statement

In Pakistan, finding the right legal counsel is often a process of trial and error, relying on word-of-mouth or unverified directories. 
- **Fragmented Information**: Clients struggle to identify which lawyer specializes in their specific legal issue.
- **Verification Gap**: There is no easy way for clients to know if a lawyer's credentials have been vetted.
- **Accessibility**: Navigating complex legal terminology makes it difficult for common citizens to articulate their needs.

## 💡 The Solution

**pLawo** simplifies this journey by providing a centralized, AI-enhanced marketplace:
1.  **AI Smart Search**: Users describe their problems in plain English or Urdu (Transliterated), and our AI (GPT-4o-mini) analyzes the query, classifies it into legal categories, and cites relevant Pakistani laws.
2.  **Verified Professional Network**: Lawyers undergo a strict verification process involving Bar License uploads (via Cloudinary) and admin review.
3.  **Flexible Availability**: Dynamic office hours management with 1-hour slot generation and conflict prevention.
4.  **Local Context**: Comprehensive support for all major Pakistani cities and professional PKR fee formatting.
5.  **Role-Based Dashboards**: Tailored experiences for Clients, Lawyers, and Administrators with real-time status tracking.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS & Shadcn/UI
- **Animations**: Framer Motion
- **State/Routing**: React Router 7
- **API Client**: Fetch API with JWT Bearer tokens

### Backend
- **Runtime**: Node.js & Express
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) & Bcryptjs for password hashing
- **Storage**: Cloudinary (Cloud-based media management)
- **AI Integration**: OpenAI SDK (GPT-4o-mini)

---

## 📂 Folder Structure

```text
pLawo/
├── frontend/               # React + Vite application
│   ├── src/
│   │   ├── components/     # Reusable UI components (shadcn/ui)
│   │   ├── pages/          # Main views (Admin, Client, Lawyer dashboards)
│   │   ├── services/       # API service layer (JWT handling)
│   │   └── App.jsx         # Main application entry
│   └── .env                # VITE_API_URL
├── backend/                # Node.js + Express server
│   ├── config/             # MongoDB & Cloudinary connections
│   ├── controllers/        # Mongoose-based business logic
│   ├── models/             # Mongoose Schemas (User, LawyerProfile, etc.)
│   ├── routes/             # API endpoint definitions
│   ├── middlewares/        # JWT Auth & Multer-Cloudinary logic
│   ├── services/           # AI analysis logic
│   └── .env                # MONGO_URI, JWT_SECRET, Cloudinary Keys
└── .gitignore              # Unified ignore rules
```

---

## 🌐 Deployment (Bonus Extra Credit)

To earn the bonus marks, follow these steps to deploy your live website:

### 1. Backend (Render.com)
- Create a **Web Service** on Render.
- Connect this GitHub repo.
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Environment Variables**: Add all keys from `backend/.env` (MONGO_URI, JWT_SECRET, etc.).

### 2. Frontend (Vercel.com)
- Create a **New Project** on Vercel.
- Connect this GitHub repo.
- **Root Directory**: `frontend`
- **Environment Variable**: `VITE_API_URL` = (Your Render Service URL + `/api`).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Cluster (Connection URI)
- Cloudinary Account (Cloud Name, API Key, Secret)
- OpenAI API Key

### Installation

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Taha-448/pLawo.git
    cd pLawo
    ```

2.  **Backend Setup**:
    ```bash
    cd backend
    npm install
    # Set up .env with MONGO_URI, JWT_SECRET, and Cloudinary keys
    npm run dev
    ```

3.  **Frontend Setup**:
    ```bash
    cd ../frontend
    npm install
    # Set up .env with VITE_API_URL
    npm run dev
    ```

### Initial Admin Setup
To create your first admin user, run the following command in the `backend/` directory:
- `node scripts/createAdmin.js`
- Default Credentials: `admin@plawo.com` / `Admin123!`

---

## 🛡️ Security
- **JWT Authentication**: Secure stateless authentication using JSON Web Tokens.
- **Password Hashing**: Industry-standard encryption using Bcryptjs.
- **Role-Based Access Control (RBAC)**: Backend middleware ensures only authorized roles can access sensitive API endpoints.
- **Cloud Storage**: Secure handling of professional documents via Cloudinary.
- **Environment Safety**: Sensitive keys are strictly managed via `.env` and never committed to version control.

---

## ✨ Key Features
- ✅ **AI Legal Classifier**: Maps user queries to specific Pakistani Legal Acts.
- ✅ **Cloud-Native Storage**: Immediate upload of licenses and photos to Cloudinary.
- ✅ **Omniscient Admin Dashboard**: Live revenue tracking and global appointment activity.
- ✅ **Mongoose Middlewares**: Automatic lawyer rating calculations on review submission.
- ✅ **Professional Local Context**: 25+ Pakistani cities supported with PKR localization.

---

## ⚖️ License
Distributed under the MIT License. See `LICENSE` for more information.
