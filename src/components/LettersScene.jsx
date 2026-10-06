import { motion } from 'framer-motion'
import { Boy, Girl, Bud } from './Characters.jsx'

// ============================================================
//  LettersScene — the SVG/CSS fallback composition: three cartoon
//  kids with giant P-H-P letters. Used when the video cannot be
//  scrubbed (unsupported / failed) and as the /learn page mascot.
// ============================================================

const letterVariants = {
  hidden: (i) => ({ opacity: 0, x: [-70, 0, 70][i], y: i === 1 ? -70 : 0, scale: 0.9 }),
  show: (i) => ({
    opacity: 1, x: 0, y: 0, scale: 1,
    transition: { delay: 0.15 + i * 0.14, type: 'spring', stiffness: 120, damping: 13 },
  }),
}

const kidVariants = {
  hidden: { opacity: 0, y: 24 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.5 + i * 0.18, type: 'spring', stiffness: 140, damping: 15 } }),
}

export default function LettersScene({ compact = false, animated = true }) {
  const anim = animated ? 'show' : false
  return (
    <motion.div
      className={`letters-scene ${compact ? 'letters-scene--compact' : ''}`}
      initial={animated ? 'hidden' : false}
      animate={anim}
      viewport={{ once: true }}
      aria-label="Three cartoon characters with the letters P, H and P"
    >
      <motion.span className="letters-scene__kid" custom={0} variants={animated ? kidVariants : undefined}>
        <Boy mood="strain" />
      </motion.span>
      <motion.b className="letters-scene__letter letters-scene__letter--coral" custom={0} variants={animated ? letterVariants : undefined}>P</motion.b>
      <span className="letters-scene__h">
        <motion.span className="letters-scene__kid letters-scene__kid--top" custom={1} variants={animated ? kidVariants : undefined}>
          <Bud mood="strain" />
        </motion.span>
        <motion.b className="letters-scene__letter letters-scene__letter--blue" custom={1} variants={animated ? letterVariants : undefined}>H</motion.b>
      </span>
      <motion.b className="letters-scene__letter letters-scene__letter--violet" custom={2} variants={animated ? letterVariants : undefined}>P</motion.b>
      <motion.span className="letters-scene__kid" custom={1} variants={animated ? kidVariants : undefined}>
        <Girl />
      </motion.span>
    </motion.div>
  )
}
