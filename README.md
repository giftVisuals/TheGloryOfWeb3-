# TheGloryOfWeb3 — Portfolio

A cinematic, monochrome portfolio for **TheGloryOfWeb3**: video editor, motion designer and visual storyteller.

Built with React 19, TypeScript, Vite, Tailwind CSS v4, Motion for React and Lucide icons. It is a static site with no backend, so it can be hosted on Vercel, Netlify, Cloudflare Pages or GitHub Pages.

```bash
npm install
npm run dev        # local development at http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build locally
```

---

## Adding your work

All projects live in **`src/content/projects.ts`**. The gallery, hover previews and full-screen project view are generated from that array, so you never edit layout code to add work.

```ts
{
  id: 'protocol-launch-film',            // unique, URL-safe → link: /#/work/protocol-launch-film
  title: 'Protocol Launch Film',
  category: ['Web3', 'Brand film'],      // one string or several
  role: 'Edit, motion design, sound design',
  description: 'One or two sentences about the brief and the edit.',
  client: 'Brand Name',                  // optional, only if approved for public display
  year: 2025,                            // optional
  thumbnail: 'media/launch-film.jpg',    // poster frame (recommended)
  videoUrl: 'media/launch-film.mp4',     // see "Video sources" below
  previewUrl: 'media/launch-film-preview.mp4', // optional short muted loop for gallery hover
  aspectRatio: '16:9',                   // '16:9', '9:16', '1:1', '4:5', '21:9', ...
  featured: true,                        // optional, full-width at the top of the gallery
  externalUrl: 'https://…',              // optional link (e.g. the live post)
  externalLabel: 'Watch on X',           // optional label for that link
  details: [{ label: 'Duration', value: '1:12' }], // optional extra metadata rows
}
```

| Field | Required | Notes |
| --- | --- | --- |
| `id`, `title`, `category`, `role`, `description` | yes | |
| `videoUrl` | recommended | Without it, the project shows a "video coming soon" card. |
| `thumbnail` | recommended | A JPG or WebP still, about 1600px on the long side and under 300 KB. Paths are relative to `public/`. |
| `aspectRatio` | recommended | Use the video's native ratio. Media is never cropped to fit a template. Defaults to `16:9`. |
| `previewUrl` | optional | A 3–6 s muted loop under about 2 MB. Used only for the gallery hover preview. |
| `hidden: true` | optional | Keeps an entry in the file but off the site. |

**Order in the array = order on the site.** Featured landscape work becomes a full-width frame. Featured or standalone portrait and square work sits beside its description. Everything else is set in rows whose widths follow each video's ratio, so items in a row share one height.

The two entries currently in the file are clearly marked **sample slots** (`sample: true`). They show the layout only and contain no client work. Delete them once your first real projects are in.

### Video sources

`videoUrl` accepts three kinds of links. The site detects which kind it is (`src/lib/media.ts`).

1. **Direct video file (best).** Put files in `public/media/` and reference them as `media/name.mp4`, or use a full `https://…/name.mp4` URL from a CDN or storage bucket. These play in the custom player with play/pause, seek, sound and volume, fullscreen, loading and error states, and gallery hover previews. Use MP4 (H.264 + AAC) for the widest support, optionally with a WebM version.
2. **Google Drive.** Paste the normal share link, e.g. `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`.
3. **YouTube or Vimeo** (unlisted works too). These play through the official embed player.

#### Google Drive: what to know

- A Drive share link opens Google's viewer page. It is **not a video file**, so it cannot feed the custom player. Drive videos play through Drive's own embedded player (`/preview`) instead. That player shows Google's controls, and hover previews aren't available for these projects.
- The file **must** be shared as *General access → Anyone with the link → Viewer*. Otherwise visitors see a Google sign-in or "access denied" screen. Only share videos you are allowed to show publicly.
- Nothing here works around Drive permissions or download restrictions.
- If you leave `thumbnail` empty, the site tries Drive's thumbnail for public files. That endpoint is undocumented and can fail, in which case a generated monochrome title card is shown. **Setting your own `thumbnail` is more reliable.**
- For the best result, export your final edits and upload them as direct files (option 1). Drive works well as a starting point.

> Videos are not verified automatically. After adding a project, open it on the live site in a private browser window to confirm it plays.

### Hero background reel (optional)

In `src/content/site.ts`, set `hero.backgroundVideo` to a short, muted, looping **direct file** (e.g. `media/reel-loop.mp4`, 1080p, under about 6 MB, no audio) and `hero.backgroundPoster` to a still. Drive links cannot be used here. Leave both empty to keep the generated light composition.

---

## Editing the rest of the site

Everything else is in **`src/content/site.ts`**:

- `identity`: name, how the hero wordmark breaks across two lines, roles.
- `hero.statement`: positioning line.
- `about`: statement, short bio, focus list, optional `portrait` (path or URL; leave empty to omit).
- `services`: add, remove or reorder freely. No prices are shown.
- `process`: the four workflow steps.
- `credibility`: testimonials and collaborators. **Disabled and empty by default.** Set `enabled: true` only with real, approved quotes and names.
- `contact`: public email and social links. A link with a `url` opens in a new tab. An entry with only a `handle` (e.g. Discord) copies the username when clicked.

### Contact form

No form is included, because a form without a working backend would pretend to send messages. The site uses a direct email link instead. To add a real form later, use a form service such as Formspree, Basin or Netlify Forms: create a form endpoint, then add a `<form action="…" method="POST">` with validation in `src/components/Contact.tsx`.

---

## Project structure

```
src/
  content/        ← edit these: projects.ts, site.ts
  components/     Nav, Hero, WorkGallery, ProjectCard, ProjectMedia, ProjectDetail,
                  VideoPlayer, About, Services, Process, Credibility, Contact, Footer, Cursor
  motion/         motion tokens (easing, durations, variants) + Reveal / MaskedText
  lib/            media.ts (video-source layer), playback.ts (one-video-at-a-time)
  hooks/          route, focus trap, scroll lock, media queries, active section
  index.css       design tokens (colour, type, radii, shadows, easing) + utilities
```

### Behaviour notes

- **Performance.** Nothing heavier than posters loads up front. Preview videos are created only on hover (desktop) or when mostly in view (touch), with `preload="none"`. They pause off-screen, and only one runs at a time. Opening a project pauses every preview. The project view and player are code-split. Previews are skipped on Data Saver and 2G connections.
- **Embeds** load only after the visitor presses play, so Drive, YouTube and Vimeo add no weight to the page until then.
- **Accessibility.** Semantic landmarks, a skip link, visible focus states, a keyboard-operable menu and project dialog (focus trap, <kbd>Esc</kbd>), and player shortcuts (<kbd>Space</kbd>/<kbd>K</kbd> play, <kbd>M</kbd> mute, <kbd>F</kbd> fullscreen, <kbd>←</kbd>/<kbd>→</kbd> seek). Reduced-motion preferences disable parallax, ambient motion, the cursor label and the scroll-linked effects.
- **Deep links.** Every project has a shareable URL (`/#/work/<id>`), and the browser back button closes the project view.
- **Deployment.** `vite.config.ts` uses `base: './'`, so the build works at a domain root or under a sub-path (e.g. GitHub Pages) without changes.
