import tradeJournal from '../data/tradeJournal.json';
import { TradeJournal } from '../components/journal/TradeJournal.jsx';
import { JournalDisclaimer } from '../components/journal/JournalDisclaimer.jsx';

export function JournalPage() {
  return (
    <>
      <TradeJournal data={tradeJournal} />
      <JournalDisclaimer />
    </>
  );
}
