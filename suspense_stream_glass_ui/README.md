# Suspense Stream Glass UI

A Next.js 16 demo app that combines:

- Streaming UI with Suspense
- Glassmorphism styling with DaisyUI themes
- Pexels API search + photo details
- Infinite scroll on the home feed

## New UI Refresh

The home page now includes a more exciting visual style:

- Neon gradient hero title with "Suspense Stream Glass"
- Animated live status pulse
- Quick query chips (`nature`, `ocean`, `city`, etc.)
- Floating featured section motion
- Stronger section hierarchy ("Featured" + "Latest Results")

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` in the project root:

```bash
PEXELS_API_KEY=your_pexels_api_key
NEXT_PUBLIC_THEME_DEFAULT=glasslight
```

3. Run the development server:

```bash
npm run dev
```

4. Open:

[http://localhost:3000](http://localhost:3000)

## Scripts

- `npm run dev` - Start local development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- DaisyUI v5
- TypeScript
