import React from 'react';

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
