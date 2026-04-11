import siteContent from '../data/siteContent.json';
import watchlist from '../data/watchlist.json';
import { Hero } from '../components/Hero.jsx';
import { QuickNav } from '../components/QuickNav.jsx';
import { Philosophy } from '../components/Philosophy.jsx';
import { FocusAreas } from '../components/FocusAreas.jsx';
import { Watchlist } from '../components/Watchlist.jsx';
import { Journey } from '../components/Journey.jsx';
import { Disclaimer } from '../components/Disclaimer.jsx';

export function HomePage() {
  return (
    <>
      <Hero hero={siteContent.hero} />
      <QuickNav />
      <Philosophy philosophy={siteContent.philosophy} />
      <FocusAreas focus={siteContent.focusAreas} />
      <Watchlist data={watchlist} />
      <Journey journey={siteContent.journey} />
      <Disclaimer disclaimer={siteContent.disclaimer} />
    </>
  );
}
