import React from 'react';
import { FEATURED_REGALIA, COMMUNITIES, ARTIFACTS } from '../data/mockData';
import { RegaliaItem, ArtifactItem, CommunityItem, NavigationTab } from '../types';

interface HomeViewProps {
  onNavigate: (tab: NavigationTab) => void;
  onSelectItem: (item: RegaliaItem | ArtifactItem) => void;
  onSelectCommunity: (community: CommunityItem) => void;
  onOpenJoinModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onSelectItem,
  onSelectCommunity,
  onOpenJoinModal
}) => {
  const featuredRegaliaList = FEATURED_REGALIA.filter((r) => r.isFeatured);
  const latestArtifacts = ARTIFACTS.slice(4, 7); // Mbugu Tapestry, Communal Libation Bowl, Royal Ennanga

  return (
    <div className="pt-16 pb-24 md:max-w-7xl md:mx-auto">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden hero-pattern">
        <div className="px-4 md:px-16 py-10 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
          <div className="md:col-span-6 z-10">
            <span className="font-label-md text-xs sm:text-sm text-[#855400] uppercase tracking-widest mb-3 block font-bold">
              Cultural Preservation
            </span>
            <h2 className="font-display-lg-mobile md:font-display-lg text-3xl md:text-5xl text-[#6f250f] mb-6 leading-tight">
              Preserving Africa's Heritage, Inspiring Future Generations.
            </h2>
            <p className="font-body-lg text-base sm:text-lg text-[#55423e] max-w-lg mb-8 leading-relaxed">
              Journey through the deep corridors of time to rediscover the soul of Uganda's diverse cultures, from ancestral regalia to oral traditions.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('search')}
                className="bg-[#6f250f] text-white px-8 py-3.5 rounded-lg font-label-md text-sm hover:bg-[#8e3b24] hover:text-[#ffb9a7] transition-all active:scale-95 shadow-md cursor-pointer"
              >
                Explore Archives
              </button>
              <button
                onClick={onOpenJoinModal}
                className="border border-[#855400] text-[#855400] px-8 py-3.5 rounded-lg font-label-md text-sm hover:bg-[#855400]/10 transition-all cursor-pointer"
              >
                Join Community
              </button>
            </div>
          </div>

          <div className="md:col-span-6 relative mt-6 md:mt-0">
            <div className="aspect-[4/5] md:aspect-square rounded-xl overflow-hidden shadow-2xl border border-[#dbc1ba]/30">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRe4mrrql8EcJU7MIBfxroPKP8Q5M-PREWnFJuzEuSiDJNIjbs59wh2ee_MceSiZgVcBP1VJBxEJ5OAMiVF1ltgsmAApqbDhBSbZf1ZXI6EEBWrtAWwGL683KXRrt-sXY28D6K4jfDd4N00HEKFbJ9YeSA5YGoBxtfYDuspGKaXjx30I7PuDHxVntAYoJowaRg5GAQ4rX4wYSfKKt26eowYTCR_vIGrCMd4iL0EBkfT_6VERf6fxkWmA"
                alt="High-resolution photograph of traditional Ugandan dancers from the Baganda tribe performing a high-energy Baksimba dance with barkcloth and feathered headpieces"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 weave-accent -z-10 opacity-40"></div>
          </div>
        </div>
      </section>

      {/* Featured Regalia Section (Horizontal Scroll) */}
      <section className="py-12 border-t border-[#dbc1ba]/20">
        <div className="px-4 md:px-16 mb-6 flex justify-between items-end">
          <div>
            <h3 className="font-headline-md text-2xl sm:text-3xl text-[#1c1b1a] border-l-4 border-[#6f250f] pl-4">
              Featured Regalia
            </h3>
            <p className="font-body-md text-sm text-[#55423e] mt-1">
              Sacred artifacts of leadership and identity
            </p>
          </div>
          <button
            onClick={() => onNavigate('gallery')}
            className="text-[#6f250f] font-label-md text-sm hover:underline flex items-center gap-1 cursor-pointer"
          >
            View All <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>

        <div className="flex overflow-x-auto hide-scrollbar gap-6 px-4 md:px-16 pb-4">
          {featuredRegaliaList.map((item, idx) => {
            const barColors = ['bg-[#6f250f]', 'bg-[#855400]', 'bg-[#264338]'];
            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="flex-shrink-0 w-72 bg-white rounded-xl border border-[#dbc1ba]/30 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div className="h-48 relative overflow-hidden bg-[#1c1b1a]">
                  <div className={`absolute top-0 left-0 w-full h-1 ${barColors[idx % 3]}`}></div>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <span className="font-label-md text-[12px] bg-[#264338]/10 text-[#264338] px-2.5 py-0.5 rounded-full mb-2 inline-block font-semibold">
                    {item.tribe}
                  </span>
                  <h4 className="font-headline-sm text-lg text-[#1c1b1a]">
                    {item.title}
                  </h4>
                  <p className="font-body-md text-sm text-[#55423e] mt-1 line-clamp-2 italic">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Ethnic Spotlights */}
      <section className="py-12 bg-[#f7f3f1] border-y border-[#dbc1ba]/20">
        <div className="px-4 md:px-16 mb-8">
          <h3 className="font-headline-md text-2xl sm:text-3xl text-[#1c1b1a]">
            Ethnic Spotlights
          </h3>
          <p className="font-body-md text-sm text-[#55423e]">
            The diverse tapestry of Uganda's people
          </p>
        </div>

        <div className="flex overflow-x-auto hide-scrollbar gap-6 px-4 md:px-16">
          {COMMUNITIES.map((com) => (
            <div
              key={com.id}
              onClick={() => onSelectCommunity(com)}
              className="flex-shrink-0 text-center w-32 group cursor-pointer"
            >
              <div className="w-24 h-24 mx-auto rounded-full border-2 border-[#ffdbd1] p-1 group-hover:border-[#6f250f] transition-all duration-300 shadow-sm">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#1c1b1a]">
                  <img
                    src={com.avatarImage}
                    alt={com.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <span className="font-label-md text-sm mt-3 block text-[#1c1b1a] group-hover:text-[#6f250f] transition-colors font-semibold">
                {com.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Artifacts (Masonry-like Grid) */}
      <section className="py-12">
        <div className="px-4 md:px-16 mb-8 flex justify-between items-end">
          <div>
            <h3 className="font-headline-md text-2xl sm:text-3xl text-[#1c1b1a]">
              Latest Artifacts
            </h3>
            <p className="font-body-md text-sm text-[#55423e]">
              Recently added to the NTANDA digital archives
            </p>
          </div>
          <button
            onClick={() => onNavigate('search')}
            className="text-[#6f250f] font-label-md text-sm hover:underline flex items-center gap-1 cursor-pointer"
          >
            Explore All Archives <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>

        <div className="px-4 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArtifacts.map((art) => (
              <div
                key={art.id}
                onClick={() => onSelectItem(art)}
                className="relative group overflow-hidden rounded-xl h-80 shadow-md cursor-pointer"
              >
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-6 flex flex-col justify-end">
                  <span className="text-[#fdae41] text-xs font-label-md uppercase tracking-wider mb-1 font-bold">
                    {art.culture}
                  </span>
                  <h5 className="text-white font-headline-sm text-xl font-bold">
                    {art.title}
                  </h5>
                  <p className="text-white/80 font-body-md text-sm line-clamp-1 mt-0.5">
                    {art.description}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#fdae41] text-sm">
                      history
                    </span>
                    <span className="text-[#fdae41] font-label-md text-xs uppercase font-bold">
                      {art.addedTime}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
