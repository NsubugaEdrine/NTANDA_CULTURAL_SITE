// HeaderDrawer.tsx — Slide-in navigation menu from the hamburger button.
// Responsibilities:
//   - Backdrop + left drawer overlay; returns null when closed.
//   - Primary navigation links that switch the active tab and close the
//     drawer (Home, Gallery, Communities, Archive, Saved, Community Stories).
//   - Auth-aware account section: guests get "Sign In / Sign Up"; signed-in
//     users get My Studio, Admin Panel (admins only), My Profile and Sign Out.
//   - Special actions: opens the Ethical Preservation Guidelines modal and
//     the Join Community & Contribute form.
//   - Brand footer inside the drawer with the heritage tagline.
import React from 'react';
import { NavigationTab } from '../types';
import { useAuth } from '../lib/auth';

interface HeaderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  onOpenJoinModal: () => void;
  onOpenEthicalGuidelines: () => void;
}

export const HeaderDrawer: React.FC<HeaderDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenJoinModal,
  onOpenEthicalGuidelines
}) => {
  const { session, profile, isAdmin, signOut } = useAuth();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative w-80 max-w-[85vw] bg-[#fdf8f6] h-full shadow-2xl flex flex-col justify-between p-6 z-10 border-r border-[#dbc1ba]/30 overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-[#dbc1ba]/20">
            <div>
              <h2 className="font-display-lg-mobile text-[#6f250f] font-bold tracking-tight">
                UBUNTU-GEN
              </h2>
              <p className="font-label-md text-[11px] text-[#855400] uppercase tracking-widest mt-0.5">
                Heritage Platform
              </p>
            </div>
            <button
              onClick={onClose}
              className="material-symbols-outlined text-[#55423e] hover:bg-[#ece7e5] p-2 rounded-full cursor-pointer"
            >
              close
            </button>
          </div>

          {/* Navigation Links */}
          <div className="py-6 space-y-2">
            <button
              onClick={() => {
                onNavigate('home');
                onClose();
              }}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left font-body-lg text-[#1c1b1a] hover:bg-[#f1edeb] transition-colors"
            >
              <span className="material-symbols-outlined text-[#6f250f]">home</span>
              Home Overview
            </button>

            <button
              onClick={() => {
                onNavigate('gallery');
                onClose();
              }}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left font-body-lg text-[#1c1b1a] hover:bg-[#f1edeb] transition-colors"
            >
              <span className="material-symbols-outlined text-[#6f250f]">account_balance</span>
              Regalia Gallery
            </button>

            <button
              onClick={() => {
                onNavigate('communities');
                onClose();
              }}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left font-body-lg text-[#1c1b1a] hover:bg-[#f1edeb] transition-colors"
            >
              <span className="material-symbols-outlined text-[#6f250f]">group</span>
              Ethnic Communities
            </button>

            <button
              onClick={() => {
                onNavigate('search');
                onClose();
              }}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left font-body-lg text-[#1c1b1a] hover:bg-[#f1edeb] transition-colors"
            >
              <span className="material-symbols-outlined text-[#6f250f]">manage_search</span>
              Digital Artifact Archive
            </button>

            <button
              onClick={() => {
                onNavigate('saved');
                onClose();
              }}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left font-body-lg text-[#1c1b1a] hover:bg-[#f1edeb] transition-colors"
            >
              <span className="material-symbols-outlined text-[#6f250f]">bookmark</span>
              My Saved Archives
            </button>

            <a
              href="/stories"
              onClick={onClose}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left font-body-lg text-[#1c1b1a] hover:bg-[#f1edeb] transition-colors"
            >
              <span className="material-symbols-outlined text-[#6f250f]">auto_stories</span>
              Community Stories
            </a>
          </div>

          <hr className="border-[#dbc1ba]/20 my-2" />

          {/* Account Actions */}
          <div className="py-4 space-y-2">
            {session ? (
              <>
                <a
                  href="/dashboard"
                  onClick={onClose}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left font-body-lg text-[#1c1b1a] hover:bg-[#f1edeb] transition-colors"
                >
                  <span className="material-symbols-outlined text-[#6f250f]">dashboard</span>
                  My Studio
                </a>
                {isAdmin && (
                  <a
                    href="/admin"
                    onClick={onClose}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left font-body-lg text-[#1c1b1a] hover:bg-[#f1edeb] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[#6f250f]">admin_panel_settings</span>
                    Admin Panel
                  </a>
                )}
                <a
                  href="/profile"
                  onClick={onClose}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left font-body-lg text-[#1c1b1a] hover:bg-[#f1edeb] transition-colors"
                >
                  <span className="material-symbols-outlined text-[#6f250f]">person</span>
                  My Profile
                </a>
                <button
                  onClick={() => {
                    signOut();
                    onClose();
                  }}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left font-body-lg text-[#8a1c15] hover:bg-[#f1edeb] transition-colors"
                >
                  <span className="material-symbols-outlined text-[#8a1c15]">logout</span>
                  Sign Out
                </button>
              </>
            ) : (
              <a
                href="/auth"
                onClick={onClose}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left font-body-lg text-[#1c1b1a] hover:bg-[#f1edeb] transition-colors"
              >
                <span className="material-symbols-outlined text-[#6f250f]">login</span>
                Sign In / Sign Up
              </a>
            )}
          </div>

          <hr className="border-[#dbc1ba]/20 my-2" />

          {/* Special Actions */}
          <div className="py-4 space-y-3">
            <button
              onClick={() => {
                onOpenEthicalGuidelines();
                onClose();
              }}
              className="w-full text-left px-4 py-2 font-label-md text-[#855400] hover:underline flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">verified_user</span>
              Ethical Preservation Guidelines
            </button>

            <button
              onClick={() => {
                onOpenJoinModal();
                onClose();
              }}
              className="w-full bg-[#6f250f] text-white px-5 py-3 rounded-lg font-label-md text-center hover:bg-[#8e3b24] transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">person_add</span>
              Join Community & Contribute
            </button>
          </div>
        </div>

        {/* Footer info inside drawer */}
        <div className="pt-6 border-t border-[#dbc1ba]/20 text-center space-y-2">
          <p className="font-body-md text-xs text-[#55423e] italic">
            "Ancestral storytelling for the digital age."
          </p>
          <div className="flex justify-center gap-3 text-[#6f250f]/60 pt-1">
            <span className="material-symbols-outlined text-lg">auto_stories</span>
            <span className="material-symbols-outlined text-lg">public</span>
            <span className="material-symbols-outlined text-lg">verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
