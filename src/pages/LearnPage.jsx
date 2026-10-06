import { Fragment, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import LearnHero from '../components/LearnHero.jsx'
import TopicNavigator from '../components/TopicNavigator.jsx'
import TopicSection from '../components/TopicSection.jsx'
import Pipeline from '../components/Pipeline.jsx'
import FinalSection from '../components/FinalSection.jsx'
import Footer from '../components/Footer.jsx'
import FloatingTopics from '../components/FloatingTopics.jsx'
import { lessons } from '../data/lessons.js'

// LEARN — the full educational experience (was the old home page).
export default function LearnPage() {
  const location = useLocation()

  // support /learn#topics style deep links from the home navbar
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0)
      return undefined
    }
    const id = location.hash.slice(1)
    const t = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'auto', block: 'start' })
    }, 80)
    return () => clearTimeout(t)
  }, [location.hash])

  return (
    <>
      <a className="skip-link" href="#topics">Skip to topics</a>

      <Navbar />

      <main>
        <LearnHero />
        <TopicNavigator />

        {lessons.map((l, i) => (
          <Fragment key={l.id}>
            <TopicSection lesson={l} index={i} total={lessons.length} />
            {/* the big interactive pipeline expands lesson 12 right where it belongs */}
            {l.id === 'pipeline' && <Pipeline />}
          </Fragment>
        ))}

        <FinalSection />
      </main>

      <Footer />

      <FloatingTopics />
    </>
  )
}
