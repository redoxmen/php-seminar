import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { team } from '../data/team.js'
import { Avatar, boyHair, girlHair, budHair } from './Characters.jsx'

const HAIRS = { boy: boyHair, girl: girlHair, bud: budHair }

// Edit team members in src/data/team.js — one single structure.

export default function TeamModal({ open, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="tmodal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
        >
          <motion.div
            className="tmodal__card"
            role="dialog"
            aria-modal="true"
            aria-label="Meet the team"
            initial={{ opacity: 0, y: 34, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 210, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="tmodal__head">
              <h3>Meet the Team</h3>
              <button ref={closeRef} type="button" className="tmodal__close" onClick={onClose} aria-label="Close team modal">
                ✕
              </button>
            </header>
            <div className="tmodal__grid">
              {team.map((m, i) => (
                <motion.article
                  key={m.id}
                  className="tcard"
                  style={{ '--accent': m.color }}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.09, type: 'spring', stiffness: 180, damping: 20 }}
                  whileHover={{ y: -6 }}
                >
                  <span className="tcard__avatar" style={{ background: `${m.color}1A` }}>
                    <Avatar hair={HAIRS[m.avatar] || boyHair} shirt={m.color} />
                  </span>
                  <h4>{m.name}</h4>
                  <span className="tcard__role">{m.role}</span>
                  <p>{m.about}</p>
                </motion.article>
              ))}
            </div>
            <p className="tmodal__hint">Names are placeholders — edit them in <code>src/data/team.js</code>.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
