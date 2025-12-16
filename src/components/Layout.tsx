import { useEffect, type FC } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { NavBar } from './NavBar';
import { TopBar } from './TopBar';
import { useSessionStore } from '../stores/useSessionStore';
import { ROUTES } from '../constants/routes';
import { ErrorBoundary } from './commons/ErrorBoundary';

export const Layout: FC = () => {
  const { sessionUser } = useSessionStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionUser) {
      navigate(ROUTES.LOGIN);
    }
  }, [sessionUser, navigate]);

  if (!sessionUser) {
    return null;
  }

  return (
    <div className="pl-72">
      <TopBar />
      <NavBar />
      <div className="min-h-screen rounded-l-[48px] bg-zinc-900">
        <ErrorBoundary
          fallback={
            <div className="h-page flex flex-col items-center justify-center gap-2 py-16">
              <img src="/error.webp" alt="error image" className="size-12" />
              <h1 className="text-xl font-medium">An unexpected error has occurred</h1>
            </div>
          }
        >
          <Outlet />
        </ErrorBoundary>
      </div>
    </div>
  );
};
