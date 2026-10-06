// Shared "force full motion" flag.
// Some machines (especially Windows with animation effects turned off)
// report prefers-reduced-motion: reduce. Appending ?motion to any URL
// forces the full animated experience — handy during presentations.

export const FORCE_MOTION =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).has('motion')

export function prefersReducedMotion() {
  return !FORCE_MOTION && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function goToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
}
