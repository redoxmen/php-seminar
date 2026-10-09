import { memo, useEffect, useRef, useState } from 'react'
import LettersScene from './LettersScene.jsx'
import { DEVICE } from '../lib/device.js'

// ============================================================
//  FrameSequence — the Home page timeline engine (canvas).
//
//  The scroll position picks the frame; frames are drawn onto ONE
//  canvas, and only after they are fully decoded — the previous
//  frame simply stays on screen until the next one is ready, so a
//  blank or half-decoded frame can never reach the screen. That
//  is what makes the scroll flash structurally impossible.
//
//  Fit: the frame is scaled with "contain" (never cropped, never
//  stretched); leftover bands are filled with the frame's own
//  stretched edge pixels, so there are no bars and no visible seam.
//
//  Two frame sets — landscape/ and portrait/ — chosen by the
//  viewport aspect with hysteresis (mobile URL-bar jitter cannot
//  flip-flop the sets). If portrait/ is missing the engine falls
//  back to landscape automatically.
//
//  Loading is progressive: frame 0, the last frame, then binary
//  subdivision (mid, quarters, eighths …), so scrubbing works
//  early at coarse density and refines as more frames arrive.
//
//  Memory: decoded bitmaps are budgeted (~110 MB touch/low-memory,
//  ~300 MB desktop); the decode width and whether all frames can
//  stay resident are derived from that budget, with windowed
//  eviction when they can't. DPR is capped on lite devices.
//
//  Old layered-<img> implementation: FrameSequence.layers-v1.jsx
// ============================================================

export const FRAME_COUNT = 80 // duration (10s) × 8 fps — regenerate with the ffmpeg commands in README if the video changes

// BASE_URL is "/" locally and "/<repo-name>/" on GitHub Pages, so frame
// URLs stay correct when the site is served from a subpath.
export const frameSrc = (i, orient = 'landscape') =>
  `${import.meta.env.BASE_URL}assets/php-frames/${orient}/frame-${String(i + 1).padStart(3, '0')}.webp`

const BUDGET = (DEVICE.lite ? 110 : 300) * 1024 * 1024 // decoded-bitmap budget
// quality floor for the decode width — when holding every frame at this
// width would blow the budget, the engine keeps a windowed cache at this
// width instead of shrinking the frames
const MIN_DECODE_W = DEVICE.lite ? 960 : 1440
const PROBE_CAP = 1920 // first probe frame decodes at most this wide
const K = DEVICE.touch ? 20 : 13 // time-based easing rate (1/s)
const NEIGHBOURS = 6 // frames around the playhead always prioritised

// progressive order: endpoints first, then repeated midpoints, so the
// timeline exists at coarse density before it refines
function buildOrder(n) {
  const order = [0, n - 1]
  const seen = new Set(order)
  let step = n - 1
  while (step > 1) {
    step /= 2
    for (let i = step; i < n - 1; i += step) {
      const idx = Math.round(i)
      if (!seen.has(idx)) { seen.add(idx); order.push(idx) }
    }
  }
  return order
}
const ORDER = buildOrder(FRAME_COUNT)

