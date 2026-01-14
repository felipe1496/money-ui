import { useEffect, type FC } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { NavBar } from './NavBar';
import { useSession } from '../hooks/useSession';
import { ROUTES } from '../constants/routes';
import { ErrorBoundary } from './commons/ErrorBoundary';
import { useCollapsed } from '../hooks/useCollapsed';
import { cn } from '../utils/functions';

export const Layout: FC = () => {
  const collapsed = useCollapsed((state) => state.isCollapsed);
  const { sessionUser } = useSession();
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
    <div className={cn('transition-all', collapsed ? 'pl-20' : 'pl-56')}>
      <NavBar />
      <ErrorBoundary
        fallback={
          <div className="flex flex-col items-center justify-center gap-2 py-16">
            <img src="/error.webp" alt="error image" className="size-12" />
            <h1 className="text-xl font-medium">An unexpected error has occurred</h1>
          </div>
        }
      >
        <Outlet />
      </ErrorBoundary>
    </div>
  );
};
