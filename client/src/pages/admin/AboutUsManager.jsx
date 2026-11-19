import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Save,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Layers,
  Sparkles,
  Shield,
  HelpCircle,
  Check,
  X,
  Plus,
  Trash2,
  Info,
  Calendar,
  Building2,
  HardHat,
  Search,
  FlaskConical,
  ShieldCheck,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { fetchApi } from '../../utils/api';
import { DEFAULT_ABOUT_CONTENT } from '../../utils/aboutData';

export default function AboutUsManager() {
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState('');
  const [data, setData] = useState(DEFAULT_ABOUT_CONTENT);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchApi('/admin/about');
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setData(DEFAULT_ABOUT_CONTENT);
      }
    } catch (err) {
      console.warn('API error loading about content, using default fallback:', err.message);
      setData(DEFAULT_ABOUT_CONTENT);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    setError('');

    try {
      const res = await fetchApi('/admin/about', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      if (res.success && res.data) {
        setData(res.data);
        showToast('About page content saved successfully to database!');
      } else {
        showToast(res.message || 'Failed to save to database.', 'error');
      }
    } catch (err) {
      console.error('API save error:', err);
      showToast(err.message || 'Failed to save to database.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to restore the About Us page to its official civil engineering default content? Any custom text will be replaced.')) {
      return;
    }
    setResetting(true);
    setError('');

    try {
      const res = await fetchApi('/admin/about/reset', {
        method: 'POST',
      });
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setData(DEFAULT_ABOUT_CONTENT);
      }
      showToast('About page successfully restored to factory defaults!');
    } catch (err) {
      console.warn('API reset warning, using default:', err);
      setData(DEFAULT_ABOUT_CONTENT);
      showToast('About page restored to factory defaults!');
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-600">Loading About Us Content Manager...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800 mb-2">Could Not Load About Page Data</h2>
        <p className="text-sm text-slate-600 mb-4">{error || 'Please verify the backend server is running.'}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg text-xs font-bold hover:bg-sky-700 transition-colors"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 mb-1.5">
            <Info size={13} />
            <span>Public Page Content Manager</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            About Us Page Content &amp; CRUD
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage the hero, 3-generation timeline roadmap, 4-pillar comparison, principles, and bottom callout.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <Link
            to="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-sky-600 transition-colors shadow-2xs"
          >
            <ExternalLink size={14} />
            <span>View Live Page</span>
          </Link>

          <button
            onClick={handleReset}
            disabled={resetting || saving}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors disabled:opacity-50"
          >
            <RotateCcw size={14} className={resetting ? 'animate-spin' : ''} />
            <span>{resetting ? 'Restoring...' : 'Reset to Default'}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving || resetting}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 shadow-sm shadow-sky-600/30 transition-all hover:scale-102 disabled:opacity-50"
          >
            <Save size={15} className={saving ? 'animate-spin' : ''} />
            <span>{saving ? 'Saving Changes...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold animate-fadeIn shadow-xs ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="opacity-70 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tab Navigation Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'hero' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles size={14} />
          <span>Hero &amp; Trust Metrics</span>
        </button>

        <button
          onClick={() => setActiveTab('roadmap')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'roadmap' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers size={14} />
          <span>3 Generations Roadmap</span>
        </button>

        <button
          onClick={() => setActiveTab('difference')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'difference' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Shield size={14} />
          <span>The SLN Difference (Comparison)</span>
        </button>

        <button
          onClick={() => setActiveTab('principles')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'principles' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <HardHat size={14} />
          <span>Principles &amp; CTA Banner</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: HERO SECTION & TRUST METRICS                             */}
      {/* ============================================================== */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          {/* Hero Content Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <Sparkles size={16} className="text-sky-600" />
                <span>Hero Main Copywriting</span>
              </h2>
              <span className="text-[11px] text-slate-400">Displayed in the top hero gradient container</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pill Badge Text</label>
                <input
                  type="text"
                  value={data.hero?.badge || ''}
                  onChange={(e) => setData({ ...data, hero: { ...data.hero, badge: e.target.value } })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hero Main Headline</label>
                <input
                  type="text"
                  value={data.hero?.title || ''}
                  onChange={(e) => setData({ ...data, hero: { ...data.hero, title: e.target.value } })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Paragraph Description</label>
                <textarea
                  rows={3}
                  value={data.hero?.description || ''}
                  onChange={(e) => setData({ ...data, hero: { ...data.hero, description: e.target.value } })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 font-medium leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Hero Trust Metric Badges */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <ShieldCheck size={16} className="text-teal-600" />
                <span>4 Hero Trust Metric Badges</span>
              </h2>
              <span className="text-[11px] text-slate-400">The 4 prominent floating trust metrics under the hero</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(data.trustMetrics || []).map((m, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 space-y-2.5">
                  <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    Tile 0{idx + 1}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Value (e.g. 40+, 3, 100%)</label>
                    <input
                      type="text"
                      value={m.value || ''}
                      onChange={(e) => {
                        const newMetrics = [...data.trustMetrics];
                        newMetrics[idx].value = e.target.value;
                        setData({ ...data, trustMetrics: newMetrics });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs font-black border border-slate-200 rounded-md bg-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Title / Main Label</label>
                    <input
                      type="text"
                      value={m.label || ''}
                      onChange={(e) => {
                        const newMetrics = [...data.trustMetrics];
                        newMetrics[idx].label = e.target.value;
                        setData({ ...data, trustMetrics: newMetrics });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-200 rounded-md bg-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Subtitle / Note</label>
                    <input
                      type="text"
                      value={m.sub || ''}
                      onChange={(e) => {
                        const newMetrics = [...data.trustMetrics];
                        newMetrics[idx].sub = e.target.value;
                        setData({ ...data, trustMetrics: newMetrics });
                      }}
                      className="w-full px-2.5 py-1.5 text-[11px] border border-slate-200 rounded-md bg-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: THREE-GENERATION ROADMAP                                 */}
      {/* ============================================================== */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          {/* Section Heading Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-3">
            <h2 className="text-sm font-extrabold text-slate-800">Roadmap Section Heading</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Section Title</label>
                <input
                  type="text"
                  value={data.generationsRoadmap?.sectionTitle || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      generationsRoadmap: { ...data.generationsRoadmap, sectionTitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Section Intro Subtitle</label>
                <input
                  type="text"
                  value={data.generationsRoadmap?.sectionSubtitle || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      generationsRoadmap: { ...data.generationsRoadmap, sectionSubtitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* 3 Generation Milestone Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {(data.generationsRoadmap?.cards || []).map((card, cIdx) => (
              <div key={cIdx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center font-black text-xs">
                      {cIdx + 1}
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">{card.era}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Card {cIdx + 1}</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Top Pill Tag</label>
                    <input
                      type="text"
                      value={card.pill || ''}
                      onChange={(e) => {
                        const newCards = [...data.generationsRoadmap.cards];
                        newCards[cIdx].pill = e.target.value;
                        setData({
                          ...data,
                          generationsRoadmap: { ...data.generationsRoadmap, cards: newCards },
                        });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:border-sky-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Card Subtitle</label>
                    <input
                      type="text"
                      value={card.subtitle || ''}
                      onChange={(e) => {
                        const newCards = [...data.generationsRoadmap.cards];
                        newCards[cIdx].subtitle = e.target.value;
                        setData({
                          ...data,
                          generationsRoadmap: { ...data.generationsRoadmap, cards: newCards },
                        });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:border-sky-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Detailed Description</label>
                    <textarea
                      rows={3}
                      value={card.description || ''}
                      onChange={(e) => {
                        const newCards = [...data.generationsRoadmap.cards];
                        newCards[cIdx].description = e.target.value;
                        setData({
                          ...data,
                          generationsRoadmap: { ...data.generationsRoadmap, cards: newCards },
                        });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:border-sky-500 leading-relaxed"
                    />
                  </div>

                  {/* 4 Pillar Checkpoints */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <label className="block text-[11px] font-extrabold text-slate-700">4 Pillar Checkpoints</label>
                    {(card.checkpoints || []).map((cp, pIdx) => (
                      <div key={pIdx} className="space-y-0.5">
                        <span className="text-[10px] font-bold text-sky-700">{cp.pillar}</span>
                        <input
                          type="text"
                          value={cp.text || ''}
                          onChange={(e) => {
                            const newCards = [...data.generationsRoadmap.cards];
                            newCards[cIdx].checkpoints[pIdx].text = e.target.value;
                            setData({
                              ...data,
                              generationsRoadmap: { ...data.generationsRoadmap, cards: newCards },
                            });
                          }}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: THE SLN DIFFERENCE (COMPARISON)                          */}
      {/* ============================================================== */}
      {activeTab === 'difference' && (
        <div className="space-y-6">
          {/* Section Heading Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-3">
            <h2 className="text-sm font-extrabold text-slate-800">The SLN Difference Heading</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Section Title</label>
                <input
                  type="text"
                  value={data.slnDifference?.sectionTitle || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      slnDifference: { ...data.slnDifference, sectionTitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Section Description</label>
                <input
                  type="text"
                  value={data.slnDifference?.sectionSubtitle || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      slnDifference: { ...data.slnDifference, sectionSubtitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* 2-Column Comparison Editor */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Column 1: The Cosmetic Contractor Approach (Failure) */}
            <div className="bg-white rounded-2xl border border-rose-200 p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-rose-100">
                <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center font-black text-xs">
                  <X size={14} />
                </div>
                <h3 className="text-sm font-extrabold text-rose-700">The Cosmetic Contractor Approach (Left Card)</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Card Heading</label>
                  <input
                    type="text"
                    value={data.slnDifference?.contractorApproach?.title || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        slnDifference: {
                          ...data.slnDifference,
                          contractorApproach: {
                            ...data.slnDifference.contractorApproach,
                            title: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-200 rounded-md focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Card Subtitle</label>
                  <input
                    type="text"
                    value={data.slnDifference?.contractorApproach?.subtitle || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        slnDifference: {
                          ...data.slnDifference,
                          contractorApproach: {
                            ...data.slnDifference.contractorApproach,
                            subtitle: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* 5 Failure Points */}
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <label className="block text-xs font-extrabold text-slate-700">5 Failure Points Across Disciplines</label>
                  {(data.slnDifference?.contractorApproach?.points || []).map((pt, pIdx) => (
                    <div key={pIdx} className="p-2.5 bg-rose-50/50 rounded-lg border border-rose-100 space-y-1.5">
                      <input
                        type="text"
                        value={pt.title || ''}
                        onChange={(e) => {
                          const newPts = [...data.slnDifference.contractorApproach.points];
                          newPts[pIdx].title = e.target.value;
                          setData({
                            ...data,
                            slnDifference: {
                              ...data.slnDifference,
                              contractorApproach: {
                                ...data.slnDifference.contractorApproach,
                                points: newPts,
                              },
                            },
                          });
                        }}
                        placeholder="Point Headline"
                        className="w-full px-2 py-1 text-xs font-bold border border-slate-200 rounded bg-white focus:outline-none focus:border-rose-500"
                      />
                      <textarea
                        rows={2}
                        value={pt.description || ''}
                        onChange={(e) => {
                          const newPts = [...data.slnDifference.contractorApproach.points];
                          newPts[pIdx].description = e.target.value;
                          setData({
                            ...data,
                            slnDifference: {
                              ...data.slnDifference,
                              contractorApproach: {
                                ...data.slnDifference.contractorApproach,
                                points: newPts,
                              },
                            },
                          });
                        }}
                        placeholder="Point Description"
                        className="w-full px-2 py-1 text-xs border border-slate-200 rounded bg-white focus:outline-none focus:border-rose-500 leading-snug"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Failure Outcome Banner Text</label>
                  <input
                    type="text"
                    value={data.slnDifference?.contractorApproach?.outcome || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        slnDifference: {
                          ...data.slnDifference,
                          contractorApproach: {
                            ...data.slnDifference.contractorApproach,
                            outcome: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs font-bold text-rose-800 border border-rose-200 rounded-md bg-rose-50 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Column 2: SLN 4-Pillar Engineered Standard (Success) */}
            <div className="bg-white rounded-2xl border border-teal-200 p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-teal-100">
                <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center font-black text-xs">
                  <Check size={14} />
                </div>
                <h3 className="text-sm font-extrabold text-teal-800">SLN 4-Pillar Standard (Right Card)</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Card Heading</label>
                  <input
                    type="text"
                    value={data.slnDifference?.slnStandard?.title || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        slnDifference: {
                          ...data.slnDifference,
                          slnStandard: {
                            ...data.slnDifference.slnStandard,
                            title: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-200 rounded-md focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Card Subtitle</label>
                  <input
                    type="text"
                    value={data.slnDifference?.slnStandard?.subtitle || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        slnDifference: {
                          ...data.slnDifference,
                          slnStandard: {
                            ...data.slnDifference.slnStandard,
                            subtitle: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* 5 Success Points */}
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <label className="block text-xs font-extrabold text-slate-700">5 Success Points Across Disciplines</label>
                  {(data.slnDifference?.slnStandard?.points || []).map((pt, pIdx) => (
                    <div key={pIdx} className="p-2.5 bg-teal-50/50 rounded-lg border border-teal-100 space-y-1.5">
                      <input
                        type="text"
                        value={pt.title || ''}
                        onChange={(e) => {
                          const newPts = [...data.slnDifference.slnStandard.points];
                          newPts[pIdx].title = e.target.value;
                          setData({
                            ...data,
                            slnDifference: {
                              ...data.slnDifference,
                              slnStandard: {
                                ...data.slnDifference.slnStandard,
                                points: newPts,
                              },
                            },
                          });
                        }}
                        placeholder="Point Headline"
                        className="w-full px-2 py-1 text-xs font-bold border border-slate-200 rounded bg-white focus:outline-none focus:border-teal-500"
                      />
                      <textarea
                        rows={2}
                        value={pt.description || ''}
                        onChange={(e) => {
                          const newPts = [...data.slnDifference.slnStandard.points];
                          newPts[pIdx].description = e.target.value;
                          setData({
                            ...data,
                            slnDifference: {
                              ...data.slnDifference,
                              slnStandard: {
                                ...data.slnDifference.slnStandard,
                                points: newPts,
                              },
                            },
                          });
                        }}
                        placeholder="Point Description"
                        className="w-full px-2 py-1 text-xs border border-slate-200 rounded bg-white focus:outline-none focus:border-teal-500 leading-snug"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Success Outcome Banner Text</label>
                  <input
                    type="text"
                    value={data.slnDifference?.slnStandard?.outcome || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        slnDifference: {
                          ...data.slnDifference,
                          slnStandard: {
                            ...data.slnDifference.slnStandard,
                            outcome: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs font-bold text-teal-800 border border-teal-200 rounded-md bg-teal-50 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: PRINCIPLES & BOTTOM CALLOUT BANNER                       */}
      {/* ============================================================== */}
      {activeTab === 'principles' && (
        <div className="space-y-6">
          {/* 4 Core Principles */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
            <h2 className="text-sm font-extrabold text-slate-800">4 Core Engineering Principles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(data.principles || []).map((p, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-[10px] font-bold text-sky-700 uppercase">Principle 0{idx + 1}</div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Title</label>
                    <input
                      type="text"
                      value={p.title || ''}
                      onChange={(e) => {
                        const newP = [...data.principles];
                        newP[idx].title = e.target.value;
                        setData({ ...data, principles: newP });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-200 rounded-md bg-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Description</label>
                    <textarea
                      rows={2}
                      value={p.description || ''}
                      onChange={(e) => {
                        const newP = [...data.principles];
                        newP[idx].description = e.target.value;
                        setData({ ...data, principles: newP });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md bg-white focus:outline-none focus:border-sky-500 leading-snug"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Consultation CTA Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
            <h2 className="text-sm font-extrabold text-slate-800">Bottom Consultation Banner Copy</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Banner Title</label>
                <input
                  type="text"
                  value={data.ctaBanner?.title || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      ctaBanner: { ...data.ctaBanner, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Banner Subtitle</label>
                <input
                  type="text"
                  value={data.ctaBanner?.subtitle || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      ctaBanner: { ...data.ctaBanner, subtitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description</label>
                <textarea
                  rows={2}
                  value={data.ctaBanner?.description || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      ctaBanner: { ...data.ctaBanner, description: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Save Bar for convenience */}
      <div className="sticky bottom-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-xl flex items-center justify-between z-30">
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <Info size={14} className="text-sky-600" />
          <span>Remember to save your changes when finished editing.</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saving || resetting}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 shadow-md shadow-sky-600/30 transition-all hover:scale-102 disabled:opacity-50"
          >
            <Save size={15} className={saving ? 'animate-spin' : ''} />
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
