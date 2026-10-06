import { useNavigate } from 'react-router-dom'

export default function StartLearningButton({ className = 'btn btn--coral btn--lg' }) {
  const navigate = useNavigate()
  return (
    <button type="button" className={className} onClick={() => navigate('/learn')}>
      Start Learning →
    </button>
  )
}
