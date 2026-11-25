import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  Save,
  RotateCcw,
  CheckCircle,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Sparkles,
  Shield,
  MessageCircle,
  ArrowRight,
  Phone,
  Layers,
  Check,
  X,
  Compass,
} from 'lucide-react';
import { fetchApi } from '../../utils/api';
import {
  DEFAULT_NAVBAR_CONFIG,
  DEFAULT_NAV_LINKS,
  NAV_PATH_PRESETS,
} from '../../utils/navbarData';

export default function NavbarManager() {
  const [activeTab, setActiveTab] = useState('links'); // 'links' | 'announcement-ctas'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [navbarConfig, setNavbarConfig] = useState(DEFAULT_NAVBAR_CONFIG);

  // Modal for adding a new link
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLinkData, setNewLinkData] = useState({
    name: '',
    path: '/',
    badge: '',
    isActive: true,
    isExternal: false,
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Load from MongoDB CompanySettings
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchApi('/settings');
      if (res.success && res.data) {
        try {
          localStorage.setItem('sln_cached_settings', JSON.stringify(res.data));
        } catch {}
        if (res.data.navbarConfig && Object.keys(res.data.navbarConfig).length > 0) {
          const merged = { ...DEFAULT_NAVBAR_CONFIG, ...res.data.navbarConfig };
          setNavbarConfig(merged);
          try {
            localStorage.setItem('sln_cached_navbar_config', JSON.stringify(merged));
          } catch {}
        }
      }
    } catch (e) {
      console.warn('Could not load navbarConfig from settings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save changes to MongoDB CompanySettings
  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSaving(true);
    try {
      const res = await fetchApi('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({ navbarConfig }),
      });

      if (res.success) {
        try {
          localStorage.setItem('sln_cached_navbar_config', JSON.stringify(navbarConfig));
          const cachedSettings = localStorage.getItem('sln_cached_settings');
          if (cachedSettings) {
            const parsed = JSON.parse(cachedSettings);
            parsed.navbarConfig = navbarConfig;
            localStorage.setItem('sln_cached_settings', JSON.stringify(parsed));
          }
        } catch {}
        window.dispatchEvent(new Event('sln_navbar_updated'));
        showToast('Navbar link names & settings saved and published to database successfully!');
      } else {
        showToast(res.message || 'Failed to save to database.');
      }
    } catch (err) {
      console.error('Error saving navbar config:', err);
      showToast('Error saving navbar config to database.');
    } finally {
      setSaving(false);
    }
  };

  // Reset to Factory Defaults
  const handleResetDefaults = async () => {
    if (!window.confirm('Reset all Navbar names and links back to factory defaults?')) return;
    setResetting(true);
    try {
      setNavbarConfig(DEFAULT_NAVBAR_CONFIG);
      const res = await fetchApi('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({ navbarConfig: DEFAULT_NAVBAR_CONFIG }),
      });

      if (res.success) {
        try {
          localStorage.setItem('sln_cached_navbar_config', JSON.stringify(DEFAULT_NAVBAR_CONFIG));
          const cachedSettings = localStorage.getItem('sln_cached_settings');
          if (cachedSettings) {
            const parsed = JSON.parse(cachedSettings);
            parsed.navbarConfig = DEFAULT_NAVBAR_CONFIG;
            localStorage.setItem('sln_cached_settings', JSON.stringify(parsed));
          }
        } catch {}
        window.dispatchEvent(new Event('sln_navbar_updated'));
        showToast('Navbar reset to defaults in database!');
      } else {
        showToast(res.message || 'Failed to reset in database.');
      }
    } catch (err) {
      showToast('Error resetting navbar in database.');
    } finally {
      setResetting(false);
    }
  };

  // Link manipulation helpers
  const handleUpdateLink = (index, field, value) => {
    const list = [...(navbarConfig.links || DEFAULT_NAV_LINKS)];
    if (!list[index]) return;
    list[index] = { ...list[index], [field]: value };
    setNavbarConfig((prev) => ({ ...prev, links: list }));
  };

  const handleToggleActive = (index) => {
    const list = [...(navbarConfig.links || DEFAULT_NAV_LINKS)];
    if (!list[index]) return;
    list[index] = { ...list[index], isActive: !list[index].isActive };
    setNavbarConfig((prev) => ({ ...prev, links: list }));
  };

  const handleMoveLink = (index, direction) => {
    const list = [...(navbarConfig.links || DEFAULT_NAV_LINKS)];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const [moved] = list.splice(index, 1);
    list.splice(targetIdx, 0, moved);

    const reordered = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    setNavbarConfig((prev) => ({ ...prev, links: reordered }));
  };

  const handleDeleteLink = (index) => {
    const list = [...(navbarConfig.links || DEFAULT_NAV_LINKS)];
    const item = list[index];
    if (!window.confirm(`Delete navigation link "${item.name}"?`)) return;

    list.splice(index, 1);
    const reordered = list.map((l, idx) => ({ ...l, order: idx + 1 }));
    setNavbarConfig((prev) => ({ ...prev, links: reordered }));
    showToast(`Removed "${item.name}" from navbar.`);
  };

  const handleAddLinkSubmit = (e) => {
    e.preventDefault();
    if (!newLinkData.name.trim()) {
      alert('Please enter a link name / label.');
      return;
    }
    const list = [...(navbarConfig.links || DEFAULT_NAV_LINKS)];
    const id = `nav-${Date.now().toString(36)}`;
    list.push({
      id,
      name: newLinkData.name.trim(),
      path: newLinkData.path.trim() || '/',
      badge: newLinkData.badge.trim(),
      isActive: newLinkData.isActive,
      isExternal: newLinkData.isExternal,
      order: list.length + 1,
    });
    setNavbarConfig((prev) => ({ ...prev, links: list }));
    setShowAddModal(false);
    setNewLinkData({ name: '', path: '/', badge: '', isActive: true, isExternal: false });
    showToast(`Added "${newLinkData.name.trim()}" to navbar!`);
  };

  const links = navbarConfig.links || DEFAULT_NAV_LINKS;
  const announcement = navbarConfig.topAnnouncement || DEFAULT_NAVBAR_CONFIG.topAnnouncement;
  const ctas = navbarConfig.headerCtas || DEFAULT_NAVBAR_CONFIG.headerCtas;

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl border border-sky-400/40 flex items-center gap-2.5 animate-bounce">
          <CheckCircle size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider bg-sky-100 text-sky-800">
              Navigation Bar CRUD
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-bold text-slate-500">Header Menu Names, Paths &amp; Order</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Navbar Links &amp; Menu Names Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Rename navigation links, reorder menu tabs, show or hide pages, and customize header call-to-actions. Changes update instantly across all desktop and mobile pages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetDefaults}
            disabled={resetting}
            className="btn btn-outline btn-sm text-xs flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900"
            title="Reset navbar to default SLN names"
          >
            <RotateCcw size={14} className={resetting ? 'animate-spin' : ''} />
            <span>Reset Defaults</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm text-xs flex items-center gap-1.5 cursor-pointer text-slate-700 hover:text-sky-700"
          >
            <ExternalLink size={14} />
            <span>View Live Website</span>
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary btn-sm text-xs flex items-center gap-1.5 shadow-sm cursor-pointer font-bold"
          >
            <Save size={15} />
            <span>{saving ? 'Saving...' : 'Save & Publish Navbar'}</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('links')}
          className={`py-2.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'links'
              ? 'border-sky-600 text-sky-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Menu size={14} />
          <span>Navbar Menu Items ({links.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('announcement-ctas')}
          className={`py-2.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'announcement-ctas'
              ? 'border-sky-600 text-sky-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles size={14} />
          <span>Top Announcement Bar &amp; Header CTAs</span>
        </button>
      </div>

      {/* Live Interactive Navbar Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Eye size={13} />
            <span>Live Header &amp; Navbar Preview (As seen by website visitors)</span>
          </span>
          <span className="text-[11px] text-slate-400">
            Interactive simulation of desktop navbar
          </span>
        </div>

        <div className="rounded-2xl overflow-hidden border border-slate-300 shadow-md bg-white">
          {/* Top Announcement Bar Preview */}
          <div className="bg-gradient-to-r from-slate-950 via-[#071d33] to-slate-950 text-slate-300 text-[11px] py-2 px-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{announcement.lineageBadge || 'Restoration for Three Generations'}</span>
              </span>
              <span className="text-slate-700">|</span>
              <span className="text-slate-300 flex items-center gap-1">
                <Shield size={12} className="text-sky-400" />
                <span>{announcement.complianceText || 'ISO & Indian Standard Compliant'}</span>
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-200 font-semibold">
              <span className="flex items-center gap-1">
                <Phone size={12} className="text-sky-400" />
                <span>+91 89776 68777</span>
              </span>
            </div>
          </div>

          {/* Main Navbar Bar Preview */}
          <div className="p-4 flex items-center justify-between gap-4 bg-white/95">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <img src="/sln-logo.png" alt="Logo" className="w-9 h-9 object-contain" />
              <div>
                <span className="text-sm font-black text-emerald-700 leading-none block">SLN ENGINEERS</span>
                <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase block">PROJECTS PVT. LTD.</span>
              </div>
            </div>

            {/* Desktop Links Preview */}
            <div className="flex items-center gap-1 overflow-x-auto">
              {links
                .filter((l) => l.isActive !== false)
                .map((link, idx) => {
                  const isFirst = idx === 0;
                  return (
                    <span
                      key={link.id || idx}
                      className={`relative px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-default ${
                        isFirst
                          ? 'bg-gradient-to-r from-sky-50 to-emerald-50 text-sky-900 border border-sky-200/90 font-extrabold shadow-2xs'
                          : 'text-slate-700 hover:text-sky-700'
                      }`}
                    >
                      {link.name}
                      {link.badge && (
                        <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                          {link.badge}
                        </span>
                      )}
                      {isFirst && (
                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      )}
                    </span>
                  );
                })}
            </div>

            {/* CTAs Preview */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 shadow-2xs">
                <MessageCircle size={13} className="text-emerald-600" />
                <span>{ctas.whatsappText || 'WhatsApp Us'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0a4b82] via-[#0284c7] to-[#059669] shadow-xs">
                <span>{ctas.primaryText === 'Request Site Survey' ? 'Book Inspection' : (ctas.primaryText || 'Book Inspection')}</span>
                <ArrowRight size={13} />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: NAVBAR MENU ITEMS CRUD TABLE                                   */}
      {/* ===================================================================== */}
      {activeTab === 'links' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            {/* Table Header Controls */}
            <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <span>Navigation Items Order &amp; Custom Labels</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                    {links.filter((l) => l.isActive !== false).length} Active
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Type directly in the Link Label input to rename any navbar tab. Use the arrow buttons to change display order.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="btn btn-primary btn-sm text-xs flex items-center gap-1.5 font-bold shadow-xs cursor-pointer self-start sm:self-auto"
              >
                <Plus size={14} />
                <span>Add Navigation Link</span>
              </button>
            </div>

            {/* Links List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/70 text-[11px] font-black uppercase tracking-wider text-slate-600 border-b border-slate-200">
                    <th className="py-3 px-4 w-12 text-center">Order</th>
                    <th className="py-3 px-4 w-48">Link Name / Label</th>
                    <th className="py-3 px-4 w-60">Path Target (URL)</th>
                    <th className="py-3 px-4 w-28 text-center">Badge (Optional)</th>
                    <th className="py-3 px-4 w-28 text-center">Visibility</th>
                    <th className="py-3 px-4 w-28 text-center">Reorder</th>
                    <th className="py-3 px-4 w-16 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {links.map((link, idx) => (
                    <tr
                      key={link.id || idx}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        link.isActive === false ? 'opacity-60 bg-slate-50/40' : ''
                      }`}
                    >
                      {/* Order Index */}
                      <td className="py-3 px-4 text-center font-bold text-slate-400">
                        {idx + 1}
                      </td>

                      {/* Name Input */}
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          className="form-input text-xs w-full py-1.5 px-2.5 rounded-lg border border-slate-300 font-bold text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                          value={link.name || ''}
                          onChange={(e) => handleUpdateLink(idx, 'name', e.target.value)}
                          placeholder="Link Label"
                        />
                      </td>

                      {/* Path Target with Presets */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            className="form-input text-xs w-full py-1.5 px-2.5 rounded-lg border border-slate-300 font-mono text-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                            value={link.path || ''}
                            onChange={(e) => handleUpdateLink(idx, 'path', e.target.value)}
                            placeholder="/example"
                          />
                          <select
                            className="form-select text-[11px] py-1.5 px-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 cursor-pointer shrink-0"
                            onChange={(e) => {
                              if (e.target.value) handleUpdateLink(idx, 'path', e.target.value);
                            }}
                            defaultValue=""
                            title="Choose from common page presets"
                          >
                            <option value="" disabled>Presets...</option>
                            {NAV_PATH_PRESETS.map((p) => (
                              <option key={p.path} value={p.path}>
                                {p.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      {/* Optional Badge */}
                      <td className="py-3 px-4 text-center">
                        <input
                          type="text"
                          className="form-input text-[11px] w-24 py-1.5 px-2 rounded-lg border border-slate-200 text-center font-bold"
                          value={link.badge || ''}
                          onChange={(e) => handleUpdateLink(idx, 'badge', e.target.value)}
                          placeholder="e.g. New"
                        />
                      </td>

                      {/* Visibility Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(idx)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold cursor-pointer transition-colors ${
                            link.isActive !== false
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                              : 'bg-slate-200 text-slate-600 border border-slate-300 hover:bg-slate-300'
                          }`}
                        >
                          {link.isActive !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                          <span>{link.isActive !== false ? 'Visible' : 'Hidden'}</span>
                        </button>
                      </td>

                      {/* Move Up / Down Buttons */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveLink(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-slate-600"
                            title="Move up"
                          >
                            <ArrowUp size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveLink(idx, 'down')}
                            disabled={idx === links.length - 1}
                            className="p-1 rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-slate-600"
                            title="Move down"
                          >
                            <ArrowDown size={13} />
                          </button>
                        </div>
                      </td>

                      {/* Delete Action */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteLink(idx)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete navigation link"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: TOP ANNOUNCEMENT BAR & HEADER CTAS                             */}
      {/* ===================================================================== */}
      {activeTab === 'announcement-ctas' && (
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          {/* Top Announcement Bar */}
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900">1. Top Black Announcement &amp; Lineage Bar</h3>
                <p className="text-xs text-slate-500 mt-0.5">Topmost dark bar visible across the website on desktop screens</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Top Header</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lineage Badge Text (with pulsing green dot)
                </label>
                <input
                  type="text"
                  className="form-input text-xs w-full py-2.5 px-3 rounded-xl border border-slate-300 font-bold text-emerald-700"
                  value={announcement.lineageBadge || ''}
                  onChange={(e) =>
                    setNavbarConfig((prev) => ({
                      ...prev,
                      topAnnouncement: {
                        ...(prev.topAnnouncement || {}),
                        lineageBadge: e.target.value,
                      },
                    }))
                  }
                  placeholder="e.g. Restoration for Three Generations"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Standards Compliance Tag
                </label>
                <input
                  type="text"
                  className="form-input text-xs w-full py-2.5 px-3 rounded-xl border border-slate-300 font-medium"
                  value={announcement.complianceText || ''}
                  onChange={(e) =>
                    setNavbarConfig((prev) => ({
                      ...prev,
                      topAnnouncement: {
                        ...(prev.topAnnouncement || {}),
                        complianceText: e.target.value,
                      },
                    }))
                  }
                  placeholder="e.g. ISO & Indian Standard Compliant"
                />
              </div>
            </div>
          </div>

          {/* Action CTAs in Header */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900">2. Header Call-To-Action (CTA) Buttons</h3>
                <p className="text-xs text-slate-500 mt-0.5">Conversion buttons displayed on the right edge of the desktop navbar</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700">Right Header</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Survey CTA Label
                </label>
                <input
                  type="text"
                  className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300 font-bold"
                  value={ctas.primaryText || ''}
                  onChange={(e) =>
                    setNavbarConfig((prev) => ({
                      ...prev,
                      headerCtas: {
                        ...(prev.headerCtas || {}),
                        primaryText: e.target.value,
                      },
                    }))
                  }
                  placeholder="Book Inspection"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Survey CTA Target Link
                </label>
                <input
                  type="text"
                  className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300 font-mono text-slate-800"
                  value={ctas.primaryLink || ''}
                  onChange={(e) =>
                    setNavbarConfig((prev) => ({
                      ...prev,
                      headerCtas: {
                        ...(prev.headerCtas || {}),
                        primaryLink: e.target.value,
                      },
                    }))
                  }
                  placeholder="/contact#inspection-form"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp Button Label
                </label>
                <input
                  type="text"
                  className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300 font-bold text-emerald-700"
                  value={ctas.whatsappText || ''}
                  onChange={(e) =>
                    setNavbarConfig((prev) => ({
                      ...prev,
                      headerCtas: {
                        ...(prev.headerCtas || {}),
                        whatsappText: e.target.value,
                      },
                    }))
                  }
                  placeholder="WhatsApp Us"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary btn-sm text-xs flex items-center gap-1.5 font-bold px-6 shadow-md shadow-sky-600/20"
            >
              <Save size={14} />
              <span>{saving ? 'Saving...' : 'Save & Publish All'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ===================================================================== */}
      {/* MODAL: ADD NEW NAVIGATION LINK                                        */}
      {/* ===================================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center">
                  <Menu size={16} />
                </div>
                <h3 className="text-sm font-black text-white">Add New Navigation Link</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddLinkSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Link Name / Menu Label <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300 font-bold"
                  placeholder="e.g. Gallery, FAQs, Portfolio"
                  value={newLinkData.name}
                  onChange={(e) => setNewLinkData({ ...newLinkData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Route Path <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300 font-mono"
                  placeholder="e.g. /projects or /about"
                  value={newLinkData.path}
                  onChange={(e) => setNewLinkData({ ...newLinkData, path: e.target.value })}
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {NAV_PATH_PRESETS.slice(0, 6).map((preset) => (
                    <button
                      key={preset.path}
                      type="button"
                      onClick={() => setNewLinkData({ ...newLinkData, path: preset.path })}
                      className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-sky-50 hover:text-sky-800 border border-slate-200"
                    >
                      {preset.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Badge Text (Optional)
                </label>
                <input
                  type="text"
                  className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300"
                  placeholder="e.g. New, Hot, 3 Gen"
                  value={newLinkData.badge}
                  onChange={(e) => setNewLinkData({ ...newLinkData, badge: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-700">Display in Navbar Immediately:</span>
                <input
                  type="checkbox"
                  checked={newLinkData.isActive}
                  onChange={(e) => setNewLinkData({ ...newLinkData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-outline btn-sm text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm text-xs font-bold cursor-pointer shadow-xs"
                >
                  Add to Navbar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
