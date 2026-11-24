import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  QrCode,
  Shield,
  ShieldCheck,
  Eye,
  CheckCircle,
  XCircle,
  ExternalLink,
  Search,
  Filter,
  Layers,
  Droplets,
  Paintbrush,
  Building2,
  Check,
  X,
  RotateCcw,
  Sparkles,
  MapPin,
  Calendar,
  User,
  FlaskConical,
  Award,
  Grid,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Copy,
  Image as ImageIcon,
  Upload,
  RotateCw,
  Save,
  Star,
  Clock,
  FileText,
  MessageCircle,
} from 'lucide-react';
import { fetchApi } from '../../utils/api';
import BeforeAfterSlider from '../../components/common/BeforeAfterSlider';
import {
  DEFAULT_DISCIPLINES,
  DEFAULT_SERVICES,
  DEFAULT_PROJECTS_HERO,
  renderDisciplineIcon,
  matchesDiscipline,
} from '../../utils/servicesData';
import {
  DEFAULT_PROJECTS,
  normalizeProject,
  matchesProjectDiscipline,
  matchesProjectService,
} from '../../utils/projectsData';

// High-visibility Custom Radio and Checkbox indicators for unmistakable visual clarity
const RadioCircle = ({ checked }) => (
  <span
    aria-hidden="true"
    className={`inline-flex items-center justify-center w-5 h-5 rounded-full border-2 shrink-0 transition-all ${
      checked
        ? 'border-sky-600 bg-white ring-2 ring-sky-200'
        : 'border-slate-400 bg-white hover:border-sky-400'
    }`}
  >
    {checked && <span className="w-2.5 h-2.5 rounded-full bg-sky-600 animate-in zoom-in-50" />}
  </span>
);

const CheckboxSquare = ({ checked }) => (
  <span
    aria-hidden="true"
    className={`inline-flex items-center justify-center w-5 h-5 rounded border-2 shrink-0 transition-all ${
      checked
        ? 'border-emerald-600 bg-emerald-600 text-white shadow-2xs'
        : 'border-slate-400 bg-white hover:border-emerald-400'
    }`}
  >
    {checked && <Check size={13} strokeWidth={3} className="text-white" />}
  </span>
);

// Curated Civil Engineering Project Photos for 1-Click Fast Selection
const CURATED_PROJECT_PHOTOS = [
  {
    label: 'Terrace Membrane & Screed',
    discipline: 'waterproofing',
    url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Basement Concrete Tanking',
    discipline: 'waterproofing',
    url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Bathroom Sunken Slab Wet Area',
    discipline: 'waterproofing',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Interior Wall Dampness Chemical DPC',
    discipline: 'waterproofing',
    url: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Exterior Monsoon Weather-Shielding',
    discipline: 'painting',
    url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Luxury Washable Interior Finishes',
    discipline: 'painting',
    url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Architectural Stone Wall Texture',
    discipline: 'painting',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Structural Crack Stitching Helical',
    discipline: 'repairs',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Concrete Spalling & Rebar Rust Repair',
    discipline: 'repairs',
    url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Moisture-Proof Gyproc False Ceiling',
    discipline: 'false-ceiling',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Acoustic Mineral Fiber Modular Grid',
    discipline: 'false-ceiling',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Fire-Resistant Drywall Partitioning',
    discipline: 'false-ceiling',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1000&q=80',
  },
];

// Quick Material Formulation Presets for 1-Click Inclusion
const FORMULATION_PRESETS = [
  'Dr. Fixit Fastflex Elastomeric Membrane',
  'Fosroc Nitoseal PU40 Polyurethane Sealant',
  'SikaTop Seal-107 Polymer Slurry',
  'Sika Injection-201 CE Hydrophobic PU Foam',
  'Xypex Concentrate Crystalline Tanking Slurry',
  'Asian Paints Apex Ultima Protek Duralife 100% Acrylic',
  'Fosroc Nitocote Wallguard Elastomeric Coating',
  'Helifix 316 Stainless Steel Helical Ties',
  'Fosroc Renderoc S2 High-Strength Structural Mortar',
  'Saint-Gobain Gyproc 12.5mm Moisture-Resistant Plasterboard',
  'Gypsteel Ultra 550 MPA Galvanized GI Framing',
  'Armstrong High-Density Mineral Fiber Acoustic Tiles (NRC 0.85)',
];

