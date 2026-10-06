import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { lessons } from '../data/lessons.js'

function goTo(id) {
  const el = document.getElementById(id)
  if (!el) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
}

export default function FloatingTopics() {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [open])

  return (
    <div className="floatopics" ref={wrapRef}>
      <AnimatePresence>
        {open && (
          <motion.nav
            className="floatopics__panel"
            aria-label="All topics"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 240, damping: 24 }}
          >
            <span className="floatopics__title">Jump to a topic</span>
            <div className="floatopics__list">
              {lessons.map((l, i) => (
                <motion.button
                  key={l.id}
                  type="button"
                  className={`floatopics__item floatopics__item--${['coral', 'blue', 'violet'][i % 3]}`}
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * i }}
                  onClick={() => { setOpen(false); goTo(`topic-${l.id}`) }}
                >
                  <b>{l.num}</b> {l.title}
                </motion.button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        className="floatopics__btn"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
      >
        {open ? 'Close ✕' : 'Explore Topics →'}
      </motion.button>
    </div>
  )
}
