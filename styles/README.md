# Pixelify Docs — Next.js drop-in kit

A polished, responsive documentation center designed for Pixelify. It includes:
- Landing page with a docs hero, search, featured guides and learning cards
- Dynamic article pages with breadcrumbs, table of contents, previous/next links
- Sidebar navigation with expandable groups
- Search overlay (keyboard shortcut `Ctrl/Cmd + K`)
- Light/dark theme toggle
- Responsive mobile navigation
- Video lesson cards, image/demo placeholders, callouts, steps, tables and code blocks
- Motion effects with Framer Motion

## Target stack
- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- `lucide-react`
- `framer-motion`

## Install dependencies

```bash
npm install lucide-react framer-motion
```

## Add to an existing Next.js project

Copy these folders/files into your project, merging where necessary:

```text
app/docs/                 -> app/docs/
components/pixelify-docs/ -> components/pixelify-docs/
content/pixelify-docs/    -> content/pixelify-docs/
styles/pixelify-docs.css  -> styles/pixelify-docs.css
```

Then import the stylesheet once from your global stylesheet or root layout:

```tsx
import "@/styles/pixelify-docs.css";
```

The package uses Tailwind utility classes. Make sure your `tailwind.config.ts` content globs include:
```ts
"./app/docs/**/*.{js,ts,jsx,tsx,mdx}",
"./components/pixelify-docs/**/*.{js,ts,jsx,tsx,mdx}",
"./content/pixelify-docs/**/*.{js,ts,jsx,tsx,mdx}",
```

If your project uses a `src/` directory, place the folders under `src/` and adjust imports/aliases to match your setup.

## Routes

- `/docs` — documentation home
- `/docs/[slug]` — article page

Included sample slugs:
- `getting-started`
- `background-remover`
- `ai-upscaler`
- `privacy-and-security`
- `models-and-performance`
- `troubleshooting`

## Customize

### Brand
Edit CSS variables in `styles/pixelify-docs.css` (`--px-accent`, `--px-bg`, etc.).

### Navigation and content
Edit `content/pixelify-docs/docs-data.ts`. Add an entry to `articles` and add its slug to a navigation group.

### Videos
Video cards are intentionally configured with `videoUrl: ""` until you provide official Pixelify tutorial URLs. Add a YouTube/Vimeo URL or direct MP4 URL to enable playback. No unofficial or fabricated video links are included.

### Product-specific notes
The included content reflects the Pixelify product details previously described:
- Processing runs locally in the browser; source images are not uploaded to a cloud processing server.
- Background-removal and upscaling model assets may be downloaded and cached by the browser.
- Current stated input limits: 20 MB for Background Remover and 15 MB for Upscaler.
- Export dimensions may reach 16,384 × 16,384 pixels where supported by the selected workflow/device.

Review these limits and capabilities against the current production build before publishing, as product limits can change.

## Notes
This is a self-contained UI/content starter, not a modification of your existing app. It does not replace your root layout, Tailwind config, global styles, or package manifest. Merge the provided files into your project.
