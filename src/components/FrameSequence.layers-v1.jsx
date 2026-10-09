import { memo, useEffect, useRef, useState } from 'react'
import LettersScene from './LettersScene.jsx'
import { DEVICE } from '../lib/device.js'

// ============================================================
//  FrameSequence — the Home page timeline engine (canvas).
//
//  300 keyframes — the animation at its native 30 fps — live in
//  /public/assets/php-frames/frame-001.webp … frame-300.webp.
//  The parent owns a MutableRef<number> (progressRef, 0 → 1)
//  updated from scroll position.
//
//  Every frame is decoded into an ImageBitmap BEFORE it can be
//  drawn, and the canvas is never cleared between frames — the
//  previous frame simply stays on screen until the next one is
//  ready. That is what makes flashing structurally impossible,
//  on every device, in every mode.
//
//  Frames are decoded into a window around the playhead and
//  evicted beyond it (a decoded 1080p frame is ~8 MB — all 300
//  would be ~2.5 GB). Lite devices step every 2nd frame and
//  decode at half resolution (see lib/device.js).
//
//  Scrolling up plays backwards; stopping freezes it. All
//  drawing happens on one canvas via rAF — no React re-renders.
// ============================================================

export const FRAME_COUNT = 300

// BASE_URL is "/" locally and "/<repo-name>/" on GitHub Pages, so frame
// URLs stay correct when the site is served from a subpath.
export const frameSrc = (i) =>
  `${import.meta.env.BASE_URL}assets/php-frames/frame-${String(i + 1).padStart(3, '0')}.webp`

const CONCURRENCY = DEVICE.lite ? 2 : 3
// lite mode decodes at half resolution when the browser supports
// createImageBitmap resize options (falls back to full resolution)
const LITE_DECODE_WIDTH = 960

const FrameSequence = memo(function FrameSequence({
  progressRef,
  smooth = true,
}) {
  const canvasRef = useRef(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (failed) return undefined
    const canvas = canvasRef.current
    if (!canvas || typeof createImageBitmap !== 'function') {
      setFailed(true)
      return undefined
    }
    const ctx = canvas.getContext('2d', { alpha: false })
    const dpr = Math.min(window.devicePixelRatio || 1, DEVICE.dprCap)
    let dead = false

    // ---- decoded-frame cache with windowed eviction ----
    const cache = new Map() // frame index -> ImageBitmap
    const inFlight = new Set()

    const ensure = (idx) => {
      if (dead || idx < 0 || idx >= FRAME_COUNT) return
      if (cache.has(idx) || inFlight.has(idx)) return
      if (inFlight.size >= CONCURRENCY) return
      inFlight.add(idx)
      fetch(frameSrc(idx))
        .then((r) => {
          if (!r.ok) throw new Error(`frame ${idx} HTTP ${r.status}`)
          return r.blob()
        })
        .then((blob) => {
          const opts = DEVICE.lite ? { resizeWidth: LITE_DECODE_WIDTH } : undefined
          return opts
            ? createImageBitmap(blob, opts).catch(() => createImageBitmap(blob))
            : createImageBitmap(blob)
        })
        .then((bm) => {
          inFlight.delete(idx)
          if (dead) { bm.close(); return }
          cache.set(idx, bm)
          evict(idx)
        })
        .catch(() => {
          inFlight.delete(idx)
          if (idx === 0) setFailed(true) // first frame is the engine's lifeline
        })
    }

    const evict = (around) => {
      if (cache.size <= DEVICE.window) return
      const farthest = [...cache.keys()]
        .sort((a, b) => Math.abs(b - around) - Math.abs(a - around))
        .slice(DEVICE.window)
      for (const k of farthest) {
        cache.get(k).close()
        cache.delete(k)
      }
    }

    // warm the window around a frame index (used every tick, cheap)
    const warmAround = (idx) => {
      for (let d = 0; d <= DEVICE.window; d += DEVICE.step) {
        ensure(idx + d)
        ensure(idx - d)
      }
    }

    // ---- sizing ----
    // Mobile browsers keep changing the viewport height as the address
    // bar slides in and out. Changing the backing store always clears
    // the canvas, so any resize is immediately repainted from the last
    // bitmap in the same event (before the browser paints) — no black
    // or white gap can ever reach the screen. Sizing on the resize
    // event, not per rAF tick, avoids a forced layout read every frame.
    const fit = () => {
      const cssW = canvas.clientWidth
      const cssH = canvas.clientHeight
      if (!cssW || !cssH) return false
      const bw = Math.round(cssW * dpr)
      const bh = Math.round(cssH * dpr)
      if (canvas.width === bw && canvas.height === bh) return false
      canvas.width = bw
      canvas.height = bh
      return true
    }
    const onResize = () => { if (fit()) paint(lastBm) }
    window.addEventListener('resize', onResize, { passive: true })

    // ---- drawing ----
    // cover on wide screens, contain on squarish/portrait — matches the
    // old <img> object-fit rules (frames have a white studio background)
    let lastBm = null
    const paint = (bm) => {
      const cw = canvas.width
      const ch = canvas.height
      if (!cw || !ch || !bm) return
      const cover = cw / ch > 1.45
      const s = cover
        ? Math.max(cw / bm.width, ch / bm.height)
        : Math.min(cw / bm.width, ch / bm.height)
      const dw = bm.width * s
      const dh = bm.height * s
      ctx.drawImage(bm, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
      lastBm = bm
    }
    const draw = (idx) => {
      const bm = cache.get(idx)
      if (!bm) return
      paint(bm)
    }

    // ---- timeline ----
    // progress 0→1 maps to the step-snapped frame grid; `shown` eases
    // toward the target so the animation catches up with the scroll.
    const snapped = (v) =>
      Math.min(Math.max(Math.round(Math.round(v) / DEVICE.step) * DEVICE.step, 0), FRAME_COUNT - 1)

    const st = { shown: 0, drawn: -1, warmed: -1 }

    const tick = () => {
      raf = requestAnimationFrame(tick)

      const p = Math.min(Math.max(progressRef?.current ?? 0, 0), 1)
      const target = p * (FRAME_COUNT - 1)
      if (smooth) {
        st.shown += (target - st.shown) * 0.2
        if (Math.abs(target - st.shown) < 0.004) st.shown = target
      } else {
        st.shown = target
      }

      const want = snapped(st.shown)
      // warm the decode window only when the playhead moves to a new
      // frame — not every tick
      if (want !== st.warmed) {
        warmAround(want)
        st.warmed = want
      }

      // draw the exact frame when cached; otherwise the frame already
      // on screen simply stays (no gap, no flash) while the wanted one
      // decodes
      if (cache.has(want)) {
        if (st.drawn !== want) { draw(want); st.drawn = want }
      } else if (st.drawn < 0) {
        for (let i = want; i >= 0; i -= DEVICE.step) {
          if (cache.has(i)) { draw(i); st.drawn = i; break }
        }
      }
    }

    let raf = 0
    ctx.fillStyle = '#fff'
    fit()
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    warmAround(0)
    raf = requestAnimationFrame(tick)

    return () => {
      dead = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      for (const bm of cache.values()) bm.close()
      cache.clear()
    }
  }, [failed, smooth, progressRef])

  if (failed) return <LettersScene animated={false} />

  return (
    <canvas ref={canvasRef} className="frameseq__canvas" aria-hidden="true" />
  )
})

export default FrameSequence
