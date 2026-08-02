// LineageModal.tsx — Community lineage & totem detail modal.
// Responsibilities:
//   - Returns null when no community is selected; otherwise overlays a modal.
//   - Shows community stats (population, language, cultural leadership),
//     the ancestral/monarchical history, the clan totems (with symbols,
//     meanings and descriptions) and key heritage practices.
//   - Footer offers Close or "Explore Community Regalia", which closes the
//     modal and jumps to the search tab pre-filled with the community name.
import React from 'react';
import { CommunityItem } from '../types';

interface LineageModalProps {
  community: CommunityItem | null;
  onClose: () => void;
  onExploreArchives: (communityName: string) => void;
}

export const LineageModal: React.FC<LineageModalProps> = ({
  community,
  onClose,
  onExploreArchives
}) => {
  if (!community) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-[#fdf8f6] rounded-xl shadow-2xl border border-[#dbc1ba]/30 overflow-hidden z-10 max-h-[90vh] flex flex-col my-auto">
        {/* Banner Header */}
        <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-[#1c1b1a]">
          <img
            src={community.bannerImage}
            alt={community.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white flex items-end justify-between">
            <div>
              <span className="px-2.5 py-0.5 bg-[#264338] text-white font-label-md text-xs rounded-full inline-block mb-1">
                {community.region}
              </span>
              <h2 className="font-display-lg text-3xl sm:text-4xl text-white font-bold">
                {community.name} Lineage
              </h2>
            </div>
          </div>
        </div>

        {/* Modal Scroll Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* General Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#f1edeb] p-4 rounded-lg border border-[#dbc1ba]/20">
            {community.population && (
              <div>
                <span className="font-label-md text-[11px] text-[#88726c] uppercase tracking-wider block">
                  Est. Population
                </span>
                <span className="font-body-md text-sm font-semibold text-[#1c1b1a]">
                  {community.population}
                </span>
              </div>
            )}
            {community.language && (
              <div>
                <span className="font-label-md text-[11px] text-[#88726c] uppercase tracking-wider block">
                  Language
                </span>
                <span className="font-body-md text-sm font-semibold text-[#855400]">
                  {community.language}
                </span>
              </div>
            )}
            {community.royaltyLeader && (
              <div className="col-span-2 sm:col-span-1">
                <span className="font-label-md text-[11px] text-[#88726c] uppercase tracking-wider block">
                  Cultural Leadership
                </span>
                <span className="font-body-md text-xs font-semibold text-[#6f250f] line-clamp-2">
                  {community.royaltyLeader}
                </span>
              </div>
            )}
          </div>

          {/* Full History */}
          <div>
            <h3 className="font-headline-sm text-lg text-[#6f250f] font-semibold mb-2 flex items-center gap-2">
              <span className="w-6 h-1 bg-[#6f250f]"></span>
              Ancestral Roots & Monarchical History
            </h3>
            <p className="font-body-md text-sm text-[#1c1b1a] leading-relaxed">
              {community.fullHistory || community.description}
            </p>
          </div>

          {/* Clan Totems Section */}
          {community.totems && community.totems.length > 0 && (
            <div>
              <h3 className="font-headline-sm text-base text-[#6f250f] font-semibold mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">diversity_2</span>
                Clan Totems & Hereditary Duties (Obika)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {community.totems.map((totem, i) => (
                  <div
                    key={i}
                    className="p-3 bg-[#ffffff] border border-[#dbc1ba]/30 rounded-lg shadow-2xs hover:border-[#855400] transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{totem.symbol}</span>
                      <div>
                        <h4 className="font-headline-sm text-sm font-bold text-[#1c1b1a]">
                          {totem.name} {totem.lugandaName && `(${totem.lugandaName})`}
                        </h4>
                        <p className="font-label-md text-[11px] text-[#855400]">
                          {totem.meaning}
                        </p>
                      </div>
                    </div>
                    <p className="font-body-md text-xs text-[#55423e] mt-2">
                      {totem.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Traditions */}
          {community.keyTraditions && community.keyTraditions.length > 0 && (
            <div>
              <h3 className="font-headline-sm text-base text-[#6f250f] font-semibold mb-2">
                Pillar Heritage Practices
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {community.keyTraditions.map((trad, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-xs font-body-md text-[#55423e] bg-[#f7f3f1] p-2 rounded border border-[#dbc1ba]/20"
                  >
                    <span className="material-symbols-outlined text-sm text-[#264338]">
                      verified
                    </span>
                    {trad}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#ece7e5] border-t border-[#dbc1ba]/20 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="border border-[#88726c] text-[#55423e] px-4 py-2 rounded-lg font-label-md text-sm hover:bg-white transition-all cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={() => {
              onClose();
              onExploreArchives(community.name);
            }}
            className="bg-[#6f250f] text-white px-6 py-2 rounded-lg font-label-md text-sm hover:bg-[#8e3b24] transition-all cursor-pointer flex items-center gap-2"
          >
            Explore Community Regalia
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
