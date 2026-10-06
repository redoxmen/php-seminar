import { memo, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PhpBadge } from './Navbar.jsx'

// ============================================================
//  MainNavbar — the minimal floating navbar of the HOME page.
//  Elegant, small, semi-transparent. Links lead into the
//  learning experience at /learn.
// ============================================================

const LINKS = [
  { label: 'Topics', hash: '#topics' },
  { label: 'How It Works', hash: '#how-it-works' },
]

const MainNavbar = memo(function MainNavbar() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`mainnav ${scrolled ? 'mainnav--scrolled' : ''}`}>
      <div className="mainnav__inner">
        <button type="button" className="mainnav__brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
          <PhpBadge size={30} />
          <span>PHP <i>•</i> MySQLi</span>
        </button>
        <nav className="mainnav__links" aria-label="Primary">
          {LINKS.map((l) => (
            <button key={l.hash} type="button" className="mainnav__link" onClick={() => navigate(`/learn${l.hash}`)}>
              {l.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
})

export default MainNavbar
