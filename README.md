# Brookfield Properties Platform

A full-stack property review task platform with referral-only access and internal virtual currency (VIEWS).

## Project Structure

```
Georgia properties/
├── frontend/          # React + Vite client application
├── backend/           # Node.js + Express + TypeScript API
└── .amazonq/         # Project rules and documentation
```

## Quick Start

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Configure your API endpoint
npm run dev
```

## Documentation

- Backend API documentation: [backend/README.md](backend/README.md)
- System specifications: [.amazonq/rules/PRD.md](.amazonq/rules/PRD.md)

## Technology Stack

**Frontend:**
- React 18
- Vite
- TailwindCSS
- React Router

**Backend:**
- Node.js
- Express
- TypeScript
- Supabase (PostgreSQL)

## Key Features

- Referral-only registration system
- Task-based earning mechanism
- Multi-tier membership levels
- Internal wallet system with VIEWS currency
- Administrative back-office dashboard
- Real-time balance tracking
