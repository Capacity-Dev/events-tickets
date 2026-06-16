import { motion } from 'motion/react'
import type { ReactNode } from 'react'

export function SlideUp({
  children,
  className,
  distance = 20,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  distance?: number
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: distance }}
      transition={{ duration: 0.3, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
