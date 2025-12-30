# PulseOffice - Modern Office Management System

PulseOffice is a premium, high-performance office management dashboard designed with a focus on speed, logic, and a stunning dark-mode aesthetic. It streamlines essential office workflows including employee attendance, correspondence tracking, and workforce management.

## ✨ Core Features

- **🚀 Executive Command Center**: A high-level overview of office operations with real-time stats.
- **🕒 Intelligence Attendance Portal**: Secure check-in/out system with live clock and daily status tracking.
- **✉️ Correspondence Streams**: Integrated management for both Incoming and Outgoing mail with file attachment support.
- **👥 Workforce Directory**: Comprehensive employee management and department organization.
- **🔐 Secure Authentication**: Robust security powered by Auth.js (NextAuth), ensuring data integrity.
- **💎 Premium UI/UX**: Modern dark-mode interface featuring glassmorphism, smooth animations (Framer Motion), and a responsive layout.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Auth.js v5](https://authjs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd pulse-office/web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   Create a `.env.local` file in the `web` directory and add the following:
   ```env
   DATABASE_URL=your_postgresql_url
   AUTH_SECRET=your_auth_secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Deployment

This project is optimized for deployment on the [Vercel Platform](https://vercel.com).

1. Connect your GitHub repository to Vercel.
2. Configure the environment variables (`DATABASE_URL`, `AUTH_SECRET`) in the Vercel dashboard.
3. Deploy!

---

Built with ❤️ by [Izan]

