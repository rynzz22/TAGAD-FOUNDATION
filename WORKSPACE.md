# TAGAD v2.0.0 — Frontend/Backend Segregation

This repository now contains **independently deployable frontend and backend** for the TAGAD (Talibon Analytics for Gender and Development) system.

## Directory Structure

```
TAGAD-FOUNDATION/
├── frontend/                    # React SPA (independently deployable)
│   ├── src/                    # React source code
│   ├── index.html              # SPA entry point
│   ├── vite.config.ts          # Vite configuration (frontend only)
│   ├── tsconfig.json           # Frontend TypeScript config
│   ├── package.json            # Frontend dependencies
│   └── .env.example            # Frontend env variables (SAFE for browser)
│
├── backend/                     # Express API Server (independently deployable)
│   ├── server/                 # Express application code
│   ├── server.ts               # Backend entry point
│   ├── prisma/                 # Prisma ORM & migrations
│   ├── supabase/               # Database migrations (Supabase)
│   ├── scripts/                # Build/utility scripts
│   ├── tsconfig.json           # Backend TypeScript config
│   ├── package.json            # Backend dependencies
│   └── .env.example            # Backend env variables (SECRETS)
│
└── docs/                        # Documentation
```

## Installation

### Frontend (Independently)

```bash
cd frontend
npm install
npm run typecheck
npm run build
npm run dev
```

### Backend (Independently)

```bash
cd backend
npm install
npm run typecheck
npm run db:validate
npm run dev
```

## Development

### Run Frontend
```bash
cd frontend
npm run dev
# Opens http://localhost:5173 (Vite default)
```

### Run Backend
```bash
cd backend
npm run dev
# API runs on http://localhost:3000
```

### Set Environment Variables

1. **Frontend** (`frontend/.env`)
   - `VITE_API_BASE_URL=http://localhost:3000/api` (development)

2. **Backend** (`backend/.env`)
   - `DATABASE_URL=` (Prisma connection)
   - `JWT_SECRET=` (Auth token secret)
   - `GEMINI_API_KEY=` (AI API key - BACKEND ONLY)

See `frontend/.env.example` and `backend/.env.example` for all available variables.

## Production

### Build Frontend
```bash
cd frontend
npm run build
# Outputs to frontend/dist/
```

### Build & Run Backend
```bash
cd backend
npm run start
# Runs on http://localhost:3000
```

Deploy frontend build artifacts separately (e.g., S3, Vercel, Netlify).
Deploy backend as Node.js service (e.g., Railway, Heroku, VPS).

## API Boundary

**Frontend communicates with Backend exclusively via HTTP:**

```
Frontend (React SPA)
    ↓ HTTP/REST
Backend Express API
    ↓ 
Prisma ORM
    ↓
PostgreSQL Database
```

### Frontend → Backend URLs
- `VITE_API_BASE_URL` env var controls the API endpoint
- Default: `http://localhost:3000/api` (development)
- Production: Set to your backend URL (e.g., `https://api.example.com/api`)

## Security Boundaries

### Frontend (Browser Safe)
✅ React components, routing, UI logic
✅ Public API endpoints
❌ **NO** JWT secrets
❌ **NO** Database URLs
❌ **NO** API keys (GEMINI, etc.)

### Backend (Secrets Safe)
✅ All authentication logic
✅ JWT token creation/verification
✅ Database access
✅ API key management (GEMINI)
✅ RBAC enforcement
❌ **NO** React components
❌ **NO** Browser APIs

## Authentication Flow

1. Frontend sends login request → Backend
2. Backend validates credentials, creates JWT
3. Frontend stores JWT in localStorage
4. Frontend sends Authorization header with each request
5. Backend verifies JWT and enforces RBAC
6. On 401 (Unauthorized), frontend redirects to login

## Database Ownership

- **Frontend**: ❌ No Prisma, no DATABASE_URL
- **Backend**: ✅ Full Prisma access, migrations, seeds

## Migration Status

- ✅ Frontend/Backend physically separated
- ✅ Package manifests segregated
- ✅ Vite decoupled from backend
- ✅ Environment variables segregated
- ✅ Secrets protected (no frontend exposure)
- ✅ Independent installation & builds
- ✅ Independent development servers
- ✅ API boundary established

## Known Limitations

- None at this time

## Troubleshooting

### Frontend can't reach backend
- Check `VITE_API_BASE_URL` environment variable
- Ensure backend is running on correct port
- Check CORS is enabled on backend

### Backend type errors
```bash
cd backend
npm run typecheck
```

### Prisma issues
```bash
cd backend
npm run db:validate
npx prisma migrate deploy
```

---

For detailed documentation, see [docs/](./docs/)
