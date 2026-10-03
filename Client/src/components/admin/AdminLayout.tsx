import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import {
  LayoutDashboard,
  Building2,
  FileText,
  Users,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Button } from '../ui/button';

export function AdminLayout() {
  const { user, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      name: 'Overview',
      path: '/admin',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: 'Listings',
      path: '/admin/listings',
      icon: Building2,
      badge: 'CRUD',
    },
    {
      name: 'Blog Articles',
      path: '/admin/blog',
      icon: FileText,
      badge: 'Phase 3',
    },
    {
      name: 'Eligibility Leads',
      path: '/admin/leads',
      icon: Users,
      badge: 'Funnel',
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <header className="md:hidden bg-primary text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <Link to="/admin" className="flex items-center gap-2.5">
          <img src={logo} alt="REI Consulting" className="h-8 w-auto brightness-0 invert" />
          <span className="font-heading font-bold text-sm tracking-wide text-amber-400">ADMIN</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-white/10 flex items-center gap-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Site
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary text-white px-4 py-4 space-y-2 border-b border-white/10 z-40">
          <div className="pb-3 border-b border-white/10 mb-3">
            <p className="text-xs text-slate-400">Signed in as:</p>
            <p className="text-sm font-semibold text-white truncate">{user?.email}</p>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <ShieldCheck className="w-3 h-3" />
              {role || 'admin'}
            </span>
          </div>

          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive(item.path, item.exact)
                  ? 'bg-accent text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/15 text-slate-200">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-300 hover:bg-red-500/20 rounded-xl"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-primary text-white border-r border-slate-800 shrink-0 sticky top-0 h-screen">
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="REI Consulting" className="h-10 w-auto brightness-0 invert" />
            <div>
              <span className="font-heading font-bold text-sm tracking-tight text-white block">REI Consulting</span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-accent">Admin Portal</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Management</p>
          {navItems.map((item) => {
            const active = isActive(item.path, item.exact);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) => `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-accent text-white font-semibold shadow-md shadow-accent/20'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                    active ? 'bg-black/20 text-white' : 'bg-white/10 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-sm border border-accent/30 shrink-0">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate" title={user?.email || ''}>
                {user?.email || 'Administrator'}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-semibold text-slate-400 capitalize">
                  {role || 'admin'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Site
            </Link>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
