import React, { useState, useMemo } from 'react';
import { COMMUNITIES } from '../data/mockData';
import { CommunityItem } from '../types';

interface CommunitiesViewProps {
  onSelectCommunity: (community: CommunityItem) => void;
  onExploreArchives: (communityName: string) => void;
}

export const CommunitiesView: React.FC<CommunitiesViewProps> = ({
  onSelectCommunity,
  onExploreArchives
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  const regions = ['All', 'Central Region', 'North Eastern Region', 'Western Region', 'Eastern Region', 'North Western Region'];

  const filteredCommunities = useMemo(() => {
    return COMMUNITIES.filter((com) => {
      const matchesRegion = selectedRegion === 'All' || com.region === selectedRegion;
      const matchesSearch =
        com.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        com.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        com.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (com.language && com.language.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesRegion && matchesSearch;
    });
  }, [searchQuery, selectedRegion]);

  return (
    <div className="pt-20 pb-24 max-w-7xl mx-auto px-4 lg:px-16 weave-pattern min-h-screen">
      {/* Page Header */}
      <section className="mb-10 border-l-4 border-[#6f250f] pl-6 py-2">
        <h2 className="font-headline-md text-3xl md:text-4xl text-[#1c1b1a] mb-2 font-bold">
          Ethnic Communities
        </h2>
        <p className="font-body-lg text-base md:text-lg text-[#55423e] max-w-2xl leading-relaxed">
          Explore the rich tapestry of Uganda's diverse ancestral heritage, from the kingdoms of the south to the resilient pastoralists of the north.
        </p>
      </section>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#88726c]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ancestors, clans, or languages..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-[#dbc1ba]/40 focus:border-[#855400] focus:ring-0 transition-all font-body-md text-sm text-[#1c1b1a] rounded-lg shadow-2xs"
          />
        </div>

        {/* Region Filter Dropdown */}
        <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 md:pb-0">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-4 py-3 bg-white border border-[#dbc1ba]/40 text-xs sm:text-sm font-label-md text-[#55423e] rounded-lg focus:outline-none focus:border-[#6f250f] cursor-pointer"
          >
            {regions.map((r) => (
              <option key={r} value={r}>
                {r === 'All' ? 'All Regions' : r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Community List */}
      {filteredCommunities.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-[#dbc1ba]/30 p-8">
          <span className="material-symbols-outlined text-5xl text-[#88726c] mb-2">
            search_off
          </span>
          <h3 className="font-headline-sm text-xl text-[#1c1b1a]">No ethnic communities found</h3>
          <p className="font-body-md text-sm text-[#55423e] mt-1">
            Try resetting your search query or region filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedRegion('All');
            }}
            className="mt-4 px-6 py-2 bg-[#6f250f] text-white rounded-lg font-label-md text-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {filteredCommunities.map((community, index) => {
            const isReverse = index % 2 === 1;
            const barColor = index % 2 === 0 ? 'bg-[#6f250f]' : 'bg-[#855400]';

            return (
              <article
                key={community.id}
                className={`group bg-white border border-[#dbc1ba]/30 rounded-lg overflow-hidden flex flex-col ${
                  isReverse ? 'lg:flex-row-reverse' : 'lg:flex-row'
                } hover:shadow-xl transition-all duration-300 shadow-2xs`}
              >
                <div className="lg:w-1/3 h-64 lg:h-auto overflow-hidden relative bg-[#1c1b1a]">
                  <div className="absolute inset-0 bg-[#6f250f]/10 group-hover:bg-transparent transition-colors z-10"></div>
                  <img
                    src={community.bannerImage}
                    alt={community.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 bg-[#264338]/80 text-white font-label-md text-xs rounded-full backdrop-blur-md">
                      {community.region}
                    </span>
                  </div>
                </div>

                <div className="lg:w-2/3 p-6 lg:p-10 flex flex-col justify-center border-l-0 lg:border-l border-[#dbc1ba]/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-8 h-1 ${barColor}`}></span>
                    <h3 className="font-headline-sm text-2xl text-[#6f250f] uppercase tracking-wide font-bold">
                      {community.name}
                    </h3>
                  </div>

                  <p className="font-body-lg text-base sm:text-lg text-[#55423e] mb-6 leading-relaxed">
                    {community.description}
                  </p>

                  <div className="flex flex-wrap gap-4 mt-auto pt-2">
                    <button
                      onClick={() => onExploreArchives(community.name)}
                      className="bg-[#6f250f] text-white px-6 py-2.5 rounded font-label-md text-sm hover:bg-[#8e3b24] transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
                    >
                      Explore Archives <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>

                    <button
                      onClick={() => onSelectCommunity(community)}
                      className="border border-[#88726c] text-[#855400] px-6 py-2.5 rounded font-label-md text-sm hover:bg-[#855400]/10 hover:border-[#855400] transition-all cursor-pointer"
                    >
                      View Lineage & Totems
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
