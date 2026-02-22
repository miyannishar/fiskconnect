# FiskConnect

A Next.js 14 (App Router) + Supabase platform connecting Fisk University students, alumni, and administration. Role is determined by email domain at signup.

https://github.com/user-attachments/assets/077af60d-1472-4cd3-bd79-91c8232f43d3


## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Supabase (Auth, Database, RLS)
- **State:** React Context (Auth)

## Setup

1. **Environment:** Copy `.env.example` to `.env.local` and set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SECRET_KEY`

2. **Database:** The schema and RLS policies are applied via Supabase migrations. Ensure your Supabase project has run the migrations.

3. **Run:**
   ```bash
   npm install
   npm run dev
   ```

4. **Seed data (optional):** After at least one user has signed up with an **alumni** email (`@alum.fisk.edu`) and completed onboarding, run the SQL in `scripts/seed.sql` in the Supabase SQL Editor to add sample opportunities, announcements, events, and donations.

## Roles

- **Student:** `@my.fisk.edu`
- **Alumni:** `@alum.fisk.edu` (must complete onboarding)
- **Admin:** `@fisk.edu`

## Routes

- `/` — Landing
- `/login`, `/signup` — Auth
- `/student/*` — Student dashboard, opportunities, find alumni
- `/alumni/*` — Alumni dashboard, onboarding, opportunities, announcements, donate, events
- `/admin/*` — Admin dashboard, manage opportunities, announcements, events, donations, users

Built with care at Future Fisk Hackathon 2026.
