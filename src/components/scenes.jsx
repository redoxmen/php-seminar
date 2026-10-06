import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CodeBlock from './CodeBlock.jsx'
import { Boy, Girl, Bud, Debugger, Guard, Sparkle } from './Characters.jsx'

const rise = {
  hidden: { opacity: 0, y: 34 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, type: 'spring', stiffness: 140, damping: 19 },
  }),
}

const Row = ({ children, className = '' }) => (
  <motion.div
    className={`scene-row ${className}`}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.25 }}
  >
    {children}
  </motion.div>
)

/* ============================== CRUD ============================== */

const CRUD = [
  {
    k: 'C', name: 'CREATE', sql: 'INSERT', color: 'coral',
    text: 'Add a brand-new record to a table.',
    code: "INSERT INTO students\n(name, age)\nVALUES ('Arun', 20)",
    icon: (
      <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
    ),
  },
  {
    k: 'R', name: 'READ', sql: 'SELECT', color: 'blue',
    text: 'Fetch and display records from a table.',
    code: 'SELECT * FROM students\nWHERE age > 18',
    icon: (
      <svg viewBox="0 0 24 24"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" fill="none" stroke="currentColor" strokeWidth="2.4" /><circle cx="12" cy="12" r="2.6" fill="currentColor" /></svg>
    ),
  },
  {
    k: 'U', name: 'UPDATE', sql: 'UPDATE', color: 'violet',
    text: 'Change the value of existing records.',
    code: "UPDATE students\nSET age = 21\nWHERE id = 2",
    icon: (
      <svg viewBox="0 0 24 24"><path d="M4 20l1-5L16.5 3.5a2.1 2.1 0 013 3L8 18l-4 2z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" /></svg>
    ),
  },
  {
    k: 'D', name: 'DELETE', sql: 'DELETE', color: 'ink',
    text: 'Remove records you no longer need.',
    code: 'DELETE FROM students\nWHERE id = 3',
    icon: (
      <svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6.5 7l1 13h9l1-13M10 11v6M14 11v6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    ),
  },
]

export function CrudScene() {
  return (
    <Row className="crud">
      {CRUD.map((c, i) => (
        <motion.article
          key={c.name}
          className={`crud__card crud__card--${c.color}`}
          custom={i}
          variants={rise}
          whileHover={{ y: -8, rotate: i % 2 ? 1.2 : -1.2 }}
        >
          <header className="crud__head">
            <span className="crud__letter">{c.k}</span>
            <span className="crud__icon">{c.icon}</span>
          </header>
          <h4>{c.name}</h4>
          <span className="crud__sql">{c.sql}</span>
          <p>{c.text}</p>
          <pre className="crud__code"><code>{c.code}</code></pre>
        </motion.article>
      ))}
    </Row>
  )
}

/* ==================== PROCEDURAL VS OBJECT-ORIENTED ==================== */

export function CompareScene() {
  const left = ['mysqli_connect()', 'mysqli_query()', 'mysqli_fetch_assoc()', 'mysqli_close()']
  const right = ['new mysqli()', '$conn->query()', '$result->fetch_assoc()', '$conn->close()']
  return (
    <Row className="compare">
      <motion.div className="compare__col" custom={0} variants={rise} whileHover={{ y: -6 }}>
        <header className="compare__head compare__head--coral">
          <Boy className="compare__kid" mood="strain" />
          <div>
            <h4>Procedural</h4>
            <p>Plain functions</p>
          </div>
        </header>
        <ul>
          {left.map((f) => <li key={f}><code>{f}</code></li>)}
        </ul>
      </motion.div>

      <div className="compare__mid" aria-hidden="true">
        <motion.span className="compare__vs" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.35 }}>
          SAME&nbsp;DB
        </motion.span>
      </div>

      <motion.div className="compare__col" custom={1} variants={rise} whileHover={{ y: -6 }}>
        <header className="compare__head compare__head--violet">
          <Girl className="compare__kid" />
          <div>
            <h4>Object-Oriented</h4>
            <p>Methods on an object</p>
          </div>
        </header>
        <ul>
          {right.map((f) => <li key={f}><code>{f}</code></li>)}
        </ul>
      </motion.div>

      <motion.div className="compare__bridge" custom={2} variants={rise}>
        <span className="compare__wire compare__wire--l" aria-hidden="true" />
        <span className="compare__wire compare__wire--r" aria-hidden="true" />
        <motion.span
          className="compare__mysql"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 170, damping: 14 }}
          whileHover={{ scale: 1.06 }}
        >
          <Sparkle size={16} color="#FFC93C" style={{ position: 'absolute', top: -9, right: -7 }} />
          MySQL
          <small>one and the same database</small>
        </motion.span>
      </motion.div>
    </Row>
  )
}

