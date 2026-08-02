// BottomNavBar.tsx — Mobile-first bottom tab bar.
// Responsibilities:
//   - Renders the 5 primary destinations (Home, Gallery, Communities,
//     Search, Saved) as fixed bottom navigation.
//   - Highlights the active tab (filled icon + top accent border).
//   - Shows a badge on "Saved" with the current bookmark count so users
//     always know how many items are in their personal archive.
import React from 'react';
import { NavigationTab } from '../types';

interface BottomNavBarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  savedCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
  savedCount = 0
}) => {
  const tabs: { id: NavigationTab; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'gallery', label: 'Gallery', icon: 'account_balance' },
    { id: 'communities', label: 'Communities', icon: 'group' },
    { id: 'search', label: 'Search', icon: 'search' },
    { id: 'saved', label: 'Saved', icon: 'bookmark' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 pb-safe bg-[#fdf8f6] border-t border-[#dbc1ba]/30 h-16 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-150 cursor-pointer focus:outline-none ${
              isActive
                ? 'text-[#6f250f] border-t-2 border-[#6f250f] font-bold -mt-[2px]'
                : 'text-[#55423e] hover:text-[#6f250f]'
            }`}
          >
            <div className="relative">
              <span
                className={`material-symbols-outlined text-[22px] ${
                  isActive ? 'material-symbols-filled' : ''
                }`}
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {tab.icon}
              </span>
              {tab.id === 'saved' && savedCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#855400] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {savedCount}
                </span>
              )}
            </div>
            <span className="font-label-md text-[11px] uppercase tracking-wider mt-0.5">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
