// NotificationModal.tsx — Heritage archive updates panel.
// Responsibilities:
//   - Returns null when closed; otherwise shows a modal listing the
//     CULTURAL_NOTIFICATIONS mock feed (category, title, message, time).
//   - Data currently comes from ../data/mockData; replace the source with a
//     real notifications table when the backend feed exists.
import React from 'react';
import { CULTURAL_NOTIFICATIONS } from '../data/mockData';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-[#fdf8f6] rounded-xl shadow-2xl border border-[#dbc1ba]/30 overflow-hidden z-10 my-auto">
        <div className="bg-[#6f250f] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined">notifications</span>
            <h3 className="font-headline-sm text-lg text-white font-bold">
              Heritage Archive Updates
            </h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
          {CULTURAL_NOTIFICATIONS.map((notif) => (
            <div
              key={notif.id}
              className="p-3 bg-[#ffffff] border border-[#dbc1ba]/30 rounded-lg hover:border-[#855400] transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-label-md text-[10px] bg-[#264338]/10 text-[#264338] px-2 py-0.5 rounded-full font-bold uppercase">
                  {notif.category}
                </span>
                <span className="font-label-md text-[11px] text-[#88726c]">
                  {notif.time}
                </span>
              </div>
              <h4 className="font-headline-sm text-sm font-semibold text-[#1c1b1a]">
                {notif.title}
              </h4>
              <p className="font-body-md text-xs text-[#55423e] mt-1">
                {notif.message}
              </p>
            </div>
          ))}
        </div>

        <div className="p-3 bg-[#ece7e5] text-center border-t border-[#dbc1ba]/20">
          <button
            onClick={onClose}
            className="text-xs font-label-md text-[#6f250f] hover:underline cursor-pointer"
          >
            Close Notifications
          </button>
        </div>
      </div>
    </div>
  );
};
