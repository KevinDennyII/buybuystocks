import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchWatchlist,
  fetchQuote,
  fetchChartData,
  fetchPortfolio,
  fetchPositions,
  fetchAccountHistory,
  fetchCumulativePnL,
  fetchStockPnL,
  fetchNews,
  fetchCorporateActions,
  fetchAlerts,
  fetchPennyStocks,
} from '../services/stockApi.js';
import {
  loadWatchlist,
  addToWatchlist as storeAdd,
  removeFromWatchlist as storeRemove,
  updateStance as storeUpdateStance,
  updateNotes as storeUpdateNotes,
  moveItem as storeMove,
  resetWatchlist as storeReset,
  saveWatchlist as storeSave,
} from '../services/watchlistStore.js';

export function useWatchlist() {
  const [symbolList, setSymbolList] = useState(() => loadWatchlist());
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  const refresh = useCallback(async (symbols) => {
    setLoading(true);
    const data = await fetchWatchlist(symbols ?? loadWatchlist());
    if (mountedRef.current) {
      setStocks(data);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    refresh(symbolList);
    return () => { mountedRef.current = false; };
  }, [symbolList, refresh]);

  const addSymbol = useCallback((symbol, stance = 'Active') => {
    const updated = storeAdd(symbol, stance);
    setSymbolList([...updated]);
  }, []);

  const removeSymbol = useCallback((symbol) => {
    const updated = storeRemove(symbol);
    setSymbolList([...updated]);
  }, []);

  const changeStance = useCallback((symbol, stance) => {
    const updated = storeUpdateStance(symbol, stance);
    setSymbolList([...updated]);
  }, []);

  const changeNotes = useCallback((symbol, notes) => {
    const updated = storeUpdateNotes(symbol, notes);
    setSymbolList([...updated]);
  }, []);

  const moveUp = useCallback((index) => {
    if (index <= 0) return;
    const updated = storeMove(index, index - 1);
    setSymbolList([...updated]);
  }, []);

  const moveDown = useCallback((index) => {
    setSymbolList((prev) => {
      if (index >= prev.length - 1) return prev;
      const updated = storeMove(index, index + 1);
      return [...updated];
    });
  }, []);

  const reorder = useCallback((fromIndex, toIndex) => {
    setSymbolList((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      storeSave(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    const updated = storeReset();
    setSymbolList([...updated]);
  }, []);

  const isWatching = useCallback((symbol) => {
    return symbolList.some((s) => s.symbol === symbol);
  }, [symbolList]);

  return {
    stocks,
    symbolList,
    loading,
    refresh: () => refresh(),
    addSymbol,
    removeSymbol,
    changeStance,
    changeNotes,
    moveUp,
    moveDown,
    reorder,
    reset,
    isWatching,
    count: symbolList.length,
  };
}

export function useQuote(symbol) {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!symbol) return;
    let cancelled = false;
    setLoading(true);
    fetchQuote(symbol).then((data) => {
      if (!cancelled) {
        setQuote(data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [symbol]);

  return { quote, loading };
}

export function useChartData(symbol) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!symbol) return;
    let cancelled = false;
    setLoading(true);
    fetchChartData(symbol).then((result) => {
      if (!cancelled) {
        setData(result);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [symbol]);
  return { data, loading };
}

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState(null);
  useEffect(() => { setPortfolio(fetchPortfolio()); }, []);
  return portfolio;
}

export function usePositions() {
  const [positions, setPositions] = useState([]);
  useEffect(() => { setPositions(fetchPositions()); }, []);
  return positions;
}

export function useAccountHistory() {
  const [data, setData] = useState([]);
  useEffect(() => { setData(fetchAccountHistory()); }, []);
  return data;
}

export function useCumulativePnL() {
  const [data, setData] = useState([]);
  useEffect(() => { setData(fetchCumulativePnL()); }, []);
  return data;
}

export function useStockPnL() {
  const [data, setData] = useState([]);
  useEffect(() => { setData(fetchStockPnL()); }, []);
  return data;
}

export function useNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    fetchNews().then((result) => {
      if (!cancelled) {
        setNews(result);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);
  return { news, loading };
}

export function useCorporateActions() {
  const [actions, setActions] = useState([]);
  useEffect(() => { setActions(fetchCorporateActions()); }, []);
  return actions;
}

export function useAlerts() {
  const [alerts, setAlerts] = useState([]);
  useEffect(() => { setAlerts(fetchAlerts()); }, []);

  const addAlert = useCallback((alert) => {
    setAlerts((prev) => [
      ...prev,
      { ...alert, id: Date.now(), active: true, createdAt: new Date().toISOString().slice(0, 10) },
    ]);
  }, []);

  const toggleAlert = useCallback((id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  }, []);

  const removeAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return { alerts, addAlert, toggleAlert, removeAlert };
}

export function usePennyStocks() {
  const [stocks, setStocks] = useState([]);
  useEffect(() => { setStocks(fetchPennyStocks()); }, []);
  return stocks;
}
