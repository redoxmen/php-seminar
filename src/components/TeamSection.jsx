import { motion } from 'framer-motion'
import { team } from '../data/team.js'
import { Avatar, boyHair, girlHair, budHair, Sparkle } from './Characters.jsx'

const HAIRS = { boy: boyHair, girl: girlHair, bud: budHair }

export default function TeamSection() {
  return (
    <section id="team" className="team" aria-labelledby="team-title">
      <div className="wrap">
        <motion.div
          className="team__head"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <span className="kicker">the humans behind the cartoon</span>
          <h2 id="team-title">Meet the <span className="accent-violet">Team</span></h2>
          <p className="section-sub">Three friends, one database, zero boring documentation.</p>
        </motion.div>

        <div className="team__grid">
          {team.map((m, i) => (
            <motion.article
              key={m.id}
              className="tcard tcard--section"
              style={{ '--accent': m.color }}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 160, damping: 19 }}
              whileHover={{ y: -8, rotate: i % 2 ? 1 : -1 }}
            >
              <Sparkle size={18} color="#FFC93C" className="tcard__spark" />
              <span className="tcard__avatar" style={{ background: `${m.color}1A` }}>
                <Avatar hair={HAIRS[m.avatar] || boyHair} shirt={m.color} />
              </span>
              <h4>{m.name}</h4>
              <span className="tcard__role">{m.role}</span>
              <p>{m.about}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
