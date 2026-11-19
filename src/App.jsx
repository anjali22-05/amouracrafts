import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import PaymentModal from './components/PaymentModal';
import InvoiceModal from './components/InvoiceModal';
import FloatingWhatsApp from './components/FloatingWhatsApp';

import Home from './pages/Home';
import Candles from './pages/Candles';
import ResinArt from './pages/ResinArt';
import Plants from './pages/Plants';
import About from './pages/About';
import ReviewsPage from './pages/ReviewsPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  const location = useLocation();

  // Scroll to top on route change unless hash is present
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-amoura-bg text-amoura-cream selection:bg-amoura-gold selection:text-amoura-dark">
      {/* Announcement bar at the top */}
      <AnnouncementBar />

      {/* Main Navbar */}
      <Navbar />

      {/* Dynamic Page Router */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/candles" element={<Candles />} />
          <Route path="/resin-art" element={<ResinArt />} />
          <Route path="/plants" element={<Plants />} />
          <Route path="/about" element={<About />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {/* Footer (Rendered on all pages) */}
      <Footer />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <CheckoutModal />
      <PaymentModal />
      <InvoiceModal />

      {/* Floating WhatsApp Action Pill */}
      {!isAdminRoute && <FloatingWhatsApp />}
    </div>
  );
}
