# PHP • MySQLi — Interactive Cartoon Learning Website

A premium, interactive learning website for a college project on the
**PHP – MySQLi extension**. Two experiences, one site:

| Route   | Experience                                                                 |
|---------|----------------------------------------------------------------------------|
| `/`     | Cinematic **scroll-controlled PHP animation** (100 extracted keyframes)     |
| `/learn`| The full interactive learning journey (17 topics, code, scenes, team, viva) |

## Run it

```bash
npm install
npm run dev        # development  → http://localhost:5173
npm run build      # production build → dist/
npm run preview    # serve the production build → http://localhost:4173
```

## The Home animation

The 10-second PHP cartoon video was converted into **300 WebP keyframes — the
full 30 fps of the source video** (`public/assets/php-frames/frame-001.webp …
frame-300.webp`, extracted with ffmpeg). Scrolling is the timeline:

- scroll **down** → animation plays forward, scroll **up** → it plays backwards
- frames **hard-cut** like real video (adjacent frames are 1/30 s apart, so no
  blending is needed — no ghosting, no flashing)
- a three-layer engine flips only to frames that have fully **loaded**
  (`load`-event gated), so the screen can never flash white
- the displayed position is smoothed with a rAF lerp — stop scrolling and the
  animation freezes exactly where it is (never autoplays)
- a rolling preload window keeps ±45 frames around the current position cached
- near the end, **“PHP • MySQLi” / “From PHP to MySQL to JSON” / Start Learning →**
  reveals and navigates to `/learn`; a **▶ play button** (bottom-right)
  auto-scrolls the whole animation (click again or scroll manually to pause)
- `prefers-reduced-motion`: the smoothing lerp is disabled (direct 1:1 scrub),
  the timeline itself always stays scroll-driven
- append **`?motion`** to any URL to force full animation on machines whose OS
  reports reduced motion (e.g. Windows “animation effects” turned off)

### Re-extract frames (after replacing the video)

Put a new video at `public/assets/php-animation.mp4`, then:

```bash
npm i --no-save ffmpeg-static
node -e "
const {execSync}=require('child_process');const ff='node_modules/ffmpeg-static/ffmpeg.exe';
const N=300,D=10.0;
for(let i=0;i<N;i++){const t=(D*i/N).toFixed(4),n=String(i+1).padStart(3,'0');
execSync(\`\${ff} -y -ss \${t} -i public/assets/php-animation.mp4 -frames:v 1 -c:v libwebp -quality 78 public/assets/php-frames/frame-\${n}.webp -loglevel error\`)}"
```

(If the new video's duration differs from 10 s, change `D`; N=300 keeps the
native 30 fps.)

## Editing content

- **Topics (all 17 lessons):** `src/data/lessons.js` — each topic is one object
  (title, blurb, "in simple words", key points, code blocks, output, special scene).
- **Team members:** `src/data/team.js` — replace `Member 1/2/3` here; the navbar
  modal and the team section both read from this single structure.

## Structure

```
src/
  pages/    HomePage.jsx (cinematic intro) · LearnPage.jsx (the learning site)
  components/
    FrameSequence.jsx   100-frame two-layer scroll engine (the home hero)
    HomeAnimation.jsx   620vh sticky stage + overlays (hint / reveal)
    ScrollVideo…        removed — replaced by the frame engine
    MainNavbar.jsx      minimal floating navbar (home)
    Navbar.jsx          full navbar (learn)      TeamModal.jsx
    TopicSection.jsx    renders one lesson       TopicNavigator.jsx
    scenes.jsx          CRUD · comparison · errors · security · JSON · API ·
                        PDO · best practices · viva
    Pipeline.jsx        “How It Works” animated timeline
    CodeBlock.jsx       Prism highlighting + Copy Code button
    Characters.jsx      original SVG cartoon cast
  data/     lessons.js · team.js
  styles/   global.css (design system: coral / blue / violet on white)
```

## Notes

- The preview/dev servers need to be reachable at `localhost` — the site is a
  static SPA (Vite), no backend required.
- The site runs entirely client-side; PHP appears only inside the lesson code.
