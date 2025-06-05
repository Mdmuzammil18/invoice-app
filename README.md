# Invoice App

A modern, responsive Invoice Dashboard built with React, TypeScript, Formik, Yup, and Vite.

## Features
- **Invoice creation form** with validation and multi-tab navigation
- **Drag-and-drop PDF/doc upload** with preview and removal
- **Formik + Yup** for robust form state and validation
- **Reusable input and select components**
- **Comments section** with tagging and persistence
- **Draft saving** (localStorage)
- **Responsive design** for desktop and mobile
- **Protected routes** and authentication

## Tech Stack
- React 18 + TypeScript
- Vite
- Formik & Yup
- styled-components (for layout and form styling)
- React Router v6
- React Icons

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the app:**
   ```bash
   npm run dev
   ```
3. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure
- `src/pages/Dashboard.tsx` – Main invoice dashboard form
- `src/pages/Dashboard.validation.ts` – Yup validation schema
- `src/pages/Login.tsx` – Login form
- `src/context/InvoiceContext.tsx` – Invoice context (if used)
- `src/components/ProtectedRoute.tsx` – Route protection

