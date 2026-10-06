import { motion } from 'framer-motion'
import { lessons } from '../data/lessons.js'
import CodeBlock from './CodeBlock.jsx'
import Flow from './Flow.jsx'
import { Sparkle } from './Characters.jsx'
import {
  CrudScene, CompareScene, ErrorScene, SecurityScene, JsonScene,
  ApiScene, PdoScene, BestScene, VivaScene, StepsRow,
} from './scenes.jsx'

const SCENES = {
  crud: CrudScene,
  compare: CompareScene,
  errors: ErrorScene,
  security: SecurityScene,
  json: JsonScene,
  api: ApiScene,
  pdo: PdoScene,
  best: BestScene,
  viva: VivaScene,
}

const rise = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

function goTo(id) {
  const el = document.getElementById(id)
  if (!el) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
}

export default function TopicSection({ lesson, index, total }) {
  const accent = ['coral', 'blue', 'violet'][index % 3]
  const Scene = lesson.scene ? SCENES[lesson.scene] : null
  const prev = index > 0 ? lessons[index - 1] : null
  const next = index < total - 1 ? lessons[index + 1] : null

  return (
    <section
      id={`topic-${lesson.id}`}
      className={`topic topic--${accent} ${index % 2 ? 'topic--tint' : ''}`}
      aria-labelledby={`topic-${lesson.id}-title`}
    >
      <span className="topic__ghost" aria-hidden="true">{lesson.num}</span>
      <div className="wrap topic__inner">
        <motion.header
          className="topic__head"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.span className="topic__numbadge" variants={rise} whileHover={{ rotate: -4, scale: 1.06 }}>
            {lesson.num}
          </motion.span>
          <div>
            <motion.span className="kicker" variants={rise}>Lesson {lesson.num} / {total}</motion.span>
            <motion.h2 id={`topic-${lesson.id}-title`} variants={rise}>{lesson.title}</motion.h2>
            <motion.p className="topic__blurb" variants={rise}>{lesson.blurb}</motion.p>
          </div>
        </motion.header>

        {lesson.simple && (
          <motion.aside
            className="topic__simple"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ type: 'spring', stiffness: 150, damping: 18 }}
          >
            <Sparkle size={20} color="#FFC93C" className="topic__simple-spark" />
            <div>
              <b>In simple words</b>
              <p>{lesson.simple}</p>
            </div>
          </motion.aside>
        )}

        {lesson.points?.length > 0 && (
          <motion.ul
            className="topic__points"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
          >
            {lesson.points.map((p, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ x: 5 }}
              >
                <span className="topic__check" aria-hidden="true">✓</span>{p}
              </motion.li>
            ))}
          </motion.ul>
        )}

        <div className="topic__body">
          {lesson.flow && <Flow nodes={lesson.flow} />}
          {lesson.steps && <StepsRow steps={lesson.steps} />}
          {Scene && <Scene />}
          {lesson.code?.map((c) => (
            <CodeBlock key={c.label} label={c.label} lang={c.lang} code={c.code} />
          ))}
          {lesson.output && (
            <motion.figure
              className="topic__output"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
            >
              <figcaption>result</figcaption>
              <pre><code>{lesson.output}</code></pre>
            </motion.figure>
          )}
        </div>

        <nav className="topic__pn" aria-label="Topic navigation">
          {prev ? (
            <button type="button" className="pn pn--prev" onClick={() => goTo(`topic-${prev.id}`)}>
              <span aria-hidden="true">←</span> <span><small>Previous</small><b>{prev.title}</b></span>
            </button>
          ) : <span className="pn pn--spacer" aria-hidden="true" />}
          {next ? (
            <button type="button" className="pn pn--next" onClick={() => goTo(`topic-${next.id}`)}>
              <span><small>Next Topic</small><b>{next.title}</b></span> <span aria-hidden="true">→</span>
            </button>
          ) : (
            <button type="button" className="pn pn--next" onClick={() => goTo('team')}>
              <span><small>You did it!</small><b>Meet the Team →</b></span>
            </button>
          )}
        </nav>
      </div>
    </section>
  )
}
