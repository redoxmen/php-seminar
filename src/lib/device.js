// ============================================================
//  device.js — one-time device capability check.
//
//  The experience is identical on every device; only the
//  workload scales. A device is served in "lite" mode when it
//  is touch-driven, low on memory (≤ 4 GB), or narrow — the
//  three signals that predict trouble holding ~30 decoded
//  1080p bitmaps while painting at 60 fps.
//
//  lite mode:
//    - every 2nd frame only (150 of 300) — the easing hides the
//      coarser stepping
//    - frames decoded at half resolution (~2 MB instead of ~8 MB)
//    - canvas density capped at 1.5× instead of 2×
//    - a slightly larger decode window (cheap frames, keep more)
// ============================================================

function detect() {
  if (typeof window === 'undefined') {
    return { lite: false, touch: false, dprCap: 2, step: 1, window: 14 }
  }

  const touch = window.matchMedia('(pointer: coarse)').matches
  const mem = typeof navigator.deviceMemory === 'number' ? navigator.deviceMemory : null
  const cores = navigator.hardwareConcurrency ?? 4
  const narrow = Math.min(window.innerWidth, window.innerHeight) < 700
  const lowMemory = mem !== null
    ? mem <= 4
    : cores <= 4 // no Device Memory API — core count is the fallback signal

  const lite = touch || lowMemory || narrow

  return {
    lite,
    touch,
    dprCap: lite ? 1.5 : 2,
    step: lite ? 2 : 1,
    window: lite ? 20 : 14, // decoded frames kept around the playhead
  }
}

// evaluated once at startup — deliberately not reactive
export const DEVICE = detect()
