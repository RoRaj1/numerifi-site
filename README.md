# Numerifi

A static, no-build website for Numerifi — AI-Powered Investing for Students.

## Files

- `index.html` — Home
- `courses.html` — Courses (quiz + course cards)
- `workshops.html` — Workshops (flagship section, booking form)
- `forum.html` — Discussion Forum (announcements + FAQ)
- `careers.html` — Career Paths (placeholder)
- `donate.html` — Donate
- `about.html` — About (mission + sponsor placeholder)
- `styles.css` — shared stylesheet
- `script.js` — shared nav/dropdown/FAQ/form behavior

No build tools, no dependencies — just plain HTML/CSS/JS. You can open `index.html` directly in a browser to preview it locally.

## Push to GitHub

```bash
cd numerifi-site
git init
git add .
git commit -m "Initial Numerifi site"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## Deploy — pick one

**Vercel**
1. Go to vercel.com → New Project → import your GitHub repo.
2. Framework preset: "Other" (no build command needed).
3. Deploy. Done — you'll get a `*.vercel.app` URL, with a custom domain option later.

**Netlify**
1. Go to app.netlify.com → Add new site → Import an existing project → connect GitHub repo.
2. Leave the build command blank, set publish directory to `/` (repo root).
3. Deploy. You'll get a `*.netlify.app` URL.

**Cloudflare Pages**
1. Go to the Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git.
2. Select the repo. Build command: none. Build output directory: `/`.
3. Deploy. You'll get a `*.pages.dev` URL.

All three are free for a static site like this, and all three support connecting a custom domain later (e.g. numerifi.com) under their project settings.

## Things to connect before launch

- **Workshop booking form** (`workshops.html`) and **Forum question form** (`forum.html`) currently just show a placeholder confirmation. Connect them to a real backend — Google Forms embed, Netlify Forms (just add a `netlify` attribute to the `<form>` tag if hosting there), or Formspree.
- **Quiz/course links** (`courses.html`) — replace the `#` placeholder links with your actual quiz and course URLs.
- **Donate button** (`donate.html`) — link to your real fundraising platform.
- **Sponsor placeholders** (`index.html`, `about.html`) — swap in your financial partner's logo and endorsement once confirmed.
- **Social links** (footer, every page) — replace the `#` placeholders with real Instagram/TikTok/LinkedIn URLs.
