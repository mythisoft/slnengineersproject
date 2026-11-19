import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Shield,
  Award,
  MapPin,
  Calendar,
  Wrench,
  CheckCircle,
  Share2,
  Copy,
  MessageCircle,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Layers,
  AlertTriangle,
  Phone,
  Sparkles,
} from 'lucide-react';
import BeforeAfterSlider from '../../components/common/BeforeAfterSlider';
import { fetchApi } from '../../utils/api';
import { DEFAULT_PROJECTS } from '../../utils/projectsData';

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeMediaTab, setActiveMediaTab] = useState('all');

  useEffect(() => {
    const resolveFallbackProject = (targetSlug) => {
      return DEFAULT_PROJECTS.find((p) => p.slug === targetSlug || p._id === targetSlug || p.id === targetSlug) || null;
    };

    Promise.all([
      fetchApi(`/projects/${slug}`),
      fetchApi('/settings'),
    ])
      .then(([projectRes, settingsRes]) => {
        if (projectRes.success && projectRes.data) {
          setProject(projectRes.data);
          setError('');
        } else {
          const fallback = resolveFallbackProject(slug);
          if (fallback) {
            setProject(fallback);
            setError('');
          } else {
            setError('Project not found');
          }
        }
        if (settingsRes?.success) setSettings(settingsRes.data);
      })
      .catch((err) => {
        const fallback = resolveFallbackProject(slug);
        if (fallback) {
          setProject(fallback);
          setError('');
        } else {
          setError(err.message || 'Project not found');
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="py-28 text-center text-slate-500">
        Loading case study details...
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Project Case Study Not Found</h2>
        <p className="text-slate-600 mb-6">{error || 'This project may have been updated or unpublished.'}</p>
        <Link to="/projects" className="btn btn-primary">
          <ArrowLeft size={16} /> Return to Portfolio
        </Link>
      </div>
    );
  }

  const phone = settings?.phone || '+91 89776 68777';
  const whatsapp = settings?.whatsappNumber || '+918977668777';
  const shareUrl = window.location.href;
  const shareText = `Check out this waterproofing restoration case study by SLN Engineers Projects: ${project.title}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const beforeImg = project.beforeMedia?.[0]?.url;
  const afterImg = project.afterMedia?.[0]?.url;

  return (
    <div>
      {/* Top Breadcrumb & Cinematic Header */}
      <section className="relative bg-gradient-to-br from-[#031122] via-[#071f38] to-[#041427] text-white py-16 overflow-hidden border-b border-slate-800/80">
        {/* Subtle Ambient Radial Backdrops */}
        <div className="absolute top-0 right-10 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

        <div className="container relative z-10">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400 hover:text-sky-300 mb-6 bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-sky-500/30 backdrop-blur-sm shadow-sm"
          >
            <ArrowLeft size={14} /> Back to Completed Projects
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="badge badge-green shadow-xs">{project.serviceCategory}</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-400/30 shadow-xs flex items-center gap-1.5">
              <Award size={13} className="text-emerald-400" /> {project.warrantyDetails || '10-Year Written Warranty'}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-950/90 text-sky-300 border border-sky-400/30 shadow-xs">
              IS 1346 & IS 3067 Standards
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight max-w-4xl tracking-tight">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
              <MapPin size={14} className="text-sky-400" />
              <span>{project.location}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
              <Calendar size={14} className="text-emerald-400" />
              <span>Completed {new Date(project.completionDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
            </div>
            {project.clientReference && (
              <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
                <span className="text-slate-400">Client Reference:</span>{' '}
                <span className="text-slate-200 font-semibold">{project.clientReference}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-slate-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left 8 Cols: Technical Case Study */}
            <div className="lg:col-span-8 space-y-8">
              {/* Interactive Before & After Slider (if both images exist) */}
              {beforeImg && afterImg && (
                <div className="card p-4 sm:p-6 bg-white">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Layers size={18} className="text-sky-700" /> Interactive Before / After Comparison
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Slide divider to inspect substrate condition before treatment versus finished waterproof system.
                  </p>
                  <BeforeAfterSlider
                    beforeImage={beforeImg}
                    afterImage={afterImg}
                    beforeLabel="Before Treatment"
                    afterLabel="After SLN Restoration"
                    aspectRatio="16/9"
                  />
                </div>
              )}

              {/* Problem Description */}
              <div className="card p-6 bg-white">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2 text-rose-700">
                  <AlertTriangle size={18} /> Initial Problem Description
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                  {project.problemDescription}
                </p>
              </div>

              {/* Inspection Findings */}
              <div className="card p-6 bg-white">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2 text-sky-800">
                  <Shield size={18} /> Technical Inspection & Diagnostics
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                  {project.inspectionFindings}
                </p>
              </div>

              {/* Work Performed */}
              <div className="card p-6 bg-white">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2 text-emerald-800">
                  <Wrench size={18} /> Execution & Work Performed
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                  {project.workPerformed}
                </p>
              </div>

              {/* Materials & Chemistry Used */}
              <div className="card p-6 bg-white">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2 text-indigo-800">
                  <CheckCircle size={18} /> Materials & Chemical Formulation Used
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs">
                  {project.materialsUsed}
                </p>
              </div>

              {/* Full Media Gallery */}
              <div className="card p-6 bg-white">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Complete Photographic Evidence</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.beforeMedia?.map((m, i) => (
                    <div key={`before-${i}`} className="rounded-xl overflow-hidden border border-slate-200">
                      <img src={m.url} alt={m.caption || 'Before work'} className="w-full h-48 object-cover" />
                      <div className="p-2.5 bg-slate-100 text-xs text-slate-600 font-medium">
                        <span className="badge badge-amber mr-2">Before</span> {m.caption || 'Initial substrate condition'}
                      </div>
                    </div>
                  ))}

                  {project.duringMedia?.map((m, i) => (
                    <div key={`during-${i}`} className="rounded-xl overflow-hidden border border-slate-200">
                      <img src={m.url} alt={m.caption || 'During work'} className="w-full h-48 object-cover" />
                      <div className="p-2.5 bg-slate-100 text-xs text-slate-600 font-medium">
                        <span className="badge badge-blue mr-2">During</span> {m.caption || 'Chemical application in progress'}
                      </div>
                    </div>
                  ))}

                  {project.afterMedia?.map((m, i) => (
                    <div key={`after-${i}`} className="rounded-xl overflow-hidden border border-slate-200">
                      <img src={m.url} alt={m.caption || 'After restoration'} className="w-full h-48 object-cover" />
                      <div className="p-2.5 bg-emerald-50 text-xs text-emerald-800 font-medium border-t border-emerald-100">
                        <span className="badge badge-green mr-2">After</span> {m.caption || 'Final cured waterproof membrane'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Quick Actions, Warranty, Share */}
            <div className="lg:col-span-4 space-y-6">
              {/* Project Warranty Card */}
              <div className="card p-6 bg-gradient-to-br from-sky-900 to-slate-900 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Shield size={28} className="text-emerald-400" />
                  <div>
                    <h4 className="font-bold text-white text-base">Warranty Protection</h4>
                    <p className="text-xs text-sky-200">Backed by SLN Engineers Guarantee</p>
                  </div>
                </div>
                <div className="p-3 bg-white/10 rounded-xl border border-white/20 mb-4 text-xs">
                  {project.warrantyDetails || 'Standard 5-Year Leak-Proof Workmanship Warranty'}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Every waterproofing contract executed by SLN Engineers includes formal written certification with dedicated post-monsoon inspection checkpoints.
                </p>
                <Link to="/contact" className="btn btn-primary bg-emerald-600 hover:bg-emerald-700 w-full text-xs">
                  Request Similar Inspection
                </Link>
              </div>

              {/* Social Media Sharing Assistant */}
              <div className="card p-6 bg-white">
                <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                  <Share2 size={16} className="text-sky-700" /> Share This Case Study
                </h4>
                <p className="text-xs text-slate-500 mb-4">
                  Share this verified restoration benchmark with architects, builders, or society committee members.
                </p>

                <div className="flex flex-col gap-2.5">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`${shareText} — ${shareUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp btn-sm w-full"
                  >
                    <MessageCircle size={16} /> Share on WhatsApp
                  </a>

                  <button
                    onClick={copyToClipboard}
                    className="btn btn-outline btn-sm w-full flex items-center justify-center gap-2 text-xs"
                  >
                    <Copy size={14} /> {copied ? 'Copied URL to Clipboard!' : 'Copy Project Link'}
                  </button>
                </div>
              </div>

              {/* Privacy and Consent Notice */}
              <div className="p-4 bg-slate-100 rounded-xl text-xs text-slate-500 border border-slate-200">
                <p className="font-semibold text-slate-700 mb-1">Customer Privacy Assurance</p>
                <p>
                  Photographs and technical parameters are published with customer consent. Private contact coordinates and internal residential layouts remain strictly confidential.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Consultation CTA (Light Background) */}
      <section className="py-24 bg-slate-50 border-t border-slate-200 text-slate-900 relative overflow-hidden">
        <div className="container text-center max-w-3xl mx-auto space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs">
            <Sparkles size={14} className="text-emerald-600" /> Experiencing Similar Structural Seepage?
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Consult With Our Senior Engineers Today
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto pb-3">
            Contact SLN Engineers Projects Pvt. Ltd. We provide comprehensive thermal moisture diagnostic surveys, clear technical proposals, and up to 10-year backed written warranties.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to={`/contact?service=${encodeURIComponent(project.serviceCategory || '')}`}
              className="btn btn-primary btn-lg font-bold shadow-lg shadow-sky-950/20"
            >
              Request Similar Inspection <ArrowRight size={17} />
            </Link>
            <a href={`tel:${phone.replace(/\s+/g, '')}`} className="btn btn-outline btn-lg font-semibold">
              <Phone size={17} /> Call {phone}
            </a>
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20SLN%20Engineers,%20I%20saw%20your%20case%20study%20"${encodeURIComponent(project.title)}"%20and%20would%20like%20to%20request%20an%20on-site%20inspection.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-lg font-semibold"
            >
              <MessageCircle size={17} /> WhatsApp Senior Engineer
            </a>
          </div>

          <div className="pt-6 text-xs text-slate-500 font-medium">
            Headquartered in Medipally, Hyderabad • Serving Telangana with 40 Years of Family Trust
          </div>
        </div>
      </section>
    </div>
  );
}

