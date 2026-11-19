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
  Layers,
  CheckCircle,
  Eye,
  SlidersHorizontal,
  Link as LinkIcon,
  ArrowLeftRight,
  Star,
  Globe,
  Check,
} from 'lucide-react';
import { fetchApi } from '../../utils/api';
import BeforeAfterSlider from '../../components/common/BeforeAfterSlider';

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

export const DISCIPLINE_PILLARS = [
  { id: 'waterproofing', name: 'Waterproofing Solutions', shortName: 'Waterproofing' },
  { id: 'painting', name: 'Interior & Exterior Painting', shortName: 'Painting' },
  { id: 'repairs', name: 'Building Repairs & Restoration', shortName: 'Building Repairs' },
  { id: 'false-ceiling', name: 'False Ceiling & Interior Work', shortName: 'False Ceiling' },
];

export const getDisciplineName = (id) => {
  const match = DISCIPLINE_PILLARS.find((d) => d.id === id);
  return match ? match.name : id || 'Waterproofing Solutions';
};

const FALLBACK_PRESETS = [
  {
    _id: 'trans-01',
    title: 'Palm Meadows Villa',
    subtitle: 'Terrace & Roof Garden',
    disciplineId: 'waterproofing',
    disciplineName: 'Waterproofing Solutions',
    showOnHome: true,
    isFeatured: true,
    location: 'Medipally, Hyderabad | Mar 2026',
    beforeImage: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    beforeLabel: 'Before Treatment',
    afterLabel: 'After Restoration',
    description: 'Multi-layer elastomeric membrane eliminating bedroom ceiling leaks and standing rainwater ponding.',
    caseStudySlug: 'terrace-roof-waterproofing',
    isActive: true,
    order: 0,
  },
  {
    _id: 'trans-02',
    title: 'Tech Park Commercial Hub',
    subtitle: 'Underground Basement Tanking',
    disciplineId: 'repairs',
    disciplineName: 'Building Repairs & Restoration',
    showOnHome: true,
    location: 'Madhapur, Hyderabad | Feb 2026',
    beforeImage: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
    beforeLabel: 'Before Treatment',
    afterLabel: 'After Restoration',
    description: 'Precision structural crack stitching, carbon fiber strengthening, concrete spalling rehabilitation, and rebar rust passivation.',
    caseStudySlug: 'building-repairs',
    isActive: true,
    order: 1,
  },
  {
    _id: 'trans-03',
    title: 'Regency Enclave Complex',
    subtitle: 'Exterior Wall & Façade',
    disciplineId: 'painting',
    disciplineName: 'Interior & Exterior Painting',
    showOnHome: true,
    location: 'Jubilee Hills, Hyderabad | Jan 2026',
    beforeImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    beforeLabel: 'Before Treatment',
    afterLabel: 'After Restoration',
    description: 'High-durability 100% acrylic exterior monsoon weather-shield coatings and anti-fungal luxury architectural wall finishes.',
    caseStudySlug: 'exterior-painting',
    isActive: true,
    order: 2,
  },
  {
    _id: 'trans-04',
    title: 'Emerald Corporate Suites',
    subtitle: 'Acoustic Ceilings & Gypsum Partitions',
    disciplineId: 'false-ceiling',
    disciplineName: 'False Ceiling & Interior Work',
    showOnHome: true,
    location: 'Gachibowli, Hyderabad | Dec 2025',
    beforeImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    beforeLabel: 'Before Treatment',
    afterLabel: 'After Restoration',
    description: 'Moisture-resistant gypsum false ceilings, anti-sag framing, mineral fiber acoustic ceiling tiles, and ambient LED cove lighting.',
    caseStudySlug: 'false-ceiling-interior',
    isActive: true,
    order: 3,
  },
];

const emptyForm = {
  title: '',
  subtitle: '',
  disciplineId: 'waterproofing',
  disciplineName: 'Waterproofing Solutions',
  showOnHome: true,
  isFeatured: false,
  location: 'Medipally, Hyderabad',
  caseStudySlug: '',
  beforeImage: '',
  afterImage: '',
  beforeLabel: 'Before Treatment',
  afterLabel: 'After Restoration',
  description: '',
  isActive: true,
};

