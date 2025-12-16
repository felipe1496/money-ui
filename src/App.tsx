import { Route, Routes } from 'react-router';
import { LoginPage } from './pages/auth/LoginPage';
import { ROUTES } from './constants/routes';
import { HomePage } from './pages/HomePage';
import { Layout } from './components/Layout';
import { WalletPage } from './pages/wallet/WalletPage';
import { NewTransactionPage } from './pages/wallet/NewTransactionPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { useSessionStore } from './stores/useSessionStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function App() {
  const { sessionIsSettled, startUpSession } = useSessionStore();

  useEffect(() => {
    startUpSession();
  }, [startUpSession]);

  if (!sessionIsSettled) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors theme="dark" position="top-center" />
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.WALLET.LIST} element={<WalletPage />} />
          <Route path={ROUTES.WALLET.NEW} element={<NewTransactionPage />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
