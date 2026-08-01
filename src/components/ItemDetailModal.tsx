import React from 'react';
import { RegaliaItem, ArtifactItem } from '../types';
import { AudioPlayerWidget } from './AudioPlayerWidget';

interface ItemDetailModalProps {
  item: RegaliaItem | ArtifactItem | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  isSaved,
  onToggleSave
}) => {
  if (!item) return null;

  const isRegalia = 'tribe' in item;
  const regalia = isRegalia ? (item as RegaliaItem) : null;
  const artifact = !isRegalia ? (item as ArtifactItem) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[#fdf8f6] rounded-xl shadow-2xl border border-[#dbc1ba]/30 overflow-hidden z-10 max-h-[90vh] flex flex-col my-auto">
        {/* Top Image Banner */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#1c1b1a]">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#6f250f] z-20"></div>
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer z-30"
          >
            <span className="material-symbols-outlined">close</span>
          </button>

          {/* Category Badge */}
          <div className="absolute top-4 left-4 z-30">
            <span className="bg-[#264338] text-white px-3 py-1 rounded-full font-label-md text-xs backdrop-blur-md">
              {regalia ? `${regalia.tribe} • ${regalia.category}` : artifact?.culture}
            </span>
          </div>

          {/* Title on image */}
          <div className="absolute bottom-4 left-6 right-6 z-20 text-white">
            <h2 className="font-display-lg-mobile sm:font-headline-md text-2xl sm:text-3xl text-white font-bold">
              {item.title}
            </h2>
            <p className="font-body-md text-sm text-white/80 mt-1">
              {regalia ? regalia.era : artifact?.estimatedAge} • {regalia ? regalia.originRegion : artifact?.location}
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#f1edeb] p-4 rounded-lg border border-[#dbc1ba]/20">
            <div>
              <span className="font-label-md text-[11px] text-[#88726c] uppercase tracking-wider block">
                {regalia ? 'Tribe / Heritage' : 'Culture'}
              </span>
              <span className="font-body-md text-sm font-semibold text-[#1c1b1a]">
                {regalia ? regalia.tribe : artifact?.culture}
              </span>
            </div>

            <div>
              <span className="font-label-md text-[11px] text-[#88726c] uppercase tracking-wider block">
                {regalia ? 'Historical Era' : 'Estimated Age'}
              </span>
              <span className="font-body-md text-sm font-semibold text-[#855400]">
                {regalia ? regalia.era : artifact?.estimatedAge}
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <span className="font-label-md text-[11px] text-[#88726c] uppercase tracking-wider block">
                Origin Region
              </span>
              <span className="font-body-md text-sm font-semibold text-[#1c1b1a]">
                {regalia ? regalia.originRegion : artifact?.location}
              </span>
            </div>
          </div>

          {/* Material Specs */}
          <div>
            <h3 className="font-headline-sm text-base text-[#6f250f] font-semibold mb-1">
              Materials & Craftsmanship
            </h3>
            <p className="font-body-md text-sm text-[#55423e]">
              {item.material}
            </p>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-headline-sm text-base text-[#6f250f] font-semibold mb-1">
              Archival Description
            </h3>
            <p className="font-body-md text-sm sm:text-base text-[#1c1b1a] leading-relaxed">
              {regalia ? regalia.fullDetails || regalia.description : artifact?.description}
            </p>
          </div>

          {/* Spiritual / Historical Significance */}
          <div className="bg-[#f7f3f1] p-4 rounded-lg border-l-4 border-[#6f250f]">
            <h3 className="font-headline-sm text-sm text-[#6f250f] font-bold uppercase tracking-wide mb-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">verified</span>
              Cultural & Spiritual Significance
            </h3>
            <p className="font-body-md text-sm text-[#55423e] italic leading-relaxed">
              "{regalia ? regalia.spiritualSignificance : artifact?.significanceDetails}"
            </p>
          </div>

          {/* Audio Soundscape Player if applicable */}
          {artifact?.audioTrack && (
            <div className="pt-2">
              <AudioPlayerWidget
                title={`Listen to ${artifact.title}`}
                subtitle="High-Fidelity Audio Soundscape Archive"
              />
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-[#ece7e5] border-t border-[#dbc1ba]/20 flex items-center justify-between gap-3">
          <button
            onClick={() => onToggleSave(item.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-label-md text-sm transition-all cursor-pointer ${
              isSaved
                ? 'bg-[#855400] text-white hover:bg-[#6d4400]'
                : 'border border-[#88726c] text-[#6f250f] hover:bg-white'
            }`}
          >
            <span className={`material-symbols-outlined text-base ${isSaved ? 'material-symbols-filled' : ''}`}>
              bookmark
            </span>
            {isSaved ? 'Saved in Archives' : 'Save to My Collection'}
          </button>

          <button
            onClick={onClose}
            className="bg-[#6f250f] text-white px-6 py-2.5 rounded-lg font-label-md text-sm hover:bg-[#8e3b24] transition-all cursor-pointer"
          >
            Close Detail
          </button>
        </div>
      </div>
    </div>
  );
};
