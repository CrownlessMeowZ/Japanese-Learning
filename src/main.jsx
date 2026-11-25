import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';
import { registerServiceWorker } from './registerServiceWorker';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary level="root">
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);

// Kích hoạt PWA Service Worker
registerServiceWorker();
