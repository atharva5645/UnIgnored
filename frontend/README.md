# UnIgnored: Smart Public Complaint & Issue Tracking System

UnIgnored is a high-fidelity, production-ready civic engagement platform designed to bridge the gap between citizens and local authorities. Built with a focus on transparency, speed, and premium user experience.

## 🚀 Tech Stack
- **Framework**: React 18 + TypeScript (Strict)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Glassmorphism Utilities
- **Animations**: Framer Motion
- **State Management**: Zustand (Persisted)
- **Maps**: Leaflet + React-Leaflet
- **Analytics**: Recharts
- **Forms**: React Hook Form + Zod Validation
- **Icons**: Lucide React
- **PWA**: Vite PWA Plugin (Offline Support)
- **Utilities**: date-fns, clsx, axios

## ✨ Key Features implemented

### 1. Citizen Experience
- **6-Step Complaint Wizard**: Category selection, GPS location pinning, evidence upload (camera/gallery), detailed reporting, and live review.
- **Real-Time Tracking**: Visual timeline of complaint progress from submission to resolution.
- **Smart Dashboard**: Kanban view for task management, activity heatmaps (GitHub-style), and achievement badges.
- **Command Palette**: `Ctrl+K` interface for instant navigation across 50+ system commands.
- **Public Feed**: Live ticker and activity feed showing city-wide resolutions in real-time.

### 2. Officer & Admin Control
- **Officer Duty Desk**: Priority task queue, performance metrics (SLA compliance), and internal resolution proof upload.
- **Admin Command Center**: City-wide analytics, heatmaps, zonal leaderboards, and workforce management.
- **Role-Based Access**: Secure routing for Citizens, Officers, and Admins.

### 3. Advanced Geospatial & UI
- **Interactive City Map**: Live markers for complaints, category filters, and location-context popovers.
- **Premium Aesthetics**: Dark-mode first design, glassmorphism, scroll-triggered animations, and skeleton loaders.
- **Accessibility**: WCAG 2.1 AA compliant, screen-reader ready, and high-contrast support.

## 🛠️ Setup Instructions

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## 📂 Project Structure
- `src/components/ui`: Atomic UI library (Button, Card, Badge, etc.)
- `src/components/common`: Shared layout components (Navbar, CommandPalette)
- `src/pages`: Feature-based page modules (Landing, Auth, Dashboards)
- `src/store`: Global state management with Zustand
- `src/types`: Strict TypeScript interfaces for the entire domain
- `src/utils`: Mock data generators and helpers

## 🛡️ Security & Performance
- **Protected Routes**: Middleware-based redirection for secure areas.
- **Lazy Loading**: Route-based code splitting for instant initial loads.
- **PWA**: Fully installable with service-worker caching for offline resilience.
