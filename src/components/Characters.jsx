// ============================================================
//  ORIGINAL CARTOON CAST — hand-drawn SVG characters.
//  Cute blob kids with big heads, blush cheeks and tiny shoes,
//  matching the hero video's aesthetic. All vector, zero assets.
// ============================================================

const SKIN = '#FFDFC8'
const SKIN_SHADE = '#F7C9A8'
const INK = '#4A3B36'

function Eyes({ cx = 60, cy = 52, mood = 'happy' }) {
  const lx = cx - 12
  const rx = cx + 12
  if (mood === 'strain') {
    return (
      <g>
        <ellipse cx={lx} cy={cy} rx="7.5" ry="8.5" fill="#fff" />
        <ellipse cx={rx} cy={cy} rx="7.5" ry="8.5" fill="#fff" />
        <circle cx={lx + 1.5} cy={cy + 1.5} r="4" fill={INK} />
        <circle cx={rx + 1.5} cy={cy + 1.5} r="4" fill={INK} />
        <circle cx={lx + 0.4} cy={cy - 1.4} r="1.6" fill="#fff" />
        <circle cx={rx + 0.4} cy={cy - 1.4} r="1.6" fill="#fff" />
        <path d={`M ${lx - 7} ${cy - 11} q 7 -4 14 0`} stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path d={`M ${rx - 7} ${cy - 11} q 7 -4 14 0`} stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </g>
    )
  }
  return (
    <g>
      <ellipse cx={lx} cy={cy} rx="7.5" ry="8.5" fill="#fff" />
      <ellipse cx={rx} cy={cy} rx="7.5" ry="8.5" fill="#fff" />
      <circle cx={lx} cy={cy + 1} r="4" fill={INK} />
      <circle cx={rx} cy={cy + 1} r="4" fill={INK} />
      <circle cx={lx - 1.6} cy={cy - 1.6} r="1.6" fill="#fff" />
      <circle cx={rx - 1.6} cy={cy - 1.6} r="1.6" fill="#fff" />
    </g>
  )
}

function Mouth({ cx = 60, mood = 'happy' }) {
  if (mood === 'strain') {
    return (
      <g>
        <rect x={cx - 9} y={66} width="18" height="9" rx="4.5" fill={INK} />
        <line x1={cx - 9} y1={70.5} x2={cx + 9} y2={70.5} stroke="#fff" strokeWidth="2" />
      </g>
    )
  }
  if (mood === 'proud') {
    return (
      <path d={`M ${cx - 9} 65 q 9 12 18 0 q -9 6 -18 0`} fill={INK} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
    )
  }
  return <path d={`M ${cx - 8} 65 q 8 8 16 0`} stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
}

function Cheeks({ cx = 60 }) {
  return (
    <g fill="#FF9E9E" opacity="0.65">
      <ellipse cx={cx - 22} cy={63} rx="5.5" ry="3.4" />
      <ellipse cx={cx + 22} cy={63} rx="5.5" ry="3.4" />
    </g>
  )
}

function Head({ cx = 60, cy = 50, mood = 'happy', hair }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="36" fill={SKIN} />
      <circle cx={cx - 35} cy={cy + 4} r="5" fill={SKIN} />
      <circle cx={cx + 35} cy={cy + 4} r="5" fill={SKIN} />
      {hair(cx, cy)}
      <Eyes cx={cx} cy={cy + 3} mood={mood} />
      <Cheeks cx={cx} />
      <Mouth cx={cx} mood={mood} />
    </g>
  )
}

/* ---------- hairstyles ---------- */

export const boyHair = (cx, cy) => (
  <g>
    <path
      d={`M ${cx - 36} ${cy + 2}
          a 36 36 0 0 1 72 0
          q -6 -10 -16 -8
          q -2 -8 -12 -8
          q -12 -2 -16 6
          q -10 -2 -14 6
          q -8 0 -14 4 z`}
      fill="#8A5A3B"
    />
    <path d={`M ${cx - 4} ${cy - 34} q 4 -10 12 -10 q -2 6 2 10`} fill="#8A5A3B" />
  </g>
)

export const girlHair = (cx, cy) => (
  <g>
    <path
      d={`M ${cx - 36.5} ${cy + 4}
          a 36.5 36.5 0 0 1 73 0
          q -10 -14 -36.5 -14
          q -26.5 0 -36.5 14 z`}
      fill="#C9A0C7"
    />
    <path d={`M ${cx + 26} ${cy - 18} a 16 16 0 1 1 8 30 q -10 2 -12 -8 q 12 -4 4 -22 z`} fill="#C9A0C7" />
    <circle cx={cx + 34} cy={cy - 20} r="5" fill="#B7E4D0" />
    <path d={`M ${cx - 36} ${cy + 2} q -8 10 -4 22 l 8 2 q -4 -12 0 -22 z`} fill="#C9A0C7" />
  </g>
)

