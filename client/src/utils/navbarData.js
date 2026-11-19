export const DEFAULT_NAV_LINKS = [
  { id: 'home', name: 'Overview', path: '/', isActive: true, order: 1 },
  { id: 'about', name: 'Our Heritage', path: '/about', isActive: true, order: 2 },
  { id: 'services', name: 'Expertise', path: '/services', isActive: true, order: 3 },
  { id: 'projects', name: 'Success Stories', path: '/projects', isActive: true, order: 4 },
  { id: 'reviews', name: 'Client Trust', path: '/reviews', isActive: true, order: 5 },
  { id: 'contact', name: 'Consultation', path: '/contact', isActive: true, order: 6 },
];

export const DEFAULT_NAVBAR_CONFIG = {
  links: DEFAULT_NAV_LINKS,
  topAnnouncement: {
    lineageBadge: 'Restoration for Three Generations',
    complianceText: 'ISO & Indian Standard Compliant',
  },
  headerCtas: {
    primaryText: 'Book Inspection',
    primaryLink: '/contact#inspection-form',
    whatsappText: 'WhatsApp Us',
  },
};

// Common navigation path presets for easy 1-click selection in Admin
export const NAV_PATH_PRESETS = [
  { label: 'Homepage (Overview)', path: '/' },
  { label: 'About Us (Our Heritage)', path: '/about' },
  { label: 'Services Catalog (Expertise)', path: '/services' },
  { label: 'Projects & Case Studies (Success Stories)', path: '/projects' },
  { label: 'Customer Reviews (Client Trust)', path: '/reviews' },
  { label: 'Contact & Diagnostic Inspection (Consultation)', path: '/contact' },
  { label: 'Site Inspection Form Anchor', path: '/contact#inspection-form' },
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Terms of Service', path: '/terms-of-service' },
];
