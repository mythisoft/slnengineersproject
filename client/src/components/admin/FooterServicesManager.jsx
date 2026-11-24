import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  Save,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  ExternalLink,
  CheckCircle2,
  Layers,
  AlertCircle,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { fetchApi } from '../../utils/api';

export const DEFAULT_FOOTER_SPECIALIZED_SERVICES = {
  heading: 'Specialized Services',
  viewAllText: 'View All 14+ Specialized Services',
  viewAllLink: '/services',
  links: [
    {
      id: 'spec-1',
      name: 'Terrace & Roof Waterproofing',
      disc: 'waterproofing',
      category: 'Terrace & Roof Waterproofing',
      url: '/services?discipline=waterproofing&category=Terrace%20%26%20Roof%20Waterproofing',
      isActive: true,
    },
    {
      id: 'spec-2',
      name: 'Basement & Deep Tanking',
      disc: 'waterproofing',
      category: 'Basement & Deep Tanking',
      url: '/services?discipline=waterproofing&category=Basement%20%26%20Deep%20Tanking',
      isActive: true,
    },
    {
      id: 'spec-3',
      name: 'Structural Crack Stitching & Grouting',
      disc: 'repairs',
      category: 'Structural Crack Stitching & Grouting',
      url: '/services?discipline=repairs&category=Structural%20Crack%20Stitching%20%26%20Grouting',
      isActive: true,
    },
    {
      id: 'spec-4',
      name: 'Concrete Spalling Rehabilitation',
      disc: 'repairs',
      category: 'Concrete Spalling Rehabilitation',
      url: '/services?discipline=repairs&category=Concrete%20Spalling%20Rehabilitation',
      isActive: true,
    },
    {
      id: 'spec-5',
      name: 'Exterior Monsoon Weather-Shield Painting',
      disc: 'painting',
      category: 'Exterior Monsoon Weather-Shield Painting',
      url: '/services?discipline=painting&category=Exterior%20Monsoon%20Weather-Shield%20Painting',
      isActive: true,
    },
  ],
};

