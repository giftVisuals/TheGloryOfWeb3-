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
 *  The two entries below are SAMPLE SLOTS that only demonstrate the layout.
 *  They contain no client work. Replace or delete them.
 */
export const projects: Project[] = [
  {
    id: 'sample-featured',
    sample: true,
    title: 'Featured Project',
    category: 'Placeholder',
    role: 'Edit · Motion design',
    description:
      'Placeholder for your strongest landscape piece. Featured projects open the gallery at full cinematic width. Replace this entry in src/content/projects.ts.',
    aspectRatio: '16:9',
    featured: true,
  },
  {
    id: 'sample-vertical',
    sample: true,
    title: 'Vertical Cut',
    category: 'Placeholder',
    role: 'Edit',
    description:
      'Placeholder for a 9:16 social edit. Portrait work keeps its native ratio and is composed beside its story instead of being cropped. Replace this entry in src/content/projects.ts.',
    aspectRatio: '9:16',
  },
]
