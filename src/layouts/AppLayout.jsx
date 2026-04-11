import { Outlet } from 'react-router-dom';
import siteContent from '../data/siteContent.json';
import { Layout } from '../components/Layout.jsx';
import { Header } from '../components/Header.jsx';
import { Footer } from '../components/Footer.jsx';
import { MobileNav } from '../components/MobileNav.jsx';
import { ScrollToHash } from './ScrollToHash.jsx';

export function AppLayout() {
  return (
    <Layout>
      <ScrollToHash />
      <Header meta={siteContent.meta} nav={siteContent.nav} />
      <main className="main" id="main">
        <Outlet />
      </main>
      <MobileNav />
      <Footer footer={siteContent.footer} siteName={siteContent.meta.siteName} />
    </Layout>
  );
}
