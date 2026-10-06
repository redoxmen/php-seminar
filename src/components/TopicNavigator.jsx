import { motion } from 'framer-motion'
import { lessons } from '../data/lessons.js'

function goTo(id) {
  const el = document.getElementById(id)
  if (!el) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
}

export default function TopicNavigator() {
  return (
    <section id="topics" className="navi" aria-label="Topic navigation">
      <div className="wrap">
        <motion.div
          className="navi__head"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <span className="kicker">17 bite-size lessons</span>
          <h2>The Learning <span className="accent-coral">Journey</span></h2>
          <p className="section-sub">
            Scroll the story or jump straight to a topic — every lesson is a small
            scene with code you can copy.
          </p>
        </motion.div>

        <motion.ol
          className="navi__grid"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {lessons.map((l, i) => (
            <motion.li
              key={l.id}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 6) * 0.06, type: 'spring', stiffness: 170, damping: 20 }}
              whileHover={{ y: -6, rotate: i % 2 ? 0.8 : -0.8 }}
            >
              <button
                type="button"
                className={`navi__card navi__card--${['coral', 'blue', 'violet'][i % 3]}`}
                onClick={() => goTo(`topic-${l.id}`)}
              >
                <b>{l.num}</b>
                <span>{l.title}</span>
              </button>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  )
}
