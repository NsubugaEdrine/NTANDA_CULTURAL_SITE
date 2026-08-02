// TopAppBar.tsx — Fixed header shown on the public site.
// Responsibilities:
//   - Hamburger button that opens the navigation HeaderDrawer.
//   - NTANDA wordmark that returns to the Home tab.
//   - Auth-aware account button: shows "Sign In" for guests and a
//     "My Studio"/avatar link to /dashboard for signed-in users.
//   - Notifications bell with an animated unread indicator (default 3,
//     can be overridden via props).
import React from 'react';
import { useAuth } from '../lib/auth';

interface TopAppBarProps {
  onOpenDrawer: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
  onNavigateHome: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  onOpenDrawer,
  onOpenNotifications,
  unreadNotificationsCount = 3,
  onNavigateHome
}) => {
  const { session, profile, isLoading } = useAuth();

  const accountTarget = session ? '/dashboard' : '/auth';
  const accountIcon = session ? 'account_circle' : 'login';
  const accountLabel = session ? (profile?.user_name ?? 'Dashboard') : 'Sign In';

  return (
    <header className="flex items-center justify-between px-4 md:px-16 h-16 w-full fixed top-0 z-40 bg-[#fdf8f6]/95 backdrop-blur-sm border-b border-[#dbc1ba]/20 transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenDrawer}
          className="material-symbols-outlined text-[#6f250f] hover:bg-[#f7f3f1] transition-colors p-2 rounded-full cursor-pointer focus:outline-none"
          title="Open Menu"
          aria-label="Open Navigation Menu"
        >
          menu
        </button>
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 group cursor-pointer text-left focus:outline-none"
        >
          <h1 className="font-display-lg-mobile md:text-[32px] text-[#6f250f] tracking-tighter font-bold group-hover:opacity-90 transition-opacity">
            NTANDA
          </h1>
        </button>
      </div>

      <div className="flex items-center gap-2">
        {!isLoading && (
          <a
            href={accountTarget}
            className="hidden md:flex items-center gap-1.5 bg-[#6f250f] text-white px-4 py-2 rounded-lg font-label-md text-xs hover:bg-[#8e3b24] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">{accountIcon}</span>
            {session ? 'My Studio' : accountLabel}
          </a>
        )}
        {!isLoading && session && profile?.avatar_url && (
          <a
            href="/dashboard"
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#dbc1ba] hover:border-[#6f250f] transition-colors"
            title={accountLabel}
          >
            <img src={profile.avatar_url} alt={profile?.user_name ?? 'avatar'} className="w-full h-full object-cover" />
          </a>
        )}
        <button
          onClick={onOpenNotifications}
          className="relative material-symbols-outlined text-[#6f250f] hover:bg-[#f7f3f1] transition-colors p-2 rounded-full cursor-pointer focus:outline-none"
          title="Notifications"
          aria-label="View Notifications"
        >
          notifications
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#855400] rounded-full border border-[#fdf8f6] animate-pulse"></span>
          )}
        </button>
      </div>
    </header>
  );
};