const LOCATION_PRESETS = [
  'Palm Meadows Villa, Medipally, Hyderabad',
  'Jubilee Hills, Hyderabad',
  'Banjara Hills, Hyderabad',
  'Hitec City / Madhapur, Hyderabad',
  'Gachibowli Financial District, Hyderabad',
  'Secunderabad / Marredpally, Hyderabad',
  'Manikonda / Puppalguda, Hyderabad',
  'Kondapur, Hyderabad',
];

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [disciplines, setDisciplines] = useState(DEFAULT_DISCIPLINES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  // Tab State: 'projects' = Case Studies Catalog | 'page-content' = Page Header & Copy CRUD
  const [activeTab, setActiveTab] = useState('projects');
  const [heroFormData, setHeroFormData] = useState(DEFAULT_PROJECTS_HERO);
  const [savingHero, setSavingHero] = useState(false);

  // Filters & Search State
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');
  const [selectedService, setSelectedService] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'published', 'draft'

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState('overview'); // 'overview', 'technical', 'media', 'preview'
  const [editingProject, setEditingProject] = useState(null);

  // QR Modal
  const [qrModalData, setQrModalData] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Initial Form Data
  const initialFormState = {
    title: '',
    disciplineId: 'waterproofing',
    disciplineName: 'Waterproofing Solutions',
    serviceCategory: 'Terrace and roof waterproofing',
    serviceTitle: 'Terrace & Roof Waterproofing',
    serviceId: '',
    location: 'Hyderabad, Telangana',
    clientReference: '',
    completionDate: new Date().toISOString().split('T')[0],
    problemDescription: '',
    inspectionFindings: '',
    workPerformed: '',
    materialsUsed: '',
    formulation: ['Dr. Fixit Fastflex Elastomeric Membrane', 'Fosroc Nitoseal PU40'],
    isPublished: true,
    showOnHome: false,
    isFeatured: false,
    customerConsentPublished: true,
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1000&q=80',
    coverImage: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1000&q=80',
    beforeMediaUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1000&q=80',
    beforeMediaCaption: 'Before: Deteriorated substrate showing moisture infiltration',
    afterMediaUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    afterMediaCaption: 'After: Restored monolithic engineering barrier',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [projectImageSourceTab, setProjectImageSourceTab] = useState('upload'); // 'upload' | 'url' | 'curated'
  const [uploadingImage, setUploadingImage] = useState(false);
  const coverFileInputRef = useRef(null);
  const beforeFileInputRef = useRef(null);
  const afterFileInputRef = useRef(null);

  const uploadProjectImage = async (file) => {
    if (!file) return null;
    const data = new FormData();
    data.append('file', file);
    try {
      const res = await fetchApi('/admin/projects/upload', {
        method: 'POST',
        body: data,
      });
      if (res?.data?.url) return res.data.url;
      if (res?.url) return res.url;
      throw new Error(res?.message || 'Project image upload failed.');
    } catch (err) {
      console.warn('Project image upload failed, trying the general media endpoint:', err);
      try {
        const fallback = await fetchApi('/admin/media/upload', {
          method: 'POST',
          body: data,
        });
        if (fallback?.data?.url) return fallback.data.url;
        if (fallback?.url) return fallback.url;
        throw new Error(fallback?.message || 'Project image upload failed.');
      } catch (fallbackErr) {
        console.error('Project image upload failed:', fallbackErr);
        throw fallbackErr;
      }
    }
  };

  const handleCoverFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const uploadedUrl = await uploadProjectImage(file);
      if (uploadedUrl) {
        setFormData((prev) => ({
          ...prev,
          image: uploadedUrl,
          coverImage: uploadedUrl,
          afterMediaUrl: prev.afterMediaUrl || uploadedUrl,
        }));
        showToast('Project cover photo uploaded from device!');
      }
    } catch (err) {
      console.error('Failed to upload project photo:', err);
      showToast('Could not upload photo. Please try again or use URL.');
    } finally {
      setUploadingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleBeforeFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const uploadedUrl = await uploadProjectImage(file);
      if (uploadedUrl) {
        setFormData((prev) => ({ ...prev, beforeMediaUrl: uploadedUrl }));
        showToast('Before photo uploaded from device!');
      }
    } catch (err) {
      console.error('Failed to upload before photo:', err);
      showToast('Could not upload photo.');
    } finally {
      setUploadingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleAfterFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const uploadedUrl = await uploadProjectImage(file);
      if (uploadedUrl) {
        setFormData((prev) => ({ ...prev, afterMediaUrl: uploadedUrl }));
        showToast('After photo uploaded from device!');
      }
    } catch (err) {
      console.error('Failed to upload after photo:', err);
      showToast('Could not upload photo.');
    } finally {
      setUploadingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  // Show Toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Commit projects to state
  const commitProjectsState = (newList) => {
    const normalized = newList.map((p, idx) => normalizeProject(p, idx));
    setProjects(normalized);
    window.dispatchEvent(new Event('sln_projects_updated'));
  };

  // Load Projects, Services, and Disciplines from database
  const loadData = async () => {
    setLoading(true);

    // 1. Load Services
    try {
      const servRes = await fetchApi('/admin/services');
      if (servRes.success && Array.isArray(servRes.data)) {
        setServices(servRes.data);
      } else {
        setServices([]);
      }
    } catch (e) {
      setServices([]);
    }

    // 2. Load Disciplines
    try {
      const discRes = await fetchApi('/admin/disciplines');
      if (discRes.success && Array.isArray(discRes.data) && discRes.data.length > 0) {
        setDisciplines(discRes.data);
      } else {
        setDisciplines(DEFAULT_DISCIPLINES);
      }
    } catch (e) {
      setDisciplines(DEFAULT_DISCIPLINES);
    }

    // 3. Load Projects
    try {
      const projRes = await fetchApi('/admin/projects?limit=100');
      if (projRes.success && Array.isArray(projRes.data)) {
        commitProjectsState(projRes.data);
      } else {
        commitProjectsState(DEFAULT_PROJECTS);
      }
    } catch (err) {
      commitProjectsState(DEFAULT_PROJECTS);
    }

    // 4. Load Projects Page Hero Content from Settings
    try {
      const settingsRes = await fetchApi('/settings');
      if (
        settingsRes.success &&
        settingsRes.data?.projectsPageContent &&
        Object.keys(settingsRes.data.projectsPageContent).length > 0
      ) {
        setHeroFormData((prev) => ({
          ...DEFAULT_PROJECTS_HERO,
          ...prev,
          ...settingsRes.data.projectsPageContent,
        }));
      }
    } catch (e) {
      console.warn('Could not load projectsPageContent from settings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter available services by selected discipline in the form
  const availableServicesForDiscipline = useMemo(() => {
    if (!formData.disciplineId || formData.disciplineId === 'all') {
      return services;
    }
    return services.filter((s) => matchesDiscipline(s, formData.disciplineId));
  }, [services, formData.disciplineId]);

  // Filtered Projects List based on selected discipline, service, search query, and status
  const filteredProjects = useMemo(() => {
    return projects.filter((proj) => {
      const matchesDisc =
        selectedDiscipline === 'all' || matchesProjectDiscipline(proj, selectedDiscipline);

      const matchesServ =
        selectedService === 'all' || matchesProjectService(proj, selectedService);

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && proj.isPublished) ||
        (statusFilter === 'draft' && !proj.isPublished);

      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        proj.title.toLowerCase().includes(q) ||
        proj.location.toLowerCase().includes(q) ||
        proj.clientReference.toLowerCase().includes(q) ||
        (proj.problemDescription || '').toLowerCase().includes(q) ||
        (proj.materialsUsed || '').toLowerCase().includes(q);

      return matchesDisc && matchesServ && matchesStatus && matchesQuery;
    });
  }, [projects, selectedDiscipline, selectedService, statusFilter, searchQuery]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingProject(null);
    setModalTab('overview');
    const firstDisc = disciplines[0] || DEFAULT_DISCIPLINES[0];
    const matchingServices = services.filter((s) => matchesDiscipline(s, firstDisc));
    const firstService = matchingServices[0] || services[0] || null;

    setFormData({
      ...initialFormState,
      disciplineId: firstDisc.slug || firstDisc.id,
      disciplineName: firstDisc.name,
      serviceCategory: firstService ? (firstService.category || firstService.title) : '',
      serviceTitle: firstService ? firstService.title : '',
      serviceId: firstService ? (firstService._id || firstService.id) : '',
    });
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (project) => {
    setEditingProject(project);
    setModalTab('overview');
    setFormData({
      title: project.title,
      disciplineId: project.disciplineId || 'waterproofing',
      disciplineName: project.disciplineName || 'Waterproofing Solutions',
      serviceCategory: project.serviceCategory,
      serviceTitle: project.serviceTitle || project.serviceCategory || project.title,
      serviceId: project.serviceId || '',
      location: project.location,
      clientReference: project.clientReference,
      completionDate: project.completionDate
        ? new Date(project.completionDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      problemDescription: project.problemDescription || '',
      inspectionFindings: project.inspectionFindings || '',
      workPerformed: project.workPerformed || '',
      materialsUsed: project.materialsUsed || '',
      formulation: Array.isArray(project.formulation) && project.formulation.length > 0
        ? [...project.formulation]
        : typeof project.materialsUsed === 'string'
        ? project.materialsUsed.split(/[,•\n]+/).map((s) => s.trim()).filter(Boolean)
        : [],
      isPublished: project.isPublished !== undefined ? project.isPublished : true,
      showOnHome: Boolean(project.isPublished !== false && project.showOnHome),
      isFeatured: Boolean(project.isFeatured),
      customerConsentPublished: project.customerConsentPublished !== undefined ? project.customerConsentPublished : true,
      image: project.image || project.coverImage || '',
      coverImage: project.coverImage || project.image || '',
      beforeMediaUrl: project.beforeMedia?.[0]?.url || project.image || '',
      beforeMediaCaption: project.beforeMedia?.[0]?.caption || 'Before Restoration Treatment',
      afterMediaUrl: project.afterMedia?.[0]?.url || project.image || '',
      afterMediaCaption: project.afterMedia?.[0]?.caption || 'After Engineering Restoration',
    });
    setShowModal(true);
  };

  // Submit Project (Create or Edit)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a project title.');
      return;
    }

    setSaving(true);
    const targetDisc = disciplines.find(
      (d) => (d.slug || d.id) === formData.disciplineId || d.name === formData.disciplineName
    );

    const formulationClean = formData.formulation.filter((f) => f && f.trim().length > 0);
    const finalMaterialsUsed = formData.materialsUsed || formulationClean.join(', ');
    const finalImage = formData.image || formData.coverImage || formData.afterMediaUrl || formData.beforeMediaUrl;

    const isLive = Boolean(formData.isPublished);
    const showOnHome = isLive ? Boolean(formData.showOnHome) : false;
    const isFeatured = isLive ? Boolean(formData.isFeatured) : false;

    const payload = {
      ...formData,
      disciplineId: targetDisc ? (targetDisc.slug || targetDisc.id) : formData.disciplineId,
      disciplineName: targetDisc ? targetDisc.name : formData.disciplineName,
      materialsUsed: finalMaterialsUsed,
      formulation: formulationClean,
      image: finalImage,
      coverImage: finalImage,
      isPublished: isLive,
      showOnHome: showOnHome,
      isFeatured: isFeatured,
      featuredUpdatedAt: isFeatured ? (editingProject?.featuredUpdatedAt || Date.now()) : 0,
      beforeMedia: formData.beforeMediaUrl
        ? [{ url: formData.beforeMediaUrl, caption: formData.beforeMediaCaption, type: 'image' }]
        : [],
      afterMedia: formData.afterMediaUrl
        ? [{ url: formData.afterMediaUrl, caption: formData.afterMediaCaption, type: 'image' }]
        : [],
    };

    try {
      if (editingProject) {
        const targetId = editingProject._id || editingProject.id;
        try {
          await fetchApi(`/admin/projects/${targetId}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
          });
        } catch (apiErr) {
          console.warn('Backend update failed, persisting locally:', apiErr.message);
        }

        const targetDiscId = payload.disciplineId;
        const updatedList = projects.map((p) => {
          const pId = p._id || p.id;
          if (pId === targetId) return { ...p, ...payload };
          // Enforce 1 radio showcase per discipline pillar
          if (payload.showOnHome && matchesProjectDiscipline(p, targetDiscId)) {
            return { ...p, showOnHome: false };
          }
          // Enforce 1 featured showcase per discipline pillar
          if (payload.isFeatured && matchesProjectDiscipline(p, targetDiscId)) {
            return { ...p, isFeatured: false };
          }
          return p;
        });
        commitProjectsState(updatedList);
        showToast(`Project "${formData.title}" updated successfully!`);
      } else {
        let createdProject = null;
        try {
          const res = await fetchApi('/admin/projects', {
            method: 'POST',
            body: JSON.stringify(payload),
          });
          if (res.success && res.data) createdProject = res.data;
        } catch (apiErr) {
          console.warn('Backend create failed, saving locally:', apiErr.message);
        }

        const newEntry = createdProject || {
          ...payload,
          id: String(Date.now()).slice(-4),
          _id: `custom-proj-${Date.now()}`,
          date: new Date(payload.completionDate).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          }),
        };

        let updatedList = [newEntry, ...projects];
        if (payload.showOnHome) {
          const targetDiscId = payload.disciplineId;
          updatedList = updatedList.map((p) =>
            (p._id === newEntry._id || p.id === newEntry.id)
              ? p
              : matchesProjectDiscipline(p, targetDiscId)
              ? { ...p, showOnHome: false }
              : p
          );
        }
        if (payload.isFeatured) {
          const targetDiscId = payload.disciplineId;
          updatedList = updatedList.map((p) =>
            (p._id === newEntry._id || p.id === newEntry.id)
              ? p
              : matchesProjectDiscipline(p, targetDiscId)
              ? { ...p, isFeatured: false }
              : p
          );
        }
        commitProjectsState(updatedList);
        showToast(`Project "${formData.title}" added to portfolio!`);
      }

      setShowModal(false);
    } catch (err) {
      alert(err.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  // Select 1 Project as Homepage Before & After Showcase for its Discipline Pillar (Radio logic)
  const handleSelectRadioShowcase = async (project) => {
    const targetId = project._id || project.id;
    const targetDiscipline = project.disciplineId || 'waterproofing';
    const discName = project.disciplineName || 'Discipline Pillar';

    const updatedList = projects.map((p) => {
      const pId = p._id || p.id;
      if (pId === targetId) {
        return { ...p, showOnHome: true, isPublished: true };
      }
      if (matchesProjectDiscipline(p, targetDiscipline)) {
        return { ...p, showOnHome: false };
      }
      return p;
    });

    commitProjectsState(updatedList);

    try {
      await fetchApi(`/admin/projects/${targetId}`, {
        method: 'PUT',
        body: JSON.stringify({ showOnHome: true, isPublished: true, disciplineId: targetDiscipline }),
      });
      showToast(`"${project.title}" set as 1 Homepage Showcase for "${discName}". Previous showcase was replaced.`);
    } catch (e) {}
  };

  // Toggle Published/Draft status
  const handleTogglePublished = async (project) => {
    const updatedStatus = !project.isPublished;
    const targetId = project._id || project.id;

    const updatedList = projects.map((p) =>
      p._id === targetId || p.id === targetId
        ? {
            ...p,
            isPublished: updatedStatus,
            showOnHome: updatedStatus ? p.showOnHome : false,
            isFeatured: updatedStatus ? p.isFeatured : false,
          }
        : p
    );
    commitProjectsState(updatedList);

    try {
      await fetchApi(`/admin/projects/${targetId}`, {
        method: 'PUT',
        body: JSON.stringify({
          isPublished: updatedStatus,
          ...(updatedStatus ? {} : { showOnHome: false, isFeatured: false }),
        }),
      });
      showToast(`Project "${project.title}" is now ${updatedStatus ? 'Live on Website' : 'Hidden from Website (Draft)'}`);
    } catch (e) {}
  };

  // Toggle Featured status (1 Featured Project per Discipline Pillar, max 3 on homepage)
  const handleToggleFeatured = async (project) => {
    const updatedFeatured = !project.isFeatured;
    const targetId = project._id || project.id;
    const targetDiscipline = project.disciplineId || 'waterproofing';
    const discName = project.disciplineName || 'Discipline Pillar';
    const timestamp = updatedFeatured ? Date.now() : 0;

    const updatedList = projects.map((p) => {
      const pId = p._id || p.id;
      if (pId === targetId) {
        return {
          ...p,
          isFeatured: updatedFeatured,
          featuredUpdatedAt: timestamp,
          ...(updatedFeatured ? { isPublished: true } : {}),
        };
      }
      // If starring this project, remove isFeatured from any other project in the same discipline pillar
      if (updatedFeatured && matchesProjectDiscipline(p, targetDiscipline)) {
        return { ...p, isFeatured: false };
      }
      return p;
    });

    commitProjectsState(updatedList);

    try {
      await fetchApi(`/admin/projects/${targetId}`, {
        method: 'PUT',
        body: JSON.stringify({
          isFeatured: updatedFeatured,
          featuredUpdatedAt: timestamp,
          disciplineId: targetDiscipline,
          ...(updatedFeatured ? { isPublished: true } : {}),
        }),
      });
      showToast(
        updatedFeatured
          ? `"${project.title}" set as Featured Card for "${discName}". Any previous featured project for this pillar was replaced.`
          : `"${project.title}" unmarked from featured.`
      );
    } catch (e) {}
  };

  // Delete Project
  const handleDelete = async (project) => {
    const targetId = project._id || project.id;
    if (!window.confirm(`Are you sure you want to delete project: "${project.title}"?`)) return;

    try {
      await fetchApi(`/admin/projects/${targetId}`, { method: 'DELETE' });
      const updatedList = projects.filter((p) => p._id !== targetId && p.id !== targetId);
      commitProjectsState(updatedList);
      showToast(`Project "${project.title}" deleted.`);
    } catch (err) {
      console.error('Delete project error:', err);
      showToast(`Failed to delete project: ${err.message}`, 'error');
      alert(`Failed to delete project from server: ${err.message}`);
    }
  };

  // Reset to default verified projects
  const handleResetDefaults = async () => {
    if (!window.confirm('Reset portfolio to the 12 standard SLN verified engineering case studies?')) return;
    setResetting(true);
    try {
      const res = await fetchApi('/admin/projects/init-defaults', { method: 'POST' });
      if (res.success) {
        showToast('Portfolio reset to 12 verified engineering case studies!');
        loadProjects();
        window.dispatchEvent(new CustomEvent('sln_projects_updated'));
      } else {
        commitProjectsState(DEFAULT_PROJECTS);
        showToast('Portfolio reset to 12 verified engineering case studies!');
      }
    } catch (e) {
      commitProjectsState(DEFAULT_PROJECTS);
      showToast('Portfolio reset to 12 verified engineering case studies!');
    } finally {
      setResetting(false);
    }
  };

  // Generate QR Code for Review
  const handleGenerateQR = async (project) => {
    const targetId = project._id || project.id;
    try {
      const res = await fetchApi('/admin/review-links', {
        method: 'POST',
        body: JSON.stringify({ projectId: targetId }),
      });
      if (res.success && res.data) {
        setQrModalData({
          title: project.title,
          token: res.data.token,
          reviewUrl: res.data.reviewUrl || `http://localhost:5173/scan-review/${res.data.token}`,
          qrCodeDataUrl: res.data.qrCodeDataUrl,
        });
      } else {
        const dummyToken = `qr-${targetId.slice(-6)}`;
        setQrModalData({
          title: project.title,
          token: dummyToken,
          reviewUrl: `http://localhost:5173/scan-review/${dummyToken}`,
          qrCodeDataUrl: '',
        });
      }
    } catch (err) {
      const dummyToken = `qr-${targetId.slice(-6)}`;
      setQrModalData({
        title: project.title,
        token: dummyToken,
        reviewUrl: `http://localhost:5173/scan-review/${dummyToken}`,
        qrCodeDataUrl: '',
      });
    }
  };

  // Add formulation suggestion
  const handleAddFormulationSuggestion = (item) => {
    if (formData.formulation.includes(item)) return;
    setFormData({
      ...formData,
      formulation: [...formData.formulation, item],
      materialsUsed: formData.materialsUsed ? `${formData.materialsUsed}, ${item}` : item,
    });
  };

  // =========================================================================
  // CRUD OPERATIONS FOR PROJECTS PAGE HEADER & COPY (TAB 2)
  // =========================================================================
  const handleSaveHeroContent = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSavingHero(true);
    try {
      window.dispatchEvent(new Event('sln_projects_hero_updated'));

      // Persist to MongoDB CompanySettings
      const res = await fetchApi('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({ projectsPageContent: heroFormData }),
      });

      if (res.success) {
        showToast('Projects page header & copy saved and published successfully to database!');
      } else {
        showToast(res.message || 'Failed to save to database.', 'error');
      }
    } catch (err) {
      console.error('Error saving projects page content:', err);
      showToast(err.message || 'Failed to save to database.', 'error');
    } finally {
      setSavingHero(false);
    }
  };

  const handleResetHeroContent = async () => {
    if (!window.confirm('Reset Projects page header and copy to default text?')) return;
    setSavingHero(true);
    try {
      setHeroFormData(DEFAULT_PROJECTS_HERO);
      window.dispatchEvent(new Event('sln_projects_hero_updated'));

      await fetchApi('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({ projectsPageContent: DEFAULT_PROJECTS_HERO }),
      });
      showToast('Projects page header reset to defaults in database.');
    } catch (err) {
      showToast('Reset failed.', 'error');
    } finally {
      setSavingHero(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl border border-sky-400/40 flex items-center gap-2.5 animate-bounce">
          <CheckCircle size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider bg-sky-100 text-sky-800">
              {activeTab === 'projects' ? 'Verified Case Studies' : 'Page Header & Copy'}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-bold text-slate-500">
              {activeTab === 'projects' ? 'Service-Linked Portfolio & Homepage Showcase' : 'Projects Page Hero & Catalog Copy'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            {activeTab === 'projects' ? 'Projects & Before/After Showcase' : 'Projects Page Header & Copy'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            {activeTab === 'projects'
              ? 'Create, categorize, and maintain completed engineering projects. Starring a project designates it directly as the interactive Before & After showcase on the homepage.'
              : 'Customize the hero eyebrow badge, main title, description, and catalog section titles for the public Projects & Portfolio page.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/projects"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm text-xs flex items-center gap-1.5 cursor-pointer text-slate-700 hover:text-sky-700"
          >
            <ExternalLink size={14} />
            <span>Live Public Portfolio</span>
          </a>

          {activeTab === 'projects' ? (
            <>
              <button
                type="button"
                onClick={handleResetDefaults}
                disabled={resetting}
                className="btn btn-outline btn-sm text-xs flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900"
                title="Reset portfolio to 12 default civil case studies"
              >
                <RotateCcw size={14} className={resetting ? 'animate-spin' : ''} />
                <span>Reset 12 Cases</span>
              </button>

              <button
                type="button"
                onClick={handleOpenCreate}
                className="btn btn-primary btn-sm text-xs flex items-center gap-1.5 shadow-sm cursor-pointer font-bold"
              >
                <Plus size={15} />
                <span>Add Completed Project</span>
              </button>
            </>
          ) : (
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

      {/* Main Mode Toggle: [Case Studies Catalog] vs [Page Header & Copy] */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('projects')}
          className={`py-2.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'projects'
              ? 'border-sky-600 text-sky-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase size={14} />
          <span>Case Studies Catalog ({projects.length})</span>
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
          <Sparkles size={14} />
          <span>Page Header &amp; Copy</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </button>
      </div>

      {activeTab === 'projects' && (
        <div className="space-y-6">

      {/* Homepage Discipline Pillars Showcase Status & Guide */}
      <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-emerald-50 p-5 rounded-2xl border border-sky-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
              Homepage Before &amp; After Transformation Showcases (1 Project per Discipline Pillar)
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Each discipline pillar displays exactly one project on the homepage Before &amp; After restoration slider.
            </p>
          </div>
          {/* Legend for the 3 controls */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700">
            <span className="font-bold text-sky-700 flex items-center gap-1">🔘 Radio Button:</span>
            <span>1 Slider Showcase per Pillar</span>
            <span className="text-slate-300">|</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">☑ Checkbox:</span>
            <span>Live on Website</span>
            <span className="text-slate-300">|</span>
            <span className="font-bold text-amber-700 flex items-center gap-1">⭐ Star:</span>
            <span>1 Featured Card per Pillar (Max 3 on Home)</span>
          </div>
        </div>

        {/* 4 Pillars Status Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {disciplines.map((pillar) => {
            const activeProj = projects.find(
              (p) => matchesProjectDiscipline(p, pillar) && p.showOnHome && p.isPublished !== false
            );
            const featuredProj = projects.find(
              (p) => matchesProjectDiscipline(p, pillar) && p.isFeatured && p.isPublished !== false
            );
            return (
              <div
                key={pillar.id || pillar.slug}
                className={`p-3 rounded-xl border transition-all ${
                  activeProj || featuredProj
                    ? 'bg-white border-sky-300 shadow-2xs'
                    : 'bg-white/60 border-dashed border-slate-300 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 pb-1.5 border-b border-slate-100">
                  <span className="truncate">{pillar.name}</span>
                  {featuredProj && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-extrabold flex items-center gap-0.5 shrink-0">
                      <Star size={9} className="fill-amber-500 text-amber-600" /> Starred
                    </span>
                  )}
                </div>

                {/* 🔘 Slider Showcase */}
                <div className="mt-2 text-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-sky-700 mb-0.5 flex items-center gap-1">
                    <span>🔘 Slider Showcase:</span>
                  </div>
                  {activeProj ? (
                    <div className="flex items-center gap-1.5 text-sky-900 font-semibold text-[11px] truncate" title={activeProj.title}>
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                      <span className="truncate">{activeProj.title}</span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400 font-medium">None selected</div>
                  )}
                </div>

                {/* ⭐ Featured Case Study Card */}
                <div className="mt-2 text-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-0.5 flex items-center gap-1">
                    <span>⭐ Featured Card (Home 3-Grid):</span>
                  </div>
                  {featuredProj ? (
                    <div className="flex items-center gap-1.5 text-amber-900 font-semibold text-[11px] truncate" title={featuredProj.title}>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span className="truncate">{featuredProj.title}</span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400 font-medium">None starred</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. STATS BAR: DISCIPLINE BREAKDOWN */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {disciplines.map((disc) => {
          const count = projects.filter((p) => matchesProjectDiscipline(p, disc)).length;
          const publishedCount = projects.filter(
            (p) => matchesProjectDiscipline(p, disc) && p.isPublished
          ).length;
          const isSelected = selectedDiscipline === (disc.slug || disc.id);

          return (
            <div
              key={disc.id || disc.slug}
              onClick={() => {
                setSelectedDiscipline(isSelected ? 'all' : (disc.slug || disc.id));
                setSelectedService('all');
              }}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
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
              <div className="text-[10px] text-slate-400 mt-1 truncate">{disc.shortCategory || disc.name}</div>
            </div>
          );
        })}
      </div>

      {/* 3. SEARCH & DISCIPLINE / SERVICE FILTER BAR */}
      <div className="card bg-white border-slate-200 p-4 space-y-3 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Discipline Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => {
                setSelectedDiscipline('all');
                setSelectedService('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedDiscipline === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Grid size={13} />
              <span>All Disciplines</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white">
                {projects.length}
              </span>
            </button>

            {disciplines.map((disc) => {
              const isSelected = selectedDiscipline === (disc.slug || disc.id);
              const count = projects.filter((p) => matchesProjectDiscipline(p, disc)).length;

              return (
                <button
                  key={disc.id || disc.slug}
                  type="button"
                  onClick={() => {
                    setSelectedDiscipline(disc.slug || disc.id);
                    setSelectedService('all');
                  }}
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
              placeholder="Search title, client, location, material..."
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
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Secondary Service Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Filter size={11} /> Filter By Service:
          </span>

          <button
            type="button"
            onClick={() => setSelectedService('all')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              selectedService === 'all'
                ? 'bg-sky-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Services
          </button>

          {(selectedDiscipline === 'all'
            ? services
            : services.filter((s) => matchesDiscipline(s, selectedDiscipline))
          ).map((s) => {
            const isMatch = selectedService === s.title || selectedService === s.category;
            return (
              <button
                key={s.id || s._id}
                type="button"
                onClick={() => setSelectedService(isMatch ? 'all' : (s.category || s.title))}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                  isMatch
                    ? 'bg-sky-600 text-white font-bold shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s.title}
              </button>
            );
          })}

          {/* Status Quick Switch */}
          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                statusFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              All Status
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('published')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                statusFilter === 'published' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Published Only
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('draft')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                statusFilter === 'draft' ? 'bg-amber-600 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Drafts Only
            </button>
          </div>
        </div>
      </div>

      {/* 4. PROJECTS LIST TABLE */}
      <div className="card bg-white border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Project Title & Location</th>
                <th className="py-3 px-4">Discipline Pillar</th>
                <th className="py-3 px-3 text-center">Homepage Showcase (Radio)</th>
                <th className="py-3 px-4">Linked Service</th>
                <th className="py-3 px-4">Client Reference</th>
                <th className="py-3 px-3 text-center">Live on Web</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-14 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
                      <span>Loading project records...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-14 text-center text-slate-400">
                    <Briefcase size={28} className="mx-auto text-slate-300 mb-2" />
                    <div className="font-bold text-slate-600">No project records match your filter.</div>
                    <div className="text-[11px] text-slate-400 mt-1">Try clearing filters or search query.</div>
                  </td>
                </tr>
              ) : (
                filteredProjects.map((proj) => {
                  const targetDisc = disciplines.find((d) => matchesProjectDiscipline(proj, d));
                  const accentColor = targetDisc?.accentColor || '#0284c7';

                  return (
                    <tr key={proj._id || proj.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Project Title & Location */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="flex items-start gap-3">
                          <img
                            src={proj.image || proj.coverImage}
                            alt={proj.title}
                            className="w-11 h-11 rounded-lg object-cover shrink-0 border border-slate-200 shadow-2xs mt-0.5"
                            onError={(e) => {
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=200&q=80';
                            }}
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 text-sm hover:text-sky-700 flex items-center gap-1.5 leading-snug">
                              <span className="line-clamp-1">{proj.title}</span>
                              {proj.isFeatured && (
                                <Star size={12} className="text-amber-500 fill-amber-500 shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 text-[11px] mt-0.5">
                              <span className="flex items-center gap-1 truncate">
                                <MapPin size={11} className="text-slate-400 shrink-0" />
                                {proj.location}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Discipline Pillar */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          style={{ color: accentColor }}
                          className="px-2.5 py-1 rounded-md text-[10.5px] font-extrabold bg-slate-100 inline-flex items-center gap-1.5 shadow-2xs"
                        >
                          <span
                            style={{ backgroundColor: accentColor }}
                            className="w-1.5 h-1.5 rounded-full"
                          />
                          <span>{proj.disciplineName}</span>
                        </span>
                      </td>

                      {/* Homepage Showcase Radio Button (1 per Discipline Pillar) */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <label
                          onClick={() => handleSelectRadioShowcase(proj)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border cursor-pointer transition-all ${
                            proj.isPublished && proj.showOnHome
                              ? 'bg-sky-50 text-sky-950 border-sky-400 font-bold shadow-2xs ring-1 ring-sky-300'
                              : 'bg-white text-slate-500 border-slate-200 hover:border-sky-300 hover:bg-slate-50'
                          }`}
                          title={`Click radio to feature "${proj.title}" on homepage Before & After slider for ${proj.disciplineName}`}
                        >
                          <input
                            type="radio"
                            name={`proj_table_home_showcase_${proj.disciplineId || 'waterproofing'}`}
                            checked={Boolean(proj.isPublished && proj.showOnHome)}
                            onChange={() => handleSelectRadioShowcase(proj)}
                            className="sr-only"
                          />
                          <RadioCircle checked={Boolean(proj.isPublished && proj.showOnHome)} />
                          <span className="text-[11px]">
                            {proj.isPublished && proj.showOnHome ? 'On Home' : 'Show on Home'}
                          </span>
                        </label>
                      </td>

                      {/* Linked Service */}
                      <td className="py-3 px-4 max-w-[200px]">
                        <span className="badge badge-blue text-[11px] truncate block max-w-full">
                          {proj.serviceTitle || proj.serviceCategory}
                        </span>
                      </td>

                      {/* Client Reference */}
                      <td className="py-3 px-4 text-slate-600 font-medium text-[11px] max-w-[160px] truncate">
                        {proj.clientReference || '—'}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePublished(proj)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                            proj.isPublished
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${proj.isPublished ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                          <span>{proj.isPublished ? 'Live' : 'Draft'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleGenerateQR(proj)}
                            className="p-1.5 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors"
                            title="Generate QR review link"
                          >
                            <QrCode size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(proj)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              proj.isFeatured
                                ? 'border-amber-400 bg-amber-50 text-amber-600 ring-1 ring-amber-300'
                                : 'border-slate-200 text-slate-400 hover:text-amber-500 hover:bg-amber-50'
                            }`}
                            title={
                              proj.isFeatured
                                ? `Featured Case Study Card for ${proj.disciplineName} (Click to unstar)`
                                : `Star as 1 Featured Card for ${proj.disciplineName} (Replaces previous featured project in this pillar; max 3 shown on homepage)`
                            }
                          >
                            <Star size={13} className={proj.isFeatured ? 'fill-amber-500 text-amber-500' : ''} />
                          </button>

                          <a
                            href={`/projects/${proj.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-sky-700 hover:bg-sky-50 transition-colors"
                            title="View public case study"
                          >
                            <Eye size={13} />
                          </a>

                          <button
                            type="button"
                            onClick={() => handleOpenEdit(proj)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-sky-700 hover:bg-sky-50 transition-colors"
                            title="Edit project record"
                          >
                            <Edit2 size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(proj)}
                            className="p-1.5 rounded-lg border border-slate-200 text-rose-500 hover:bg-rose-50 hover:border-rose-300 transition-colors"
                            title="Delete project"
                          >
                            <Trash2 size={13} />
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
      {/* TAB 2: PROJECTS PAGE HEADER & COPY (COMPLETE CRUD CONTROLS)           */}
      {/* ===================================================================== */}
      {activeTab === 'page-content' && (
        <div className="space-y-6">
          {/* Banner Bar with status and actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-sky-50 border border-sky-200 text-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-md shadow-sky-600/20 shrink-0">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-sky-950">
                  Live Public Header &amp; Copy Editor for /projects
                </h3>
                <p className="text-xs text-sky-800/80 mt-0.5">
                  Update the hero title, engineering lineage badge, technical summary, and catalog headings. Changes publish immediately.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/projects"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-sm text-xs flex items-center gap-1.5 cursor-pointer bg-white text-slate-700 hover:bg-slate-50"
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
                <span>Live Hero Preview (As seen on /projects)</span>
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
                  <span>{heroFormData.badge || 'Three Generations Lineage • Field Engineering Excellence'}</span>
                </div>

                {/* Headline */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight whitespace-pre-line">
                  {heroFormData.title || 'Proven Project Portfolio &\nTechnical Case Studies.'}
                </h1>

                {/* Description */}
                <p className="text-xs sm:text-[13px] text-sky-200/90 leading-relaxed max-w-xl">
                  {heroFormData.description ||
                    'Explore verified case studies of luxury villas, IT parks, commercial complexes, and heritage estates executed by SLN Engineers across Hyderabad and Telangana.'}
                </p>
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
                  <p className="text-xs text-slate-500 mt-0.5">Top banner above the fold on the Projects portfolio page</p>
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
                    placeholder="e.g. Three Generations Lineage • Field Engineering Excellence"
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
                    placeholder="Proven Project Portfolio &amp;&#10;Technical Case Studies."
                    value={heroFormData.title || ''}
                    onChange={(e) => setHeroFormData({ ...heroFormData, title: e.target.value })}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">You can press Enter for a line break to split lines naturally on desktop screens.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Engineering Subtitle / Overview Description
                  </label>
                  <textarea
                    rows={3}
                    className="form-input text-xs w-full py-2.5 px-3 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 leading-relaxed"
                    placeholder="Explore verified case studies of luxury villas..."
                    value={heroFormData.description || ''}
                    onChange={(e) => setHeroFormData({ ...heroFormData, description: e.target.value })}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Primary descriptive paragraph summarizing completed field engineering projects.</p>
                </div>
              </div>
            </div>

            {/* Section 2: Catalog Section Headings */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-900 tracking-tight">2. Case Studies Section Headings</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Title and subtitle above the 4-discipline filter buttons and project cards grid</p>
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
                    placeholder="e.g. Case Studies by Core Discipline"
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
                    placeholder="Filter verified project accounts across our 4 civil engineering pillars."
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
                  href="/projects"
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
      {/* 5. ADD / EDIT PROJECT RECORD MODAL */}
      {/* ===================================================================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 text-white flex items-center justify-center shadow-md">
                  <Briefcase size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30">
                      {editingProject ? 'Edit Case Study' : 'New Completed Project'}
                    </span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-300 font-medium">
                      {formData.disciplineName}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white tracking-tight truncate max-w-md mt-0.5">
                    {formData.title || 'Untitled Project Record'}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer select-none">
                  <span>Live on Website:</span>
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal Tabs Navigation */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 flex items-center gap-2 shrink-0 overflow-x-auto scrollbar-none">
              {[
                { id: 'overview', label: '1. Overview & Service Link', icon: Grid },
                { id: 'technical', label: '2. Diagnostics & Materials', icon: FlaskConical },
                { id: 'media', label: '3. Before & After Media', icon: ImageIcon },
                { id: 'preview', label: '4. Live Card Preview', icon: Eye },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = modalTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setModalTab(tab.id)}
                    className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'border-sky-600 text-sky-700 bg-white shadow-2xs'
                        : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              {/* =================================================================== */}
              {/* TAB 1: OVERVIEW & DISCIPLINE / SERVICE LINK */}
              {/* =================================================================== */}
              {modalTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* Title */}
                  <div>
                    <label className="form-label text-xs font-bold text-slate-800">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Penthouse Roof & Terrace Garden Waterproofing at Palm Meadows"
                      className="form-input text-xs font-medium py-2 rounded-xl"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  {/* Discipline Pillar Selector Cards */}
                  <div>
                    <label className="form-label text-xs font-bold text-slate-800">
                      Primary Discipline Pillar *
                    </label>
                    <p className="text-[11px] text-slate-500 mb-2">
                      Choose which of the 4 core civil practices this project belongs to.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      {disciplines.map((disc) => {
                        const isChosen =
                          formData.disciplineId === (disc.slug || disc.id) ||
                          formData.disciplineName === disc.name;

                        return (
                          <div
                            key={disc.id || disc.slug}
                            type="button"
                            onClick={() => {
                              const matchingServices = services.filter((s) => matchesDiscipline(s, disc));
                              const firstSrv = matchingServices[0] || null;
                              setFormData({
                                ...formData,
                                disciplineId: disc.slug || disc.id,
                                disciplineName: disc.name,
                                serviceCategory: firstSrv ? (firstSrv.category || firstSrv.title) : '',
                                serviceTitle: firstSrv ? firstSrv.title : '',
                                serviceId: firstSrv ? (firstSrv._id || firstSrv.id) : '',
                              });
                            }}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                              isChosen
                                ? 'bg-sky-50/80 border-sky-500 shadow-sm ring-2 ring-sky-400/30'
                                : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div
                                style={{ backgroundColor: disc.accentColor }}
                                className="w-7 h-7 rounded-lg text-white flex items-center justify-center shrink-0 shadow-2xs"
                              >
                                {renderDisciplineIcon(disc.icon, 14)}
                              </div>
                              {isChosen && (
                                <div className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center">
                                  <Check size={12} />
                                </div>
                              )}
                            </div>
                            <div className="font-bold text-xs text-slate-900 mt-2 line-clamp-1">
                              {disc.name}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                              {disc.shortCategory || disc.tag}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Specific Service Dropdown & Client Reference */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label text-xs font-bold text-slate-800">
                        Linked Service Solution *
                      </label>
                      <select
                        className="form-select text-xs py-2 rounded-xl"
                        value={formData.serviceTitle || formData.serviceCategory}
                        onChange={(e) => {
                          const chosen = availableServicesForDiscipline.find(
                            (s) => s.title === e.target.value || s.category === e.target.value
                          );
                          setFormData({
                            ...formData,
                            serviceCategory: chosen ? (chosen.category || chosen.title) : e.target.value,
                            serviceTitle: chosen ? chosen.title : e.target.value,
                            serviceId: chosen ? (chosen._id || chosen.id) : '',
                          });
                        }}
                      >
                        {availableServicesForDiscipline.map((s) => (
                          <option key={s.id || s._id} value={s.title}>
                            {s.title} ({s.disciplineName || s.disciplineId})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="form-label text-xs font-bold text-slate-800">
                        Client Reference / Property Designation *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Luxury Villa #42 (Mr. Ramesh Sundaram)"
                        className="form-input text-xs py-2 rounded-xl"
                        value={formData.clientReference}
                        onChange={(e) => setFormData({ ...formData, clientReference: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="form-label text-xs font-bold text-slate-800">
                      Project Location *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Palm Meadows Villa, Medipally, Hyderabad"
                      className="form-input text-xs py-2 rounded-xl"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                    {/* Location quick presets */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {LOCATION_PRESETS.slice(0, 4).map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => setFormData({ ...formData, location: loc })}
                          className="text-[10px] bg-slate-100 hover:bg-sky-100 text-slate-600 hover:text-sky-800 px-2 py-0.5 rounded transition-colors"
                        >
                          + {loc.split(',')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Control 1: 🔘 Radio Button for Homepage Before & After Showcase */}
                  <div className="p-4 rounded-xl border-2 border-sky-300 bg-sky-50/90 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-sky-950 flex items-center gap-1.5">
                        🔘 Homepage Transformation Showcase (Radio Button)
                      </span>
                      <span className="text-[11px] font-semibold text-sky-800 bg-sky-200/80 px-2 py-0.5 rounded-full self-start sm:self-auto">
                        1 per {formData.disciplineName || 'Discipline Pillar'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label
                        className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.showOnHome === true && formData.isPublished
                            ? 'bg-white border-sky-500 shadow-sm ring-2 ring-sky-300'
                            : 'bg-white/60 border-slate-200 hover:bg-white hover:border-sky-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="proj_form_home_showcase"
                          checked={Boolean(formData.showOnHome === true && formData.isPublished)}
                          onChange={() => setFormData({ ...formData, showOnHome: true, isPublished: true })}
                          className="sr-only"
                        />
                        <RadioCircle checked={Boolean(formData.showOnHome === true && formData.isPublished)} />
                        <div className="text-xs">
                          <span className="font-extrabold text-sky-950 block">Show on Homepage Slider</span>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            Selected as the 1 Before &amp; After showcase for {formData.disciplineName || 'this pillar'}. Auto-marks Live.
                          </p>
                        </div>
                      </label>

                      <label
                        className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                          !formData.showOnHome || !formData.isPublished
                            ? 'bg-white border-slate-400 shadow-sm ring-2 ring-slate-200'
                            : 'bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="proj_form_home_showcase"
                          checked={Boolean(!formData.showOnHome || !formData.isPublished)}
                          onChange={() => setFormData({ ...formData, showOnHome: false })}
                          className="sr-only"
                        />
                        <RadioCircle checked={Boolean(!formData.showOnHome || !formData.isPublished)} />
                        <div className="text-xs">
                          <span className="font-bold text-slate-700 block">Do Not Show on Homepage Slider</span>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            Keep in portfolio only without displaying on homepage Before &amp; After slider.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Control 2: ☑ Checkbox for Live on Website (Published & Active) */}
                  <label className="flex items-start gap-3 p-3.5 rounded-xl border-2 border-emerald-300 bg-emerald-50/70 cursor-pointer hover:bg-emerald-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.isPublished)}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setFormData({
                          ...formData,
                          isPublished: isChecked,
                          ...(isChecked ? {} : { showOnHome: false, isFeatured: false }),
                        });
                      }}
                      className="sr-only"
                    />
                    <CheckboxSquare checked={Boolean(formData.isPublished)} />
                    <div className="text-xs">
                      <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                        <CheckCircle size={13} className="text-emerald-700" />
                        Live on Website (Published &amp; Active)
                      </span>
                      <p className="text-[11px] text-emerald-800/80 mt-0.5">
                        Check this box so this project is published and active to view on the website.
                      </p>
                    </div>
                  </label>

                  {/* Control 3: ⭐ Star for Featured Showcase Card (1 per Pillar, Max 3 on Homepage) */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl border-2 border-amber-300 bg-amber-50/70 gap-3">
                    <div className="text-xs min-w-0">
                      <span className="font-bold text-amber-950 flex items-center gap-1.5">
                        <Star size={14} className={formData.isFeatured ? 'fill-amber-500 text-amber-600' : 'text-amber-600'} />
                        Featured Case Study Card ⭐ (1 per Pillar, Max 3 on Home)
                      </span>
                      <p className="text-[11px] text-amber-800/80 mt-0.5">
                        Star this project as the featured case study card for <strong>{formData.disciplineName || 'this pillar'}</strong>. If another project in this discipline pillar is already featured, it will be automatically replaced so only 1 project per pillar is featured.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = !formData.isFeatured;
                        setFormData({
                          ...formData,
                          isFeatured: next,
                          ...(next ? { isPublished: true } : {}),
                        });
                      }}
                      className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shrink-0 ${
                        formData.isFeatured
                          ? 'bg-amber-500 border-amber-500 text-white shadow-xs'
                          : 'bg-white border-amber-300 text-amber-800 hover:bg-amber-100'
                      }`}
                    >
                      <Star size={13} className={formData.isFeatured ? 'fill-white' : ''} />
                      <span>{formData.isFeatured ? 'Featured ⭐' : 'Star as Featured'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* =================================================================== */}
              {/* TAB 2: TECHNICAL DIAGNOSTICS & MATERIALS */}
              {/* =================================================================== */}
              {modalTab === 'technical' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* Problem Description */}
                  <div>
                    <label className="form-label text-xs font-bold text-slate-800">
                      Problem Description & Structural Failure Analysis *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="e.g. Severe water seepage through terrace floor expansion joints causing recurring damp patches in the master bedroom suite directly below..."
                      className="form-textarea text-xs py-2 rounded-xl"
                      value={formData.problemDescription}
                      onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
                    />
                  </div>

                  {/* Inspection Findings */}
                  <div>
                    <label className="form-label text-xs font-bold text-slate-800">
                      Technical Inspection Findings & Diagnostics *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="e.g. Thermal imaging and electronic moisture meter identified capillary water tracking across 18 linear meters of fractured brick-bat coba screed..."
                      className="form-textarea text-xs py-2 rounded-xl"
                      value={formData.inspectionFindings}
                      onChange={(e) => setFormData({ ...formData, inspectionFindings: e.target.value })}
                    />
                  </div>

                  {/* Work Performed */}
                  <div>
                    <label className="form-label text-xs font-bold text-slate-800">
                      Engineering Work Performed & Solution Executed *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="e.g. Stripped loose debonded substrate, routed and sealed perimeter joints with polyurethane elastomer, installed 200 GSM fiberglass mesh, applied 3 coats of aliphatic polyurethane membrane..."
                      className="form-textarea text-xs py-2 rounded-xl"
                      value={formData.workPerformed}
                      onChange={(e) => setFormData({ ...formData, workPerformed: e.target.value })}
                    />
                  </div>

                  {/* Materials & Formulation */}
                  <div>
                    <label className="form-label text-xs font-bold text-slate-800">
                      Materials Formulation & Chemical Systems Used *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Fixit Fastflex, Fosroc Nitoseal PU40, SikaTop Seal-107, 200 GSM Fiberglass Mesh"
                      className="form-input text-xs py-2 rounded-xl"
                      value={formData.materialsUsed}
                      onChange={(e) => setFormData({ ...formData, materialsUsed: e.target.value })}
                    />

                    {/* Quick suggestion tags */}
                    <div className="mt-2">
                      <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        1-Click Industrial Chemical Presets:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {FORMULATION_PRESETS.map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => handleAddFormulationSuggestion(preset)}
                            className="text-[10.5px] bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-800 px-2 py-0.5 rounded-md border border-slate-200 transition-colors cursor-pointer"
                          >
                            + {preset}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================================== */}
              {/* TAB 3: BEFORE & AFTER MEDIA */}
              {/* =================================================================== */}
              {modalTab === 'media' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* Main Project Showcase Cover Image */}
                  <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                      <div>
                        <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                          <ImageIcon size={15} className="text-sky-600" />
                          <span>Main Project Showcase Image</span>
                        </label>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Upload from your computer/device, enter an image URL, or choose a curated high-res photo.
                        </p>
                      </div>

                      {/* Mode Selector Tabs */}
                      <div className="inline-flex p-1 rounded-xl bg-slate-200/80 text-[11px] font-bold self-start sm:self-auto gap-1">
                        <button
                          type="button"
                          onClick={() => setProjectImageSourceTab('upload')}
                          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                            projectImageSourceTab === 'upload'
                              ? 'bg-white text-sky-900 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                          }`}
                        >
                          <Upload size={12} className="text-sky-600" />
                          <span>Upload from Device</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setProjectImageSourceTab('url')}
                          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                            projectImageSourceTab === 'url'
                              ? 'bg-white text-sky-900 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                          }`}
                        >
                          <ExternalLink size={12} className="text-sky-600" />
                          <span>Image URL</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setProjectImageSourceTab('curated')}
                          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                            projectImageSourceTab === 'curated'
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
                    {projectImageSourceTab === 'upload' && (
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
                            {uploadingImage ? 'Uploading photo from device...' : 'Click to browse or drag & drop photo from device'}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">
                            Supports JPG, PNG, WEBP, or SVG images (up to 15MB)
                          </p>
                        </div>

                        {formData.image && (
                          <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-14 h-12 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-slate-100">
                                <img
                                  src={formData.image}
                                  alt="Cover Preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-900 truncate">
                                  Current Showcase Photo
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono truncate max-w-xs sm:max-w-md">
                                  {formData.image}
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
                                onClick={() => setFormData({ ...formData, image: '', coverImage: '' })}
                                className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                title="Clear photo"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* OPTION 2: Enter Web Image URL */}
                    {projectImageSourceTab === 'url' && (
                      <div className="space-y-3">
                        <label className="block text-xs font-bold text-slate-800">
                          Paste Web Image URL (Unsplash, CDN, or Cloud Storage)
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="url"
                            placeholder="https://images.unsplash.com/photo-... or https://example.com/project.jpg"
                            className="form-input text-xs font-mono py-2.5 px-3 flex-1 rounded-xl border border-slate-200 bg-white shadow-2xs"
                            value={formData.image}
                            onChange={(e) =>
                              setFormData({ ...formData, image: e.target.value, coverImage: e.target.value })
                            }
                          />
                          {formData.image && (
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, image: '', coverImage: '' })}
                              className="p-2 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Clear URL"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                        {formData.image && (
                          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                            <div className="w-16 h-12 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-slate-100">
                              <img
                                src={formData.image}
                                alt="URL Preview"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=400&q=80';
                                }}
                              />
                            </div>
                            <div className="text-xs text-slate-600 truncate flex-1 font-mono">
                              {formData.image}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* OPTION 3: Curated Presets */}
                    {projectImageSourceTab === 'curated' && (
                      <div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                          {CURATED_PROJECT_PHOTOS.map((photo, i) => (
                            <div
                              key={i}
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  image: photo.url,
                                  coverImage: photo.url,
                                  afterMediaUrl: photo.url,
                                });
                              }}
                              className={`group relative rounded-xl overflow-hidden border aspect-4/3 cursor-pointer transition-all ${
                                formData.image === photo.url
                                  ? 'border-sky-500 ring-2 ring-sky-400 shadow-sm'
                                  : 'border-slate-200 hover:border-sky-300'
                              }`}
                            >
                              <img
                                src={photo.url}
                                alt={photo.label}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-1.5">
                                <span className="text-[9.5px] font-bold text-white line-clamp-1">
                                  {photo.label}
                                </span>
                              </div>
                              {formData.image === photo.url && (
                                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-xs">
                                  <Check size={10} />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Before & After Media Inputs (Supports Device Upload & URL) */}
                  <div className="pt-2 border-t border-slate-100 space-y-4">
                    <div className="p-3 bg-sky-50/70 border border-sky-200/80 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles size={15} className="text-sky-600 shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-sky-950">Interactive Before &amp; After Comparison Visuals</div>
                          <div className="text-[11px] text-sky-700">Powers the interactive slider on the project case study and the Homepage Showcase when featured.</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Before Photo */}
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                            <span className="w-2 h-2 rounded-full bg-rose-500" />
                            <span>Before Treatment Image</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => beforeFileInputRef.current?.click()}
                            className="text-[10.5px] font-bold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-lg border border-sky-200 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Upload size={11} />
                            <span>Upload File</span>
                          </button>
                          <input
                            type="file"
                            ref={beforeFileInputRef}
                            accept="image/*"
                            onChange={handleBeforeFileUpload}
                            className="hidden"
                          />
                        </div>

                        <input
                          type="url"
                          placeholder="Or paste Before image URL..."
                          className="form-input text-xs py-2 rounded-xl w-full border border-slate-200"
                          value={formData.beforeMediaUrl}
                          onChange={(e) => setFormData({ ...formData, beforeMediaUrl: e.target.value })}
                        />
                        <input
                          type="text"
                          placeholder="Before caption (e.g. Deteriorated screed and ponding leaks)..."
                          className="form-input text-xs py-1.5 rounded-lg text-slate-600 w-full border border-slate-200"
                          value={formData.beforeMediaCaption}
                          onChange={(e) => setFormData({ ...formData, beforeMediaCaption: e.target.value })}
                        />
                        {formData.beforeMediaUrl && (
                          <div className="relative group/preview mt-2">
                            <img
                              src={formData.beforeMediaUrl}
                              alt="Before Preview"
                              className="w-full h-32 object-cover rounded-xl border border-slate-200"
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=80';
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, beforeMediaUrl: '' })}
                              className="absolute top-1.5 right-1.5 p-1 bg-slate-900/80 text-white rounded-md hover:bg-rose-600 opacity-0 group-hover/preview:opacity-100 transition-opacity"
                              title="Clear Before Photo"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* After Photo */}
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>After Restoration Image</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => afterFileInputRef.current?.click()}
                            className="text-[10.5px] font-bold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-lg border border-sky-200 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Upload size={11} />
                            <span>Upload File</span>
                          </button>
                          <input
                            type="file"
                            ref={afterFileInputRef}
                            accept="image/*"
                            onChange={handleAfterFileUpload}
                            className="hidden"
                          />
                        </div>

                        <input
                          type="url"
                          placeholder="Or paste After image URL..."
                          className="form-input text-xs py-2 rounded-xl w-full border border-slate-200"
                          value={formData.afterMediaUrl}
                          onChange={(e) => setFormData({ ...formData, afterMediaUrl: e.target.value })}
                        />
                        <input
                          type="text"
                          placeholder="After caption (e.g. Seamless monolithic elastomeric barrier)..."
                          className="form-input text-xs py-1.5 rounded-lg text-slate-600 w-full border border-slate-200"
                          value={formData.afterMediaCaption}
                          onChange={(e) => setFormData({ ...formData, afterMediaCaption: e.target.value })}
                        />
                        {formData.afterMediaUrl && (
                          <div className="relative group/preview mt-2">
                            <img
                              src={formData.afterMediaUrl}
                              alt="After Preview"
                              className="w-full h-32 object-cover rounded-xl border border-slate-200"
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80';
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, afterMediaUrl: '' })}
                              className="absolute top-1.5 right-1.5 p-1 bg-slate-900/80 text-white rounded-md hover:bg-rose-600 opacity-0 group-hover/preview:opacity-100 transition-opacity"
                              title="Clear After Photo"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================================== */}
              {/* TAB 4: LIVE CARD PREVIEW SIMULATOR */}
              {/* =================================================================== */}
              {modalTab === 'preview' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="text-xs text-slate-500 font-medium">
                    This live simulator matches the exact card rendered on the public{' '}
                    <strong className="text-slate-700">/projects</strong> portfolio page:
                  </div>

                  <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                    <div className="relative h-52 bg-slate-100 overflow-hidden">
                      <img
                        src={formData.afterMediaUrl || formData.image}
                        alt={formData.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-slate-900/85 backdrop-blur-xs text-white text-[9.5px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
                        {formData.disciplineName}
                      </div>
                      <div className="absolute bottom-2.5 left-2.5 bg-sky-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded shadow-xs flex items-center gap-1">
                        <ShieldCheck size={12} />
                        <span>{formData.serviceTitle || formData.serviceCategory}</span>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                        {formData.title || 'Untitled Project Title'}
                      </h4>

                      <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                        <MapPin size={12} className="text-slate-400 shrink-0" />
                        <span className="truncate">{formData.location}</span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {formData.problemDescription || 'Detailed structural diagnostics and case study details.'}
                      </p>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {formData.formulation.slice(0, 3).map((item, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                          >
                            {item}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500">
                          Ref: {formData.clientReference || 'Property Ref'}
                        </span>
                        <span className="btn btn-primary btn-sm text-[11px] py-1 px-3">
                          View Technical Case Study
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Before & After Showcase Simulator */}
                  {formData.beforeMediaUrl && formData.afterMediaUrl && (
                    <div className="max-w-md mx-auto pt-3 border-t border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                          <Sparkles size={13} className="text-sky-600" />
                          <span>Homepage Before &amp; After Showcase Simulator</span>
                        </div>
                        {formData.isFeatured && (
                          <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300">
                            ★ Active Showcase
                          </span>
                        )}
                      </div>
                      <div className="rounded-xl overflow-hidden border border-slate-200 shadow-md">
                        <BeforeAfterSlider
                          beforeImage={formData.beforeMediaUrl}
                          afterImage={formData.afterMediaUrl}
                          beforeLabel={formData.beforeMediaCaption || 'Before Treatment'}
                          afterLabel={formData.afterMediaCaption || 'After Restoration'}
                          aspectRatio="16/10"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </form>

            {/* Modal Footer with Step Nav & Save Action */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                {modalTab !== 'overview' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (modalTab === 'technical') setModalTab('overview');
                      if (modalTab === 'media') setModalTab('technical');
                      if (modalTab === 'preview') setModalTab('media');
                    }}
                    className="btn btn-outline btn-sm text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft size={13} />
                    <span>Back</span>
                  </button>
                )}

                {modalTab !== 'preview' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (modalTab === 'overview') setModalTab('technical');
                      if (modalTab === 'technical') setModalTab('media');
                      if (modalTab === 'media') setModalTab('preview');
                    }}
                    className="btn btn-outline btn-sm text-xs flex items-center gap-1 cursor-pointer text-sky-700 hover:bg-sky-50"
                  >
                    <span>Next Step</span>
                    <ArrowRight size={13} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline btn-sm text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleFormSubmit}
                  disabled={saving}
                  className="btn btn-primary btn-sm text-xs flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Save size={14} />
                  <span>{saving ? 'Saving...' : editingProject ? 'Update Project' : 'Save Project'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 6. QR CODE REVIEW LINK MODAL */}
      {/* ===================================================================== */}
      {qrModalData && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-xs">
              <QrCode size={24} />
            </div>

            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Customer QR Review Link
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Scan with smartphone camera to open the verified review feedback form for:{' '}
              <strong className="text-slate-800">{qrModalData.title}</strong>
            </p>

            {/* QR Code Graphic or fallback */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-[220px] mx-auto flex items-center justify-center">
              {qrModalData.qrCodeDataUrl ? (
                <img
                  src={qrModalData.qrCodeDataUrl}
                  alt="QR Code"
                  className="w-48 h-48 rounded-lg shadow-2xs"
                />
              ) : (
                <div className="p-4 text-center">
                  <QrCode size={96} className="mx-auto text-slate-700 mb-2" />
                  <span className="text-[10px] font-mono text-slate-500">
                    Token: {qrModalData.token}
                  </span>
                </div>
              )}
            </div>

            <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between text-xs">
              <span className="font-mono text-[11px] text-slate-600 truncate max-w-[260px]">
                {qrModalData.reviewUrl}
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(qrModalData.reviewUrl);
                  alert('Review link copied to clipboard!');
                }}
                className="p-1 rounded text-slate-500 hover:text-slate-800"
                title="Copy link"
              >
                <Copy size={14} />
              </button>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2">
              <a
                href={qrModalData.reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm text-xs flex items-center gap-1.5"
              >
                <ExternalLink size={13} />
                <span>Open Review Page</span>
              </a>
              <button
                type="button"
                onClick={() => setQrModalData(null)}
                className="btn btn-outline btn-sm text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
