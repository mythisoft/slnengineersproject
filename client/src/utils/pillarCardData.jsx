export const LOCAL_STORAGE_PILLAR_CARDS_KEY = 'sln_pillar_cards';
export const LOCAL_STORAGE_GLIMPSE_VIDEO_KEY = 'sln_glimpse_video_settings';

export const DEFAULT_GLIMPSE_SETTINGS = {
  videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-mason-working-with-mortar-and-trowel-41885-large.mp4',
  durationSeconds: 3,
  isEnabled: true,
  title: 'Specialized Civil Engineering in Action',
  badgeText: 'Civil Engineering in Action • 3s Glimpse',
};

export const DEFAULT_PILLAR_CARDS = [
  {
    _id: 'default-card-painting',
    pillarId: 'painting',
    pillarName: 'Interior & Exterior Painting',
    imageUrl: '/uploads/pillar-painting.jpg',
    accentColor: '#0077c8',
    order: 1,
    isActive: true,
  },
  {
    _id: 'default-card-waterproofing',
    pillarId: 'waterproofing',
    pillarName: 'Waterproofing Solutions',
    imageUrl: '/uploads/pillar-waterproofing.jpg',
    accentColor: '#0284c7',
    order: 2,
    isActive: true,
  },
  {
    _id: 'default-card-repairs',
    pillarId: 'repairs',
    pillarName: 'Building Repairs & Restoration',
    imageUrl: '/uploads/pillar-restoration.jpg',
    accentColor: '#ea580c',
    order: 3,
    isActive: true,
  },
  {
    _id: 'default-card-false-ceiling',
    pillarId: 'false-ceiling',
    pillarName: 'False Ceiling & Interior Work',
    imageUrl: '/uploads/pillar-false-ceiling.jpg',
    accentColor: '#eab308',
    order: 4,
    isActive: true,
  },
];

export const normalizePillarCard = (card, index = 0) => {
  if (!card) return null;
  return {
    _id: card._id || card.id || `card-${Date.now()}-${index}`,
    pillarId: (card.pillarId || card.slug || 'waterproofing').toLowerCase().trim(),
    pillarName: card.pillarName || card.title || card.name || 'Civil Discipline',
    imageUrl: card.imageUrl || card.image || '/uploads/pillar-waterproofing.jpg',
    accentColor: card.accentColor || '#0284c7',
    order: typeof card.order === 'number' ? card.order : index + 1,
    isActive: card.isActive !== false,
  };
};
