import { AnimatePresence, MotionConfig } from 'motion/react'
import { lazy, Suspense } from 'react'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Credibility } from './components/Credibility'
import { Cursor } from './components/Cursor'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { Process } from './components/Process'
import { Services } from './components/Services'
import { WorkGallery } from './components/WorkGallery'
import { projects as allProjects } from './content/projects'
import { useProjectRoute } from './hooks/useProjectRoute'

// The detail view + player only download when a project is opened.
const ProjectDetail = lazy(() => import('./components/ProjectDetail'))

const projects = allProjects.filter((p) => !p.hidden)

export default function App() {
  const { activeId, open, close } = useProjectRoute()
  const active = projects.find((p) => p.id === activeId) ?? null

  return (
    <MotionConfig reducedMotion="user">
      <div className="grain">
        <a href="#work" className="sr-only z-[100] rounded-full bg-paper px-4 py-2 text-ink-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Skip to work
        </a>
        <Nav />
        <main>
          <Hero />
          <WorkGallery projects={projects} onOpen={open} />
          <About />
          <Services />
          <Process />
          <Credibility />
          <Contact />
        </main>
        <Footer />
        <Cursor />

        <Suspense fallback={null}>
          <AnimatePresence>
            {active && <ProjectDetail key="detail" project={active} projects={projects} onClose={close} onNavigate={open} />}
          </AnimatePresence>
        </Suspense>
      </div>
    </MotionConfig>
  )
}
