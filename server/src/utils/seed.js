import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();
import User from '../models/User.js';
import Service from '../models/Service.js';
import Project from '../models/Project.js';
import Customer from '../models/Customer.js';
import Enquiry from '../models/Enquiry.js';
import Review from '../models/Review.js';
import ReviewLink from '../models/ReviewLink.js';
import SocialLink from '../models/SocialLink.js';
import CompanySettings from '../models/CompanySettings.js';
import AnalyticsEvent from '../models/AnalyticsEvent.js';
import AuditLog from '../models/AuditLog.js';
import { generateSecureToken, generateQRCodeDataUrl } from './qrService.js';

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sln_waterproofing';
    await mongoose.connect(mongoUri);
    console.log(`[Seed] Connected to database: ${mongoose.connection.name}`);

    // Clear existing collections
    await User.deleteMany({});
    await Service.deleteMany({});
    await Project.deleteMany({});
    await Customer.deleteMany({});
    await Enquiry.deleteMany({});
    await Review.deleteMany({});
    await ReviewLink.deleteMany({});
    await SocialLink.deleteMany({});
    await CompanySettings.deleteMany({});
    await AnalyticsEvent.deleteMany({});
    await AuditLog.deleteMany({});

    console.log('[Seed] Cleared existing records.');

    // 1. Create Users
    const adminPasswordHash = await User.hashPassword('Admin@12345');
    const staffPasswordHash = await User.hashPassword('Staff@12345');

    const adminUser = await User.create({
      username: 'slnadmin',
      email: 'admin@slnengineers.com',
      passwordHash: adminPasswordHash,
      role: 'superadmin',
      isActive: true,
    });

    const staffUser = await User.create({
      username: 'slnstaff',
      email: 'staff@slnengineers.com',
      passwordHash: staffPasswordHash,
      role: 'staff',
      isActive: true,
    });

    console.log('[Seed] Created Admin & Staff users.');

    // 2. Company Settings
    const companySettings = await CompanySettings.create({
      companyName: 'SLN Engineers Projects Pvt. Ltd.',
      tagline: 'Restoration for Three Generations',
      businessType: 'Waterproofing, restoration and painting contracting services',
      logoUrl: '/logo.svg',
      phone: '+91 89776 68777',
      emergencyPhone: '+91 89776 68777',
      email: 'contact@slnengineers.com',
      whatsappNumber: '+918977668777',
      address: {
        street: 'Medipally',
        area: 'Medipally',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500098',
        country: 'India',
      },
      googleReviewUrl: 'https://g.page/r/sln-engineers-review',
      reviewBaseUrl: 'http://localhost:5173',
      businessHours: {
        weekdays: 'Monday – Saturday: 8:00 AM – 7:30 PM',
        sunday: 'Sunday: Emergency Leakage & Site Inspection on Request',
      },
      statsConfig: {
        yearsExperience: '3 Generations (40+ Years)',
        projectsCompleted: '1,450+',
        satisfactionRate: '99.4%',
        warrantyAssurance: 'Up to 10 Years Written Warranty',
      },
      demoNotice: 'Demonstration Content: All project accounts, sample testimonials, and technical cases represent simulated data for demonstration purposes.',
    });

    // 3. Social Links
    await SocialLink.insertMany([
      {
        platform: 'google_review',
        label: 'Google Business Profile',
        url: 'https://g.page/r/sln-engineers-review',
        icon: 'Star',
        isActive: true,
        order: 1,
        clickCount: 142,
      },
      {
        platform: 'whatsapp',
        label: 'WhatsApp Direct Chat',
        url: 'https://wa.me/918977668777?text=Hello%20SLN%20Engineers,%20I%20would%20like%20to%20enquire%20about%20waterproofing%20services.',
        icon: 'MessageCircle',
        isActive: true,
        order: 2,
        clickCount: 289,
      },
      {
        platform: 'instagram',
        label: 'Instagram (@sln_engineers)',
        url: 'https://instagram.com/sln_engineers_official',
        icon: 'Instagram',
        isActive: true,
        order: 3,
        clickCount: 88,
      },
      {
        platform: 'facebook',
        label: 'Facebook Page',
        url: 'https://facebook.com/slnengineersprojects',
        icon: 'Facebook',
        isActive: true,
        order: 4,
        clickCount: 45,
      },
      {
        platform: 'youtube',
        label: 'YouTube Channel',
        url: 'https://youtube.com/@slnengineerswaterproofing',
        icon: 'Youtube',
        isActive: true,
        order: 5,
        clickCount: 62,
      },
    ]);

    // 4. Services
    const servicesData = [
      {
        title: 'Terrace & Roof Waterproofing',
        slug: 'terrace-roof-waterproofing',
        category: 'Terrace and roof waterproofing',
        shortDescription: 'High-durability elastomeric and polyurethane membrane barrier systems protecting roofs from standing water and thermal cracking.',
        fullDescription: 'Terraces endure intense weathering, extreme thermal expansion, and torrential monsoon deluges. Our multi-layer terrace waterproofing combines high-tensile fiberglass mesh reinforcement with advanced aliphatic polyurethane elastomer membranes. We rectify screed slopes, seal construction joints, and apply solar-reflective topcoats that reduce building ambient temperatures while providing impenetrable hydrostatic protection.',
        iconName: 'Home',
        coverImage: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80',
        benefits: [
          'High elongation polyurethane membrane (over 400% elasticity)',
          'UV-resistant aliphatic topcoat reduces roof heat buildup',
          'Root-resistant formula compatible with terrace gardens',
          'Accommodates structural settling without rupture',
          '10-Year leak-free written warranty backed by manufacturer inspection',
        ],
        technicalHighlights: [
          'Elastomeric Polymer Membrane Thickness: 1.8mm – 2.2mm dry film',
          'Tensile Strength: > 3.5 N/mm²',
          'Crack bridging capability up to 3.0mm width',
          'Compatible with screeding, china mosaic, and outdoor tiling',
        ],
        publicationStatus: true,
        order: 1,
      },
      {
        title: 'Bathroom & Wet-Area Waterproofing',
        slug: 'bathroom-wet-area-waterproofing',
        category: 'Bathroom and wet-area waterproofing',
        shortDescription: 'Sub-tile waterproofing barrier preventing chronic seepage through pipe penetrations, sunken slabs, and shower enclosures.',
        fullDescription: 'Concealed bathroom leaks cause damp patches on lower-floor ceilings, structural rebar oxidation, and peeling adjacent wall paint. Our specialist wet-area treatment seals sunken slabs, core-cut pipe penetrations, and wall-floor cold joints with flexible polymer-modified cementitious membranes prior to final tiling, guaranteeing total containment.',
        iconName: 'Droplets',
        coverImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
        benefits: [
          'Non-destructive re-grouting and pipe collar sealing options',
          'High bond adhesion to concrete, brick, and plumbing PVC sleeves',
          'Prevents efflorescence, mold spores, and gypsum ceiling damage below',
          'Food-grade certified, non-toxic formulation',
        ],
        technicalHighlights: [
          'Two-component acrylic-modified cementitious slurry',
          'Reinforced coving at 90° wall-floor perimeter junctures',
          'Hydrostatic pressure tolerance up to 3.5 bar',
        ],
        publicationStatus: true,
        order: 2,
      },
      {
        title: 'Basement Waterproofing',
        slug: 'basement-waterproofing',
        category: 'Basement waterproofing',
        shortDescription: 'Deep subterranean waterproofing using blindside bentonite, crystalline tanking, and positive/negative pressure barriers.',
        fullDescription: 'Basements and underground parking structures are vulnerable to high groundwater tables and hydrostatic pressure. We execute negative-side crystalline penetration treatments that migrate into concrete capillaries, alongside high-pressure polyurethane chemical injection grouting to stop active running leaks instantly without excavating perimeter soil.',
        iconName: 'Layers',
        coverImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=1200&q=80',
        benefits: [
          'Permanent crystalline matrix reacts with moisture to self-heal microcracks',
          'High-pressure polyurethane injection halts gushing water in seconds',
          'Protects foundational reinforcement steel against corrosion and carbonation',
          'Resistant to aggressive groundwater chlorides and sulphates',
        ],
        technicalHighlights: [
          'Injection pressure up to 250 bar using electric piston packers',
          'Crystalline depth penetration: up to 100mm into concrete substrate',
          'Compressive strength resistance exceeding concrete design grade',
        ],
        publicationStatus: true,
        order: 3,
      },
      {
        title: 'Wall Dampness & Leakage Treatment',
        slug: 'wall-dampness-leakage-treatment',
        category: 'Wall dampness and leakage treatment',
        shortDescription: 'Diagnosis and surgical eradication of rising damp, capillary peeling, and salt efflorescence inside residential and commercial walls.',
        fullDescription: 'Flaking paint and powdery salt deposits on interior walls indicate capillary moisture draw or concealed plumbing micro-leaks. Using thermal moisture meters and precision core inspection, we locate the source, insert chemical damp-proof course (DPC) barriers, and apply breathable salt-neutralizing crystalline plaster for permanent dry interiors.',
        iconName: 'Activity',
        coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        benefits: [
          'Non-destructive moisture meter diagnostic survey',
          'Chemical injection DPC halts rising moisture from soil foundation',
          'Eliminates foul musty odors and respiratory mold allergens',
          'Restores pristine smooth surface for decorative luxury finishes',
        ],
        technicalHighlights: [
          'Siloxane micro-emulsion hydrophobic barrier',
          'Resistant to hydrostatic rising capillary lift',
          'Breathable microporous finish permits trapped vapor escape',
        ],
        publicationStatus: true,
        order: 4,
      },
      {
        title: 'External Wall Waterproofing',
        slug: 'external-wall-waterproofing',
        category: 'External wall waterproofing',
        shortDescription: 'Weather-shield exterior elastomeric coatings and silicone hydrophobic sealants guarding façades against monsoon winds.',
        fullDescription: 'Wind-driven rain strikes building façades, infiltrating through hairline shrinkage cracks and porous mortar. We execute façade pressure cleaning, joint re-pointing, elastomeric crack bridgers, and high-build silicone-infused waterproofing coats that shed rainwater like lotus petals while letting the structure breathe.',
        iconName: 'Shield',
        coverImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
        benefits: [
          'Lotus-effect water-repellent silane-siloxane technology',
          'High crack-bridging capability prevents façade spider cracks',
          'Anti-fungal and anti-algal protection prevents green stains',
          'UV-stable pigments maintain vivid color integrity for over 8 years',
        ],
        technicalHighlights: [
          'Elongation at break: 250%+',
          'Dirt pickup resistance index: superior class',
          'Vapor permeability: ASTM E96 compliant',
        ],
        publicationStatus: true,
        order: 5,
      },
      {
        title: 'Painting & Restoration',
        slug: 'painting-and-restoration',
        category: 'Painting and restoration',
        shortDescription: 'Full architectural refurbishment, heritage masonry repair, structural anti-carbonation coatings, and luxury painting.',
        fullDescription: 'Carrying forward three generations of heritage restoration, SLN rejuvenates weathered residential estates, historic buildings, and modern corporate complexes. We combine concrete spall repair, rust-converter rebar passivation, fair-face mortar smoothing, and premium weather-shield painting to return structural pride and market value.',
        iconName: 'Sparkles',
        coverImage: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80',
        benefits: [
          'Structural patch repair with micro-concrete and polymer mortars',
          'Anti-carbonation protective shield against atmospheric exhaust gases',
          'Full-service scaffolding, safety harnesses, and debris containment',
          'End-to-end design color consultation and high-sheen finishes',
        ],
        technicalHighlights: [
          'Rebar zinc-rich epoxy passivation primer',
          'Polymer modified structural mortar compressive strength: 40 MPa',
          'Premium 100% pure acrylic exterior emulsion system',
        ],
        publicationStatus: true,
        order: 6,
      },
      {
        title: 'Crack Repair & Protective Coatings',
        slug: 'crack-repair-protective-coatings',
        category: 'Crack repair and protective coatings',
        shortDescription: 'Engineered structural stitching, low-viscosity epoxy resin injection, and elastomeric polymer sealing for concrete fissures.',
        fullDescription: 'Structural movement, shrinkage, and ground vibration cause concrete cracks that channel rainwater directly to load-bearing rebar. We diagnose active versus dormant cracks, route V-grooves, install injection nipples, and force low-viscosity high-strength epoxy or flexible polyurethane resins deep into the heart of the concrete mass.',
        iconName: 'Wrench',
        coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
        benefits: [
          'Monolithic bond strength exceeds parent concrete strength',
          'Flexible polyurethane injection accommodates dynamic structural movement',
          'Carbon-fiber composite stitching for severe seismic cracks',
          'Clean, flush grind finish ready for final floor or wall coatings',
        ],
        technicalHighlights: [
          'Epoxy compressive strength: > 75 N/mm²',
          'Tensile bond strength to concrete: > 3.0 N/mm² (concrete failure)',
          'Viscosity: 180–300 mPa.s for ultra-deep microcrack penetration',
        ],
        publicationStatus: true,
        order: 7,
      },
    ];

    const insertedServices = await Service.insertMany(servicesData);
    console.log(`[Seed] Inserted ${insertedServices.length} service categories.`);

    // 5. Customers
    const customer1 = await Customer.create({
      name: 'Ramesh Sundaram',
      phone: '+91 98440 22331',
      email: 'ramesh.sundaram@gmail.com',
      address: { street: '42 Orchid Villa, Palm Meadows', area: 'Whitefield', city: 'Bangalore', pincode: '560066' },
      propertyType: 'Villa',
      notes: 'Terrace leak rectification completed with 10-year warranty.',
    });

    const customer2 = await Customer.create({
      name: 'Dr. Anita Narayan',
      phone: '+91 97410 88920',
      email: 'anita.narayan@careclinic.org',
      address: { street: 'Penthouse 12B, Regency Heights', area: 'Indiranagar', city: 'Bangalore', pincode: '560038' },
      propertyType: 'Apartment Complex',
      notes: 'Sunken master bath and terrace garden leak proofing.',
    });

    const customer3 = await Customer.create({
      name: 'Vikramaditya Rao',
      phone: '+91 98860 11994',
      email: 'vrao@technosolutions.in',
      address: { street: 'Plot 14, Phase 2, Electronic City', area: 'Electronic City', city: 'Bangalore', pincode: '560100' },
      propertyType: 'Commercial',
      notes: 'Underground corporate basement tanking and injection grouting.',
    });

    // 6. Projects with Before/During/After Media
    const projectsData = [
      {
        title: 'Penthouse Roof & Terrace Garden Waterproofing at Whitefield Villa',
        slug: 'penthouse-roof-terrace-garden-whitefield',
        serviceCategory: 'Terrace and roof waterproofing',
        serviceId: insertedServices[0]._id,
        location: 'Palm Meadows, Whitefield, Bangalore',
        clientReference: 'Luxury Villa #42 (Mr. Ramesh Sundaram)',
        customerId: customer1._id,
        problemDescription: 'Severe water seepage through terrace floor expansion joints causing recurring damp patches and electrical conduit moisture in the master bedroom suite directly below.',
        inspectionFindings: 'Thermal imaging identified capillary water tracking across 18 linear meters of fractured brick-bat coba screed, with saturated porous mortar under the decorative planter borders.',
        workPerformed: 'Stripped loose debonded substrate, routed and sealed perimeter joints with polyurethane elastomer, installed 200 GSM fiberglass reinforcing mesh, applied 3 coats of aliphatic polyurethane membrane, and finished with UV-reflective solar cooling coat.',
        materialsUsed: 'Dr. Fixit Fastflex Elastomeric Membrane, Fosroc Nitoseal PU40, SikaTop Seal-107, 200 GSM Fiberglass Woven Mesh.',
        beforeMedia: [
          {
            url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1000&q=80',
            caption: 'Before: Deteriorated terrace screed showing ponding water and hairline shrinkage cracks',
            type: 'image',
          },
        ],
        duringMedia: [
          {
            url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=1000&q=80',
            caption: 'During: High-tensile fiberglass mesh embedment into primary elastomeric slurry coat',
            type: 'image',
          },
        ],
        afterMedia: [
          {
            url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
            caption: 'After: Seamless monolithic waterproof shield with solar-reflective protective topcoat',
            type: 'image',
          },
        ],
        completionDate: new Date('2026-03-12'),
        warrantyDetails: '10-Year Written Certificate of Waterproofing Assurance',
        isPublished: true,
        customerConsentPublished: true,
        isFeatured: true,
      },
      {
        title: 'Negative-Side Basement Tanking & PU Chemical Injection at Tech Park',
        slug: 'basement-pu-injection-tech-park',
        serviceCategory: 'Basement waterproofing',
        serviceId: insertedServices[2]._id,
        location: 'Electronic City Phase 2, Bangalore',
        clientReference: 'Corporate Tower B2 Underground Parking',
        customerId: customer3._id,
        problemDescription: 'High monsoon groundwater table resulting in active water gushing through retaining wall cold joints and elevator pit floor fissures at -6.0m subgrade.',
        inspectionFindings: 'Hydrostatic pressure head exceeding 1.8 bar causing continuous running leaks through retaining wall tie-rod holes and construction joints.',
        workPerformed: 'Drilled 14mm angled injection ports into active fissure paths, installed high-pressure mechanical packers, injected hydrophobic polyurethane resin to stop running water in 45 seconds, followed by complete crystalline slurry tanking.',
        materialsUsed: 'Fosroc Renderoc RG, Sika Injection-201 CE flexible polyurethane foam, Xypex Concentrate crystalline tanking slurry.',
        beforeMedia: [
          {
            url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80',
            caption: 'Before: Running water leaks and severe calcium efflorescence along basement retaining wall',
            type: 'image',
          },
        ],
        duringMedia: [
          {
            url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1000&q=80',
            caption: 'During: High-pressure electric piston pumping of hydrophobic polyurethane resin',
            type: 'image',
          },
        ],
        afterMedia: [
          {
            url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80',
            caption: 'After: Bone-dry retaining wall sealed with deep-penetration crystalline barrier',
            type: 'image',
          },
        ],
        completionDate: new Date('2026-02-18'),
        warrantyDetails: '8-Year Structural Hydrostatic Barrier Warranty',
        isPublished: true,
        customerConsentPublished: true,
        isFeatured: true,
      },
      {
        title: 'Façade Re-pointing & Elastomeric Weather-Shielding at Regency Enclave',
        slug: 'facade-repointing-elastomeric-regency',
        serviceCategory: 'External wall waterproofing',
        serviceId: insertedServices[4]._id,
        location: 'Indiranagar 100ft Road, Bangalore',
        clientReference: 'Regency Enclave 8-Storey Residential Complex',
        customerId: customer2._id,
        problemDescription: 'Heavy wind-driven monsoon rains penetrating external plaster cracks, soaking brickwork and ruining internal false ceilings and wood paneling on higher floors.',
        inspectionFindings: 'Multiple structural settlement cracks up to 2.5mm on the south-west façade, combined with failed window perimeter silicone seals.',
        workPerformed: 'Erected safe suspended rope scaffolding, opened and cleaned cracks to 10mm depth, filled with non-shrink elastomeric polymer sealant, resealed 64 window perimeters, and applied two coats of 100% acrylic elastomeric exterior shield.',
        materialsUsed: 'Asian Paints Apex Ultima Protek Duralife, Fosroc Nitocote Wallguard, Dow Corning 789 Silicone Sealant.',
        beforeMedia: [
          {
            url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80',
            caption: 'Before: Weather-beaten external façade showing black mold streaks and plaster fissures',
            type: 'image',
          },
        ],
        duringMedia: [
          {
            url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=1000&q=80',
            caption: 'During: High-pressure hydro-washing and polymer joint stitching via suspended scaffold',
            type: 'image',
          },
        ],
        afterMedia: [
          {
            url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
            caption: 'After: Rejuvenated exterior façade with 10-year lotus-effect water repellency',
            type: 'image',
          },
        ],
        completionDate: new Date('2026-01-29'),
        warrantyDetails: '7-Year Façade Weather-Shield Warranty',
        isPublished: true,
        customerConsentPublished: true,
        isFeatured: true,
      },
    ];

    const insertedProjects = await Project.insertMany(projectsData);
    console.log(`[Seed] Inserted ${insertedProjects.length} completed projects.`);

    // 7. Review Links with QR Codes
    for (const project of insertedProjects) {
      const token = generateSecureToken();
      const reviewUrl = `http://localhost:5173/scan-review/${token}`;
      const qrCodeDataUrl = await generateQRCodeDataUrl(reviewUrl);

      const reviewLink = await ReviewLink.create({
        token,
        projectId: project._id,
        projectTitle: project.title,
        clientReference: project.clientReference,
        qrCodeDataUrl,
        isActive: true,
        scanCount: Math.floor(Math.random() * 15) + 3,
        lastScannedAt: new Date(),
        createdBy: adminUser._id,
      });
    }
    console.log('[Seed] Created QR review links.');

    // 9. Pipeline Enquiries
    await Enquiry.insertMany([
      {
        customerName: 'Karthik Somayaji',
        phone: '+91 99001 44552',
        email: 'karthik.s@outlook.com',
        location: 'Koramangala 4th Block, Bangalore',
        serviceRequired: 'Terrace and roof waterproofing',
        problemDescription: 'Water accumulation on roof garden terrace during rains. Need on-site inspection and quote for complete re-waterproofing with solar coat.',
        preferredContactMethod: 'Phone',
        consentGiven: true,
        status: 'New',
        internalNotes: [{ note: 'Enquiry received via website form. Customer requested call in afternoon.', author: 'System' }],
      },
      {
        customerName: 'Shalini Venkat',
        phone: '+91 98455 77881',
        email: 'shalini.v@gmail.com',
        location: 'Jayanagar 7th Block, Bangalore',
        serviceRequired: 'Wall dampness and leakage treatment',
        problemDescription: 'Peeling paint and white salt powder efflorescence on dining room wall adjacent to bathroom.',
        preferredContactMethod: 'WhatsApp',
        consentGiven: true,
        status: 'Site Inspection',
        assignedStaff: staffUser._id,
        internalNotes: [
          { note: 'Status set to Site Inspection. Staff assigned for Saturday 11 AM.', author: 'slnadmin' },
        ],
        followUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
      {
        customerName: 'Muralidhar Hegde',
        phone: '+91 94480 33221',
        email: 'murali.hegde@rediffmail.com',
        location: 'Sadashivanagar, Bangalore',
        serviceRequired: 'Painting and restoration',
        problemDescription: '30-year-old heritage independent house requiring complete structural crack stitching and exterior restoration.',
        preferredContactMethod: 'Phone',
        consentGiven: true,
        status: 'Quotation Sent',
        assignedStaff: adminUser._id,
        internalNotes: [
          { note: 'Inspection completed on 10th Oct. Formal quotation of ₹2,85,000 emailed and WhatsApped.', author: 'slnadmin' },
        ],
      },
    ]);
    console.log('[Seed] Created sample customer enquiries.');

    // 10. Audit Logs
    await AuditLog.create({
      userId: adminUser._id,
      username: adminUser.username,
      action: 'INITIALIZE_SYSTEM',
      resource: 'System',
      resourceId: 'root',
      details: { message: 'Database initialized with demonstration records.' },
      ipAddress: '127.0.0.1',
    });

    console.log('=======================================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('🔑 Administrative Login Credentials:');
    console.log('   Username: slnadmin  OR  Email: admin@slnengineers.com');
    console.log('   Password: Admin@12345');
    console.log('🔑 Staff Login Credentials:');
    console.log('   Username: slnstaff  OR  Email: staff@slnengineers.com');
    console.log('   Password: Staff@12345');
    console.log('=======================================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
