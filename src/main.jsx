import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import App from './App.jsx';
import { PresenceProvider } from './context/PresenceContext.jsx';
import { wagmiConfig } from './wallet/config.js';
import './styles/variables.css';
import './styles/global.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter><PresenceProvider><App /></PresenceProvider></BrowserRouter>
    </QueryClientProvider>
  </WagmiProvider>,
);
