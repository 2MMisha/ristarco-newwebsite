# Rising Star Manager — ristar.co

A trilingual (English / Hebrew / Russian) Jekyll site for RSM, built to deploy
on GitHub Pages via GitHub Actions. Landing page, About, Contact, and a
Gallery of competitions (upcoming/past), each with its own Registration,
Schedule, and Results pages.

## 1. Put this on GitHub

1. Create a new **public** repository (e.g. `ristar-site`).
2. Push everything in this folder to it (`main` branch).
3. In the repo, go to **Settings → Pages**, and under "Build and deployment"
   set **Source** to **GitHub Actions**. (Not "Deploy from a branch" — the
   included workflow at `.github/workflows/deploy.yml` handles the build.)
4. Push to `main` (or run the workflow manually from the Actions tab) — the
   site builds and deploys automatically. Check the **Actions** tab if
   something fails; the log will show the Jekyll build error directly.

## 2. Point ristar.co at it

A `CNAME` file with `ristar.co` is already included, which is what GitHub
Pages needs. On your domain's DNS:

- Add an **A record** for `ristar.co` pointing to GitHub Pages' IPs:
  `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- Add a **CNAME record** for `www` pointing to `<your-github-username>.github.io`
- Back in **Settings → Pages**, enter `ristar.co` as the custom domain and
  enable **Enforce HTTPS** once GitHub finishes issuing the certificate.

## 3. Adding a new competition

Everything about a competition lives in **one JSON file** in `_data/events/`.
Copy an existing one (e.g. `_data/events/summer-cup-2026.json`), rename it,
and edit the fields:

```json
{
  "id": "your-event-id",              // used in URLs — keep it short, no spaces
  "date": "2027-05-01",               // YYYY-MM-DD — controls Upcoming vs Past
  "date_end": "2027-05-02",
  "google_form_url": "https://forms.gle/...",
  "translations": {
    "en": { "name": "...", "location": "...", "description": "...", "sponsors": ["..."], "regulations": "..." },
    "he": { ... },
    "ru": { ... }
  }
}
```

That's it — the site automatically generates, **in all three languages**:

- `/​<lang>​/events/<id>/` — overview (description, sponsors, regulations)
- `/​<lang>​/events/<id>/registration/` — embeds your Google Form
- `/​<lang>​/events/<id>/schedule/` — shows a "coming soon" placeholder until
  you add a `"schedule"` string field inside a language's translation block
- `/​<lang>​/events/<id>/results/` — links to `/results/<id>/`

It also appears automatically on the Gallery page, sorted into Upcoming or
Past based on today's date vs. `"date"`.

No template files to touch, no page to create by hand — just the JSON.

## 4. Publishing results

Your results program exports a folder (an `index.html` plus one page per
category). For each competition:

1. Take the exported folder.
2. Rename it to match that event's `"id"` from its JSON file.
3. Drop it into `/results/` in this repo, replacing the placeholder folder
   of the same name (or creating a new one for a new event).
4. Commit and push. The event's "Results" tab already links to
   `/results/<id>/` — nothing else to configure.

Each `results/<id>/` folder currently contains a placeholder `index.html`
explaining this — delete it and replace with your export.

## 5. Registration

Registration uses **Google Forms** (set to be free and require no backend).
For each event:

1. Create a Google Form for that competition.
2. Get its embed/share URL and put it in `"google_form_url"` in the event's
   JSON file.
3. The registration page embeds it directly, plus an "open in new tab" link
   as a fallback for anyone whose browser blocks the embed.

Form responses land in the Form's linked Google Sheet as usual — this site
doesn't touch that data.

## 6. Editing About / Contact / branding

- `en/about.md`, `he/about.md`, `ru/about.md` — About Us content. Each file
  has an HTML comment at the top listing suggested sections; replace the
  placeholder text below it with real copy. Do this for all three language
  files (they are independent, not auto-translated).
- `en/contact.md`, `he/contact.md`, `ru/contact.md` — same idea for Contact.
- `_config.yml` → `org:` block — email, phone, address, social links. The
  email is already wired into the footer on every page.
- `assets/css/main.css` — brand colors/fonts are CSS custom properties at
  the very top of the file (`--rsm-blue`, `--rsm-accent`, `--font-display`,
  `--font-body`, etc.) — change them there and they apply everywhere.
- Fonts currently used: **Montserrat** and **Arimo** as specified, loaded
  from Google Fonts. Neither has Hebrew glyphs, so Hebrew pages fall back to
  **Rubik** (also loaded from Google Fonts) so Hebrew text still renders
  properly — swap this if you have a preferred Hebrew typeface.

## 7. The "product" (your platform) section

Currently a single "coming soon" teaser block on the homepage
(`_layouts/home.html` + the `product_*` strings in `_data/ui.yml`). When
you're ready to build it out into a full page, that's the place to expand.

## 8. Local preview (optional)

Requires Ruby installed locally:

```bash
bundle install
bundle exec jekyll serve
```

Then open `http://localhost:4000`. Not required — GitHub Actions builds it
for you on every push — but useful for checking changes before pushing.

## 9. Logo, contacts, and the "Get a quote" CTAs

- **Logo**: `assets/img/logo.png` currently holds a placeholder "RSM" wordmark
  (white, transparent background). Replace that file with your real white
  logo.png (same filename) once you have it — no template changes needed.
