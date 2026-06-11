# AGENTS.md

## Project

Personal homepage — Hugo static single-page site with bilingual support (English/French). Deployed at vincent-chalnot.pages.dev. Repository at github.com/VincentChalnot/homepage.

## Build & Dev

```bash
npm install                # Tailwind CSS + PostCSS + Autoprefixer
hugo server -D             # Dev server at localhost:1313
hugo --minify              # Production build → public/
```

- `hugo server` auto-rebuilds on content/layout changes.
- Requires Hugo **extended** edition (for Sass/SCSS compilation).
- Tailwind CSS is compiled via Hugo's asset pipeline (`css.Sass` → `css.PostCSS`), so no separate build step needed during dev.

## Architecture

### Content structure — Headless page bundles

Content files under `content/{en,fr}/` are **headless** (not rendered as standalone pages). Each section (hero, summary, expertise, experience, projects, contact) is a separate `.md` file with YAML front matter.

`layouts/index.html` is the single-page template. It calls `partial "section.html" .` for each content file, which reads front matter and renders HTML.

### Layout pipeline

```
layouts/_default/baseof.html   # <html>, <head>, <body>, <header>, <footer>
  └─ layouts/index.html         # {{ block "main" }} → loops through content sections
       └─ layouts/partials/*.html  # One partial per section
```

### Styles

- Source: `assets/css/main.scss` (Tailwind directives + custom `@layer` components/utilities)
- Pipeline: `<resource>.scss` → `css.Sass` → `css.PostCSS` (Tailwind + Autoprefixer) → `minify` → `fingerprint`
- Theme: Custom PCB-inspired — dark green background (`#030c05`), neon green accents (`#00ff88`), monospace labels
- Fonts: Inter (body), JetBrains Mono (code/labels) — loaded from Google Fonts

### JS

- Source: `assets/js/main.js`
- Pipeline: `js.Build` → `minify` → `fingerprint`
- Function: IntersectionObserver that adds `animate-fade-in` class on scroll

### i18n

- Translations in `i18n/{en,fr}.yaml`
- Used in partials via `{{ i18n "key" }}`
- Language switcher in header toggles between `/en/` and `/fr/`

### Content front matter conventions

Each `<section>.md` has `headless: true` and section-specific YAML keys. Layout partials read front matter with `{{ .Params.field }}` and `.Content` for markdown body.

## Key files

| File                           | Role                                          |
| ------------------------------ | --------------------------------------------- |
| `hugo.yaml`                    | Hugo config, languages, params                |
| `tailwind.config.js`           | Theme colors, fonts, animations               |
| `postcss.config.js`            | PostCSS pipeline (Tailwind + Autoprefixer)    |
| `layouts/_default/baseof.html` | Base HTML shell                               |
| `layouts/index.html`           | Single-page layout, imports all section partials |
| `assets/css/main.scss`         | Tailwind entry point + custom components      |
| `assets/js/main.js`            | Scroll animations                             |
| `content/{en,fr}/*.md`         | All page content (headless)                   |
| `i18n/{en,fr}.yaml`            | UI string translations                        |
| `static/media/`                | Static assets (avatar, PCB pattern SVG)       |

## Constraints

- Content is specific to Vincent Chalnot — do not change names, URLs, links, or job history without asking.
- License is proprietary (see LICENSE.md). Source-available, not open source.
- Bilingual: always mirror content changes across `content/en/` and `content/fr/`.
- The `../media/design` Hugo module mount was removed — all media assets now live in `static/media/`.
- Do NOT commit the `public/` or `resources/` directories (they are gitignored).
- Do NOT mention `static/tools/` — it's an easter egg.