export default function TransformationsManager() {
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPreset, setEditingPreset] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [beforePreview, setBeforePreview] = useState('');
  const [afterPreview, setAfterPreview] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadPresets = () => {
    setLoading(true);
    fetchApi('/admin/transformations')
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setPresets(res.data);
        } else {
          setPresets(FALLBACK_PRESETS);
        }
      })
      .catch((err) => {
        console.warn('Backend API unavailable, using fallback presets:', err);
        setPresets(FALLBACK_PRESETS);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPresets();
  }, []);

  const openCreate = () => {
    setEditingPreset(null);
    setForm(emptyForm);
    setBeforeFile(null);
    setAfterFile(null);
    setBeforePreview('');
    setAfterPreview('');
    setError('');
    setSuccessMsg('');
    setShowForm(true);
  };

  const openEdit = (preset) => {
    setEditingPreset(preset);
    const discId = preset.disciplineId || 'waterproofing';
    const isLive = preset.isActive !== false;
    setForm({
      title: preset.title || '',
      subtitle: preset.subtitle || preset.title || '',
      disciplineId: discId,
      disciplineName: preset.disciplineName || getDisciplineName(discId),
      showOnHome: isLive ? Boolean(preset.showOnHome) : false,
      isFeatured: isLive && preset.isFeatured === true,
      location: preset.location || 'Medipally, Hyderabad',
      caseStudySlug: preset.caseStudySlug || '',
      beforeImage: preset.beforeImage || '',
      afterImage: preset.afterImage || '',
      beforeLabel: preset.beforeLabel || 'Before Treatment',
      afterLabel: preset.afterLabel || 'After Restoration',
      description: preset.description || '',
      isActive: isLive,
    });
    setBeforeFile(null);
    setAfterFile(null);
    setBeforePreview(preset.beforeImage || '');
    setAfterPreview(preset.afterImage || '');
    setError('');
    setSuccessMsg('');
    setShowForm(true);
  };

  const handleBeforeFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBeforeFile(file);
      const url = URL.createObjectURL(file);
      setBeforePreview(url);
    }
  };

  const handleAfterFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAfterFile(file);
      const url = URL.createObjectURL(file);
      setAfterPreview(url);
    }
  };

  const handleSwapFormPhotos = () => {
    setForm((prev) => ({
      ...prev,
      beforeImage: prev.afterImage,
      afterImage: prev.beforeImage,
      beforeLabel: prev.afterLabel || 'Before Treatment',
      afterLabel: prev.beforeLabel || 'After Restoration',
    }));
    const prevBeforeFile = beforeFile;
    const prevBeforePreview = beforePreview;
    setBeforeFile(afterFile);
    setBeforePreview(afterPreview);
    setAfterFile(prevBeforeFile);
    setAfterPreview(prevBeforePreview);
  };

  const uploadImage = async (file) => {
    const data = new FormData();
    data.append('file', file);
    try {
      const response = await fetchApi('/admin/transformations/upload', {
        method: 'POST',
        body: data,
      });
      return response.data?.url || response.url;
    } catch (e) {
      // Fallback try /admin/media/upload
      const fallback = await fetchApi('/admin/media/upload', {
        method: 'POST',
        body: data,
      });
      return fallback.data?.url || fallback.url;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMsg('');

    try {
      let beforeImage = form.beforeImage;
      let afterImage = form.afterImage;

      if (beforeFile) {
        try {
          beforeImage = await uploadImage(beforeFile);
        } catch (uploadErr) {
          console.warn('Image upload failed, using preview URL:', uploadErr);
          beforeImage = beforePreview || form.beforeImage;
        }
      }

      if (afterFile) {
        try {
          afterImage = await uploadImage(afterFile);
        } catch (uploadErr) {
          console.warn('Image upload failed, using preview URL:', uploadErr);
          afterImage = afterPreview || form.afterImage;
        }
      }

      if (!beforeImage) {
        throw new Error('Please provide a Before photo (URL or upload a file).');
      }
      if (!afterImage) {
        throw new Error('Please provide an After photo (URL or upload a file).');
      }

      const targetDiscipline = form.disciplineId || 'waterproofing';
      const targetDisciplineName = form.disciplineName || getDisciplineName(targetDiscipline);

      const payload = {
        title: form.title.trim(),
        subtitle: form.subtitle?.trim() || targetDisciplineName,
        disciplineId: targetDiscipline,
        disciplineName: targetDisciplineName,
        location: form.location?.trim() || 'Medipally, Hyderabad',
        caseStudySlug: form.caseStudySlug?.trim() || '',
        beforeImage,
        afterImage,
        beforeLabel: form.beforeLabel?.trim() || 'Before Treatment',
        afterLabel: form.afterLabel?.trim() || 'After Restoration',
        description: form.description?.trim() || '',
        isActive: form.isActive,
        showOnHome: form.isActive ? Boolean(form.showOnHome) : false,
        isFeatured: form.isActive ? Boolean(form.isFeatured) : false,
      };

      if (editingPreset) {
        try {
          await fetchApi(`/admin/transformations/${editingPreset._id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
          });
        } catch (err) {
          console.warn('API update failed, updating local state:', err);
        }

        // Update local state and cache
        setPresets((prev) => {
          const updated = prev.map((p) => {
            if (p._id === editingPreset._id) return { ...p, ...payload };
            if (payload.showOnHome && (p.disciplineId || 'waterproofing') === targetDiscipline) {
              return { ...p, showOnHome: false };
            }
            if (payload.isFeatured) {
              return { ...p, isFeatured: false };
            }
            return p;
          });
          window.dispatchEvent(new Event('sln_transformations_updated'));
          return updated;
        });
      } else {
        const order = presets.reduce((max, preset) => Math.max(max, Number(preset.order) || 0), -1) + 1;
        const newPresetData = { ...payload, order, _id: `trans-${Date.now()}` };

        try {
          const res = await fetchApi('/admin/transformations', {
            method: 'POST',
            body: JSON.stringify(payload),
          });
          if (res.data?._id) newPresetData._id = res.data._id;
        } catch (err) {
          console.warn('API create failed, saving to local state:', err);
        }

        setPresets((prev) => {
          let updated = [...prev, newPresetData];
          if (payload.showOnHome) {
            updated = updated.map((p) =>
              p._id !== newPresetData._id && (p.disciplineId || 'waterproofing') === targetDiscipline
                ? { ...p, showOnHome: false }
                : p
            );
          }
          if (payload.isFeatured) {
            updated = updated.map((p) =>
              p._id !== newPresetData._id ? { ...p, isFeatured: false } : p
            );
          }
          window.dispatchEvent(new Event('sln_transformations_updated'));
          return updated;
        });
      }

      setShowForm(false);
      setSuccessMsg('Comparison saved successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to save comparison.');
    } finally {
      setSaving(false);
    }
  };

  // 1. Radio Selection for Homepage Showcase (One transformation per Discipline Pillar)
  // Selecting the radio button sets this transformation as the 1 active showcase for this discipline pillar,
  // and automatically deselects/replaces any previous one from that pillar!
  const handleSelectRadioShowcase = async (preset) => {
    setError('');
    const targetDiscipline = preset.disciplineId || 'waterproofing';
    const discName = preset.disciplineName || getDisciplineName(targetDiscipline);

    // Optimistically update presets:
    const updated = presets.map((p) => {
      const pDisc = p.disciplineId || 'waterproofing';
      if (p._id === preset._id) {
        return { ...p, showOnHome: true, isActive: true };
      }
      if (pDisc === targetDiscipline) {
        // Automatically deselect old one in this discipline pillar!
        return { ...p, showOnHome: false };
      }
      return p;
    });

    setPresets(updated);
    window.dispatchEvent(new Event('sln_transformations_updated'));

    try {
      await fetchApi(`/admin/transformations/${preset._id}`, {
        method: 'PUT',
        body: JSON.stringify({ showOnHome: true, isActive: true }),
      });
      setSuccessMsg(
        `"${preset.title}" selected as Homepage Showcase for "${discName}". Previous one was replaced.`
      );
      setTimeout(() => setSuccessMsg(''), 4500);
    } catch (err) {
      console.warn('API update failed:', err);
    }
  };

  // 2. Toggle Featured Showcase (Designate as Primary Featured Showcase on Homepage)
  const handleToggleFeatured = async (preset) => {
    setError('');
    const newFeatured = !preset.isFeatured;
    const updated = presets.map((p) => {
      if (p._id === preset._id) {
        return {
          ...p,
          isFeatured: newFeatured,
          showOnHome: newFeatured ? true : p.showOnHome,
          isActive: newFeatured ? true : p.isActive,
        };
      }
      if (newFeatured) {
        return { ...p, isFeatured: false };
      }
      return p;
    });

    setPresets(updated);
    window.dispatchEvent(new Event('sln_transformations_updated'));

    try {
      await fetchApi(`/admin/transformations/${preset._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          isFeatured: newFeatured,
          showOnHome: newFeatured ? true : preset.showOnHome,
          isActive: newFeatured ? true : preset.isActive,
        }),
      });
      setSuccessMsg(
        newFeatured
          ? `"${preset.title}" set as Primary Featured Showcase on Homepage ⭐`
          : `"${preset.title}" unfeatured.`
      );
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.warn('API update failed:', err);
    }
  };

  const updatePreset = async (preset, updates) => {
    setError('');

    // Business logic: if setting inactive, it CANNOT show on homepage or be featured
    const finalUpdates = { ...updates };
    if (finalUpdates.isActive === false) {
      finalUpdates.showOnHome = false;
      finalUpdates.isFeatured = false;
    } else if (finalUpdates.showOnHome === true || finalUpdates.isFeatured === true) {
      finalUpdates.isActive = true;
    }

    // Optimistic update
    setPresets((prev) => {
      const next = prev.map((p) => (p._id === preset._id ? { ...p, ...finalUpdates } : p));
      window.dispatchEvent(new Event('sln_transformations_updated'));
      return next;
    });

    if (finalUpdates.isActive !== undefined) {
      setSuccessMsg(
        finalUpdates.isActive
          ? `"${preset.title}" is now Live on the Website.`
          : `"${preset.title}" is now Hidden from the Website.`
      );
      setTimeout(() => setSuccessMsg(''), 3500);
    }

    try {
      await fetchApi(`/admin/transformations/${preset._id}`, {
        method: 'PUT',
        body: JSON.stringify(finalUpdates),
      });
    } catch (err) {
      console.warn('API update failed:', err);
    }
  };

  const movePreset = async (index, direction) => {
    const next = [...presets];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];

    // Reassign order
    const reordered = next.map((item, idx) => ({ ...item, order: idx }));
    setPresets(reordered);

    try {
      await Promise.all(
        reordered.map((preset, order) =>
          fetchApi(`/admin/transformations/${preset._id}`, {
            method: 'PUT',
            body: JSON.stringify({ order }),
          })
        )
      );
    } catch (err) {
      console.warn('Reorder API sync warning:', err);
    }
  };

  const deletePreset = async (preset) => {
    if (!window.confirm(`Delete the "${preset.title}" comparison?`)) return;
    setError('');

    setPresets((prev) => {
      const remaining = prev.filter((p) => p._id !== preset._id);
      window.dispatchEvent(new Event('sln_transformations_updated'));
      return remaining;
    });

    try {
      await fetchApi(`/admin/transformations/${preset._id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Delete API warning:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <SlidersHorizontal size={18} />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Before &amp; After Comparisons</h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Manage interactive Before &amp; After restoration sliders displayed on the homepage.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="btn btn-primary btn-sm flex items-center gap-2 self-start sm:self-auto shadow-xs"
        >
          <Plus size={16} /> Add Comparison
        </button>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-rose-500 hover:text-rose-800"><X size={16} /></button>
        </div>
      )}

      {successMsg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Homepage Discipline Pillars Showcase Status & Guide */}
      <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-emerald-50 p-5 rounded-2xl border border-sky-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
              Homepage Transformation Showcases (1 Active per Discipline Pillar)
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Each discipline pillar displays exactly one Before &amp; After transformation on the homepage.
            </p>
          </div>
          {/* Quick Legend for the 3 controls requested by user */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700">
            <span className="font-bold text-sky-700 flex items-center gap-1">🔘 Radio Button:</span>
            <span>Homepage Showcase</span>
            <span className="text-slate-300">|</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">☑ Checkbox:</span>
            <span>Live on Website</span>
            <span className="text-slate-300">|</span>
            <span className="font-bold text-amber-700 flex items-center gap-1">⭐ Star:</span>
            <span>Featured Spotlight</span>
          </div>
        </div>

        {/* 4 Pillars Status Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {DISCIPLINE_PILLARS.map((pillar) => {
            const activePreset = presets.find(
              (p) => p.disciplineId === pillar.id && p.showOnHome && p.isActive !== false
            );
            return (
              <div
                key={pillar.id}
                className={`p-3 rounded-xl border transition-all ${
                  activePreset
                    ? 'bg-white border-sky-300 shadow-2xs'
                    : 'bg-white/60 border-dashed border-slate-300 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="truncate">{pillar.name}</span>
                  {activePreset?.isFeatured && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-extrabold flex items-center gap-0.5">
                      <Star size={9} className="fill-amber-500 text-amber-600" /> Featured
                    </span>
                  )}
                </div>
                <div className="mt-2 text-xs">
                  {activePreset ? (
                    <div className="flex items-center gap-1.5 text-sky-800 font-semibold truncate" title={activePreset.title}>
                      <span className="text-sky-600">🔘</span>
                      <span className="truncate">{activePreset.title}</span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
                      <span>⚠️ None selected</span>
                    </div>
                  )}
                </div>
                <div className="mt-1 text-[10px] text-slate-500">
                  {activePreset ? 'Active on homepage' : 'Select via radio button below'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid */}
      {loading ? (
        <div className="card bg-white p-12 text-center text-sm text-slate-500">
          <div className="animate-spin w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full mx-auto mb-3" />
          Loading comparison gallery...
        </div>
      ) : presets.length === 0 ? (
        <div className="card bg-white p-12 text-center">
          <ImagePlus size={40} className="mx-auto mb-3 text-slate-400" />
          <p className="font-bold text-slate-800">No comparisons configured</p>
          <p className="mt-1 text-xs text-slate-500">Click "Add Comparison" above to configure your first Before &amp; After showcase.</p>
          <button onClick={openCreate} className="btn btn-primary btn-sm mt-4 inline-flex items-center gap-1.5">
            <Plus size={14} /> Add First Comparison
          </button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {presets.map((preset, index) => (
            <article key={preset._id} className="card overflow-hidden border border-slate-200 bg-white shadow-2xs hover:shadow-md transition-shadow">
              {/* Interactive Before & After Slider Preview directly in the Admin card! */}
              <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                <BeforeAfterSlider
                  beforeImage={preset.beforeImage}
                  afterImage={preset.afterImage}
                  beforeLabel={preset.beforeLabel || 'Before'}
                  afterLabel={preset.afterLabel || 'After'}
                  aspectRatio="16/10"
                />
              </div>

              {/* Card Meta & Controls */}
              <div className="space-y-3.5 p-4 sm:p-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      0{index + 1}
                    </span>
                    <h2 className="truncate font-bold text-slate-900 text-sm sm:text-base">{preset.title}</h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                      🏛️ {preset.disciplineName || getDisciplineName(preset.disciplineId)}
                    </span>
                    {preset.isActive !== false && preset.showOnHome ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-sky-100 text-sky-900 border border-sky-300">
                        🔘 Active Homepage Showcase
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                        Not on Homepage
                      </span>
                    )}
                    {preset.isActive !== false ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live on Website
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        🔒 Hidden from Site
                      </span>
                    )}
                    {preset.isFeatured && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                        <Star size={11} className="fill-amber-500 text-amber-600" /> Featured Showcase
                      </span>
                    )}
                  </div>
                  {preset.subtitle && (
                    <p className="text-xs text-sky-700 font-semibold mt-1">{preset.subtitle}</p>
                  )}
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500 leading-relaxed">
                    {preset.description || 'No project description entered.'}
                  </p>
                </div>

                {/* Highly Visible Control Strip: 🔘 Radio for Homepage Showcase & ☑ Checkbox for Live on Website */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  {/* 1. Radio Button: Homepage Showcase for this Discipline Pillar */}
                  <label
                    className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      preset.isActive !== false && preset.showOnHome
                        ? 'bg-sky-50 text-sky-950 border-sky-500 font-bold shadow-xs ring-2 ring-sky-300'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300 hover:bg-sky-50/50'
                    }`}
                    title={`Select radio button to show this comparison on the homepage for ${preset.disciplineName || getDisciplineName(preset.disciplineId)}`}
                  >
                    <input
                      type="radio"
                      name={`home_showcase_${preset.disciplineId || 'waterproofing'}`}
                      checked={Boolean(preset.isActive !== false && preset.showOnHome)}
                      onChange={() => handleSelectRadioShowcase(preset)}
                      className="sr-only"
                    />
                    <RadioCircle checked={Boolean(preset.isActive !== false && preset.showOnHome)} />
                    <div className="min-w-0 text-left">
                      <div className="text-xs font-extrabold text-sky-950 flex items-center gap-1.5">
                        <span>{preset.isActive !== false && preset.showOnHome ? 'Homepage Showcase' : 'Show on Homepage'}</span>
                        <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-1.5 py-0.2 rounded">Radio</span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 font-normal leading-tight mt-0.5">
                        {preset.isActive !== false && preset.showOnHome
                          ? `Currently selected for ${preset.disciplineName || getDisciplineName(preset.disciplineId)}`
                          : `Click radio circle to feature on homepage (1 per pillar)`}
                      </p>
                    </div>
                  </label>

                  {/* 2. Checkbox: Live on Website (Active/Published) */}
                  <label
                    className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      preset.isActive !== false
                        ? 'bg-emerald-50 text-emerald-950 border-emerald-400 font-bold shadow-xs'
                        : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-100'
                    }`}
                    title="Check this box to make this transformation Live on the Website"
                  >
                    <input
                      type="checkbox"
                      checked={preset.isActive !== false}
                      onChange={(event) => updatePreset(preset, { isActive: event.target.checked })}
                      className="sr-only"
                    />
                    <CheckboxSquare checked={preset.isActive !== false} />
                    <div className="min-w-0 text-left">
                      <div className="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5">
                        <span>{preset.isActive !== false ? 'Live on Website' : 'Hidden'}</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">Checkbox</span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 font-normal leading-tight mt-0.5">
                        {preset.isActive !== false ? 'Published & active on site' : 'Hidden from public visitors'}
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                  {/* Reorder Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => movePreset(index, -1)}
                      disabled={index === 0}
                      aria-label="Move comparison up"
                      className="btn btn-outline btn-xs p-1.5 disabled:opacity-30 hover:border-sky-400"
                      title="Move up in order"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => movePreset(index, 1)}
                      disabled={index === presets.length - 1}
                      aria-label="Move comparison down"
                      className="btn btn-outline btn-xs p-1.5 disabled:opacity-30 hover:border-sky-400"
                      title="Move down in order"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <span className="text-[11px] text-slate-400 ml-1">#{index + 1}</span>
                  </div>

                  {/* Actions: Star for Featured, Edit, Delete */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Star Button for Featured */}
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(preset)}
                      className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                        preset.isFeatured
                          ? 'border-amber-400 bg-amber-50 text-amber-700 shadow-2xs'
                          : 'border-slate-200 text-slate-400 hover:text-amber-500 hover:bg-amber-50'
                      }`}
                      title={preset.isFeatured ? 'Featured Showcase (Click to unstar)' : 'Click Star to make this Featured Showcase on Homepage'}
                    >
                      <Star size={13} className={preset.isFeatured ? 'fill-amber-500 text-amber-500' : ''} />
                      <span>{preset.isFeatured ? 'Featured' : 'Star Featured'}</span>
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => openEdit(preset)}
                      className="btn btn-outline btn-sm px-2.5 py-1 flex items-center gap-1 text-slate-700 hover:text-sky-700 hover:border-sky-400"
                      aria-label="Edit comparison"
                    >
                      <Pencil size={12} />
                      <span className="text-xs">Edit</span>
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => deletePreset(preset)}
                      className="btn btn-outline btn-sm px-2 py-1 text-rose-600 hover:bg-rose-50 hover:border-rose-300"
                      aria-label="Delete comparison"
                      title="Delete comparison"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Add / Edit Comparison Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="font-bold text-slate-900 text-lg">
                  {editingPreset ? 'Edit Before & After Comparison' : 'Add New Comparison'}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Provide Before and After images by entering image URLs or uploading files from your computer.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Close"
                className="text-slate-400 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title, Subtitle & Discipline Pillar */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="transformation-title" className="form-label text-xs">
                    Project Title / Landmark *
                  </label>
                  <input
                    id="transformation-title"
                    required
                    maxLength={100}
                    placeholder="e.g. Palm Meadows Villa"
                    className="form-input text-xs"
                    value={form.title}
                    onChange={(event) => setForm({ ...form, title: event.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="transformation-subtitle" className="form-label text-xs">
                    Service Subtitle
                  </label>
                  <input
                    id="transformation-subtitle"
                    maxLength={120}
                    placeholder="e.g. Terrace & Roof Garden"
                    className="form-input text-xs"
                    value={form.subtitle}
                    onChange={(event) => setForm({ ...form, subtitle: event.target.value })}
                  />
                </div>
              </div>

              {/* Discipline Pillar — controls homepage button */}
              <div>
                <label htmlFor="transformation-discipline" className="form-label text-xs">
                  Discipline Pillar * <span className="text-sky-600 font-bold">(Controls Homepage Tab)</span>
                </label>
                <select
                  id="transformation-discipline"
                  className="form-input text-xs"
                  value={form.disciplineId}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const matched = DISCIPLINE_PILLARS.find((d) => d.id === selectedId);
                    setForm({
                      ...form,
                      disciplineId: selectedId,
                      disciplineName: matched ? matched.name : '',
                    });
                  }}
                >
                  {DISCIPLINE_PILLARS.map((pillar) => (
                    <option key={pillar.id} value={pillar.id}>
                      {pillar.name}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  Homepage features one Before &amp; After transformation per Discipline Pillar.
                </p>
              </div>

              {/* 1. Radio Button: Homepage Showcase for this Discipline Pillar */}
              <div className="p-4 rounded-xl border-2 border-sky-300 bg-sky-50/90 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-sky-950 flex items-center gap-1.5">
                    🔘 Homepage Showcase (Radio Button)
                  </span>
                  <span className="text-[11px] font-semibold text-sky-800 bg-sky-200/80 px-2 py-0.5 rounded-full self-start sm:self-auto">
                    1 per {form.disciplineName || 'Discipline Pillar'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      form.showOnHome === true && form.isActive
                        ? 'bg-white border-sky-500 shadow-sm ring-2 ring-sky-300'
                        : 'bg-white/60 border-slate-200 hover:bg-white hover:border-sky-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="form_home_showcase"
                      checked={form.showOnHome === true && form.isActive}
                      onChange={() => setForm({ ...form, showOnHome: true, isActive: true })}
                      className="sr-only"
                    />
                    <RadioCircle checked={Boolean(form.showOnHome === true && form.isActive)} />
                    <div className="text-xs">
                      <span className="font-extrabold text-sky-950 block">Show on Homepage</span>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        Selected as the active showcase for {form.disciplineName || 'this pillar'}. Automatically marks Live.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      !form.showOnHome || !form.isActive
                        ? 'bg-white border-slate-400 shadow-sm ring-2 ring-slate-200'
                        : 'bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="form_home_showcase"
                      checked={!form.showOnHome || !form.isActive}
                      onChange={() => setForm({ ...form, showOnHome: false })}
                      className="sr-only"
                    />
                    <RadioCircle checked={Boolean(!form.showOnHome || !form.isActive)} />
                    <div className="text-xs">
                      <span className="font-bold text-slate-700 block">Do Not Show on Homepage</span>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        Keep in comparison library only without displaying on the homepage.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* 2. Checkbox: Live on Website (Active/Published) */}
              <label className="flex items-start gap-3 p-3.5 rounded-xl border-2 border-emerald-300 bg-emerald-50/70 cursor-pointer hover:bg-emerald-50 transition-colors">
                <input
                  type="checkbox"
                  checked={Boolean(form.isActive)}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setForm({
                      ...form,
                      isActive: isChecked,
                      ...(isChecked ? {} : { showOnHome: false, isFeatured: false }),
                    });
                  }}
                  className="sr-only"
                />
                <CheckboxSquare checked={Boolean(form.isActive)} />
                <div className="text-xs">
                  <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <Globe size={13} className="text-emerald-700" />
                    Live on Website (Published &amp; Active)
                  </span>
                  <p className="text-[11px] text-emerald-800/80 mt-0.5">
                    Check this box so this transformation is published and active to view on the website.
                  </p>
                </div>
              </label>

              {/* 3. Featured Star Button */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-amber-200 bg-amber-50/70 gap-3">
                <div className="text-xs min-w-0">
                  <span className="font-bold text-amber-950 flex items-center gap-1.5">
                    <Star size={14} className={form.isFeatured ? 'fill-amber-500 text-amber-600' : 'text-amber-600'} />
                    Primary Featured Showcase ⭐
                  </span>
                  <p className="text-[11px] text-amber-800/80 mt-0.5">
                    Click the Star button to feature this comparison as the main spotlight showcase when visitors land on the homepage.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !form.isFeatured;
                    setForm({ ...form, isFeatured: next, showOnHome: next ? true : form.showOnHome });
                  }}
                  className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    form.isFeatured
                      ? 'bg-amber-500 border-amber-500 text-white shadow-xs'
                      : 'bg-white border-amber-300 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  <Star size={13} className={form.isFeatured ? 'fill-white' : ''} />
                  <span>{form.isFeatured ? 'Featured ⭐' : 'Star as Featured'}</span>
                </button>
              </div>

              {/* Location & Case Study Slug */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="transformation-location" className="form-label text-xs">
                    Location & Date
                  </label>
                  <input
                    id="transformation-location"
                    maxLength={120}
                    placeholder="e.g. Medipally, Hyderabad | Mar 2026"
                    className="form-input text-xs"
                    value={form.location}
                    onChange={(event) => setForm({ ...form, location: event.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="transformation-slug" className="form-label text-xs">
                    Linked Case Study / Category Slug
                  </label>
                  <input
                    id="transformation-slug"
                    maxLength={200}
                    placeholder="e.g. terrace-roof-waterproofing"
                    className="form-input text-xs"
                    value={form.caseStudySlug}
                    onChange={(event) => setForm({ ...form, caseStudySlug: event.target.value })}
                  />
                </div>
              </div>

              {/* Before & After Media Inputs (Supports URL OR File Upload) */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Before &amp; After Images</h3>
                    <p className="text-[11px] text-slate-500">Box 1 is the damaged state; Box 2 is the restored state.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSwapFormPhotos}
                    className="text-xs font-semibold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg border border-sky-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    title="Click to swap Before and After images if uploaded in reverse"
                  >
                    <ArrowLeftRight size={13} className="text-sky-600" />
                    <span>Swap Photos</span>
                  </button>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                {/* BEFORE PHOTO */}
                <div className="p-3.5 rounded-xl border border-rose-200/80 bg-rose-50/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-800 uppercase tracking-wide">
                      1. Before Photo *
                    </span>
                    <span className="text-[10px] text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full font-semibold">
                      Required
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-600 font-medium block mb-1">
                      Image URL (Direct link)
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      className="form-input text-xs"
                      value={form.beforeImage}
                      onChange={(e) => {
                        setForm({ ...form, beforeImage: e.target.value });
                        if (!beforeFile) setBeforePreview(e.target.value);
                      }}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-600 font-medium block mb-1">
                      Or Upload Image File
                    </label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="form-input text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[11px] file:bg-rose-100 file:text-rose-700 hover:file:bg-rose-200"
                      onChange={handleBeforeFileChange}
                    />
                  </div>

                  {beforePreview && (
                    <div className="relative mt-2 rounded-lg overflow-hidden aspect-[4/3] bg-slate-900 border border-slate-200">
                      <img src={beforePreview} alt="Before preview" className="w-full h-full object-cover" />
                      <span className="absolute top-1.5 left-1.5 bg-rose-600 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                        BEFORE PREVIEW
                      </span>
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] text-slate-600 font-medium block mb-1">
                      Before Label
                    </label>
                    <input
                      maxLength={120}
                      className="form-input text-xs"
                      value={form.beforeLabel}
                      onChange={(e) => setForm({ ...form, beforeLabel: e.target.value })}
                    />
                  </div>
                </div>

                {/* AFTER PHOTO */}
                <div className="p-3.5 rounded-xl border border-emerald-200/80 bg-emerald-50/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                      2. After Photo *
                    </span>
                    <span className="text-[10px] text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                      Required
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-600 font-medium block mb-1">
                      Image URL (Direct link)
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      className="form-input text-xs"
                      value={form.afterImage}
                      onChange={(e) => {
                        setForm({ ...form, afterImage: e.target.value });
                        if (!afterFile) setAfterPreview(e.target.value);
                      }}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-600 font-medium block mb-1">
                      Or Upload Image File
                    </label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="form-input text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[11px] file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200"
                      onChange={handleAfterFileChange}
                    />
                  </div>

                  {afterPreview && (
                    <div className="relative mt-2 rounded-lg overflow-hidden aspect-[4/3] bg-slate-900 border border-slate-200">
                      <img src={afterPreview} alt="After preview" className="w-full h-full object-cover" />
                      <span className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                        AFTER PREVIEW
                      </span>
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] text-slate-600 font-medium block mb-1">
                      After Label
                    </label>
                    <input
                      maxLength={120}
                      className="form-input text-xs"
                      value={form.afterLabel}
                      onChange={(e) => setForm({ ...form, afterLabel: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

              {/* Live Interactive Slider Preview inside Modal */}
              {beforePreview && afterPreview && (
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Eye size={14} className="text-sky-600" />
                    <span className="text-xs font-bold text-slate-700">Interactive Slider Live Preview:</span>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-slate-300 aspect-[16/9] max-h-56">
                    <BeforeAfterSlider
                      beforeImage={beforePreview}
                      afterImage={afterPreview}
                      beforeLabel={form.beforeLabel || 'Before'}
                      afterLabel={form.afterLabel || 'After'}
                      aspectRatio="16/9"
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label htmlFor="transformation-description" className="form-label text-xs">
                  Restoration Description (Optional)
                </label>
                <textarea
                  id="transformation-description"
                  rows="2"
                  maxLength={1000}
                  placeholder="Describe technical execution, chemical materials used, or problem solved..."
                  className="form-textarea text-xs"
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                />
              </div>

              {/* Active Toggle */}
              <label className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
                  className="rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                />
                <span className="font-semibold">Display this comparison on the public homepage</span>
              </label>

              {error && <p role="alert" className="text-xs text-rose-700 font-semibold bg-rose-50 p-2 rounded">{error}</p>}

              {/* Modal Buttons */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn btn-outline btn-sm text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary btn-sm text-xs flex items-center gap-1.5 disabled:opacity-60"
                >
                  <Upload size={14} />
                  <span>{saving ? 'Saving Comparison...' : 'Save Comparison'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
