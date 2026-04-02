import { motion } from 'framer-motion'

const variants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
}

// Checks once if the user prefers reduced motion
const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function PageWrapper({ children }) {
  if (prefersReduced) {
    return <div className="h-full">{children}</div>
  }

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="h-full"
    >
      {children}
    </motion.div>
  )
}