/* ============================== ERRORS ============================== */

const ERRORS = [
  { name: 'Connection Error', detail: 'MySQL is not running, or wrong host/user.', color: 'coral' },
  { name: 'SQL Query Error', detail: 'A typo in your SQL syntax.', color: 'blue' },
  { name: 'Unknown Database', detail: 'The database name does not exist.', color: 'violet' },
  { name: 'Unknown Table', detail: 'The table name is misspelled.', color: 'blue' },
  { name: 'Unknown Column', detail: 'That column is not in the table.', color: 'coral' },
]

export function ErrorScene() {
  return (
    <Row className="errors">
      <motion.div className="errors__debugger" custom={0} variants={rise}>
        <motion.div
          animate={{ rotate: [0, -4, 0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        >
          <Debugger className="errors__kid" />
        </motion.div>
        <span className="errors__badge">on the case!</span>
      </motion.div>

      <div className="errors__list">
        {ERRORS.map((e, i) => (
          <motion.div key={e.name} className={`errors__chip errors__chip--${e.color}`} custom={i + 1} variants={rise} whileHover={{ x: 6 }}>
            <span className="errors__name">{e.name}</span>
            <span className="errors__detail">{e.detail}</span>
          </motion.div>
        ))}
        <motion.div className="errors__fns" custom={6} variants={rise}>
          <code>mysqli_connect_error()</code>
          <span>connection problems</span>
          <code>mysqli_error($conn)</code>
          <span>query problems</span>
        </motion.div>
      </div>
    </Row>
  )
}

/* ============================== SECURITY ============================== */

export function SecurityScene() {
  return (
    <Row className="sec">
      <motion.div className="sec__guard" custom={0} variants={rise}>
        <motion.div animate={{ y: [0, -7, 0] }} transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}>
          <Guard className="sec__kid" />
        </motion.div>
        <span className="sec__badge">keeping watch</span>
      </motion.div>

      <div className="sec__duel">
        <motion.article className="sec__card sec__card--unsafe" custom={1} variants={rise} whileHover={{ y: -6 }}>
          <header><span className="sec__mark">✕</span> Unsafe SQL</header>
          <pre><code>{`$sql = "SELECT * FROM users\nWHERE name = '$user'";`}</code></pre>
          <p className="sec__payload">
            Hacker types: <code>' OR '1'='1</code> → the query returns <b>every user</b>. That is <b>SQL injection</b>.
          </p>
        </motion.article>

        <motion.span className="sec__vs" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 220, damping: 12, delay: 0.3 }}>VS</motion.span>

        <motion.article className="sec__card sec__card--safe" custom={2} variants={rise} whileHover={{ y: -6 }}>
          <header><span className="sec__mark sec__mark--ok">✓</span> Prepared Statement</header>
          <pre><code>{`$stmt = mysqli_prepare($conn,\n  "SELECT * FROM users\n   WHERE name = ?");\nmysqli_stmt_bind_param($stmt, "s", $user);`}</code></pre>
          <p>SQL and data travel <b>separately</b> — input can never rewrite the query.</p>
        </motion.article>
      </div>

      <motion.div className="sec__flow" custom={3} variants={rise}>
        {['User Input', 'Prepared Statement', 'MySQL'].map((s, i) => (
          <span className="sec__step" key={s}>
            {i > 0 && <b className="sec__step-arrow" aria-hidden="true">→</b>}
            <span className={`sec__pill sec__pill--${i}`}>{s}</span>
          </span>
        ))}
      </motion.div>
    </Row>
  )
}

