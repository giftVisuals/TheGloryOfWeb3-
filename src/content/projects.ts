import type { Project } from '../types'

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  PROJECT LIBRARY — the only file you need to edit to add or change work.
 * ─────────────────────────────────────────────────────────────────────────
 *
 *  The gallery, the hover previews and the full-screen project view are all
 *  generated from this array. Order here = order on the site.
 *
 *  Minimum fields:  id, title, category, role, description
 *  Recommended:     videoUrl, thumbnail, aspectRatio
 *
 *  videoUrl accepts:
 *   • a direct video file  → "media/my-edit.mp4" (file in /public/media) or "https://…/edit.mp4"
 *       Plays in the custom player with full controls. Best quality & experience.
 *   • a Google Drive link  → "https://drive.google.com/file/d/<FILE_ID>/view?usp=sharing"
 *       Plays through Google's embedded player. The file MUST be shared as
 *       "Anyone with the link → Viewer", or visitors will see a Google sign-in wall.
 *   • a YouTube or Vimeo link (including unlisted) → embedded player.
 *
 *  thumbnail: a still frame (JPG/WebP, ~1600px on the long side, <300 KB).
 *  If left empty, Drive/YouTube links try to use the host's own thumbnail,
 *  otherwise a generated monochrome title card is shown.
 *
 *  See README.md → "Adding your work" for the full walkthrough.
 *
 */
export const projects: Project[] = [
  {
    id: 'trading-platform-product-film',
    title: 'Trading Platform Launch Film',
    category: ['Web3', 'Product video', 'Motion graphics'],
    role: 'Edit · Motion design · 3D animation · Sound design · Music · Voiceover',
    description:
      'A 60-second launch film for a Polymarket trading-automation platform. Every feature — copy trading, LP automation, Autobond, multi-wallet strategies, perps and combos — gets its own chapter, built from kinetic headlines, animated counters, live-feeling UI motion and a glowing 3D wireframe temple, all carried by original voiceover, music and sound design.',
    year: 2026,
    thumbnail: 'media/trading-platform-thumb.jpg',
    previewUrl: 'media/trading-platform-preview.mp4',
    previewWebmUrl: 'media/trading-platform-preview.webm',
    videoUrl: 'https://drive.google.com/file/d/1871mjNV8y4gWkujDplfXCzhaEg5lhxvu/view?usp=drivesdk',
    aspectRatio: '16:9',
    featured: true,
    externalUrl: 'https://x.com/olympusappX/status/2108161616722497859',
    externalLabel: 'Watch the post on X',
    details: [{ label: 'Duration', value: '1:02' }],
  },
]
