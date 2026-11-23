import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Lock,
  User,
  Shield,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Inbox,
  LayoutDashboard,
  ExternalLink,
  HardHat,
  ChevronLeft,
  KeyRound,
} from 'lucide-react';
import { fetchApi } from '../../utils/api';

export default function AdminLogin({ forcedRole }) {
  const navigate = useNavigate();
  const location = useLocation();

  const initialRole =
    forcedRole ||
    (location.pathname.toLowerCase().includes('superadmin') ? 'superadmin' : 'admin');

  const [activeRole, setActiveRole] = useState(initialRole);
  const isSuper = activeRole === 'superadmin';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sync with prop/URL changes if any
  useEffect(() => {
    if (forcedRole) {
      setActiveRole(forcedRole);
    }
  }, [forcedRole]);

  // Update default identifier when activeRole changes
  useEffect(() => {
    setIdentifier('');
    setPassword('');
    setError('');
  }, [isSuper]);

  const handleRoleSwitch = (role) => {
    setActiveRole(role);
    setIdentifier('');
    setPassword('');
    setError('');
    // Gracefully update browser URL bar without page refresh
    const targetUrl = role === 'superadmin' ? '/superadmin/login' : '/admin/login';
    window.history.replaceState(null, '', targetUrl);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetchApi('/admin/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });

      if (res.success && res.token) {
        // If user logged in at /superadmin/login with a standard admin role, warn them
        if (isSuper && res.user?.role !== 'superadmin') {
          setError(
            'Access notice: Your account has standard Admin privileges (Dashboard & Enquiries only). Please switch to the Operations Admin portal.'
          );
          setLoading(false);
          return;
        }

        localStorage.setItem('sln_admin_token', res.token);
        localStorage.setItem('sln_admin_user', JSON.stringify(res.user));
        navigate('/admin');
      }
    } catch (err) {
      setError(err.message || 'Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#020b18] text-slate-100 flex items-center justify-center p-3 xs:p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none">
      {/* 1. Cinematic Full-Bleed Architectural Background Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src="/uploads/ModernHomeWaterproofingProtect-1792165882439-41612578.png"
          alt="SLN Architectural Background"
          className="w-full h-full object-cover object-center scale-105 opacity-15 sm:opacity-20 filter contrast-125 saturate-50 transition-transform duration-1000 ease-out"
        />
        {/* Layered Rich Gradient Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020b18] via-[#031427]/90 to-[#020b18]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#020b18_85%)]" />
      </div>

      {/* 2. Precision CAD Blueprint Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#38bdf812_1px,transparent_1px),linear-gradient(to_bottom,#38bdf812_1px,transparent_1px)] bg-[size:32px_32px] sm:bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,#000_30%,transparent_100%)] pointer-events-none" />

      {/* 3. Dynamic Atmospheric Ambient Glow Orbs with Float Animations */}
      <div
        className={`absolute -top-32 -left-20 w-[320px] sm:w-[600px] h-[300px] sm:h-[500px] rounded-full blur-[100px] sm:blur-[140px] pointer-events-none transition-all duration-700 animate-login-float-1 ${
          isSuper ? 'bg-purple-600/30' : 'bg-emerald-500/25'
        }`}
      />
      <div
        className={`absolute -bottom-32 -right-20 w-[320px] sm:w-[600px] h-[300px] sm:h-[500px] rounded-full blur-[100px] sm:blur-[140px] pointer-events-none transition-all duration-700 animate-login-float-2 ${
          isSuper ? 'bg-indigo-600/30' : 'bg-sky-500/25'
        }`}
      />
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] sm:w-[900px] h-[320px] sm:h-[600px] rounded-full blur-[120px] sm:blur-[160px] pointer-events-none transition-all duration-700 animate-login-pulse-glow ${
          isSuper ? 'bg-fuchsia-600/15' : 'bg-teal-500/15'
        }`}
      />

      {/* 4. Desktop Corner HUD Coordinates */}
      <div className="hidden xl:flex absolute top-6 left-8 items-center gap-2.5 text-[11px] font-mono tracking-widest text-sky-400/60 select-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>GATEWAY // SLN-CIVIL-ENG-RESTORE</span>
      </div>
      <div className="hidden xl:flex absolute top-6 right-8 items-center gap-2 text-[11px] font-mono tracking-widest text-sky-400/60 select-none">
        <span>SECURITY // TLS-256-BIT • ISO-9001</span>
      </div>

      {/* 5. Main Split Executive Card Container with Entrance Animation & Transformation */}
      <div className="w-full max-w-5xl bg-slate-900/90 backdrop-blur-2xl rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] border border-white/15 shadow-[0_25px_80px_-15px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.06)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10 my-auto animate-login-card-entrance transition-all duration-500 hover:shadow-[0_30px_90px_-10px_rgba(0,0,0,0.92),0_0_0_1px_rgba(255,255,255,0.12)]">

        {/* LEFT PANEL: Rich Architectural Showcase (7 Cols on desktop, Compact Header on mobile) */}
        <div className="lg:col-span-7 relative p-5 xs:p-6 sm:p-9 lg:p-12 flex flex-col justify-between overflow-hidden">
          {/* Internal Showcase Photo Background */}
          <div className="absolute inset-0 pointer-events-none">
            <img
              src="/uploads/ModernHomeWaterproofingProtect-1792165882439-41612578.png"
              alt="Civil Engineering Practice"
              className="w-full h-full object-cover object-center filter saturate-75 contrast-125 scale-105 opacity-40 sm:opacity-75 transition-transform duration-700 ease-out"
            />
            {/* Seamless Dark Overlay with Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/90 to-slate-900/90" />
            <div
              className={`absolute inset-0 mix-blend-color opacity-35 transition-colors duration-700 ${
                isSuper ? 'bg-purple-900' : 'bg-emerald-900'
              }`}
            />
          </div>

          {/* Top Brand Header */}
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-3">
              <Link to="/" className="inline-block group focus:outline-hidden" title="Return to Home">
                <div className="bg-white/10 backdrop-blur-md px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl border border-white/20 inline-flex items-center gap-2.5 sm:gap-3 transition-all duration-300 group-hover:scale-105 group-hover:bg-white/15 shadow-md">
                  <img
                    src="/sln-logo.png"
                    alt="SLN Engineers Projects"
                    className="h-9 sm:h-11 w-auto object-contain drop-shadow"
                    onError={(e) => {
                      e.currentTarget.src = '/sln-logo.png';
                    }}
                  />
                  <div className="border-l border-white/20 pl-2.5">
                    <span className="block text-xs font-black tracking-tight text-white uppercase leading-none">
                      SLN Engineers
                    </span>
                    <span className="block text-[10px] text-sky-300 font-semibold tracking-wider mt-0.5">
                      Projects Pvt. Ltd.
                    </span>
                  </div>
                </div>
              </Link>

              {/* Live Status Indicator */}
              <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] font-mono tracking-wider bg-slate-950/80 border border-slate-700/80 text-emerald-400 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="hidden xs:inline">ACTIVE PORTAL</span>
                <span className="xs:hidden">LIVE</span>
              </div>
            </div>

            {/* Interactive Role Switcher Tabs with Animated Transformation */}
            <div className="mt-5 sm:mt-8">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                <span>Select Access Level</span>
                <span className="text-[10px] text-sky-400/80 font-normal">Click to switch portal</span>
              </div>
              <div className="bg-slate-950/70 backdrop-blur-md p-1 rounded-2xl border border-white/10 grid grid-cols-2 gap-1 max-w-md w-full shadow-inner">
                <button
                  type="button"
                  onClick={() => handleRoleSwitch('admin')}
                  className={`py-2 sm:py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer transform ${
                    !isSuper
                      ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-md shadow-emerald-950/50 scale-[1.02]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <LayoutDashboard size={14} className={!isSuper ? 'text-white' : 'text-slate-400'} />
                  <span className="truncate">Operations Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSwitch('superadmin')}
                  className={`py-2 sm:py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer transform ${
                    isSuper
                      ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white shadow-md shadow-purple-950/50 scale-[1.02]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <ShieldCheck size={14} className={isSuper ? 'text-white' : 'text-slate-400'} />
                  <span className="truncate">Super Admin</span>
                </button>
              </div>
            </div>

            {/* Headline with Dynamic Gradient Morph */}
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-black text-white tracking-tight mt-4 sm:mt-6 leading-tight transition-all duration-300">
              {isSuper ? (
                <>
                  Master Governance &amp; <br />
                  <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-sky-300 bg-clip-text text-transparent">
                    Executive Civil Control
                  </span>
                </>
              ) : (
                <>
                  Site Operations &amp; <br />
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-300 bg-clip-text text-transparent">
                    Inspection Pipeline
                  </span>
                </>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-normal mt-2 sm:mt-3 max-w-lg leading-relaxed hidden sm:block">
              {isSuper
                ? 'Full system oversight for CMS content, structural restoration catalogs, trust metrics, team management, and global firm settings.'
                : 'Direct access to client site inspection bookings, active leakage complaints, enquiry pipeline, and performance metrics.'}
            </p>
          </div>

          {/* Bottom Brand Statement */}
          <div className="relative z-10 mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-2">
              <HardHat size={15} className="text-amber-400 shrink-0" />
              <span className="font-semibold tracking-wide text-[11px] sm:text-xs">
                Restoration for Three Generations
              </span>
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] text-sky-400/80 tracking-widest uppercase">
              TLS-256 SECURED
            </span>
          </div>
        </div>

        {/* RIGHT PANEL: Crisp White & Elevated Sign-In Form (5 Cols on desktop) */}
        <div className="lg:col-span-5 bg-white p-5 xs:p-6 sm:p-8 lg:p-10 flex flex-col justify-between text-slate-800 relative transition-all duration-300">
          {/* Card Top Animated Gradient Ribbon */}
          <div
            className={`absolute top-0 left-0 right-0 h-1.5 transition-all duration-500 ${
              isSuper
                ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700'
                : 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700'
            }`}
          />

          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 sm:pb-4 mb-5 sm:mb-6 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-xs transition-all duration-500 ${
                    isSuper
                      ? 'bg-gradient-to-br from-purple-600 to-indigo-700 shadow-purple-900/20'
                      : 'bg-gradient-to-br from-emerald-600 to-teal-700 shadow-emerald-900/20'
                  }`}
                >
                  {isSuper ? <Shield size={19} /> : <Inbox size={19} />}
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    {isSuper ? 'Master Sign In' : 'Administrator Sign In'}
                  </h2>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {isSuper ? 'Restricted to Super Admin role' : 'Operations staff access'}
                  </span>
                </div>
              </div>
            </div>

            {/* Error Message Box */}
            {error && (
              <div className="bg-rose-50 text-rose-800 p-3 sm:p-3.5 rounded-2xl text-xs border border-rose-200 mb-4 sm:mb-5 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200 shadow-2xs">
                <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">{error}</div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Username / Identifier */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Username or Official Email
                </label>
                <div className="relative group focus-within:scale-[1.01] transition-transform duration-200">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-600 transition-colors pointer-events-none">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder={isSuper ? 'superadmin' : 'admin'}
                    className="w-full pl-10 pr-4 py-3 sm:py-2.5 min-h-[46px] sm:min-h-[42px] rounded-xl border border-slate-200 bg-slate-50/80 text-slate-900 text-base sm:text-sm font-medium focus:bg-white focus:outline-hidden focus:ring-4 focus:ring-sky-500/15 focus:border-sky-500 transition-all placeholder:text-slate-400"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Administrative Password
                </label>
                <div className="relative group focus-within:scale-[1.01] transition-transform duration-200">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-600 transition-colors pointer-events-none">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter administrative password"
                    className="w-full pl-10 pr-12 py-3 sm:py-2.5 min-h-[46px] sm:min-h-[42px] rounded-xl border border-slate-200 bg-slate-50/80 text-slate-900 text-base sm:text-sm font-medium focus:bg-white focus:outline-hidden focus:ring-4 focus:ring-sky-500/15 focus:border-sky-500 transition-all placeholder:text-slate-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition-all cursor-pointer transform active:scale-90"
                    title={showPassword ? 'Hide password' : 'Show password'}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Submit Button with Shimmer Sweep & Interactive Transform */}
              <button
                type="submit"
                disabled={loading}
                className={`relative overflow-hidden w-full py-3.5 sm:py-3.5 px-4 rounded-xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.015] active:scale-[0.985] disabled:opacity-60 disabled:cursor-not-allowed group mt-2 ${
                  isSuper
                    ? 'bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 hover:from-purple-800 hover:to-indigo-700 shadow-purple-900/25 hover:shadow-purple-900/40'
                    : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-900/25 hover:shadow-emerald-900/40'
                }`}
              >
                {/* Moving light shimmer beam */}
                <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                  <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-login-shimmer" />
                </div>

                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to {isSuper ? 'Super Admin' : 'Admin'}</span>
                    <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
            </form>

          </div>

          {/* Public Website Return Link with Transform Hover */}
          <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-100 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors font-semibold group py-1"
            >
              <ChevronLeft size={14} className="transform group-hover:-translate-x-1 transition-transform duration-200" />
              <span>Return to SLN Public Website</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}