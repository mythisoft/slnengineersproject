import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public Layout & Pages
import PublicLayout from './components/common/PublicLayout';
import ScrollToTop from './components/common/ScrollToTop';
import Home from './pages/public/Home';
import AboutUs from './pages/public/AboutUs';
import Services from './pages/public/Services';
import Portfolio from './pages/public/Portfolio';
import ProjectDetail from './pages/public/ProjectDetail';
import CustomerReviews from './pages/public/CustomerReviews';
import ScanReview from './pages/public/ScanReview';
import ContactUs from './pages/public/ContactUs';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import TermsOfService from './pages/public/TermsOfService';

// Admin Layout & Pages
import AdminLogin from './pages/admin/Login';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Enquiries from './pages/admin/Enquiries';
import ProjectsManager from './pages/admin/ProjectsManager';
import ServicesManager from './pages/admin/ServicesManager';
import QrManager from './pages/admin/QrManager';
import ReviewsModeration from './pages/admin/ReviewsModeration';
import SocialManager from './pages/admin/SocialManager';
import CustomerDirectory from './pages/admin/CustomerDirectory';
import CompanySettingsPage from './pages/admin/CompanySettingsPage';
import AuditLogsPage from './pages/admin/AuditLogsPage';
import BannersManager from './pages/admin/BannersManager';
import TrustMetricsManager from './pages/admin/TrustMetricsManager';
import TransformationsManager from './pages/admin/TransformationsManager';
import PillarCardsManager from './pages/admin/PillarCardsManager';
import AboutUsManager from './pages/admin/AboutUsManager';
import HomePageManager from './pages/admin/HomePageManager';
import NavbarManager from './pages/admin/NavbarManager';
import ContactPageManager from './pages/admin/ContactPageManager';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      {/* Public Pages */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="services" element={<Services />} />
        <Route path="projects" element={<Portfolio />} />
        <Route path="projects/:slug" element={<ProjectDetail />} />
        <Route path="reviews" element={<CustomerReviews />} />
        <Route path="review" element={<ScanReview isUniversal={true} />} />
        <Route path="scan-review" element={<ScanReview isUniversal={true} />} />
        <Route path="scan-review/:token" element={<ScanReview />} />
        <Route path="contact" element={<ContactUs />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms-of-service" element={<TermsOfService />} />
      </Route>

      {/* Admin & Super Admin Authentication Portals */}
      <Route path="/admin/login" element={<AdminLogin forcedRole="admin" />} />
      <Route path="/superadmin/login" element={<AdminLogin forcedRole="superadmin" />} />

      {/* Protected Admin Portal */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="enquiries" element={<Enquiries />} />
        <Route path="projects" element={<ProjectsManager />} />
        <Route path="services" element={<ServicesManager />} />
        <Route path="home" element={<HomePageManager />} />
        <Route path="navbar" element={<NavbarManager />} />
        <Route path="banners" element={<BannersManager />} />
        <Route path="pillar-cards" element={<PillarCardsManager />} />
        <Route path="about" element={<AboutUsManager />} />
        <Route path="contact" element={<ContactPageManager />} />
        <Route path="trust-metrics" element={<TrustMetricsManager />} />
        <Route path="transformations" element={<Navigate to="/admin/projects" replace />} />
        <Route path="qr-codes" element={<QrManager />} />
        <Route path="reviews" element={<ReviewsModeration />} />
        <Route path="social" element={<SocialManager />} />
        <Route path="customers" element={<CustomerDirectory />} />
        <Route path="settings" element={<CompanySettingsPage />} />
        <Route path="audit-logs" element={<AuditLogsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}
