import { memo, useEffect, useRef, useState } from 'react'
import LettersScene from './LettersScene.jsx'

// ============================================================
//  FrameSequence — the Home page timeline engine.
//
//  300 keyframes — the animation at its native 30 fps — live in
//  /public/assets/php-frames/frame-001.webp … frame-300.webp.
//  The parent owns a MutableRef<number> (progressRef, 0 → 1)
//  updated from scroll position.
//
//  Because neighbouring frames are only 1/30 s apart, the engine
//  hard-cuts between them (like real video) instead of cross-fading
//  — no ghosting, no flashing, ever:
//
//    - exactly ONE layer is fully opaque at any moment
//    - a flip happens ONLY after the incoming frame has fully
//      loaded (img "load" event) — an incomplete image is never
//      shown, so the screen can never flash white
//    - three layers total: one visible, two pre-staging neighbours
//    - a rolling preload window keeps ±45 frames around the
//      current position cached
//
//  Scrolling up plays it backwards; stopping freezes it. Opacity
//  and src are written straight to the DOM — no React re-renders.
// ============================================================

export const FRAME_COUNT = 300

// BASE_URL is "/" locally and "/<repo-name>/" on GitHub Pages, so frame
// URLs stay correct when the site is served from a subpath.
export const frameSrc = (i) =>
  `${import.meta.env.BASE_URL}assets/php-frames/frame-${String(i + 1).padStart(3, '0')}.webp`

const FrameSequence = memo(function FrameSequence({
  progressRef,
  smooth = true,
  onError,
}) {
  const rootRef = useRef(null)
  const imgRefs = useRef([])
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (failed) return undefined

    const entries = imgRefs.current.map((el, frame) => ({
      el,
      frame,              // frame index this layer currently holds
      visible: frame === 0,
      ready: frame === 0, // fully loaded — safe to display
    }))
    entries[0].el.style.opacity = '1'
    entries[1].el.style.opacity = '0'
    entries[2].el.style.opacity = '0'

    const st = {
      shown: 0,
      current: 0,     // frame index on screen
      loading: null,  // frame index being fetched on a hidden layer
    }

    // pre-stage frame 2 on a hidden layer
    entries[1].frame = 1
    entries[1].el.src = frameSrc(1)
    entries[1].el.addEventListener('load', () => { entries[1].ready = true }, { once: true })

    let raf = 0

    const flipTo = (entry) => {
      entries.forEach((e) => {
        const s = e === entry ? '1' : '0'
        if (e.el.style.opacity !== s) e.el.style.opacity = s
        e.visible = e === entry
      })
      st.current = entry.frame
    }

    const startLoad = (frame) => {
      const spare = entries.find((e) => !e.visible && e.frame !== frame)
      if (!spare) return false
      st.loading = frame
      spare.ready = false
      spare.frame = frame
      const onDone = () => {
        spare.ready = true
        if (st.loading === frame) st.loading = null
        // flip immediately if the user is still around this frame
        const want = Math.min(
          Math.max(Math.round(st.shown), 0),
          FRAME_COUNT - 1,
        )
        if (want === frame && !entries.find((e) => e.visible && e.frame === want)) {
          flipTo(spare)
        }
      }
      spare.el.addEventListener('load', onDone, { once: true })
      spare.el.addEventListener('error', () => {
        spare.ready = false
        if (st.loading === frame) st.loading = null
      }, { once: true })
      spare.el.src = frameSrc(frame)
      return true
    }

    const tick = () => {
      raf = requestAnimationFrame(tick)

      const p = Math.min(Math.max(progressRef?.current ?? 0, 0), 1)
      const target = p * (FRAME_COUNT - 1)

      // smooth cinematic interpolation toward the scroll target
      // (reduced motion: direct 1:1 mapping, still fully scroll-driven)
      if (smooth) {
        st.shown += (target - st.shown) * 0.2
        if (Math.abs(target - st.shown) < 0.004) st.shown = target
      } else {
        st.shown = target
      }

      const want = Math.min(Math.max(Math.round(st.shown), 0), FRAME_COUNT - 1)
      if (want === st.current) return

      // the wanted frame may already be staged and loaded on a hidden layer
      const holder = entries.find((e) => e.frame === want && e.ready && !e.visible)
      if (holder) { flipTo(holder); return }

      if (st.loading !== null) return // one load at a time; current stays visible

      if (!startLoad(want)) {
        // both hidden layers hold useful neighbours — recycle the one
        // further from the current position
        const hidden = entries.filter((e) => !e.visible)
        if (hidden.length < 2) return
        hidden.sort((a, b) => Math.abs(b.frame - want) - Math.abs(a.frame - want))
        startLoad(want)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [failed, smooth, progressRef])

  // rolling preload: keep ±45 frames around the current timeline
  // position cached so scrubbing never waits on the network
  useEffect(() => {
    if (failed) return undefined
    const cached = new Set([0, 1])
    let timer = 0
    const warm = () => {
      const cur = Math.round(
        Math.min(Math.max(progressRef?.current ?? 0, 0), 1) * (FRAME_COUNT - 1),
      )
      const lo = Math.max(0, cur - 45)
      const hi = Math.min(FRAME_COUNT - 1, cur + 45)
      let started = 0
      for (let i = lo; i <= hi && started < 6; i++) {
        if (!cached.has(i)) {
          const img = new Image()
          img.src = frameSrc(i)
          cached.add(i)
          started++
        }
      }
    }
    timer = setInterval(warm, 150)
    warm()
    return () => clearInterval(timer)
  }, [failed, progressRef])

  if (failed) return <LettersScene animated={false} />

  return (
    <div className="frameseq" ref={rootRef} aria-hidden="true">
      {Array.from({ length: 3 }, (_, i) => (
        <img
          key={i}
          ref={(el) => { imgRefs.current[i] = el }}
          className="frameseq__frame"
          src={i === 0 ? frameSrc(0) : undefined}
          alt=""
          loading="eager"
          decoding={i === 0 ? 'sync' : 'async'}
          draggable="false"
          style={{ opacity: i === 0 ? 1 : 0 }}
          onError={() => { if (i === 0) { setFailed(true); onError?.() } }}
        />
      ))}
    </div>
  )
})

export default FrameSequence
