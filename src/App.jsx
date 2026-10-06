import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LearnPage from './pages/LearnPage.jsx'

export default function App() {
  const { pathname } = useLocation()

  // each experience starts at its own top
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0)
  }, [pathname])

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/learn" element={<LearnPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
