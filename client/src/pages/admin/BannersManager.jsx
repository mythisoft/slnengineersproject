import React, { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
  RotateCcw,
  Sparkles,
  Eye,
  Check,
  Clock,
  Building2,
  ShieldCheck,
  Droplets,
  Paintbrush,
  Layers,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  CheckCircle2,
  Sliders,
  Wrench,
  Hammer,
} from 'lucide-react';
import { fetchApi } from '../../utils/api';
import {
  HOMEPAGE_BANNER_PRESETS,
  COMPANY_LOGO_PRESET,
  PHOTO_BANNER_PRESETS,
  DEFAULT_COMPANY_BANNER_SERVICES,
  getBannerCopy,
  isLogoBanner,
} from '../../utils/bannerCopy';

// Available Icons for Banner Services
const SERVICE_ICONS = [
  { id: 'Droplets', label: 'Droplets (Waterproofing)', icon: Droplets },
  { id: 'Paintbrush', label: 'Paintbrush (Painting & Coating)', icon: Paintbrush },
  { id: 'Building2', label: 'Building (Restoration & Civil)', icon: Building2 },
  { id: 'Layers', label: 'Layers (Ceilings & Gypsum)', icon: Layers },
  { id: 'ShieldCheck', label: 'ShieldCheck (Protection)', icon: ShieldCheck },
  { id: 'Wrench', label: 'Wrench (Repairs & Maintenance)', icon: Wrench },
  { id: 'Hammer', label: 'Hammer (Structural Rehab)', icon: Hammer },
  { id: 'Sparkles', label: 'Sparkles (Finishing & Polish)', icon: Sparkles },
];

// Available Accent Colors for Banner Services
const SERVICE_COLORS = [
  { label: 'Sky Blue', hex: '#38bdf8' },
  { label: 'Amber Gold', hex: '#f59e0b' },
  { label: 'SLN Green', hex: '#029746' },
  { label: 'Warm Yellow', hex: '#fbbf24' },
  { label: 'Indigo Purple', hex: '#6366f1' },
  { label: 'Rose Red', hex: '#f43f5e' },
  { label: 'Cyan Teal', hex: '#06b6d4' },
];

const resolveIconComponent = (iconId) => {
  const found = SERVICE_ICONS.find((item) => item.id === iconId);
  return found ? found.icon : Droplets;
};

const defaultEmptyForm = {
  title: COMPANY_LOGO_PRESET.title,
  altText: COMPANY_LOGO_PRESET.altText,
  imageUrl: COMPANY_LOGO_PRESET.imageUrl,
  isCompanyLogoBanner: true,
  durationSeconds: 3,
  isActive: true,
  eyebrow: COMPANY_LOGO_PRESET.eyebrow,
  foundedText: '',
  headline: COMPANY_LOGO_PRESET.headline,
  highlightedHeadline: COMPANY_LOGO_PRESET.highlightedHeadline,
  description: COMPANY_LOGO_PRESET.description,
  primaryCtaText: COMPANY_LOGO_PRESET.primaryCtaText,
  secondaryCtaText: COMPANY_LOGO_PRESET.secondaryCtaText,
  metrics: COMPANY_LOGO_PRESET.metrics,
  bannerServices: DEFAULT_COMPANY_BANNER_SERVICES,
};

