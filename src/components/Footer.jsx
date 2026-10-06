import { useNavigate } from 'react-router-dom'
import { PhpBadge } from './Navbar.jsx'

function goTo(id) {
  const el = document.getElementById(id)
  if (!el) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
}

export default function Footer() {
  const navigate = useNavigate()
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <div className="footer__brand">
          <PhpBadge size={40} />
          <div>
            <b>PHP • MySQLi Learning Project</b>
            <span>Learn PHP. Understand MySQL. Build APIs.</span>
          </div>
        </div>
        <nav className="footer__links" aria-label="Footer">
          <button type="button" onClick={() => navigate('/')}>Home</button>
          <button type="button" onClick={() => goTo('topics')}>Topics</button>
        </nav>
      </div>
    </footer>
  )
}
