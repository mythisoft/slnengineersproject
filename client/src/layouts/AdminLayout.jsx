import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
  Briefcase,
  Layers,
  Images,
  MoveHorizontal,
  Star,
  QrCode,
  Share2,
  Users,
  Settings,
  History,
  LogOut,
  Menu,
  X,
  Shield,
  ShieldCheck,
  ExternalLink,
  Info,
  Home,
  PhoneCall,
  KeyRound,
} from 'lucide-react';
import { fetchApi } from '../utils/api';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('sln_admin_user');
      if (stored) return JSON.parse(stored);
    } catch {}
    return null;
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    fetchApi('/admin/auth/me')
      .then((res) => {
        if (res.success) setCurrentUser(res.user);
      })
      .catch(() => {
        // Not authenticated
        navigate('/admin/login');
      });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetchApi('/admin/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('sln_admin_token');
    localStorage.removeItem('sln_admin_user');
    navigate('/admin/login');
  };

  const isSuperAdmin = currentUser?.role === 'superadmin';

  const allNavItems = [
    { name: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard, superOnly: false },
    { name: 'Enquiry Pipeline', path: '/admin/enquiries', icon: Inbox, superOnly: false },
    { name: 'Services Catalog', path: '/admin/services', icon: Layers, superOnly: false },
    { name: 'Projects & Showcase', path: '/admin/projects', icon: Briefcase, superOnly: true },
    { name: 'Home Page Content', path: '/admin/home', icon: Home, superOnly: true },
    { name: 'Navbar & Header Links', path: '/admin/navbar', icon: Menu, superOnly: true },
    { name: 'Homepage Banners', path: '/admin/banners', icon: Images, superOnly: true },
    { name: 'Pillar Cards', path: '/admin/pillar-cards', icon: MoveHorizontal, superOnly: true },
    { name: 'About Page Content', path: '/admin/about', icon: Info, superOnly: true },
    { name: 'Contact Page Content', path: '/admin/contact', icon: PhoneCall, superOnly: true },
    { name: 'Trust Metrics & Badges', path: '/admin/trust-metrics', icon: ShieldCheck, superOnly: true },
    { name: 'Review QR Codes', path: '/admin/qr-codes', icon: QrCode, superOnly: true },
    { name: 'Customer Reviews', path: '/admin/reviews', icon: Star, superOnly: false },
    { name: 'Social Media & Share', path: '/admin/social', icon: Share2, superOnly: true },
    { name: 'Customer Directory', path: '/admin/customers', icon: Users, superOnly: true },
    { name: 'Admin Users & Passwords', path: '/admin/users', icon: KeyRound, superOnly: true },
    { name: 'Company Settings', path: '/admin/settings', icon: Settings, superOnly: true },
    { name: 'System Audit Logs', path: '/admin/audit-logs', icon: History, superOnly: true },
  ];

  // Admin role only gets Dashboard Overview and Enquiry Pipeline; Super Admin gets completely everything
  const visibleNavItems = allNavItems.filter((item) => isSuperAdmin || !item.superOnly);

  // Check if current URL route requires Super Admin role
  const isSuperOnlyRoute = Boolean(
    currentUser &&
    !isSuperAdmin &&
    allNavItems.some((item) => item.superOnly && (location.pathname === item.path || location.pathname.startsWith(item.path + '/')))
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Admin Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-1.5 text-slate-300 hover:text-white rounded-md"
            >
              {mobileSidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <Link to="/admin" className="flex items-center gap-2">
              <img src="/sln-logo.png" alt="SLN Admin" className="h-10 w-12 object-contain" />
              <span className={`hidden sm:inline font-black text-[10px] tracking-wider px-2 py-0.5 rounded border uppercase ${
                isSuperAdmin
                  ? 'bg-purple-950 text-purple-300 border-purple-800'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-800'
              }`}>
                {isSuperAdmin ? 'SUPER ADMIN' : 'ADMIN PORTAL'}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            >
              View Public Site <ExternalLink size={12} />
            </Link>

            {currentUser && (
              <div className="flex items-center gap-2 border-l border-slate-700 pl-4">
                <div className="text-right hidden sm:block">
                  <div className="font-bold text-slate-200">{currentUser.username}</div>
                  <div className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full inline-block ${
                    isSuperAdmin
                      ? 'bg-purple-900/60 text-purple-300 border border-purple-700/60'
                      : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/60'
                  }`}>
                    {isSuperAdmin ? 'Super Admin (Full Access)' : 'Admin (Dashboard & Enquiries)'}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-300 transition-colors"
                  title="Log out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col justify-between p-4 shrink-0 shadow-xs">
          <nav className="space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 flex items-center justify-between">
              <span>{isSuperAdmin ? 'All Master Modules' : 'Authorized Modules'}</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-black uppercase ${
                isSuperAdmin ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {isSuperAdmin ? 'Full' : 'Limited'}
              </span>
            </div>
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-colors ${
                    isActive
                      ? 'bg-sky-50 text-sky-800 font-bold border border-sky-200 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-sky-700' : 'text-slate-400'} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            Role: <strong className="text-slate-600 uppercase">{currentUser?.role || 'staff'}</strong> • SLN Admin Engine
          </div>
        </aside>

        {/* Mobile Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div className="fixed inset-0 bg-slate-900/60" onClick={() => setMobileSidebarOpen(false)}></div>
            <aside className="relative w-64 bg-white h-full flex flex-col justify-between p-4 shadow-2xl z-10">
              <nav className="space-y-1">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                  <span className="font-bold text-sm text-slate-800">
                    {isSuperAdmin ? 'Super Admin Modules' : 'Admin Modules'}
                  </span>
                  <button onClick={() => setMobileSidebarOpen(false)} className="text-slate-500">
                    <X size={20} />
                  </button>
                </div>
                {visibleNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs ${
                        isActive
                          ? 'bg-sky-50 text-sky-800 font-bold border border-sky-200'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon size={16} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <button
                onClick={handleLogout}
                className="btn btn-outline text-rose-700 hover:bg-rose-50 w-full text-xs"
              >
                <LogOut size={14} /> Log Out
              </button>
            </aside>
          </div>
        )}

        {/* Dynamic Outlet Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          {isSuperOnlyRoute ? (
            <div className="max-w-xl mx-auto my-12 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
                <Shield size={32} />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Super Admin Access Required
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                Your account (<strong>{currentUser?.username}</strong>) has the <strong>Admin</strong> role, which is authorized for <strong>Dashboard Overview</strong> and <strong>Enquiry Pipeline</strong> only.
              </p>
              <div className="bg-slate-50 rounded-xl p-3 text-[11px] text-slate-500 max-w-sm mx-auto font-mono">
                Requested Module: {location.pathname}
              </div>
              <div className="flex items-center justify-center gap-2.5 pt-3 flex-wrap">
                <Link to="/admin" className="btn btn-primary btn-sm text-xs">
                  <LayoutDashboard size={14} /> Dashboard Overview
                </Link>
                <Link to="/admin/enquiries" className="btn btn-outline btn-sm text-xs">
                  <Inbox size={14} /> Enquiry Pipeline
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-outline text-rose-600 hover:bg-rose-50 btn-sm text-xs"
                >
                  <LogOut size={14} /> Switch to Super Admin
                </button>
              </div>
            </div>
          ) : (
            <Outlet context={{ currentUser }} />
          )}
        </main>
      </div>
    </div>
  );
}
