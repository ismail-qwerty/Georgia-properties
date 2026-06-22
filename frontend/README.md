# Brookfield Properties - Frontend

React + Vite client application for the Brookfield Properties platform.

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **TailwindCSS** - Utility-first CSS framework

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images and media
│   ├── components/     # Reusable UI components
│   │   └── ui/        # UI component library
│   ├── contexts/      # React context providers
│   ├── layouts/       # Layout components
│   ├── pages/         # Page components
│   │   ├── admin/    # Admin dashboard pages
│   │   ├── public/   # Unauthenticated pages
│   │   └── user/     # Authenticated user pages
│   ├── utils/         # Utility functions and API client
│   ├── App.jsx        # Main app component with routes
│   ├── main.jsx       # Entry point
│   └── index.css      # Global styles
├── .env.example       # Environment variables template
├── package.json       # Dependencies
└── vite.config.js     # Vite configuration
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and update values:

```bash
cp .env.example .env
```

Update the `.env` file with your backend API URL:

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_APP_NAME=Brookfield Properties
VITE_ENV=development
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Application Routes

### Public Routes (Unauthenticated)

- `/` - Landing page
- `/user-login` - Login page
- `/user-register` - Registration page

### User Routes (Authenticated)

- `/dashboard` - User dashboard
- `/data-optimization` - Task execution interface
- `/profile` - User profile
- `/history` - Task history
- `/wallet` - Wallet balance
- `/bind-wallet` - Link external wallet
- `/recharge-history` - Deposit history
- `/redemption` - Withdrawal request
- `/redemption-history` - Withdrawal history
- `/support` - Customer support
- `/lots-optimization` - Membership upgrades

### Admin Routes (Admin Only)

- `/administration` - User management dashboard
- `/administration/update-user/:id` - Edit user
- `/administration/reset-single/:id` - Assign tasks
- `/administration/reset-orders/:id` - View user tasks
- `/administration/properties` - Property catalog
- `/administration/memberships` - Tier management

## Key Features

### Authentication

- JWT-based authentication
- Protected routes with role-based access control
- Persistent login state with localStorage
- Auto-redirect based on user type

### User Interface

- Responsive design with TailwindCSS
- Reusable UI components
- Consistent teal/white theme
- Loading states and error handling

### API Integration

- Centralized API client with axios
- Automatic token injection
- Request/response interceptors
- Error handling and retry logic

## Component Library

Located in `src/components/ui/`:

- `CurrencyDisplay` - Format VIEWS currency
- `EmptyState` - Empty state messages
- `LoadingSpinner` - Loading indicator
- `ProgressBar` - Progress visualization
- `StarRating` - 5-star rating display
- `StatCard` - Dashboard statistic cards
- `StatusBadge` - Status indicators
- `TierBadge` - Membership tier badges

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000/api/v1` |
| `VITE_APP_NAME` | Application name | `Brookfield Properties` |
| `VITE_ENV` | Environment mode | `development` |

## Build for Production

```bash
npm run build
```

The production build will be created in the `dist/` folder.

To preview the production build:

```bash
npm run preview
```

## Deployment

The built files in `dist/` can be deployed to any static hosting service:

- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages

Make sure to configure the environment variables in your hosting platform.

## Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically use the next available port.

### API Connection Issues

- Verify the backend is running
- Check `VITE_API_URL` in `.env`
- Check browser console for CORS errors
- Verify network connectivity

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

## Support

For technical support, contact: support@brookfieldproperties.com
