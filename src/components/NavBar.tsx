import { type FC } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ROUTES } from '../constants/routes';
import { cn } from '../utils/functions';
import {
  ChevronDown,
  HomeIcon,
  LogOutIcon,
  PanelLeftIcon,
  TagsIcon,
  WalletMinimalIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './commons/DropdownMenu';
import { Avatar, AvatarFallback, AvatarImage } from './commons/Avatar';
import { useSession } from '../hooks/useSession';
import { Zelda } from './commons/Zelda';
import { Button } from './commons/Button';
import { useCollapsed } from '../hooks/useCollapsed';

export const NavBar: FC = () => {
  const collapsed = useCollapsed((state) => state.isCollapsed);
  const setCollapsed = useCollapsed((state) => state.setIsCollapsed);
  const location = useLocation();
  const { sessionUser, logout } = useSession();

  const navigate = useNavigate();

  return (
    <aside
      className={cn(
        'fixed left-0 flex h-screen flex-col items-center justify-between transition-all',
        collapsed ? 'w-20' : 'w-56',
      )}
    >
      <div className="mt-4 flex w-full flex-col items-center gap-4 px-4">
        <div
          className={cn(
            'flex w-full items-center justify-center',
            collapsed ? 'justify-center' : 'justify-between',
          )}
        >
          {!collapsed && <img src="/logo.webp" alt="Open Wallet Logo" className="w-10" />}
          <Button
            className="size-10 rounded-full"
            size="sm"
            variant="ghost"
            onClick={() => setCollapsed(!collapsed)}
          >
            <PanelLeftIcon className="text-muted-foreground size-4" />
          </Button>
        </div>
        <nav className="flex w-full flex-col gap-1 border-red-500">
          <Zelda
            to={ROUTES.HOME}
            className={cn(
              'flex h-12 items-center justify-center gap-3 rounded transition-colors hover:bg-zinc-200',
              location.pathname === ROUTES.HOME && 'bg-zinc-200',
              !collapsed && 'px-4',
              !collapsed ? 'justify-start' : 'justify-center',
            )}
            keepQueryParams
          >
            <HomeIcon className="size-5 shrink-0" />
            {!collapsed && 'Dashboard'}
          </Zelda>
          <Zelda
            to={ROUTES.WALLET.LIST}
            className={cn(
              'flex h-12 items-center justify-center gap-3 rounded transition-colors hover:bg-zinc-200',
              location.pathname.startsWith(ROUTES.WALLET.LIST) && 'bg-zinc-200',
              !collapsed && 'px-4',
              !collapsed ? 'justify-start' : 'justify-center',
            )}
            keepQueryParams
          >
            <WalletMinimalIcon className="size-5" />
            {!collapsed && 'Wallet'}
          </Zelda>
          <Zelda
            to={ROUTES.CATEGORIES.LIST}
            className={cn(
              'flex h-12 items-center justify-center gap-3 rounded transition-colors hover:bg-zinc-200',
              location.pathname.startsWith(ROUTES.CATEGORIES.LIST) && 'bg-zinc-200',
              !collapsed && 'px-4',
              !collapsed ? 'justify-start' : 'justify-center',
            )}
            keepQueryParams
          >
            <TagsIcon className="size-5" />
            {!collapsed && 'Categories'}
          </Zelda>
        </nav>
      </div>

      <div className="mb-4 w-full px-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full">
            <div
              className={cn(
                'flex w-full cursor-pointer items-center justify-between gap-2 rounded py-2 transition-colors hover:bg-zinc-200',
                !collapsed && 'px-4',
                !collapsed ? 'justify-start' : 'justify-center',
              )}
            >
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage
                    src={sessionUser?.avatar_url}
                    alt="Profile picture"
                    className="size-6 shrink-0 rounded-full"
                  />
                  <AvatarFallback>
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-orange-500">
                      <span className="text-xs font-medium text-zinc-800">
                        {sessionUser?.name[0]}
                      </span>
                    </div>
                  </AvatarFallback>
                </Avatar>
                {!collapsed && sessionUser?.name.split(' ')[0]}
              </div>
              {!collapsed && <ChevronDown className="size-4" />}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="end">
            <DropdownMenuItem
              className="flex items-center gap-2 text-sm text-red-500 hover:bg-red-50"
              onClick={() => {
                logout();
                navigate(ROUTES.LOGIN);
              }}
            >
              <LogOutIcon className="size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
};