/* ============================== JSON ============================== */

export function JsonScene() {
  return (
    <Row className="json">
      <motion.div className="json__encode" custom={0} variants={rise}>
        <div className="json__chip json__chip--coral">PHP Array<br /><code>{'["name" => "Arun"]'}</code></div>
        <motion.span className="json__fn" whileHover={{ scale: 1.08 }} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.25 }}>
          json_encode()<i aria-hidden="true">↓</i>
        </motion.span>
        <div className="json__chip json__chip--violet">JSON<br /><code>{'{ "name": "Arun" }'}</code></div>
        <motion.span className="json__fn" whileHover={{ scale: 1.08 }} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.45 }}>
          any app<i aria-hidden="true">↓</i>
        </motion.span>
        <div className="json__chip json__chip--blue">JavaScript · Flutter · Mobile</div>
      </motion.div>

      <motion.div className="json__rules" custom={1} variants={rise}>
        <div className="json__rule">
          <span className="json__dir json__dir--out">PHP → JSON</span>
          <code>json_encode()</code>
        </div>
        <div className="json__rule">
          <span className="json__dir json__dir--in">JSON → PHP</span>
          <code>json_decode()</code>
        </div>
        <Boy className="json__kid" mood="proud" />
      </motion.div>
    </Row>
  )
}

/* ============================== API ============================== */

export function ApiScene() {
  const steps = ['Browser / App', 'HTTP Request', 'PHP', 'MySQLi', 'MySQL', 'PHP', 'JSON Response', 'Browser / App']
  const accents = ['blue', 'coral', 'violet', 'blue', 'violet', 'violet', 'coral', 'blue']
  return (
    <Row className="api">
      <motion.div className="api__pipe" custom={0} variants={rise}>
        {steps.map((s, i) => (
          <motion.span
            key={i}
            className={`api__node api__node--${accents[i]}`}
            custom={i}
            variants={rise}
            whileHover={{ scale: 1.07, y: -3 }}
          >
            {s}
            {i < steps.length - 1 && <b aria-hidden="true">→</b>}
          </motion.span>
        ))}
      </motion.div>

      <div className="api__demo">
        <motion.div className="api__request" custom={1} variants={rise}>
          <span className="api__url"><b>GET</b> /students.php</span>
          <Girl className="api__kid" />
        </motion.div>
        <motion.span className="api__arrow" initial={{ opacity: 0, y: -8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} aria-hidden="true">↓</motion.span>
        <CodeBlock
          label="response · application/json"
          lang="json"
          code={`[
  { "id": 1, "name": "Arun",  "age": 20 },
  { "id": 2, "name": "Diya",  "age": 21 },
  { "id": 3, "name": "Kumar", "age": 19 }
]`}
        />
      </div>
    </Row>
  )
}

/* ============================== PDO TABLE ============================== */

export function PdoScene() {
  const rows = [
    ['Databases', 'MySQL only', 'MySQL, PostgreSQL, SQLite +9 more'],
    ['API style', 'Procedural + OOP', 'Object-oriented only'],
    ['Placeholders', '?  (positional)', ':name  (named) + ?'],
    ['Named example', '—', "':name' bound by name"],
  ]
  return (
    <Row className="pdo">
      <motion.table className="pdo__table" custom={0} variants={rise}>
        <thead>
          <tr>
            <th />
            <th className="pdo__mysqli">MySQLi</th>
            <th className="pdo__pdo">PDO</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]}>
              <th scope="row">{r[0]}</th>
              <td>{r[1]}</td>
              <td>{r[2]}</td>
            </tr>
          ))}
        </tbody>
      </motion.table>
      <motion.p className="pdo__note" custom={1} variants={rise}>
        <Bud className="pdo__kid" /> Same job, different superpowers — pick one and learn it well.
      </motion.p>
    </Row>
  )
}

/* ============================== BEST PRACTICES ============================== */

