// vite.config.ts — Vite build & dev-server configuration.
// Responsibilities:
//   - Registers the React and Tailwind CSS v4 plugins.
//   - Maps the '@' import alias to the project root so imports like
//     '@/src/lib/supabase' resolve (see tsconfig paths too).
//   - Dev-server tweaks for AI Studio / agent environments:
//       * HMR is enabled unless DISABLE_HMR=true is set.
//       * File watching is disabled when DISABLE_HMR=true to save CPU while
//         an agent is editing files (avoids flicker during hot reloads).
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify — file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