const DISCIPLINE_OPTIONS = [
  { id: 'waterproofing', name: 'Waterproofing Solutions', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  { id: 'painting', name: 'Interior & Exterior Painting', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'repairs', name: 'Building Repairs & Restoration', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'false-ceiling', name: 'False Ceiling & Interior Work', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
];

export default function FooterServicesManager() {
  const [config, setConfig] = useState(DEFAULT_FOOTER_SPECIALIZED_SERVICES);
  const [availableDbServices, setAvailableDbServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  // Modal State for Add / Edit
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    disc: 'waterproofing',
    category: '',
    url: '',
    isActive: true,
  });

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [settingsRes, servicesRes] = await Promise.all([
        fetchApi('/admin/settings').catch(() => null),
        fetchApi('/admin/services').catch(() => null),
      ]);

      if (settingsRes && settingsRes.success && settingsRes.data?.footerSpecializedServices) {
        const remote = settingsRes.data.footerSpecializedServices;
        setConfig({
          heading: remote.heading || DEFAULT_FOOTER_SPECIALIZED_SERVICES.heading,
          viewAllText: remote.viewAllText !== undefined ? remote.viewAllText : DEFAULT_FOOTER_SPECIALIZED_SERVICES.viewAllText,
          viewAllLink: remote.viewAllLink || DEFAULT_FOOTER_SPECIALIZED_SERVICES.viewAllLink,
          links: Array.isArray(remote.links) ? remote.links : DEFAULT_FOOTER_SPECIALIZED_SERVICES.links,
        });
      }

      if (servicesRes && servicesRes.success && Array.isArray(servicesRes.data)) {
        setAvailableDbServices(servicesRes.data);
      }
    } catch (err) {
      console.warn('Could not load footer services settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save changes to backend
  const handleSave = async (updatedConfig = config) => {
    setSaving(true);
    try {
      const res = await fetchApi('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({
          footerSpecializedServices: updatedConfig,
        }),
      });

      if (res.success) {
        showToast('Footer Specialized Services saved successfully!');
        window.dispatchEvent(new CustomEvent('sln_settings_updated', { detail: res.data }));
      } else {
        throw new Error(res.message || 'Failed to update settings');
      }
    } catch (err) {
      showToast(err.message || 'Error saving footer services', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Open modal for new link
  const handleOpenAddModal = () => {
    setEditingIndex(null);
    setFormData({
      name: '',
      disc: 'waterproofing',
      category: '',
      url: '/services?discipline=waterproofing',
      isActive: true,
    });
    setShowModal(true);
  };

  // Open modal for editing link
  const handleOpenEditModal = (link, idx) => {
    setEditingIndex(idx);
    setFormData({
      name: link.name || '',
      disc: link.disc || 'waterproofing',
      category: link.category || link.name || '',
      url: link.url || `/services?discipline=${encodeURIComponent(link.disc || 'waterproofing')}&category=${encodeURIComponent(link.category || link.name)}`,
      isActive: link.isActive !== false,
    });
    setShowModal(true);
  };

  // Handle Quick Pick from Existing Database Services
  const handlePickDbService = (srvTitle) => {
    const srv = availableDbServices.find((s) => s.title === srvTitle);
    if (!srv) return;
    const disc = srv.disciplineId || 'waterproofing';
    const cat = srv.category || srv.categoryLabel || srv.title;
    const url = `/services?discipline=${encodeURIComponent(disc)}&category=${encodeURIComponent(cat)}`;
    setFormData({
      ...formData,
      name: srv.title,
      disc,
      category: cat,
      url,
    });
  };

  // Generate URL automatically from Name & Discipline
  const handleAutoGenerateUrl = (name = formData.name, disc = formData.disc) => {
    if (!name.trim()) return;
    const genUrl = `/services?discipline=${encodeURIComponent(disc)}&category=${encodeURIComponent(name.trim())}`;
    setFormData((prev) => ({ ...prev, url: genUrl, category: name.trim() }));
  };

  // Submit modal form
  const handleSubmitModal = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a service name / label.');
      return;
    }

    const currentLinks = [...(config.links || [])];
    const newEntry = {
      id: editingIndex !== null ? currentLinks[editingIndex]?.id || `spec-${Date.now()}` : `spec-${Date.now()}`,
      name: formData.name.trim(),
      disc: formData.disc,
      category: formData.category.trim() || formData.name.trim(),
      url: formData.url.trim() || `/services?discipline=${encodeURIComponent(formData.disc)}&category=${encodeURIComponent(formData.name.trim())}`,
      isActive: formData.isActive,
    };

    if (editingIndex !== null) {
      currentLinks[editingIndex] = newEntry;
    } else {
      currentLinks.push(newEntry);
    }

    const nextConfig = { ...config, links: currentLinks };
    setConfig(nextConfig);
    setShowModal(false);
    handleSave(nextConfig);
  };

  // Delete link
  const handleDeleteLink = (index, linkName) => {
    if (!window.confirm(`Are you sure you want to delete "${linkName}" from footer?`)) return;
    const updated = config.links.filter((_, idx) => idx !== index);
    const nextConfig = { ...config, links: updated };
    setConfig(nextConfig);
    handleSave(nextConfig);
    showToast(`Removed "${linkName}" from footer.`);
  };

  // Reorder links
  const handleMove = (index, direction) => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= config.links.length) return;

    const list = [...config.links];
    const [moved] = list.splice(index, 1);
    list.splice(newIdx, 0, moved);

    const nextConfig = { ...config, links: list };
    setConfig(nextConfig);
    handleSave(nextConfig);
  };

  // Toggle active status
  const handleToggleActive = (index) => {
    const list = [...config.links];
    list[index] = { ...list[index], isActive: !list[index].isActive };
    const nextConfig = { ...config, links: list };
    setConfig(nextConfig);
    handleSave(nextConfig);
  };

  // Restore defaults
  const handleResetDefaults = () => {
    if (!window.confirm('Reset footer Specialized Services to the 5 standard verified links?')) return;
    setConfig(DEFAULT_FOOTER_SPECIALIZED_SERVICES);
    handleSave(DEFAULT_FOOTER_SPECIALIZED_SERVICES);
    showToast('Reset to default Specialized Services links.');
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
        <div className="w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
        <span>Loading Footer Specialized Services settings...</span>
      </div>
    );
  }

  const activeLinksCount = (config.links || []).filter((l) => l.isActive !== false).length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-3 duration-200 ${
            notification.type === 'error' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
          }`}
        >
          <CheckCircle2 size={16} />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-sky-100 text-sky-800">
              <Layers size={18} />
            </span>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Footer Specialized Services CRUD
            </h2>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-sky-50 text-sky-700 border border-sky-200 uppercase">
              {activeLinksCount} Active / {config.links?.length || 0} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
            Create, edit, reorder, or delete the Specialized Services links displayed in the website footer. Changes reflect live on the public site immediately.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="btn btn-outline btn-sm text-xs flex items-center gap-1.5 text-slate-600 hover:text-slate-900"
          >
            <RotateCcw size={13} />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="btn btn-primary btn-sm text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={14} />
            <span>Add Service Link</span>
          </button>
        </div>
      </div>

      {/* Configuration Inputs: Heading & View All Button */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <Sparkles size={14} className="text-sky-500" />
          <span>Section Headings &amp; Catalog Navigation Link</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Section Title</label>
            <input
              type="text"
              value={config.heading || ''}
              onChange={(e) => setConfig({ ...config, heading: e.target.value })}
              placeholder="e.g. Specialized Services"
              className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-200 bg-white"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Displayed above the links list in the footer.</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Bottom "View All" CTA Text</label>
            <input
              type="text"
              value={config.viewAllText || ''}
              onChange={(e) => setConfig({ ...config, viewAllText: e.target.value })}
              placeholder="e.g. View All 14+ Specialized Services"
              className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-200 bg-white"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Text for the highlighted bottom link button.</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Bottom Link Destination URL</label>
            <input
              type="text"
              value={config.viewAllLink || ''}
              onChange={(e) => setConfig({ ...config, viewAllLink: e.target.value })}
              placeholder="e.g. /services"
              className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-200 bg-white"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Page route opened when clicking the bottom link.</span>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(config)}
            className="btn btn-secondary btn-sm text-xs flex items-center gap-1.5"
          >
            <Save size={13} />
            <span>{saving ? 'Saving...' : 'Save Headings'}</span>
          </button>
        </div>
      </div>

      {/* Main Links Management Table & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Editable Links List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Specialized Service Links ({config.links?.length || 0})
            </span>
            <span className="text-[11px] text-slate-400">
              Use arrows to arrange order in footer
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {(!config.links || config.links.length === 0) ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No specialized service links configured. Click "Add Service Link" above to add one.
              </div>
            ) : (
              config.links.map((link, idx) => {
                const discObj = DISCIPLINE_OPTIONS.find((d) => d.id === link.disc) || DISCIPLINE_OPTIONS[0];

                return (
                  <div
                    key={link.id || idx}
                    className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-colors ${
                      link.isActive === false ? 'bg-slate-50/60 opacity-60' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Left: Reorder Controls + Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Reorder Up/Down */}
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMove(idx, 'up')}
                          className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer rounded hover:bg-slate-100"
                          title="Move Up"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === config.links.length - 1}
                          onClick={() => handleMove(idx, 'down')}
                          className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer rounded hover:bg-slate-100"
                          title="Move Down"
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>

                      {/* Number Index */}
                      <span className="w-5 text-center text-[11px] font-mono font-bold text-slate-400 shrink-0">
                        {String(idx + 1).padStart(2, '0')}
                      </span>

                      {/* Link Info */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {link.name}
                          </h4>
                          <span className={`px-2 py-0.5 rounded text-[9.5px] font-extrabold uppercase border ${discObj.color}`}>
                            {discObj.name.split(' ')[0]}
                          </span>
                          {link.isActive === false && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                              Hidden
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                          {link.url}
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Toggle Active */}
                      <button
                        type="button"
                        onClick={() => handleToggleActive(idx)}
                        className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                          link.isActive === false
                            ? 'bg-slate-100 text-slate-400 border-slate-200 hover:text-slate-700'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        }`}
                        title={link.isActive === false ? 'Click to show in footer' : 'Click to hide from footer'}
                      >
                        {link.isActive === false ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(link, idx)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:border-slate-300 cursor-pointer"
                        title="Edit Link"
                      >
                        <Edit3 size={13} />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteLink(idx, link.name)}
                        className="p-1.5 rounded-lg border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Delete Link"
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

        {/* Right 1 Col: Live Dark Footer Preview */}
        <div className="bg-[#031526] rounded-2xl border border-sky-950 p-5 text-white shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Footer Section Preview
              </span>
              <span className="text-[10px] font-mono text-slate-400">As seen by visitors</span>
            </div>

            {/* Footer Column Simulation */}
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                {config.heading || 'Specialized Services'}
              </span>

              <ul className="space-y-2 text-xs text-slate-400">
                {(config.links || [])
                  .filter((l) => l.isActive !== false)
                  .map((item, pIdx) => (
                    <li key={pIdx}>
                      <a
                        href={item.url || '#'}
                        onClick={(e) => e.preventDefault()}
                        className="group flex items-start gap-2.5 text-slate-400 hover:text-sky-300 transition-colors py-0.5 cursor-pointer"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 group-hover:bg-sky-400 transition-colors shrink-0 mt-1.5" />
                        <span className="leading-snug text-slate-300 group-hover:text-sky-300">
                          {item.name}
                        </span>
                      </a>
                    </li>
                  ))}
              </ul>

              {config.viewAllText && (
                <a
                  href={config.viewAllLink || '/services'}
                  onClick={(e) => e.preventDefault()}
                  className="group inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors mt-3 cursor-pointer"
                >
                  <span>{config.viewAllText}</span>
                  <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </a>
              )}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center justify-between">
            <span>Synchronized via MongoDB Settings</span>
            <span className="text-emerald-400 font-bold">Live Synced</span>
          </div>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-sky-100 text-sky-800">
                  <Edit3 size={15} />
                </span>
                <h3 className="text-sm font-black text-slate-900">
                  {editingIndex !== null ? 'Edit Specialized Service Link' : 'Add Specialized Service Link'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitModal} className="p-6 space-y-4">
              {/* Quick Pick from Existing Database Services */}
              {availableDbServices.length > 0 && (
                <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-xl space-y-1">
                  <span className="text-[10.5px] font-bold text-sky-900 uppercase block">
                    Quick Pick From Catalog Services:
                  </span>
                  <select
                    className="form-select text-xs w-full py-1.5 px-2.5 rounded-lg border border-sky-200 bg-white"
                    onChange={(e) => handlePickDbService(e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select an existing service to auto-fill...
                    </option>
                    {availableDbServices.map((srv) => (
                      <option key={srv._id || srv.id} value={srv.title}>
                        {srv.title} ({srv.disciplineId})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Service Link Name / Title */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Link Text / Service Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Terrace & Roof Waterproofing"
                  value={formData.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({ ...formData, name: val });
                    handleAutoGenerateUrl(val, formData.disc);
                  }}
                  className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-200"
                />
              </div>

              {/* Discipline Pillar */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Discipline Pillar *
                </label>
                <select
                  value={formData.disc}
                  onChange={(e) => {
                    const newDisc = e.target.value;
                    setFormData({ ...formData, disc: newDisc });
                    handleAutoGenerateUrl(formData.name, newDisc);
                  }}
                  className="form-select text-xs w-full py-2 px-3 rounded-xl border border-slate-200 bg-white"
                >
                  {DISCIPLINE_OPTIONS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.id})
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Link URL */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-900">
                    Target Route / URL *
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAutoGenerateUrl(formData.name, formData.disc)}
                    className="text-[10px] text-sky-600 hover:underline font-bold"
                  >
                    Reset to standard query URL
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="/services?discipline=waterproofing&category=..."
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="form-input text-xs w-full py-2 px-3 rounded-xl border border-slate-200 font-mono text-[11px]"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Relative route (e.g. <code>/services?discipline=waterproofing&category=Terrace%20%26%20Roof%20Waterproofing</code>)
                </span>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Published in Footer</span>
                  <span className="text-[10px] text-slate-500">Enable to show this link in the live footer.</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 cursor-pointer"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary btn-sm text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm text-xs flex items-center gap-1.5"
                >
                  <Save size={13} />
                  <span>{editingIndex !== null ? 'Update Link' : 'Add Link'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
