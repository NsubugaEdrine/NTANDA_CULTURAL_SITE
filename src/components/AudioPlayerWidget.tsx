import React, { useState, useEffect, useRef } from 'react';

interface AudioPlayerWidgetProps {
  title?: string;
  subtitle?: string;
}

export const AudioPlayerWidget: React.FC<AudioPlayerWidgetProps> = ({
  title = 'Royal Talking Drums & Soundscape',
  subtitle = 'Ancestral Sound Archive'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);

  const startSoundscape = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      setIsPlaying(true);

      // Simple drum beat & pentatonic harp synthesizer loop
      let step = 0;
      const harpNotes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // Pentatonic C D E G A C

      const interval = window.setInterval(() => {
        if (!audioCtxRef.current) return;
        const now = ctx.currentTime;

        // Low drum beat on 0, 2, 4
        if (step % 2 === 0) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(110, now);
          osc.frequency.exponentialRampToValueAtTime(45, now + 0.15);
          gain.gain.setValueAtTime(0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.25);
        }

        // High drum beat / talking drum pitch bend
        if (step % 3 === 1) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.exponentialRampToValueAtTime(320, now + 0.1);
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.18);
        }

        // Ennanga Harp note on every step
        const noteFreq = harpNotes[step % harpNotes.length];
        const harpOsc = ctx.createOscillator();
        const harpGain = ctx.createGain();
        harpOsc.type = 'sine';
        harpOsc.frequency.setValueAtTime(noteFreq, now);
        harpGain.gain.setValueAtTime(0.15, now);
        harpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        harpOsc.connect(harpGain);
        harpGain.connect(ctx.destination);
        harpOsc.start(now);
        harpOsc.stop(now + 0.4);

        step = (step + 1) % 16;
      }, 350);

      timerRef.current = interval;
    } catch {
      setIsPlaying(false);
    }
  };

  const stopSoundscape = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
      audioCtxRef.current.suspend();
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="bg-[#6f250f] text-white p-4 rounded-xl flex items-center justify-between shadow-md border border-[#8e3b24]">
      <div className="flex items-center gap-3">
        <button
          onClick={() => (isPlaying ? stopSoundscape() : startSoundscape())}
          className="w-10 h-10 rounded-full bg-[#fdae41] text-[#2a1700] flex items-center justify-center hover:bg-[#ffddb7] transition-all cursor-pointer focus:outline-none shadow-sm"
          title={isPlaying ? 'Pause Audio' : 'Play Audio Soundscape'}
          aria-label={isPlaying ? 'Pause Audio' : 'Play Audio Soundscape'}
        >
          <span className="material-symbols-outlined text-xl">
            {isPlaying ? 'pause' : 'play_arrow'}
          </span>
        </button>
        <div>
          <h4 className="font-headline-sm text-sm text-white font-semibold leading-tight">
            {title}
          </h4>
          <p className="font-label-md text-[11px] text-[#ffb9a7] uppercase tracking-wider">
            {subtitle} {isPlaying && '• Playing Live Soundscape'}
          </p>
        </div>
      </div>

      {isPlaying && (
        <div className="flex items-center gap-1">
          <span className="w-1 h-4 bg-[#fdae41] animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1 h-6 bg-[#fdae41] animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1 h-3 bg-[#fdae41] animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      )}
    </div>
  );
};
