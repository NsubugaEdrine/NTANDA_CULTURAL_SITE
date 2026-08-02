// main.tsx — React application bootstrap.
// Responsibilities:
//   - Imports the global stylesheet (Tailwind + custom typography/patterns).
//   - Mounts the <App /> component into the #root element of index.html.
//   - Wraps the app in <StrictMode> so React runs extra dev-time checks
//     (double-invoked effects/renders) to surface potential bugs.
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
