# Vinvent Chalnot — Personal Homepage

[![Hugo](https://img.shields.io/badge/Hugo-0.140%2B-FF4088?logo=hugo)](https://gohugo.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](#license)

> The source code is publicly visible but **not** open source. You may not copy, reuse, or redistribute any part of this repository — including content, design, and personal data.

Single-page bilingual homepage built with [Hugo](https://gohugo.io) and [Tailwind CSS](https://tailwindcss.com), deployed at **[vincent.chalnot.fr](https://vincent.chalnot.fr)**.

## Overview

A Hugo static site that renders a single scrollable page with the following sections: Hero, About, Expertise, Experience, Projects, and Contact. All content is managed as headless page bundles under `content/` and composed into a single view via `layouts/index.html`.

Each section is defined once per language (`content/en/` and `content/fr/`) under its own markdown file with YAML front matter. The layout partials under `layouts/partials/` read that front matter to render the corresponding section. Translation strings live in `i18n/`.

## Tech Stack

| Layer        | Choices                                      |
| ------------ | -------------------------------------------- |
| **SSG**      | Hugo (static site generator)                 |
| **Styling**  | Tailwind CSS 3 + PostCSS + Autoprefixer      |
| **Fonts**    | Inter (body), JetBrains Mono (code/labels)   |
| **JS**       | Vanilla (IntersectionObserver for scroll animations) |
| **Theme**    | Custom PCB-inspired design — dark green, neon accents |

## Getting Started

### Prerequisites

- [Hugo](https://gohugo.io/installation/) (extended edition)
- [Node.js](https://nodejs.org/)

### Development

```bash
# Install dependencies
npm install

# Start Hugo dev server (with drafts)
hugo server -D

# Build for production
hugo --minify
```

The site will be available at `http://localhost:1313`. Hugo's dev server includes live reload for both content and layout changes.

## Project Structure

```
.
├── assets/
│   ├── css/main.scss             # Tailwind directives + custom components
│   └── js/main.js                # Scroll-triggered fade-in animations
├── content/
│   ├── en/                       # English content
│   │   ├── _index.md
│   │   ├── hero.md               # Name, title, tagline, social links
│   │   ├── summary.md            # Bio/intro text
│   │   ├── expertise.md          # Skills & competencies
│   │   ├── experience.md         # Work history
│   │   ├── projects.md           # Portfolio pieces
│   │   └── contact.md            # Contact links + call to action
│   └── fr/                       # French content (mirror structure)
├── i18n/
│   ├── en.yaml                   # English UI strings
│   └── fr.yaml                   # French UI strings
├── layouts/
│   ├── _default/baseof.html      # Base template (<head>, header, footer)
│   ├── index.html                # Single-page layout (imports all sections)
│   └── partials/                 # One partial per section + chrome
├── static/
│   └── media/                    # Checked-in media (avif, webp, svg)
├── hugo.yaml                     # Hugo configuration
├── tailwind.config.js             # Tailwind theme config
└── postcss.config.js             # PostCSS pipeline
```

## Architecture Decision — Headless Content

Content is stored as Hugo headless page bundles — markdown files that are not rendered as standalone pages. This allows each section's content to remain in a version-controlled markdown file with structured front matter, while the layout partial reads that front matter and assembles it into the single-page design. The result is clean content editing with full control over markup.

## Content Generation

All content on this page is original. During development, some initial content was generated with LLM assistance and later refined by the author to match professional experience. The final text is human-authored and factually accurate.

## License

This repository is source-available but proprietary. The code is publicly visible; you may not copy, reuse, or redistribute any part of it — including content, design, and personal data.
