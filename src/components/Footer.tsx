import React from 'react';
import { NavigationTab } from '../types';

interface FooterProps {
  onNavigate?: (tab: NavigationTab) => void;
  onOpenEthicalGuidelines?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenEthicalGuidelines
}) => {
  return (
    <footer className="w-full py-12 px-4 md:px-16 flex flex-col items-center space-y-6 mb-20 bg-[#f1edeb] border-t border-[#dbc1ba]/20 text-center">
      <h2 className="font-display-lg-mobile text-3xl md:text-4xl text-[#6f250f] font-bold tracking-tight">
        NTANDA
      </h2>
      <p className="font-body-md text-sm md:text-base text-[#55423e] max-w-xl italic">
        "© 2024 NTANDA Heritage Platform. Ancestral storytelling for the digital age."
      </p>

      <div className="flex flex-wrap justify-center gap-6">
        <button
          onClick={() => onNavigate && onNavigate('search')}
          className="font-label-md text-sm text-[#55423e] hover:text-[#6f250f] transition-colors cursor-pointer"
        >
          Archives
        </button>
        <button
          onClick={() => onOpenEthicalGuidelines && onOpenEthicalGuidelines()}
          className="font-label-md text-sm text-[#55423e] hover:text-[#6f250f] transition-colors cursor-pointer"
        >
          Ethical Guidelines
        </button>
        <button
          onClick={() => onNavigate && onNavigate('communities')}
          className="font-label-md text-sm text-[#55423e] hover:text-[#6f250f] transition-colors cursor-pointer"
        >
          Credits & Lineages
        </button>
      </div>

      <div className="pt-2 opacity-50">
        <div className="flex gap-3 text-[#6f250f]">
          <span className="material-symbols-outlined text-xl">auto_stories</span>
          <span className="material-symbols-outlined text-xl">public</span>
          <span className="material-symbols-outlined text-xl">verified</span>
        </div>
      </div>
    </footer>
  );
};
