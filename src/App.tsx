import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { useRouteElements } from './useRouteElements';
import { AppProvider } from '@/contexts';
import { store } from '@/store';
import { TOAST_CONFIG } from '@/constants';
import CategoriesInitializer from '@/components/CategoriesInitializer';
import '@/i18n';
import './index.css';
import { KeycloakProvider } from './contexts/KeycloakContext';
import LocationInitializer from './components/LocationInitializer';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  const routeElements = useRouteElements();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <KeycloakProvider>
          <BrowserRouter>
            <AppProvider>
              <CategoriesInitializer />
              <LocationInitializer />
              {routeElements}
              <Toaster
                position={TOAST_CONFIG.position as 'top-right'}
                toastOptions={{
                  duration: TOAST_CONFIG.duration,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    style: {
                      background: '#22c55e',
                    },
                  },
                  error: {
                    style: {
                      background: '#ef4444',
                    },
                  },
                }}
              />
            </AppProvider>
          </BrowserRouter>
        </KeycloakProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
