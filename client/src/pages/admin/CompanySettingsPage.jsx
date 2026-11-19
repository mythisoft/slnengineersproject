import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Save, CheckCircle, Shield, ShieldCheck, Upload, Palette, RotateCcw, Eye, ArrowRight, Menu, PhoneCall, Code2, Trash2, ExternalLink } from 'lucide-react';
import { fetchApi } from '../../utils/api';

const COLOR_PRESETS = [
  { label: 'SLN Green', value: '#029746' },
  { label: 'Emerald', value: '#059669' },
  { label: 'Forest Green', value: '#15803d' },
  { label: 'Sky Blue', value: '#0284c7' },
  { label: 'Prestige Navy', value: '#0a4b82' },
  { label: 'Slate Dark', value: '#0f172a' },
  { label: 'Crimson Red', value: '#dc2626' },
  { label: 'Amber Bronze', value: '#d97706' },
  { label: 'Royal Violet', value: '#7c3aed' },
];

export default function CompanySettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const logoInputRef = useRef(null);

  useEffect(() => {
    fetchApi('/admin/settings')
      .then((res) => {
        if (res.success && res.data) {
          const defaultCredit = {
            isEnabled: true,
            prefixText: 'Designed & Developed by',
            companyName: 'Mythisoft Innovations Pvt. Ltd.',
            websiteUrl: 'https://mythisoft.com',
            badgeText: 'Technology Partner',
            openInNewTab: true,
          };
          setSettings({
            ...res.data,
            logoUrl: res.data.logoUrl || '/sln-logo.png',
            brandNameLine1: res.data.brandNameLine1 || 'SLN ENGINEERS',
            brandNameLine2: res.data.brandNameLine2 || 'PROJECTS PVT. LTD.',
            logoNameColor: res.data.logoNameColor || '#029746',
            footerDeveloperCredit: {
              ...defaultCredit,
              ...(res.data.footerDeveloperCredit || {}),
            },
          });
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetchApi('/admin/media/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.success && res.data?.url) {
        setSettings((prev) => ({ ...prev, logoUrl: res.data.url }));
      }
    } catch (err) {
      console.error('Logo upload error:', err);
      setUploadError(err.message || 'Failed to upload logo image');
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetchApi('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      if (res.success && res.data) {
        setSettings(res.data);
        window.dispatchEvent(new CustomEvent('sln_settings_updated', { detail: res.data }));
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        alert(res.message || 'Failed to update company settings');
      }
    } catch (err) {
      alert(err.message || 'Failed to update company settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="p-8 text-center text-slate-500 text-xs">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Company Settings & Branding</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure official company details, brand assets, review domain, and marketing metrics.
        </p>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-xs border border-emerald-200 flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-600" />
          <span>Company settings saved and updated across public website and review tokens!</span>
        </div>
      )}

      {/* Quick Jump to Hero Trust Metrics */}
      <div className="p-4 bg-gradient-to-r from-sky-50 to-emerald-50 border border-sky-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0284c7] text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-xs">Hero Trust Metrics & Guarantee Badges (8 Tiles)</div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              Customize 40+ Yrs, 1,450+ Projects, IS Standards, Warranty options, and Chemical Matrix tiles.
            </div>
          </div>
        </div>
        <Link
          to="/admin/trust-metrics"
          className="btn btn-secondary btn-sm text-xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <span>Manage Hero Metrics</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Quick Jump to Navbar & Header Links */}
      <div className="p-4 bg-gradient-to-r from-emerald-50 to-sky-50 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Menu size={20} />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-xs">Navbar Names, Menu Links &amp; Header CTAs</div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              Rename menu tabs, change page links, reorder tabs, or customize the top announcement bar.
            </div>
          </div>
        </div>
        <Link
          to="/admin/navbar"
          className="btn btn-primary btn-sm text-xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer font-bold"
        >
          <span>Manage Navbar Links</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Quick Jump to Footer Developer Credit */}
      <div className="p-4 bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Code2 size={20} />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-xs">Footer Developer &amp; Technology Partner Credit</div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              Manage "Mythisoft Innovations Pvt. Ltd." attribution, target website link, and partner badge in the footer.
            </div>
          </div>
        </div>
        <a
          href="#footer-developer-credit"
          className="btn btn-secondary btn-sm text-xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer font-bold"
        >
          <span>Configure Credit</span>
          <ArrowRight size={13} />
        </a>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Logo, Brand Name & Color Customization (Admin Selectable) */}
        <div className="card p-6 bg-white border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <Palette size={16} className="text-[#029746]" /> Logo, Brand Name &amp; Color Customization
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Customize your official company logo, two-line brand typography, and brand accent color displayed across the website header and footer.
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[#029746] border border-emerald-200 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#029746] animate-pulse" /> Live Site Synced
            </span>
          </div>

          {/* Live Preview Card */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-600">
              <span className="flex items-center gap-1.5">
                <Eye size={14} className="text-sky-600" /> Real-time Navbar Preview
              </span>
              <span className="text-[10px] text-slate-400">Updates live as you edit below</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3.5">
              {/* Logo Preview */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-50/50 via-white to-slate-50 p-1 border border-slate-200 shadow-2xs flex items-center justify-center shrink-0">
                <img
                  src={settings.logoUrl || '/sln-logo.png'}
                  alt="Logo Preview"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/sln-logo.png';
                  }}
                />
              </div>

              {/* Brand Typography Preview */}
              <div className="flex flex-col justify-center select-none">
                <div className="leading-none">
                  <span
                    style={{ color: settings.logoNameColor || '#029746' }}
                    className="text-lg font-black tracking-tight font-heading"
                  >
                    {settings.brandNameLine1 || 'SLN ENGINEERS'}
                  </span>
                </div>
                <div className="mt-1 leading-none">
                  <span
                    style={{ color: settings.logoNameColor || '#029746' }}
                    className="text-[11px] font-bold tracking-[0.18em] uppercase font-heading"
                  >
                    {settings.brandNameLine2 || 'PROJECTS PVT. LTD.'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* 1. Logo Management */}
            <div className="space-y-3">
              <label className="form-label text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Company Logo</span>
                {settings.logoUrl && settings.logoUrl !== '/sln-logo.png' && (
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, logoUrl: '/sln-logo.png' })}
                    className="text-[10px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw size={10} /> Reset to Default
                  </button>
                )}
              </label>

              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl border border-slate-200 bg-slate-50 p-1.5 flex items-center justify-center shrink-0 shadow-2xs">
                  <img
                    src={settings.logoUrl || '/sln-logo.png'}
                    alt="Logo"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/sln-logo.png';
                    }}
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <input
                    type="file"
                    ref={logoInputRef}
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-file-input"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={uploadingLogo}
                      onClick={() => logoInputRef.current?.click()}
                      className="btn btn-secondary btn-sm text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload size={13} /> {uploadingLogo ? 'Uploading...' : 'Upload New Logo'}
                    </button>
                  </div>
                  <span className="text-[10.5px] text-slate-400 block">
                    Supports PNG, SVG, JPG or WEBP image files.
                  </span>
                </div>
              </div>

              {uploadError && (
                <div className="text-[11px] text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                  {uploadError}
                </div>
              )}

              <div>
                <label className="text-[11px] text-slate-500 mb-1 block">Or Direct Logo Image URL / Path</label>
                <input
                  type="text"
                  className="form-input text-xs"
                  placeholder="/sln-logo.png or https://..."
                  value={settings.logoUrl || ''}
                  onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                />
              </div>
            </div>

            {/* 2. Logo Name Color Selection */}
            <div className="space-y-3">
              <label className="form-label text-xs font-bold text-slate-800">
                Logo Name Color
              </label>

              <div className="flex items-center gap-3">
                {/* HTML5 Native Color Picker */}
                <div className="relative w-11 h-10 rounded-xl overflow-hidden border border-slate-300 shadow-2xs shrink-0 cursor-pointer">
                  <input
                    type="color"
                    className="absolute -inset-2 w-16 h-16 cursor-pointer border-0 p-0"
                    value={settings.logoNameColor || '#029746'}
                    onChange={(e) => setSettings({ ...settings, logoNameColor: e.target.value })}
                    title="Pick custom color"
                  />
                </div>

                {/* Hex Text Input */}
                <div className="flex-1">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">HEX</span>
                    <input
                      type="text"
                      className="form-input text-xs pl-12 font-mono font-bold"
                      placeholder="#029746"
                      value={settings.logoNameColor || '#029746'}
                      onChange={(e) => setSettings({ ...settings, logoNameColor: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Quick Preset Color Swatches */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Quick Color Presets
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {COLOR_PRESETS.map((preset) => {
                    const isSelected = (settings.logoNameColor || '#029746').toLowerCase() === preset.value.toLowerCase();
                    return (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => setSettings({ ...settings, logoNameColor: preset.value })}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-slate-800 bg-slate-900 text-white font-bold shadow-xs'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: preset.value }}
                        />
                        <span>{preset.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Logo Name Text (Line 1 & Line 2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="form-label text-xs font-bold text-slate-800">
                Logo Name Line 1 (Main Title) *
              </label>
              <input
                type="text"
                required
                className="form-input text-xs font-bold tracking-tight"
                placeholder="SLN ENGINEERS"
                value={settings.brandNameLine1 || ''}
                onChange={(e) => setSettings({ ...settings, brandNameLine1: e.target.value })}
              />
              <span className="text-[10.5px] text-slate-400 mt-0.5 block">
                Displayed in bold capital heading letters beside the logo.
              </span>
            </div>

            <div>
              <label className="form-label text-xs font-bold text-slate-800">
                Logo Name Line 2 (Subtitle / Legal Suffix) *
              </label>
              <input
                type="text"
                required
                className="form-input text-xs font-bold tracking-wider"
                placeholder="PROJECTS PVT. LTD."
                value={settings.brandNameLine2 || ''}
                onChange={(e) => setSettings({ ...settings, brandNameLine2: e.target.value })}
              />
              <span className="text-[10.5px] text-slate-400 mt-0.5 block">
                Displayed underneath line 1 with wide tracking uppercase.
              </span>
            </div>
          </div>
        </div>

        {/* Core Identity */}
        <div className="card p-6 bg-white border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
            <Shield size={16} className="text-sky-700" /> Brand Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label text-xs">Company Name *</label>
              <input
                type="text"
                required
                className="form-input text-xs"
                value={settings.companyName || ''}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label text-xs">Official Tagline *</label>
              <input
                type="text"
                required
                className="form-input text-xs"
                value={settings.tagline || ''}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="form-label text-xs">Business Classification</label>
            <input
              type="text"
              className="form-input text-xs"
              value={settings.businessType || ''}
              onChange={(e) => setSettings({ ...settings, businessType: e.target.value })}
            />
          </div>
        </div>

        {/* Contact Coordinates Notice - Moved to Contact Page Manager */}
        <div className="card p-6 bg-gradient-to-r from-sky-50/80 via-blue-50/60 to-indigo-50/80 border-sky-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
              <PhoneCall size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Contact &amp; Operational Coordinates
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-xl">
                Main office phone, emergency leakage helpline, email, WhatsApp direct number &amp; pre-filled chat message, and physical headquarters address are now centrally managed under <strong>Hotlines, Direct</strong> in the Contact Page Manager.
              </p>
            </div>
          </div>
          <Link
            to="/admin/contact"
            className="btn btn-primary text-xs shrink-0 self-start sm:self-center flex items-center gap-2 shadow-xs"
          >
            Manage in Contact Page <ArrowRight size={14} />
          </Link>
        </div>

        {/* QR Review Domain & URLs */}
        <div className="card p-6 bg-white border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
            QR Review System & External Links
          </h3>

          <div>
            <label className="form-label text-xs">
              Review Base Domain URL (Used when generating QR codes) *
            </label>
            <input
              type="url"
              required
              className="form-input text-xs"
              value={settings.reviewBaseUrl || ''}
              onChange={(e) => setSettings({ ...settings, reviewBaseUrl: e.target.value })}
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Default for local testing: <code>http://localhost:5173</code>. Change to your live production domain when deploying.
            </span>
          </div>

          <div>
            <label className="form-label text-xs">Official Google Business Profile Review URL</label>
            <input
              type="url"
              className="form-input text-xs"
              value={settings.googleReviewUrl || ''}
              onChange={(e) => setSettings({ ...settings, googleReviewUrl: e.target.value })}
            />
          </div>
        </div>

        {/* Footer Developer & Technology Partner Credit (Simple CRUD) */}
        <div id="footer-developer-credit" className="card p-6 bg-white border-slate-200 space-y-5 scroll-mt-24 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <Code2 size={16} className="text-sky-600" /> Footer Developer &amp; Technology Partner Credit (CRUD)
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Simple CRUD controls to create, update, preview, or remove the footer developer attribution credit.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold ${
                  settings.footerDeveloperCredit?.isEnabled !== false
                    ? 'bg-sky-50 text-sky-700 border-sky-200'
                    : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    settings.footerDeveloperCredit?.isEnabled !== false ? 'bg-sky-500 animate-pulse' : 'bg-slate-400'
                  }`}
                />
                {settings.footerDeveloperCredit?.isEnabled !== false ? 'Credit Active' : 'Credit Hidden'}
              </span>
            </div>
          </div>

          {/* READ: Real-Time Interactive Footer Preview Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2 text-white shadow-inner">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1.5">
                <Eye size={13} className="text-sky-400" /> Live Footer Preview
              </span>
              <span className="text-[10px] text-slate-500">Live preview as users see in the website footer</span>
            </div>

            <div className="py-3.5 px-4 rounded-xl bg-slate-900/90 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-400">
              {settings.footerDeveloperCredit?.isEnabled !== false && settings.footerDeveloperCredit?.companyName ? (
                <>
                  <div className="flex items-center flex-wrap justify-center sm:justify-start gap-1.5">
                    <span className="text-slate-400 font-medium">
                      {settings.footerDeveloperCredit?.prefixText || 'Designed & Developed by'}
                    </span>
                    <a
                      href={settings.footerDeveloperCredit?.websiteUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-sky-400 hover:text-sky-300 transition-colors inline-flex items-center gap-1 group underline-offset-4 hover:underline"
                    >
                      <span>{settings.footerDeveloperCredit?.companyName || 'Mythisoft Innovations Pvt. Ltd.'}</span>
                      <ExternalLink size={12} className="text-sky-400" />
                    </a>
                  </div>

                  {settings.footerDeveloperCredit?.badgeText && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                      <span>{settings.footerDeveloperCredit?.badgeText}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full text-center py-2 text-slate-500 italic text-[11px]">
                  (Developer credit is currently hidden / turned off in footer)
                </div>
              )}
            </div>
          </div>

          {/* CREATE / UPDATE: Simple Form Inputs */}
          <div className="space-y-4 pt-1">
            {/* Enable/Disable Toggle Switch */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-800 text-xs block">Display Developer Credit in Footer</span>
                <span className="text-[11px] text-slate-500">Turn on or off to show or hide the attribution in the website footer.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.footerDeveloperCredit?.isEnabled !== false}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      footerDeveloperCredit: {
                        ...(settings.footerDeveloperCredit || {}),
                        isEnabled: e.target.checked,
                      },
                    })
                  }
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label text-xs">Prefix Text</label>
                <input
                  type="text"
                  className="form-input text-xs"
                  placeholder="e.g. Designed & Developed by"
                  value={settings.footerDeveloperCredit?.prefixText ?? ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      footerDeveloperCredit: {
                        ...(settings.footerDeveloperCredit || {}),
                        prefixText: e.target.value,
                      },
                    })
                  }
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Default: "Designed &amp; Developed by", "Powered by", or "Crafted by"</span>
              </div>

              <div>
                <label className="form-label text-xs font-bold text-slate-800">
                  Company / Agency Name <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="form-input text-xs font-semibold"
                  placeholder="e.g. Mythisoft Innovations Pvt. Ltd."
                  value={settings.footerDeveloperCredit?.companyName ?? ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      footerDeveloperCredit: {
                        ...(settings.footerDeveloperCredit || {}),
                        companyName: e.target.value,
                      },
                    })
                  }
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Official name of the developing agency</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label text-xs">Website URL / Destination Link</label>
                <input
                  type="url"
                  className="form-input text-xs"
                  placeholder="https://mythisoft.com"
                  value={settings.footerDeveloperCredit?.websiteUrl ?? ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      footerDeveloperCredit: {
                        ...(settings.footerDeveloperCredit || {}),
                        websiteUrl: e.target.value,
                      },
                    })
                  }
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Destination website opened when users click the agency name</span>
              </div>

              <div>
                <label className="form-label text-xs">Badge / Partner Specialization Tag (Optional)</label>
                <input
                  type="text"
                  className="form-input text-xs"
                  placeholder="e.g. Technology Partner"
                  value={settings.footerDeveloperCredit?.badgeText ?? ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      footerDeveloperCredit: {
                        ...(settings.footerDeveloperCredit || {}),
                        badgeText: e.target.value,
                      },
                    })
                  }
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Optional tag displayed beside the link</span>
              </div>
            </div>

            {/* Checkbox: Open link in new tab */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="openInNewTabCheckbox"
                type="checkbox"
                className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 h-4 w-4"
                checked={settings.footerDeveloperCredit?.openInNewTab !== false}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    footerDeveloperCredit: {
                      ...(settings.footerDeveloperCredit || {}),
                      openInNewTab: e.target.checked,
                    },
                  })
                }
              />
              <label htmlFor="openInNewTabCheckbox" className="text-xs text-slate-700 font-medium cursor-pointer">
                Open developer link in a new browser tab (<code className="text-[11px] text-slate-500">target="_blank"</code>)
              </label>
            </div>

            {/* DELETE / RESET Quick Action Buttons (Simple CRUD) */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setSettings({
                      ...settings,
                      footerDeveloperCredit: {
                        isEnabled: true,
                        prefixText: 'Designed & Developed by',
                        companyName: 'Mythisoft Innovations Pvt. Ltd.',
                        websiteUrl: 'https://mythisoft.com',
                        badgeText: 'Technology Partner',
                        openInNewTab: true,
                      },
                    });
                  }}
                  className="btn btn-secondary btn-sm text-xs flex items-center gap-1.5 cursor-pointer text-slate-700 hover:text-sky-700 font-bold"
                  title="Reset to Mythisoft Innovations Pvt. Ltd."
                >
                  <RotateCcw size={13} />
                  <span>Reset to Mythisoft Default</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSettings({
                      ...settings,
                      footerDeveloperCredit: {
                        ...(settings.footerDeveloperCredit || {}),
                        isEnabled: false,
                      },
                    });
                  }}
                  className="btn btn-outline btn-sm text-xs flex items-center gap-1.5 text-rose-600 hover:bg-rose-50 border-rose-200 cursor-pointer"
                  title="Hide from footer"
                >
                  <Trash2 size={13} />
                  <span>Hide / Disable Credit</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-400 italic">
                Click "Save Company Settings" below to publish changes live.
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary btn-lg text-xs flex items-center gap-2 shadow-lg"
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save Company Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
