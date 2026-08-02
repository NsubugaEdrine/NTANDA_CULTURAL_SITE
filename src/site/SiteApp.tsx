// SiteApp.tsx — The public heritage site (single-page app shell).
// This is the layout used for the 5 main tabs and owns the shared UI state:
//   - activeTab            : which of home/gallery/communities/search/saved
//                            is rendered in <main>.
//   - savedItemIds         : bookmarked regalia/artifact ids, persisted to
//                            localStorage under 'ntanda_saved_items' so saved
//                            items survive page reloads.
//   - selectedItem/community: what the detail / lineage modals display.
//   - searchInitialQuery   : lets a community "Explore archives" button
//                            pre-fill the search view.
//   - Drawer & modal open flags for the menu, notifications, join form and
//     the Ethical Preservation Charter.
// It composes TopAppBar + the active view + Footer + BottomNavBar and renders
// the overlays (HeaderDrawer, ItemDetailModal, LineageModal,
// JoinCommunityModal, NotificationModal, ethical guidelines modal).
import React, { useState, useEffect } from 'react';
import { NavigationTab, RegaliaItem, ArtifactItem, CommunityItem } from '../types';
import { TopAppBar } from '../components/TopAppBar';
import { BottomNavBar } from '../components/BottomNavBar';
import { HeaderDrawer } from '../components/HeaderDrawer';
import { ItemDetailModal } from '../components/ItemDetailModal';
import { LineageModal } from '../components/LineageModal';
import { JoinCommunityModal } from '../components/JoinCommunityModal';
import { NotificationModal } from '../components/NotificationModal';
import { Footer } from '../components/Footer';

import { HomeView } from '../views/HomeView';
import { GalleryView } from '../views/GalleryView';
import { CommunitiesView } from '../views/CommunitiesView';
import { SearchView } from '../views/SearchView';
import { SavedView } from '../views/SavedView';

export default function SiteApp() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isEthicalModalOpen, setIsEthicalModalOpen] = useState(false);

  // Selected detail states
  const [selectedItem, setSelectedItem] = useState<RegaliaItem | ArtifactItem | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityItem | null>(null);
  const [searchInitialQuery, setSearchInitialQuery] = useState('');

  // Local storage for saved bookmarks
  const [savedItemIds, setSavedItemIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('ntanda_saved_items');
      return stored ? JSON.parse(stored) : ['reg-omukama-crown', 'art-talking-drums'];
    } catch {
      return ['reg-omukama-crown', 'art-talking-drums'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ntanda_saved_items', JSON.stringify(savedItemIds));
    } catch {
      // Ignore quota errors
    }
  }, [savedItemIds]);

  const toggleSave = (id: string) => {
    setSavedItemIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExploreCommunityArchives = (communityName: string) => {
    setSearchInitialQuery(communityName);
    setActiveTab('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: NavigationTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-[#fdf8f6] min-h-screen text-[#1c1b1a] relative flex flex-col font-body-md">
      {/* Top Header */}
      <TopAppBar
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onNavigateHome={() => handleTabChange('home')}
      />

      {/* Main Content Body */}
      <main className="flex-grow">
        {activeTab === 'home' && (
          <HomeView
            onNavigate={handleTabChange}
            onSelectItem={(item) => setSelectedItem(item)}
            onSelectCommunity={(community) => setSelectedCommunity(community)}
            onOpenJoinModal={() => setIsJoinModalOpen(true)}
          />
        )}

        {activeTab === 'gallery' && (
          <GalleryView
            onSelectItem={(item) => setSelectedItem(item)}
            savedItemIds={savedItemIds}
            onToggleSave={toggleSave}
          />
        )}

        {activeTab === 'communities' && (
          <CommunitiesView
            onSelectCommunity={(community) => setSelectedCommunity(community)}
            onExploreArchives={handleExploreCommunityArchives}
          />
        )}

        {activeTab === 'search' && (
          <SearchView
            onSelectArtifact={(artifact) => setSelectedItem(artifact)}
            savedItemIds={savedItemIds}
            onToggleSave={toggleSave}
            initialQuery={searchInitialQuery}
          />
        )}

        {activeTab === 'saved' && (
          <SavedView
            savedItemIds={savedItemIds}
            onSelectItem={(item) => setSelectedItem(item)}
            onToggleSave={toggleSave}
            onNavigate={handleTabChange}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleTabChange}
        onOpenEthicalGuidelines={() => setIsEthicalModalOpen(true)}
      />

      {/* Bottom Navigation */}
      <BottomNavBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        savedCount={savedItemIds.length}
      />

      {/* Drawers and Modals */}
      <HeaderDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeTab={activeTab}
        onNavigate={handleTabChange}
        onOpenJoinModal={() => setIsJoinModalOpen(true)}
        onOpenEthicalGuidelines={() => setIsEthicalModalOpen(true)}
      />

      <ItemDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        isSaved={selectedItem ? savedItemIds.includes(selectedItem.id) : false}
        onToggleSave={toggleSave}
      />

      <LineageModal
        community={selectedCommunity}
        onClose={() => setSelectedCommunity(null)}
        onExploreArchives={handleExploreCommunityArchives}
      />

      <JoinCommunityModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />

      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Ethical Guidelines Modal */}
      {isEthicalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsEthicalModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-[#fdf8f6] rounded-xl shadow-2xl border border-[#dbc1ba]/30 overflow-hidden z-10 p-6 space-y-4 my-auto">
            <div className="flex justify-between items-center border-b border-[#dbc1ba]/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6f250f]">verified</span>
                <h3 className="font-headline-sm text-xl text-[#6f250f] font-bold">
                  Ethical Preservation Charter
                </h3>
              </div>
              <button
                onClick={() => setIsEthicalModalOpen(false)}
                className="text-[#55423e] hover:text-[#1c1b1a]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 font-body-md text-sm text-[#1c1b1a] max-h-80 overflow-y-auto pr-1">
              <p>
                <strong>1. Indigenous Ownership & Consent:</strong> All digital representations of sacred artifacts and clan regalia displayed on NTANDA are curated in consultation with elder councils and traditional chiefdoms.
              </p>
              <p>
                <strong>2. Non-Commercial Stewardship:</strong> Educational access is free to scholars, students, and citizens. Commercial exploitation of sacred symbols without community lineage approval is strictly prohibited.
              </p>
              <p>
                <strong>3. Sacred Integrity & Respect:</strong> Items designated for restricted ritual observation are presented with scholarly dignity, preserving spiritual reverence and historical context.
              </p>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setIsEthicalModalOpen(false)}
                className="bg-[#6f250f] text-white px-6 py-2 rounded-lg font-label-md text-sm hover:bg-[#8e3b24]"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
