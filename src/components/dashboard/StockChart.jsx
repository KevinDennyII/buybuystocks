import { useEffect, useRef, useState } from 'react';
import { createChart, CandlestickSeries, HistogramSeries } from 'lightweight-charts';
import { useChartData } from '../../hooks/useStockData.js';
import styles from './StockChart.module.css';

const TIME_RANGES = [
  { label: '1W', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '6M', days: 180 },
];

export function StockChart({ symbol }) {
  const { data: chartData, loading: chartLoading } = useChartData(symbol);
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const [range, setRange] = useState('3M');

  useEffect(() => {
    if (!containerRef.current || !chartData.length) return;

    const container = containerRef.current;
    container.innerHTML = '';

    const chart = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,
      layout: {
        background: { color: 'transparent' },
        textColor: '#8892a8',
        fontFamily: "'DM Sans', system-ui, sans-serif",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.04)' },
        horzLines: { color: 'rgba(255,255,255,0.04)' },
      },
      crosshair: {
        mode: 0,
        vertLine: { color: 'rgba(94, 234, 212, 0.3)', width: 1, style: 2 },
        horzLine: { color: 'rgba(94, 234, 212, 0.3)', width: 1, style: 2 },
      },
      timeScale: {
        borderColor: 'rgba(255,255,255,0.08)',
        timeVisible: false,
      },
      rightPriceScale: {
        borderColor: 'rgba(255,255,255,0.08)',
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
    });

    chart.priceScale('volume').applyOptions({
      scaleMargins: { top: 0.85, bottom: 0 },
    });

    const selectedRange = TIME_RANGES.find((r) => r.label === range);
    const sliceStart = Math.max(0, chartData.length - (selectedRange?.days ?? 90));
    const slicedData = chartData.slice(sliceStart);

    candleSeries.setData(slicedData);
    volumeSeries.setData(
      slicedData.map((d) => ({
        time: d.time,
        value: d.volume,
        color: d.close >= d.open ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
      }))
    );

    chart.timeScale().fitContent();
    chartRef.current = chart;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        chart.applyOptions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  }, [chartData, range]);

  if (!symbol) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.empty}>Select a stock to view its chart</div>
      </div>
    );
  }

  if (chartLoading && !chartData.length) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.empty}>Loading chart data for {symbol}...</div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <span className={styles.symbolLabel}>{symbol}</span>
        <div className={styles.timeButtons}>
          {TIME_RANGES.map((r) => (
            <button
              key={r.label}
              className={`${styles.timeBtn} ${range === r.label ? styles.timeBtnActive : ''}`}
              onClick={() => setRange(r.label)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <div ref={containerRef} className={styles.chartContainer} />
    </div>
  );
}
