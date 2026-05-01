import siteContent from '../data/siteContent.json';
import { useWatchlist } from '../hooks/useStockData.js';
import { Hero } from '../components/Hero.jsx';
import { QuickNav } from '../components/QuickNav.jsx';
import { Philosophy } from '../components/Philosophy.jsx';
import { FocusAreas } from '../components/FocusAreas.jsx';
import { Watchlist } from '../components/Watchlist.jsx';
import { Journey } from '../components/Journey.jsx';
import { Disclaimer } from '../components/Disclaimer.jsx';

export function HomePage() {
  const { symbolList } = useWatchlist();
  const watchlist = {
    title: 'Ideas & watchlist',
    description: 'Your live watchlist powers this section. Edit symbols and theses on the Watchlist page.',
    items: symbolList.slice(0, 6).map((item) => ({
      id: item.symbol,
      symbol: item.symbol,
      stance: item.stance,
      thesis: item.notes?.trim() || 'Add your thesis in Watchlist: why it belongs on your radar and what changes your conviction.',
      assetType: item.assetType || 'unknown',
    })),
  };

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
