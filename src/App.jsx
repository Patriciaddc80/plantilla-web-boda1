import HeroCard from './sections/HeroCard'
import CountdownCard from './sections/CountdownCard'
import AboutCard from './sections/AboutCard'
import StorySlider from './sections/StorySlider'
import GodparentsCard from './sections/GodparentsCard'
import TimelineCard from './sections/TimelineCard'
import GalleryCard from './sections/GalleryCard'
import RSVPCard from './sections/RSVPCard'
import GiftsCard from './sections/GiftsCard'
import FooterCard from './sections/FooterCard'

export default function App() {
  return (
    <main className="w-full overflow-x-hidden">
      <HeroCard />
      <div className="py-4 md:py-12"><CountdownCard /></div>
      <div className="py-4 md:py-12"><AboutCard /></div>
      <div className="py-4 md:py-12"><StorySlider /></div>
      <div className="py-4 md:py-12"><GodparentsCard /></div>
      <div className="py-4 md:py-12"><TimelineCard /></div>
      <div className="py-2 md:py-12"><GalleryCard /></div>
      <div className="py-4 md:py-12"><RSVPCard /></div>
      <div className="py-4 md:py-12"><GiftsCard /></div>
      <FooterCard />
    </main>
  )
}
