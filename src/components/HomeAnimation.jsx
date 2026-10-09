import { memo, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import FrameSequence from './FrameSequence.jsx'
import AnimationProgress from './AnimationProgress.jsx'
import StartLearningButton from './StartLearningButton.jsx'
import { FORCE_MOTION } from '../lib/motion.js'
import { DEVICE } from '../lib/device.js'

// ============================================================
//  HomeAnimation — the cinematic home experience.
//
//  A ~620vh scroll container; the animation stage is sticky and
//  fills the viewport while the user scrolls through it. Scroll
//  position (0→1, updated synchronously on scroll) drives the
//  10-frame timeline inside FrameSequence, which cross-blends
//  between adjacent keyframes — forward, backward, and frozen
//  exactly where the user stops.
//
//  progress map (10 keyframes → 9 intervals):
//    0%        empty white scene                (frame 01)
//    ~11%      characters start entering        (frame 02)
//    ~22–44%   giant letters dragged in         (frames 03–05)
//    ~56–67%   letters move toward the center   (frames 06–07)
//    ~78–89%   PHP approaches final alignment   (frames 08–09)
//    100%      PHP locked + proud pose          (frame 10)
//  ============================================================

const HomeAnimation = memo(function HomeAnimation() {
  const containerRef = useRef(null)
  const progressRef = useRef(0)
  const [started, setStarted] = useState(false)
  const [nearEnd, setNearEnd] = useState(false)
  const reducedMotion = useReducedMotion()
  // reduced motion never disables the scroll timeline — it is fully
  // user-driven, not autonomous motion. It only turns off the
  // smoothing lerp (direct 1:1 mapping) via the `smooth` prop.
  const reduced = reducedMotion && !FORCE_MOTION

  useEffect(() => {
    const update = () => {
      const el = containerRef.current
      if (!el) return
      const scrollable = el.offsetHeight - window.innerHeight
      const raw = scrollable > 0
        ? Math.min(Math.max(-el.getBoundingClientRect().top / scrollable, 0), 1)
        : 1
      progressRef.current = raw
      setStarted(raw > 0.015)
      setNearEnd(raw > 0.86)
    }
    // cheap O(1) math — run synchronously on scroll; the frame
    // cross-blend is rAF-smoothed inside FrameSequence
    const onScroll = () => update()

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section
      id="top"
      ref={containerRef}
      className="home-anim"
      aria-label="PHP intro animation — scroll to play"
    >
      <div className="home-anim__stage">
        <FrameSequence
          progressRef={progressRef}
          smooth={!reduced}
        />

        <div className={`home-anim__hint ${started ? 'is-hidden' : ''}`} aria-hidden="true">
          <span>{DEVICE.touch ? 'Swipe up to explore' : 'Scroll to explore'}</span>
          <span className="home-anim__hint-arrow">↓</span>
        </div>

        <div className={`home-anim__end ${nearEnd ? 'is-visible' : ''}`}>
          <span className="home-anim__end-brand">
            PHP <i aria-hidden="true">•</i> MySQLi
          </span>
          <p className="home-anim__end-sub">From PHP to MySQL to JSON</p>
          <StartLearningButton />
        </div>

        <AnimationProgress progressRef={progressRef} />
      </div>
    </section>
  )
})

export default HomeAnimation
