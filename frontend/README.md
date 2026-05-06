# ⚖️ pLawo Frontend - Premium Legal Interface

This is the high-performance React frontend for the **pLawo** legal connection platform. Built with React 19 and Vite, it delivers a sleek, responsive, and secure experience for clients, lawyers, and administrators. This frontend is now fully integrated with a custom MERN backend using JWT authentication.

## ✨ Features
- **Smart AI Search**: Natural language legal problem analysis using OpenAI.
- **Dynamic Dashboards**: Role-specific views for managing appointments and verification.
- **Professional Analytics**: Recharts-powered data visualization for administrators.
- **JWT Authentication**: Secure sessions with tokens stored in localStorage.
- **Cloudinary Integration**: Immediate cloud-based image and document handling.
- **Rich Aesthetics**: Framer Motion animations and Shadcn/UI components for a premium feel.

## 🛠️ Tech Stack
- **Framework**: [React 19](https://reactjs.org/) (Vite)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Shadcn/UI](https://ui.shadcn.com/) & [Lucide React](https://lucide.dev/)
- **State Management**: React Hooks
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **API Communication**: standard Fetch API with dynamic Authorization headers.

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Create a `.env` file with the following variable:
   - `VITE_API_URL`: Your backend API base URL (e.g., `http://localhost:5000/api`)

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

## 🏗️ Architecture
- `/src/pages`: Main application views and dashboard logic.
- `/src/components`: Atomic UI components and layout wrappers.
- `/src/services`: API abstraction layer (e.g., `api.js`) for backend communication.
- `/src/styles`: Global themes and Tailwind configurations.
- `/src/utils`: Helper functions for image formatting and case analysis.