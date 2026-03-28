# Ecodometer

A fuel tracking app for logging fill-ups, calculating MPG, and monitoring vehicle efficiency over time.

## Features

- **Track fill-ups** — log odometer miles, gallons, date, and an optional note for each refuel
- **MPG calculations** — lifetime average and per-fill-up fuel economy displayed on each card
- **Odometer OCR** — tap the camera button on the miles field to photograph your odometer and auto-fill the reading using AI (powered by Groq / Llama 4)
- **Multiple vehicles** — manage separate tracking for each vehicle
- **Auth** — sign in with Clerk; each user's data is private

## Stack

- [Next.js](https://nextjs.org) (App Router, Server Actions)
- [Clerk](https://clerk.com) for authentication
- [Prisma](https://www.prisma.io) + PostgreSQL
- [Groq](https://console.groq.com) (Llama 4 vision) for odometer OCR
- [DaisyUI](https://daisyui.com) + Tailwind CSS

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file:

```
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...

# Database
DATABASE_URL=...

# Groq (free at console.groq.com)
GROQ_API_KEY=...
```

### 3. Run database migrations

```bash
npx prisma migrate dev
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

Deployed on Netlify. Set the environment variables above in your Netlify site settings as secret environment variables.
