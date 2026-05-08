# CivicEye Architecture Documentation

This document outlines the architectural design of the CivicEye frontend, specifically designed for scalability and future backend integration.

## 1. Project Structure

The project follows a modular, feature-based architecture:

```text
src/
├── components/          # Reusable UI components
│   ├── ui/              # Atom-level components (Button, Card, etc.)
│   ├── layout/          # Layout components (Navbar, Footer, Shell)
│   ├── landing/         # Landing-specific sections
│   ├── complaints/      # Complaint-related complex components
│   ├── dashboard/       # Dashboard widgets and layouts
│   ├── analytics/       # Chart and data visualization wrappers
│   ├── map/             # Map-related components (Leaflet wrappers)
│   ├── chat/            # Real-time communication components
│   └── auth/            # Authentication forms and guards
├── pages/               # Top-level route pages
├── hooks/               # Custom React hooks (logic reuse)
├── store/               # State management (Zustand)
├── types/               # TypeScript interfaces and types
├── utils/               # Helper functions and constants
├── services/            # API and external service integrations (Mocked)
│   ├── api.ts           # Central API service (Gateway for future backend)
│   ├── offlineStorage.ts # IndexedDB / LocalStorage management
│   └── notificationService.ts # Browser/Push notifications
└── assets/              # Static assets (images, icons)
```

## 2. State Management (Zustand)

Zustand is used for global state management due to its simplicity and small footprint.

- **`authStore.ts`**: Manages user session, roles, and profile data. Persisted to `localStorage`.
- **`complaintStore.ts`**: Manages the list of complaints, filtering, and drafts.
- **`uiStore.ts`**: Manages global UI states like dark mode, notifications, and command palette.

## 3. Backend Integration Strategy

The architecture uses a "Service Layer" to decouple UI components from data fetching logic.

### To integrate a real backend:
1.  **Update `src/services/api.ts`**: Replace mock functions with real `axios` or `fetch` calls.
2.  **Authentication**: Update `authStore.ts` to use JWT or OAuth tokens returned from the backend.
3.  **Real-time Updates**: Replace `useWebSocket` mock (setInterval) with a real `Socket.io` or `Websocket` implementation.
4.  **Media Uploads**: Update the `media` step in the complaint wizard to upload to a cloud storage (e.g., S3) and send URLs to the API.

## 4. Performance & Offline (PWA)

- **IndexedDB (Dexie.js)**: Used to store large amounts of data (like complaint drafts) offline.
- **Vite PWA Plugin**: Handles service worker generation, manifest management, and caching strategies.
- **Lazy Loading**: Pages are dynamically imported to keep the initial bundle small.

## 5. UI/UX Principles

- **Atomic Design**: Small, reusable components are composed into complex views.
- **Accessibility**: ARIA labels, keyboard navigation, and high-contrast modes are built-in.
- **Responsiveness**: Mobile-first approach using Tailwind's responsive utilities.

## 6. Key Libraries

- **React 18**: Core framework.
- **TypeScript**: Type safety across the board.
- **Tailwind CSS**: Utility-first styling.
- **Framer Motion**: Premium animations.
- **React Leaflet**: Open-source maps.
- **Recharts**: Data visualization.
- **React Hook Form + Zod**: Robust form management and validation.
```
