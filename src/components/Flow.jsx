import { motion } from 'framer-motion'

const COLORS = {
  coral: { bg: '#FFF0EE', ink: '#E4524A', dot: '#FF6F61' },
  blue: { bg: '#EAF6FE', ink: '#1D7FB8', dot: '#2FA6E9' },
  violet: { bg: '#F1ECFD', ink: '#6538CE', dot: '#7748E6' },
}

const nodeVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.94 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.22, type: 'spring', stiffness: 160, damping: 18 },
  }),
}

export default function Flow({ nodes = [], compact = false }) {
  return (
    <motion.ol
      className={`flow ${compact ? 'flow--compact' : ''}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      aria-label="Flow diagram"
    >
      {nodes.map((n, i) => {
        const c = COLORS[n.color] || COLORS.blue
        return (
          <li key={i} className="flow__item">
            {i > 0 && (
              <motion.span
                className="flow__arrow"
                aria-hidden="true"
                initial={{ opacity: 0, scaleY: 0 }}
                whileInView={{ opacity: 1, scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.22 - 0.1, duration: 0.35 }}
              >
                <svg viewBox="0 0 24 34" width="22" height="32">
                  <line x1="12" y1="2" x2="12" y2="22" stroke={c.dot} strokeWidth="3" strokeLinecap="round" strokeDasharray="1 7" />
                  <path d="M5 24 L12 32 L19 24" fill="none" stroke={c.dot} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.span>
            )}
            <motion.span
              className="flow__node"
              style={{ background: c.bg, color: c.ink }}
              custom={i}
              variants={nodeVariants}
              whileHover={{ scale: 1.05, rotate: -1 }}
            >
              <span className="flow__dot" style={{ background: c.dot }} aria-hidden="true" />
              <span className="flow__label">{n.label}</span>
              {n.sub && <span className="flow__sub">{n.sub}</span>}
            </motion.span>
          </li>
        )
      })}
    </motion.ol>
  )
}
