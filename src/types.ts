/** Aspect ratio written as "width:height", e.g. "16:9", "9:16", "1:1", "4:5". */
export type AspectRatio = `${number}:${number}`

export interface ProjectDetail {
  label: string
  value: string
}

export interface Project {
  /** Unique, URL-safe id. Used in the project link: #/work/<id> */
  id: string
  title: string
  /** One category or several, e.g. "Motion graphics" or ["Web3", "Explainer video"]. */
  category: string | string[]
  /** One or two sentences about the brief, the edit and the outcome. */
  description: string
  /** Your role on the project, e.g. "Edit, motion design, sound design". */
  role: string
  /** Only add a client or brand that has approved public display. */
  client?: string
  year?: string | number
  /** Poster / thumbnail image. Path inside /public (e.g. "media/foo.jpg") or a full URL. */
  thumbnail?: string
  /** Main video: direct file (.mp4/.webm), Google Drive, YouTube or Vimeo link. See README. */
  videoUrl?: string
  /** Optional short, lightweight clip used for the hover preview in the gallery (direct file only). */
  previewUrl?: string
  /** Optional WebM copy of the preview. Browsers pick whichever format they support. */
  previewWebmUrl?: string
  /** Native ratio of the video. Defaults to "16:9". Thumbnails are never cropped to fit a template. */
  aspectRatio?: AspectRatio
  /** Featured projects are presented full-width at the top of the gallery. */
  featured?: boolean
  externalUrl?: string
  /** Label for the external link. Defaults to "View project". */
  externalLabel?: string
  /** Any extra metadata rows, e.g. { label: "Duration", value: "0:45" }. */
  details?: ProjectDetail[]
  /** Marks a layout demonstration slot. Rendered with a visible "Sample" label. Delete once real work is added. */
  sample?: boolean
  /** Work made with generative AI (e.g. AI UGC with synthetic people). Shows an "AI-generated" label. */
  aiGenerated?: boolean
  /** Keep a project in the file but out of the public site. */
  hidden?: boolean
}

export interface Service {
  title: string
  description: string
  /** Optional delivery-time tag shown beside the title, e.g. "Under 2 hrs". */
  turnaround?: string
}

export interface Package {
  name: string
  /** Who it is for, one short line. */
  bestFor: string
  length: string
  turnaround: string
  includes: string[]
}

export interface Faq {
  q: string
  a: string
}

export interface Turnaround {
  /** Upper bound in hours; animated as "< N hrs". */
  hours: number
  service: string
  detail?: string
}

export interface ProcessStep {
  title: string
  description: string
}

export interface Testimonial {
  quote: string
  name: string
  /** Role and company, only as approved by the person quoted. */
  role?: string
  url?: string
}

export interface ContactLink {
  label: string
  /** Profile URL. Leave out for usernames without a public link (e.g. Discord): the handle is copied on click instead. */
  url?: string
  /** Shown next to the label, e.g. "@handle". Required when there is no url. */
  handle?: string
}