const FrameSequence = memo(function FrameSequence({
  progressRef,
  smooth = true,
  onError,
}) {
  const canvasRef = useRef(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (failed) return undefined
    const canvas = canvasRef.current
    if (!canvas || typeof createImageBitmap !== 'function') {
      setFailed(true)
      onError?.()
      return undefined
    }
    const ctx = canvas.getContext('2d', { alpha: false })
    const dpr = Math.min(window.devicePixelRatio || 1, DEVICE.dprCap)
    let dead = false

    // ---- edge-extension offscreens (no letterbox bars) ----
    const bandV = document.createElement('canvas') // 1 x 64 — left/right edge
    bandV.width = 1
    bandV.height = 64
    const bandVCtx = bandV.getContext('2d')
    const bandH = document.createElement('canvas') // 64 x 1 — top/bottom edge
    bandH.width = 64
    bandH.height = 1
    const bandHCtx = bandH.getContext('2d')

    // ---- per-orientation frame-set state ----
    const makeSet = (name, aspect) => ({
      name,
      aspect, // width / height of the source frames
      bitmaps: new Map(), // frame index -> ImageBitmap
      inFlight: new Set(),
      nativeW: null, // discovered from the probe frame
      decodeW: null,
      holdAll: false,
      windowSize: 0, // eviction window when !holdAll
      missing: false, // portrait folder 404s -> fall back to landscape
    })
    const sets = {
      landscape: makeSet('landscape', 16 / 9),
      portrait: makeSet('portrait', 9 / 16),
    }

    // ---- orientation with hysteresis ----
    let orient = window.innerHeight > window.innerWidth * 1.05 ? 'portrait' : 'landscape'
    // dead zone between the two thresholds — mobile URL-bar jitter cannot
    // flip-flop the frame sets
    const updateOrientation = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const next = orient === 'landscape' && h > w * 1.05
        ? 'portrait'
        : orient === 'portrait' && w > h * 1.05 ? 'landscape' : orient
      if (next === orient) return false
      // release the old set's bitmaps — the budget belongs to the
      // orientation actually on screen (they re-decode from HTTP cache)
      const idle = sets[orient]
      for (const bm of idle.bitmaps.values()) bm.close()
      idle.bitmaps.clear()
      orient = next
      return true
    }

    const perFrameBytes = (set, w) => (w * (w / set.aspect) * 4)

    const decodeOpts = (set) => {
      if (!set.decodeW || !set.nativeW || set.decodeW >= set.nativeW) return undefined
      return { resizeWidth: set.decodeW }
    }

    const decode = (set, idx) => {
      if (dead || set.missing) return
      if (set.bitmaps.has(idx) || set.inFlight.has(idx)) return
      const active = sets[orient]
      if (set !== active && set.bitmaps.size === 0 && !set.decodeW) return // don't pre-load the idle set
      if (countInFlight() >= (DEVICE.lite ? 2 : 3)) return
      set.inFlight.add(idx)
      fetch(frameSrc(idx, set.name))
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`)
          return r.blob()
        })
        .then((blob) => {
          const opts = decodeOpts(set)
          return opts
            ? createImageBitmap(blob, opts).catch(() => createImageBitmap(blob))
            : createImageBitmap(blob)
        })
        .then((bm) => {
          set.inFlight.delete(idx)
          if (dead) { bm.close(); return }
          if (set.missing || (set !== sets[orient] && set.bitmaps.size === 0)) {
            bm.close() // orientation flipped away while loading
            return
          }
          if (!set.nativeW) {
            // probe frame: learn the native width, then budget the decode width
            set.nativeW = bm.width
            const budgetW = Math.sqrt((BUDGET / FRAME_COUNT) * set.aspect / 4)
            set.decodeW = Math.min(set.nativeW, Math.max(budgetW, MIN_DECODE_W))
            const allBytes = perFrameBytes(set, set.decodeW) * FRAME_COUNT
            set.holdAll = allBytes <= BUDGET
            set.windowSize = Math.max(12, Math.floor(BUDGET / perFrameBytes(set, set.decodeW)))
          }
          set.bitmaps.set(idx, bm)
          evict(set, idx)
        })
        .catch(() => {
          set.inFlight.delete(idx)
          if (set.name === 'portrait') {
            // no portrait set on the server — stay on landscape
            set.missing = true
            if (orient === 'portrait') orient = 'landscape'
          } else if (idx === 0) {
            setFailed(true) // first landscape frame is the engine's lifeline
            onError?.()
          }
        })
    }

    const countInFlight = () =>
      sets.landscape.inFlight.size + sets.portrait.inFlight.size

    const evict = (set, around) => {
      if (set.holdAll || set.bitmaps.size <= set.windowSize) return
      const farthest = [...set.bitmaps.keys()]
        .sort((a, b) => Math.abs(b - around) - Math.abs(a - around))
        .slice(set.windowSize)
      for (const k of farthest) {
        set.bitmaps.get(k).close()
        set.bitmaps.delete(k)
      }
    }

    // start loads: neighbours around the playhead first, then the
    // progressive order, for the active set
    const pump = (want) => {
      const set = sets[orient]
      if (set.missing) return
      const wanted = []
      for (let d = 1; d <= NEIGHBOURS; d++) wanted.push(want - d, want + d)
      for (const idx of ORDER) wanted.push(idx)
      for (const idx of wanted) {
        if (countInFlight() >= (DEVICE.lite ? 2 : 3)) return
        if (idx >= 0 && idx < FRAME_COUNT) decode(set, idx)
      }
      decode(set, want)
    }

    // ---- sizing ----
    // Mobile browsers keep changing the viewport height as the address
    // bar slides in and out; the backing store is resized on the resize
    // event and repainted from the last bitmap in the same event, so a
    // height change can never blank the screen.
    let resizeQueued = false
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
    const onResize = () => {
      updateOrientation()
      if (resizeQueued) return
      resizeQueued = true
      requestAnimationFrame(() => {
        resizeQueued = false
        if (fit()) drawKey = '' // backing store cleared — force repaint
      })
    }
    window.addEventListener('resize', onResize, { passive: true })

    // ---- drawing ----
    let lastBm = null
    let drawKey = ''

    const paint = (bm) => {
      const W = canvas.width
      const H = canvas.height
      if (!W || !H || !bm) return
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.fillStyle = '#fff' // page background
      ctx.fillRect(0, 0, W, H)

      const s = Math.min(W / bm.width, H / bm.height) // contain: never crop, never stretch
      const dw = bm.width * s
      const dh = bm.height * s
      const dx = (W - dw) / 2
      const dy = (H - dh) / 2

      // fill leftover bands with the frame's own stretched edge pixels
      if (dx > 1) {
        bandVCtx.drawImage(bm, 0, 0, 4, bm.height, 0, 0, 1, 64) // left columns
        ctx.drawImage(bandV, 0, 0, 1, 64, 0, 0, dx + 2, H)
        bandVCtx.drawImage(bm, bm.width - 4, 0, 4, bm.height, 0, 0, 1, 64) // right columns
        ctx.drawImage(bandV, 0, 0, 1, 64, W - dx - 2, 0, dx + 2, H)
      }
      if (dy > 1) {
        bandHCtx.drawImage(bm, 0, 0, bm.width, 4, 0, 0, 64, 1) // top rows
        ctx.drawImage(bandH, 0, 0, 64, 1, 0, 0, W, dy + 2)
        bandHCtx.drawImage(bm, 0, bm.height - 4, bm.width, 4, 0, 0, 64, 1) // bottom rows
        ctx.drawImage(bandH, 0, 0, 64, 1, 0, H - dy - 2, W, dy + 2)
      }
      ctx.drawImage(bm, dx, dy, dw, dh)
      lastBm = bm
    }

    const drawNearest = (want) => {
      const set = sets[orient]
      // nearest decoded frame to `want`; ties prefer the frame below
      for (let d = 0; d <= FRAME_COUNT; d++) {
        if (set.bitmaps.has(want - d)) { paint(set.bitmaps.get(want - d)); return want - d }
        if (set.bitmaps.has(want + d)) { paint(set.bitmaps.get(want + d)); return want + d }
      }
      return -1
    }

    // reveal gate: first + last + coarse (1/8) grid decoded before the
    // first paint, so scrubbing never begins on a half-loaded timeline
    const gateReady = () => {
      let set = sets[orient]
      if (set.missing) set = sets.landscape
      if (!set.bitmaps.has(0) || !set.bitmaps.has(FRAME_COUNT - 1)) return false
      for (let i = 1; i < 8; i++) {
        if (!set.bitmaps.has(Math.round(((FRAME_COUNT - 1) * i) / 8))) return false
      }
      return true
    }

    // ---- timeline ----
    const st = { shown: 0, drawn: -1 }
    let raf = 0
    let last = performance.now()

    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now

      const p = Math.min(Math.max(progressRef?.current ?? 0, 0), 1)
      const target = p * (FRAME_COUNT - 1)
      // time-based easing — identical feel at 60 Hz and 120 Hz; tighter
      // on touch so the animation keeps up with the finger
      if (smooth) {
        st.shown += (target - st.shown) * (1 - Math.exp(-dt * K))
        if (Math.abs(target - st.shown) < 0.004) st.shown = target
      } else {
        st.shown = target
      }
      const want = Math.min(Math.max(Math.round(st.shown), 0), FRAME_COUNT - 1)

      pump(want)
      if (!gateReady()) return

      const key = `${orient}|${want}|${canvas.width}x${canvas.height}`
      if (key === drawKey) return // nothing changed — no redraw
      const drawn = drawNearest(want)
      if (drawn >= 0) {
        drawKey = key
        st.drawn = drawn
      }
    }

    const onVisibility = () => {
      cancelAnimationFrame(raf)
      last = performance.now()
      if (!document.hidden) raf = requestAnimationFrame(tick)
    }
    document.addEventListener('visibilitychange', onVisibility)

    fit()
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    decode(sets[orient], 0) // probe frame starts the budget discovery
    raf = requestAnimationFrame(tick)

    return () => {
      dead = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      for (const set of Object.values(sets)) {
        for (const bm of set.bitmaps.values()) bm.close()
        set.bitmaps.clear()
      }
    }
  }, [failed, smooth, progressRef, onError])

  if (failed) return <LettersScene animated={false} />

  return (
    <canvas ref={canvasRef} className="frameseq__canvas" aria-hidden="true" />
  )
})

export default FrameSequence
