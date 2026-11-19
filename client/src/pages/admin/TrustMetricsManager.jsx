import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  CheckCircle,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Sparkles,
  AlertCircle,
  X,
  Save,
  Check,
} from 'lucide-react';
import { fetchApi } from '../../utils/api';
import {
  DEFAULT_TRUST_METRICS,
  TRUST_METRIC_ICONS,
  TRUST_COLOR_PRESETS,
  resolveTrustIcon,
} from '../../utils/trustMetricsData';

export default function TrustMetricsManager() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingMetric, setEditingMetric] = useState(null);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState('');

  // Form State
  const initialForm = {
    value: '',
    label: '',
    icon: 'ShieldCheck',
    color: '#0284c7',
    order: 1,
    isActive: true,
  };
  const [formData, setFormData] = useState(initialForm);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadMetrics = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchApi('/admin/trust-metrics');
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setMetrics(res.data);
      } else {
        setMetrics(DEFAULT_TRUST_METRICS);
      }
    } catch (err) {
      console.warn('API error loading trust metrics:', err.message);
      setMetrics(DEFAULT_TRUST_METRICS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const openCreateModal = () => {
    setEditingMetric(null);
    setFormData({
      ...initialForm,
      order: metrics.length + 1,
    });
    setShowModal(true);
  };

  const openEditModal = (metric) => {
    setEditingMetric(metric);
    setFormData({
      value: metric.value || '',
      label: metric.label || '',
      icon: metric.icon || 'ShieldCheck',
      color: metric.color || '#0284c7',
      order: Number(metric.order) || 1,
      isActive: metric.isActive !== false,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.value.trim() || !formData.label.trim()) {
      alert('Please provide both a metric value and descriptive label.');
      return;
    }

    setSaving(true);
    try {
      if (editingMetric) {
        // Update
        const targetId = editingMetric._id;
        let updatedItem = { ...editingMetric, ...formData };

        try {
          const res = await fetchApi(`/admin/trust-metrics/${targetId}`, {
            method: 'PUT',
            body: JSON.stringify(formData),
          });
          if (res.success && res.data) {
            updatedItem = res.data;
          }
        } catch (apiErr) {
          console.warn('Server update error:', apiErr.message);
        }

        const nextMetrics = metrics.map((m) => (m._id === targetId ? updatedItem : m));
        setMetrics(nextMetrics);
        showToast(`Updated metric "${formData.value}" successfully!`);
      } else {
        // Create
        const newItemPayload = {
          ...formData,
          _id: `custom-metric-${Date.now()}`,
        };
        let finalItem = newItemPayload;

        try {
          const res = await fetchApi('/admin/trust-metrics', {
            method: 'POST',
            body: JSON.stringify(formData),
          });
          if (res.success && res.data) {
            finalItem = res.data;
          }
        } catch (apiErr) {
          console.warn('Server create error:', apiErr.message);
        }

        const nextMetrics = [...metrics, finalItem].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
        setMetrics(nextMetrics);
        showToast(`Created new metric "${formData.value}" successfully!`);
      }

      setShowModal(false);
    } catch (err) {
      alert(err.message || 'Failed to save trust metric.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, value) => {
    if (!window.confirm(`Are you sure you want to delete metric "${value}"?`)) return;

    try {
      try {
        await fetchApi(`/admin/trust-metrics/${id}`, { method: 'DELETE' });
      } catch (apiErr) {
        console.warn('Server delete error:', apiErr.message);
      }

      const nextMetrics = metrics.filter((m) => m._id !== id);
      setMetrics(nextMetrics);
      showToast(`Metric "${value}" deleted successfully.`);
    } catch (err) {
      alert(err.message || 'Failed to delete trust metric.');
    }
  };

  const handleToggleActive = async (metric) => {
    const updatedStatus = !metric.isActive;
    const nextItem = { ...metric, isActive: updatedStatus };

    try {
      try {
        await fetchApi(`/admin/trust-metrics/${metric._id}`, {
          method: 'PUT',
          body: JSON.stringify({ isActive: updatedStatus }),
        });
      } catch (apiErr) {
        console.warn('Server status toggle error:', apiErr.message);
      }

      const nextMetrics = metrics.map((m) => (m._id === metric._id ? nextItem : m));
      setMetrics(nextMetrics);
      showToast(`Metric "${metric.value}" is now ${updatedStatus ? 'Visible' : 'Hidden'}.`);
    } catch (err) {
      alert(err.message || 'Failed to toggle status.');
    }
  };

  const handleMoveOrder = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= metrics.length) return;

    const copy = [...metrics];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    // Recalculate order indices
    const reordered = copy.map((item, idx) => ({ ...item, order: idx + 1 }));
    setMetrics(reordered);

    // Async persist to server
    try {
      await Promise.all(
        reordered.map((m) =>
          fetchApi(`/admin/trust-metrics/${m._id}`, {
            method: 'PUT',
            body: JSON.stringify({ order: m.order }),
          }).catch(() => {})
        )
      );
      showToast('Order updated successfully!');
    } catch (e) {
      // Local state was already updated
    }
  };

  const handleResetToDefaults = async () => {
    const msg =
      'Are you sure you want to reset all Trust Metrics back to the 8 standard company defaults?\n\nThis will restore:\n1. 40+ Yrs (Continuous Contracting Practice)\n2. 3 Generations (Lineage & Family Trust)\n3. 1,450+ (Projects Waterproofed)\n4. Up to 10 Yrs (Written Warranty Options)\n5. IS 1346 & IS 3067 (Certified Standards)\n6. Fosroc, Sika & Dr. Fixit (Chemical Matrix)\n7. Thermal Moisture (Diagnostic Surveys)\n8. QR-Code Verified (Warranty Handover)';

    if (!window.confirm(msg)) return;

    setResetting(true);
    try {
      try {
        const res = await fetchApi('/admin/trust-metrics/init-defaults', { method: 'POST' });
        if (res.success && res.data) {
          setMetrics(res.data);
          showToast('Reset to 8 standard defaults in database successfully!');
          return;
        }
      } catch (apiErr) {
        console.warn('Server reset error:', apiErr.message);
      }

      setMetrics(DEFAULT_TRUST_METRICS);
      showToast('Reset to 8 standard defaults successfully!');
    } catch (err) {
      alert(err.message || 'Failed to reset trust metrics.');
    } finally {
      setResetting(false);
    }
  };

  const activeCount = metrics.filter((m) => m.isActive !== false).length;
  const hiddenCount = metrics.length - activeCount;

  // Selected icon component for modal preview
  const SelectedModalIcon = resolveTrustIcon(formData.icon);

  return (
    <div className="space-y-8 max-w-7xl pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-sky-50 text-sky-800 border border-sky-200 shadow-2xs mb-2">
            <ShieldCheck size={14} className="text-sky-600 shrink-0" />
            <span>Homepage Trust Grid</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Hero Trust Metrics Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, edit, reorder, or delete the 8 milestone credentials and guarantee badges displayed directly beneath the homepage hero banner.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            disabled={resetting}
            onClick={handleResetToDefaults}
            className="btn btn-secondary btn-sm text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Reset to 8 Company Defaults"
          >
            <RotateCcw size={13} className={resetting ? 'animate-spin' : ''} />
            <span>{resetting ? 'Resetting...' : 'Reset 8 Defaults'}</span>
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="btn btn-primary btn-sm text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Plus size={15} />
            <span>Add New Metric</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-xl text-xs border flex items-center gap-2.5 transition-all shadow-sm ${
            notification.type === 'error'
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}
        >
          {notification.type === 'error' ? (
            <AlertCircle size={16} className="text-rose-600 shrink-0" />
          ) : (
            <CheckCircle size={16} className="text-emerald-600 shrink-0" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Configured</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{metrics.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            {metrics.length}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Active On Homepage</div>
            <div className="text-2xl font-black text-emerald-600 mt-0.5">{activeCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Eye size={18} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Hidden / Draft</div>
            <div className="text-2xl font-black text-amber-600 mt-0.5">{hiddenCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <EyeOff size={18} />
          </div>
        </div>
      </div>

      {/* Live Homepage Simulation Preview */}
      <div className="card p-6 bg-slate-50/70 border-slate-200/90 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#029746]" />
            <h2 className="font-extrabold text-slate-900 text-sm">Live Homepage Appearance Simulation</h2>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">
            {activeCount} tiles currently visible on public site
          </span>
        </div>

        {/* The Exact Homepage Trust Container */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6 particle-bg">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 lg:divide-x lg:divide-slate-200/80 items-center">
            {metrics
              .filter((m) => m.isActive !== false)
              .slice(0, 4)
              .map((item, idx) => {
                const IconComponent = resolveTrustIcon(item.icon);
                return (
                  <div key={item._id || idx} className="flex items-center gap-3.5 px-2 lg:px-6">
                    <div
                      style={{ backgroundColor: item.color || '#0284c7' }}
                      className="w-11 h-11 rounded-full text-white flex items-center justify-center shrink-0 shadow-xs"
                    >
                      <IconComponent size={20} />
                    </div>
                    <div>
                      <div className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-none">
                        {item.value}
                      </div>
                      <div className="text-xs text-slate-600 font-medium leading-tight mt-1">{item.label}</div>
                    </div>
                  </div>
                );
              })}
          </div>

          {activeCount > 4 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 lg:divide-x lg:divide-slate-200/80 items-center border-t border-slate-100 pt-4 mt-4">
              {metrics
                .filter((m) => m.isActive !== false)
                .slice(4)
                .map((item, idx) => {
                  const IconComponent = resolveTrustIcon(item.icon);
                  return (
                    <div key={item._id || idx + 4} className="flex items-center gap-3.5 px-2 lg:px-6">
                      <div
                        style={{ backgroundColor: item.color || '#0284c7' }}
                        className="w-11 h-11 rounded-full text-white flex items-center justify-center shrink-0 shadow-xs"
                      >
                        <IconComponent size={20} />
                      </div>
                      <div>
                        <div className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                          {item.value}
                        </div>
                        <div className="text-xs text-slate-600 font-medium leading-tight mt-0.5">{item.label}</div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Trust Metrics Data Table */}
      <div className="card bg-white border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-sm">Configured Hero Metrics List ({metrics.length})</h2>
          <span className="text-xs text-slate-400">Use arrow buttons to adjust display order</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading trust metrics...</div>
        ) : metrics.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 space-y-3">
            <p>No trust metrics configured yet.</p>
            <button onClick={handleResetToDefaults} className="btn btn-secondary btn-sm text-xs">
              Restore 8 Company Defaults
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 w-14 text-center">Order</th>
                  <th className="py-3 px-4 w-16 text-center">Icon</th>
                  <th className="py-3 px-4">Primary Value</th>
                  <th className="py-3 px-4">Subtitle / Trust Credential</th>
                  <th className="py-3 px-4 w-28 text-center">Status</th>
                  <th className="py-3 px-4 w-40 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {metrics.map((metric, index) => {
                  const IconComp = resolveTrustIcon(metric.icon);
                  const isVisible = metric.isActive !== false;

                  return (
                    <tr
                      key={metric._id || index}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        !isVisible ? 'bg-slate-50/50 opacity-60' : ''
                      }`}
                    >
                      {/* Order and Reorder Arrows */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="w-5 text-center font-bold text-slate-700">{index + 1}</span>
                          <div className="flex flex-col">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => handleMoveOrder(index, 'up')}
                              className="p-0.5 text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                              title="Move up"
                            >
                              <MoveUp size={12} />
                            </button>
                            <button
                              type="button"
                              disabled={index === metrics.length - 1}
                              onClick={() => handleMoveOrder(index, 'down')}
                              className="p-0.5 text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                              title="Move down"
                            >
                              <MoveDown size={12} />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Icon with Color */}
                      <td className="py-3 px-4 text-center">
                        <div
                          style={{ backgroundColor: metric.color || '#0284c7' }}
                          className="w-9 h-9 rounded-full text-white inline-flex items-center justify-center shadow-2xs"
                        >
                          <IconComp size={16} />
                        </div>
                      </td>

                      {/* Primary Value */}
                      <td className="py-3 px-4 font-black text-slate-900 text-sm tracking-tight">{metric.value}</td>

                      {/* Subtitle Label */}
                      <td className="py-3 px-4 text-slate-600 font-medium">{metric.label}</td>

                      {/* Active Status Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(metric)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                            isVisible
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                          <span>{isVisible ? 'Active' : 'Hidden'}</span>
                        </button>
                      </td>

                      {/* Edit & Delete Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(metric)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer"
                            title="Edit Metric"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(metric._id, metric.value)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Metric"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Create or Edit Trust Metric */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 my-8">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#029746]" />
                <h3 className="font-extrabold text-slate-900 text-sm">
                  {editingMetric ? 'Edit Trust Metric' : 'Add New Trust Metric'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5 text-xs">
              {/* Live Modal Preview Tile */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Live Tile Preview
                </span>
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
                  <div
                    style={{ backgroundColor: formData.color || '#0284c7' }}
                    className="w-11 h-11 rounded-full text-white flex items-center justify-center shrink-0 shadow-xs"
                  >
                    <SelectedModalIcon size={20} />
                  </div>
                  <div>
                    <div className="text-lg font-black text-slate-900 tracking-tight leading-none">
                      {formData.value || '40+ Yrs'}
                    </div>
                    <div className="text-xs text-slate-600 font-medium leading-tight mt-1">
                      {formData.label || 'Continuous Contracting Practice'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Metric Value */}
              <div>
                <label className="form-label text-xs font-bold text-slate-800">
                  Primary Highlight Value * <span className="text-slate-400 font-normal">(e.g. 40+ Yrs, 1,450+, IS 1346)</span>
                </label>
                <input
                  type="text"
                  required
                  className="form-input text-xs font-black tracking-tight"
                  placeholder="40+ Yrs"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                />
              </div>

              {/* Metric Label */}
              <div>
                <label className="form-label text-xs font-bold text-slate-800">
                  Credential / Subtitle Label * <span className="text-slate-400 font-normal">(e.g. Continuous Contracting Practice)</span>
                </label>
                <input
                  type="text"
                  required
                  className="form-input text-xs"
                  placeholder="Continuous Contracting Practice"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                />
              </div>

              {/* Icon Picker */}
              <div className="space-y-2">
                <label className="form-label text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Metric Icon</span>
                  <span className="text-[10.5px] font-normal text-slate-500">Selected: {formData.icon}</span>
                </label>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {TRUST_METRIC_ICONS.map((item) => {
                    const IconComp = item.icon;
                    const isSelected = formData.icon === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: item.id })}
                        className={`p-2 rounded-xl flex flex-col items-center gap-1 text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-sky-600 text-white font-bold shadow-xs scale-105'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/70'
                        }`}
                        title={item.label}
                      >
                        <IconComp size={16} />
                        <span className="text-[9px] truncate max-w-full block leading-none">{item.id}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Icon Accent Color */}
              <div className="space-y-2">
                <label className="form-label text-xs font-bold text-slate-800">Icon Background Color</label>
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-9 rounded-lg overflow-hidden border border-slate-300 shadow-2xs shrink-0 cursor-pointer">
                    <input
                      type="color"
                      className="absolute -inset-2 w-16 h-16 cursor-pointer border-0 p-0"
                      value={formData.color || '#0284c7'}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      title="Pick custom color"
                    />
                  </div>
                  <input
                    type="text"
                    className="form-input text-xs font-mono font-bold"
                    placeholder="#0284c7"
                    value={formData.color || '#0284c7'}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                </div>

                {/* Color Swatches */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {TRUST_COLOR_PRESETS.map((c) => {
                    const isSelected = (formData.color || '#0284c7').toLowerCase() === c.hex.toLowerCase();
                    return (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: c.hex })}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] border cursor-pointer ${
                          isSelected
                            ? 'border-slate-800 bg-slate-900 text-white font-bold'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.hex }} />
                        <span>{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Order and Active status */}
              <div className="grid grid-cols-2 gap-4 pt-1 border-t border-slate-100">
                <div>
                  <label className="form-label text-xs font-bold text-slate-800">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    className="form-input text-xs"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) || 1 })}
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="inline-flex items-center gap-2 cursor-pointer pb-2">
                    <input
                      type="checkbox"
                      className="form-checkbox rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <span className="text-xs font-bold text-slate-800">Active (Visible on Site)</span>
                  </label>
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary btn-sm text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary btn-sm text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Save size={14} />
                  <span>{saving ? 'Saving...' : editingMetric ? 'Update Metric' : 'Create Metric'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
