import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Save,
  RotateCcw,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Layers,
  Eye,
  Sliders,
  Briefcase,
  Star,
  ShieldCheck,
  Search,
  FlaskConical,
  HardHat,
  MessageCircle,
  Phone,
  Plus,
  Trash2,
  Edit2,
  ChevronRight,
  ArrowRight,
  MoveHorizontal,
  Images,
} from 'lucide-react';
import { fetchApi } from '../../utils/api';
import {
  DEFAULT_HOME_CONTENT,
  LOCAL_STORAGE_HOME_CONTENT_KEY,
  TRUST_CARD_ICONS,
  renderTrustCardIcon,
} from '../../utils/homeData';

export default function HomePageManager() {
  const [activeTab, setActiveTab] = useState('pillars'); // 'pillars' | 'transformations' | 'case-studies' | 'reviews' | 'bottom-cta'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [homeData, setHomeData] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_HOME_CONTENT_KEY);
      if (stored) {
        return { ...DEFAULT_HOME_CONTENT, ...JSON.parse(stored) };
      }
    } catch {}
    return DEFAULT_HOME_CONTENT;
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Load from MongoDB settings
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchApi('/settings');
      if (res.success && res.data?.homePageContent && Object.keys(res.data.homePageContent).length > 0) {
        const merged = { ...DEFAULT_HOME_CONTENT, ...res.data.homePageContent };
        setHomeData(merged);
        try {
          localStorage.setItem(LOCAL_STORAGE_HOME_CONTENT_KEY, JSON.stringify(merged));
        } catch {}
      } else {
        const stored = localStorage.getItem(LOCAL_STORAGE_HOME_CONTENT_KEY);
        if (stored) {
          try {
            setHomeData({ ...DEFAULT_HOME_CONTENT, ...JSON.parse(stored) });
          } catch {
            setHomeData(DEFAULT_HOME_CONTENT);
          }
        }
      }
    } catch (e) {
      console.warn('Could not load home content from settings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save changes to localStorage and MongoDB CompanySettings
  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSaving(true);
    try {
      // 1. Instant local persistence & reactive events
      localStorage.setItem(LOCAL_STORAGE_HOME_CONTENT_KEY, JSON.stringify(homeData));
      window.dispatchEvent(new Event('sln_home_content_updated'));
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: LOCAL_STORAGE_HOME_CONTENT_KEY,
          newValue: JSON.stringify(homeData),
        })
      );

      // 2. Persist to MongoDB CompanySettings
      const res = await fetchApi('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({ homePageContent: homeData }),
      });

      if (res.success) {
        showToast('Home page content saved and published successfully!');
      } else {
        showToast('Saved locally in browser.');
      }
    } catch (err) {
      console.error('Error saving home page content:', err);
      showToast('Saved locally in browser.');
    } finally {
      setSaving(false);
    }
  };

  // Reset entire page or current section to defaults
  const handleResetDefaults = async () => {
    if (!window.confirm('Reset all Homepage section copy back to default text?')) return;
    setResetting(true);
    try {
      setHomeData(DEFAULT_HOME_CONTENT);
      localStorage.setItem(LOCAL_STORAGE_HOME_CONTENT_KEY, JSON.stringify(DEFAULT_HOME_CONTENT));
      window.dispatchEvent(new Event('sln_home_content_updated'));
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: LOCAL_STORAGE_HOME_CONTENT_KEY,
          newValue: JSON.stringify(DEFAULT_HOME_CONTENT),
        })
      );

      await fetchApi('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({ homePageContent: DEFAULT_HOME_CONTENT }),
      });

      showToast('Home page content reset to defaults!');
    } catch (err) {
      showToast('Reset locally.');
    } finally {
      setResetting(false);
    }
  };

  // Helper for deep updates
  const updateSection = (sectionKey, field, value) => {
    setHomeData((prev) => ({
      ...prev,
      [sectionKey]: {
        ...(prev[sectionKey] || {}),
        [field]: value,
      },
    }));
  };

  // Lineage Trust Card helpers
  const handleUpdateTrustCard = (idx, field, value) => {
    const list = [...(homeData.lineageSection?.trustCards || [])];
    if (!list[idx]) return;
    list[idx] = { ...list[idx], [field]: value };
    updateSection('lineageSection', 'trustCards', list);
  };

  const handleAddTrustCard = () => {
    const list = [...(homeData.lineageSection?.trustCards || [])];
    list.push({
      icon: 'ShieldCheck',
      title: 'New Engineering Standard',
      description: 'Documented inspection and certified application methodology',
    });
    updateSection('lineageSection', 'trustCards', list);
  };

  const handleDeleteTrustCard = (idx) => {
    const list = (homeData.lineageSection?.trustCards || []).filter((_, i) => i !== idx);
    updateSection('lineageSection', 'trustCards', list);
  };

  const pillars = homeData.pillarsSection || DEFAULT_HOME_CONTENT.pillarsSection;
  const transformations = homeData.transformationsSection || DEFAULT_HOME_CONTENT.transformationsSection;
  const caseStudies = homeData.caseStudiesSection || DEFAULT_HOME_CONTENT.caseStudiesSection;
  const lineage = homeData.lineageSection || DEFAULT_HOME_CONTENT.lineageSection;
  const reviews = homeData.reviewsSection || DEFAULT_HOME_CONTENT.reviewsSection;
  const bottomCta = homeData.bottomCtaSection || DEFAULT_HOME_CONTENT.bottomCtaSection;

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
              Home Page Manager
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-bold text-slate-500">Public Homepage Section Copy &amp; CTAs</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Home Page Content &amp; Section CRUD
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Customize all section headings, technical descriptions, value cards, and call-to-actions across the public homepage. Changes update in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetDefaults}
            disabled={resetting}
            className="btn btn-outline btn-sm text-xs flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900"
            title="Reset all sections to factory defaults"
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
            <span>View Live Home</span>
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary btn-sm text-xs flex items-center gap-1.5 shadow-sm cursor-pointer font-bold"
          >
            <Save size={15} />
            <span>{saving ? 'Saving...' : 'Save & Publish All'}</span>
          </button>
        </div>
      </div>

      {/* Quick Links to Related Home Admin Controls */}
      <div className="bg-gradient-to-r from-sky-50 via-slate-50 to-indigo-50 p-4 rounded-2xl border border-sky-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-sky-600 shrink-0" />
          <span className="font-extrabold text-slate-900">Related Homepage Media Modules:</span>
          <span className="text-slate-500 hidden sm:inline">Individual banner slides and horizontal cards have dedicated managers:</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/banners"
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-sky-700 hover:text-sky-900 font-bold flex items-center gap-1 shadow-2xs"
          >
            <Images size={13} />
            <span>Hero Banners Carousel</span>
          </Link>
          <Link
            to="/admin/pillar-cards"
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-slate-900 font-bold flex items-center gap-1 shadow-2xs"
          >
            <MoveHorizontal size={13} />
            <span>Pillar Cards &amp; Video Glimpse</span>
          </Link>
          <Link
            to="/admin/projects"
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-slate-900 font-bold flex items-center gap-1 shadow-2xs"
          >
            <Briefcase size={13} />
            <span>Transformation Slider Showcases</span>
          </Link>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('pillars')}
          className={`py-2.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'pillars'
              ? 'border-sky-600 text-sky-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers size={14} />
          <span>1. 4 Pillars &amp; Core Practice</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('transformations')}
          className={`py-2.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'transformations'
              ? 'border-sky-600 text-sky-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders size={14} />
          <span>2. Proven Field Transformations</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('case-studies')}
          className={`py-2.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'case-studies'
              ? 'border-sky-600 text-sky-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase size={14} />
          <span>3. Case Studies &amp; Lineage Cards</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reviews')}
          className={`py-2.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'reviews'
              ? 'border-sky-600 text-sky-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Star size={14} />
          <span>4. Client Reviews &amp; Handover</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bottom-cta')}
          className={`py-2.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'bottom-cta'
              ? 'border-sky-600 text-sky-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Phone size={14} />
          <span>5. Bottom Diagnostic CTA Band</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: 4 PILLARS & CORE PRACTICE (SECTION 2.5)                       */}
      {/* ===================================================================== */}
      {activeTab === 'pillars' && (
        <div className="space-y-6">
          {/* Live Preview Simulation Card */}
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Eye size={13} />
              <span>Live Section Preview (As seen on Home)</span>
            </span>
            <div className="bg-slate-50/90 rounded-2xl border border-slate-200 p-6 sm:p-8 text-center max-w-4xl mx-auto shadow-sm">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-sky-50 text-sky-700 border border-sky-200 shadow-2xs mb-3">
                <Sparkles size={13} className="text-sky-600 shrink-0" />
                <span>{pillars.eyebrow || 'Specialized Civil Engineering'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
                {pillars.title || 'Four Disciplines. One Trusted Civil Engineering Standard.'}
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
                {pillars.description ||
                  'Backed by over 40 years of continuous practice across four specialized pillars. Explore our proven methodologies, authorized chemical formulations, and verified field transformations.'}
              </p>
            </div>
          </div>

          {/* Form Fields Card */}
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900">Specialized Disciplines Section Header</h3>
                <p className="text-xs text-slate-500 mt-0.5">Appears directly above the horizontal 4 Pillar Cards on the home page</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700">Section 2.5</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Section Eyebrow Badge</label>
                <input
                  type="text"
                  className="form-input text-xs w-full py-2.5 px-3 rounded-xl border border-slate-300 font-medium"
                  placeholder="e.g. Specialized Civil Engineering"
                  value={pillars.eyebrow || ''}
                  onChange={(e) => updateSection('pillarsSection', 'eyebrow', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Main Section Title</label>
                <input
                  type="text"
                  className="form-input text-sm w-full py-2.5 px-3 rounded-xl border border-slate-300 font-bold"
                  placeholder="e.g. Four Disciplines. One Trusted Civil Engineering Standard."
                  value={pillars.title || ''}
                  onChange={(e) => updateSection('pillarsSection', 'title', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description Paragraph</label>
                <textarea
                  rows={3}
                  className="form-input text-xs w-full py-2.5 px-3 rounded-xl border border-slate-300 leading-relaxed"
                  placeholder="Explain your 4 specialized engineering pillars..."
                  value={pillars.description || ''}
                  onChange={(e) => updateSection('pillarsSection', 'description', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Card Header Left Label</label>
                  <input
                    type="text"
                    className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300"
                    placeholder="Execution Discipline Pillars"
                    value={pillars.cardHeaderTitle || ''}
                    onChange={(e) => updateSection('pillarsSection', 'cardHeaderTitle', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Card Header Subtitle / Guidance</label>
                  <input
                    type="text"
                    className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300"
                    placeholder="Click any image or pillar name to view its specialized civil engineering services"
                    value={pillars.cardHeaderSubtitle || ''}
                    onChange={(e) => updateSection('pillarsSection', 'cardHeaderSubtitle', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link to="/admin/pillar-cards" className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1">
                <span>Configure the 4 Individual Pillar Card Images &amp; Glimpse Video</span>
                <ChevronRight size={14} />
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary btn-sm text-xs flex items-center gap-1.5 font-bold px-6 shadow-md shadow-sky-600/20"
              >
                <Save size={14} />
                <span>{saving ? 'Saving...' : 'Save Section'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: PROVEN FIELD TRANSFORMATIONS (SECTION 3)                      */}
      {/* ===================================================================== */}
      {activeTab === 'transformations' && (
        <div className="space-y-6">
          {/* Live Preview Simulation Card */}
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Eye size={13} />
              <span>Live Section Preview (As seen on Home)</span>
            </span>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 max-w-3xl shadow-sm space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-sky-50 text-sky-700 border border-sky-200/90 shadow-2xs">
                <Sparkles size={13} className="text-sky-600 shrink-0" />
                <span>{transformations.eyebrow || 'Proven Transformation'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {transformations.title || 'Documented Proof: Real Field Transformations'}
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {transformations.description ||
                  'Every project is engineered, executed, and verified on site. Drag the slider to inspect how hydrostatic seepage, structural cracks, and weathered surfaces are permanently restored.'}
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                <Sliders size={13} className="text-sky-600" />
                <span>{transformations.pillSelectorLabel || 'View Transformation by Discipline Pillar:'}</span>
              </div>
            </div>
          </div>

          {/* Form Fields Card */}
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900">Proven Field Transformations Section Header</h3>
                <p className="text-xs text-slate-500 mt-0.5">Controls the interactive Before &amp; After slider section on the home page</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700">Section 3</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Section Eyebrow Badge</label>
                <input
                  type="text"
                  className="form-input text-xs w-full py-2.5 px-3 rounded-xl border border-slate-300 font-medium"
                  placeholder="e.g. Proven Transformation"
                  value={transformations.eyebrow || ''}
                  onChange={(e) => updateSection('transformationsSection', 'eyebrow', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Main Section Title</label>
                <input
                  type="text"
                  className="form-input text-sm w-full py-2.5 px-3 rounded-xl border border-slate-300 font-bold"
                  placeholder="e.g. Documented Proof: Real Field Transformations"
                  value={transformations.title || ''}
                  onChange={(e) => updateSection('transformationsSection', 'title', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description Paragraph</label>
                <textarea
                  rows={3}
                  className="form-input text-xs w-full py-2.5 px-3 rounded-xl border border-slate-300 leading-relaxed"
                  placeholder="Explain how visitors can drag the slider to verify before/after restorations..."
                  value={transformations.description || ''}
                  onChange={(e) => updateSection('transformationsSection', 'description', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Discipline Pillar Selector Label</label>
                <input
                  type="text"
                  className="form-input text-xs w-full py-2.5 px-3 rounded-xl border border-slate-300 font-medium"
                  placeholder="View Transformation by Discipline Pillar:"
                  value={transformations.pillSelectorLabel || ''}
                  onChange={(e) => updateSection('transformationsSection', 'pillSelectorLabel', e.target.value)}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link to="/admin/projects" className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1">
                <span>Manage which Project displays for each Pillar on the Homepage Slider</span>
                <ChevronRight size={14} />
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary btn-sm text-xs flex items-center gap-1.5 font-bold px-6 shadow-md shadow-sky-600/20"
              >
                <Save size={14} />
                <span>{saving ? 'Saving...' : 'Save Section'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: CASE STUDIES & OUR LINEAGE (SECTIONS 4 & 5)                   */}
      {/* ===================================================================== */}
      {activeTab === 'case-studies' && (
        <div className="space-y-6">
          {/* Section 4: Featured Case Studies */}
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900">Featured Case Studies Section Header</h3>
                <p className="text-xs text-slate-500 mt-0.5">Header above the 3 starred case study cards on the homepage</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700">Section 4</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Eyebrow Badge</label>
                <input
                  type="text"
                  className="form-input text-xs w-full py-2.5 px-3 rounded-xl border border-slate-300 font-medium"
                  placeholder="Case Studies"
                  value={caseStudies.eyebrow || ''}
                  onChange={(e) => updateSection('caseStudiesSection', 'eyebrow', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Main Section Title</label>
                <input
                  type="text"
                  className="form-input text-xs w-full py-2.5 px-3 rounded-xl border border-slate-300 font-bold"
                  placeholder="Featured Civil Engineering Case Studies"
                  value={caseStudies.title || ''}
                  onChange={(e) => updateSection('caseStudiesSection', 'title', e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Description Paragraph</label>
                <textarea
                  rows={2}
                  className="form-input text-xs w-full py-2.5 px-3 rounded-xl border border-slate-300 leading-relaxed"
                  placeholder="Real restoration projects documented with root-cause diagnostics..."
                  value={caseStudies.description || ''}
                  onChange={(e) => updateSection('caseStudiesSection', 'description', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">CTA Button Text</label>
                <input
                  type="text"
                  className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300 font-bold"
                  placeholder="View Entire Portfolio"
                  value={caseStudies.ctaText || ''}
                  onChange={(e) => updateSection('caseStudiesSection', 'ctaText', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">CTA Button Link Path</label>
                <input
                  type="text"
                  className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300 font-mono"
                  placeholder="/projects"
                  value={caseStudies.ctaLink || ''}
                  onChange={(e) => updateSection('caseStudiesSection', 'ctaLink', e.target.value)}
                />
              </div>
            </div>
          </form>

          {/* Section 5: Our Lineage Narrative & Trust Cards CRUD */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900">Our Lineage: Why Property Owners Trust Us</h3>
                <p className="text-xs text-slate-500 mt-0.5">Edit the narrative column and customized 4 value/trust cards</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Section 5</span>
            </div>

            {/* Narrative inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Eyebrow Label</label>
                <input
                  type="text"
                  className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300 font-medium"
                  placeholder="Our Lineage"
                  value={lineage.eyebrow || ''}
                  onChange={(e) => updateSection('lineageSection', 'eyebrow', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Section Title</label>
                <input
                  type="text"
                  className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300 font-bold"
                  placeholder="Why Property Owners Trust SLN Engineers"
                  value={lineage.title || ''}
                  onChange={(e) => updateSection('lineageSection', 'title', e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Lineage Summary Paragraph</label>
                <textarea
                  rows={2}
                  className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300 leading-relaxed"
                  placeholder="Carrying forward three generations of civil engineering integrity..."
                  value={lineage.description || ''}
                  onChange={(e) => updateSection('lineageSection', 'description', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reviews Button Text</label>
                <input
                  type="text"
                  className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300 font-bold"
                  placeholder="View Google Reviews"
                  value={lineage.ctaText || ''}
                  onChange={(e) => updateSection('lineageSection', 'ctaText', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reviews Button Link Path</label>
                <input
                  type="text"
                  className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300 font-mono"
                  placeholder="/reviews"
                  value={lineage.ctaLink || ''}
                  onChange={(e) => updateSection('lineageSection', 'ctaLink', e.target.value)}
                />
              </div>
            </div>

            {/* Complete CRUD for the Trust Cards */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    4 Engineering Trust Cards ({lineage.trustCards?.length || 0})
                  </h4>
                  <p className="text-[11px] text-slate-500">Displayed in one horizontal row beside the lineage narrative</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddTrustCard}
                  className="btn btn-outline btn-sm text-xs flex items-center gap-1 text-sky-700 hover:text-sky-900 cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Add Trust Card</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {(lineage.trustCards || []).map((card, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-xl border border-slate-200 p-3.5 space-y-3 relative group">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-full bg-[#0284c7] text-white flex items-center justify-center shrink-0 shadow-2xs">
                        {renderTrustCardIcon(card.icon, 16)}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteTrustCard(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                        title="Remove card"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Icon</label>
                      <select
                        className="form-select text-[11px] w-full py-1 px-2 rounded-lg border border-slate-300 bg-white"
                        value={card.icon}
                        onChange={(e) => handleUpdateTrustCard(idx, 'icon', e.target.value)}
                      >
                        {TRUST_CARD_ICONS.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Title</label>
                      <input
                        type="text"
                        className="form-input text-xs w-full py-1.5 px-2 rounded-lg border border-slate-300 font-bold bg-white"
                        value={card.title || ''}
                        onChange={(e) => handleUpdateTrustCard(idx, 'title', e.target.value)}
                        placeholder="Card title"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Description</label>
                      <textarea
                        rows={2}
                        className="form-input text-[11px] w-full py-1 px-2 rounded-lg border border-slate-300 bg-white leading-relaxed"
                        value={card.description || ''}
                        onChange={(e) => handleUpdateTrustCard(idx, 'description', e.target.value)}
                        placeholder="Short technical description"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="btn btn-primary btn-sm text-xs flex items-center gap-1.5 font-bold px-6 shadow-md shadow-sky-600/20"
              >
                <Save size={14} />
                <span>{saving ? 'Saving...' : 'Save Section'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: CLIENT REVIEWS & HANDOVER (SECTION 8)                         */}
      {/* ===================================================================== */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900">Verified Client Reviews Section Header</h3>
                <p className="text-xs text-slate-500 mt-0.5">Controls the reviews intro and Google Business review invite strip</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700">Section 8</span>
            </div>

            {/* Section 8 Header */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Eyebrow Label</label>
                <input
                  type="text"
                  className="form-input text-xs w-full py-2.5 px-3 rounded-xl border border-slate-300 font-medium"
                  placeholder="Authentic Client Voices"
                  value={reviews.eyebrow || ''}
                  onChange={(e) => updateSection('reviewsSection', 'eyebrow', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Section Title</label>
                <input
                  type="text"
                  className="form-input text-xs w-full py-2.5 px-3 rounded-xl border border-slate-300 font-bold"
                  placeholder="Verified Client Reviews & Handover Ratings"
                  value={reviews.title || ''}
                  onChange={(e) => updateSection('reviewsSection', 'title', e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Description Paragraph</label>
                <textarea
                  rows={2}
                  className="form-input text-xs w-full py-2.5 px-3 rounded-xl border border-slate-300 leading-relaxed"
                  placeholder="Direct feedback from residential homeowners..."
                  value={reviews.description || ''}
                  onChange={(e) => updateSection('reviewsSection', 'description', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Write Review CTA Button Text</label>
                <input
                  type="text"
                  className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300 font-bold"
                  placeholder="Write a Google Review"
                  value={reviews.ctaText || ''}
                  onChange={(e) => updateSection('reviewsSection', 'ctaText', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Button Link Path</label>
                <input
                  type="text"
                  className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300 font-mono"
                  placeholder="/reviews"
                  value={reviews.ctaLink || ''}
                  onChange={(e) => updateSection('reviewsSection', 'ctaLink', e.target.value)}
                />
              </div>
            </div>

            {/* Google Review Invite Banner Strip */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Google Review Invitation Strip (Mockup Strip)
                  </h4>
                  <p className="text-[11px] text-slate-500">Dark high-contrast banner strip inviting customers to leave Google feedback</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Banner Headline</label>
                  <input
                    type="text"
                    className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300 font-bold"
                    placeholder="Have You Used SLN Engineers Services?"
                    value={reviews.googleBanner?.headline || ''}
                    onChange={(e) =>
                      setHomeData((prev) => ({
                        ...prev,
                        reviewsSection: {
                          ...prev.reviewsSection,
                          googleBanner: {
                            ...(prev.reviewsSection?.googleBanner || {}),
                            headline: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rating Tagline</label>
                  <input
                    type="text"
                    className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300 font-medium italic"
                    placeholder="Trusted by Generations"
                    value={reviews.googleBanner?.tagline || ''}
                    onChange={(e) =>
                      setHomeData((prev) => ({
                        ...prev,
                        reviewsSection: {
                          ...prev.reviewsSection,
                          googleBanner: {
                            ...(prev.reviewsSection?.googleBanner || {}),
                            tagline: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Banner Description</label>
                  <input
                    type="text"
                    className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300"
                    placeholder="We believe in 100% transparent client feedback. Share your candid review on our official Google Business listing."
                    value={reviews.googleBanner?.description || ''}
                    onChange={(e) =>
                      setHomeData((prev) => ({
                        ...prev,
                        reviewsSection: {
                          ...prev.reviewsSection,
                          googleBanner: {
                            ...(prev.reviewsSection?.googleBanner || {}),
                            description: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Google Review Button Label</label>
                  <input
                    type="text"
                    className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300 font-bold"
                    placeholder="Write a Google Review"
                    value={reviews.googleBanner?.ctaText || ''}
                    onChange={(e) =>
                      setHomeData((prev) => ({
                        ...prev,
                        reviewsSection: {
                          ...prev.reviewsSection,
                          googleBanner: {
                            ...(prev.reviewsSection?.googleBanner || {}),
                            ctaText: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Official Google Review Link URL</label>
                  <input
                    type="url"
                    className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300 font-mono text-sky-700"
                    placeholder="https://g.page/r/slnengineers/review"
                    value={reviews.googleBanner?.ctaLink || ''}
                    onChange={(e) =>
                      setHomeData((prev) => ({
                        ...prev,
                        reviewsSection: {
                          ...prev.reviewsSection,
                          googleBanner: {
                            ...(prev.reviewsSection?.googleBanner || {}),
                            ctaLink: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link to="/admin/reviews" className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1">
                <span>Moderate Individual Customer Reviews &amp; Testimonials</span>
                <ChevronRight size={14} />
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary btn-sm text-xs flex items-center gap-1.5 font-bold px-6 shadow-md shadow-sky-600/20"
              >
                <Save size={14} />
                <span>{saving ? 'Saving...' : 'Save Section'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 5: BOTTOM DIAGNOSTIC CTA BAND                                    */}
      {/* ===================================================================== */}
      {activeTab === 'bottom-cta' && (
        <div className="space-y-6">
          {/* Live Preview Simulation Card */}
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Eye size={13} />
              <span>Live Section Preview (Bottom of Home)</span>
            </span>
            <div className="bg-[#04152b] text-white rounded-2xl p-8 sm:p-10 text-center max-w-4xl mx-auto shadow-xl border border-slate-800 space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-400/30">
                {bottomCta.eyebrow || 'Ready for Zero-Leak Protection?'}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                {bottomCta.title || 'Protect Your Structure with Licensed Civil Engineers'}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
                {bottomCta.description ||
                  'Schedule an on-site technical inspection today. Our senior engineers will survey your property with non-destructive thermal moisture meters and provide an itemized technical diagnostic proposal.'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                <span className="px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-[#0284c7] shadow-md flex items-center gap-1.5">
                  <span>{bottomCta.primaryCtaText || 'Book Site Visit'}</span>
                  <ArrowRight size={14} />
                </span>
                <span className="px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-slate-800 border border-slate-700 flex items-center gap-1.5">
                  <Phone size={14} />
                  <span>{bottomCta.phoneCtaText || 'Call Senior Engineer'}</span>
                </span>
                <span className="px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-[#25D366] flex items-center gap-1.5">
                  <MessageCircle size={14} />
                  <span>{bottomCta.whatsappCtaText || 'WhatsApp'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Form Fields Card */}
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900">Bottom Diagnostic Inspection CTA Band</h3>
                <p className="text-xs text-slate-500 mt-0.5">High-impact conversion strip at the very bottom of the homepage</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700">Bottom CTA</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Eyebrow Badge</label>
                <input
                  type="text"
                  className="form-input text-xs w-full py-2.5 px-3 rounded-xl border border-slate-300 font-medium"
                  placeholder="Ready for Zero-Leak Protection?"
                  value={bottomCta.eyebrow || ''}
                  onChange={(e) => updateSection('bottomCtaSection', 'eyebrow', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Headline Title</label>
                <input
                  type="text"
                  className="form-input text-sm w-full py-2.5 px-3 rounded-xl border border-slate-300 font-bold"
                  placeholder="Protect Your Structure with Licensed Civil Engineers"
                  value={bottomCta.title || ''}
                  onChange={(e) => updateSection('bottomCtaSection', 'title', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description Paragraph</label>
                <textarea
                  rows={3}
                  className="form-input text-xs w-full py-2.5 px-3 rounded-xl border border-slate-300 leading-relaxed"
                  placeholder="Schedule an on-site technical inspection today..."
                  value={bottomCta.description || ''}
                  onChange={(e) => updateSection('bottomCtaSection', 'description', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary CTA Button Text</label>
                  <input
                    type="text"
                    className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300 font-bold"
                    placeholder="Book Site Visit"
                    value={bottomCta.primaryCtaText || ''}
                    onChange={(e) => updateSection('bottomCtaSection', 'primaryCtaText', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary CTA Link Target</label>
                  <input
                    type="text"
                    className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300 font-mono"
                    placeholder="/contact"
                    value={bottomCta.primaryCtaLink || ''}
                    onChange={(e) => updateSection('bottomCtaSection', 'primaryCtaLink', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Button Text Template</label>
                  <input
                    type="text"
                    className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300"
                    placeholder="Call {phone}"
                    value={bottomCta.phoneCtaText || ''}
                    onChange={(e) => updateSection('bottomCtaSection', 'phoneCtaText', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Button Label</label>
                  <input
                    type="text"
                    className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300"
                    placeholder="WhatsApp"
                    value={bottomCta.whatsappCtaText || ''}
                    onChange={(e) => updateSection('bottomCtaSection', 'whatsappCtaText', e.target.value)}
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
                <span>{saving ? 'Saving...' : 'Save Section'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
