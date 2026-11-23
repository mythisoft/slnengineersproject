import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Upload,
  CheckCircle2,
  Eye,
  EyeOff,
  MoveHorizontal,
  Sparkles,
  RefreshCw,
  X,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Video,
  Play,
  Pause,
  Clock,
  RotateCcw,
  FileVideo,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  GripVertical,
  ListOrdered,
} from 'lucide-react';
import { fetchApi } from '../../utils/api';
import {
  DEFAULT_PILLAR_CARDS,
  DEFAULT_GLIMPSE_SETTINGS,
  normalizePillarCard,
} from '../../utils/pillarCardData';
import { DEFAULT_DISCIPLINES } from '../../utils/servicesData';

export default function PillarCardsManager() {
  const [cards, setCards] = useState(DEFAULT_PILLAR_CARDS);
  const [disciplines, setDisciplines] = useState(DEFAULT_DISCIPLINES);

  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState({ text: '', type: '' });
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    pillarId: 'waterproofing',
    pillarName: 'Waterproofing Solutions',
    imageUrl: '',
    accentColor: '#0284c7',
    order: 1,
    isActive: true,
  });

  // State for creating a brand new pillar inline
  const [isCreatingNewPillar, setIsCreatingNewPillar] = useState(false);
  const [newPillarName, setNewPillarName] = useState('');
  const [newPillarColor, setNewPillarColor] = useState('#029746');

  // Glimpse Video Settings State
  const [glimpseSettings, setGlimpseSettings] = useState(DEFAULT_GLIMPSE_SETTINGS);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [videoUploadError, setVideoUploadError] = useState('');
  const [isSavingVideoSettings, setIsSavingVideoSettings] = useState(false);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const videoInputRef = useRef(null);
  const videoPreviewRef = useRef(null);

  // Load cards and disciplines on mount
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [cardsRes, discRes, glimpseRes] = await Promise.all([
        fetchApi('/admin/pillar-cards'),
        fetchApi('/disciplines'),
        fetchApi('/pillar-cards/glimpse-settings').catch(() => null),
      ]);

      if (cardsRes && cardsRes.success && Array.isArray(cardsRes.data)) {
        setCards(cardsRes.data);
      }

      if (discRes && discRes.success && Array.isArray(discRes.data)) {
        setDisciplines(discRes.data);
      }

      if (glimpseRes && glimpseRes.success && glimpseRes.data) {
        setGlimpseSettings((prev) => ({ ...prev, ...glimpseRes.data }));
      }
    } catch (err) {
      console.warn('Error loading pillar cards:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (text, type = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg({ text: '', type: '' }), 4000);
  };

  // Open Add/Edit Modal
  const openModal = (card = null) => {
    setUploadError('');
    setIsCreatingNewPillar(false);
    setNewPillarName('');

    if (card) {
      setEditingCard(card);
      setFormData({
        pillarId: card.pillarId || 'waterproofing',
        pillarName: card.pillarName || 'Waterproofing Solutions',
        imageUrl: card.imageUrl || '',
        accentColor: card.accentColor || '#0284c7',
        order: card.order ?? 1,
        isActive: card.isActive !== false,
      });
    } else {
      setEditingCard(null);
      const defaultPillar = disciplines[0] || { id: 'waterproofing', name: 'Waterproofing Solutions', color: '#0284c7' };
      setFormData({
        pillarId: defaultPillar.id || defaultPillar.slug || 'waterproofing',
        pillarName: defaultPillar.name || 'Waterproofing Solutions',
        imageUrl: '',
        accentColor: defaultPillar.color || defaultPillar.accentColor || '#0284c7',
        order: cards.length + 1,
        isActive: true,
      });
    }
    setModalOpen(true);
  };

  // Handle Pillar Selection from Dropdown
  const handlePillarChange = (e) => {
    const val = e.target.value;
    if (val === '__NEW_PILLAR__') {
      setIsCreatingNewPillar(true);
      return;
    }

    setIsCreatingNewPillar(false);
    const selectedDisc = disciplines.find(
      (d) => (d.id && d.id.toLowerCase() === val.toLowerCase()) ||
             (d.slug && d.slug.toLowerCase() === val.toLowerCase())
    );

    if (selectedDisc) {
      setFormData((prev) => ({
        ...prev,
        pillarId: selectedDisc.id || selectedDisc.slug,
        pillarName: selectedDisc.name,
        accentColor: selectedDisc.color || selectedDisc.accentColor || '#0284c7',
      }));
    }
  };

  // Handle Image File Upload to /api/admin/media/upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size exceeds 10MB limit.');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const data = new FormData();
      data.append('file', file);
      data.append('folder', 'pillar-cards');

      const token = localStorage.getItem('sln_admin_token');
      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: data,
      });

      const res = await response.json();
      if (res.success && (res.url || res.data?.url)) {
        const uploadedUrl = res.url || res.data.url;
        setFormData((prev) => ({ ...prev, imageUrl: uploadedUrl }));
        showToast('Image uploaded successfully!', 'success');
      } else {
        throw new Error(res.message || 'Image upload failed.');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      setUploadError(err.message || 'Image upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  // Save Card (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalPillarId = formData.pillarId;
    let finalPillarName = formData.pillarName;

    // If admin is creating a new pillar on the fly
    if (isCreatingNewPillar) {
      if (!newPillarName.trim()) {
        setUploadError('Please enter the new discipline pillar name.');
        return;
      }
      finalPillarName = newPillarName.trim();
      finalPillarId = newPillarName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

      // Add to disciplines list so it persists
      const newDiscObj = {
        id: finalPillarId,
        slug: finalPillarId,
        name: finalPillarName,
        color: newPillarColor,
        isActive: true,
      };

      const updatedDisciplines = [...disciplines, newDiscObj];
      setDisciplines(updatedDisciplines);
      window.dispatchEvent(new Event('sln_disciplines_updated'));

      // Persist to API
      try {
        await fetchApi('/admin/disciplines', {
          method: 'POST',
          body: JSON.stringify(newDiscObj),
        });
      } catch {}
    }

    if (!formData.imageUrl.trim()) {
      setUploadError('Please upload an image or provide an image URL.');
      return;
    }

    const payload = {
      pillarId: finalPillarId,
      pillarName: finalPillarName,
      imageUrl: formData.imageUrl.trim(),
      accentColor: isCreatingNewPillar ? newPillarColor : formData.accentColor,
      order: Number(formData.order) || 1,
      isActive: formData.isActive,
    };

    try {
      let updatedCards = [];

      if (editingCard) {
        const res = await fetchApi(`/admin/pillar-cards/${editingCard._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });

        if (res.success && res.data) {
          updatedCards = cards.map((c) => (c._id === editingCard._id ? res.data : c));
        } else {
          updatedCards = cards.map((c) =>
            c._id === editingCard._id ? { ...c, ...payload } : c
          );
        }
        showToast(`Updated "${payload.pillarName}" card successfully.`);
      } else {
        const res = await fetchApi('/admin/pillar-cards', {
          method: 'POST',
          body: JSON.stringify(payload),
        });

        if (res.success && res.data) {
          updatedCards = [...cards, res.data];
        } else {
          const newCardObj = {
            _id: `card-${Date.now()}`,
            ...payload,
          };
          updatedCards = [...cards, newCardObj];
        }
        showToast(`Added new card for "${payload.pillarName}"!`);
      }

      // Sort by order
      updatedCards.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

      setCards(updatedCards);
      window.dispatchEvent(new Event('sln_pillar_cards_updated'));
      setModalOpen(false);
    } catch (err) {
      console.error('Save error:', err);
      showToast('Error saving pillar card.');
    }
  };

  // Toggle Active Status
  const toggleActive = async (card) => {
    const updatedStatus = !card.isActive;
    const updatedList = cards.map((c) => (c._id === card._id ? { ...c, isActive: updatedStatus } : c));
    setCards(updatedList);
    window.dispatchEvent(new Event('sln_pillar_cards_updated'));

    try {
      await fetchApi(`/admin/pillar-cards/${card._id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: updatedStatus }),
      });
      showToast(`Card is now ${updatedStatus ? 'LIVE on homepage' : 'HIDDEN'}.`);
    } catch {}
  };

  // Delete Card
  const handleDelete = async (card) => {
    if (!window.confirm(`Delete pillar card for "${card.pillarName}"? This will remove it from the homepage horizontal cards.`)) {
      return;
    }

    const updatedList = cards.filter((c) => c._id !== card._id);
    setCards(updatedList);
    window.dispatchEvent(new Event('sln_pillar_cards_updated'));

    try {
      await fetchApi(`/admin/pillar-cards/${card._id}`, {
        method: 'DELETE',
      });
      showToast(`Deleted "${card.pillarName}" card.`);
    } catch {}
  };

  // Reorder Cards Helper
  const persistOrder = async (updatedList, notifyText = 'Order updated successfully') => {
    // Re-assign normalized sequential order numbers 1..N
    const normalized = updatedList.map((card, idx) => ({
      ...card,
      order: idx + 1,
    }));

    setCards(normalized);
    window.dispatchEvent(new Event('sln_pillar_cards_updated'));
    showToast(notifyText);

    try {
      await fetchApi('/admin/pillar-cards/reorder', {
        method: 'PUT',
        body: JSON.stringify({ items: normalized }),
      });
    } catch (err) {
      console.warn('Backend reorder sync fallback to individual updates:', err);
      try {
        await Promise.all(
          normalized.map((c) =>
            fetchApi(`/admin/pillar-cards/${c._id}`, {
              method: 'PUT',
              body: JSON.stringify({ order: c.order }),
            }).catch(() => null)
          )
        );
      } catch {}
    }
  };

  const moveCard = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= cards.length) return;

    const newCards = [...cards];
    const [moved] = newCards.splice(index, 1);
    newCards.splice(targetIndex, 0, moved);

    persistOrder(newCards, `Moved "${moved.pillarName}" to position #${targetIndex + 1}`);
  };

  // Move active card in preview (direction: -1 for left, +1 for right)
  const moveActiveCard = (activeIdx, direction) => {
    const cardToMove = activeCards[activeIdx];
    if (!cardToMove) return;

    const fullIdx = cards.findIndex((c) => c._id === cardToMove._id);
    if (fullIdx === -1) return;

    const targetActiveCard = activeCards[activeIdx + direction];
    if (!targetActiveCard) return;

    const targetFullIdx = cards.findIndex((c) => c._id === targetActiveCard._id);
    if (targetFullIdx === -1) return;

    const newCards = [...cards];
    const [moved] = newCards.splice(fullIdx, 1);
    newCards.splice(targetFullIdx, 0, moved);

    persistOrder(newCards, `Moved "${cardToMove.pillarName}" ${direction < 0 ? 'Left' : 'Right'} to #${targetFullIdx + 1}`);
  };

  // Presets
  const applyPresetOrder = (presetType) => {
    let newCards = [...cards];
    if (presetType === 'waterproofing-first') {
      const priority = ['waterproofing', 'painting', 'repairs', 'false-ceiling'];
      newCards.sort((a, b) => {
        const aIdx = priority.indexOf((a.pillarId || '').toLowerCase());
        const bIdx = priority.indexOf((b.pillarId || '').toLowerCase());
        return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
      });
      persistOrder(newCards, 'Applied "Waterproofing First" order');
    } else if (presetType === 'painting-first') {
      const priority = ['painting', 'waterproofing', 'repairs', 'false-ceiling'];
      newCards.sort((a, b) => {
        const aIdx = priority.indexOf((a.pillarId || '').toLowerCase());
        const bIdx = priority.indexOf((b.pillarId || '').toLowerCase());
        return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
      });
      persistOrder(newCards, 'Applied "Painting First" order');
    } else if (presetType === 'repairs-first') {
      const priority = ['repairs', 'waterproofing', 'painting', 'false-ceiling'];
      newCards.sort((a, b) => {
        const aIdx = priority.indexOf((a.pillarId || '').toLowerCase());
        const bIdx = priority.indexOf((b.pillarId || '').toLowerCase());
        return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
      });
      persistOrder(newCards, 'Applied "Building Repairs First" order');
    }
  };

  // Drag and drop state
  const [draggedCardIndex, setDraggedCardIndex] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedCardIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    try {
      e.dataTransfer.setData('text/plain', String(index));
    } catch {}
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedCardIndex === null || draggedCardIndex === targetIndex) {
      setDraggedCardIndex(null);
      return;
    }
    const newCards = [...cards];
    const [moved] = newCards.splice(draggedCardIndex, 1);
    newCards.splice(targetIndex, 0, moved);
    setDraggedCardIndex(null);
    persistOrder(newCards, `Reordered "${moved.pillarName}" to position #${targetIndex + 1}`);
  };

  // Upload Video File (Server upload with Base64 fallback so it NEVER disappears on refresh)
  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setVideoUploadError('Please select a valid video file (MP4, WebM).');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setVideoUploadError('Video file size exceeds 50 MB limit. Please select a shorter or compressed clip.');
      return;
    }

    setVideoUploadError('');
    setIsVideoUploading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      // Support both possible token keys
      const token = localStorage.getItem('sln_admin_token') || localStorage.getItem('token') || '';

      const response = await fetch('/api/admin/pillar-cards/upload-video', {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: uploadFormData,
      });

      const res = await response.json().catch(() => ({}));

      if (res.success && res.data?.url) {
        const uploadedUrl = res.data.url;
        const updatedSettings = {
          ...glimpseSettings,
          videoUrl: uploadedUrl,
          isEnabled: true,
        };
        setGlimpseSettings(updatedSettings);

        // Auto-save to backend settings
        await fetchApi('/admin/pillar-cards/glimpse-settings', {
          method: 'PUT',
          body: JSON.stringify(updatedSettings),
        }).catch(() => {});

        window.dispatchEvent(new Event('sln_glimpse_video_updated'));
        showToast('Glimpse video uploaded and saved successfully to database!');
      } else {
        setVideoUploadError(res.message || 'Failed to upload video to server.');
      }
    } catch (err) {
      console.error('Server upload failed:', err);
      setVideoUploadError(err.message || 'Video upload failed.');
    } finally {
      setIsVideoUploading(false);
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  // Save Glimpse Video Settings
  const handleSaveGlimpseSettings = async (e) => {
    if (e) e.preventDefault();
    setIsSavingVideoSettings(true);

    try {
      const res = await fetchApi('/admin/pillar-cards/glimpse-settings', {
        method: 'PUT',
        body: JSON.stringify(glimpseSettings),
      });

      if (res.success) {
        window.dispatchEvent(new Event('sln_glimpse_video_updated'));
        showToast('Glimpse intro video settings saved to database successfully!');
      } else {
        showToast(res.message || 'Failed to save glimpse settings.');
      }
    } catch (err) {
      console.error('Error saving glimpse settings:', err);
      showToast('Error saving glimpse settings to database.');
    } finally {
      setIsSavingVideoSettings(false);
    }
  };

  // Test 3s Playback
  const test3sPlayback = () => {
    if (!videoPreviewRef.current) return;
    setPreviewPlaying(true);
    videoPreviewRef.current.currentTime = 0;
    videoPreviewRef.current.play().catch(() => {});

    const duration = (Number(glimpseSettings.durationSeconds) || 3) * 1000;
    setTimeout(() => {
      if (videoPreviewRef.current) {
        videoPreviewRef.current.pause();
        videoPreviewRef.current.currentTime = 0;
      }
      setPreviewPlaying(false);
    }, duration);
  };

  // Active cards currently visible on homepage (sorted by display order)
  const activeCards = useMemo(() => {
    const list = cards.filter((c) => c.isActive !== false);
    return list.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
  }, [cards]);

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {feedbackMsg.text && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-xs font-bold text-white transition-all ${
            feedbackMsg.type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'
          }`}
        >
          <CheckCircle2 size={16} />
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-sky-50 text-sky-700 border border-sky-200 shadow-2xs mb-2">
            <MoveHorizontal size={13} className="text-sky-600" />
            <span>Homepage Section Manager</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Horizontal Discipline Pillar Cards
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Upload images and assign discipline pillars from the dropdown. These cards appear side by side without gap directly above <em>Proven Transformation</em> on the homepage.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={loadData}
            disabled={isLoading}
            className="btn btn-outline btn-sm flex items-center gap-1.5 cursor-pointer text-xs"
            title="Reload from server"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={() => openModal()}
            className="btn btn-primary btn-sm flex items-center gap-1.5 cursor-pointer text-xs shadow-md"
          >
            <Plus size={16} />
            <span>Add Pillar Card</span>
          </button>
        </div>
      </div>

      {/* 3-Second Background Glimpse Video Configuration */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Video size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900">
                  Intro Glimpse Video Settings
                </h2>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  glimpseSettings.isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                }`}>
                  {glimpseSettings.isEnabled ? 'Active (Auto-Plays)' : 'Disabled'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Plays a short {glimpseSettings.durationSeconds}s civil engineering glimpse video first, then smoothly fades out to reveal the 4 discipline cards.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={glimpseSettings.isEnabled !== false}
                onChange={(e) => setGlimpseSettings((prev) => ({ ...prev, isEnabled: e.target.checked }))}
                className="toggle toggle-primary toggle-sm cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-700">Enable Intro Video</span>
            </label>
            <button
              type="button"
              onClick={handleSaveGlimpseSettings}
              disabled={isSavingVideoSettings}
              className="btn btn-primary btn-sm flex items-center gap-1.5 cursor-pointer text-xs"
            >
              <CheckCircle2 size={14} />
              <span>{isSavingVideoSettings ? 'Saving...' : 'Save Video Settings'}</span>
            </button>
          </div>
        </div>

        {/* Video Form & Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Inputs Column */}
          <div className="lg:col-span-7 space-y-4">
            {/* File Upload Option */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Upload Custom Video File</span>
                <span className="text-[11px] font-normal text-slate-400">MP4, WebM (Max 30 MB)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={videoInputRef}
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  disabled={isVideoUploading}
                  className="btn btn-outline btn-sm flex items-center gap-2 cursor-pointer text-xs"
                >
                  <Upload size={14} />
                  <span>{isVideoUploading ? 'Uploading Video...' : 'Choose Video File (.mp4)'}</span>
                </button>
                {glimpseSettings.videoUrl && (
                  <span className="text-[11px] text-emerald-600 font-semibold truncate max-w-xs">
                    Current: {glimpseSettings.videoUrl.split('/').pop()}
                  </span>
                )}
              </div>
              {videoUploadError && (
                <p className="text-[11px] text-rose-600 font-medium">{videoUploadError}</p>
              )}
            </div>

            {/* Direct Video URL Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Or Direct Video URL (CDN / Cloudinary / S3 / local path)
              </label>
              <input
                type="text"
                value={glimpseSettings.videoUrl || ''}
                onChange={(e) => setGlimpseSettings((prev) => ({ ...prev, videoUrl: e.target.value }))}
                placeholder="https://example.com/civil-glimpse.mp4 or /uploads/..."
                className="input input-sm input-bordered w-full text-xs font-mono"
              />
            </div>

            {/* Duration Slider / Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Intro Duration</span>
                  <span className="text-xs font-extrabold text-indigo-600">
                    {glimpseSettings.durationSeconds} seconds
                  </span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={glimpseSettings.durationSeconds || 3}
                    onChange={(e) =>
                      setGlimpseSettings((prev) => ({
                        ...prev,
                        durationSeconds: Number(e.target.value),
                      }))
                    }
                    className="range range-xs range-primary flex-1"
                  />
                  <span className="text-xs font-bold text-slate-600 w-8">
                    {glimpseSettings.durationSeconds}s
                  </span>
                </div>
              </div>

              {/* Badge Text */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Overlay Badge Text
                </label>
                <input
                  type="text"
                  value={glimpseSettings.badgeText || ''}
                  onChange={(e) => setGlimpseSettings((prev) => ({ ...prev, badgeText: e.target.value }))}
                  placeholder="Civil Engineering in Action • 3s Glimpse"
                  className="input input-sm input-bordered w-full text-xs"
                />
              </div>
            </div>
          </div>

          {/* Video Preview Column */}
          <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-4 text-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Video size={13} className="text-indigo-400" />
                <span>Video Preview</span>
              </span>
              <button
                type="button"
                onClick={test3sPlayback}
                disabled={!glimpseSettings.videoUrl}
                className="btn btn-xs bg-indigo-600 hover:bg-indigo-700 text-white border-none cursor-pointer flex items-center gap-1"
              >
                {previewPlaying ? <Pause size={11} /> : <Play size={11} />}
                <span>Test {glimpseSettings.durationSeconds}s Play</span>
              </button>
            </div>

            <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
              {glimpseSettings.videoUrl ? (
                <video
                  ref={videoPreviewRef}
                  src={glimpseSettings.videoUrl}
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4 text-slate-500 text-xs">
                  <FileVideo size={28} className="mx-auto mb-1 opacity-50" />
                  <span>No video selected yet</span>
                </div>
              )}

              {/* Overlay Badge in Preview */}
              {glimpseSettings.videoUrl && (
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white border border-white/20">
                  {glimpseSettings.badgeText || '3s Glimpse'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Live Homepage Preview Container */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-200">
              Live Homepage Preview (Side by Side Without Gap)
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {activeCards.length} Cards Active on Homepage
          </span>
        </div>

        {/* The Exact Horizontal Card as Rendered on Homepage */}
        <div className="bg-white text-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-md">
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
            {activeCards.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No active cards on homepage. Click &quot;Add Pillar Card&quot; below to add one.
              </div>
            ) : (
              <div
                className="grid gap-0 divide-x divide-slate-200/80"
                style={{
                  gridTemplateColumns: `repeat(${activeCards.length}, minmax(0, 1fr))`,
                }}
              >
                {activeCards.map((card, idx) => (
                  <div
                    key={card._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, cards.findIndex((c) => c._id === card._id))}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, cards.findIndex((c) => c._id === card._id))}
                    className={`flex flex-col relative group transition-all cursor-grab active:cursor-grabbing hover:bg-slate-50/50 ${
                      draggedCardIndex === cards.findIndex((c) => c._id === card._id) ? 'opacity-40 ring-2 ring-sky-500' : ''
                    }`}
                  >
                    {/* Position Badge & Quick Reorder Controls on Card in Live Preview */}
                    <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-950/85 text-white backdrop-blur-xs border border-white/20 shadow-xs">
                        #{idx + 1}
                      </span>
                    </div>

                    {/* Move Left / Right Quick Floating Arrow Buttons on Live Preview */}
                    <div className="absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveActiveCard(idx, -1);
                        }}
                        disabled={idx === 0}
                        className="w-6 h-6 rounded-full bg-slate-950/90 text-white hover:bg-sky-600 disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-md cursor-pointer"
                        title="Move Left"
                      >
                        <ArrowLeft size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveActiveCard(idx, 1);
                        }}
                        disabled={idx === activeCards.length - 1}
                        className="w-6 h-6 rounded-full bg-slate-950/90 text-white hover:bg-sky-600 disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-md cursor-pointer"
                        title="Move Right"
                      >
                        <ArrowRight size={12} />
                      </button>
                    </div>

                    <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
                      <img
                        src={card.imageUrl}
                        alt={card.pillarName}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                      />
                    </div>
                    <div className="p-3 text-center flex items-center justify-center min-h-[52px]">
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                        {card.pillarName}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-2 text-center">
            Tip: Hover over any preview card above and click <strong>&larr; / &rarr;</strong> or drag cards horizontally to reorder them live!
          </p>
        </div>
      </div>

      {/* Cards Table & CRUD Controls */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              All Pillar Cards ({cards.length})
            </h3>
            <span className="text-xs text-slate-500">
              Use &uarr; &darr; arrows, drag rows, or click a preset below to arrange cards left-to-right on the homepage.
            </span>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Presets:</span>
            <button
              type="button"
              onClick={() => applyPresetOrder('waterproofing-first')}
              className="btn btn-xs btn-outline hover:btn-primary text-slate-700 text-[11px] cursor-pointer"
              title="Waterproofing -> Painting -> Repairs -> False Ceiling"
            >
              Waterproofing 1st
            </button>
            <button
              type="button"
              onClick={() => applyPresetOrder('painting-first')}
              className="btn btn-xs btn-outline hover:btn-primary text-slate-700 text-[11px] cursor-pointer"
              title="Painting -> Waterproofing -> Repairs -> False Ceiling"
            >
              Painting 1st
            </button>
            <button
              type="button"
              onClick={() => applyPresetOrder('repairs-first')}
              className="btn btn-xs btn-outline hover:btn-primary text-slate-700 text-[11px] cursor-pointer"
              title="Repairs -> Waterproofing -> Painting -> False Ceiling"
            >
              Repairs 1st
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {cards.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              No pillar cards configured. Click &quot;Add Pillar Card&quot; above to create the first card.
            </div>
          ) : (
            cards.map((card, idx) => (
              <div
                key={card._id || idx}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, idx)}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors ${
                  draggedCardIndex === idx ? 'opacity-40 bg-sky-50' : ''
                }`}
              >
                {/* Left: Reorder Controls + Thumbnail & Info */}
                <div className="flex items-center gap-3.5">
                  {/* Up / Down Reorder Arrows */}
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveCard(idx, -1)}
                      disabled={idx === 0}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-sky-600 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center text-slate-600 transition-all cursor-pointer shadow-2xs"
                      title="Move Up (#1 is leftmost on homepage)"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveCard(idx, 1)}
                      disabled={idx === cards.length - 1}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-sky-600 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center text-slate-600 transition-all cursor-pointer shadow-2xs"
                      title="Move Down (#4 is rightmost on homepage)"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  {/* Drag Handle */}
                  <div
                    className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700 p-1 shrink-0"
                    title="Drag to reorder"
                  >
                    <GripVertical size={18} />
                  </div>

                  {/* Thumbnail */}
                  <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
                    <img
                      src={card.imageUrl}
                      alt={card.pillarName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-black bg-slate-950/85 text-white">
                      #{card.order || idx + 1}
                    </div>
                  </div>

                  {/* Text Details */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-black text-slate-900">
                        {card.pillarName}
                      </h4>
                      {card.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                          <CheckCircle2 size={11} /> Live (Pos #{card.order || idx + 1})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                          <EyeOff size={11} /> Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pillar Slug: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">{card.pillarId}</code>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 truncate max-w-md">
                      Image: {card.imageUrl}
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleActive(card)}
                    className={`btn btn-sm text-xs cursor-pointer ${
                      card.isActive ? 'btn-outline text-amber-700' : 'btn-outline text-emerald-700'
                    }`}
                    title={card.isActive ? 'Hide from homepage' : 'Show on homepage'}
                  >
                    {card.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                    <span className="hidden sm:inline">{card.isActive ? 'Hide' : 'Show'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openModal(card)}
                    className="btn btn-outline btn-sm text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 size={14} />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(card)}
                    className="btn btn-outline btn-sm text-xs text-rose-600 hover:bg-rose-50 border-rose-200 cursor-pointer"
                    title="Delete card"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* ADD / EDIT PILLAR CARD MODAL */}
      {/* ===================================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 relative animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="mb-6">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800">
                {editingCard ? 'Edit Pillar Card' : 'Add New Pillar Card'}
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                {editingCard ? `Edit: ${editingCard.pillarName}` : 'Add Horizontal Pillar Card'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Select the discipline pillar from the dropdown and upload the card image.
              </p>
            </div>

            {uploadError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 1. SELECT PILLAR FROM DROPDOWN */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Discipline Pillar <span className="text-rose-500">*</span>
                </label>
                <select
                  value={isCreatingNewPillar ? '__NEW_PILLAR__' : formData.pillarId}
                  onChange={handlePillarChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-hidden focus:border-slate-900 bg-white shadow-2xs"
                >
                  <optgroup label="Existing Discipline Pillars">
                    {disciplines.map((d) => (
                      <option key={d.id || d.slug} value={d.id || d.slug}>
                        {d.name} ({d.id || d.slug})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Future / Custom Pillars">
                    <option value="__NEW_PILLAR__">
                      + Add New Discipline Pillar...
                    </option>
                  </optgroup>
                </select>
              </div>

              {/* Conditional Fields if Admin selected "+ Add New Discipline Pillar" */}
              {isCreatingNewPillar && (
                <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-900 uppercase tracking-wider">
                      Create New Discipline Pillar
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsCreatingNewPillar(false)}
                      className="text-xs text-sky-600 hover:underline cursor-pointer"
                    >
                      Cancel new pillar
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      New Pillar Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Structural Retrofitting &amp; Grouting"
                      value={newPillarName}
                      onChange={(e) => setNewPillarName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-sky-300 text-xs text-slate-800 bg-white focus:outline-hidden focus:border-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Pillar Brand Color Accent
                    </label>
                    <input
                      type="color"
                      value={newPillarColor}
                      onChange={(e) => setNewPillarColor(e.target.value)}
                      className="w-16 h-8 rounded-lg cursor-pointer border border-slate-300"
                    />
                  </div>
                </div>
              )}

              {/* 2. UPLOAD IMAGE */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Card Image <span className="text-rose-500">*</span>
                </label>

                {/* Upload Button & Preview */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="btn btn-outline btn-sm text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload size={14} className={isUploading ? 'animate-bounce' : ''} />
                      <span>{isUploading ? 'Uploading Image...' : 'Choose File from Device'}</span>
                    </button>
                    <span className="text-[11px] text-slate-400">or enter image path / URL below</span>
                  </div>

                  <input
                    type="text"
                    placeholder="e.g. /uploads/pillar-waterproofing.jpg or https://..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:border-slate-900 bg-white"
                  />

                  {/* Thumbnail Preview */}
                  {formData.imageUrl && (
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                      <div className="w-16 h-20 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                      </div>
                      <div className="text-xs">
                        <div className="font-bold text-slate-800">Preview Thumbnail</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{formData.imageUrl}</div>
                        <div className="text-[10px] text-emerald-600 font-semibold mt-1">Ready for homepage display</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. DISPLAY ORDER & STATUS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Display Order (1 = Leftmost)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:border-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Homepage Visibility
                  </label>
                  <label className="flex items-center gap-2.5 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 border-slate-300"
                    />
                    <span className="text-xs font-semibold text-slate-700">
                      Show in horizontal cards on homepage
                    </span>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-outline btn-sm text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="btn btn-primary btn-sm text-xs font-bold shadow-md cursor-pointer"
                >
                  {editingCard ? 'Update Pillar Card' : 'Save Pillar Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
