import { motion, useScroll, useSpring } from 'motion/react'

/** Hairline reading-progress indicator along the top edge. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })
  return <motion.div aria-hidden className="fixed inset-x-0 top-0 z-[55] h-px origin-left bg-gradient-to-r from-white/30 via-paper to-white/30" style={{ scaleX }} />
}
