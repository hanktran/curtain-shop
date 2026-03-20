# Noi that Dai Duong

Noi that Dai Duong is a Vietnamese interior decor storefront and admin CMS for managing products and customer leads. The catalog focuses on curtains, flooring, wallpaper, and 3D decorative art.

## Tech Stack

- Next.js 16.1.6 (App Router)
- React 19 + TypeScript
- Prisma 7.4.2 + PostgreSQL (Neon)
- NextAuth 5.0.0-beta.30
- TailwindCSS 4 + shadcn/ui
- Uploadthing (file uploads)
- Tiptap (rich text editing)

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (Neon recommended)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd curtain-shop
npm install
```

### 2. Configure environment variables

Create a `.env` file from `.env.example` and fill in values:

```bash
cp .env.example .env
```

See the full variable reference in [Environment Variables](#environment-variables).

### 3. Set up the database

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 4. Start the development server

```bash
npm run dev
```

Open http://localhost:3000.

## Environment Variables

| Variable | Description | Required |
| --- | --- | --- |
| `DATABASE_URL` | PostgreSQL connection string (Neon). | Yes |
| `AUTH_SECRET` | Secret used by NextAuth/Auth.js for signing tokens and sessions. | Yes |
| `AUTH_URL` | Base app URL used by Auth.js (for example, `http://localhost:3000` in development). | Yes |
| `UPLOADTHING_TOKEN` | Uploadthing API token for media uploads. | Yes |
| `ADMIN_EMAIL` | Initial admin email used by seed script. | Seed only |
| `ADMIN_PASSWORD` | Initial admin password used by seed script. | Seed only |
| `NEXT_PUBLIC_SITE_URL` | Public site URL used for canonical links and sharing. | No |
| `NEXT_PUBLIC_PHONE` | Public contact phone shown in the storefront UI. | No |
| `NEXT_PUBLIC_EMAIL` | Public contact email shown in the storefront UI. | No |
| `NEXT_PUBLIC_ADDRESS` | Public business address shown in the storefront UI. | No |
| `NEXT_PUBLIC_MAP_URL` | Public map link for location/contact sections. | No |
| `NEXT_PUBLIC_ZALO_PHONE` | Public Zalo contact phone (if you wire a separate Zalo number). | No |

## Project Structure

- `app/`: Next.js App Router routes, layouts, and API route handlers.
- `components/`: Reusable UI and feature components (public + admin).
- `actions/`: Server actions for auth, products, discounts, inquiries, and search.
- `lib/`: Shared utilities, query helpers, auth setup, and Prisma client code.
- `prisma/`: Database schema and seed script.

## Scripts

From `package.json`:

- `npm run dev`: Start Next.js in development mode.
- `npm run build`: Build the app for production.
- `npm run start`: Start the production server.
- `npm run lint`: Run ESLint.
- `npm run db:generate`: Generate Prisma client.
- `npm run db:migrate`: Run Prisma migrate in development.
- `npm run db:seed`: Seed initial data.
- `npm run db:studio`: Open Prisma Studio.

## Deployment

- Vercel: Deploy the Next.js app directly from your repository.
- Neon: Provision a managed PostgreSQL instance and set `DATABASE_URL` in Vercel.
- Environment: Add all required variables in Vercel Project Settings before first deploy.
- Prisma: Run `npx prisma generate` during build (handled by app dependencies) and apply schema changes via `npx prisma db push` or migrations as part of your deployment workflow.
