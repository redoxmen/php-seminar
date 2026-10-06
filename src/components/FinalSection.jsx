import { motion } from 'framer-motion'
import { Sparkle } from './Characters.jsx'

export default function FinalSection() {
  const toTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <section className="finale" aria-label="The end">
      <motion.div
        className="finale__inner wrap"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
      >
        <motion.div className="finale__php" variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
          {['P', 'H', 'P'].map((ch, i) => (
            <motion.b
              key={i}
              className={`finale__letter ${['c-coral', 'c-blue', 'c-violet'][i]}`}
              initial={{ y: 90, opacity: 0, rotate: [-8, 0, 8][i] }}
              whileInView={{ y: 0, opacity: 1, rotate: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ delay: 0.15 + i * 0.16, type: 'spring', stiffness: 170, damping: 13 }}
              whileHover={{ y: -14, rotate: i % 2 ? 4 : -4 }}
            >
              {ch}
            </motion.b>
          ))}
          <Sparkle size={30} color="#FFC93C" className="finale__spark finale__spark--1" />
          <Sparkle size={20} color="#7ED0F5" className="finale__spark finale__spark--2" />
          <Sparkle size={24} color="#C9A6FF" className="finale__spark finale__spark--3" />
        </motion.div>

        <motion.p className="finale__tag" variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { delay: 0.5 } } }}>
          From PHP to MySQL to JSON
        </motion.p>
        <motion.h2 variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { delay: 0.62 } } }}>
          Ready to explore?
        </motion.h2>
        <motion.button
          type="button"
          className="btn btn--coral btn--lg"
          variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { delay: 0.74 } } }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.97 }}
          onClick={toTop}
        >
          Start Again ↑
        </motion.button>
      </motion.div>
    </section>
  )
}
