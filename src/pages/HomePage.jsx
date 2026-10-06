import HomeAnimation from '../components/HomeAnimation.jsx'
import MainNavbar from '../components/MainNavbar.jsx'
import PlayButton from '../components/PlayButton.jsx'

// HOME — one cinematic scene: the scroll-controlled PHP animation.
// Nothing else lives on this page. Learning starts at /learn.
export default function HomePage() {
  return (
    <div className="home">
      <MainNavbar />
      <main>
        <HomeAnimation />
      </main>
      <PlayButton />
    </div>
  )
}
