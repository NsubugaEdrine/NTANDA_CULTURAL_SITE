// DashboardShell.tsx — Shared layout for the contributor studio & admin area.
// Responsibilities:
//   - Renders the fixed sidebar (brand, NavLinks, current-user card with
//     avatar/name/email, and View Site / Sign Out actions) plus a header and
//     the routed page content.
//   - The sidebar is role-aware: admins additionally see Admin Panel,
//     Content Manager and User Management links.
//   - NavLink end matching keeps "Overview" active only on /dashboard.
import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { Button } from '../ui/form';

interface DashboardShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ title, subtitle, children }) => {
  const { profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/dashboard', label: 'Overview', icon: 'dashboard', end: true },
    { to: '/dashboard/posts', label: 'My Posts', icon: 'article' },
    { to: '/dashboard/pages', label: 'My Pages', icon: 'description' },
    { to: '/profile', label: 'My Profile', icon: 'person' },
    ...(isAdmin
      ? [
          { to: '/admin', label: 'Admin Panel', icon: 'admin_panel_settings' },
          { to: '/admin/content', label: 'Content Manager', icon: 'inventory_2' },
          { to: '/admin/users', label: 'User Management', icon: 'group' },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-[#fdf8f6] flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-64 lg:min-h-screen bg-white border-r border-[#dbc1ba]/30 lg:sticky lg:top-0 lg:h-screen overflow-y-auto">
        <div className="p-5 border-b border-[#dbc1ba]/20">
          <Link to="/" className="font-display-lg-mobile text-2xl text-[#6f250f] font-bold tracking-tight">
            NTANDA
          </Link>
          <p className="font-label-md text-[11px] text-[#855400] uppercase tracking-widest mt-0.5">
            {isAdmin ? 'Administration Console' : 'Contributor Studio'}
          </p>
        </div>

        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg font-body-md text-sm transition-colors ${
                  isActive
                    ? 'bg-[#6f250f]/10 text-[#6f250f] font-semibold'
                    : 'text-[#1c1b1a] hover:bg-[#f1edeb]'
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-[#dbc1ba]/20 mt-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#6f250f]/10 flex items-center justify-center overflow-hidden shrink-0">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={profile?.user_name ?? 'avatar'} className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-[#6f250f]">person</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-body-md text-sm font-semibold text-[#1c1b1a] truncate">
                {profile?.user_name ?? profile?.full_name ?? 'User'}
              </p>
              <p className="font-body-md text-xs text-[#55423e] truncate">{profile?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1 !px-2 !py-2 text-xs" onClick={() => navigate('/')}>
              View Site
            </Button>
            <Button variant="ghost" className="!px-2 !py-2 text-xs" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <header className="px-6 md:px-10 py-6 border-b border-[#dbc1ba]/20 bg-white/60">
          <h1 className="font-headline-md text-2xl text-[#1c1b1a]">{title}</h1>
          {subtitle && <p className="font-body-md text-sm text-[#55423e] mt-0.5">{subtitle}</p>}
        </header>
        <main className="p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
};
