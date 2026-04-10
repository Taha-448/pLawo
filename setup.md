# 🛡️ pLawo - Legal AI Search Pilot

This project is a high-performance Full-Stack Legal Tech application designed to match Pakistani citizens with the right legal counsel using Gemini 1.5 Flash AI.

---

## 🚀 Getting Started (Setup from Scratch)

Follow these steps precisely to set up the project on your local machine.

### 1. Prerequisites
Ensure you have the following installed:
- **Node.js** (v18 or higher)
- **MySQL** (If using a local database) OR an **Aiven MySQL** cloud account.
- **Git**

### 2. Cloning the Project
Open your terminal and run:
```bash
git clone <YOUR_GITHUB_REPO_URL>
cd pLawo-project
```

### 3. Backend Configuration
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory:
   ```bash
   touch .env
   ```
4. Paste the following configuration into `.env` (Replace with your actual keys):
   ```env
   DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE?ssl-mode=REQUIRED"
   JWT_SECRET="EnterAnyRandomStrongString"
   GEMINI_API_KEY="GetYourKeyFrom_aistudio.google.com"
   ```
5. Initialize the Database and Seed initial data:
   ```bash
   npx prisma db push
   node seedLawyers.js
   node seedAdmin.js
   ```
6. Start the Backend:
   ```bash
   npm run dev
   ```

### 4. Frontend Configuration
1. Open a **new terminal** and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Frontend:
   ```bash
   npm run dev
   ```

---

## 🛠️ How to Upload to GitHub (For Collaboration)

Follow these steps to push your project to a new GitHub repository so your friends can collaborate.

### Step 1: Initialize Git
In the root directory (`pLawo-project/`), run:
```bash
git init
```

### Step 2: Add Files
```bash
git add .
```
*(Note: Our `.gitignore` will automatically prevent secret keys and node_modules from being uploaded.)*

### Step 3: Commit
```bash
git commit -m "Initialize pLawo Full-Stack Project"
```

### Step 4: Create a GitHub Repo
1. Go to [GitHub.com](https://github.com/) and create a **New Repository**.
2. Give it a name (e.g., `pLawo-AI`).
3. **DO NOT** initialize with a README, license, or gitignore (we already have them).

### Step 5: Push to GitHub
Copy the commands from the GitHub instruction page and run them:
```bash
git remote add origin <YOUR_REPO_URL>
git branch -M main
git push -u origin main
```

---

## 💡 Important Collaboration Tips (For Your Friends)
- **Share the .env Template**: Since the `.env` file is hidden for security, your friends will need to create their own using the template provided above.
- **Prisma Client**: Every time you change the database schema, your friends must run `npx prisma generate`.

---

## ⚖️ Technology Stack
- **Frontend**: React, Vite, Tailwind CSS, Shadcn/UI
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: MySQL (Aiven)
- **AI**: Gemini 1.5 Flash (Google AI Studio)
