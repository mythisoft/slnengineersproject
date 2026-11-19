import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Star,
  ExternalLink,
  AlertCircle,
  ArrowUp,
  ChevronRight,
  X,
  Award,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon } from './SocialIcons';
import { fetchApi } from '../../utils/api';
import { DEFAULT_PILLAR_CARDS } from '../../utils/pillarCardData';

export const DEFAULT_DEVELOPER_CREDIT = {
  isEnabled: true,
  prefixText: 'Designed & Developed by',
  companyName: 'Mythisoft Innovations Pvt. Ltd.',
  websiteUrl: 'https://mythisoft.com',
  badgeText: 'Technology Partner',
  openInNewTab: true,
};

export default function Footer() {
  const [settings, setSettings] = useState(null);
  const [pillarCards, setPillarCards] = useState(() =>
    DEFAULT_PILLAR_CARDS.filter((c) => c && c.isActive !== false)
  );
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  const logoUrl = settings?.logoUrl || '/sln-logo.png';
  const brandNameLine1 = settings?.brandNameLine1 || 'SLN ENGINEERS';
  const brandNameLine2 = settings?.brandNameLine2 || 'PROJECTS PVT. LTD.';
  const logoNameColor = settings?.logoNameColor || '#029746';

  const devCredit = {
    ...DEFAULT_DEVELOPER_CREDIT,
    ...(settings?.footerDeveloperCredit || {}),
  };

  // Close logo modal on Escape key press
  useEffect(() => {
    if (!isLogoModalOpen) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsLogoModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLogoModalOpen]);

  useEffect(() => {
    fetchApi('/settings')
      .then((res) => {
        if (res.success) setSettings(res.data);
      })
      .catch((err) => console.error('Failed to load settings:', err));

    const loadPillars = () => {
      fetchApi('/pillar-cards')
        .then((res) => {
          if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            const active = res.data.filter((c) => c && c.isActive !== false);
            if (active.length > 0) {
              setPillarCards(active);
            }
          }
        })
        .catch((err) => console.error('Failed to load pillar cards in footer:', err));
    };

    loadPillars();

    const syncSettings = (e) => {
      if (e.detail) setSettings(e.detail);
    };

    window.addEventListener('sln_pillar_cards_updated', loadPillars);
    window.addEventListener('sln_settings_updated', syncSettings);
    return () => {
      window.removeEventListener('sln_pillar_cards_updated', loadPillars);
      window.removeEventListener('sln_settings_updated', syncSettings);
    };
  }, []);

  const phone = settings?.phone || '+91 8977668776';
  const email = settings?.email || 'contact@slnengineers.com';
  const whatsapp = settings?.whatsappNumber || '+918977668776';
  const whatsappMsg =
    settings?.whatsappDefaultMessage ||
    'Hello SLN Engineers, I would like to request an on-site waterproofing inspection.';
  const whatsappUrl = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMsg)}`;

  const googleReviewUrl =
    settings?.googleReviewUrl && !settings.googleReviewUrl.includes('sln-engineers-review') && !settings.googleReviewUrl.includes('slnengineers/review')
      ? settings.googleReviewUrl
      : 'https://www.google.com/maps/place/Elvino+Cafe/@17.38986,78.5687662,17z/data=!4m8!3m7!1s0x3bcb9fdaf85927fb:0x54886b6240f47511!8m2!3d17.38986!4d78.5713411!9m1!1b1!16s%2Fg%2F11z7cpylxy?entry=ttu&g_ep=EgoyMDI2MTExMC4wIKXMDSoASAFQAw%3D%3D';

  const getSocialUrl = (platform, fallback) => {
    const found = settings?.socialLinks?.find((s) => s.platform === platform);
    return found?.url || fallback;
  };

  const city = settings?.address?.city || 'Hyderabad';
  const state = settings?.address?.state || 'Telangana';
  const area = settings?.address?.area || 'Medipally';
  const street = settings?.address?.street || 'Medipally';
  const pincode = settings?.address?.pincode || '500098';

  const rawParts = [street, area, city, state].filter(Boolean);
  const seen = new Set();
  const cleanParts = [];
  rawParts.forEach((part) => {
    String(part).split(',').forEach((sub) => {
      const trimmed = sub.trim();
      const lower = trimmed.toLowerCase();
      if (trimmed && !seen.has(lower)) {
        seen.add(lower);
        cleanParts.push(trimmed);
      }
    });
  });
  const displayAddress = cleanParts.length > 0
    ? `${cleanParts.join(', ')} — ${pincode}`
    : `Medipally, Hyderabad, Telangana — ${pincode}`;

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 mt-auto border-t border-slate-800 relative selection:bg-sky-500 selection:text-white">
      {/* Top glowing ambient accent line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 mb-8">
          {/* Col 1: Brand, Heritage & Socials (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-3.5">
            <div>
              {/* White Background Container strictly for Logo & Logo Name Only */}
              <div className="inline-flex items-center gap-3.5 px-4 py-2.5 rounded-2xl bg-white shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-300">
                <button
                  type="button"
                  onClick={() => setIsLogoModalOpen(true)}
                  className="group cursor-zoom-in focus:outline-hidden"
                  title="Click to view full logo"
                  aria-label={`View ${brandNameLine1} Logo`}
                >
                  <img
                    src={logoUrl}
                    alt={`${brandNameLine1} Logo`}
                    className="h-12 w-auto sm:h-14 shrink-0 object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = '/sln-logo.png';
                    }}
                  />
                </button>
                <Link to="/" className="select-none group focus:outline-hidden pr-2">
                  <span
                    style={{ color: logoNameColor }}
                    className="block text-base sm:text-lg font-black tracking-tight font-heading group-hover:opacity-90 transition-opacity leading-tight"
                  >
                    {brandNameLine1}
                  </span>
                  <span
                    style={{ color: logoNameColor }}
                    className="mt-0.5 block text-[10px] sm:text-[11px] font-extrabold tracking-[0.2em] uppercase font-heading group-hover:opacity-90 transition-opacity"
                  >
                    {brandNameLine2}
                  </span>
                </Link>
              </div>

              {/* Heritage Badge */}
              <div className="mt-3.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Award size={13} className="text-emerald-400 shrink-0" />
                  <span>Restoration for Three Generations • Est. 1980s</span>
                </div>
              </div>

              {/* Concise Engineering Profile */}
              <p className="mt-3.5 text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
                Specialist waterproofing, structural restoration, and industrial protective coatings contracting. Engineering excellence protecting residential, commercial, and industrial properties across Telangana.
              </p>
            </div>

            {/* Social Media & Verified Profiles Hub - MAIN FOCUS with Icon & Name */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  Official Channels &amp; Reviews
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Verified</span>
              </div>

              {/* Primary Feature: Google Reviews & WhatsApp Direct with Prominent Icon + Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Google Reviews */}
                <a
                  href={googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400/90 text-slate-200 hover:text-white transition-all duration-300 hover:-translate-y-0.5 shadow-md group"
                  title="Google Reviews"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-amber-500/25 transition-all">
                    <Star size={17} className="fill-amber-400 text-amber-400" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-white leading-tight">Google Reviews</span>
                    <span className="block text-[10px] text-amber-300 font-semibold mt-0.5">4.9 ★★★★★ Verified</span>
                  </div>
                </a>

                {/* WhatsApp Direct */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 hover:border-emerald-400 text-slate-200 hover:text-white transition-all duration-300 hover:-translate-y-0.5 shadow-md group"
                  title="WhatsApp Direct Consultation"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-emerald-500/30 transition-all">
                    <MessageCircle size={17} />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-white leading-tight">WhatsApp</span>
                    <span className="block text-[10px] text-emerald-300 font-semibold mt-0.5">Instant Consultation</span>
                  </div>
                </a>
              </div>

              {/* Social Channels: Instagram, Facebook, YouTube with BOTH Icon AND Name Prominently Featured */}
              <div className="grid grid-cols-3 gap-2">
                {/* Instagram Card with Icon and Name */}
                <a
                  href={getSocialUrl('instagram', 'https://www.instagram.com')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-pink-500 text-slate-200 hover:text-white transition-all duration-300 hover:-translate-y-0.5 shadow-sm group"
                  title="Instagram Page"
                >
                  <div className="w-7 h-7 rounded-lg bg-pink-500/15 text-pink-400 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-pink-500/25 transition-all">
                    <InstagramIcon size={16} />
                  </div>
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">Instagram</span>
                </a>

                {/* Facebook Card with Icon and Name */}
                <a
                  href={getSocialUrl('facebook', 'https://www.facebook.com')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-sky-500 text-slate-200 hover:text-white transition-all duration-300 hover:-translate-y-0.5 shadow-sm group"
                  title="Facebook Page"
                >
                  <div className="w-7 h-7 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-sky-500/25 transition-all">
                    <FacebookIcon size={16} />
                  </div>
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">Facebook</span>
                </a>

                {/* YouTube Card with Icon and Name */}
                <a
                  href={getSocialUrl('youtube', 'https://www.youtube.com')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-red-500 text-slate-200 hover:text-white transition-all duration-300 hover:-translate-y-0.5 shadow-sm group"
                  title="YouTube Channel"
                >
                  <div className="w-7 h-7 rounded-lg bg-red-500/15 text-red-400 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-red-500/25 transition-all">
                    <YoutubeIcon size={16} />
                  </div>
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">YouTube</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Core Engineering Pillars & Key Services (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3 pb-1.5 border-b border-slate-800/80">
                <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-3.5 rounded-full bg-sky-400 shadow-sm shadow-sky-400/60" />
                  <span>Core Discipline Pillars</span>
                </h4>
                <span className="text-[10px] font-mono text-slate-500 font-medium">4 Core Areas</span>
              </div>
              <ul className="flex flex-col gap-2.5 text-xs sm:text-sm">
                {(pillarCards && pillarCards.length > 0 ? pillarCards : DEFAULT_PILLAR_CARDS).map((pillar) => {
                  const rawPillarId = (pillar.pillarId || pillar.slug || 'waterproofing').toLowerCase().trim();
                  const targetDiscipline =
                    rawPillarId === 'restoration' || rawPillarId === 'repair'
                      ? 'repairs'
                      : rawPillarId === 'ceiling' || rawPillarId === 'interiors'
                      ? 'false-ceiling'
                      : rawPillarId;

                  return (
                    <li key={pillar._id || pillar.pillarId || pillar.pillarName}>
                      <Link
                        to={`/services?discipline=${encodeURIComponent(targetDiscipline)}&category=${encodeURIComponent(pillar.pillarName)}`}
                        className="group flex items-start gap-2.5 text-slate-300 hover:text-white transition-all duration-200 py-1"
                        title={`View ${pillar.pillarName} Specialized Civil Engineering Services`}
                      >
                        <span
                          className="w-2 h-2 rounded-full mt-1.5 shrink-0 transition-transform duration-200 group-hover:scale-125 ring-2 ring-white/10 shadow-xs"
                          style={{ backgroundColor: pillar.accentColor || '#0284c7' }}
                        />
                        <span className="font-semibold text-slate-200 group-hover:text-white leading-snug">{pillar.pillarName}</span>
                        <ChevronRight
                          size={13}
                          className="text-sky-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0 ml-auto mt-0.5"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Specialized Engineering Solutions list with clean, aligned bullets */}
            <div className="pt-3 border-t border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                Specialized Services
              </span>
              <ul className="space-y-2 text-xs text-slate-400">
                {[
                  { name: 'Terrace & Roof Waterproofing', disc: 'waterproofing' },
                  { name: 'Basement & Deep Tanking', disc: 'waterproofing' },
                  { name: 'Structural Crack Stitching & Grouting', disc: 'repairs' },
                  { name: 'Concrete Spalling Rehabilitation', disc: 'repairs' },
                  { name: 'Exterior Monsoon Weather-Shield Painting', disc: 'painting' },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      to={`/services?discipline=${encodeURIComponent(item.disc)}&category=${encodeURIComponent(item.name)}`}
                      className="group flex items-start gap-2.5 text-slate-400 hover:text-sky-300 transition-colors py-0.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 group-hover:bg-sky-400 transition-colors shrink-0 mt-1.5" />
                      <span className="leading-snug text-slate-300 group-hover:text-sky-300">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                to="/services"
                className="group inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors mt-3"
              >
                <span>View All 14+ Specialized Services</span>
                <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Col 3: Company Links & Quality Standards (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h4 className="text-white font-bold text-sm mb-3 tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                <span>Quick Links</span>
              </h4>
              <ul className="flex flex-col gap-2 text-xs sm:text-sm">
                <li>
                  <Link to="/about" className="group flex items-center gap-1.5 text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-200 py-0.5">
                    <ChevronRight size={13} className="text-emerald-400 opacity-60 group-hover:opacity-100 shrink-0" />
                    <span>Our Heritage</span>
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="group flex items-center gap-1.5 text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-200 py-0.5">
                    <ChevronRight size={13} className="text-emerald-400 opacity-60 group-hover:opacity-100 shrink-0" />
                    <span>Expertise</span>
                  </Link>
                </li>
                <li>
                  <Link to="/projects" className="group flex items-center gap-1.5 text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-200 py-0.5">
                    <ChevronRight size={13} className="text-emerald-400 opacity-60 group-hover:opacity-100 shrink-0" />
                    <span>Success Stories</span>
                  </Link>
                </li>
                <li>
                  <Link to="/reviews" className="group flex items-center gap-1.5 text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-200 py-0.5">
                    <ChevronRight size={13} className="text-emerald-400 opacity-60 group-hover:opacity-100 shrink-0" />
                    <span>Client Trust</span>
                  </Link>
                </li>
                <li>
                  <Link to="/contact#inspection-form" className="group flex items-center gap-1.5 text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-200 py-0.5 cursor-pointer">
                    <ChevronRight size={13} className="text-emerald-400 opacity-60 group-hover:opacity-100 shrink-0" />
                    <span>Site Inspection</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Our Philosophy: Protect • Revive • Elevate */}
            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-[11px] text-slate-400 block mb-1">
                Our Philosophy
              </span>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 size={13} className="text-sky-400 shrink-0" />
                <span className="font-semibold text-slate-200 tracking-wide">Protect</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                <span className="font-semibold text-slate-200 tracking-wide">Revive</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 size={13} className="text-amber-400 shrink-0" />
                <span className="font-semibold text-slate-200 tracking-wide">Elevate</span>
              </div>
            </div>
          </div>

          {/* Col 4: Contact & Site Inspection Consultation (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-white font-bold text-sm tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
              <span>Office &amp; Helpdesk</span>
            </h4>
            <div className="flex flex-col gap-2.5 text-xs sm:text-sm text-slate-400">
              {/* Address */}
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-sky-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed text-slate-300">
                  {displayAddress}
                </span>
              </div>

              {/* Direct Phone */}
              <div className="flex items-center gap-2.5">
                <Phone size={16} className="text-emerald-400 shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-slate-200 hover:text-white font-semibold transition-colors">
                  {phone}
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="text-sky-400 shrink-0" />
                <a href={`mailto:${email}`} className="text-slate-300 hover:text-white transition-colors truncate">
                  {email}
                </a>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start gap-2.5 pt-1 text-xs text-slate-400 border-t border-slate-800">
                <Clock size={15} className="text-slate-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-slate-300 font-medium">{settings?.businessHours?.weekdays || 'Mon – Sat: 8:00 AM – 7:30 PM'}</p>
                  <p className="text-slate-500 text-[11px]">{settings?.businessHours?.sunday || 'Sunday: Site Inspection on Request'}</p>
                </div>
              </div>
            </div>

            {/* Quick Inspection Card filling bottom empty void with high-value CTA */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span>On-Site Technical Diagnostic</span>
                <span className="text-[10px] text-emerald-400 font-semibold">Available</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Schedule a licensed civil engineer visit for moisture inspection or structural assessment.
              </p>
              <Link
                to="/contact#inspection-form"
                className="w-full py-1.5 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <span>Book Site Inspection</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Trust Badges & Copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p className="text-slate-400">
              © {new Date().getFullYear()} SLN Engineers Projects Pvt. Ltd. All rights reserved.
            </p>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="text-emerald-400 font-semibold text-[11px]">
              “Restoration for Three Generations”
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="text-slate-700">•</span>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            <span className="text-slate-700">•</span>
            <Link to="/admin/login" className="hover:text-white transition-colors">Admin Portal</Link>

            {/* Back to Top Button */}
            <button
              type="button"
              onClick={scrollToTop}
              className="ml-2 p-2 rounded-xl bg-slate-800 hover:bg-sky-600 text-slate-400 hover:text-white transition-all shadow-md flex items-center justify-center cursor-pointer hover:scale-105"
              title="Back to top"
              aria-label="Back to top"
            >
              <ArrowUp size={15} />
            </button>
          </div>
        </div>

        {/* Developer & Technology Partner Credit Row (Admin Configurable CRUD) */}
        {devCredit && devCredit.isEnabled !== false && devCredit.companyName && (
          <div className="mt-4 pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-400">
            <div className="flex items-center flex-wrap justify-center sm:justify-start gap-1.5">
              <span className="text-slate-400 font-medium">
                {devCredit.prefixText || 'Designed & Developed by'}
              </span>
              <a
                href={devCredit.websiteUrl || 'https://mythisoft.com'}
                target={devCredit.openInNewTab !== false ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="font-bold text-sky-400 hover:text-sky-300 transition-colors inline-flex items-center gap-1 group underline-offset-4 hover:underline"
              >
                <span>{devCredit.companyName}</span>
                <ExternalLink
                  size={12}
                  className="text-sky-400/80 group-hover:text-sky-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>

            {devCredit.badgeText && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                <span>{devCredit.badgeText}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* High-Resolution Logo Preview Modal */}
      {isLogoModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsLogoModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="SLN Engineers Logo Preview"
        >
          <div
            className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col items-center text-center text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLogoModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              aria-label="Close logo preview"
            >
              <X size={20} />
            </button>

            {/* Verification Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-xs font-bold uppercase tracking-wider mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Official Company Emblem
            </div>

            {/* Logo Image Showcase */}
            <div className="w-full max-w-xs p-6 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-sky-50/50 border border-slate-100 shadow-inner flex items-center justify-center my-2">
              <img
                src={logoUrl}
                alt={`${brandNameLine1} Official Logo`}
                className="w-full h-auto max-h-56 object-contain filter drop-shadow-md hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = '/sln-logo.png';
                }}
              />
            </div>

            {/* Brand Typography */}
            <h3
              style={{ color: logoNameColor }}
              className="text-xl sm:text-2xl font-black tracking-tight font-heading mt-3"
            >
              {brandNameLine1}
            </h3>
            <p
              style={{ color: logoNameColor }}
              className="text-xs sm:text-sm font-bold uppercase tracking-widest mt-1"
            >
              {brandNameLine2}
            </p>
            <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
              Waterproofing &amp; Structural Restoration Engineering Specialist
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-6 w-full">
              <a
                href={logoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors"
              >
                <ExternalLink size={14} />
                <span>Open Full Size</span>
              </a>
              <button
                type="button"
                onClick={() => setIsLogoModalOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
