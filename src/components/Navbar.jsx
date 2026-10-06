import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

function goTo(id) {
  const el = document.getElementById(id)
  if (!el) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
}

const LINKS = [
  { id: '/', label: 'Home', external: true },
  { id: 'topics', label: 'Topics' },
  { id: 'how-it-works', label: 'How It Works' },
]

export function PhpBadge({ size = 34 }) {
  return (
    <svg viewBox="0 0 64 40" width={size} height={size * 0.625} aria-hidden="true">
      <ellipse cx="32" cy="20" rx="31" ry="19" fill="#7748E6" />
      <text x="32" y="26.5" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="17" fontWeight="700" fontStyle="italic" fill="#fff">php</text>
    </svg>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const reduced = useReducedMotion()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const nav = (link) => {
    setMenuOpen(false)
    if (link.external) navigate(link.id)
    else goTo(link.id)
  }

  return (
    <motion.header
      className={`nav ${scrolled || menuOpen ? 'nav--scrolled' : ''}`}
      initial={reduced ? false : { y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="nav__inner">
        <button type="button" className="nav__brand" onClick={() => navigate('/')} aria-label="Back to the animated home page">
          <PhpBadge />
          <span>PHP <i className="nav__dot">•</i> MySQLi</span>
        </button>

        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((l) => (
            <button key={l.id} type="button" className="nav__link" onClick={() => nav(l)}>
              {l.label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          className={`nav__burger ${menuOpen ? 'is-open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <i /><i /><i />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="nav__sheet"
            aria-label="Mobile"
            initial={reduced ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
          >
            {LINKS.map((l) => (
              <button key={l.id} type="button" className="nav__sheet-link" onClick={() => nav(l)}>
                {l.label}
              </button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
