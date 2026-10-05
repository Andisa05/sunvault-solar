# Sunvault Solar

A scroll-driven website for a (fictional) South African solar installer. As you scroll, a pinned canvas plays one day: the street goes dark in loadshedding, panels and a battery are installed, the sun charges the system, and the house stays lit at night.

Built by Andisa Mtshali as a portfolio project.

## Tech

- **Next.js 16** (App Router) + **React 19**
- **GSAP + ScrollTrigger**: pinned section, scrubbed timeline, preloader, reveals, count-ups
- **Lenis**: smooth scrolling, synced to GSAP's ticker
- **Canvas 2D**: the whole scene is drawn in code (`lib/cinema.js`), so there are no images to load
- **next/font**: Sora (display) and Manrope (body)

## Project structure

```
app/
  layout.js        fonts + metadata
  page.js          page sections and package data
  globals.css      all styles (design tokens at the top)
components/
  Motion.js        Lenis + preloader + scroll reveals (client)
  ScrollCinema.js  pinned canvas section driven by ScrollTrigger (client)
  QuoteForm.js     demo quote form (client)
lib/
  cinema.js        draws the scene for any scroll progress 0 → 1, plus the 5 stage captions
preview/
  build-preview.py builds a single-file HTML preview from the same CSS and canvas code
```

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel (free)

1. Create a new GitHub repo called `sunvault-solar` and push this folder:
   ```bash
   git init
   git add .
   git commit -m "Sunvault Solar: scroll-driven site"
   git branch -M main
   git remote add origin https://github.com/Andisa05/sunvault-solar.git
   git push -u origin main
   ```
2. Go to vercel.com, sign in with GitHub, click **Add New → Project**, and import `sunvault-solar`.
3. Keep the default settings (Vercel detects Next.js) and click **Deploy**.
4. You get a live link like `sunvault-solar.vercel.app`. Put it in your portfolio and Fiverr profile.

## Ideas to extend it

- Add a real quote form backend (a Next.js route handler that emails the lead with Resend, or saves it to a database)
- A savings calculator: monthly bill in rand → suggested system and payback period
- Swap the canvas scene for a rendered image sequence (Blender or AI video frames) for a more photographic look
