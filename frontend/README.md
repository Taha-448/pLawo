# ⚖️ pLawo Frontend - Premium Legal Interface

This is the high-performance React frontend for the **pLawo** legal connection platform. Built with React 19 and Vite, it delivers a sleek, responsive, and secure experience for clients, lawyers, and administrators.

## ✨ Features
- **Smart AI Search**: Natural language legal problem analysis.
- **Dynamic Dashboards**: Role-specific views for managing appointments and verification.
- **Professional Analytics**: Recharts-powered data visualization for administrators.
- **Secure Authentication**: Integrated with Supabase Auth for JWT-protected sessions.
- **Rich Aesthetics**: Framer Motion animations and Shadcn/UI components for a premium feel.

## 🛠️ Tech Stack
- **Framework**: [React 19](https://reactjs.org/) (Vite)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Shadcn/UI](https://ui.shadcn.com/) & [Lucide React](https://lucide.dev/)
- **State Management**: React Hooks
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Create a `.env` file based on the provided configuration with your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

## 🏗️ Architecture
- `/src/pages`: Main application views and dashboard logic.
- `/src/components`: Atomic UI components and layout wrappers.
- `/src/services`: API abstraction layer for backend communication.
- `/src/config`: Supabase client initialization.
- `/src/styles`: Global themes and Tailwind configurations.