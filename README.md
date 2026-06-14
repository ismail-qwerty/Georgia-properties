# Brookfield Properties API

Backend API for the Brookfield Properties Platform built with Node.js, Express, TypeScript, and Supabase.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
npm start
```

## API Endpoints

- `GET /health` - Health check
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/users/profile` - Get user profile (auth required)
- `GET /api/v1/users/wallet` - Get wallet info (auth required)
- `GET /api/v1/admin/users` - List users (admin only)

## Architecture

- **MVC Pattern**: Models, Views (JSON), Controllers
- **Middleware**: CORS, Helmet, Auth, Error Handling
- **Database**: Supabase (PostgreSQL)
- **TypeScript**: Full type safety
- **ESM**: Modern ES modules

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Express middleware
├── models/          # Type definitions
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utilities
└── types/           # TypeScript types
```
