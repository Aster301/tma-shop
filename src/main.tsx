import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { init as initSDK, miniApp, viewport } from '@telegram-apps/sdk-react';
import App from './App';

try {
  initSDK();
  if (miniApp.mount.isAvailable()){
    miniApp.mount();
    miniApp.bindCssVars();
  }
  if (viewport.mount.isAvailable()){
    viewport.mount();
  }
} catch (e) {
      console.log('Not in Telegram environment, running in mock mode.', e);
  }
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