- **Contacts**: phone, WhatsApp, both emails, and Instagram are all set in
  `_config.yml` under `org:`. They render via `_includes/contact-links.html`,
  used in the footer (every page), the Contact page, and — for the
  registration email specifically — under each event's Registration tab.
- **Accent color**: `--rsm-accent` (coral, used for buttons/CTAs) is now
  separate from `--rsm-soon` (yellow, used *only* for the "SOON" badge on
  the platform teaser) — both are CSS variables at the top of
  `assets/css/main.css`.
- **"Get a quote" CTAs**: the homepage hero has a second button, the
  platform section describes the actual features (registration, event
  landing pages, the three scoring systems, multiplatform), followed by a
  full-width "Ready to run your competition with us?" CTA — and the same
  CTA pattern repeats at the bottom of the Gallery page. All the copy for
  these lives in `_data/ui.yml` (`quote_*` and `gallery_cta_*` keys) if you
  want to adjust the wording.

## 10. Ideas worth considering next

A few things that would strengthen the site as it grows, in rough order of impact:

- **A real contact form** (not just mailto/wa.me links) on the Contact page — e.g. a
  Formspree or Google Form embed like the one already used for event registration,
  so quote requests land in your inbox with structured info (event size, date,
  scoring type needed) instead of a blank email.
- **Photos** — the events currently have no image gallery; even 3–5 photos per past
  competition would make the Gallery page and each event's overview page far more
  convincing to a prospective organizer.
- **Testimonials / past organizers** — a short quote or logo from a past sponsor or
  partner organization on the homepage would reinforce the "we already run real
  competitions" pitch that the platform section is making.
- **Sitemap already handled** — `jekyll-sitemap` is wired in, so once the domain is
  live, submit `https://ristar.co/sitemap.xml` to Google Search Console for each
  language to get indexed faster.
- **Analytics** — nothing is tracking visits yet; a privacy-friendly option (e.g.
  Plausible or Simple Analytics) would tell you which language/page people actually
  convert from before you invest more in copy.
- **A short "for organizers" paragraph** on the Contact page, distinct from the
  competitor-facing contact info — since the platform pitch and the
  "join our competition" audience are different people asking for different things.

## 11. Logo (SVG), favicon, animations, accessibility widget

- **Logo**: now `assets/img/logo.svg` (your uploaded file), shown at 32px
  tall in the header — swap the file to update it, no template changes.
- **Favicon**: `assets/img/icon.ico` (your uploaded file) is wired into
  every page's `<head>` and shows in browser tabs and link previews.
- **Animations**: subtle only — the hero fades/rises in on load, and
  sections/cards gently reveal as you scroll to them. Fully respects
  `prefers-reduced-motion`, and content is visible even with JavaScript
  disabled (animation is progressive enhancement, not a requirement to see
  anything). Logic in `assets/js/animations.js`.
- **Accessibility widget**: a small self-built, free, no-tracking widget —
  the floating button bottom-right on every page (`_includes/a11y-widget.html`,
  `assets/js/a11y-widget.js`). Lets visitors adjust text size, toggle high
  contrast, underline links, switch to a plain readable font, and reduce
  motion — preferences are saved in their browser (`localStorage`), not sent
  anywhere. No third-party service, so no monthly cost and no external
  script loading on your site.

## 12. Accessibility widget: TabNav

Replaced the earlier self-built widget with the TabNav script, loaded on
every page via `_layouts/default.html`. Its language and side (`right`
normally, `left` for Hebrew) switch automatically per page — nothing to
configure per-page. To change the color, size, or position, edit the
`tnv-data-config` JSON directly in `_layouts/default.html`.

## 13. Legal pages (law.ristar.co)

The footer now links to `https://law.ristar.co/#privacy`, `#terms`, and
`#accessibility` on every page (`_includes/footer.html`). If those anchor
IDs on that site ever change, update the three URLs there.

## 14. Logos

- `assets/img/logo-LTR.svg` — used in the header for English and Russian.
- `assets/img/logo-RTL.svg` — used in the header for Hebrew (icon/wordmark
  order mirrored). The switch is automatic, based on the page's language.
- `assets/img/by2m.svg` — the "by 2M Media" credit mark, shown in the footer
  next to the copyright line.
- `assets/img/icon-blue.svg` / `icon-white.svg` — standalone icon-only marks
  (no wordmark) included for future use (e.g. social preview image) but not
  currently wired into any template.

## 15. Platform & Features (now two sections)

The homepage now separates "the platform is coming soon" (short, badge +
headline) from "what it does" — a dedicated Features section with an icon
per feature (Registration, Event landing page, Scoring systems, Multiplatform)
in `_layouts/home.html`. Copy lives in `_data/ui.yml` under `feature_*` and
`features_title`.

## Project structure

```
_config.yml          site settings, org info, language list
_data/ui.yml          all UI text (nav, buttons, labels) in en/he/ru
_data/events/*.json    one file per competition — the only file you touch
                        to add/edit a competition
_plugins/events_generator.rb
                      turns each event JSON into pages, in every language
_layouts/             page templates (home, about/contact, event, gallery)
_includes/            header, footer, language switcher, <head>
en/ he/ ru/            About/Contact/Home content per language
assets/css/main.css    all styling — brand colors/fonts at the top
results/<id>/          where you drop your exported results per competition
```
