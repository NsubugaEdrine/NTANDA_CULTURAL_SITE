import React from 'react';
import { FEATURED_REGALIA, ARTIFACTS } from '../data/mockData';
import { RegaliaItem, ArtifactItem, NavigationTab } from '../types';

interface SavedViewProps {
  savedItemIds: string[];
  onSelectItem: (item: RegaliaItem | ArtifactItem) => void;
  onToggleSave: (id: string) => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const SavedView: React.FC<SavedViewProps> = ({
  savedItemIds,
  onSelectItem,
  onToggleSave,
  onNavigate
}) => {
  const savedRegalia = FEATURED_REGALIA.filter((item) => savedItemIds.includes(item.id));
  const savedArtifacts = ARTIFACTS.filter((item) => savedItemIds.includes(item.id));
  const totalSaved = savedRegalia.length + savedArtifacts.length;

  return (
    <div className="pt-20 pb-24 max-w-7xl mx-auto px-4 lg:px-16 min-h-screen">
      <section className="mb-8 border-l-4 border-[#855400] pl-6 py-2">
        <span className="font-label-md text-xs sm:text-sm text-[#855400] uppercase tracking-widest block font-bold">
          Personal Research Archive
        </span>
        <h2 className="font-headline-md text-3xl md:text-4xl text-[#1c1b1a] mb-1 font-bold">
          My Saved Archives ({totalSaved})
        </h2>
        <p className="font-body-lg text-sm sm:text-base text-[#55423e]">
          Your curated collection of sacred African regalia, historic artifacts, and ancestral knowledge.
        </p>
      </section>

      {totalSaved === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-[#dbc1ba]/30 p-8">
          <span className="material-symbols-outlined text-6xl text-[#88726c] mb-3">
            bookmark_border
          </span>
          <h3 className="font-headline-sm text-2xl text-[#1c1b1a] font-semibold">
            Your collection is currently empty
          </h3>
          <p className="font-body-md text-sm text-[#55423e] max-w-md mx-auto mt-2">
            Click the bookmark icon on any Regalia or Artifact card in the gallery or archive to save it to your personal research collection.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onNavigate('gallery')}
              className="px-6 py-2.5 bg-[#6f250f] text-white rounded-lg font-label-md text-sm hover:bg-[#8e3b24]"
            >
              Browse Regalia Gallery
            </button>
            <button
              onClick={() => onNavigate('search')}
              className="px-6 py-2.5 border border-[#855400] text-[#855400] rounded-lg font-label-md text-sm hover:bg-[#855400]/10"
            >
              Explore Digital Archives
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Saved Regalia Section */}
          {savedRegalia.length > 0 && (
            <div>
              <h3 className="font-headline-sm text-xl text-[#6f250f] font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">account_balance</span>
                Saved Regalia ({savedRegalia.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedRegalia.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className="bg-white border border-[#dbc1ba]/30 rounded-lg overflow-hidden flex flex-col hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="h-48 relative overflow-hidden bg-[#1c1b1a]">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSave(item.id);
                        }}
                        className="absolute top-2 right-2 bg-black/50 text-[#fdae41] p-2 rounded-full backdrop-blur-md"
                        title="Remove from saved"
                      >
                        <span className="material-symbols-outlined text-sm material-symbols-filled">
                          bookmark
                        </span>
                      </button>
                      <span className="absolute bottom-2 left-2 bg-[#264338]/80 text-white px-2.5 py-0.5 rounded-full font-label-md text-[11px]">
                        {item.tribe}
                      </span>
                    </div>
                    <div className="p-4">
                      <h4 className="font-headline-sm text-lg text-[#1c1b1a] font-bold">
                        {item.title}
                      </h4>
                      <p className="font-body-md text-xs text-[#55423e] mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Saved Artifacts Section */}
          {savedArtifacts.length > 0 && (
            <div>
              <h3 className="font-headline-sm text-xl text-[#6f250f] font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">manage_search</span>
                Saved Artifacts ({savedArtifacts.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedArtifacts.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className="bg-white border border-[#dbc1ba]/30 rounded-lg overflow-hidden flex flex-col hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="h-48 relative overflow-hidden bg-[#1c1b1a]">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSave(item.id);
                        }}
                        className="absolute top-2 right-2 bg-black/50 text-[#fdae41] p-2 rounded-full backdrop-blur-md"
                        title="Remove from saved"
                      >
                        <span className="material-symbols-outlined text-sm material-symbols-filled">
                          bookmark
                        </span>
                      </button>
                      <span className="absolute bottom-2 left-2 bg-[#6f250f]/80 text-white px-2.5 py-0.5 rounded-full font-label-md text-[11px]">
                        {item.culture}
                      </span>
                    </div>
                    <div className="p-4">
                      <h4 className="font-headline-sm text-lg text-[#1c1b1a] font-bold">
                        {item.title}
                      </h4>
                      <p className="font-body-md text-xs text-[#55423e] mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
