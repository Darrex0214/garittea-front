import ReactDOM from 'react-dom/client';
import { Suspense, StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import App from './app';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const queryClient = new QueryClient();

root.render(
  
    <QueryClientProvider client={queryClient}>
    <StrictMode>
        <HelmetProvider>
          <BrowserRouter>
            <Suspense>
              <App />
            </Suspense>
          </BrowserRouter>
        </HelmetProvider>
      </StrictMode>
    </QueryClientProvider>
    
);
