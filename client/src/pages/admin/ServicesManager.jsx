import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Eye,
  EyeOff,
  Search,
  Droplets,
  Paintbrush,
  Building2,
  Wrench,
  ShieldCheck,
  Shield,
  RotateCcw,
  MoveUp,
  MoveDown,
  Sparkles,
  ExternalLink,
  Check,
  X,
  AlertCircle,
  Save,
  Image as ImageIcon,
  Upload,
  Grid,
  Hammer,
  Settings2,
  Tag,
  Palette,
  FileText,
  Award,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  RotateCw,
  Star,
  Calendar,
  MessageCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../../utils/api';
import FooterServicesManager from '../../components/admin/FooterServicesManager';
import {
  DEFAULT_DISCIPLINES,
  DEFAULT_SERVICES,
  DEFAULT_SERVICES_HERO,
  SERVICE_ICONS_LIST,
  DISCIPLINE_COLOR_PRESETS,
  DISCIPLINE_ICONS_LIST,
  renderServiceIcon,
  renderDisciplineIcon,
  normalizeService,
  normalizeDiscipline,
  matchesDiscipline,
} from '../../utils/servicesData';

// Curated stock photos for fast selection
const CURATED_IMAGES = [
  { label: 'Terrace Roof', url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80' },
  { label: 'Bathroom Wet Area', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80' },
  { label: 'Basement Concrete', url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80' },
  { label: 'Exterior Wall', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80' },
  { label: 'Monsoon Painting', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80' },
  { label: 'Interior Luxury', url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80' },
  { label: 'Wall Textures', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80' },
  { label: 'Crack Stitching', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80' },
  { label: 'Gypsum Ceiling', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Acoustic Grid', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80' },
];

const CIVIL_ADVANTAGE_SUGGESTIONS = [
  'IS 1346 & IS 3067 civil standard compliance',
  '100% hydrostatic negative/positive water pressure resistance',
  'Seamless elastomeric membrane with crack bridging up to 2.5mm',
  'High solar reflectance index (SRI) for heat reduction',
  'Zero-VOC, odorless, non-toxic eco-friendly chemistry',
  'Manufacturer certified high-performance formulation',
];

const CIVIL_SPEC_SUGGESTIONS = [
  'Substrate: Structural reinforced concrete (M20/M25/M30) & brickwork',
  'Tensile Strength: ≥ 2.5 N/mm² (ASTM D412)',
  'Elongation at Break: > 350% (ASTM D412)',
  'Pot Life & Curing: 40 mins pot life, 24-hr initial walkability',
  'Chemical Matrix: Heavy-duty aliphatic polyurethane & polymer slurry',
  'Project Handover: QR-coded digital & physical completion report',
];

export default function ServicesManager() {
  const [activeTab, setActiveTab] = useState('services'); // 'services' | 'disciplines' | 'page-content'

  // Data states
  const [services, setServices] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [notification, setNotification] = useState(null);

  // Hero Content State (for public Services page header & catalog headings)
  const [heroFormData, setHeroFormData] = useState(DEFAULT_SERVICES_HERO);
  const [savingHero, setSavingHero] = useState(false);

  // Filters for services
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');

  // Service Modal state
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [serviceModalTab, setServiceModalTab] = useState('general'); // 'general' | 'specs' | 'media' | 'preview'
  const [previewCardFlipped, setPreviewCardFlipped] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const initialServiceForm = {
    title: '',
    disciplineId: 'waterproofing',
    category: 'Terrace & Roof',
    categoryLabel: 'Terrace & Roof',
    warranty: '',
    protocol: 'SLN Hydro-Shield Protocol',
    standard: 'IS 1346 Certified Standards',
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
    description: '',
    shortDescription: '',
    advantages: [
      'Engineered solution compliant with IS civil standards',
      'High-performance material matrix for lasting durability',
      'Quality-tested certified manufacturer materials',
    ],
    specifications: [
      'Substrate: Structural reinforced concrete & masonry',
      'Crack bridging capacity up to 2.5mm',
      'Certified civil applicator installation',
    ],
    iconType: 'droplets',
    accentColor: '#0284c7',
    order: 1,
    publicationStatus: true,
    isFeatured: false,
    beforeMediaUrl: '',
    beforeMediaCaption: '',
    afterMediaUrl: '',
    afterMediaCaption: '',
  };
  const [serviceFormData, setServiceFormData] = useState(initialServiceForm);
  const [imageSourceTab, setImageSourceTab] = useState('upload'); // 'upload' | 'url' | 'curated'
  const [uploadingImage, setUploadingImage] = useState(false);
  const coverFileInputRef = useRef(null);

  const uploadImageFile = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetchApi('/admin/services/upload', {
        method: 'POST',
        body: formData,
      });
      if (res?.data?.url) return res.data.url;
      if (res?.url) return res.url;
      throw new Error(res?.message || 'Service image upload failed.');
    } catch (err) {
      console.warn('Service image upload failed, trying the general media endpoint:', err);
      try {
        const fallback = await fetchApi('/admin/media/upload', {
          method: 'POST',
          body: formData,
        });
        if (fallback?.data?.url) return fallback.data.url;
        if (fallback?.url) return fallback.url;
        throw new Error(fallback?.message || 'Service image upload failed.');
      } catch (fallbackErr) {
        console.error('Service image upload failed:', fallbackErr);
        throw fallbackErr;
      }
    }
  };

  const handleCoverFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const uploadedUrl = await uploadImageFile(file);
      if (uploadedUrl) {
        setServiceFormData((prev) => ({ ...prev, image: uploadedUrl }));
        showToast('Image uploaded successfully from device!');
      }
    } catch (err) {
      console.error('Failed to upload image:', err);
      showToast('Could not upload image. Please try again or use URL.', 'error');
    } finally {
      setUploadingImage(false);
      if (e.target) e.target.value = '';
    }
  };


  // Discipline Modal state (FOR FULL CRUD ON PRIMARY PILLARS)
  const [showDisciplineModal, setShowDisciplineModal] = useState(false);
  const [editingDiscipline, setEditingDiscipline] = useState(null);
  const initialDisciplineForm = {
    name: '',
    slug: '',
    shortCategory: '',
    tag: 'IS Certified',
    badge: 'Core Discipline',
    eyebrow: 'Specialized Discipline',
    ctaText: 'Book Inspection',
    ctaLink: '',
    icon: 'Layers',
    accentColor: '#0284c7',
    description: '',
    order: 1,
    isActive: true,
  };
  const [disciplineFormData, setDisciplineFormData] = useState(initialDisciplineForm);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Synchronize Services State
  const commitServicesState = (newList) => {
    const normalized = newList.map((s, idx) => normalizeService(s, idx));
    setServices(normalized);
    window.dispatchEvent(new Event('sln_services_updated'));
  };

  // Synchronize Disciplines State
  const commitDisciplinesState = (newList) => {
    const normalized = newList.map((d, idx) => normalizeDiscipline(d, idx));
    setDisciplines(normalized);
    window.dispatchEvent(new Event('sln_disciplines_updated'));
  };

  // Load both Services and Disciplines from database
  const loadAllData = async () => {
    setLoading(true);

    // 1. Load Disciplines
    try {
      const discRes = await fetchApi('/admin/disciplines');
      if (discRes.success && Array.isArray(discRes.data) && discRes.data.length > 0) {
        commitDisciplinesState(discRes.data);
      } else {
        commitDisciplinesState(DEFAULT_DISCIPLINES);
      }
    } catch (err) {
      commitDisciplinesState(DEFAULT_DISCIPLINES);
    }

    // 2. Load Services
    try {
      const srvRes = await fetchApi('/admin/services');
      if (srvRes.success && Array.isArray(srvRes.data)) {
        commitServicesState(srvRes.data);
      } else {
        commitServicesState([]);
      }
    } catch (err) {
      commitServicesState([]);
    }

    // 3. Load Services Page Header Content (from backend settings)
    try {
      let pageContentRes = await fetchApi('/admin/services/page-content').catch(() => null);
      if (pageContentRes && pageContentRes.success && pageContentRes.data && Object.keys(pageContentRes.data).length > 0) {
        setHeroFormData((prev) => ({ ...DEFAULT_SERVICES_HERO, ...prev, ...pageContentRes.data }));
      } else {
        const settingsRes = await fetchApi('/settings');
        if (settingsRes.success && settingsRes.data?.servicesPageContent && Object.keys(settingsRes.data.servicesPageContent).length > 0) {
          setHeroFormData((prev) => ({ ...DEFAULT_SERVICES_HERO, ...prev, ...settingsRes.data.servicesPageContent }));
        }
      }
    } catch (e) {
      console.warn('Could not load servicesPageContent from settings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Filtered Services List
  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      const matchesDisc =
        selectedDiscipline === 'all' || matchesDiscipline(srv, selectedDiscipline);
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        srv.title.toLowerCase().includes(q) ||
        (srv.categoryLabel || '').toLowerCase().includes(q) ||
        (srv.category || '').toLowerCase().includes(q) ||
        (srv.description || '').toLowerCase().includes(q);
      return matchesDisc && matchesQuery;
    });
  }, [services, selectedDiscipline, searchQuery]);

  // Active Disciplines List (excluding hidden ones)
  const activeDisciplines = useMemo(() => {
    return disciplines.filter((d) => d.isActive);
  }, [disciplines]);

  // Selected Discipline Object for the current service form
  const selectedDisciplineObj = useMemo(() => {
    return (
      disciplines.find(
        (d) => (d.slug || d.id) === serviceFormData.disciplineId || (d.id || d.slug) === serviceFormData.disciplineId
      ) ||
      disciplines[0] ||
      DEFAULT_DISCIPLINES[0]
    );
  }, [disciplines, serviceFormData.disciplineId]);

  // Quick Civil Suggestion Appenders
  const handleAddAdvantageSuggestion = (text) => {
    if (serviceFormData.advantages.includes(text)) return;
    const clean = serviceFormData.advantages.filter((a) => a.trim().length > 0);
    setServiceFormData({ ...serviceFormData, advantages: [...clean, text] });
  };

  const handleAddSpecificationSuggestion = (text) => {
    if (serviceFormData.specifications.includes(text)) return;
    const clean = serviceFormData.specifications.filter((s) => s.trim().length > 0);
    setServiceFormData({ ...serviceFormData, specifications: [...clean, text] });
  };

  // =========================================================================
  // CRUD OPERATIONS FOR SERVICES
  // =========================================================================
  const handleOpenCreateService = () => {
    setEditingService(null);
    setServiceModalTab('general');
    setPreviewCardFlipped(false);
    const maxOrder = services.reduce((max, s) => Math.max(max, s.order || 0), 0);
    const defaultDisc = activeDisciplines[0] || DEFAULT_DISCIPLINES[0];
    setServiceFormData({
      ...initialServiceForm,
      disciplineId: defaultDisc.id || defaultDisc.slug,
      accentColor: defaultDisc.accentColor || '#0284c7',
      order: maxOrder + 1,
    });
    setShowServiceModal(true);
  };

  const handleOpenEditService = (srv) => {
    setEditingService(srv);
    setServiceModalTab('general');
    setPreviewCardFlipped(false);
    setServiceFormData({
      title: srv.title || '',
      disciplineId: srv.disciplineId || 'waterproofing',
      category: srv.category || srv.categoryLabel || '',
      categoryLabel: srv.categoryLabel || srv.category || '',
      warranty: '',
      protocol: srv.protocol || 'SLN Certified Protocol',
      standard: srv.standard || 'IS 1346 Certified',
      image: srv.image || srv.coverImage || '',
      description: srv.description || srv.fullDescription || srv.shortDescription || '',
      shortDescription: srv.shortDescription || '',
      advantages: Array.isArray(srv.advantages) && srv.advantages.length > 0 ? [...srv.advantages] : [''],
      specifications: Array.isArray(srv.specifications) && srv.specifications.length > 0 ? [...srv.specifications] : [''],
      iconType: srv.iconType || 'droplets',
      accentColor: srv.accentColor || '#0284c7',
      order: Number(srv.order) || 1,
      publicationStatus: srv.publicationStatus !== undefined ? srv.publicationStatus : true,
      isFeatured: Boolean(srv.isFeatured),
      beforeMediaUrl: srv.beforeMediaUrl || (Array.isArray(srv.beforeMedia) && srv.beforeMedia[0]?.url) || '',
      beforeMediaCaption: srv.beforeMediaCaption || (Array.isArray(srv.beforeMedia) && srv.beforeMedia[0]?.caption) || 'Before Treatment',
      afterMediaUrl: srv.afterMediaUrl || (Array.isArray(srv.afterMedia) && srv.afterMedia[0]?.url) || '',
      afterMediaCaption: srv.afterMediaCaption || (Array.isArray(srv.afterMedia) && srv.afterMedia[0]?.caption) || 'After Restoration',
    });
    setShowServiceModal(true);
  };

  const handleSubmitService = async (e) => {
    e.preventDefault();
    if (!serviceFormData.title.trim()) {
      alert('Please enter a service name / title.');
      return;
    }

    setSaving(true);
    const targetDisc = disciplines.find(
      (d) => d.id === serviceFormData.disciplineId || d.slug === serviceFormData.disciplineId
    );

    const payload = {
      ...serviceFormData,
      disciplineName: targetDisc ? targetDisc.name : 'Waterproofing Solutions',
      category: serviceFormData.category || serviceFormData.categoryLabel || serviceFormData.title,
      categoryKey: serviceFormData.category || serviceFormData.title,
      coverImage: serviceFormData.image,
      fullDescription: serviceFormData.description,
      shortDescription: serviceFormData.shortDescription || serviceFormData.description.slice(0, 150),
      advantages: serviceFormData.advantages.filter((a) => a.trim().length > 0),
      specifications: serviceFormData.specifications.filter((s) => s.trim().length > 0),
      benefits: serviceFormData.advantages.filter((a) => a.trim().length > 0),
      technicalHighlights: serviceFormData.specifications.filter((s) => s.trim().length > 0),
      featuredUpdatedAt: serviceFormData.isFeatured
        ? (editingService?.featuredUpdatedAt || Date.now())
        : 0,
      beforeMediaUrl: serviceFormData.beforeMediaUrl || '',
      beforeMediaCaption: serviceFormData.beforeMediaCaption || 'Before Treatment',
      afterMediaUrl: serviceFormData.afterMediaUrl || '',
      afterMediaCaption: serviceFormData.afterMediaCaption || 'After Restoration',
      beforeMedia: serviceFormData.beforeMediaUrl
        ? [{ url: serviceFormData.beforeMediaUrl, caption: serviceFormData.beforeMediaCaption || 'Before Treatment', type: 'image' }]
        : [],
      afterMedia: serviceFormData.afterMediaUrl
        ? [{ url: serviceFormData.afterMediaUrl, caption: serviceFormData.afterMediaCaption || 'After Restoration', type: 'image' }]
        : [],
    };

    try {
      if (editingService) {
        const targetId = editingService._id || editingService.id;
        try {
          await fetchApi(`/admin/services/${targetId}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
          });
        } catch (apiErr) {
          console.warn('API update failed, updating locally:', apiErr.message);
        }

        const updatedList = services.map((s) =>
          (s._id === targetId || s.id === targetId) ? { ...s, ...payload } : s
        );
        commitServicesState(updatedList);
        showToast(`Service "${serviceFormData.title}" updated successfully!`);
      } else {
        let createdService = null;
        try {
          const res = await fetchApi('/admin/services', {
            method: 'POST',
            body: JSON.stringify(payload),
          });
          if (res.success && res.data) createdService = res.data;
        } catch (apiErr) {
          console.warn('API create failed, saving locally:', apiErr.message);
        }

        const newEntry = createdService || {
          ...payload,
          id: String(Date.now()).slice(-4),
          _id: `custom-${Date.now()}`,
        };

        const updatedList = [...services, newEntry];
        commitServicesState(updatedList);
        showToast(`Service "${serviceFormData.title}" added to catalog!`);
      }

      setShowServiceModal(false);
    } catch (err) {
      alert(err.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleServiceStatus = async (srv) => {
    const updatedStatus = !srv.publicationStatus;
    const targetId = srv._id || srv.id;

    const updatedList = services.map((s) =>
      (s._id === targetId || s.id === targetId) ? { ...s, publicationStatus: updatedStatus } : s
    );
    commitServicesState(updatedList);

    try {
      await fetchApi(`/admin/services/${targetId}`, {
        method: 'PUT',
        body: JSON.stringify({ publicationStatus: updatedStatus }),
      });
      showToast(`Service "${srv.title}" is now ${updatedStatus ? 'Published' : 'Draft'}`);
    } catch (e) {}
  };

  const handleToggleFeaturedService = async (srv) => {
    const updatedFeatured = !srv.isFeatured;
    const targetId = srv._id || srv.id;
    const timestamp = updatedFeatured ? Date.now() : 0;

    const updatedList = services.map((s) =>
      (s._id === targetId || s.id === targetId)
        ? { ...s, isFeatured: updatedFeatured, featuredUpdatedAt: timestamp }
        : s
    );
    commitServicesState(updatedList);

    try {
      await fetchApi(`/admin/services/${targetId}`, {
        method: 'PUT',
        body: JSON.stringify({ isFeatured: updatedFeatured, featuredUpdatedAt: timestamp }),
      });
      showToast(
        `Service "${srv.title}" ${updatedFeatured ? 'starred for Homepage Showcase' : 'unstarred'}`
      );
    } catch (e) {}
  };

  const handleDeleteService = async (srv) => {
    const targetId = srv._id || srv.id;
    if (!window.confirm(`Are you sure you want to delete service "${srv.title}"?`)) return;

    try {
      const res = await fetchApi(`/admin/services/${targetId}`, { method: 'DELETE' });
      if (res && res.success === false) {
        throw new Error(res.message || 'Failed to delete service on server');
      }
      const updatedList = services.filter((s) => s._id !== targetId && s.id !== targetId);
      commitServicesState(updatedList);
      showToast(`Service "${srv.title}" deleted successfully.`);
    } catch (e) {
      alert(`Could not delete service from database: ${e.message || 'Server error'}`);
    }
  };

  const handleMoveService = async (index, direction) => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= filteredServices.length) return;

    const targetList = [...filteredServices];
    const [moved] = targetList.splice(index, 1);
    targetList.splice(newIdx, 0, moved);

    const reordered = targetList.map((item, i) => ({ ...item, order: i + 1 }));
    const updatedAll = services.map((s) => {
      const match = reordered.find((r) => (r._id && r._id === s._id) || (r.id && r.id === s.id));
      return match ? { ...s, order: match.order } : s;
    });

    updatedAll.sort((a, b) => (a.order || 0) - (b.order || 0));
    commitServicesState(updatedAll);

    reordered.forEach((item) => {
      const id = item._id || item.id;
      fetchApi(`/admin/services/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ order: item.order }),
      }).catch(() => {});
    });
  };

  const handleResetServicesDefaults = async () => {
    if (!window.confirm('Reset all services to the 14 standard SLN civil engineering solutions?')) return;
    setResetting(true);
    try {
      try {
        await fetchApi('/admin/services/init-defaults', { method: 'POST' });
      } catch (e) {}
      commitServicesState(DEFAULT_SERVICES);
      showToast('Catalog successfully reset to 14 standard services!');
    } catch (err) {
      alert('Failed to reset: ' + err.message);
    } finally {
      setResetting(false);
    }
  };

  // =========================================================================
  // CRUD OPERATIONS FOR DISCIPLINE PILLARS (THE 4 CORE CATEGORIES)
  // =========================================================================
  const handleOpenCreateDiscipline = () => {
    setEditingDiscipline(null);
    const maxOrder = disciplines.reduce((max, d) => Math.max(max, d.order || 0), 0);
    setDisciplineFormData({
      ...initialDisciplineForm,
      order: maxOrder + 1,
    });
    setShowDisciplineModal(true);
  };

  const handleOpenEditDiscipline = (disc) => {
    setEditingDiscipline(disc);
    setDisciplineFormData({
      name: disc.name || '',
      slug: disc.slug || disc.id || '',
      shortCategory: disc.shortCategory || '',
      tag: disc.tag || 'IS Certified',
      badge: disc.badge || 'Core Discipline',
      eyebrow: disc.eyebrow || 'Specialized Discipline',
      ctaText: disc.ctaText || 'Book Inspection',
      ctaLink: disc.ctaLink || '',
      icon: disc.icon || 'Layers',
      accentColor: disc.accentColor || '#0284c7',
      description: disc.description || '',
      order: Number(disc.order) || 1,
      isActive: disc.isActive !== undefined ? disc.isActive : true,
    });
    setShowDisciplineModal(true);
  };

  const handleSubmitDiscipline = async (e) => {
    e.preventDefault();
    if (!disciplineFormData.name.trim()) {
      alert('Please enter a discipline pillar name.');
      return;
    }

    setSaving(true);
    const computedSlug =
      disciplineFormData.slug.trim() ||
      disciplineFormData.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-');

    const payload = {
      ...disciplineFormData,
      slug: computedSlug,
      id: computedSlug,
    };

    try {
      if (editingDiscipline) {
        // UPDATE DISCIPLINE
        const targetId = editingDiscipline._id || editingDiscipline.id || editingDiscipline.slug;
        try {
          await fetchApi(`/admin/disciplines/${targetId}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
          });
        } catch (e) {
          console.warn('API update failed, updating locally:', e.message);
        }

        const updatedList = disciplines.map((d) =>
          (d._id === targetId || d.id === targetId || d.slug === targetId)
            ? { ...d, ...payload }
            : d
        );
        commitDisciplinesState(updatedList);

        // Cascade update in-memory services if name changed
        if (editingDiscipline.name !== payload.name) {
          const updatedSrv = services.map((s) =>
            s.disciplineId === editingDiscipline.slug ? { ...s, disciplineName: payload.name } : s
          );
          commitServicesState(updatedSrv);
        }

        showToast(`Discipline "${payload.name}" updated successfully!`);
      } else {
        // CREATE DISCIPLINE
        let created = null;
        try {
          const res = await fetchApi('/admin/disciplines', {
            method: 'POST',
            body: JSON.stringify(payload),
          });
          if (res.success && res.data) created = res.data;
        } catch (e) {
          console.warn('API create failed, saving locally:', e.message);
        }

        const newEntry = created || {
          ...payload,
          _id: `disc-${Date.now()}`,
        };

        const updatedList = [...disciplines, newEntry];
        commitDisciplinesState(updatedList);
        showToast(`Discipline Pillar "${payload.name}" created!`);
      }

      setShowDisciplineModal(false);
    } catch (err) {
      alert(err.message || 'Failed to save discipline');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleDisciplineStatus = async (disc) => {
    const updatedStatus = !disc.isActive;
    const targetId = disc._id || disc.id || disc.slug;

    const updatedList = disciplines.map((d) =>
      (d._id === targetId || d.id === targetId || d.slug === targetId)
        ? { ...d, isActive: updatedStatus }
        : d
    );
    commitDisciplinesState(updatedList);

    try {
      await fetchApi(`/admin/disciplines/${targetId}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: updatedStatus }),
      });
      showToast(`Pillar "${disc.name}" is now ${updatedStatus ? 'Active' : 'Hidden'}`);
    } catch (e) {}
  };

  const handleDeleteDiscipline = async (disc) => {
    const targetId = disc._id || disc.id || disc.slug;
    const assignedCount = services.filter((s) => s.disciplineId === disc.slug || s.disciplineId === disc.id).length;

    const confirmMsg = assignedCount > 0
      ? `Discipline "${disc.name}" has ${assignedCount} services assigned to it. Deleting will reassign those services to "Waterproofing Solutions". Proceed?`
      : `Are you sure you want to delete discipline pillar "${disc.name}"?`;

    if (!window.confirm(confirmMsg)) return;

    const updatedList = disciplines.filter((d) => d._id !== targetId && d.id !== targetId && d.slug !== targetId);
    commitDisciplinesState(updatedList);

    // Reassign affected services to 'waterproofing'
    if (assignedCount > 0) {
      const reallocated = services.map((s) =>
        (s.disciplineId === disc.slug || s.disciplineId === disc.id)
          ? { ...s, disciplineId: 'waterproofing', disciplineName: 'Waterproofing Solutions' }
          : s
      );
      commitServicesState(reallocated);
    }

    try {
      await fetchApi(`/admin/disciplines/${targetId}`, { method: 'DELETE' });
      showToast(`Discipline "${disc.name}" deleted.`);
    } catch (e) {
      showToast(`Discipline "${disc.name}" removed locally.`);
    }
  };

  const handleMoveDiscipline = async (index, direction) => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= disciplines.length) return;

    const targetList = [...disciplines];
    const [moved] = targetList.splice(index, 1);
    targetList.splice(newIdx, 0, moved);

    const reordered = targetList.map((item, i) => ({ ...item, order: i + 1 }));
    commitDisciplinesState(reordered);

    reordered.forEach((item) => {
      const id = item._id || item.id || item.slug;
      fetchApi(`/admin/disciplines/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ order: item.order }),
      }).catch(() => {});
    });
  };

  const handleResetDisciplinesDefaults = async () => {
    if (!window.confirm('Reset the primary disciplines back to the 4 standard SLN engineering pillars?')) return;
    setResetting(true);
    try {
      try {
        await fetchApi('/admin/disciplines/init-defaults', { method: 'POST' });
      } catch (e) {}
      commitDisciplinesState(DEFAULT_DISCIPLINES);
      showToast('Pillars reset to 4 standard company disciplines!');
    } catch (err) {
      alert('Failed: ' + err.message);
    } finally {
      setResetting(false);
    }
  };

  // Bullet items helpers
  const handleAddAdvantage = () => {
    setServiceFormData({ ...serviceFormData, advantages: [...serviceFormData.advantages, ''] });
  };
  const handleUpdateAdvantage = (idx, val) => {
    const list = [...serviceFormData.advantages];
    list[idx] = val;
    setServiceFormData({ ...serviceFormData, advantages: list });
  };
  const handleRemoveAdvantage = (idx) => {
    const list = serviceFormData.advantages.filter((_, i) => i !== idx);
    setServiceFormData({ ...serviceFormData, advantages: list });
  };

  const handleAddSpecification = () => {
    setServiceFormData({ ...serviceFormData, specifications: [...serviceFormData.specifications, ''] });
  };
  const handleUpdateSpecification = (idx, val) => {
    const list = [...serviceFormData.specifications];
    list[idx] = val;
    setServiceFormData({ ...serviceFormData, specifications: list });
  };
  const handleRemoveSpecification = (idx) => {
    const list = serviceFormData.specifications.filter((_, i) => i !== idx);
    setServiceFormData({ ...serviceFormData, specifications: list });
  };

  // =========================================================================
  // CRUD OPERATIONS FOR SERVICES PAGE HEADER & COPY (TAB 3)
  // =========================================================================
  const handleSaveHeroContent = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSavingHero(true);
    try {
      window.dispatchEvent(new Event('sln_services_hero_updated'));

      // Persist to MongoDB CompanySettings (via dedicated endpoint with fallback)
      let res;
      try {
        res = await fetchApi('/admin/services/page-content', {
          method: 'PUT',
          body: JSON.stringify(heroFormData),
        });
      } catch {
        res = await fetchApi('/admin/settings', {
          method: 'PUT',
          body: JSON.stringify({ servicesPageContent: heroFormData }),
        });
      }

      if (res && res.success) {
        showToast('Services page header & copy saved and published successfully to database!');
      } else {
        showToast(res?.message || 'Failed to save to database.', 'error');
      }
    } catch (err) {
      console.error('Error saving services page content:', err);
      showToast(err.message || 'Failed to save to database.', 'error');
    } finally {
      setSavingHero(false);
    }
  };

  const handleResetHeroContent = async () => {
    if (!window.confirm('Reset Services page header and copy to default text?')) return;
    setSavingHero(true);
    try {
      setHeroFormData(DEFAULT_SERVICES_HERO);
      window.dispatchEvent(new Event('sln_services_hero_updated'));

      let res;
      try {
        res = await fetchApi('/admin/services/page-content/reset', {
          method: 'POST',
        });
      } catch {
        res = await fetchApi('/admin/settings', {
          method: 'PUT',
          body: JSON.stringify({ servicesPageContent: DEFAULT_SERVICES_HERO }),
        });
      }

      showToast('Services page header reset to defaults in database.');
    } catch (err) {
      showToast('Reset failed.', 'error');
    } finally {
      setSavingHero(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 animate-bounce bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700">
          <CheckCircle size={18} className="text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{notification.message}</span>
        </div>
      )}

      {/* Top Header & View Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Services & Specialized Disciplines Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-sky-100 text-sky-800">
              {activeTab === 'services'
                ? `${services.length} Services`
                : activeTab === 'disciplines'
                ? `${disciplines.length} Disciplines`
                : activeTab === 'page-content'
                ? 'Hero & Copy'
                : 'Footer Links'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            {activeTab === 'services'
              ? 'Manage and customize individual engineering services, names, technical specs, and deliverables.'
              : activeTab === 'disciplines'
              ? 'Add, rename, reorder, or customize the Specialized Disciplines (the core section banners, certified tags, and descriptions on /services).'
              : activeTab === 'page-content'
              ? 'Manage the hero banner badge, main headline, engineering description, call-to-actions, and catalog headings for the public Services page.'
              : 'Add, edit, reorder, and configure the Specialized Services quick links displayed in the public website footer.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/services"
            target="_blank"
            className="btn btn-secondary btn-sm text-xs flex items-center gap-1.5 shadow-2xs"
          >
            <ExternalLink size={13} />
            <span>View Live Website</span>
          </Link>

          {/* Tab 1 Mode: Services */}
          {activeTab === 'services' && (
            <>
              <button
                type="button"
                onClick={handleResetServicesDefaults}
                disabled={resetting}
                className="btn btn-outline btn-sm text-xs flex items-center gap-1.5 text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <RotateCcw size={13} className={resetting ? 'animate-spin' : ''} />
                <span>Reset to 14 Defaults</span>
              </button>
              <button
                type="button"
                onClick={handleOpenCreateService}
                className="btn btn-primary btn-sm text-xs flex items-center gap-1.5 shadow-xs cursor-pointer font-bold"
              >
                <Plus size={15} />
                <span>Add New Service</span>
              </button>
            </>
          )}

          {/* Tab 2 Mode: Disciplines */}
          {activeTab === 'disciplines' && (
            <>
              <button
                type="button"
                onClick={handleResetDisciplinesDefaults}
                disabled={resetting}
                className="btn btn-outline btn-sm text-xs flex items-center gap-1.5 text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <RotateCcw size={13} className={resetting ? 'animate-spin' : ''} />
                <span>Reset to 4 Pillars</span>
              </button>
              <button
                type="button"
                onClick={handleOpenCreateDiscipline}
                className="btn btn-primary btn-sm text-xs flex items-center gap-1.5 shadow-xs cursor-pointer font-bold"
              >
                <Plus size={15} />
                <span>Add New Discipline Pillar</span>
              </button>
            </>
          )}

          {/* Tab 3 Mode: Page Header & Copy */}
          {activeTab === 'page-content' && (
            <>
              <button
                type="button"
                onClick={handleResetHeroContent}
                disabled={savingHero}
                className="btn btn-outline btn-sm text-xs flex items-center gap-1.5 text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <RotateCcw size={13} className={savingHero ? 'animate-spin' : ''} />
                <span>Reset Header Defaults</span>
              </button>
              <button
                type="button"
                onClick={handleSaveHeroContent}
                disabled={savingHero}
                className="btn btn-primary btn-sm text-xs flex items-center gap-1.5 shadow-xs cursor-pointer font-bold"
              >
                <Save size={14} />
                <span>{savingHero ? 'Saving...' : 'Save Page Content'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Mode Toggle: [Services Catalog] vs [Primary Discipline Pillars] vs [Page Header & Copy] */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('services')}
          className={`py-2.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'services'
              ? 'border-sky-600 text-sky-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers size={15} />
          <span>Services Catalog</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600">
            {services.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('disciplines')}
          className={`py-2.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'disciplines'
              ? 'border-sky-600 text-sky-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings2 size={15} />
          <span>Specialized Disciplines (Section Banners)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-100 text-sky-800 font-extrabold">
            {disciplines.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('page-content')}
          className={`py-2.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'page-content'
              ? 'border-sky-600 text-sky-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles size={15} />
          <span>Page Header & Copy</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('footer-links')}
          className={`py-2.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'footer-links'
              ? 'border-sky-600 text-sky-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ExternalLink size={15} />
          <span>Footer Specialized Services (CRUD)</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* VIEW A: SERVICES CATALOG */}
      {/* ===================================================================== */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {disciplines.map((disc) => {
              const count = services.filter((s) => matchesDiscipline(s, disc)).length;
              const publishedCount = services.filter((s) => matchesDiscipline(s, disc) && s.publicationStatus).length;
              return (
                <div
                  key={disc.id || disc.slug}
                  onClick={() => setSelectedDiscipline(disc.slug || disc.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    selectedDiscipline === (disc.slug || disc.id)
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-sky-400/40'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate max-w-[70%]">
                      {disc.name.split(' ')[0]}
                    </div>
                    <div
                      style={{ backgroundColor: disc.accentColor }}
                      className="w-6 h-6 rounded-md text-white flex items-center justify-center shrink-0 shadow-2xs"
                    >
                      {renderDisciplineIcon(disc.icon, 13)}
                    </div>
                  </div>
                  <div className="text-xl font-black mt-2 leading-none">
                    {count}
                    {publishedCount !== count && (
                      <span className="text-[11px] font-semibold text-emerald-400 ml-1.5 font-normal">
                        ({publishedCount} live)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/20 text-[10.5px]">
                    <span className="text-slate-400 truncate max-w-[60%]">{disc.shortCategory || disc.name}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditDiscipline(disc);
                      }}
                      className="text-sky-400 hover:text-sky-300 font-bold underline shrink-0 cursor-pointer flex items-center gap-1"
                      title="Edit this Specialized Discipline section banner"
                    >
                      <Edit2 size={10} />
                      <span>Edit Banner</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Search & Discipline Filter Bar */}
          <div className="card bg-white border-slate-200 p-4 space-y-3 shadow-2xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setSelectedDiscipline('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedDiscipline === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Grid size={13} />
                  <span>All Disciplines</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white">
                    {services.length}
                  </span>
                </button>

                {disciplines.map((disc) => {
                  const isSelected = selectedDiscipline === (disc.slug || disc.id);
                  const count = services.filter((s) => matchesDiscipline(s, disc)).length;

                  return (
                    <button
                      key={disc.id || disc.slug}
                      type="button"
                      onClick={() => setSelectedDiscipline(disc.slug || disc.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <span style={{ color: disc.accentColor }}>•</span>
                      <span>{disc.name}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-white text-slate-600'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-72 shrink-0">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search service name, category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input text-xs pl-8 pr-7 py-1.5 w-full rounded-lg"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Services Table Card */}
          <div className="card bg-white border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[10.5px]">
                  <tr>
                    <th className="py-3 px-3 w-12 text-center">Order</th>
                    <th className="py-3 px-3 w-16">Preview</th>
                    <th className="py-3 px-4">Service Name / Title</th>
                    <th className="py-3 px-4">Discipline Pillar</th>
                    <th className="py-3 px-3 text-center">Bullets</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="py-16 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                          <span>Loading services catalog...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredServices.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-16 text-center text-slate-400">
                        <p className="text-sm font-semibold">No services found.</p>
                        <p className="text-xs mt-1">Click "+ Add New Service" to create one.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredServices.map((srv, index) => {
                      const disc =
                        disciplines.find((d) => d.slug === srv.disciplineId || d.id === srv.disciplineId) ||
                        DEFAULT_DISCIPLINES[0];
                      const advCount = Array.isArray(srv.advantages) ? srv.advantages.length : 0;
                      const specCount = Array.isArray(srv.specifications) ? srv.specifications.length : 0;

                      return (
                        <tr key={srv._id || srv.id || index} className="hover:bg-slate-50/80 transition-colors">
                          {/* Order Controls */}
                          <td className="py-3 px-3 text-center">
                            <div className="flex flex-col items-center gap-0.5">
                              <button
                                type="button"
                                onClick={() => handleMoveService(index, 'up')}
                                disabled={index === 0}
                                title="Move Up"
                                className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                              >
                                <MoveUp size={12} />
                              </button>
                              <span className="font-mono text-[10px] font-bold text-slate-500">{index + 1}</span>
                              <button
                                type="button"
                                onClick={() => handleMoveService(index, 'down')}
                                disabled={index === filteredServices.length - 1}
                                title="Move Down"
                                className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                              >
                                <MoveDown size={12} />
                              </button>
                            </div>
                          </td>

                          {/* Image Thumbnail */}
                          <td className="py-3 px-3">
                            <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 relative shrink-0">
                              <img
                                src={srv.image || srv.coverImage}
                                alt={srv.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            </div>
                          </td>

                          {/* Service Title / Name */}
                          <td className="py-3 px-4">
                            <div
                              className="font-bold text-slate-900 text-sm hover:text-sky-700 cursor-pointer flex items-center gap-1.5"
                              onClick={() => handleOpenEditService(srv)}
                            >
                              {srv.isFeatured && (
                                <Star size={13} className="text-amber-500 fill-amber-500 shrink-0" />
                              )}
                              <span>{srv.title}</span>
                              <Edit2 size={11} className="text-slate-400" />
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 max-w-sm">
                              {srv.description || srv.shortDescription}
                            </div>
                          </td>

                          {/* Discipline Badge */}
                          <td className="py-3 px-4">
                            <span
                              style={{ borderColor: disc.accentColor, color: disc.accentColor }}
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-white border shadow-2xs whitespace-nowrap"
                            >
                              <span style={{ backgroundColor: disc.accentColor }} className="w-1.5 h-1.5 rounded-full" />
                              <span>{disc.name.split(' ')[0]}</span>
                            </span>
                            <div className="text-[10px] text-slate-400 mt-0.5">{srv.categoryLabel || srv.category}</div>
                          </td>

                          {/* Bullet counts */}
                          <td className="py-3 px-3 text-center">
                            <span className="text-[10px] text-slate-500 font-medium">
                              {advCount} Adv / {specCount} Specs
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleServiceStatus(srv)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                                srv.publicationStatus
                                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200'
                              }`}
                            >
                              {srv.publicationStatus ? <Eye size={11} /> : <EyeOff size={11} />}
                              <span>{srv.publicationStatus ? 'Published' : 'Draft'}</span>
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleToggleFeaturedService(srv)}
                                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                  srv.isFeatured
                                    ? 'border-amber-300 bg-amber-50 text-amber-600'
                                    : 'border-slate-200 text-slate-400 hover:text-amber-500 hover:bg-amber-50'
                                }`}
                                title={srv.isFeatured ? 'Starred for Homepage Showcase (Click to unstar)' : 'Star to Feature on Homepage'}
                              >
                                <Star size={13} className={srv.isFeatured ? 'fill-amber-500' : ''} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEditService(srv)}
                                className="btn btn-outline btn-sm py-1 px-2.5 text-xs text-sky-700 hover:bg-sky-50 border-sky-200 cursor-pointer flex items-center gap-1"
                              >
                                <Edit2 size={12} />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteService(srv)}
                                className="btn btn-outline btn-sm py-1 px-2 text-xs text-rose-600 hover:bg-rose-50 border-rose-200 cursor-pointer"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      
      {/* ===================================================================== */}
      {/* VIEW B: SPECIALIZED DISCIPLINES CRUD (THE CORE SECTION BANNERS)      */}
      {/* ===================================================================== */}
      {activeTab === 'disciplines' && (
        <div className="space-y-6">
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-sky-950">
            <div>
              <div className="font-bold flex items-center gap-2">
                <Settings2 size={15} className="text-sky-700" />
                <span>Specialized Disciplines & Section Banners Control</span>
              </div>
              <p className="text-slate-600 mt-0.5">
                These are the Specialized Disciplines shown on the live Services page (<a href="/services" target="_blank" rel="noreferrer" className="text-sky-700 font-semibold underline">/services</a>). Each item controls the section banner title, certified standard tag, description, and grouped services.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenCreateDiscipline}
              className="btn btn-primary btn-sm text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
            >
              <Plus size={14} />
              <span>Add Specialized Discipline</span>
            </button>
          </div>

          {/* Pillars List Table */}
          <div className="card bg-white border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[10.5px]">
                  <tr>
                    <th className="py-3 px-3 w-12 text-center">Order</th>
                    <th className="py-3 px-3 w-12 text-center">Color</th>
                    <th className="py-3 px-4">Specialized Discipline Name</th>
                    <th className="py-3 px-4">Tagline / Short Category</th>
                    <th className="py-3 px-3">Certified Tag</th>
                    <th className="py-3 px-3 text-center">Services</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {disciplines.map((disc, idx) => {
                    const assignedServices = services.filter(
                      (s) => matchesDiscipline(s, disc)
                    );

                    return (
                      <tr key={disc.id || disc.slug || idx} className="hover:bg-slate-50/80 transition-colors">
                        {/* Order Controls */}
                        <td className="py-3 px-3 text-center">
                          <div className="flex flex-col items-center gap-0.5">
                            <button
                              type="button"
                              onClick={() => handleMoveDiscipline(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                            >
                              <MoveUp size={12} />
                            </button>
                            <span className="font-mono text-[10px] font-bold text-slate-500">{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleMoveDiscipline(idx, 'down')}
                              disabled={idx === disciplines.length - 1}
                              className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                            >
                              <MoveDown size={12} />
                            </button>
                          </div>
                        </td>

                        {/* Icon & Color Swatch */}
                        <td className="py-3 px-3 text-center">
                          <div
                            style={{ backgroundColor: disc.accentColor }}
                            className="w-8 h-8 rounded-lg text-white flex items-center justify-center mx-auto shadow-2xs"
                          >
                            {renderDisciplineIcon(disc.icon, 16)}
                          </div>
                        </td>

                        {/* Pillar Name */}
                        <td className="py-3 px-4">
                          <div
                            className="font-bold text-slate-900 text-sm hover:text-sky-700 cursor-pointer flex items-center gap-1.5"
                            onClick={() => handleOpenEditDiscipline(disc)}
                          >
                            <span>{disc.name}</span>
                            <Edit2 size={11} className="text-slate-400" />
                          </div>
                          <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                            ID: {disc.slug || disc.id}
                          </div>
                        </td>

                        {/* Tagline */}
                        <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                          {disc.shortCategory || disc.description || '—'}
                        </td>

                        {/* Tag & Badge */}
                        <td className="py-3 px-3">
                          <span
                            style={{ color: disc.accentColor }}
                            className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-slate-100 whitespace-nowrap"
                          >
                            {disc.tag}
                          </span>
                        </td>

                        {/* Services Count */}
                        <td className="py-3 px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-sky-100 text-sky-800">
                            {assignedServices.length}
                          </span>
                        </td>

                        {/* Active/Hidden Toggle */}
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleDisciplineStatus(disc)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                              disc.isActive
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200'
                            }`}
                          >
                            {disc.isActive ? <Eye size={11} /> : <EyeOff size={11} />}
                            <span>{disc.isActive ? 'Active' : 'Hidden'}</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditDiscipline(disc)}
                              className="btn btn-outline btn-sm py-1 px-2.5 text-xs text-sky-700 hover:bg-sky-50 border-sky-200 cursor-pointer flex items-center gap-1"
                            >
                              <Edit2 size={12} />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteDiscipline(disc)}
                              disabled={disciplines.length <= 1}
                              className="btn btn-outline btn-sm py-1 px-2 text-xs text-rose-600 hover:bg-rose-50 border-rose-200 cursor-pointer disabled:opacity-30"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW C: PAGE HEADER & COPY (HERO & CATALOG HEADINGS)                 */}
      {/* ===================================================================== */}
      {activeTab === 'page-content' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Banner Notice */}
          <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-sky-700/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-300 flex items-center justify-center shrink-0">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-base font-black text-white tracking-tight">Services Page Copy & Header Customizer</h3>
                <p className="text-xs text-sky-200/80 mt-1 max-w-2xl leading-relaxed">
                  Update the live headline, eyebrow badge, engineering summary, call-to-action buttons, and catalog header displayed at <a href="/services" target="_blank" rel="noreferrer" className="underline font-semibold hover:text-white">/services</a>. Changes sync immediately to visitors.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start md:self-center shrink-0">
              <a
                href="/services"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm text-xs flex items-center gap-1.5 shadow-xs"
              >
                <ExternalLink size={13} />
                <span>Open Live Page</span>
              </a>
              <button
                type="button"
                onClick={handleSaveHeroContent}
                disabled={savingHero}
                className="btn btn-primary btn-sm text-xs flex items-center gap-1.5 font-bold shadow-md shadow-sky-600/30 cursor-pointer"
              >
                <Save size={14} />
                <span>{savingHero ? 'Saving...' : 'Save & Publish'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Live Hero Simulation / Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Eye size={13} />
                <span>Live Hero Preview (As seen by customers)</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Real-time preview of public hero styling
              </span>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#04203b] via-[#073256] to-[#0a426e] text-white p-6 sm:p-8 border border-sky-900 shadow-xl">
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

              <div className="relative z-10 max-w-2xl space-y-4">
                {/* Eyebrow */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-xs">
                  <Sparkles size={12} className="text-sky-300 shrink-0" />
                  <span>{heroFormData.badge || '4 Specialized Services • Three Generations Lineage'}</span>
                </div>

                {/* Headline */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight whitespace-pre-line">
                  {heroFormData.title || 'Waterproofing, Painting,\nStructural Repairs & False Ceilings.'}
                </h1>

                {/* Description */}
                <p className="text-xs sm:text-[13px] text-sky-200/90 leading-relaxed max-w-xl">
                  {heroFormData.description ||
                    'Complete civil engineering excellence under one roof. Permanent hydrostatic leak containment, monsoon weather-shield painting, structural concrete rehabilitation, and moisture-proof gypsum false ceilings backed by documented quality handovers.'}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#0284c7] shadow-sm">
                    <Calendar size={13} />
                    <span>{heroFormData.ctaPrimaryText || 'Book Diagnostic Site Inspection'}</span>
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-white/10 border border-white/20 backdrop-blur-xs shadow-xs">
                    <MessageCircle size={13} />
                    <span>{heroFormData.ctaWhatsappText || 'WhatsApp Senior Engineer'}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields Card */}
          <form onSubmit={handleSaveHeroContent} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            {/* Section 1: Hero Text & Badges */}
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-900 tracking-tight">1. Hero Section Content</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Topmost banner above the fold on the Services landing page</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700">Above Fold</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Eyebrow Badge Text
                  </label>
                  <input
                    type="text"
                    className="form-input text-xs w-full py-2.5 px-3 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 font-medium"
                    placeholder="e.g. 4 Specialized Services • Three Generations Lineage"
                    value={heroFormData.badge || ''}
                    onChange={(e) => setHeroFormData({ ...heroFormData, badge: e.target.value })}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Small pill badge shown right above the main title.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Main Headline (Title)
                  </label>
                  <textarea
                    rows={2}
                    className="form-input text-sm w-full py-2.5 px-3 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 font-bold"
                    placeholder="Waterproofing, Painting,&#10;Structural Repairs & False Ceilings."
                    value={heroFormData.title || ''}
                    onChange={(e) => setHeroFormData({ ...heroFormData, title: e.target.value })}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">You can press Enter for a line break to split lines naturally on large screens.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Engineering Subtitle / Overview Description
                  </label>
                  <textarea
                    rows={3}
                    className="form-input text-xs w-full py-2.5 px-3 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 leading-relaxed"
                    placeholder="Complete civil engineering excellence under one roof..."
                    value={heroFormData.description || ''}
                    onChange={(e) => setHeroFormData({ ...heroFormData, description: e.target.value })}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Primary descriptive paragraph explaining the 4 core disciplines and technical quality handover.</p>
                </div>
              </div>
            </div>

            {/* Section 2: Call to Action Buttons */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-900 tracking-tight">2. Hero Call-To-Action (CTA) Buttons</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Control button labels and routing links in the hero header</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700">Conversions</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary CTA Button Text
                  </label>
                  <input
                    type="text"
                    className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 font-medium"
                    placeholder="Book Diagnostic Site Inspection"
                    value={heroFormData.ctaPrimaryText || ''}
                    onChange={(e) => setHeroFormData({ ...heroFormData, ctaPrimaryText: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary CTA Link Path
                  </label>
                  <input
                    type="text"
                    className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 font-mono text-slate-800"
                    placeholder="/contact"
                    value={heroFormData.ctaPrimaryLink || ''}
                    onChange={(e) => setHeroFormData({ ...heroFormData, ctaPrimaryLink: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp CTA Button Text
                  </label>
                  <input
                    type="text"
                    className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 font-medium"
                    placeholder="WhatsApp Senior Engineer"
                    value={heroFormData.ctaWhatsappText || ''}
                    onChange={(e) => setHeroFormData({ ...heroFormData, ctaWhatsappText: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Catalog Section Headings */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-900 tracking-tight">3. Catalog Section Headings</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Title and subtitle above the discipline pill filter tabs and services grid</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Catalog Header</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Catalog Section Title
                  </label>
                  <input
                    type="text"
                    className="form-input text-xs w-full py-2.5 px-3 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 font-bold"
                    placeholder="e.g. Our 4 Core Expertise Pillars"
                    value={heroFormData.catalogTitle || ''}
                    onChange={(e) => setHeroFormData({ ...heroFormData, catalogTitle: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Catalog Section Subtitle
                  </label>
                  <input
                    type="text"
                    className="form-input text-xs w-full py-2.5 px-3 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 font-medium"
                    placeholder="Select a discipline to explore technical specifications and specialized scopes."
                    value={heroFormData.catalogSubtitle || ''}
                    onChange={(e) => setHeroFormData({ ...heroFormData, catalogSubtitle: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleResetHeroContent}
                disabled={savingHero}
                className="btn btn-outline btn-sm text-xs flex items-center gap-1.5 text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <RotateCcw size={13} className={savingHero ? 'animate-spin' : ''} />
                <span>Reset to Factory Defaults</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href="/services"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-sm text-xs cursor-pointer flex items-center gap-1.5"
                >
                  <ExternalLink size={13} />
                  <span>View Public Page</span>
                </a>
                <button
                  type="submit"
                  disabled={savingHero}
                  className="btn btn-primary btn-sm text-xs flex items-center gap-2 font-bold cursor-pointer px-6 shadow-md shadow-sky-600/20"
                >
                  <Save size={14} />
                  <span>{savingHero ? 'Saving Changes...' : 'Save Page Content'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW D: FOOTER SPECIALIZED SERVICES CRUD                              */}
      {/* ===================================================================== */}
      {activeTab === 'footer-links' && (
        <div className="space-y-6">
          <FooterServicesManager />
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 1: ADD / EDIT SPECIALIZED DISCIPLINE (WITH LIVE PREVIEW)        */}
      {/* ===================================================================== */}
      {showDisciplineModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[92vh] my-auto">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div
                  style={{ backgroundColor: disciplineFormData.accentColor || '#0284c7' }}
                  className="w-10 h-10 rounded-2xl text-white flex items-center justify-center font-bold shadow-md shadow-sky-500/20 shrink-0"
                >
                  {renderDisciplineIcon(disciplineFormData.icon, 20)}
                </div>
                <div>
                  <h3 className="font-black text-white text-base tracking-tight">
                    {editingDiscipline ? `Edit Specialized Discipline: "${editingDiscipline.name}"` : 'Add New Specialized Discipline'}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Controls section banner, certified standard tag, and services grouped under it on /services.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDisciplineFormData({ ...disciplineFormData, isActive: !disciplineFormData.isActive })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer border ${
                    disciplineFormData.isActive
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      disciplineFormData.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                    }`}
                  />
                  <span>{disciplineFormData.isActive ? 'Active' : 'Hidden'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowDisciplineModal(false)}
                  className="w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Live Banner Preview (matches public /services section header) */}
            <div className="px-6 pt-4 pb-3 bg-slate-50 border-b border-slate-200 shrink-0">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Eye size={12} />
                <span>Live Public Section Banner Preview (As seen on /services)</span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    style={{ backgroundColor: disciplineFormData.accentColor || '#0284c7' }}
                    className="w-10 h-10 rounded-xl text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5"
                  >
                    {renderDisciplineIcon(disciplineFormData.icon, 20)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                        {disciplineFormData.eyebrow || 'Specialized Discipline'}
                      </span>
                      {disciplineFormData.tag && (
                        <span
                          style={{ color: disciplineFormData.accentColor || '#0284c7' }}
                          className="px-2 py-0.2 rounded text-[9.5px] font-extrabold bg-slate-100 uppercase"
                        >
                          {disciplineFormData.tag}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-black text-slate-900 tracking-tight leading-tight">
                      {disciplineFormData.name || 'Discipline Name'}
                    </h3>
                    <p className="text-[11px] text-slate-600 leading-snug line-clamp-2 mt-0.5">
                      {disciplineFormData.description || 'Specialized engineering category description...'}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 self-start sm:self-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-sky-600 shadow-xs">
                    <Calendar size={12} />
                    <span>{disciplineFormData.ctaText || 'Book Inspection'}</span>
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmitDiscipline} className="p-6 space-y-4 text-xs overflow-y-auto">
              <div>
                <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-1.5">
                  Specialized Discipline Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Waterproofing Solutions"
                  className="form-input text-sm font-bold text-slate-900 w-full py-2.5 px-3.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  value={disciplineFormData.name}
                  onChange={(e) => setDisciplineFormData({ ...disciplineFormData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">Section Eyebrow Label</label>
                  <input
                    type="text"
                    placeholder="Specialized Discipline"
                    className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300 bg-white font-medium"
                    value={disciplineFormData.eyebrow}
                    onChange={(e) => setDisciplineFormData({ ...disciplineFormData, eyebrow: e.target.value })}
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">Text above section title</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">Certified Standard / Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. IS 1346 Certified"
                    className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300 bg-white font-medium"
                    value={disciplineFormData.tag}
                    onChange={(e) => setDisciplineFormData({ ...disciplineFormData, tag: e.target.value })}
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">IS / ASTM standard tag</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">CTA Button Label</label>
                  <input
                    type="text"
                    placeholder="Book Inspection"
                    className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300 bg-white font-medium"
                    value={disciplineFormData.ctaText}
                    onChange={(e) => setDisciplineFormData({ ...disciplineFormData, ctaText: e.target.value })}
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">Action button text</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Tagline / Scope Subtitle
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Active Hydrostatic Defense & Crystalline Tanking"
                    className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300 bg-white"
                    value={disciplineFormData.shortCategory}
                    onChange={(e) => setDisciplineFormData({ ...disciplineFormData, shortCategory: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    CTA Button Destination (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Defaults to /contact?service=<name>"
                    className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300 bg-white font-mono text-slate-700"
                    value={disciplineFormData.ctaLink}
                    onChange={(e) => setDisciplineFormData({ ...disciplineFormData, ctaLink: e.target.value })}
                  />
                </div>
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Category Description (Banner Paragraph)
                </label>
                <textarea
                  rows="3"
                  placeholder="Comprehensive description of materials, certifications, and methods for this specialized discipline..."
                  className="form-textarea text-xs w-full p-3 rounded-2xl border border-slate-300 leading-relaxed font-normal"
                  value={disciplineFormData.description}
                  onChange={(e) => setDisciplineFormData({ ...disciplineFormData, description: e.target.value })}
                />
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-1.5">
                  Pillar Icon
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {DISCIPLINE_ICONS_LIST.map((ic) => {
                    const isSelected = disciplineFormData.icon.toLowerCase() === ic.id.toLowerCase();
                    const IconComp = ic.icon;
                    return (
                      <button
                        key={ic.id}
                        type="button"
                        onClick={() => setDisciplineFormData({ ...disciplineFormData, icon: ic.id })}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-sky-400 shadow-xs'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                        }`}
                        title={ic.label}
                      >
                        <IconComp size={16} />
                        <span className="text-[9px] truncate max-w-full font-bold">{ic.id}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Accent Color Swatches */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1.5">
                <label className="block text-xs font-bold text-slate-900">Brand Accent Color</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {DISCIPLINE_COLOR_PRESETS.map((p) => (
                    <button
                      key={p.color}
                      type="button"
                      onClick={() => setDisciplineFormData({ ...disciplineFormData, accentColor: p.color })}
                      style={{ backgroundColor: p.color }}
                      className={`w-7 h-7 rounded-full transition-transform cursor-pointer shadow-xs ${
                        disciplineFormData.accentColor === p.color
                          ? 'ring-2 ring-offset-2 ring-slate-900 scale-110'
                          : 'opacity-80 hover:opacity-100'
                      }`}
                      title={p.label}
                    />
                  ))}
                  <input
                    type="text"
                    value={disciplineFormData.accentColor}
                    onChange={(e) => setDisciplineFormData({ ...disciplineFormData, accentColor: e.target.value })}
                    className="form-input text-xs font-mono py-1 px-2 w-24 text-center rounded-lg bg-white border border-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setShowDisciplineModal(false)}
                  className="btn btn-outline btn-sm text-xs cursor-pointer px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary btn-sm text-xs flex items-center gap-1.5 font-bold cursor-pointer px-5 shadow-md shadow-sky-600/20"
                >
                  <Save size={13} />
                  <span>{saving ? 'Saving...' : editingDiscipline ? 'Update Discipline' : 'Create Discipline'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      {/* ===================================================================== */}
      {/* MODAL 2: ADD / EDIT SERVICE (CLEAN, MODERN, INTUITIVE FORM WITH LIVE PREVIEW) */}
      {/* ===================================================================== */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[92vh] my-auto">
            
            {/* 1. STICKY TOP HEADER */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div
                  style={{ backgroundColor: selectedDisciplineObj?.accentColor || '#0284c7' }}
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md shadow-sky-500/20 shrink-0"
                >
                  {renderDisciplineIcon(selectedDisciplineObj?.icon || 'Layers', 20)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-white text-base tracking-tight">
                      {editingService ? `Edit Service: "${serviceFormData.title || 'Untitled'}"` : 'Add New Engineering Service'}
                    </h3>
                    <span
                      style={{
                        backgroundColor: `${selectedDisciplineObj?.accentColor || '#0284c7'}33`,
                        color: selectedDisciplineObj?.accentColor || '#38bdf8',
                        borderColor: `${selectedDisciplineObj?.accentColor || '#0284c7'}66`,
                      }}
                      className="text-[10px] font-extrabold px-2 py-0.5 rounded-full border hidden sm:inline-block"
                    >
                      {selectedDisciplineObj?.name || 'Waterproofing Solutions'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Configure technical specifications, primary discipline pillar, scope of work, and media.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                {/* Publication Switch */}
                <button
                  type="button"
                  onClick={() =>
                    setServiceFormData({ ...serviceFormData, publicationStatus: !serviceFormData.publicationStatus })
                  }
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer border ${
                    serviceFormData.publicationStatus
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                  }`}
                  title="Click to toggle publication status"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      serviceFormData.publicationStatus ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                    }`}
                  />
                  <span>{serviceFormData.publicationStatus ? 'Active & Live' : 'Draft / Hidden'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* 2. TAB NAVIGATION BAR */}
            <div className="flex items-center justify-between px-6 pt-3 pb-2.5 bg-slate-50 border-b border-slate-200 shrink-0 gap-2 overflow-x-auto">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setServiceModalTab('general')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    serviceModalTab === 'general'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/90 ring-1 ring-slate-900/5'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Tag size={13} className={serviceModalTab === 'general' ? 'text-sky-600' : ''} />
                  <span>1. Overview &amp; Pillar</span>
                </button>

                <button
                  type="button"
                  onClick={() => setServiceModalTab('specs')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    serviceModalTab === 'specs'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/90 ring-1 ring-slate-900/5'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <FileText size={13} className={serviceModalTab === 'specs' ? 'text-sky-600' : ''} />
                  <span>2. Scope &amp; Specs</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-extrabold">
                    {serviceFormData.advantages.filter((a) => a.trim()).length +
                      serviceFormData.specifications.filter((s) => s.trim()).length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setServiceModalTab('media')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    serviceModalTab === 'media'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/90 ring-1 ring-slate-900/5'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <ImageIcon size={13} className={serviceModalTab === 'media' ? 'text-sky-600' : ''} />
                  <span>3. Media &amp; Icon</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setServiceModalTab('preview')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  serviceModalTab === 'preview'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200'
                }`}
              >
                <Sparkles size={13} />
                <span>Live 3D Card Preview</span>
              </button>
            </div>

            {/* 3. SCROLLABLE FORM BODY */}
            <form onSubmit={handleSubmitService} className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                
                {/* ============================================================== */}
                {/* TAB 1: OVERVIEW & PRIMARY DISCIPLINE PILLAR                   */}
                {/* ============================================================== */}
                {serviceModalTab === 'general' && (
                  <div className="space-y-6">
                    {/* Service Name Input */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1">
                          <span>Service Name / Title</span>
                          <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[11px] text-slate-400">Headline displayed across all cards &amp; quotes</span>
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Terrace & Roof Waterproofing"
                        className="form-input text-sm font-bold text-slate-900 w-full py-2.5 px-3.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                        value={serviceFormData.title}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, title: e.target.value })}
                      />
                    </div>

                    {/* Primary Discipline Pillar Visual Card Selector */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1">
                          <span>Primary Discipline Pillar</span>
                          <span className="text-rose-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setShowServiceModal(false);
                            setActiveTab('disciplines');
                          }}
                          className="text-[11px] font-bold text-sky-600 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Settings2 size={12} />
                          <span>+ Manage Discipline Pillars</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {(activeDisciplines.length > 0 ? activeDisciplines : disciplines).map((d) => {
                          const isSelected = serviceFormData.disciplineId === (d.slug || d.id);
                          return (
                            <button
                              key={d.slug || d.id}
                              type="button"
                              onClick={() => {
                                setServiceFormData({
                                  ...serviceFormData,
                                  disciplineId: d.slug || d.id,
                                  accentColor: d.accentColor || '#0284c7',
                                });
                              }}
                              className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between gap-3 cursor-pointer group ${
                                isSelected
                                  ? 'bg-white shadow-md border-transparent ring-2'
                                  : 'bg-slate-50 border-slate-200/90 hover:bg-white hover:border-slate-300'
                              }`}
                              style={
                                isSelected
                                  ? {
                                      ringColor: d.accentColor || '#0284c7',
                                      borderColor: d.accentColor || '#0284c7',
                                    }
                                  : {}
                              }
                            >
                              <div className="flex items-start justify-between">
                                <div
                                  style={{ backgroundColor: d.accentColor || '#0284c7' }}
                                  className="w-8 h-8 rounded-xl text-white flex items-center justify-center shrink-0 shadow-xs"
                                >
                                  {renderDisciplineIcon(d.icon, 16)}
                                </div>
                                {isSelected ? (
                                  <span
                                    style={{ backgroundColor: d.accentColor || '#0284c7' }}
                                    className="w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px] font-bold shadow-xs"
                                  >
                                    <Check size={12} />
                                  </span>
                                ) : (
                                  <span className="w-4 h-4 rounded-full border border-slate-300 group-hover:border-slate-400" />
                                )}
                              </div>
                              <div>
                                <div className="font-black text-slate-900 text-xs leading-snug line-clamp-1">{d.name}</div>
                                <div className="text-[10.5px] font-bold mt-0.5" style={{ color: d.accentColor || '#0284c7' }}>
                                  {d.tag || 'IS Certified'}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Category Sub-Tag */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                      <label className="block text-xs font-bold text-slate-900">
                        Category Sub-Tag / Trade Label
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Terrace & Roof, Wet Areas, Facade"
                        className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-200 bg-white"
                        value={serviceFormData.categoryLabel}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, categoryLabel: e.target.value })}
                      />
                      <p className="text-[10.5px] text-slate-500">
                        Short engineering sub-label displayed on cards &amp; breadcrumbs.
                      </p>
                    </div>

                    {/* Featured Service on Homepage Switch */}
                    <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Star size={16} className="text-amber-600 fill-amber-500 shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-amber-900">Featured Homepage Service Showcase</div>
                          <div className="text-[11px] text-amber-700">Display this service in the 3-card showcase on the homepage.</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={Boolean(serviceFormData.isFeatured)}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, isFeatured: e.target.checked })}
                        className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* ============================================================== */}
                {/* TAB 2: TECHNICAL SCOPE, ADVANTAGES & SPECIFICATIONS           */}
                {/* ============================================================== */}
                {serviceModalTab === 'specs' && (
                  <div className="space-y-6">
                    {/* Full Description */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1">
                          <span>Comprehensive Technical Scope &amp; Methodology</span>
                          <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[11px] text-slate-400">Detailed civil engineering scope</span>
                      </div>
                      <textarea
                        required
                        rows="3"
                        placeholder="Detail the engineering methodology, chemical substrate prep, crack stitching, and hydrostatic waterproofing scope..."
                        className="form-textarea text-xs w-full p-3 rounded-2xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 leading-relaxed font-normal"
                        value={serviceFormData.description}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                      />
                    </div>

                    {/* Execution Protocol */}
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1.5">
                        Certified Execution Protocol / Application Method
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. SLN Hydro-Shield Multi-Layer Elastomeric Polyurethane Protocol"
                        className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-300 bg-white"
                        value={serviceFormData.protocol}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, protocol: e.target.value })}
                      />
                    </div>

                    {/* Advantages & Specifications 2-Column Lists */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Advantages */}
                      <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/90 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                            <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                              <CheckCircle size={15} className="text-emerald-600" />
                              <span>Key Advantages (Card Front)</span>
                            </label>
                            <button
                              type="button"
                              onClick={handleAddAdvantage}
                              className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer"
                            >
                              <Plus size={13} />
                              <span>Add Item</span>
                            </button>
                          </div>

                          <div className="space-y-2">
                            {serviceFormData.advantages.map((adv, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-black flex items-center justify-center shrink-0">
                                  {idx + 1}
                                </span>
                                <input
                                  type="text"
                                  className="form-input text-xs py-1.5 px-2.5 rounded-lg flex-1 border border-slate-200 bg-white"
                                  placeholder={`Advantage ${idx + 1}`}
                                  value={adv}
                                  onChange={(e) => handleUpdateAdvantage(idx, e.target.value)}
                                />
                                {serviceFormData.advantages.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveAdvantage(idx)}
                                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Quick Suggestions */}
                        <div className="pt-2 border-t border-slate-200/80">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                            + Quick Add Standard Advantage:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {CIVIL_ADVANTAGE_SUGGESTIONS.map((sug, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => handleAddAdvantageSuggestion(sug)}
                                className="text-[9.5px] px-2 py-0.5 rounded-md bg-white hover:bg-slate-200 text-slate-700 border border-slate-200 truncate max-w-full cursor-pointer"
                                title={sug}
                              >
                                + {sug.split(' ').slice(0, 4).join(' ')}...
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Technical Specs */}
                      <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/90 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                            <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                              <Sparkles size={15} className="text-amber-600" />
                              <span>Technical Specs (Card Back)</span>
                            </label>
                            <button
                              type="button"
                              onClick={handleAddSpecification}
                              className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer"
                            >
                              <Plus size={13} />
                              <span>Add Item</span>
                            </button>
                          </div>

                          <div className="space-y-2">
                            {serviceFormData.specifications.map((spec, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-black flex items-center justify-center shrink-0">
                                  {idx + 1}
                                </span>
                                <input
                                  type="text"
                                  className="form-input text-xs py-1.5 px-2.5 rounded-lg flex-1 border border-slate-200 bg-white"
                                  placeholder={`Specification ${idx + 1}`}
                                  value={spec}
                                  onChange={(e) => handleUpdateSpecification(idx, e.target.value)}
                                />
                                {serviceFormData.specifications.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSpecification(idx)}
                                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Quick Suggestions */}
                        <div className="pt-2 border-t border-slate-200/80">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                            + Quick Add Standard Spec:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {CIVIL_SPEC_SUGGESTIONS.map((sug, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => handleAddSpecificationSuggestion(sug)}
                                className="text-[9.5px] px-2 py-0.5 rounded-md bg-white hover:bg-slate-200 text-slate-700 border border-slate-200 truncate max-w-full cursor-pointer"
                                title={sug}
                              >
                                + {sug.split(' ').slice(0, 4).join(' ')}...
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ============================================================== */}
                {/* TAB 3: MEDIA, PHOTO PRESETS & CARD STYLING                     */}
                {/* ============================================================== */}
                {serviceModalTab === 'media' && (
                  <div className="space-y-6">
                    {/* Unified Service Cover Photo Selector (Device Upload, URL, or Presets) */}
                    <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                        <div>
                          <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                            <ImageIcon size={15} className="text-sky-600" />
                            <span>Service Cover Photo</span>
                          </label>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Choose how to set your service cover image: upload from device, paste a URL, or pick a curated photo.
                          </p>
                        </div>

                        {/* Mode Selector Tabs */}
                        <div className="inline-flex p-1 rounded-xl bg-slate-200/80 text-[11px] font-bold self-start sm:self-auto gap-1">
                          <button
                            type="button"
                            onClick={() => setImageSourceTab('upload')}
                            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                              imageSourceTab === 'upload'
                                ? 'bg-white text-sky-900 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                            }`}
                          >
                            <Upload size={12} className="text-sky-600" />
                            <span>Upload from Device</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setImageSourceTab('url')}
                            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                              imageSourceTab === 'url'
                                ? 'bg-white text-sky-900 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                            }`}
                          >
                            <ExternalLink size={12} className="text-sky-600" />
                            <span>Image URL</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setImageSourceTab('curated')}
                            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                              imageSourceTab === 'curated'
                                ? 'bg-white text-sky-900 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                            }`}
                          >
                            <Sparkles size={12} className="text-amber-500" />
                            <span>Curated Presets</span>
                          </button>
                        </div>
                      </div>

                      {/* OPTION 1: Upload from Device */}
                      {imageSourceTab === 'upload' && (
                        <div className="space-y-3">
                          <input
                            type="file"
                            ref={coverFileInputRef}
                            accept="image/*"
                            onChange={handleCoverFileUpload}
                            className="hidden"
                          />

                          <div
                            onClick={() => coverFileInputRef.current?.click()}
                            className="border-2 border-dashed border-sky-300 hover:border-sky-500 bg-sky-50/60 hover:bg-sky-50/90 rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 group"
                          >
                            <div className="w-12 h-12 rounded-2xl bg-white border border-sky-200 text-sky-600 flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                              {uploadingImage ? (
                                <RotateCw size={22} className="animate-spin text-sky-600" />
                              ) : (
                                <Upload size={22} className="group-hover:-translate-y-0.5 transition-transform" />
                              )}
                            </div>
                            <div className="text-xs font-bold text-slate-800">
                              {uploadingImage ? 'Uploading image from device...' : 'Click to browse or drag & drop photo from device'}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1">
                              Supports JPG, PNG, WEBP, or SVG images (up to 15MB)
                            </p>
                          </div>

                          {serviceFormData.image && (
                            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-14 h-12 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-slate-100">
                                  <img
                                    src={serviceFormData.image}
                                    alt="Cover Preview"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-slate-900 truncate">
                                    Current Cover Image
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-mono truncate max-w-xs sm:max-w-md">
                                    {serviceFormData.image}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => coverFileInputRef.current?.click()}
                                  className="px-2.5 py-1 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition-colors cursor-pointer"
                                >
                                  Change
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setServiceFormData({ ...serviceFormData, image: '' })}
                                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                  title="Clear image"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* OPTION 2: Enter Web Image URL */}
                      {imageSourceTab === 'url' && (
                        <div className="space-y-3">
                          <label className="block text-xs font-bold text-slate-800">
                            Paste Web Image URL (Unsplash, CDN, or Hosted Photo)
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="url"
                              placeholder="https://images.unsplash.com/photo-... or https://example.com/photo.jpg"
                              className="form-input text-xs font-mono py-2.5 px-3 flex-1 rounded-xl border border-slate-200 bg-white shadow-2xs"
                              value={serviceFormData.image}
                              onChange={(e) => setServiceFormData({ ...serviceFormData, image: e.target.value })}
                            />
                            {serviceFormData.image && (
                              <button
                                type="button"
                                onClick={() => setServiceFormData({ ...serviceFormData, image: '' })}
                                className="p-2 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                title="Clear URL"
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>
                          {serviceFormData.image && (
                            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                              <div className="w-16 h-12 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-slate-100">
                                <img
                                  src={serviceFormData.image}
                                  alt="URL Preview"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=400&q=80';
                                  }}
                                />
                              </div>
                              <div className="text-xs text-slate-600 truncate flex-1 font-mono">
                                {serviceFormData.image}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* OPTION 3: Curated Stock Presets */}
                      {imageSourceTab === 'curated' && (
                        <div>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {CURATED_IMAGES.map((img) => {
                              const isSelected = serviceFormData.image === img.url;
                              return (
                                <button
                                  key={img.label}
                                  type="button"
                                  onClick={() => setServiceFormData({ ...serviceFormData, image: img.url })}
                                  className={`group relative rounded-xl overflow-hidden aspect-4/3 border-2 transition-all cursor-pointer text-left ${
                                    isSelected
                                      ? 'border-sky-500 shadow-md ring-2 ring-sky-400/40 scale-102'
                                      : 'border-slate-200 hover:border-slate-400'
                                  }`}
                                >
                                  <img
                                    src={img.url}
                                    alt={img.label}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-2">
                                    <span className="text-[10.5px] font-bold text-white leading-tight drop-shadow-xs line-clamp-1">
                                      {img.label}
                                    </span>
                                  </div>
                                  {isSelected && (
                                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-xs">
                                      <Check size={12} />
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Icon Selection & Accent Color */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Icon Selection */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                        <label className="block text-xs font-bold text-slate-900">
                          Card Technical Icon
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {SERVICE_ICONS_LIST.map((ic) => {
                            const isSelected = serviceFormData.iconType === ic.id;
                            const IconComp = ic.icon;
                            return (
                              <button
                                key={ic.id}
                                type="button"
                                onClick={() => setServiceFormData({ ...serviceFormData, iconType: ic.id })}
                                className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs ring-2 ring-sky-400'
                                    : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                                }`}
                              >
                                <IconComp size={16} />
                                <span className="text-[9px] font-bold truncate max-w-full">{ic.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Accent Color Swatches */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-900">
                            Service Accent Color
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              setServiceFormData({
                                ...serviceFormData,
                                accentColor: selectedDisciplineObj?.accentColor || '#0284c7',
                              })
                            }
                            className="text-[10px] font-bold text-sky-600 hover:underline cursor-pointer"
                          >
                            Sync with Pillar
                          </button>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap pt-1">
                          {DISCIPLINE_COLOR_PRESETS.map((p) => (
                            <button
                              key={p.color}
                              type="button"
                              onClick={() => setServiceFormData({ ...serviceFormData, accentColor: p.color })}
                              style={{ backgroundColor: p.color }}
                              className={`w-7 h-7 rounded-full transition-transform cursor-pointer shadow-xs ${
                                serviceFormData.accentColor === p.color
                                  ? 'ring-2 ring-offset-2 ring-slate-900 scale-110'
                                  : 'opacity-80 hover:opacity-100'
                              }`}
                              title={p.label}
                            />
                          ))}
                          <input
                            type="text"
                            value={serviceFormData.accentColor}
                            onChange={(e) => setServiceFormData({ ...serviceFormData, accentColor: e.target.value })}
                            className="form-input text-xs font-mono py-1 px-2 w-24 text-center rounded-lg bg-white border border-slate-200"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ============================================================== */}
                {/* TAB 4: INTERACTIVE LIVE 3D CARD PREVIEW                        */}
                {/* ============================================================== */}
                {serviceModalTab === 'preview' && (
                  <div className="space-y-4 py-2">
                    <div className="flex items-center justify-between bg-sky-50 p-3 rounded-2xl border border-sky-200 text-sky-900 text-xs">
                      <div className="flex items-center gap-2 font-bold">
                        <Sparkles size={16} className="text-sky-600 shrink-0" />
                        <span>Interactive 3D Card Simulation: This is exactly how the public will see and interact with this service card.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPreviewCardFlipped(!previewCardFlipped)}
                        className="btn btn-primary btn-sm py-1 px-3 text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <RotateCw size={12} />
                        <span>{previewCardFlipped ? 'Flip to Front' : 'Flip to Specs'}</span>
                      </button>
                    </div>

                    <div className="flex justify-center items-center py-4">
                      <div className="perspective-1000 w-full max-w-[370px] h-[440px]">
                        <div
                          className={`card-flip-transition transform-style-3d w-full h-full relative ${
                            previewCardFlipped ? 'rotate-y-180' : ''
                          }`}
                        >
                          {/* FRONT FACE */}
                          <div
                            onClick={() => setPreviewCardFlipped(true)}
                            className="backface-hidden absolute inset-0 w-full h-full bg-white rounded-2xl border border-slate-200 shadow-xl flex flex-col justify-between overflow-hidden cursor-pointer"
                          >
                            <div
                              style={{ backgroundColor: serviceFormData.accentColor || '#0284c7' }}
                              className="absolute top-0 left-0 right-0 h-1.5 z-20"
                            />

                            <div className="relative h-[210px] w-full overflow-hidden bg-slate-100 shrink-0">
                              <img
                                src={serviceFormData.image || CURATED_IMAGES[0].url}
                                alt={serviceFormData.title || 'Service Preview'}
                                className="w-full h-full object-cover"
                              />

                              <div className="absolute top-2.5 left-2.5 bg-slate-900/85 backdrop-blur-xs text-white text-[9.5px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
                                {selectedDisciplineObj?.name || 'Waterproofing Solutions'}
                              </div>
                            </div>

                            <div className="p-4 flex-1 flex flex-col justify-between">
                              <div>
                                <div className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                                  {serviceFormData.categoryLabel || 'Civil Engineering'}
                                </div>
                                <h4 className="text-base font-black text-slate-900 leading-snug line-clamp-2 mt-0.5">
                                  {serviceFormData.title || 'Untitled Engineering Service'}
                                </h4>
                                <ul className="mt-2.5 space-y-1">
                                  {serviceFormData.advantages
                                    .filter((a) => a.trim())
                                    .slice(0, 3)
                                    .map((adv, idx) => (
                                      <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                                        <CheckCircle size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                                        <span className="line-clamp-1">{adv}</span>
                                      </li>
                                    ))}
                                </ul>
                              </div>

                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-sky-600">
                                <span>Click to View Technical Specifications</span>
                                <ArrowRight size={13} />
                              </div>
                            </div>
                          </div>

                          {/* BACK FACE */}
                          <div
                            onClick={() => setPreviewCardFlipped(false)}
                            className="backface-hidden rotate-y-180 absolute inset-0 w-full h-full bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl p-5 flex flex-col justify-between overflow-hidden cursor-pointer"
                          >
                            <div className="space-y-3">
                              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-400">
                                  Engineering Specifications
                                </span>
                                {serviceFormData.standard && (
                                  <span className="text-[10px] font-mono text-slate-400">{serviceFormData.standard}</span>
                                )}
                              </div>

                              <h4 className="text-sm font-black text-white">{serviceFormData.title}</h4>

                              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                                {serviceFormData.description || 'Full technical methodology and civil scope...'}
                              </p>

                              <div className="space-y-1.5 pt-1">
                                <div className="text-[10px] font-bold text-slate-400 uppercase">Key Technical Parameters:</div>
                                {serviceFormData.specifications
                                  .filter((s) => s.trim())
                                  .slice(0, 4)
                                  .map((spec, idx) => (
                                    <div key={idx} className="text-xs text-slate-200 flex items-start gap-1.5">
                                      <span className="text-sky-400">•</span>
                                      <span className="line-clamp-1">{spec}</span>
                                    </div>
                                  ))}
                              </div>
                            </div>

                            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-sky-400">
                              <span>Click to Flip to Front</span>
                              <RotateCw size={13} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. MODAL STICKY FOOTER */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 mt-6 shrink-0 bg-white">
                <div className="flex items-center gap-2">
                  {serviceModalTab !== 'general' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (serviceModalTab === 'preview') setServiceModalTab('media');
                        else if (serviceModalTab === 'media') setServiceModalTab('specs');
                        else if (serviceModalTab === 'specs') setServiceModalTab('general');
                      }}
                      className="btn btn-outline btn-sm text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft size={13} />
                      <span>Back</span>
                    </button>
                  )}
                  {serviceModalTab !== 'preview' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (serviceModalTab === 'general') setServiceModalTab('specs');
                        else if (serviceModalTab === 'specs') setServiceModalTab('media');
                        else if (serviceModalTab === 'media') setServiceModalTab('preview');
                      }}
                      className="btn btn-outline btn-sm text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span>Next Step</span>
                      <ArrowRight size={13} />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowServiceModal(false)}
                    className="btn btn-outline btn-sm text-xs cursor-pointer px-4"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-primary btn-sm text-xs flex items-center gap-2 font-bold cursor-pointer px-5 shadow-md shadow-sky-600/20"
                  >
                    <Save size={14} />
                    <span>{saving ? 'Saving Service...' : editingService ? 'Update Service' : 'Create Service'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

          </div>
  );
}
