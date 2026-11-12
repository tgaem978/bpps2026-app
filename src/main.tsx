import React from 'react';
import ReactDOM from 'react-dom/client';
import { applyTokens, designTokens } from './templates/tokens';
import { PORTAL_MODE } from './lib/storage';
import './index.css';

applyTokens(designTokens);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// /portal = Portal Kemas Kini untuk penyelaras unit (data daripada pelayan, storan dalam memori);
// laluan lain = penjana BPPS (data dalam pelayar ini).
const load = PORTAL_MODE ? import('./portal/PortalApp') : import('./App');
load.then(({ default: Root }) =>
  root.render(
    <React.StrictMode>
      <Root />
    </React.StrictMode>,
  ),
);
