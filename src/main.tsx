import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { applyTokens, designTokens } from './templates/tokens';
import './index.css';

applyTokens(designTokens);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
