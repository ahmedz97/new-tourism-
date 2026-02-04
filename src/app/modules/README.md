# Modules Structure

This directory contains routing modules for organizing application routes.

## Auth Module (`auth/`)

Contains authentication-related routes:
- `/auth/login` - Login page
- `/auth/signup` - Sign up page
- `/auth/forget-password` - Forget password page

**Legacy routes (redirects):**
- `/login` → `/auth/login`
- `/signup` → `/auth/signup`
- `/forgetPassword` → `/auth/forget-password`

## Data Module (`data/`)

Contains data-related routes:
- `/data/blog` - Blog listing page
- `/data/blog/:slug` - Blog details page
- `/data/tour` - Tour listing page
- `/data/tour/:slug` - Tour details page
- `/data/destination` - Destination listing page
- `/data/destination/:slug` - Destination details page

**Legacy routes (redirects):**
- `/blog` → `/data/blog`
- `/blog/:slug` → Works directly (no redirect needed)
- `/tour` → `/data/tour`
- `/tour/:slug` → Works directly (no redirect needed)
- `/destination` → `/data/destination`
- `/destination/:slug` → Works directly (no redirect needed)

## Usage

Routes are imported in `app.routes.ts` and used with lazy loading for better performance.