const PRACTICES = [
  { icon: '🛡️', title: 'Prepared statements, always', text: 'Every query with user input goes through ? placeholders.' },
  { icon: '🧼', title: 'Validate user input', text: 'Check types and lengths before data reaches SQL.' },
  { icon: '🌍', title: 'Use utf8mb4', text: 'Full Unicode support — names, emoji and everything.' },
  { icon: '🚪', title: 'Close connections', text: 'mysqli_close($conn) when you are done with the database.' },
  { icon: '🔦', title: 'Errors: dev only', text: 'Show detailed errors locally; log them quietly in production.' },
  { icon: '🔑', title: 'Least-privilege user', text: 'The app account needs SELECT/INSERT — not DROP DATABASE.' },
  { icon: '🗂️', title: 'Config file', text: 'Keep credentials out of your code and out of Git.' },
  { icon: '📏', title: 'LIMIT your queries', text: 'Never SELECT * on big tables in production code.' },
]

export function BestScene() {
  return (
    <Row className="best">
      {PRACTICES.map((p, i) => (
        <motion.article key={p.title} className="best__card" custom={i % 4} variants={rise} whileHover={{ y: -6, rotate: i % 2 ? 0.8 : -0.8 }}>
          <span className="best__emoji" aria-hidden="true">{p.icon}</span>
          <h4>{p.title}</h4>
          <p>{p.text}</p>
        </motion.article>
      ))}
    </Row>
  )
}

/* ============================== VIVA ============================== */

const VIVA = [
  ['What is MySQLi?', 'MySQL Improved — a PHP extension used to communicate with MySQL databases. It replaces the old mysql_* functions.'],
  ['MySQLi vs PDO?', 'MySQLi works only with MySQL but offers procedural + OOP styles. PDO supports many databases and is OOP-only.'],
  ['What does mysqli_connect() return?', 'A connection link on success, or false on failure.'],
  ['fetch_assoc() vs fetch_all()?', 'fetch_assoc() returns one row at a time; fetch_all(MYSQLI_ASSOC) returns every row in one array.'],
  ['What is a prepared statement?', 'A pre-compiled SQL template with ? placeholders — data is bound later, separately, which prevents SQL injection.'],
  ['What is SQL injection?', 'A trick where malicious user input becomes part of the SQL query, e.g. \' OR \'1\'=\'1, exposing or destroying data.'],
  ['What does json_encode() do?', 'Converts a PHP array or object into a JSON text string.'],
  ['Which header is sent before JSON output?', 'header("Content-Type: application/json");'],
  ['Procedural vs object-oriented MySQLi?', 'Procedural uses functions like mysqli_query($conn, ...); OOP uses $conn->query(...). Both do the same job.'],
  ['What does CRUD stand for?', 'Create, Read, Update, Delete — implemented with INSERT, SELECT, UPDATE and DELETE.'],
]

export function VivaScene() {
  const [open, setOpen] = useState(0)
  return (
    <Row className="viva">
      <div className="viva__list">
        {VIVA.map(([q, a], i) => {
          const isOpen = open === i
          return (
            <motion.div key={q} className={`viva__item ${isOpen ? 'is-open' : ''}`} custom={i % 5} variants={rise}>
              <button
                type="button"
                className="viva__q"
                aria-expanded={isOpen}
                aria-controls={`viva-a-${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span className="viva__num">Q{i + 1}</span>
                <span className="viva__question">{q}</span>
                <span className="viva__chev" aria-hidden="true">{isOpen ? '–' : '+'}</span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`viva-a-${i}`}
                    className="viva__a"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: 'easeInOut' }}
                  >
                    <p>{a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
      <motion.div className="viva__buddy" custom={2} variants={rise} aria-hidden="true">
        <Bud className="viva__kid" mood="proud" />
        <span className="viva__tip">tap a question!</span>
      </motion.div>
    </Row>
  )
}

/* ============================== STEPS ============================== */

export function StepsRow({ steps = [] }) {
  return (
    <motion.ol className="steps" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}>
      {steps.map((s, i) => (
        <motion.li key={s} className="steps__item" custom={i} variants={rise} whileHover={{ y: -4 }}>
          <span className="steps__n">{i + 1}</span>
          {s}
          {i < steps.length - 1 && <b className="steps__arrow" aria-hidden="true">→</b>}
        </motion.li>
      ))}
    </motion.ol>
  )
}
