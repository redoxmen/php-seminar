import { motion } from 'framer-motion'
import LettersScene from '../components/LettersScene.jsx'
import { goToId } from '../lib/motion.js'

// The /learn page opens with a light, friendly header — the full
// cinematic animation lives on the Home page.
export default function LearnHero() {
  return (
    <section className="learn-hero" id="top" aria-label="Welcome">
      <div className="wrap learn-hero__inner">
        <motion.span
          className="kicker"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          the interactive learning journey
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
        >
          Master <span className="learn-hero__php"><b className="c-coral">P</b><b className="c-blue">H</b><b className="c-violet">P</b></span> + MySQLi
        </motion.h1>
        <motion.p
          className="learn-hero__sub"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
        >
          Learn how PHP connects to MySQL, works with databases, retrieves records,
          handles errors, and delivers JSON.
        </motion.p>
        <motion.div
          className="cta-row"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24 }}
        >
          <button type="button" className="btn btn--coral" onClick={() => goToId('topic-intro')}>
            Start Learning
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => goToId('topics')}>
            Explore Topics
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          <LettersScene compact />
        </motion.div>
      </div>
    </section>
  )
}
