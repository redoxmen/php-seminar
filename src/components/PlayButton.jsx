import { memo, useEffect, useRef, useState } from 'react'

// ============================================================
//  PlayButton — bottom-right control on the Home page.
//  Click ▶ : the page auto-scrolls through the whole animation
//  (full timeline ≈ 14 s, continues from the current position,
//  restarts from the top if you are already at the end).
//  Click ❚❚ : pauses. Manual wheel / touch input also pauses it,
//  so the user is always in control.
// ============================================================

const PLAY_DURATION_S = 14

const PlayButton = memo(function PlayButton() {
  const [playing, setPlaying] = useState(false)
  const playingRef = useRef(false)
  playingRef.current = playing

  useEffect(() => {
    if (!playing) return undefined
    let raf = 0
    let last = performance.now()

    const step = (now) => {
      if (!playingRef.current) return
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const el = document.querySelector('.home-anim')
      const scrollable = el ? el.offsetHeight - window.innerHeight : 0
      if (scrollable <= 0 || window.scrollY >= scrollable - 1) {
        setPlaying(false) // reached the end
        return
      }
      window.scrollBy(0, (scrollable / PLAY_DURATION_S) * dt)
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)

    const cancel = () => { if (playingRef.current) setPlaying(false) }
    window.addEventListener('wheel', cancel, { passive: true })
    window.addEventListener('touchstart', cancel, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('wheel', cancel)
      window.removeEventListener('touchstart', cancel)
    }
  }, [playing])

  const onClick = () => {
    if (playing) { setPlaying(false); return }
    const el = document.querySelector('.home-anim')
    const scrollable = el ? el.offsetHeight - window.innerHeight : 0
    if (scrollable <= 0) return
    if (window.scrollY >= scrollable - 2) window.scrollTo(0, 0) // restart from top
    setPlaying(true)
  }

  return (
    <button
      type="button"
      className={`playbtn ${playing ? 'is-playing' : ''}`}
      onClick={onClick}
      aria-label={playing ? 'Pause the animation' : 'Play the animation'}
      title={playing ? 'Pause' : 'Play the animation'}
    >
      {playing ? (
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <rect x="6" y="5" width="4.4" height="14" rx="1.6" fill="currentColor" />
          <rect x="13.6" y="5" width="4.4" height="14" rx="1.6" fill="currentColor" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M8 5.6v12.8c0 1 1.1 1.6 2 1.1l10-6.4c.8-.5.8-1.7 0-2.2l-10-6.4c-.9-.5-2 .1-2 1.1z" fill="currentColor" />
        </svg>
      )}
    </button>
  )
})

export default PlayButton
