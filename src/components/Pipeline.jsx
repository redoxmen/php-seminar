import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Boy, Girl, Bud } from './Characters.jsx'

// ============================================================
//  HOW IT WORKS — the full journey:
//  USER → PHP → MySQLi → MySQL → MySQLi → PHP → ARRAY →
//  json_encode() → JSON → CLIENT
//  A vertical timeline whose spine draws itself as you scroll.
// ============================================================

const NODES = [
  { label: 'USER', sub: 'clicks a button', color: 'coral', kid: 'girl' },
  { label: 'PHP', sub: 'receives the request', color: 'violet', kid: 'boy' },
  { label: 'MySQLi', sub: 'prepares the query', color: 'blue' },
  { label: 'MySQL Database', sub: 'finds the rows', color: 'violet' },
  { label: 'MySQLi', sub: 'carries rows back', color: 'blue' },
  { label: 'PHP', sub: 'processes the data', color: 'violet', kid: 'boy' },
  { label: 'PHP Array', sub: 'rows in memory', color: 'coral' },
  { label: 'json_encode()', sub: 'packs the data', color: 'blue' },
  { label: 'JSON', sub: 'universal format', color: 'violet' },
  { label: 'Client / App', sub: 'renders the result', color: 'coral', kid: 'girl' },
]

const KIDS = { boy: Boy, girl: Girl }

export default function Pipeline() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.75', 'end 0.65'] })
  const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 })

  return (
    <section id="how-it-works" className="pipeline" ref={ref} aria-label="How PHP works with MySQL and JSON">
      <div className="pipeline__head">
        <span className="kicker">The big picture</span>
        <h2>How It <span className="accent-blue">Works</span></h2>
        <p className="section-sub">
          One request travels the whole pipeline — follow the line from the user's click
          all the way to the JSON that comes back.
        </p>
      </div>

      <div className="pipeline__track">
        <motion.span className="pipeline__spine" style={{ scaleY: lineScale }} aria-hidden="true" />
        <span className="pipeline__spine pipeline__spine--bg" aria-hidden="true" />

        {NODES.map((n, i) => {
          const Kid = KIDS[n.kid]
          return (
            <motion.div
              key={i}
              className={`pipeline__row ${i % 2 ? 'pipeline__row--r' : 'pipeline__row--l'}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ type: 'spring', stiffness: 150, damping: 19 }}
            >
              <span className={`pipeline__dot pipeline__dot--${n.color}`} aria-hidden="true">
                <motion.span
                  className="pipeline__pulse"
                  animate={{ scale: [1, 1.7], opacity: [0.5, 0] }}
                  transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                />
                {i + 1}
              </span>
              <motion.article
                className={`pcard pcard--${n.color}`}
                whileHover={{ y: -5, rotate: i % 2 ? 0.7 : -0.7 }}
              >
                <h4>{n.label}</h4>
                <p>{n.sub}</p>
              </motion.article>
              {Kid && (
                <motion.span
                  className="pipeline__kid"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3 + i * 0.2, ease: 'easeInOut' }}
                  aria-hidden="true"
                >
                  <Kid className="pipeline__kid-svg" mood={i === 1 ? 'strain' : 'proud'} />
                </motion.span>
              )}
              {i < NODES.length - 1 && <span className="pipeline__arrow" aria-hidden="true">↓</span>}
            </motion.div>
          )
        })}

        <motion.div
          className="pipeline__finale"
          initial={{ scale: 0, rotate: -6 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ type: 'spring', stiffness: 190, damping: 13 }}
        >
          🎉 Delivered!
        </motion.div>
      </div>

      <motion.div
        className="pipeline__buddy"
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 140, damping: 18 }}
        aria-hidden="true"
      >
        <Bud className="pipeline__buddy-svg" mood="proud" />
        <span>and the story repeats for every request!</span>
      </motion.div>
    </section>
  )
}
