// SearchView.tsx — Digital Artifact Archive tab.
// Responsibilities:
//   - Loads artifacts and filters by a free-text query across title, culture,
//     location, material, description and reference number.
//   - Supports three sort orders: chronological (by estimated age string),
//     region (location) and material.
//   - Shows artifacts in list rows with audio indicator (if audioTrack set),
//     bookmark toggle and "View Significance" which opens the detail modal.
//   - Progressive loading: only `visibleCount` items render and a
//     "Load More Artifacts" button reveals more in batches of 4.
//   - initialQuery prop pre-fills the search box (used by the community
//     "Explore archives" flow).
import React, { useState, useMemo } from 'react';
import { useArtifacts } from '../lib/useContent';
import { ArtifactItem } from '../types';

interface SearchViewProps {
  onSelectArtifact: (artifact: ArtifactItem) => void;
  savedItemIds: string[];
  onToggleSave: (id: string) => void;
  initialQuery?: string;
}

export const SearchView: React.FC<SearchViewProps> = ({
  onSelectArtifact,
  savedItemIds,
  onToggleSave,
  initialQuery = ''
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<'chronological' | 'region' | 'material'>('chronological');
  const [visibleCount, setVisibleCount] = useState(6);
  const { items: artifacts, loading } = useArtifacts();

  const filteredArtifacts = useMemo(() => {
    let result = artifacts.filter((art) => {
      const q = searchQuery.toLowerCase();
      return (
        art.title.toLowerCase().includes(q) ||
        art.culture.toLowerCase().includes(q) ||
        art.location.toLowerCase().includes(q) ||
        art.material.toLowerCase().includes(q) ||
        art.description.toLowerCase().includes(q) ||
        art.refNumber.toLowerCase().includes(q)
      );
    });

    if (sortBy === 'region') {
      result = [...result].sort((a, b) => a.location.localeCompare(b.location));
    } else if (sortBy === 'material') {
      result = [...result].sort((a, b) => a.material.localeCompare(b.material));
    } else {
      // chronological
      result = [...result].sort((a, b) => a.estimatedAge.localeCompare(b.estimatedAge));
    }

    return result;
  }, [artifacts, searchQuery, sortBy]);

  const displayedArtifacts = filteredArtifacts.slice(0, visibleCount);

  return (
    <div className="pt-24 pb-32 px-4 md:px-16 max-w-7xl mx-auto min-h-screen">
      {/* Page Header & Filter Section */}
      <section className="mb-10 space-y-6">
        <div className="space-y-2">
          <span className="font-label-md text-xs sm:text-sm text-[#855400] uppercase tracking-widest block font-bold">
            Heritage Repository
          </span>
          <h2 className="font-headline-md text-3xl md:text-4xl text-[#1c1b1a] font-bold">
            Digital Artifact Archive
          </h2>
          <p className="font-body-lg text-base sm:text-lg text-[#55423e] max-w-2xl leading-relaxed">
            Exploring the craftsmanship and spiritual significance of ancestral legacies curated from diverse regions across the continent.
          </p>
        </div>

        {/* Sorting & Search UI */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-y border-[#dbc1ba]/30">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-label-md text-xs sm:text-sm text-[#55423e]">Sort by:</span>
            <button
              onClick={() => setSortBy('chronological')}
              className={`px-4 py-1.5 rounded-full border text-xs font-label-md transition-colors cursor-pointer ${
                sortBy === 'chronological'
                  ? 'border-[#6f250f] bg-[#6f250f]/5 text-[#6f250f] font-bold'
                  : 'border-[#88726c] text-[#55423e] hover:border-[#6f250f]'
              }`}
            >
              Chronological
            </button>

            <button
              onClick={() => setSortBy('region')}
              className={`px-4 py-1.5 rounded-full border text-xs font-label-md transition-colors cursor-pointer ${
                sortBy === 'region'
                  ? 'border-[#6f250f] bg-[#6f250f]/5 text-[#6f250f] font-bold'
                  : 'border-[#88726c] text-[#55423e] hover:border-[#6f250f]'
              }`}
            >
              Region
            </button>

            <button
              onClick={() => setSortBy('material')}
              className={`px-4 py-1.5 rounded-full border text-xs font-label-md transition-colors cursor-pointer ${
                sortBy === 'material'
                  ? 'border-[#6f250f] bg-[#6f250f]/5 text-[#6f250f] font-bold'
                  : 'border-[#88726c] text-[#55423e] hover:border-[#6f250f]'
              }`}
            >
              Material
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#55423e] text-sm">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search archive..."
              className="w-full pl-10 pr-4 py-2 bg-[#f1edeb] border-none focus:ring-1 focus:ring-[#855400] rounded-lg font-body-md text-sm text-[#1c1b1a]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#88726c]"
              >
                <span className="material-symbols-outlined text-xs">close</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Artifact List */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-xl border border-[#dbc1ba]/30 p-8">
          <div className="w-8 h-8 border-4 border-[#dbc1ba] border-t-[#6f250f] rounded-full animate-spin mx-auto"></div>
          <p className="font-body-md text-sm text-[#55423e] mt-3">Loading artifacts...</p>
        </div>
      ) : displayedArtifacts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-[#dbc1ba]/30 p-8">
          <span className="material-symbols-outlined text-5xl text-[#88726c] mb-2">
            search_off
          </span>
          <h3 className="font-headline-sm text-xl text-[#1c1b1a]">No digital artifacts found</h3>
          <p className="font-body-md text-sm text-[#55423e] mt-1">
            Try adjusting your query or resetting the search filter.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 px-6 py-2 bg-[#6f250f] text-white rounded-lg font-label-md text-sm"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-4">
          {displayedArtifacts.map((art, index) => {
            const isSaved = savedItemIds.includes(art.id);
            const sideBarColors = ['bg-[#6f250f]', 'bg-[#855400]', 'bg-[#264338]'];
            const sideBar = sideBarColors[index % 3];

            return (
              <div
                key={art.id}
                className="bg-white border border-[#dbc1ba]/30 rounded-xl overflow-hidden flex flex-col md:flex-row items-center gap-6 p-4 hover:shadow-lg transition-all duration-300 relative group"
              >
                <div className={`absolute top-0 left-0 w-1 h-full ${sideBar}`}></div>

                <div
                  onClick={() => onSelectArtifact(art)}
                  className="w-full md:w-56 h-48 md:h-36 shrink-0 overflow-hidden rounded-lg bg-[#1c1b1a] relative cursor-pointer"
                >
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {art.audioTrack && (
                    <span className="absolute top-2 left-2 bg-black/60 text-[#fdae41] p-1 rounded-full backdrop-blur-md">
                      <span className="material-symbols-outlined text-xs">volume_up</span>
                    </span>
                  )}
                </div>

                <div
                  onClick={() => onSelectArtifact(art)}
                  className="flex-grow space-y-1 cursor-pointer w-full"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#264338]/10 text-[#264338] text-[10px] font-bold uppercase rounded">
                      {art.culture}
                    </span>
                    <span className="font-label-md text-xs text-[#55423e]">
                      Ref: {art.refNumber}
                    </span>
                  </div>

                  <h3 className="font-headline-sm text-xl text-[#1c1b1a] font-bold group-hover:text-[#6f250f] transition-colors">
                    {art.title}
                  </h3>

                  <p className="font-body-md text-sm text-[#55423e]">
                    Estimated Age: <span className="text-[#855400] font-semibold">{art.estimatedAge}</span>
                  </p>

                  <div className="flex items-center gap-2 text-[#55423e] mt-2">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    <span className="text-xs font-label-md">{art.location}</span>
                  </div>
                </div>

                <div className="w-full md:w-auto shrink-0 flex items-center justify-end gap-2">
                  <button
                    onClick={() => onToggleSave(art.id)}
                    className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                      isSaved
                        ? 'border-[#855400] bg-[#855400]/10 text-[#855400]'
                        : 'border-[#dbc1ba] text-[#55423e] hover:bg-[#f1edeb]'
                    }`}
                    title={isSaved ? 'Remove from saved' : 'Save artifact'}
                  >
                    <span
                      className={`material-symbols-outlined text-lg ${
                        isSaved ? 'material-symbols-filled' : ''
                      }`}
                    >
                      {isSaved ? 'bookmark' : 'bookmark_border'}
                    </span>
                  </button>

                  <button
                    onClick={() => onSelectArtifact(art)}
                    className="w-full md:w-auto px-6 py-3 bg-[#6f250f] text-white rounded-lg font-label-md text-sm hover:bg-[#8e3b24] hover:text-[#ffb9a7] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    View Significance
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* Pagination / Load More */}
      {visibleCount < filteredArtifacts.length && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 4)}
            className="px-8 py-3 border border-[#88726c] text-[#6f250f] font-label-md text-sm rounded-lg hover:bg-[#f1edeb] transition-colors cursor-pointer"
          >
            Load More Artifacts ({filteredArtifacts.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
};
