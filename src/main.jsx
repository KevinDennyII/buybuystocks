import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { AppLayout } from './layouts/AppLayout.jsx';
import './styles/global.css';

const DashboardPage = lazy(() =>
  import('./pages/DashboardPage.jsx').then((m) => ({ default: m.DashboardPage }))
);
const PortfolioPage = lazy(() =>
  import('./pages/PortfolioPage.jsx').then((m) => ({ default: m.PortfolioPage }))
);
const AlertsPage = lazy(() =>
  import('./pages/AlertsPage.jsx').then((m) => ({ default: m.AlertsPage }))
);
const WatchlistPage = lazy(() =>
  import('./pages/WatchlistPage.jsx').then((m) => ({ default: m.WatchlistPage }))
);

const Loading = () => (
  <div style={{ padding: '3rem', textAlign: 'center', color: '#8892a8' }}>Loading...</div>
);

const rootElement = document.getElementById('root');

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Suspense fallback={<Loading />}><DashboardPage /></Suspense>} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="/portfolio" element={<Suspense fallback={<Loading />}><PortfolioPage /></Suspense>} />
            <Route path="/alerts" element={<Suspense fallback={<Loading />}><AlertsPage /></Suspense>} />
            <Route path="/watchlist" element={<Suspense fallback={<Loading />}><WatchlistPage /></Suspense>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
