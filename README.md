# BuddyVerse — B2B Agricultural Export Platform

A production-grade B2B platform connecting Indian farmers and suppliers to global buyers. Built with Next.js 14, Express.js, Prisma, and PostgreSQL.

## Architecture

```
buddyverse/
├── src/               # Next.js 14 Frontend (App Router)
│   ├── app/           # Pages (/, /products, /admin, etc.)
│   ├── components/    # Shared React components
│   └── lib/           # Data & utilities
├── backend/           # Express.js REST API
│   ├── prisma/        # Schema + migrations + seed
│   └── src/
│       ├── routes/    # API route handlers
│       ├── middleware/ # Auth, validation, error handling
│       └── config/    # App configuration
├── docker-compose.yml # PostgreSQL + Redis + API + Frontend
└── .env.example       # All required environment variables
```

## Tech Stack

| Layer       | Technology |
|-------------|-----------|
| Frontend    | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| Backend     | Express.js + TypeScript |
| Database    | PostgreSQL + Prisma ORM |
| Cache       | Redis (sessions, rate limiting) |
| Auth        | JWT + Refresh Tokens + bcrypt |
| AI          | OpenAI API (Chat, Recommendations, Quotations) |
| Realtime    | Socket.io (chat, notifications, price ticker) |
| File Upload | Cloudinary / S3 |
| Container   | Docker + docker-compose |

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16+
- Redis 7+

### 1. Setup Database
```bash
# Create PostgreSQL database
createdb buddyverse

# Navigate to backend
cd backend
npm install

# Run migrations and seed
npm run db:migrate
npm run db:seed
```

### 2. Start Backend
```bash
cd backend
npm run dev
# API runs on http://localhost:4000
```

### 3. Start Frontend
```bash
# From root directory
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

### 4. Docker (Alternative)
```bash
# Start entire stack
docker-compose up -d
# Frontend: http://localhost:3000
# API: http://localhost:4000
# PostgreSQL: localhost:5432
# Redis: localhost:6379
```

## Default Login Credentials

| Role         | Email                     | Password      |
|-------------|---------------------------|---------------|
| Super Admin | admin@buddyverse.ai  | Password@123  |
| Seller      | rajesh@punjabgrains.com   | Password@123  |
| Seller      | sunil@keralaspice.com     | Password@123  |
| Buyer       | ahmed@dubaiimports.com    | Password@123  |
| Buyer       | khalid@saudigrains.com    | Password@123  |

## API Endpoints

### Public
- `GET  /api/v1/health` — Health check
- `GET  /api/v1/products` — List products (filters: category, search, origin, price range)
- `GET  /api/v1/products/:slug` — Product detail
- `GET  /api/v1/categories` — All categories with subcategories
- `GET  /api/v1/categories/:slug` — Category detail with products
- `GET  /api/v1/market-prices` — Market prices with filters
- `GET  /api/v1/market-prices/commodities` — Latest prices by commodity
- `POST /api/v1/ai/chat` — AI chat support
- `POST /api/v1/ai/recommendations` — AI product recommendations
- `GET  /api/v1/docs` — API documentation

### Auth
- `POST /api/v1/auth/register` — Register (BUYER/SELLER)
- `POST /api/v1/auth/login` — Login
- `POST /api/v1/auth/refresh` — Refresh token
- `GET  /api/v1/auth/me` — Current user profile
- `POST /api/v1/auth/logout` — Logout

### Protected (Buyer/Seller)
- `POST /api/v1/rfqs` — Create RFQ (Buyer)
- `GET  /api/v1/rfqs` — List RFQs
- `POST /api/v1/rfqs/:id/quote` — Submit quotation (Seller)
- `POST /api/v1/products` — Create product (Seller)
- `PUT  /api/v1/products/:id` — Update product (Seller)
- `GET  /api/v1/orders` — User orders
- `GET  /api/v1/orders/:id` — Order detail

### Admin
- `GET  /api/v1/admin/dashboard` — KPIs & stats
- `GET  /api/v1/admin/users` — User management
- `PUT  /api/v1/admin/users/:id` — Update user status
- `GET  /api/v1/admin/products/pending` — Pending approvals
- `PUT  /api/v1/admin/products/:id/approve` — Approve/reject product
- `GET  /api/v1/admin/leads` — Lead management
- `GET  /api/v1/admin/settings` — Site settings
- `GET  /api/v1/admin/audit-logs` — Audit trail

## Environment Variables

See `.env.example` for all required variables. Key variables:

```env
DATABASE_URL       # PostgreSQL connection
REDIS_URL          # Redis connection
JWT_ACCESS_SECRET  # JWT signing key (min 32 chars)
JWT_REFRESH_SECRET # Refresh token signing key (min 32 chars)
OPENAI_API_KEY     # For AI features (optional, mock responses without)
CLOUDINARY_*       # File upload credentials
SMTP_*             # Email configuration
TWILIO_*           # WhatsApp/SMS configuration
```

## Features

### Public Site
- Product catalog with 10+ categories and 50+ products
- Live market prices with historical data
- AI-powered chat support and product recommendations
- Buyer/seller registration with KYC
- Multi-step RFQ and quotation system

### Seller Portal
- Product management with rich specifications
- RFQ inbox with quotation submission
- Order management and tracking
- Certification upload

### Buyer Portal
- Product browsing and search
- RFQ posting with requirements
- Quotation comparison
- Order tracking

### Admin CMS
- Dashboard with KPIs and charts
- User/KYC management
- Product approval workflow
- Lead management with scoring
- Market price management
- Site settings and content
- Audit log tracking
