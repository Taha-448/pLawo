# ⚖️ pLawo - AI-Driven Legal Connection Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tech: React](https://img.shields.io/badge/Frontend-React%2019-blue)](https://reactjs.org/)
[![Tech: Node](https://img.shields.io/badge/Backend-Node.js%20Express-green)](https://nodejs.org/)
[![Database: Supabase](https://img.shields.io/badge/Database-Supabase-purple)](https://supabase.com/)
[![AI: OpenAI](https://img.shields.io/badge/AI-GPT--4o--mini-orange)](https://openai.com/)

**pLawo** is a premier legal technology platform designed specifically for the Pakistani legal landscape. It bridges the gap between citizens seeking legal assistance and qualified legal professionals using state-of-the-art AI-driven matching.

---

## 🚩 Problem Statement

In Pakistan, finding the right legal counsel is often a process of trial and error, relying on word-of-mouth or unverified directories. 
- **Fragmented Information**: Clients struggle to identify which lawyer specializes in their specific legal issue.
- **Verification Gap**: There is no easy way for clients to know if a lawyer's credentials have been vetted.
- **Accessibility**: Navigating complex legal terminology makes it difficult for common citizens to articulate their needs.

## 💡 The Solution

**pLawo** simplifies this journey by providing a centralized, AI-enhanced marketplace:
1.  **AI Smart Search**: Users describe their problems in plain English, and our AI (GPT-4o-mini) analyzes the query, classifies it into legal categories (Family, Criminal, Corporate, etc.), and cites relevant Pakistani laws.
2.  **Verified Professional Network**: Lawyers undergo a strict verification process managed by platform administrators.
3.  **Seamless Booking**: Direct appointment scheduling between clients and specialized lawyers.
4.  **Role-Based Dashboards**: Tailored experiences for Clients, Lawyers, and Administrators.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS
- **Components**: Shadcn/UI & Lucide React
- **Animations**: Framer Motion
- **State/Routing**: React Router 7

### Backend
- **Runtime**: Node.js & Express
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Integration**: OpenAI SDK (GPT-4o-mini)

---

## 📂 Folder Structure

```text
pLawo/
├── frontend/               # React + Vite application
│   ├── src/
│   │   ├── components/     # Reusable UI components (shadcn/ui)
│   │   ├── pages/          # Main views (Admin, Client, Lawyer dashboards)
│   │   ├── services/       # API integration layers
│   │   ├── config/         # Supabase client configuration
│   │   └── App.jsx         # Main application entry
│   └── .env                # Frontend environment variables
├── backend/                # Node.js + Express server
│   ├── config/             # Supabase & DB connections
│   ├── controllers/        # Business logic for routes
│   ├── routes/             # API endpoint definitions
│   ├── middlewares/        # Auth & Role-based access control
│   ├── services/           # AI analysis logic
│   ├── seedLawyers.js      # Mock data seeding
│   ├── seedAuthAdmin.js    # Admin creation script
│   └── .env                # Backend secrets (API Keys, DB URLs)
└── .gitignore              # Unified ignore rules
```

---

## 🔄 Project Workflow

### 1. Client Journey
- **Identify**: Uses "Smart Search" to describe a legal problem.
- **Match**: AI classifies the case and suggests relevant lawyers.
- **Consult**: Views detailed profiles (bio, fees, experience) and books an appointment.

### 2. Lawyer Journey
- **Register**: Creates an account and submits profile details (Bar License, Specialization).
- **Verify**: Remains "Pending" until an administrator reviews their credentials.
- **Manage**: Uses the dashboard to track appointments and interact with clients.

### 3. Admin Journey
- **Moderate**: Monitors the verification queue for new lawyer applications.
- **Govern**: Approves or rejects lawyers based on document verification.
- **Analytics**: Views platform-wide stats (total cases, specialization trends).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Supabase Project (URL & Service Role Key)
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
    # Create .env with: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY, JWT_SECRET
    npm run dev
    ```

3.  **Frontend Setup**:
    ```bash
    cd ../frontend
    npm install
    # Create .env with: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
    npm run dev
    ```

### Seeding Data
To populate the platform with initial data, run these commands in the `backend/` directory:
- `node seedLawyers.js` (Populates mock lawyers)
- `node seedAuthAdmin.js` (Creates the default admin: `admin@demo.com` / `password123`)

---

## 🛡️ Security
- **JWT Protection**: All sensitive routes are protected by Supabase Auth tokens.
- **RBAC**: Middleware ensures only authorized roles (ADMIN, LAWYER) can access specific endpoints.
- **Secrets Management**: All API keys are excluded from version control via `.gitignore`.

---

## ⚖️ License
Distributed under the MIT License. See `LICENSE` for more information.
