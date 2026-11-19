import React, { useState, useEffect, useRef } from 'react';
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
  PhoneCall,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  AlertTriangle,
  FileText,
  Eye,
  Sliders,
  ChevronDown,
  ChevronUp,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { fetchApi } from '../../utils/api';
import { DEFAULT_CONTACT_CONTENT } from '../../utils/contactData';

export default function ContactPageManager() {
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState('');
  const [data, setData] = useState(DEFAULT_CONTACT_CONTENT);
  const [showPreview, setShowPreview] = useState(true);

  // Hero Banner Image CRUD states
  const heroImageInputRef = useRef(null);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [heroImageError, setHeroImageError] = useState('');

  // New item states
  const [newSymptom, setNewSymptom] = useState('');
  const [activeDisciplineIndex, setActiveDisciplineIndex] = useState(0);
  const [newCategory, setNewCategory] = useState('');
  const [newFaq, setNewFaq] = useState({ q: '', a: '' });
  const [isAddingFaq, setIsAddingFaq] = useState(false);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingHeroImage(true);
    setHeroImageError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetchApi('/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.success && res.data?.url) {
        setData((prev) => ({
          ...prev,
          hero: {
            ...prev.hero,
            imageUrl: res.data.url,
          },
        }));
        showToast('Banner photo uploaded and preview updated!');
      } else {
        throw new Error(res.message || 'Image upload failed');
      }
    } catch (err) {
      console.error('Hero banner upload failed:', err);
      setHeroImageError(err.message || 'Failed to upload photo');
      showToast(err.message || 'Image upload failed', 'error');
    } finally {
      setUploadingHeroImage(false);
      if (heroImageInputRef.current) heroImageInputRef.current.value = '';
    }
  };

  const handleHeroImageDelete = () => {
    if (window.confirm('Remove the hero banner photo? You can upload a new one or reset to default anytime.')) {
      setData((prev) => ({
        ...prev,
        hero: {
          ...prev.hero,
          imageUrl: '',
        },
      }));
      showToast('Banner photo removed.');
    }
  };

  const handleHeroImageReset = () => {
    setData((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        imageUrl: '/uploads/ModernHomeWaterproofingProtect-1792165882439-41612578.png',
        imageAlt: 'SLN Engineers Civil Protection',
        imageCaption: 'Engineering Structural Defense',
        imageBadge: 'All 4 Disciplines',
      },
    }));
    showToast('Reset to official SLN default banner photo.');
  };

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [res, settingsRes] = await Promise.allSettled([
        fetchApi('/admin/contact'),
        fetchApi('/admin/settings'),
      ]);

      let loadedContact = null;
      if (res.status === 'fulfilled' && res.value?.success && res.value?.data) {
        loadedContact = res.value.data;
      }

      let loadedSettings = null;
      if (settingsRes.status === 'fulfilled' && settingsRes.value?.success && settingsRes.value?.data) {
        loadedSettings = settingsRes.value.data;
      }

      const base = loadedContact || DEFAULT_CONTACT_CONTENT;
      // Merge in any coordinates from settings if not set, and preserve hero banner image
      const merged = {
        ...base,
        hero: {
          ...DEFAULT_CONTACT_CONTENT.hero,
          ...base.hero,
          imageUrl: base.hero?.imageUrl !== undefined ? base.hero.imageUrl : DEFAULT_CONTACT_CONTENT.hero.imageUrl,
          imageAlt: base.hero?.imageAlt || DEFAULT_CONTACT_CONTENT.hero.imageAlt || 'SLN Engineers Civil Protection',
          imageCaption: base.hero?.imageCaption || DEFAULT_CONTACT_CONTENT.hero.imageCaption || 'Engineering Structural Defense',
          imageBadge: base.hero?.imageBadge || DEFAULT_CONTACT_CONTENT.hero.imageBadge || 'All 4 Disciplines',
        },
        hotlines: {
          ...base.hotlines,
          helpline: base.hotlines?.helpline || loadedSettings?.phone || '+91 8977668776',
          emergencyPhone: base.hotlines?.emergencyPhone || loadedSettings?.emergencyPhone || '+91 8977668776',
          email: base.hotlines?.email || loadedSettings?.email || 'contact@slnengineers.com',
          whatsapp: base.hotlines?.whatsapp || loadedSettings?.whatsappNumber || '+91 8977668776',
          whatsappDefaultMessage:
            base.hotlines?.whatsappDefaultMessage ||
            loadedSettings?.whatsappDefaultMessage ||
            'Hello SLN Engineers, I would like to request an on-site waterproofing inspection.',
        },
        headquarters: {
          ...base.headquarters,
          street: base.headquarters?.street || loadedSettings?.address?.street || 'Medipally, Hyderabad',
          area: base.headquarters?.area || loadedSettings?.address?.area || 'Hyderabad, Telangana',
          city: base.headquarters?.city || loadedSettings?.address?.city || 'Hyderabad',
          state: base.headquarters?.state || loadedSettings?.address?.state || 'Telangana',
          pincode: base.headquarters?.pincode || loadedSettings?.address?.pincode || '',
        },
      };

      setData(merged);
    } catch (err) {
      console.warn('API error loading contact content, using defaults:', err.message);
      setData(DEFAULT_CONTACT_CONTENT);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      window.dispatchEvent(new Event('sln_contact_updated'));

      // Dispatch real-time settings event so Header, Footer, and other components re-render immediately
      const syncedSettings = {
        phone: data.hotlines?.helpline,
        emergencyPhone: data.hotlines?.emergencyPhone,
        email: data.hotlines?.email,
        whatsappNumber: data.hotlines?.whatsapp,
        whatsappDefaultMessage: data.hotlines?.whatsappDefaultMessage,
        address: {
          street: data.headquarters?.street,
          area: data.headquarters?.area,
          city: data.headquarters?.city,
          state: data.headquarters?.state,
          pincode: data.headquarters?.pincode,
        },
      };
      window.dispatchEvent(new CustomEvent('sln_settings_updated', { detail: syncedSettings }));

      await fetchApi('/admin/contact', {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      showToast('Contact Page content & operational coordinates saved successfully to database!');
    } catch (err) {
      setError(err.message || 'Failed to save contact content.');
      showToast(err.message || 'Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset the Contact Us page to official SLN Engineering defaults? All custom changes will be replaced.')) {
      return;
    }
    setResetting(true);
    try {
      setData(DEFAULT_CONTACT_CONTENT);
      window.dispatchEvent(new Event('sln_contact_updated'));

      try {
        await fetchApi('/admin/contact/reset', { method: 'POST' });
      } catch (e) {
        // ignore
      }

      showToast('Contact page has been reset to official defaults.');
    } catch (err) {
      showToast('Reset failed.', 'error');
    } finally {
      setResetting(false);
    }
  };

  // Symptom management
  const handleAddSymptom = () => {
    if (!newSymptom.trim()) return;
    setData((prev) => ({
      ...prev,
      quickSymptoms: [...(prev.quickSymptoms || []), newSymptom.trim()],
    }));
    setNewSymptom('');
  };

  const handleRemoveSymptom = (index) => {
    setData((prev) => ({
      ...prev,
      quickSymptoms: (prev.quickSymptoms || []).filter((_, i) => i !== index),
    }));
  };

  // Discipline Category management
  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    setData((prev) => {
      const disciplines = [...(prev.disciplines || [])];
      if (disciplines[activeDisciplineIndex]) {
        disciplines[activeDisciplineIndex] = {
          ...disciplines[activeDisciplineIndex],
          categories: [...(disciplines[activeDisciplineIndex].categories || []), newCategory.trim()],
        };
      }
      return { ...prev, disciplines };
    });
    setNewCategory('');
  };

  const handleRemoveCategory = (dIdx, cIdx) => {
    setData((prev) => {
      const disciplines = [...(prev.disciplines || [])];
      if (disciplines[dIdx]) {
        disciplines[dIdx] = {
          ...disciplines[dIdx],
          categories: (disciplines[dIdx].categories || []).filter((_, i) => i !== cIdx),
        };
      }
      return { ...prev, disciplines };
    });
  };

  // FAQ management
  const handleAddFaq = () => {
    if (!newFaq.q.trim() || !newFaq.a.trim()) return;
    setData((prev) => ({
      ...prev,
      faqs: [...(prev.faqs || []), { q: newFaq.q.trim(), a: newFaq.a.trim() }],
    }));
    setNewFaq({ q: '', a: '' });
    setIsAddingFaq(false);
  };

  const handleRemoveFaq = (index) => {
    setData((prev) => ({
      ...prev,
      faqs: (prev.faqs || []).filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500">Loading Contact Page Configuration...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. TOP HEADER & ACTION BAR */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
              <PhoneCall size={18} />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Contact Us Page Manager
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
              Live Synchronized
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Manage all customer contact channels, hotline hours, emergency dispatches, Hyderabad HQ address, 4-discipline inquiry categories, symptoms list, and technical FAQs.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            to="/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm text-xs flex items-center gap-1.5"
          >
            <ExternalLink size={13} /> View Live Page
          </Link>

          <button
            type="button"
            onClick={handleReset}
            disabled={resetting || saving}
            className="btn btn-outline btn-sm text-xs text-slate-600 hover:text-rose-600 hover:border-rose-300 flex items-center gap-1.5"
            title="Reset to official engineering defaults"
          >
            <RotateCcw size={13} /> Reset Defaults
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary btn-sm text-xs py-2 px-4 shadow-sm flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
          >
            <Save size={14} />
            {saving ? 'Saving Changes...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {/* NOTIFICATIONS & ERRORS */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
            notification.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          {notification.type === 'error' ? <AlertCircle size={15} /> : <CheckCircle size={15} />}
          <span>{notification.message}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {/* 2. NAVIGATION TABS */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 text-xs font-bold scrollbar-none pb-0.5">
        {[
          { id: 'hero', label: 'Hero, Banner & Right-Side Image', icon: ImageIcon },
          { id: 'hotlines', label: 'Hotlines, Direct & Coordinates', icon: Phone },
          { id: 'headquarters', label: 'Office & Headquarters', icon: MapPin },
          { id: 'disciplines', label: '4 Disciplines & Symptoms', icon: Layers },
          { id: 'workflow', label: '4-Step Process', icon: FileText },
          { id: 'faqs', label: 'Frequently Asked Questions', icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-b-2 border-sky-600 text-sky-800 bg-white font-extrabold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-sky-600' : 'text-slate-400'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. TAB PANELS */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
        {/* =========================================================================
            TAB 1: HERO & NOTICE
           ========================================================================= */}
        {activeTab === 'hero' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={16} className="text-sky-600" /> Hero Section Header &amp; Copy
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure the top banner typography, FLIR thermal telemetry tags, and rapid emergency announcement bar.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="form-label text-xs">Hero Badge Pill</label>
                <input
                  className="form-input text-xs"
                  value={data.hero?.badge || ''}
                  onChange={(e) =>
                    setData({ ...data, hero: { ...data.hero, badge: e.target.value } })
                  }
                  placeholder="e.g. 4 Core Civil Disciplines • Past, Present & Future Lineage"
                />
              </div>

              <div>
                <label className="form-label text-xs">Hero Main Title *</label>
                <input
                  required
                  className="form-input text-xs"
                  value={data.hero?.title || ''}
                  onChange={(e) =>
                    setData({ ...data, hero: { ...data.hero, title: e.target.value } })
                  }
                  placeholder="e.g. Contact SLN Engineers"
                />
              </div>

              <div>
                <label className="form-label text-xs">Hero Subtitle</label>
                <input
                  className="form-input text-xs"
                  value={data.hero?.subtitle || ''}
                  onChange={(e) =>
                    setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } })
                  }
                  placeholder="e.g. Consult With Our Senior Engineers & Schedule Site Inspection."
                />
              </div>

              <div className="sm:col-span-2">
                <label className="form-label text-xs">Hero Supporting Description</label>
                <textarea
                  rows="2"
                  className="form-textarea text-xs"
                  value={data.hero?.description || ''}
                  onChange={(e) =>
                    setData({ ...data, hero: { ...data.hero, description: e.target.value } })
                  }
                  placeholder="Schedule a comprehensive thermal moisture diagnostic survey..."
                />
              </div>

              <div>
                <label className="form-label text-xs">FLIR Console Top Tag</label>
                <input
                  className="form-input text-xs"
                  value={data.hero?.flirTag || ''}
                  onChange={(e) =>
                    setData({ ...data, hero: { ...data.hero, flirTag: e.target.value } })
                  }
                  placeholder="e.g. IS 1346 & IS 3067 AUDIT"
                />
              </div>

              <div>
                <label className="form-label text-xs">FLIR Console Delta Temp</label>
                <input
                  className="form-input text-xs"
                  value={data.hero?.flirDelta || ''}
                  onChange={(e) =>
                    setData({ ...data, hero: { ...data.hero, flirDelta: e.target.value } })
                  }
                  placeholder="e.g. ΔT 8.6°C"
                />
              </div>
            </div>

            {/* RIGHT-SIDE HERO BANNER IMAGE (CRUD CONTROLS) */}
            <div className="card p-6 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <ImageIcon size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                      Right-Side Hero Banner Image (CRUD)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Manage, upload, preview, and update the architectural photo featured on the right side of the Contact Us banner.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={heroImageInputRef}
                    accept="image/*"
                    onChange={handleHeroImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={uploadingHeroImage}
                    onClick={() => heroImageInputRef.current?.click()}
                    className="btn btn-sm btn-primary flex items-center gap-1.5 text-xs shadow-xs"
                  >
                    <Upload size={13} />
                    <span>{uploadingHeroImage ? 'Uploading...' : 'Upload New Photo'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleHeroImageReset}
                    title="Reset to default SLN engineering photo"
                    className="btn btn-sm btn-secondary flex items-center gap-1.5 text-xs"
                  >
                    <RotateCcw size={13} />
                    <span className="hidden sm:inline">Reset Default</span>
                  </button>
                  {data.hero?.imageUrl && (
                    <button
                      type="button"
                      onClick={handleHeroImageDelete}
                      title="Clear photo"
                      className="btn btn-sm bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 flex items-center gap-1.5 text-xs"
                    >
                      <Trash2 size={13} />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  )}
                </div>
              </div>

              {heroImageError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs border border-rose-200 flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{heroImageError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Live Banner Mockup Preview */}
                <div className="lg:col-span-5 bg-gradient-to-r from-[#031d38] via-[#073155] to-[#0a416d] p-4 rounded-2xl border border-sky-900/60 shadow-md space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-sky-200/90 font-bold mb-1">
                    <span className="flex items-center gap-1">
                      <Eye size={12} className="text-emerald-400" /> Live Banner Preview
                    </span>
                    <span className="text-[10px] text-sky-300 font-mono">16:10 Ratio</span>
                  </div>

                  <div className="relative rounded-xl overflow-hidden border border-white/20 shadow-lg bg-slate-900 group aspect-[16/10] w-full">
                    {data.hero?.imageUrl ? (
                      <img
                        src={data.hero.imageUrl}
                        alt={data.hero?.imageAlt || 'Hero Banner'}
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          e.currentTarget.src = '/uploads/ModernHomeWaterproofingProtect-1792165882439-41612578.png';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-800 p-4 text-center">
                        <ImageIcon size={32} className="mb-2 text-slate-500" />
                        <span className="text-xs font-medium">No Image Uploaded</span>
                        <span className="text-[11px] text-slate-500 mt-1">Upload a photo or enter a URL</span>
                      </div>
                    )}
                  </div>

                  {/* Caption Strip Preview */}
                  <div className="flex items-center justify-between text-[10px] text-sky-200/90 px-1 pt-1">
                    <span className="flex items-center gap-1 font-medium truncate">
                      <ShieldCheck size={12} className="text-emerald-400 shrink-0" />
                      <span className="truncate">{data.hero?.imageCaption || 'Engineering Structural Defense'}</span>
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full shrink-0">
                      {data.hero?.imageBadge || 'All 4 Disciplines'}
                    </span>
                  </div>
                </div>

                {/* Form Controls for Image URL & Metadata */}
                <div className="lg:col-span-7 space-y-3.5">
                  <div>
                    <label className="form-label text-xs font-bold text-slate-800">
                      Banner Image URL / File Path *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="form-input text-xs font-mono"
                        value={data.hero?.imageUrl || ''}
                        onChange={(e) =>
                          setData({
                            ...data,
                            hero: { ...data.hero, imageUrl: e.target.value },
                          })
                        }
                        placeholder="/uploads/... or https://..."
                      />
                      <button
                        type="button"
                        onClick={() => heroImageInputRef.current?.click()}
                        disabled={uploadingHeroImage}
                        className="btn btn-secondary text-xs shrink-0 flex items-center gap-1.5"
                      >
                        <Upload size={13} />
                        <span>Browse...</span>
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Recommended: High-resolution landscape photo (16:10 or 16:9 ratio, min 1200×750px).
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="form-label text-xs">Image Alt Text (SEO &amp; Accessibility)</label>
                      <input
                        type="text"
                        className="form-input text-xs"
                        value={data.hero?.imageAlt || ''}
                        onChange={(e) =>
                          setData({
                            ...data,
                            hero: { ...data.hero, imageAlt: e.target.value },
                          })
                        }
                        placeholder="e.g. SLN Engineers Civil Protection"
                      />
                    </div>

                    <div>
                      <label className="form-label text-xs">Bottom Caption Label</label>
                      <input
                        type="text"
                        className="form-input text-xs"
                        value={data.hero?.imageCaption || ''}
                        onChange={(e) =>
                          setData({
                            ...data,
                            hero: { ...data.hero, imageCaption: e.target.value },
                          })
                        }
                        placeholder="e.g. Engineering Structural Defense"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="form-label text-xs">Corner Tag Badge</label>
                      <input
                        type="text"
                        className="form-input text-xs"
                        value={data.hero?.imageBadge || ''}
                        onChange={(e) =>
                          setData({
                            ...data,
                            hero: { ...data.hero, imageBadge: e.target.value },
                          })
                        }
                        placeholder="e.g. All 4 Disciplines"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Top Notice Bar */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <AlertTriangle size={14} className="text-amber-500" />
                    Emergency Notice Bar (Active Response Callout)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Displays a high-visibility urgent banner for monsoon flooding or acute structural distress.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.announcement?.enabled !== false}
                    onChange={(e) =>
                      setData({
                        ...data,
                        announcement: { ...data.announcement, enabled: e.target.checked },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {data.announcement?.enabled !== false && (
                <div className="grid gap-3 sm:grid-cols-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <label className="form-label text-xs">Announcement Badge</label>
                    <input
                      className="form-input text-xs"
                      value={data.announcement?.badge || ''}
                      onChange={(e) =>
                        setData({
                          ...data,
                          announcement: { ...data.announcement, badge: e.target.value },
                        })
                      }
                      placeholder="e.g. 24/7 Rapid Emergency Response"
                    />
                  </div>
                  <div>
                    <label className="form-label text-xs">Action Phone Number</label>
                    <input
                      className="form-input text-xs"
                      value={data.announcement?.actionPhone || ''}
                      onChange={(e) =>
                        setData({
                          ...data,
                          announcement: { ...data.announcement, actionPhone: e.target.value },
                        })
                      }
                      placeholder="e.g. +91 8977668777"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="form-label text-xs">Announcement Text</label>
                    <input
                      className="form-input text-xs"
                      value={data.announcement?.text || ''}
                      onChange={(e) =>
                        setData({
                          ...data,
                          announcement: { ...data.announcement, text: e.target.value },
                        })
                      }
                      placeholder="e.g. Active basement seepage, terrace flood, or structural distress? Our senior emergency crew dispatches immediately..."
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: HOTLINES, DIRECT & OPERATIONAL COORDINATES
           ========================================================================= */}
        {activeTab === 'hotlines' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Phone size={20} />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                    Hotlines, Direct &amp; Operational Coordinates
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Centralized master controls for main phone lines, 24/7 emergency response, email, WhatsApp, and headquarters address coordinates.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 1: HOTLINES & DIRECT INQUIRIES */}
            <div className="card p-6 bg-white border-slate-200 space-y-4 shadow-2xs">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <PhoneCall size={16} className="text-sky-600" /> Hotlines &amp; Direct Communication Channels
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Main Office Phone */}
                <div className="p-4 rounded-xl border border-sky-100 bg-sky-50/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-950">
                    <Phone size={14} className="text-sky-600" /> Main Office Phone
                  </div>
                  <div>
                    <label className="form-label text-[11px] text-slate-600">Main Office Phone *</label>
                    <input
                      required
                      type="text"
                      className="form-input text-xs"
                      value={data.hotlines?.helpline || ''}
                      onChange={(e) =>
                        setData({
                          ...data,
                          hotlines: { ...data.hotlines, helpline: e.target.value },
                        })
                      }
                      placeholder="+91 8977668776"
                    />
                  </div>
                  <div>
                    <label className="form-label text-[11px] text-slate-600">Operating Hours</label>
                    <input
                      type="text"
                      className="form-input text-xs"
                      value={data.hotlines?.helplineHours || ''}
                      onChange={(e) =>
                        setData({
                          ...data,
                          hotlines: { ...data.hotlines, helplineHours: e.target.value },
                        })
                      }
                      placeholder="Mon – Sat: 8:00 AM – 8:30 PM"
                    />
                  </div>
                </div>

                {/* Emergency Leakage Helpline */}
                <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-950">
                    <AlertTriangle size={14} className="text-rose-600" /> Emergency Leakage Helpline
                  </div>
                  <div>
                    <label className="form-label text-[11px] text-slate-600">Emergency Leakage Helpline *</label>
                    <input
                      required
                      type="text"
                      className="form-input text-xs"
                      value={data.hotlines?.emergencyPhone || ''}
                      onChange={(e) =>
                        setData({
                          ...data,
                          hotlines: { ...data.hotlines, emergencyPhone: e.target.value },
                        })
                      }
                      placeholder="+91 8977668776"
                    />
                  </div>
                  <div>
                    <label className="form-label text-[11px] text-slate-600">Emergency Subtext / Note</label>
                    <input
                      type="text"
                      className="form-input text-xs"
                      value={data.hotlines?.emergencyHours || ''}
                      onChange={(e) =>
                        setData({
                          ...data,
                          hotlines: { ...data.hotlines, emergencyHours: e.target.value },
                        })
                      }
                      placeholder="24/7 Priority Emergency Hotline"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Mail size={14} className="text-slate-600" /> Email Address
                  </div>
                  <div>
                    <label className="form-label text-[11px] text-slate-600">Email Address *</label>
                    <input
                      type="email"
                      required
                      className="form-input text-xs"
                      value={data.hotlines?.email || ''}
                      onChange={(e) =>
                        setData({
                          ...data,
                          hotlines: { ...data.hotlines, email: e.target.value },
                        })
                      }
                      placeholder="contact@slnengineers.com"
                    />
                  </div>
                  <div>
                    <label className="form-label text-[11px] text-slate-600">Email Subtext / Drawings Note</label>
                    <input
                      type="text"
                      className="form-input text-xs"
                      value={data.hotlines?.emailNote || ''}
                      onChange={(e) =>
                        setData({
                          ...data,
                          hotlines: { ...data.hotlines, emailNote: e.target.value },
                        })
                      }
                      placeholder="Architectural drawings, tenders & corporate BOQs"
                    />
                  </div>
                </div>

                {/* WhatsApp Direct Number */}
                <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                    <MessageCircle size={14} className="text-emerald-600" /> WhatsApp Direct Number (with Country Code)
                  </div>
                  <div>
                    <label className="form-label text-[11px] text-slate-600">WhatsApp Direct Number (with Country Code) *</label>
                    <input
                      type="text"
                      className="form-input text-xs"
                      value={data.hotlines?.whatsapp || ''}
                      onChange={(e) =>
                        setData({
                          ...data,
                          hotlines: { ...data.hotlines, whatsapp: e.target.value },
                        })
                      }
                      placeholder="+91 8977668776"
                    />
                  </div>
                  <div>
                    <label className="form-label text-[11px] text-slate-600">WhatsApp Tagline</label>
                    <input
                      type="text"
                      className="form-input text-xs"
                      value={data.hotlines?.whatsappNote || ''}
                      onChange={(e) =>
                        setData({
                          ...data,
                          hotlines: { ...data.hotlines, whatsappNote: e.target.value },
                        })
                      }
                      placeholder="Instant Photo & Video Review"
                    />
                  </div>

                  {/* Pre-filled WhatsApp Chat Message */}
                  <div className="pt-2 border-t border-emerald-100">
                    <div className="flex items-center justify-between mb-1">
                      <label className="form-label text-[11px] font-bold text-emerald-950 mb-0">
                        Default Pre-filled WhatsApp Chat Message *
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setData({
                            ...data,
                            hotlines: {
                              ...data.hotlines,
                              whatsappDefaultMessage:
                                'Hello SLN Engineers, I would like to request an on-site waterproofing inspection.',
                            },
                          })
                        }
                        className="text-[10px] text-emerald-700 hover:text-emerald-950 underline font-semibold cursor-pointer"
                      >
                        Reset Default
                      </button>
                    </div>
                    <textarea
                      rows="2"
                      className="form-textarea text-xs bg-white text-slate-800"
                      value={
                        data.hotlines?.whatsappDefaultMessage !== undefined
                          ? data.hotlines.whatsappDefaultMessage
                          : 'Hello SLN Engineers, I would like to request an on-site waterproofing inspection.'
                      }
                      onChange={(e) =>
                        setData({
                          ...data,
                          hotlines: {
                            ...data.hotlines,
                            whatsappDefaultMessage: e.target.value,
                          },
                        })
                      }
                      placeholder="Hello SLN Engineers, I would like to request an on-site waterproofing inspection."
                    />
                    <div className="mt-1 flex items-center justify-between text-[10px] text-emerald-800">
                      <span>Message shown in WhatsApp when visitors tap floating or header chat buttons.</span>
                      <span className="font-mono">
                        {(data.hotlines?.whatsappDefaultMessage || '').length} chars
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inspection Dispatch Speed & Territory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="form-label text-xs">Inspection Dispatch Window</label>
                  <input
                    className="form-input text-xs"
                    value={data.hotlines?.inspectionDispatch || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        hotlines: { ...data.hotlines, inspectionDispatch: e.target.value },
                      })
                    }
                    placeholder="e.g. 24–48 Hrs"
                  />
                </div>

                <div>
                  <label className="form-label text-xs">Coverage Region / Territory</label>
                  <input
                    className="form-input text-xs"
                    value={data.hotlines?.inspectionCoverage || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        hotlines: { ...data.hotlines, inspectionCoverage: e.target.value },
                      })
                    }
                    placeholder="e.g. Hyderabad & Telangana"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: OPERATIONAL COORDINATES & PHYSICAL ADDRESS (MOVED FROM SETTINGS) */}
            <div className="card p-6 bg-white border-slate-200 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                    <MapPin size={16} className="text-sky-600" /> Operational Coordinates &amp; Physical Address
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Physical headquarters address coordinates moved from Company Settings. Updating these coordinates synchronizes across Header, Footer, and Contact Us pages.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label text-xs">Street Address</label>
                  <input
                    type="text"
                    className="form-input text-xs"
                    value={data.headquarters?.street || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        headquarters: { ...data.headquarters, street: e.target.value },
                      })
                    }
                    placeholder="e.g. Medipally, Hyderabad"
                  />
                </div>

                <div>
                  <label className="form-label text-xs">Area / Landmark</label>
                  <input
                    type="text"
                    className="form-input text-xs"
                    value={data.headquarters?.area || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        headquarters: { ...data.headquarters, area: e.target.value },
                      })
                    }
                    placeholder="e.g. Hyderabad, Telangana"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="form-label text-xs">City</label>
                  <input
                    type="text"
                    className="form-input text-xs"
                    value={data.headquarters?.city || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        headquarters: { ...data.headquarters, city: e.target.value },
                      })
                    }
                    placeholder="Hyderabad"
                  />
                </div>

                <div>
                  <label className="form-label text-xs">State</label>
                  <input
                    type="text"
                    className="form-input text-xs"
                    value={data.headquarters?.state || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        headquarters: { ...data.headquarters, state: e.target.value },
                      })
                    }
                    placeholder="Telangana"
                  />
                </div>

                <div>
                  <label className="form-label text-xs">Pincode</label>
                  <input
                    type="text"
                    className="form-input text-xs"
                    value={data.headquarters?.pincode || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        headquarters: { ...data.headquarters, pincode: e.target.value },
                      })
                    }
                    placeholder="500098"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: OFFICE & HEADQUARTERS
           ========================================================================= */}
        {activeTab === 'headquarters' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <MapPin size={16} className="text-sky-600" /> Operational Headquarters &amp; Physical Address
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Update the official engineering headquarters address, active service corridors, and Google Maps URL.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="form-label text-xs">Facility Name</label>
                <input
                  className="form-input text-xs"
                  value={data.headquarters?.name || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      headquarters: { ...data.headquarters, name: e.target.value },
                    })
                  }
                  placeholder="e.g. Operational Engineering Headquarters"
                />
              </div>

              <div>
                <label className="form-label text-xs">Street / Colony</label>
                <input
                  className="form-input text-xs"
                  value={data.headquarters?.street || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      headquarters: { ...data.headquarters, street: e.target.value },
                    })
                  }
                  placeholder="e.g. Medipally"
                />
              </div>

              <div>
                <label className="form-label text-xs">Area / Locality</label>
                <input
                  className="form-input text-xs"
                  value={data.headquarters?.area || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      headquarters: { ...data.headquarters, area: e.target.value },
                    })
                  }
                  placeholder="e.g. Medipally"
                />
              </div>

              <div>
                <label className="form-label text-xs">City *</label>
                <input
                  required
                  className="form-input text-xs"
                  value={data.headquarters?.city || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      headquarters: { ...data.headquarters, city: e.target.value },
                    })
                  }
                  placeholder="e.g. Hyderabad"
                />
              </div>

              <div>
                <label className="form-label text-xs">State *</label>
                <input
                  required
                  className="form-input text-xs"
                  value={data.headquarters?.state || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      headquarters: { ...data.headquarters, state: e.target.value },
                    })
                  }
                  placeholder="e.g. Telangana"
                />
              </div>

              <div>
                <label className="form-label text-xs">Pincode *</label>
                <input
                  required
                  className="form-input text-xs"
                  value={data.headquarters?.pincode || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      headquarters: { ...data.headquarters, pincode: e.target.value },
                    })
                  }
                  placeholder="e.g. 500098"
                />
              </div>

              <div>
                <label className="form-label text-xs">Landmark / Proximity</label>
                <input
                  className="form-input text-xs"
                  value={data.headquarters?.landmark || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      headquarters: { ...data.headquarters, landmark: e.target.value },
                    })
                  }
                  placeholder="e.g. Near Hyderabad–Warangal Highway Corridor"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="form-label text-xs">Active Service Corridors</label>
                <input
                  className="form-input text-xs"
                  value={data.headquarters?.serviceCorridors || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      headquarters: { ...data.headquarters, serviceCorridors: e.target.value },
                    })
                  }
                  placeholder="e.g. Medipally, Madhapur, Gachibowli, Jubilee Hills, Secunderabad, Miyapur, LB Nagar, Kompally"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="form-label text-xs">Google Maps Link</label>
                <input
                  className="form-input text-xs"
                  value={data.headquarters?.googleMapsUrl || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      headquarters: { ...data.headquarters, googleMapsUrl: e.target.value },
                    })
                  }
                  placeholder="https://maps.google.com/?q=Medipally%2C+Hyderabad"
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: 4 DISCIPLINES & SYMPTOMS
           ========================================================================= */}
        {activeTab === 'disciplines' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Layers size={16} className="text-sky-600" /> 4 Core Disciplines &amp; 1-Tap Symptoms
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize the service categories and quick symptoms available in the on-site inspection booking form.
              </p>
            </div>

            {/* Discipline Selector Tabs */}
            <div className="flex gap-2 border-b border-slate-100 pb-2 overflow-x-auto">
              {(data.disciplines || []).map((d, dIdx) => (
                <button
                  key={d.id || dIdx}
                  type="button"
                  onClick={() => setActiveDisciplineIndex(dIdx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDisciplineIndex === dIdx
                      ? 'bg-sky-50 text-sky-800 border border-sky-300 shadow-2xs font-extrabold'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>

            {/* Active Discipline Category List */}
            {data.disciplines?.[activeDisciplineIndex] && (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900">
                      {data.disciplines[activeDisciplineIndex].name} — Form Categories
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      These categories appear in the inspection form dropdown when clients request a survey.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                    {data.disciplines[activeDisciplineIndex].categories?.length || 0} categories
                  </span>
                </div>

                <div className="space-y-1.5">
                  {(data.disciplines[activeDisciplineIndex].categories || []).map((cat, cIdx) => (
                    <div
                      key={cIdx}
                      className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800"
                    >
                      <span className="truncate">{cat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(activeDisciplineIndex, cIdx)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50"
                        title="Remove category"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new category */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    className="form-input text-xs flex-1"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter new service category..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCategory();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="btn btn-outline btn-sm text-xs flex items-center gap-1 shrink-0"
                  >
                    <Plus size={13} /> Add Category
                  </button>
                </div>
              </div>
            )}

            {/* Quick 1-Tap Symptoms List */}
            <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/20 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-emerald-600" /> 1-Tap Quick Symptoms Chips
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Clients can tap these chips in the form to instantly append common issues into their description.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-800">
                  {data.quickSymptoms?.length || 0} chips
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {(data.quickSymptoms || []).map((sym, sIdx) => (
                  <span
                    key={sIdx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-700 shadow-2xs group"
                  >
                    <span>{sym}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSymptom(sIdx)}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove symptom"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Symptom input */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  className="form-input text-xs flex-1"
                  value={newSymptom}
                  onChange={(e) => setNewSymptom(e.target.value)}
                  placeholder="Enter common issue (e.g. Parapet coping crack water seepage)..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSymptom();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddSymptom}
                  className="btn btn-primary btn-sm text-xs flex items-center gap-1 shrink-0 bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
                >
                  <Plus size={13} /> Add Chip
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: 4-STEP WORKFLOW
           ========================================================================= */}
        {activeTab === 'workflow' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileText size={16} className="text-sky-600" /> 4-Step Engineering Process
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure the 4-step diagnostic survey, BOQ estimation, certified execution, and QR warranty testing workflow.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {(data.processSteps || []).map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-black text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                      Step {step.step || `0${idx + 1}`}
                    </span>
                    <input
                      className="form-input text-xs max-w-[140px] py-1"
                      value={step.badge || ''}
                      onChange={(e) => {
                        const updated = [...data.processSteps];
                        updated[idx] = { ...updated[idx], badge: e.target.value };
                        setData({ ...data, processSteps: updated });
                      }}
                      placeholder="Badge"
                    />
                  </div>

                  <div>
                    <label className="form-label text-[11px] text-slate-600">Step Title *</label>
                    <input
                      required
                      className="form-input text-xs font-bold"
                      value={step.title || ''}
                      onChange={(e) => {
                        const updated = [...data.processSteps];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        setData({ ...data, processSteps: updated });
                      }}
                    />
                  </div>

                  <div>
                    <label className="form-label text-[11px] text-slate-600">Step Description</label>
                    <textarea
                      rows="3"
                      className="form-textarea text-xs"
                      value={step.desc || ''}
                      onChange={(e) => {
                        const updated = [...data.processSteps];
                        updated[idx] = { ...updated[idx], desc: e.target.value };
                        setData({ ...data, processSteps: updated });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: FREQUENTLY ASKED QUESTIONS
           ========================================================================= */}
        {activeTab === 'faqs' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <HelpCircle size={16} className="text-sky-600" /> Frequently Asked Questions (FAQ)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage the client guidance Q&amp;A accordion on diagnostic visits, non-invasive methods, and legal warranties.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingFaq(true)}
                className="btn btn-primary btn-sm text-xs flex items-center gap-1.5"
              >
                <Plus size={14} /> Add New FAQ
              </button>
            </div>

            {/* Inline Add FAQ Form */}
            {isAddingFaq && (
              <div className="p-4 rounded-xl border border-sky-300 bg-sky-50/50 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-sky-200 pb-2">
                  <span className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                    <Plus size={14} /> Add New Question &amp; Answer
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAddingFaq(false)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div>
                  <label className="form-label text-xs">Question *</label>
                  <input
                    required
                    className="form-input text-xs"
                    value={newFaq.q}
                    onChange={(e) => setNewFaq({ ...newFaq, q: e.target.value })}
                    placeholder="e.g. Do you work in gated communities and RWA societies?"
                  />
                </div>
                <div>
                  <label className="form-label text-xs">Answer *</label>
                  <textarea
                    required
                    rows="3"
                    className="form-textarea text-xs"
                    value={newFaq.a}
                    onChange={(e) => setNewFaq({ ...newFaq, a: e.target.value })}
                    placeholder="Provide a clear, authoritative response..."
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingFaq(false)}
                    className="btn btn-outline btn-sm text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddFaq}
                    className="btn btn-primary btn-sm text-xs"
                  >
                    Save FAQ
                  </button>
                </div>
              </div>
            )}

            {/* Existing FAQs */}
            <div className="space-y-3">
              {(data.faqs || []).map((faq, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <input
                        className="form-input text-xs font-bold text-slate-900 flex-1"
                        value={faq.q}
                        onChange={(e) => {
                          const updated = [...data.faqs];
                          updated[idx] = { ...updated[idx], q: e.target.value };
                          setData({ ...data, faqs: updated });
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors shrink-0"
                      title="Delete question"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="pl-7.5">
                    <textarea
                      rows="2"
                      className="form-textarea text-xs text-slate-600 w-full"
                      value={faq.a}
                      onChange={(e) => {
                        const updated = [...data.faqs];
                        updated[idx] = { ...updated[idx], a: e.target.value };
                        setData({ ...data, faqs: updated });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