export const budHair = (cx, cy) => (
  <g>
    <path d={`M ${cx - 36.5} ${cy + 4} a 36.5 36.5 0 0 1 73 0 q -36.5 -18 -73 0 z`} fill="#6E4BD8" />
    <circle cx={cx} cy={cy - 42} r="4" fill="#6E4BD8" />
    <line x1={cx} y1={cy - 44} x2={cx} y2={cy - 38} stroke="#6E4BD8" strokeWidth="3" strokeLinecap="round" />
  </g>
)

const guardHair = (cx, cy) => (
  <g>
    <path d={`M ${cx - 36} ${cy + 2} a 36 36 0 0 1 72 0 q -8 -10 -18 -6 q -4 -8 -18 -6 q -14 0 -18 6 q -10 -2 -18 6 z`} fill="#3E4457" />
  </g>
)

/* ---------- accessories ---------- */

function Rope({ x = 0, y = 0 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M -30 6 Q 0 -6 34 4" stroke="#D9B98A" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <path d="M -30 6 Q 0 -6 34 4" stroke="#C2A172" strokeWidth="1.6" fill="none" strokeDasharray="3 5" strokeLinecap="round" />
    </g>
  )
}

function Magnifier() {
  return (
    <g transform="translate(96 116) rotate(18)">
      <circle r="14" fill="#BFE6F7" opacity="0.9" stroke="#5B6B7A" strokeWidth="4.5" />
      <line x1="9" y1="10" x2="20" y2="24" stroke="#8A5A3B" strokeWidth="6" strokeLinecap="round" />
      <circle cx="-4" cy="-4" r="3" fill="#fff" opacity="0.9" />
    </g>
  )
}

function Shield() {
  return (
    <g transform="translate(96 114)">
      <path d="M 0 -16 q 14 4 16 6 q 0 16 -16 26 q -16 -10 -16 -26 q 2 -2 16 -6 z" fill="#4C8DF6" stroke="#3B72CC" strokeWidth="3" strokeLinejoin="round" />
      <path d="M -6 0 l 4 5 l 8 -9" stroke="#fff" strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  )
}

/* ---------- full character ---------- */

export function Kid({
  shirt = '#FF6F61',
  pants = '#7FA8E0',
  hair = boyHair,
  mood = 'happy',
  accessory = null,
  rope = false,
  className,
  style,
}) {
  return (
    <svg viewBox="0 0 132 170" className={className} style={style} role="img" aria-label="Cartoon character">
      {/* legs + shoes */}
      <rect x="50" y="126" width="13" height="26" rx="6.5" fill={pants} />
      <rect x="70" y="126" width="13" height="26" rx="6.5" fill={pants} />
      <rect x="46" y="148" width="21" height="11" rx="5.5" fill="#fff" stroke="#E3E6EF" strokeWidth="1.5" />
      <rect x="66" y="148" width="21" height="11" rx="5.5" fill="#fff" stroke="#E3E6EF" strokeWidth="1.5" />
      {/* body */}
      <rect x="41" y="86" width="52" height="52" rx="21" fill={shirt} />
      {/* arms */}
      <path d="M 46 98 Q 30 108 28 124" stroke={shirt} strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M 87 98 Q 103 108 105 124" stroke={shirt} strokeWidth="13" strokeLinecap="round" fill="none" />
      <circle cx="28" cy="126" r="7" fill={SKIN} />
      <circle cx="105" cy="126" r="7" fill={SKIN} />
      {/* head */}
      <Head cx={66} cy={50} mood={mood} hair={hair} />
      {/* accessories */}
      {rope && <Rope x={66} y={120} />}
      {accessory === 'magnifier' && <Magnifier />}
      {accessory === 'shield' && <Shield />}
    </svg>
  )
}

/* ---------- named cast ---------- */

export function Boy(props) {
  return <Kid shirt="#FF6F61" pants="#7FA8E0" hair={boyHair} {...props} />
}

export function Girl(props) {
  return <Kid shirt="#63C1E8" pants="#B7E4D0" hair={girlHair} mood="proud" {...props} />
}

export function Bud(props) {
  return <Kid shirt="#8A66E8" pants="#5E4BC8" hair={budHair} {...props} />
}

export function Debugger(props) {
  return <Kid shirt="#F5A623" pants="#5B6B7A" hair={guardHair} mood="strain" accessory="magnifier" {...props} />
}

export function Guard(props) {
  return <Kid shirt="#4C8DF6" pants="#3E4457" hair={guardHair} accessory="shield" {...props} />
}

/* ---------- tiny decorations ---------- */

export function Sparkle({ x = 0, y = 0, size = 22, color = '#FFC93C', className, style }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d={`M ${x + 12} ${y + 2} L ${x + 14.4} ${y + 9.6} L ${x + 22} ${y + 12} L ${x + 14.4} ${y + 14.4} L ${x + 12} ${y + 22} L ${x + 9.6} ${y + 14.4} L ${x + 2} ${y + 12} L ${x + 9.6} ${y + 9.6} Z`}
        fill={color}
      />
    </svg>
  )
}
