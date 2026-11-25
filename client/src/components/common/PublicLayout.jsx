import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import InspectionModal, { openInspectionModal } from './InspectionModal';
import { MessageCircle } from 'lucide-react';
import { fetchApi } from '../../utils/api';

const getCachedSettings = () => {
  try {
    const raw = localStorage.getItem('sln_cached_settings');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export default function PublicLayout() {
  const [settings, setSettings] = useState(getCachedSettings);

  useEffect(() => {
    fetchApi('/settings')
      .then((res) => {
        if (res.success && res.data) {
          setSettings(res.data);
          try {
            localStorage.setItem('sln_cached_settings', JSON.stringify(res.data));
          } catch {}
        }
      })
      .catch((e) => console.error(e));

    const handleSync = (e) => {
      if (e.detail) {
        setSettings((prev) => ({ ...prev, ...e.detail }));
        try {
          localStorage.setItem('sln_cached_settings', JSON.stringify(e.detail));
        } catch {}
      }
    };
    window.addEventListener('sln_settings_updated', handleSync);
    return () => window.removeEventListener('sln_settings_updated', handleSync);
  }, []);

  // Global click listener for all inspection, site view, and audit CTAs
  useEffect(() => {
    const INSPECTION_TRIGGER_REGEX =
      /book\s*site\s*view|schedul(e)?\s*site\s*view|schudl(e)?\s*site\s*view|book\s*site\s*inspection|site\s*inspection|book\s*(diagnostic\s*)?(site\s*)?inspection|book\s*diagonstic\s*(site\s*)?inspection|book\s*inspection|book\s*site\s*audit|schedul(e)?\s*site\s*audit|schedul(e)?\s*site\s*visit|book\s*site\s*visit|request\s*inspection|request\s*site\s*survey/i;

    const handleGlobalClick = (e) => {
      const target = e.target.closest('button, a, [role="button"]');
      if (!target) return;

      // Skip submit buttons inside an actual form so forms can still submit!
      if (target.type === 'submit') return;

      const text = (target.innerText || target.textContent || '').trim();
      const ariaLabel = target.getAttribute('aria-label') || '';
      const title = target.getAttribute('title') || '';
      const href = target.getAttribute('href') || '';
      const to = target.getAttribute('to') || '';

      const isMatch =
        INSPECTION_TRIGGER_REGEX.test(text) ||
        INSPECTION_TRIGGER_REGEX.test(ariaLabel) ||
        INSPECTION_TRIGGER_REGEX.test(title) ||
        href.includes('#inspection-form') ||
        href.includes('#inspection-enquiry') ||
        to.includes('#inspection-form') ||
        to.includes('#inspection-enquiry');

      if (!isMatch) return;

      // 1. If user is on /contact and there is an on-page inspection form, scroll to it smoothly
      if (window.location.pathname === '/contact') {
        const onPageForm = document.getElementById('inspection-form');
        if (onPageForm) {
          e.preventDefault();
          e.stopPropagation();
          onPageForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const nameInput = document.getElementById('contact-customerName');
          if (nameInput) setTimeout(() => nameInput.focus(), 300);
          return;
        }
      }

      // 2. On all pages (including homepage!), open the Inspection Form Modal!
      e.preventDefault();
      e.stopPropagation();

      // Extract service name from query param or data-service if present
      let serviceName = target.getAttribute('data-service') || '';
      if (!serviceName && (href || to)) {
        try {
          const urlStr = href || to;
          const queryPart = urlStr.split('?')[1];
          if (queryPart) {
            const params = new URLSearchParams(queryPart.split('#')[0]);
            serviceName = params.get('service') || '';
          }
        } catch {}
      }

      openInspectionModal(serviceName);
    };

    document.addEventListener('click', handleGlobalClick, { capture: true });
    return () => document.removeEventListener('click', handleGlobalClick, { capture: true });
  }, []);

  const whatsapp = settings?.whatsappNumber || '+918977668776';
  const defaultMessage =
    settings?.whatsappDefaultMessage ||
    'Hello SLN Engineers, I would like to request an on-site waterproofing inspection.';
  const whatsappUrl = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-sky-500 selection:text-white">
      {/* Sleek Unified Header with Top Announcement Bar */}
      <Header />

      {/* Main Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Global Inspection Form Modal */}
      <InspectionModal settings={settings} />

      {/* Floating WhatsApp Action Button with Glow */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-tr from-[#128c7e] to-[#25d366] text-white p-3.5 sm:p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center border-2 border-white/90 shadow-emerald-900/30 group"
        title="Chat with Senior Engineer on WhatsApp"
        aria-label="Chat on WhatsApp with SLN Engineers"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full animate-ping pointer-events-none"></span>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-300 rounded-full border-2 border-white pointer-events-none"></span>
        <MessageCircle size={28} className="group-hover:rotate-12 transition-transform duration-300" />
      </a>

      {/* Footer */}
      <Footer />
    </div>
  );
}
