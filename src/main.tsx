import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Clear any existing content in the root element
document.getElementById('root')!.innerHTML = '';

// Create root and render the app
const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
