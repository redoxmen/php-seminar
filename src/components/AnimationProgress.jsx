import { memo, useEffect, useRef } from 'react'

// ============================================================
//  AnimationProgress — a slim progress rail on the right edge of
//  the home animation. Reads progressRef on its own rAF loop and
//  writes the transform directly to the DOM (no React re-renders).
// ============================================================

const AnimationProgress = memo(function AnimationProgress({ progressRef }) {
  const fillRef = useRef(null)

  useEffect(() => {
    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const el = fillRef.current
      if (!el) return
      const p = Math.min(Math.max(progressRef?.current ?? 0, 0), 1)
      const next = `scaleY(${p})`
      if (el.dataset.t !== next) {
        el.dataset.t = next
        el.style.transform = next
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [progressRef])

  return (
    <div className="animprogress" aria-hidden="true">
      <span ref={fillRef} className="animprogress__fill" />
    </div>
  )
})

export default AnimationProgress
