import React, { useState, useEffect } from 'react';
import {
  Share2,
  Copy,
  Download,
  ExternalLink,
  MessageCircle,
  Star,
  CheckCircle,
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon } from '../../components/common/SocialIcons';
import { fetchApi } from '../../utils/api';

export default function SocialManager() {
  const [socialLinks, setSocialLinks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchApi('/admin/social-links'), fetchApi('/admin/projects?limit=50')])
      .then(([linksRes, projRes]) => {
        if (linksRes.success) setSocialLinks(linksRes.data);
        if (projRes.success && projRes.data.length > 0) {
          setProjects(projRes.data);
          setSelectedProject(projRes.data[0]);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateUrl = async (id, url) => {
    try {
      await fetchApi(`/admin/social-links/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ url }),
      });
      alert('Social destination link updated successfully!');
    } catch (e) {
      alert(e.message || 'Failed to update link');
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'google_review':
        return <Star size={16} className="text-amber-500" />;
      case 'whatsapp':
        return <MessageCircle size={16} className="text-emerald-500" />;
      case 'instagram':
        return <InstagramIcon size={16} className="text-pink-500" />;
      case 'facebook':
        return <FacebookIcon size={16} className="text-blue-500" />;
      case 'youtube':
        return <YoutubeIcon size={16} className="text-red-500" />;
      default:
        return <Share2 size={16} />;
    }
  };

  const generatedCaption = selectedProject
    ? `🏗️ PROJECT RESTORATION HIGHLIGHT | SLN Engineers Projects Pvt. Ltd.
“Restoration for Three Generations”

📍 Location: ${selectedProject.location}
🛠️ Service: ${selectedProject.serviceCategory}
📋 Scope: ${selectedProject.title}
🔬 Solution: ${selectedProject.materialsUsed}
🛡️ Warranty: ${selectedProject.warrantyDetails || '5-Year Written Leak-Proof Assurance'}

Read the full case study & technical inspection findings:
${window.location.origin}/projects/${selectedProject.slug}

#SLNEngineers #Waterproofing #CivilRestoration #BangaloreConstruction #LeakFree #ThreeGenerations`
    : '';

  const copyCaption = () => {
    navigator.clipboard.writeText(generatedCaption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Social Media Integration & Sharing</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure official public profile links, monitor outbound redirects, and generate project-specific share captions.
        </p>
      </div>

      {/* Outbound Link Tracking Disclaimer */}
      <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-900 flex items-center justify-between gap-4">
        <span>
          <strong>Outbound Click Tracker:</strong> All public profile clicks route through <code>/api/social/click/:platform</code>. Clicks indicate outbound redirects and do not verify published external posts or completed reviews.
        </span>
      </div>

      {/* Grid: Configurable Social Links */}
      <div className="card p-6 bg-white border-slate-200">
        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">
          Configurable Social Media & Review Links
        </h3>

        <div className="space-y-4">
          {socialLinks.map((link) => (
            <div
              key={link._id}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  {getPlatformIcon(link.platform)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{link.label}</h4>
                  <span className="text-slate-400">
                    Tracked Outbound Clicks: <strong>{link.clickCount || 0}</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="url"
                  defaultValue={link.url}
                  onBlur={(e) => handleUpdateUrl(link._id, e.target.value)}
                  className="form-input text-xs w-full sm:w-72"
                  placeholder="Profile URL"
                />
                <a
                  href={`/api/social/click/${link.platform}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm py-1.5 px-2.5 text-xs shrink-0"
                  title="Test Outbound Redirect"
                >
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Media Sharing Generator for Staff */}
      <div className="card p-6 bg-white border-slate-200 space-y-6">
        <div>
          <h3 className="font-bold text-slate-900 text-base mb-1 flex items-center gap-2">
            <Share2 size={18} className="text-sky-700" /> Project Social Media Sharing Assistant
          </h3>
          <p className="text-xs text-slate-500">
            Generate prefilled, formatted captions and approved images for WhatsApp updates, Instagram posts, or LinkedIn case studies.
          </p>
        </div>

        {/* Project Selector */}
        <div>
          <label className="form-label text-xs">Select Completed Project</label>
          <select
            className="form-select text-xs"
            value={selectedProject?._id || ''}
            onChange={(e) => {
              const p = projects.find((item) => item._id === e.target.value);
              setSelectedProject(p);
            }}
          >
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title} ({p.serviceCategory})
              </option>
            ))}
          </select>
        </div>

        {selectedProject && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Generated Caption */}
            <div className="lg:col-span-8 space-y-3">
              <label className="form-label text-xs">Prefilled Social Media Caption</label>
              <textarea
                readOnly
                rows="8"
                className="form-textarea text-xs font-mono bg-slate-50 border-slate-300"
                value={generatedCaption}
              ></textarea>
              <div className="flex items-center gap-3">
                <button
                  onClick={copyCaption}
                  className="btn btn-primary btn-sm text-xs flex items-center gap-1.5"
                >
                  <Copy size={13} /> {copiedCaption ? 'Copied to Clipboard!' : 'Copy Caption & Hashtags'}
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(generatedCaption)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-sm text-xs flex items-center gap-1.5"
                >
                  <MessageCircle size={13} /> Share to WhatsApp
                </a>
              </div>
            </div>

            {/* Approved Project Image Preview */}
            <div className="lg:col-span-4 card p-4 bg-slate-50 border-slate-200 space-y-3">
              <label className="form-label text-xs">Approved Project Media</label>
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-200">
                <img
                  src={selectedProject.afterMedia[0]?.url || selectedProject.beforeMedia[0]?.url}
                  alt="Project media"
                  className="w-full h-full object-cover"
                />
              </div>
              <a
                href={selectedProject.afterMedia[0]?.url || selectedProject.beforeMedia[0]?.url}
                target="_blank"
                download="sln-project.jpg"
                className="btn btn-outline btn-sm w-full text-xs flex items-center justify-center gap-1.5"
              >
                <Download size={13} /> Download Approved Image
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
