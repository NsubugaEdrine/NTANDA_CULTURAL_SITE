// JoinCommunityModal.tsx — "Join Community & Contribute" form modal.
// Responsibilities:
//   - Returns null when closed; opens a two-state modal.
//   - Collects an archive contribution: full name, email, clan/community,
//     entry type (oral memory, family artifact, lineage story, scholar
//     research) and the story/artifact details.
//   - On submit it validates via the form and shows a confirmation screen
//     (no backend call yet — this is a UI prototype; wire the submission to
//     your API or a submissions table to persist it).
import React, { useState } from 'react';

interface JoinCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinCommunityModal: React.FC<JoinCommunityModalProps> = ({
  isOpen,
  onClose
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    clanHeritage: 'Baganda',
    contributionType: 'Oral Memory',
    storyDetails: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-[#fdf8f6] rounded-xl shadow-2xl border border-[#dbc1ba]/30 overflow-hidden z-10 my-auto">
        <div className="bg-[#6f250f] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <span className="font-label-md text-xs uppercase tracking-widest text-[#fdae41] block mb-1">
            Cultural Preservation Network
          </span>
          <h2 className="font-display-lg-mobile text-2xl text-white font-bold">
            Join the NTANDA Community
          </h2>
          <p className="font-body-md text-xs text-[#ffb9a7] mt-1">
            Contribute oral histories, family regalia photographs, or join our scholar archive network.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-[#264338]/10 text-[#264338] rounded-full flex items-center justify-center mx-auto text-3xl">
              <span className="material-symbols-outlined text-4xl">verified</span>
            </div>
            <h3 className="font-headline-sm text-xl text-[#1c1b1a]">
              Submission Received
            </h3>
            <p className="font-body-md text-sm text-[#55423e] max-w-sm mx-auto">
              Thank you for contributing to the digital preservation of Africa's ancestral heritage. Our heritage archivists will review your record.
            </p>
            <button
              onClick={handleReset}
              className="mt-4 bg-[#6f250f] text-white px-6 py-2.5 rounded-lg font-label-md text-sm hover:bg-[#8e3b24]"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="font-label-md text-xs text-[#55423e] uppercase block mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Kato Mukasa"
                className="w-full bg-[#f1edeb] border border-[#dbc1ba] rounded-lg px-3 py-2 font-body-md text-sm focus:outline-none focus:border-[#855400]"
              />
            </div>

            <div>
              <label className="font-label-md text-xs text-[#55423e] uppercase block mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. kato@heritage.org"
                className="w-full bg-[#f1edeb] border border-[#dbc1ba] rounded-lg px-3 py-2 font-body-md text-sm focus:outline-none focus:border-[#855400]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-label-md text-xs text-[#55423e] uppercase block mb-1">
                  Clan / Community
                </label>
                <select
                  value={formData.clanHeritage}
                  onChange={(e) => setFormData({ ...formData, clanHeritage: e.target.value })}
                  className="w-full bg-[#f1edeb] border border-[#dbc1ba] rounded-lg px-3 py-2 font-body-md text-sm focus:outline-none focus:border-[#855400]"
                >
                  <option value="Baganda">Baganda</option>
                  <option value="Karamojong">Karamojong</option>
                  <option value="Banyankole">Banyankole</option>
                  <option value="Basoga">Basoga</option>
                  <option value="Acholi">Acholi</option>
                  <option value="Batooro">Batooro</option>
                  <option value="Other">Other Region</option>
                </select>
              </div>

              <div>
                <label className="font-label-md text-xs text-[#55423e] uppercase block mb-1">
                  Type of Entry
                </label>
                <select
                  value={formData.contributionType}
                  onChange={(e) => setFormData({ ...formData, contributionType: e.target.value })}
                  className="w-full bg-[#f1edeb] border border-[#dbc1ba] rounded-lg px-3 py-2 font-body-md text-sm focus:outline-none focus:border-[#855400]"
                >
                  <option value="Oral Memory">Oral Memory / Poem</option>
                  <option value="Family Artifact">Family Artifact Image</option>
                  <option value="Clan Lineage Story">Clan Lineage Story</option>
                  <option value="Scholar Research">Scholar Research Paper</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-label-md text-xs text-[#55423e] uppercase block mb-1">
                Memory or Artifact Details
              </label>
              <textarea
                rows={3}
                required
                value={formData.storyDetails}
                onChange={(e) => setFormData({ ...formData, storyDetails: e.target.value })}
                placeholder="Describe your family artifact, historical proverb, or clan memory..."
                className="w-full bg-[#f1edeb] border border-[#dbc1ba] rounded-lg px-3 py-2 font-body-md text-sm focus:outline-none focus:border-[#855400]"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#88726c] text-[#55423e] rounded-lg font-label-md text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#6f250f] text-white rounded-lg font-label-md text-sm hover:bg-[#8e3b24]"
              >
                Submit Archive Contribution
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
