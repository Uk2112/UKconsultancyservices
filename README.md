# CONSULTUTK Website

Static marketing website for **CONSULTUTK** — a multi-disciplinary engineering platform
(Industry Solutions + Engineering Academy + Innovation Platform).

_"Empowering Industry. Mentoring Engineers. Building the Future."_

## Files
| File | Purpose |
|------|---------|
| `index.html` | Single-page site (hero, pillars, solutions, academy, industries, case studies, insights, contact) |
| `styles.css` | All styling (navy / teal / orange brand palette, Montserrat + Poppins + Raleway) |
| `script.js` | Sticky nav, mobile menu, scroll reveals, animated stat counters, contact form |
| `.nojekyll` | Tells GitHub Pages to serve files as-is |

No build step and no dependencies — fonts load from Google Fonts.

## Host on GitHub Pages

1. Create a new repository on GitHub (e.g. `consultutk-site`).
2. Upload all files (`index.html`, `styles.css`, `script.js`, `.nojekyll`) to the repo root.
   ```bash
   git init
   git add .
   git commit -m "Initial CONSULTUTK website"
   git branch -M main
   git remote add origin https://github.com/<your-username>/consultutk-site.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Select branch **main** and folder **/ (root)**, then **Save**.
6. Your site goes live at `https://<your-username>.github.io/consultutk-site/` within a minute or two.

### Using your custom domain (consultutk.in)
1. Add a file named `CNAME` (no extension) to the repo root containing:
   ```
   consultutk.in
   ```
2. At your domain registrar, point the domain to GitHub Pages:
   - **A records** for `consultutk.in` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - **CNAME record** for `www` → `<your-username>.github.io`
3. In **Settings → Pages**, enter the custom domain and enable **Enforce HTTPS**.

## Making it real
- **Contact form:** the form is front-end only. To receive submissions for free, wrap it with [Formspree](https://formspree.io): set `<form action="https://formspree.io/f/XXXX" method="POST">` and remove the demo handler in `script.js`.
- **Images:** case-study and blog thumbnails use gradient placeholders. Drop real photos into an `images/` folder and swap the `.case-thumb` / `.blog-thumb` backgrounds in `styles.css`.
- **Logo:** the wordmark is an inline SVG. Replace the `.brand-mark` SVG if you finalize a different logo file.
- **Content:** edit text directly in `index.html` — sections are clearly commented.
