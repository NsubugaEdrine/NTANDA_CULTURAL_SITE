import React, { useState, useMemo } from 'react';
import { FEATURED_REGALIA } from '../data/mockData';
import { RegaliaItem } from '../types';

interface GalleryViewProps {
  onSelectItem: (item: RegaliaItem) => void;
  savedItemIds: string[];
  onToggleSave: (id: string) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  onSelectItem,
  savedItemIds,
  onToggleSave
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Collections');

  const categories = ['All Collections', 'Garments', 'Jewelry', 'Headwear', 'Footwear', 'Ceremonial'];

  const filteredItems = useMemo(() => {
    return FEATURED_REGALIA.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All Collections' || item.category === selectedCategory;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tribe.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="pt-20 pb-24 min-h-screen pattern-overlay">
      <div className="max-w-7xl mx-auto px-4 md:px-16">
        {/* Page Header & Search */}
        <section className="py-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="font-label-md text-xs sm:text-sm text-[#855400] uppercase tracking-widest mb-2 block font-bold">
                Heritage Archives
              </span>
              <h2 className="font-display-lg text-3xl md:text-5xl text-[#1c1b1a]">
                Regalia Gallery
              </h2>
            </div>

            {/* Search Bar */}
            <div className="w-full md:max-w-md relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#88726c]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by region, tribe, or garment type..."
                className="w-full bg-white border-b-2 border-[#dbc1ba] py-3.5 pl-12 pr-4 focus:outline-none focus:border-[#855400] transition-all font-body-md text-sm text-[#1c1b1a] rounded-t-lg shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#88726c] hover:text-[#1c1b1a]"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="flex overflow-x-auto gap-3 pb-4 mb-8 custom-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full font-label-md text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer shadow-2xs ${
                  isActive
                    ? 'bg-[#6f250f] text-white shadow-sm font-bold'
                    : 'bg-[#ece7e5] text-[#55423e] hover:bg-[#dbc1ba]/50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </section>

        {/* Bento Grid of Regalia */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-[#dbc1ba]/30 p-8">
            <span className="material-symbols-outlined text-5xl text-[#88726c] mb-2">
              search_off
            </span>
            <h3 className="font-headline-sm text-xl text-[#1c1b1a]">No regalia items found</h3>
            <p className="font-body-md text-sm text-[#55423e] mt-1">
              Try resetting your search query or selecting a different category.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Collections');
              }}
              className="mt-4 px-6 py-2 bg-[#6f250f] text-white rounded-lg font-label-md text-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => {
              const isSaved = savedItemIds.includes(item.id);
              const isEven = index % 2 === 0;
              const barColor = isEven ? 'bg-[#6f250f]' : 'bg-[#855400]';

              return (
                <div
                  key={item.id}
                  className="group relative bg-white border border-[#dbc1ba]/20 rounded-lg overflow-hidden flex flex-col shadow-2xs hover:shadow-lg transition-all duration-300"
                >
                  <div
                    onClick={() => onSelectItem(item)}
                    className="aspect-[3/4] overflow-hidden relative cursor-pointer bg-[#1c1b1a]"
                  >
                    <div className={`absolute top-0 left-0 w-1 h-full ${barColor} z-10`}></div>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-4 left-4 z-20">
                      <span className="bg-[#264338]/80 text-white px-3 py-1 rounded-full font-label-md text-xs backdrop-blur-md">
                        {item.tribe}
                      </span>
                    </div>

                    {/* Bookmark Button Overlay */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(item.id);
                      }}
                      className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-colors z-30 cursor-pointer"
                      title={isSaved ? 'Remove from saved' : 'Save regalia'}
                    >
                      <span
                        className={`material-symbols-outlined text-lg ${
                          isSaved ? 'text-[#fdae41]' : ''
                        }`}
                      >
                        {isSaved ? 'bookmark' : 'bookmark_border'}
                      </span>
                    </button>
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div onClick={() => onSelectItem(item)} className="cursor-pointer">
                      <h3 className="font-headline-sm text-lg text-[#1c1b1a] mb-1 font-bold">
                        {item.title}
                      </h3>
                      <p className="font-body-md text-xs text-[#55423e] line-clamp-2 italic">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#dbc1ba]/20 flex justify-between items-center">
                      <span className="font-label-md text-xs text-[#88726c]">
                        {item.category}
                      </span>
                      <button
                        onClick={() => onSelectItem(item)}
                        className="material-symbols-outlined text-[#6f250f] hover:translate-x-1 transition-transform cursor-pointer"
                      >
                        arrow_forward
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