export default function BannersManager() {
  const [banners, setBanners] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [form, setForm] = useState(defaultEmptyForm);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [previewServiceIndex, setPreviewServiceIndex] = useState(0);

  // Inline Service Editor State (inside Logo Banner Form)
  const [isEditingService, setIsEditingService] = useState(false);
  const [serviceEditIndex, setServiceEditIndex] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    shortCategory: '',
    icon: 'Droplets',
    accentColor: '#38bdf8',
  });

  // Handle object URL for live image preview
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return undefined;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const loadBanners = () => {
    setLoading(true);
    fetchApi('/admin/banners')
      .then((res) => {
        const list = res.data || [];
        setBanners(list);
        try {
          localStorage.setItem('sln_cached_banners', JSON.stringify(list));
        } catch {}
        window.dispatchEvent(new Event('sln_banners_updated'));
      })
      .catch((err) => setError(err.message || 'Failed to load banners.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBanners();
    // Load website published services for 1-click quick-add to banner
    fetchApi('/services')
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setAvailableServices(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const openCreate = (mode = 'logo') => {
    setEditingBanner(null);
    setSelectedFile(null);
    setError('');
    setIsEditingService(false);
    setServiceEditIndex(null);

    if (mode === 'logo' || mode === 0) {
      setForm({
        ...defaultEmptyForm,
        title: COMPANY_LOGO_PRESET.title,
        altText: COMPANY_LOGO_PRESET.altText,
        imageUrl: COMPANY_LOGO_PRESET.imageUrl,
        isCompanyLogoBanner: true,
        durationSeconds: 3,
        eyebrow: COMPANY_LOGO_PRESET.eyebrow,
        headline: COMPANY_LOGO_PRESET.headline,
        highlightedHeadline: COMPANY_LOGO_PRESET.highlightedHeadline,
        description: COMPANY_LOGO_PRESET.description,
        primaryCtaText: COMPANY_LOGO_PRESET.primaryCtaText,
        secondaryCtaText: COMPANY_LOGO_PRESET.secondaryCtaText,
        metrics: COMPANY_LOGO_PRESET.metrics,
        bannerServices: DEFAULT_COMPANY_BANNER_SERVICES,
      });
    } else {
      const photoPreset = PHOTO_BANNER_PRESETS[0];
      setForm({
        ...defaultEmptyForm,
        title: photoPreset.title,
        altText: photoPreset.altText,
        imageUrl: photoPreset.imageUrl,
        isCompanyLogoBanner: false,
        durationSeconds: 6,
        eyebrow: photoPreset.eyebrow,
        headline: photoPreset.headline,
        highlightedHeadline: photoPreset.highlightedHeadline,
        description: photoPreset.description,
        primaryCtaText: photoPreset.primaryCtaText,
        secondaryCtaText: photoPreset.secondaryCtaText,
        metrics: photoPreset.metrics,
        bannerServices: [],
      });
    }
    setShowForm(true);
  };

  const openEdit = (banner) => {
    setEditingBanner(banner);
    const bannerCopy = getBannerCopy(banner);
    const isLogo = isLogoBanner(banner);
    setForm({
      title: banner.title || '',
      altText: banner.altText || '',
      imageUrl: banner.imageUrl || (isLogo ? '/sln-logo.png' : PHOTO_BANNER_PRESETS[0].imageUrl),
      isCompanyLogoBanner: isLogo,
      durationSeconds: banner.durationSeconds || (isLogo ? 3 : 6),
      isActive: banner.isActive !== false,
      bannerServices: Array.isArray(banner.bannerServices) && banner.bannerServices.length > 0
        ? banner.bannerServices
        : (isLogo ? DEFAULT_COMPANY_BANNER_SERVICES : []),
      ...bannerCopy,
      foundedText: '',
    });
    setSelectedFile(null);
    setError('');
    setIsEditingService(false);
    setServiceEditIndex(null);
    setShowForm(true);
  };

  // Seamless Mode Switcher (Company Logo Banner vs Photo Banner)
  const selectBannerMode = (isLogo) => {
    setIsEditingService(false);
    setServiceEditIndex(null);
    if (isLogo) {
      setForm((prev) => {
        const isCurrentlyPhotoDefault = PHOTO_BANNER_PRESETS.some((p) => p.title === prev.title);
        const hadLogoImg = prev.imageUrl === '/sln-logo.png' || prev.imageUrl?.endsWith('/sln-logo.png');
        return {
          ...prev,
          isCompanyLogoBanner: true,
          durationSeconds: prev.durationSeconds && prev.durationSeconds <= 5 ? prev.durationSeconds : 3,
          imageUrl: hadLogoImg ? prev.imageUrl : '/sln-logo.png',
          title: isCurrentlyPhotoDefault || !prev.title ? COMPANY_LOGO_PRESET.title : prev.title,
          eyebrow: isCurrentlyPhotoDefault || !prev.eyebrow ? COMPANY_LOGO_PRESET.eyebrow : prev.eyebrow,
          headline: isCurrentlyPhotoDefault || !prev.headline ? COMPANY_LOGO_PRESET.headline : prev.headline,
          highlightedHeadline: isCurrentlyPhotoDefault || !prev.highlightedHeadline ? COMPANY_LOGO_PRESET.highlightedHeadline : prev.highlightedHeadline,
          description: isCurrentlyPhotoDefault || !prev.description ? COMPANY_LOGO_PRESET.description : prev.description,
          altText: isCurrentlyPhotoDefault || !prev.altText ? COMPANY_LOGO_PRESET.altText : prev.altText,
          bannerServices: Array.isArray(prev.bannerServices) && prev.bannerServices.length > 0
            ? prev.bannerServices
            : DEFAULT_COMPANY_BANNER_SERVICES,
        };
      });
      setSelectedFile(null);
    } else {
      setForm((prev) => {
        const isCurrentlyLogoDefault = prev.title === COMPANY_LOGO_PRESET.title;
        const photoPreset = PHOTO_BANNER_PRESETS[0];
        const isPhotoImg = prev.imageUrl && prev.imageUrl !== '/sln-logo.png' && !prev.imageUrl.endsWith('/sln-logo.png');
        return {
          ...prev,
          isCompanyLogoBanner: false,
          durationSeconds: prev.durationSeconds && prev.durationSeconds >= 4 ? prev.durationSeconds : 6,
          imageUrl: isPhotoImg ? prev.imageUrl : photoPreset.imageUrl,
          title: isCurrentlyLogoDefault || !prev.title ? photoPreset.title : prev.title,
          eyebrow: isCurrentlyLogoDefault || !prev.eyebrow ? photoPreset.eyebrow : prev.eyebrow,
          headline: isCurrentlyLogoDefault || !prev.headline ? photoPreset.headline : prev.headline,
          highlightedHeadline: isCurrentlyLogoDefault || !prev.highlightedHeadline ? photoPreset.headline : prev.highlightedHeadline,
          description: isCurrentlyLogoDefault || !prev.description ? photoPreset.description : prev.description,
          altText: isCurrentlyLogoDefault || !prev.altText ? photoPreset.altText : prev.altText,
        };
      });
      setSelectedFile(null);
    }
  };

  // Apply pre-approved templates
  const applyLogoPreset = () => {
    setForm((prev) => ({
      ...prev,
      title: COMPANY_LOGO_PRESET.title,
      altText: COMPANY_LOGO_PRESET.altText,
      imageUrl: COMPANY_LOGO_PRESET.imageUrl,
      isCompanyLogoBanner: true,
      durationSeconds: 3,
      eyebrow: COMPANY_LOGO_PRESET.eyebrow,
      headline: COMPANY_LOGO_PRESET.headline,
      highlightedHeadline: COMPANY_LOGO_PRESET.highlightedHeadline,
      description: COMPANY_LOGO_PRESET.description,
      bannerServices: DEFAULT_COMPANY_BANNER_SERVICES,
    }));
    setSelectedFile(null);
    setIsEditingService(false);
  };

  const applyPhotoPreset = (preset) => {
    setForm((prev) => ({
      ...prev,
      title: preset.title,
      altText: preset.altText,
      imageUrl: preset.imageUrl,
      isCompanyLogoBanner: false,
      durationSeconds: preset.durationSeconds || 6,
      eyebrow: preset.eyebrow,
      headline: preset.headline,
      highlightedHeadline: preset.highlightedHeadline,
      description: preset.description,
    }));
    setSelectedFile(null);
  };

  // Service Management Handlers for Company Logo Banner
  const handleOpenAddService = () => {
    setServiceEditIndex(null);
    setServiceForm({
      name: '',
      shortCategory: '',
      icon: 'Droplets',
      accentColor: '#38bdf8',
    });
    setIsEditingService(true);
  };

  const handleOpenEditService = (service, index) => {
    setServiceEditIndex(index);
    setServiceForm({
      name: service.name || '',
      shortCategory: service.shortCategory || '',
      icon: service.icon || 'Droplets',
      accentColor: service.accentColor || '#38bdf8',
    });
    setIsEditingService(true);
  };

  const handleSaveService = (e) => {
    e.preventDefault();
    if (!serviceForm.name.trim()) return;

    const newService = {
      name: serviceForm.name.trim(),
      shortCategory: serviceForm.shortCategory.trim(),
      icon: serviceForm.icon || 'Droplets',
      accentColor: serviceForm.accentColor || '#38bdf8',
      targetBannerIndex: 1,
    };

    setForm((prev) => {
      const currentServices = Array.isArray(prev.bannerServices) ? [...prev.bannerServices] : [];
      if (serviceEditIndex !== null && serviceEditIndex >= 0) {
        currentServices[serviceEditIndex] = newService;
      } else {
        currentServices.push(newService);
      }
      return { ...prev, bannerServices: currentServices };
    });

    setIsEditingService(false);
    setServiceEditIndex(null);
  };

  const handleDeleteService = (index) => {
    setForm((prev) => {
      const currentServices = Array.isArray(prev.bannerServices) ? [...prev.bannerServices] : [];
      currentServices.splice(index, 1);
      return { ...prev, bannerServices: currentServices };
    });
  };

  const handleMoveService = (index, direction) => {
    setForm((prev) => {
      const currentServices = Array.isArray(prev.bannerServices) ? [...prev.bannerServices] : [];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= currentServices.length) return prev;
      [currentServices[index], currentServices[targetIndex]] = [currentServices[targetIndex], currentServices[index]];
      return { ...prev, bannerServices: currentServices };
    });
  };

  const handleAddExistingService = (selectedSlug) => {
    const found = availableServices.find((s) => s.slug === selectedSlug || s._id === selectedSlug);
    if (!found) return;

    const existingColors = ['#38bdf8', '#f59e0b', '#029746', '#fbbf24', '#6366f1', '#f43f5e', '#06b6d4'];
    const currentLength = form.bannerServices?.length || 0;
    const nextColor = existingColors[currentLength % existingColors.length];

    const newService = {
      name: found.title,
      shortCategory: found.category || found.shortDescription || 'Specialized Civil Engineering Service',
      icon: found.iconName && SERVICE_ICONS.some((i) => i.id === found.iconName) ? found.iconName : 'Droplets',
      accentColor: nextColor,
      targetBannerIndex: 1,
    };

    setForm((prev) => ({
      ...prev,
      bannerServices: [...(Array.isArray(prev.bannerServices) ? prev.bannerServices : []), newService],
    }));
  };

  const handleResetDefaultServices = () => {
    setForm((prev) => ({
      ...prev,
      bannerServices: DEFAULT_COMPANY_BANNER_SERVICES,
    }));
  };

  const handleInitDefaults = async (force = false) => {
    if (
      force &&
      !window.confirm(
        'Reset all banners to the 2 homepage defaults (1. Company Logo Overview + 2. Precision Waterproofing Photo)? Any custom banners will be overwritten.'
      )
    ) {
      return;
    }
    setInitializing(true);
    setError('');
    setSuccessMsg('');
    try {
      await fetchApi(`/admin/banners/init-defaults${force ? '?reset=true' : ''}`, {
        method: 'POST',
      });
      setSuccessMsg('Homepage default banners initialized successfully.');
      loadBanners();
    } catch (err) {
      setError(err.message || 'Failed to initialize default banners.');
    } finally {
      setInitializing(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      let imageUrl = form.imageUrl;
      if (selectedFile) {
        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', selectedFile);
        const uploaded = await fetchApi('/admin/banners/upload', {
          method: 'POST',
          body: uploadData,
        });
        imageUrl = uploaded.data.url;
      }

      if (form.isCompanyLogoBanner && !imageUrl) {
        imageUrl = '/sln-logo.png';
      }

      if (!imageUrl && !form.isCompanyLogoBanner) {
        setError('Please select or upload a banner background image.');
        setSaving(false);
        setUploading(false);
        return;
      }

      const payload = {
        ...form,
        headline: form.isCompanyLogoBanner ? '' : (form.headline || ''),
        highlightedHeadline: form.isCompanyLogoBanner ? '' : (form.highlightedHeadline || ''),
        imageUrl,
        isCompanyLogoBanner: Boolean(form.isCompanyLogoBanner),
        durationSeconds: Number(form.durationSeconds) || (form.isCompanyLogoBanner ? 3 : 6),
        bannerServices: Array.isArray(form.bannerServices) ? form.bannerServices : [],
        foundedText: '',
      };

      if (editingBanner) {
        await fetchApi(`/admin/banners/${editingBanner._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await fetchApi('/admin/banners', {
          method: 'POST',
          body: JSON.stringify({
            ...payload,
            order: banners.reduce((max, b) => Math.max(max, Number(b.order) || 0), -1) + 1,
          }),
        });
      }
      setShowForm(false);
      loadBanners();
    } catch (err) {
      setError(err.message || 'Failed to save banner.');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const updateBanner = async (banner, updates) => {
    setError('');
    try {
      await fetchApi(`/admin/banners/${banner._id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      loadBanners();
    } catch (err) {
      setError(err.message || 'Failed to update banner.');
    }
  };

  const moveBanner = async (index, direction) => {
    const next = [...banners];
    const targetIndex = index + direction;
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    setError('');
    try {
      await Promise.all(
        next.map((banner, order) =>
          fetchApi(`/admin/banners/${banner._id}`, {
            method: 'PUT',
            body: JSON.stringify({ order }),
          })
        )
      );
      setBanners(next);
    } catch (err) {
      setError(err.message || 'Failed to reorder banners.');
      loadBanners();
    }
  };

  const deleteBanner = async (banner) => {
    if (!window.confirm(`Delete the "${banner.title}" banner slide?`)) return;
    setError('');
    try {
      await fetchApi(`/admin/banners/${banner._id}`, { method: 'DELETE' });
      loadBanners();
    } catch (err) {
      setError(err.message || 'Failed to delete banner.');
    }
  };

  const activePreviewImage = previewUrl || (
    form.isCompanyLogoBanner
      ? (form.imageUrl || '/sln-logo.png')
      : (form.imageUrl || PHOTO_BANNER_PRESETS[0].imageUrl)
  );

  const companyBannerFromList = banners.find(
    (b) => isLogoBanner(b)
  );
  const previewServices = (form.isCompanyLogoBanner && form.bannerServices?.length > 0)
    ? form.bannerServices
    : (companyBannerFromList?.bannerServices?.length > 0
        ? companyBannerFromList.bannerServices
        : DEFAULT_COMPANY_BANNER_SERVICES);

  const photoToplineService = previewServices[previewServiceIndex % previewServices.length] || DEFAULT_COMPANY_BANNER_SERVICES[0];
  const PhotoServiceIcon = resolveIconComponent(photoToplineService.icon);

  useEffect(() => {
    if (!previewServices.length) return undefined;
    const currentName = previewServices[previewServiceIndex % previewServices.length]?.name || '';
    const charCount = currentName.length || 15;
    const holdDuration = Math.max(2800, charCount * 45 + 2400);

    const timer = setTimeout(() => {
      setPreviewServiceIndex((prev) => (prev + 1) % previewServices.length);
    }, holdDuration);

    return () => clearTimeout(timer);
  }, [previewServiceIndex, previewServices.length]);

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Homepage Banners</h1>
          <p className="mt-1 text-xs text-slate-500">
            Manage the hero slides rotating on your website homepage. You can configure copy, photos, duration, and customize the services grid displayed on the Company Logo Banner.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => handleInitDefaults(banners.length > 0)}
            disabled={initializing}
            className="btn btn-outline btn-sm flex items-center gap-2 text-slate-700 hover:text-slate-900"
            title="Reset or load default rotation slides"
          >
            <RotateCcw size={14} className={initializing ? 'animate-spin' : ''} />
            {banners.length === 0 ? 'Load Homepage Defaults' : 'Reset to Defaults'}
          </button>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => openCreate('logo')}
              className="btn btn-outline btn-sm flex items-center gap-1.5 text-emerald-700 border-emerald-300 hover:bg-emerald-50"
              title="Add a 3s Company Logo Overview slide"
            >
              <Building2 size={14} /> + Logo Slide
            </button>
            <button
              type="button"
              onClick={() => openCreate('photo')}
              className="btn btn-primary btn-sm flex items-center gap-1.5"
              title="Add a 6s Landscape Photo slide"
            >
              <ImagePlus size={14} /> + Photo Slide
            </button>
          </div>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      {error && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}
      {successMsg && (
        <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {successMsg}
        </div>
      )}

      {/* BANNERS LIST */}
      {loading ? (
        <div className="card bg-white p-10 text-center text-sm text-slate-500">Loading banners...</div>
      ) : banners.length === 0 ? (
        <div className="card bg-white p-10 text-center">
          <ImagePlus size={36} className="mx-auto mb-3 text-slate-400" />
          <h3 className="font-bold text-slate-800 text-base">No Custom Banners in Database</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
            The homepage is currently falling back to its 2 default rotation slides (1. Company Logo Banner + 2. Precision Waterproofing). Click below to load them into the database for live CRUD editing.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => handleInitDefaults(false)}
              disabled={initializing}
              className="btn btn-primary btn-sm flex items-center gap-2"
            >
              <Sparkles size={15} />
              {initializing ? 'Loading Defaults...' : 'Load Homepage Default Banners'}
            </button>
            <button type="button" onClick={() => openCreate('logo')} className="btn btn-outline btn-sm">
              <Plus size={15} /> Create From Scratch
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
          {banners.map((banner, index) => {
            const copy = getBannerCopy(banner);
            const bannerIsLogo = isLogoBanner(banner);
            const slideDuration = banner.durationSeconds || (bannerIsLogo ? 3 : 6);
            return (
              <article
                key={banner._id}
                className="card overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* REALISTIC HERO CARD PREVIEW */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#04152b]">
                    {bannerIsLogo ? (
                      <div className="w-full h-full relative overflow-hidden bg-[#04152b] flex items-center justify-center">
                        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
                        <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none" />
                        <img
                          src={banner.imageUrl || '/sln-logo.png'}
                          alt=""
                          className="w-24 h-24 object-contain opacity-90 filter drop-shadow-md"
                          onError={(e) => {
                            e.currentTarget.src = '/sln-logo.png';
                          }}
                        />
                      </div>
                    ) : (
                      <img
                        src={banner.imageUrl}
                        alt={banner.altText || banner.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/uploads/ModernHomeWaterproofingProtect-1792165882439-41612578.png';
                        }}
                      />
                    )}
                    {/* Subtle gradient overlay to make text readable while keeping image clearly visible */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#04152b]/85 via-transparent to-black/25 pointer-events-none" />

                    {/* Top status pills */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                      <span className="px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] font-mono font-bold text-white shadow">
                        Slide {String(index + 1).padStart(2, '0')} • {slideDuration}s
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold shadow ${
                            bannerIsLogo ? 'bg-emerald-500 text-white' : 'bg-sky-500 text-white'
                          }`}
                        >
                          {bannerIsLogo ? 'Company Logo Mode' : 'Photo Mode'}
                        </span>
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold shadow ${
                            banner.isActive ? 'bg-emerald-500/90 text-white' : 'bg-slate-700/90 text-slate-200'
                          }`}
                        >
                          {banner.isActive ? 'Active' : 'Hidden'}
                        </span>
                      </div>
                    </div>

                    {/* Overlaid hero text matching homepage */}
                    <div className="absolute bottom-3 left-3 right-3 z-10 space-y-1 text-white">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900/90 border border-sky-400/30 text-sky-300 text-[10px] font-bold tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span className="truncate max-w-[200px]">{copy.eyebrow}</span>
                      </div>
                      {!bannerIsLogo && copy.headline && (
                        <h3 className="text-xs sm:text-sm font-extrabold text-white leading-tight line-clamp-1 drop-shadow">
                          <span>{copy.headline}</span>{' '}
                          <span className="text-amber-400">{copy.highlightedHeadline}</span>
                        </h3>
                      )}
                    </div>
                  </div>

                  {/* DETAILS SECTION */}
                  <div className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate font-bold text-slate-900 text-sm" title={banner.title}>
                          {banner.title}
                        </h2>
                        <p className="line-clamp-2 text-xs text-slate-500 mt-1">
                          {copy.description || banner.altText || 'No description provided'}
                        </p>
                        {bannerIsLogo && banner.bannerServices && banner.bannerServices.length > 0 && (
                          <div className="mt-2 flex items-center gap-1 flex-wrap">
                            <span className="text-[10px] font-bold text-slate-600">Banner Services ({banner.bannerServices.length}):</span>
                            {banner.bannerServices.map((s, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                              >
                                {s.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <label className="flex shrink-0 items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={banner.isActive}
                          onChange={(event) => updateBanner(banner, { isActive: event.target.checked })}
                          className="rounded text-primary-600 focus:ring-primary-500"
                        />
                        Show
                      </label>
                    </div>
                  </div>
                </div>

                {/* CARD FOOTER ACTIONS */}
                <div className="flex items-center justify-between border-t border-slate-100 p-3 bg-slate-50/50">
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => moveBanner(index, -1)}
                      disabled={index === 0}
                      aria-label="Move banner up"
                      className="btn btn-outline btn-sm p-1.5 disabled:opacity-30"
                      title="Move slide earlier in rotation"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveBanner(index, 1)}
                      disabled={index === banners.length - 1}
                      aria-label="Move banner down"
                      className="btn btn-outline btn-sm p-1.5 disabled:opacity-30"
                      title="Move slide later in rotation"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEdit(banner)}
                      className="btn btn-outline btn-sm p-1.5 flex items-center gap-1 text-slate-700"
                      aria-label="Edit banner"
                      title="Edit banner content"
                    >
                      <Pencil size={14} />
                      <span className="text-xs hidden sm:inline">Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteBanner(banner)}
                      className="btn btn-outline btn-sm p-1.5 text-rose-600 hover:bg-rose-50 border-rose-200"
                      aria-label="Delete banner"
                      title="Delete this banner"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-5 sm:p-6 shadow-2xl">
            {/* MODAL HEADER */}
            <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="font-bold text-slate-900 text-lg sm:text-xl flex items-center gap-2">
                  <Sliders size={20} className="text-primary-600" />
                  {editingBanner ? 'Edit Homepage Hero Banner' : 'Configure Homepage Hero Banner'}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Select either Company Logo Banner (3s Overview) or Photo Banner (6s Service Showcase), configure slide copy, timing, assets, and service cards.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Close"
                className="text-slate-500 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* 1. BANNER PRESENTATION TYPE SWITCHER (2 PROMINENT CARDS) */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                1. Select Banner Presentation Type:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Option A: Company Logo Banner */}
                <button
                  type="button"
                  onClick={() => selectBannerMode(true)}
                  className={`p-4 rounded-xl border text-left transition-all relative ${
                    form.isCompanyLogoBanner
                      ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/30 shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        form.isCompanyLogoBanner ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Building2 size={18} />
                      </div>
                      <div>
                        <span className="text-sm font-extrabold text-slate-900 block">
                          Company Logo Banner
                        </span>
                        <span className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider">
                          All 4 Specializations Overview
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      3s Duration
                    </span>
                  </div>
                  <ul className="mt-3 space-y-1 text-[11px] text-slate-600">
                    <li className="flex items-center gap-1.5">
                      <Check size={12} className="text-emerald-600 shrink-0" />
                      <span>Civil engineering blueprint grid + logo watermark centerpiece</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check size={12} className="text-emerald-600 shrink-0" />
                      <span>Brand header badge & animated 3-second progress indicator</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check size={12} className="text-emerald-600 shrink-0" />
                      <span>Renders configurable core services simultaneously in interactive grid</span>
                    </li>
                  </ul>
                  {form.isCompanyLogoBanner && (
                    <div className="absolute top-2 right-2 text-emerald-600">
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                </button>

                {/* Option B: Photo Banner */}
                <button
                  type="button"
                  onClick={() => selectBannerMode(false)}
                  className={`p-4 rounded-xl border text-left transition-all relative ${
                    !form.isCompanyLogoBanner
                      ? 'border-sky-500 bg-sky-50/70 ring-2 ring-sky-500/30 shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        !form.isCompanyLogoBanner ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <ImageIcon size={18} />
                      </div>
                      <div>
                        <span className="text-sm font-extrabold text-slate-900 block">
                          Photo Banner
                        </span>
                        <span className="text-[10px] text-sky-700 font-semibold uppercase tracking-wider">
                          Full-Bleed Project Showcase
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-100 text-sky-800 border border-sky-300">
                      6s Duration
                    </span>
                  </div>
                  <ul className="mt-3 space-y-1 text-[11px] text-slate-600">
                    <li className="flex items-center gap-1.5">
                      <Check size={12} className="text-sky-600 shrink-0" />
                      <span>High-resolution 16:9 full-bleed project photograph</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check size={12} className="text-sky-600 shrink-0" />
                      <span>Animated topline service rotator with SLN emblem & live flip</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check size={12} className="text-sky-600 shrink-0" />
                      <span>Category eyebrow pill & technical service description</span>
                    </li>
                  </ul>
                  {!form.isCompanyLogoBanner && (
                    <div className="absolute top-2 right-2 text-sky-600">
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* 2. LIVE REALISTIC HERO PREVIEW (FAITHFUL TO HOMEPAGE HERO) */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="form-label text-xs font-bold text-slate-700 flex items-center gap-1.5 m-0">
                  <Eye size={14} className="text-primary-600" />
                  Live Hero Preview ({form.isCompanyLogoBanner ? 'Company Logo Mode • 3s Overview' : 'Photo Mode • 6s Showcase'})
                </label>
                <span className="text-[11px] text-slate-500 font-medium">
                  Faithfully mirrors homepage hero design, typography & dynamic elements
                </span>
              </div>

              {/* RESPONSIVE HERO CANVAS (FLEX COLUMN WITH ZERO OVERFLOW OR COLLISION) */}
              <div className={`relative w-full rounded-2xl overflow-hidden border shadow-2xl min-h-[460px] sm:min-h-[500px] flex flex-col justify-between p-4 sm:p-6 transition-all select-none ${
                form.isCompanyLogoBanner
                  ? 'bg-white border-slate-300 text-slate-900 shadow-slate-200/50'
                  : 'bg-[#04152b] border-slate-700/60 text-white'
              }`}>
                
                {/* 1. LAYER: DYNAMIC BACKGROUND CANVAS */}
                {form.isCompanyLogoBanner ? (
                  /* COMPANY LOGO BANNER BACKGROUND: Complete white background + subtle blueprint grid + ambient glows + watermark logo */
                  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-white">
                    {/* Engineering Blueprint Grid Overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
                    {/* Ambient Glow Orbs */}
                    <div className="absolute -top-12 -left-12 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl" />
                    <div className="absolute -bottom-12 right-6 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl" />
                    {/* Watermark Logo positioned behind the left content */}
                    <div className="absolute top-1/2 left-[28%] -translate-x-1/2 -translate-y-1/2 w-52 sm:w-64 h-32 sm:h-40 flex items-center justify-center opacity-20 filter drop-shadow-[0_4px_20px_rgba(2,151,70,0.14)] transition-all">
                      <img
                        src={activePreviewImage}
                        alt="Watermark Logo Preview"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = '/sln-logo.png';
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  /* PHOTO BANNER BACKGROUND: High-resolution full-bleed photo + contrast overlay */
                  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <img
                      src={activePreviewImage}
                      alt="Photo Preview"
                      className="w-full h-full object-cover transition-all"
                      onError={(e) => {
                        e.currentTarget.src = PHOTO_BANNER_PRESETS[0].imageUrl;
                      }}
                    />
                    {/* Deep contrast gradient ensuring high legibility for all text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#04152b] via-[#04152b]/75 to-[#04152b]/40" />
                  </div>
                )}

                {/* 2. LAYER: TOP BRAND / EYEBROW BAR */}
                <div className="relative z-10 flex items-center gap-2.5 flex-wrap">
                  {form.isCompanyLogoBanner ? (
                    /* Logo Mode: Top Brand Header Tag */
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-white text-[11px] font-semibold shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      <span className="font-extrabold uppercase tracking-wider text-[10px] text-white">
                        Official Corporate Practice
                      </span>
                    </div>
                  ) : (
                    /* Photo Mode: Letter-by-Letter Animated Service Name Ticker */
                    <div className="home-photo-service-ticker inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/85 border border-sky-400/35 text-white text-xs font-bold tracking-wide shadow-lg backdrop-blur-md max-w-full">
                      <div
                        className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: `${photoToplineService.accentColor || '#38bdf8'}25`,
                          color: photoToplineService.accentColor || '#38bdf8',
                        }}
                      >
                        <PhotoServiceIcon size={12} />
                      </div>

                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 shrink-0">
                        Services:
                      </span>

                      {/* Letter-By-Letter Left-to-Right Animated Service Name */}
                      <div
                        key={`preview-service-${previewServiceIndex}`}
                        className="photo-service-letters flex items-center font-extrabold text-xs sm:text-[13px] tracking-wide"
                      >
                        {(photoToplineService.name || '').split('').map((char, cIdx) => (
                          <span
                            key={cIdx}
                            className="photo-service-letter inline-block"
                            style={{
                              animationDelay: `${cIdx * 45}ms`,
                              color: char === ' ' ? 'inherit' : (cIdx < 2 ? (photoToplineService.accentColor || '#38bdf8') : '#ffffff'),
                              textShadow: `0 0 10px ${photoToplineService.accentColor || '#38bdf8'}55`,
                            }}
                          >
                            {char === ' ' ? '\u00A0' : char}
                          </span>
                        ))}
                        <span className="inline-block w-1.5 h-3 ml-1 bg-emerald-400 animate-pulse rounded-full" />
                      </div>

                      {/* Pagination dots */}
                      {previewServices.length > 1 && (
                        <div className="flex items-center gap-1 pl-1">
                          {previewServices.map((s, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setPreviewServiceIndex(idx)}
                              className={`h-1.5 rounded-full transition-all ${
                                idx === (previewServiceIndex % previewServices.length)
                                  ? 'w-3.5 bg-emerald-400'
                                  : 'w-1.5 bg-white/30 hover:bg-white/60'
                              }`}
                              title={s.name}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Standard / Duration Pill */}
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold shadow-2xs ${
                    form.isCompanyLogoBanner
                      ? 'bg-emerald-50 border border-emerald-200/80 text-emerald-800'
                      : 'bg-slate-900/85 backdrop-blur-md border border-white/10 text-white'
                  }`}>
                    {form.isCompanyLogoBanner ? (
                      <>
                        <ShieldCheck size={12} className="text-emerald-600" />
                        <span>ISO 9001:2015 Practice</span>
                      </>
                    ) : (
                      <>
                        <Clock size={12} className="text-amber-400" />
                        <span>{form.durationSeconds || 6}s Showcase</span>
                      </>
                    )}
                  </div>
                </div>

                {/* 3. LAYER: HERO HEADLINE, DESCRIPTION & DYNAMIC SERVICES / ACTIONS */}
                <div className="relative z-10 space-y-3 my-auto py-2">
                  {form.isCompanyLogoBanner ? (
                    /* COMPANY LOGO BANNER CONTENT (LIGHT POLISH ON COMPLETE WHITE) */
                    <div className="space-y-3">
                      {/* Prominent Brand Logo Showcase matching Homepage */}
                      <div className="flex items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white p-2 border border-slate-200/90 shadow-md flex items-center justify-center shrink-0">
                          <img
                            src={activePreviewImage}
                            alt="SLN Engineers Logo"
                            className="w-full h-full object-contain filter drop-shadow-xs"
                            onError={(e) => {
                              e.currentTarget.src = '/sln-logo.png';
                            }}
                          />
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                          <div className="flex items-baseline gap-1.5 flex-wrap leading-tight">
                            <span className="text-lg sm:text-xl font-black tracking-tight text-emerald-600 font-heading">
                              SLN ENGINEERS
                            </span>
                            <span className="text-[11px] font-extrabold tracking-wider uppercase text-slate-700 font-heading">
                              PROJECTS PVT. LTD.
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-emerald-700 truncate">
                            {form.eyebrow || 'All 4 Specializations Under One Roof'}
                          </span>
                        </div>
                      </div>

                      {/* Description Paragraph */}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl line-clamp-2">
                        {form.description ||
                          'Certified ISO civil engineering practice delivering specialized leak defense, weather-shield painting, structural restoration, and acoustic interior ceilings with warranty protection.'}
                      </p>

                      {/* Dynamic Core Services Grid mirroring homepage */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {(form.bannerServices && form.bannerServices.length > 0
                          ? form.bannerServices
                          : DEFAULT_COMPANY_BANNER_SERVICES
                        ).map((service, idx) => {
                          const SIcon = resolveIconComponent(service.icon);
                          const accent = service.accentColor || '#38bdf8';
                          return (
                            <div
                              key={idx}
                              className="group p-2 sm:p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all bg-white border-slate-200/90 shadow-2xs hover:border-sky-400 hover:-translate-y-0.5 cursor-pointer"
                              style={{
                                borderColor: `${accent}35`,
                              }}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className="service-icon-box w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                                  style={{
                                    backgroundColor: `${accent}16`,
                                    color: accent,
                                    border: `1px solid ${accent}40`,
                                  }}
                                >
                                  <SIcon size={14} />
                                </div>
                                <div className="min-w-0">
                                  <span className="text-xs font-bold text-slate-900 group-hover:text-primary-700 transition-colors block truncate">
                                    {service.name}
                                  </span>
                                  <span className="text-[10px] text-slate-500 block truncate">
                                    {service.shortCategory || service.tag || 'Specialized Civil Solution'}
                                  </span>
                                </div>
                              </div>
                              <ChevronRight size={13} className="service-chevron text-slate-400 group-hover:text-primary-700 group-hover:translate-x-0.5 transition-all shrink-0" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* PHOTO BANNER CONTENT */
                    <div className="space-y-3">
                      {/* Main Headline with Accent Gradient */}
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
                        <span>{form.headline || 'Advanced Waterproofing,'}</span>{' '}
                        <span className="bg-gradient-to-r from-emerald-300 via-sky-300 to-amber-300 bg-clip-text text-transparent">
                          {form.highlightedHeadline || 'engineered for decades.'}
                        </span>
                      </h2>

                      {/* Description Paragraph */}
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl line-clamp-2">
                        {form.description ||
                          'High-pressure polyurethane injection, crystalline tanking, and elastomeric membrane systems that stop active groundwater ingress and structural dampness permanently.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* 4. LAYER: BOTTOM BANNER CONTROLS (UNIFIED PILL: BUTTON & LABEL IN SAME PILL AT BOTTOM) */}
                <div className="relative z-10 pt-3 flex items-center justify-start">
                  <div className={`home-banner-controls select-none ${form.isCompanyLogoBanner ? 'is-logo-active' : ''}`}>
                    <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono font-black text-[11px] tracking-wider shrink-0 border ${
                      form.isCompanyLogoBanner
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                        : 'bg-sky-500/20 border-sky-400/30 text-sky-300'
                    }`}>
                      <span>{form.isCompanyLogoBanner ? '01' : '02'}</span>
                      <span className="opacity-40">/</span>
                      <span className="opacity-70">02</span>
                    </div>

                    <span className="home-banner-divider hidden sm:inline-block shrink-0" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />

                    <span className="home-banner-caption font-bold text-xs truncate max-w-[160px] sm:max-w-xs text-slate-100">
                      {form.title || (form.isCompanyLogoBanner ? 'All Specialized Services & Company Overview' : 'Precision Waterproofing & Structural Defense')}
                    </span>

                    <span className="home-banner-divider hidden sm:inline-block shrink-0" />

                    <div className="flex items-center gap-1 shrink-0">
                      <span className={`w-3.5 h-1.5 rounded-full ${form.isCompanyLogoBanner ? 'bg-emerald-400' : 'bg-white/40'}`} />
                      <span className={`w-3.5 h-1.5 rounded-full ${!form.isCompanyLogoBanner ? 'bg-sky-400' : 'bg-white/40'}`} />
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => selectBannerMode(!form.isCompanyLogoBanner)}
                        className="home-banner-side-btn w-6 h-6 rounded-full flex items-center justify-center border border-white/15 bg-white/10 hover:bg-white/25 text-white"
                        title="Previous slide"
                      >
                        <ChevronLeft size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => selectBannerMode(!form.isCompanyLogoBanner)}
                        className="home-banner-side-btn w-6 h-6 rounded-full flex items-center justify-center border border-white/15 bg-white/10 hover:bg-white/25 text-white"
                        title="Next slide"
                      >
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. DYNAMIC FORM CONFIGURATION BASED ON SELECTED MODE */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {form.isCompanyLogoBanner ? (
                /* =========================================================================
                   COMPANY LOGO BANNER FORM (SEQUENCED EXACTLY MATCHING THE HOMEPAGE HERO)
                   ========================================================================= */
                <div className="space-y-4">
                  {/* QUICK RESET TO EXACT HOMEPAGE COPY */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-300 bg-emerald-50/70">
                    <div>
                      <span className="text-xs font-extrabold text-emerald-950 block">
                        Company Logo Banner (3s Overview Mode)
                      </span>
                      <span className="text-[11px] text-emerald-800">
                        Configure the slide elements and customize the services grid displayed on the homepage.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={applyLogoPreset}
                      className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles size={13} />
                      Load Company Overview Copy
                    </button>
                  </div>

                  {/* ELEMENT 1: TOP BRAND HEADER PILL */}
                  <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="banner-eyebrow" className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-extrabold">1</span>
                        <span>Top Brand Header Tag: <span className="font-mono text-emerald-800">SLN ENGINEERS | {form.eyebrow || 'All 4 Specializations Under One Roof'}</span></span>
                      </label>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Header Pill
                      </span>
                    </div>
                    <div>
                      <label htmlFor="banner-eyebrow" className="form-label text-[11px] text-slate-600">
                        Discipline Eyebrow Tag (Appears beside "SLN ENGINEERS |") *
                      </label>
                      <input
                        id="banner-eyebrow"
                        maxLength={100}
                        required
                        className="form-input text-sm"
                        value={form.eyebrow}
                        onChange={(e) => setForm({ ...form, eyebrow: e.target.value })}
                        placeholder="All 4 Specializations Under One Roof"
                      />
                    </div>
                  </div>

                  {/* ELEMENT 2: SLIDE DURATION & 3s OVERVIEW BADGE */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="banner-duration" className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px] font-extrabold">2</span>
                        <span>Overview Duration Badge & Timer: <span className="font-mono text-sky-800">{form.durationSeconds || 3}s Overview</span></span>
                      </label>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, durationSeconds: 3 })}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            form.durationSeconds === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          3s (Recommended)
                        </button>
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, durationSeconds: 4 })}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            form.durationSeconds === 4 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          4s
                        </button>
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, durationSeconds: 5 })}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            form.durationSeconds === 5 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          5s
                        </button>
                      </div>
                    </div>
                    <input
                      id="banner-duration"
                      type="number"
                      min={1}
                      max={60}
                      required
                      className="form-input text-sm"
                      value={form.durationSeconds || 3}
                      onChange={(e) => setForm({ ...form, durationSeconds: Number(e.target.value) || 3 })}
                    />
                    <p className="text-[11px] text-slate-500">
                      Controls the "3s Overview" badge timer, animated progress bar, and slide rotation speed.
                    </p>
                  </div>

                  {/* ELEMENT 3: DESCRIPTION PARAGRAPH */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="banner-description" className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px] font-extrabold">3</span>
                        <span>Description Paragraph</span>
                      </label>
                      <span className="text-[11px] text-slate-500">Overview copy</span>
                    </div>
                    <textarea
                      id="banner-description"
                      rows="3"
                      maxLength={500}
                      className="form-textarea text-sm"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Certified ISO civil engineering practice delivering specialized leak defense, weather-shield painting, structural restoration, and acoustic interior ceilings with warranty protection."
                    />
                    <p className="text-[11px] text-slate-500">
                      Describes your certified ISO practice, civil disciplines, and warranty protection.
                    </p>
                  </div>

                  {/* ELEMENT 4: SERVICES DISPLAYED ON COMPANY LOGO BANNER (ADMIN CAN ADD/EDIT SERVICES) */}
                  <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/40 space-y-3.5 shadow-xs">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-extrabold">4</span>
                        <div>
                          <span className="text-xs font-extrabold text-slate-900 block">
                            Services Displayed on Banner Grid (Interactive Cards)
                          </span>
                          <span className="text-[11px] text-slate-600">
                            These services appear simultaneously in the hero banner grid ({form.bannerServices?.length || 0} configured)
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={handleResetDefaultServices}
                          className="text-[11px] font-semibold text-slate-700 hover:text-slate-900 px-2.5 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition-colors shadow-xs"
                          title="Restore 4 core default services"
                        >
                          Reset 4 Defaults
                        </button>
                        <button
                          type="button"
                          onClick={handleOpenAddService}
                          className="btn btn-primary btn-sm text-xs py-1 px-3 flex items-center gap-1.5 shadow-xs"
                        >
                          <Plus size={14} /> Add Service Card
                        </button>
                      </div>
                    </div>

                    {/* QUICK ADD DROPDOWN FROM PUBLISHED SERVICES */}
                    {availableServices && availableServices.length > 0 && (
                      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-emerald-200 text-xs shadow-xs">
                        <span className="font-bold text-slate-800 shrink-0 flex items-center gap-1.5">
                          <Sparkles size={13} className="text-amber-500" />
                          Quick-Add from Website Services:
                        </span>
                        <select
                          className="form-input text-xs py-1 px-2.5 flex-1 bg-slate-50 border-slate-300"
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAddExistingService(e.target.value);
                              e.target.value = '';
                            }
                          }}
                        >
                          <option value="" disabled>Choose a service from your website to add to the banner...</option>
                          {availableServices.map((s) => (
                            <option key={s._id} value={s.slug || s._id}>
                              {s.title} ({s.category || 'Service'})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* INLINE ADD/EDIT SERVICE FORM */}
                    {isEditingService && (
                      <div className="p-4 rounded-xl border border-primary-400 bg-white shadow-md space-y-3.5 animate-in fade-in">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <Sliders size={14} className="text-primary-600" />
                            {serviceEditIndex !== null ? 'Edit Banner Service' : 'Add New Service Card to Banner'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsEditingService(false)}
                            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className="form-label text-[11px] text-slate-700 font-semibold">
                              Service Title *
                            </label>
                            <input
                              required
                              className="form-input text-xs"
                              value={serviceForm.name}
                              onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                              placeholder="e.g. Precision Waterproofing"
                            />
                          </div>
                          <div>
                            <label className="form-label text-[11px] text-slate-700 font-semibold">
                              Subtitle / Short Category *
                            </label>
                            <input
                              className="form-input text-xs"
                              value={serviceForm.shortCategory}
                              onChange={(e) => setServiceForm({ ...serviceForm, shortCategory: e.target.value })}
                              placeholder="e.g. Active Leak Defense & Crystalline Tanking"
                            />
                          </div>
                        </div>

                        {/* ICON & COLOR PICKERS */}
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className="form-label text-[11px] text-slate-700 font-semibold">
                              Choose Service Icon
                            </label>
                            <select
                              className="form-input text-xs"
                              value={serviceForm.icon}
                              onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                            >
                              {SERVICE_ICONS.map((i) => (
                                <option key={i.id} value={i.id}>{i.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="form-label text-[11px] text-slate-700 font-semibold">
                              Accent Color Theme
                            </label>
                            <div className="flex items-center gap-2 flex-wrap pt-0.5">
                              {SERVICE_COLORS.map((c) => (
                                <button
                                  key={c.hex}
                                  type="button"
                                  onClick={() => setServiceForm({ ...serviceForm, accentColor: c.hex })}
                                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                                    serviceForm.accentColor === c.hex ? 'scale-125 border-slate-900 shadow-sm' : 'border-white hover:scale-110'
                                  }`}
                                  style={{ backgroundColor: c.hex }}
                                  title={c.label}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => setIsEditingService(false)}
                            className="btn btn-outline btn-sm text-xs py-1"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveService}
                            className="btn btn-primary btn-sm text-xs py-1 px-3"
                          >
                            {serviceEditIndex !== null ? 'Save Changes' : 'Add to Banner Grid'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* CURRENT SERVICES LIST */}
                    <div className="space-y-2">
                      {(!form.bannerServices || form.bannerServices.length === 0) ? (
                        <div className="p-4 rounded-lg bg-white border border-dashed border-slate-300 text-center">
                          <p className="text-xs text-slate-500 italic">
                            No services added to this banner yet. Click "+ Add Service Card" above or choose from published services.
                          </p>
                        </div>
                      ) : (
                        form.bannerServices.map((service, idx) => {
                          const SIcon = resolveIconComponent(service.icon);
                          const accent = service.accentColor || '#38bdf8';
                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-2xs"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                  style={{ backgroundColor: `${accent}25`, color: accent, border: `1px solid ${accent}50` }}
                                >
                                  <SIcon size={15} />
                                </div>
                                <div className="min-w-0">
                                  <span className="text-xs font-bold text-slate-900 truncate block">
                                    {service.name}
                                  </span>
                                  <span className="text-[11px] text-slate-500 truncate block">
                                    {service.shortCategory || 'No category provided'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleMoveService(idx, -1)}
                                  disabled={idx === 0}
                                  className="p-1.5 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20 hover:bg-slate-100"
                                  title="Move up in grid"
                                >
                                  <ArrowUp size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveService(idx, 1)}
                                  disabled={idx === form.bannerServices.length - 1}
                                  className="p-1.5 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20 hover:bg-slate-100"
                                  title="Move down in grid"
                                >
                                  <ArrowDown size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditService(service, idx)}
                                  className="p-1.5 rounded text-slate-600 hover:text-primary-700 hover:bg-slate-100"
                                  title="Edit service details"
                                >
                                  <Pencil size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteService(idx)}
                                  className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                  title="Remove from banner"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* ELEMENT 5: SLIDER NAVIGATION TITLE (BESIDE 01 / 02) */}
                  <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="banner-title" className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-extrabold">5</span>
                        <span>Slider Navigation Title: <span className="font-mono text-emerald-800">01 / 02  {form.title || 'All Specialized Services & Company Overview'}</span></span>
                      </label>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Slide 01 Label
                      </span>
                    </div>
                    <div>
                      <label htmlFor="banner-title" className="form-label text-[11px] text-slate-600">
                        Slide Title Label (Displayed beside "01 / 02" counter at the bottom) *
                      </label>
                      <input
                        id="banner-title"
                        required
                        maxLength={120}
                        className="form-input text-sm"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="All Specialized Services & Company Overview"
                      />
                    </div>
                  </div>

                  {/* ELEMENT 6: WATERMARK LOGO CENTERPIECE & BLUEPRINT BACKGROUND */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px] font-extrabold">6</span>
                        <span>Centerpiece Watermark Logo & Blueprint Grid</span>
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-700">Official Logo Active</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white">
                      <div className="w-12 h-12 rounded-lg bg-[#04152b] flex items-center justify-center shrink-0 border border-slate-300">
                        <img
                          src={selectedFile ? previewUrl : (form.imageUrl || '/sln-logo.png')}
                          alt="Logo"
                          className="w-8 h-8 object-contain"
                          onError={(e) => { e.currentTarget.src = '/sln-logo.png'; }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            {selectedFile ? `Custom Logo: ${selectedFile.name}` : 'Official SLN Engineers Logo (/sln-logo.png)'}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800">
                            {selectedFile ? 'Custom Upload' : 'Default Asset'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Rendered centered over the blueprint grid with ambient glows. Transparent PNG or SVG is recommended.
                        </p>
                      </div>
                      {selectedFile && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setForm((prev) => ({ ...prev, imageUrl: '/sln-logo.png' }));
                          }}
                          className="btn btn-outline btn-sm text-xs text-slate-600"
                        >
                          Reset to Official Logo
                        </button>
                      )}
                    </div>
                    <div>
                      <label htmlFor="logo-file" className="form-label text-xs">
                        Upload Custom Watermark / Logo File (optional):
                      </label>
                      <input
                        id="logo-file"
                        type="file"
                        accept="image/png,image/svg+xml,image/webp"
                        className="form-input text-sm"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      />
                      <p className="mt-1 text-[11px] text-slate-500">
                        Leave empty to continue using the official company logo (/sln-logo.png).
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* =========================================================================
                   PHOTO BANNER FORM (WATERPROOFING / PROJECT PHOTO SHOWCASE)
                   ========================================================================= */
                <div className="space-y-4">
                  {/* QUICK RESET TO WATERPROOFING COPY */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-sky-300 bg-sky-50/70">
                    <div>
                      <span className="text-xs font-extrabold text-sky-950 block">
                        Photo Banner (6s Service Showcase Mode)
                      </span>
                      <span className="text-[11px] text-sky-800">
                        Configuring landscape photography, topline rotator, and technical service copy.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => applyPhotoPreset(PHOTO_BANNER_PRESETS[0])}
                      className="text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 px-3 py-1.5 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles size={13} />
                      Load Waterproofing Copy
                    </button>
                  </div>

                  {/* ELEMENT 1: TOPLINE SERVICE ROTATOR TAG */}
                  <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="photo-eyebrow" className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px] font-extrabold">1</span>
                        <span>Top Category Eyebrow Pill</span>
                      </label>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                        Eyebrow Tag
                      </span>
                    </div>
                    <input
                      id="photo-eyebrow"
                      maxLength={100}
                      required
                      className="form-input text-sm"
                      value={form.eyebrow}
                      onChange={(e) => setForm({ ...form, eyebrow: e.target.value })}
                      placeholder="Precision Structural Waterproofing"
                    />
                  </div>

                  {/* ELEMENT 2: SLIDE DURATION */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="photo-duration" className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px] font-extrabold">2</span>
                        <span>Slide Duration (Seconds)</span>
                      </label>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, durationSeconds: 5 })}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            form.durationSeconds === 5 ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          5s
                        </button>
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, durationSeconds: 6 })}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            form.durationSeconds === 6 ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          6s (Recommended)
                        </button>
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, durationSeconds: 8 })}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            form.durationSeconds === 8 ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          8s
                        </button>
                      </div>
                    </div>
                    <input
                      id="photo-duration"
                      type="number"
                      min={1}
                      max={60}
                      required
                      className="form-input text-sm"
                      value={form.durationSeconds || 6}
                      onChange={(e) => setForm({ ...form, durationSeconds: Number(e.target.value) || 6 })}
                    />
                  </div>

                  {/* ELEMENT 3: MAIN HEADLINE */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px] font-extrabold">3</span>
                        <span>Main Headline</span>
                      </label>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label htmlFor="photo-headline" className="form-label text-[11px] text-slate-600">
                          Headline Line 1 (White Title) *
                        </label>
                        <input
                          id="photo-headline"
                          maxLength={80}
                          required
                          className="form-input text-sm"
                          value={form.headline}
                          onChange={(e) => setForm({ ...form, headline: e.target.value })}
                          placeholder="Advanced Waterproofing,"
                        />
                      </div>
                      <div>
                        <label htmlFor="photo-highlighted-headline" className="form-label text-[11px] text-slate-600">
                          Headline Line 2 (Accent Gradient Text) *
                        </label>
                        <input
                          id="photo-highlighted-headline"
                          maxLength={80}
                          required
                          className="form-input text-sm"
                          value={form.highlightedHeadline}
                          onChange={(e) => setForm({ ...form, highlightedHeadline: e.target.value })}
                          placeholder="engineered for decades."
                        />
                      </div>
                    </div>
                  </div>

                  {/* ELEMENT 4: DESCRIPTION PARAGRAPH */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="photo-description" className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px] font-extrabold">4</span>
                        <span>Description Paragraph</span>
                      </label>
                    </div>
                    <textarea
                      id="photo-description"
                      rows="3"
                      maxLength={500}
                      className="form-textarea text-sm"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="High-pressure polyurethane injection, crystalline tanking, and elastomeric membrane systems that stop active groundwater ingress and structural dampness permanently."
                    />
                  </div>

                  {/* ELEMENT 5: SLIDER NAVIGATION TITLE (BESIDE 02 / 02) */}
                  <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="photo-title" className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px] font-extrabold">5</span>
                        <span>Slider Navigation Title: <span className="font-mono text-sky-800">02 / 02  {form.title || 'Precision Waterproofing & Structural Defense'}</span></span>
                      </label>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                        Slide 02 Label
                      </span>
                    </div>
                    <input
                      id="photo-title"
                      required
                      maxLength={120}
                      className="form-input text-sm"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Precision Waterproofing & Structural Defense"
                    />
                  </div>

                  {/* ELEMENT 6: HERO LANDSCAPE PHOTO SELECTION */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
                    <div>
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-2 mb-2">
                        <span className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px] font-extrabold">6</span>
                        <span>Hero Landscape Photograph</span>
                      </span>
                      <label className="block text-[11px] font-medium text-slate-600 mb-2">
                        Select Pre-Approved Project Photo (1-Click Selection):
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {PHOTO_BANNER_PRESETS.map((preset) => {
                          const isSelected = !selectedFile && form.imageUrl === preset.imageUrl;
                          return (
                            <div
                              key={preset.id}
                              onClick={() => {
                                setSelectedFile(null);
                                setForm((prev) => ({ ...prev, imageUrl: preset.imageUrl }));
                              }}
                              className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-sky-500 bg-sky-50/80 ring-2 ring-sky-500/20 shadow-sm'
                                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                              }`}
                            >
                              <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-slate-900 mb-2">
                                <img
                                  src={preset.imageUrl}
                                  alt={preset.title}
                                  className="w-full h-full object-cover"
                                />
                                {isSelected && (
                                  <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-sky-600 text-white text-[9px] font-bold flex items-center gap-1 shadow">
                                    <Check size={10} /> Active
                                  </div>
                                )}
                              </div>
                              <span className="text-[11px] font-bold text-slate-900 block truncate">
                                {preset.tag}
                              </span>
                              <div className="mt-1 flex items-center justify-between">
                                <span className="text-[10px] text-slate-500 truncate">16:9 Photo</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    applyPhotoPreset(preset);
                                  }}
                                  className="text-[10px] text-primary-700 hover:underline font-semibold"
                                  title="Also load this project's headlines & description"
                                >
                                  Load Copy
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="photo-file" className="form-label text-xs">
                        Or Upload Custom Project Photo (16:9 Landscape recommended):
                      </label>
                      <input
                        id="photo-file"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="form-input text-sm"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      />
                      <p className="mt-1 text-[11px] text-slate-500">
                        1920×1080 or 2560×1440 high-resolution photo. Files are automatically optimized for web.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ELEMENT 8: SEO ALT DESCRIPTION & DISPLAY TOGGLE */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                <div>
                  <label htmlFor="banner-alt" className="form-label text-xs">
                    Image SEO Alt Description
                  </label>
                  <input
                    id="banner-alt"
                    maxLength={250}
                    className="form-input text-sm"
                    value={form.altText}
                    onChange={(e) => setForm({ ...form, altText: e.target.value })}
                    placeholder={
                      form.isCompanyLogoBanner
                        ? 'SLN Engineers Projects Official Company Logo and Full Civil Services Spectrum'
                        : 'Modern architectural home protected by SLN Engineers advanced waterproofing'
                    }
                  />
                </div>

                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="rounded text-primary-600 focus:ring-primary-500"
                  />
                  <span className="font-medium text-xs sm:text-sm">Active: Display this slide in the homepage hero slider</span>
                </label>
              </div>

              {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}

              {/* ACTIONS */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn btn-outline btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="btn btn-primary btn-sm flex items-center gap-2 disabled:opacity-60"
                >
                  <Upload size={14} />
                  {uploading ? 'Uploading Asset...' : saving ? 'Saving Banner...' : 'Save Banner Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}