import { ChartPieIcon, RepeatIcon, TagsIcon, WalletMinimalIcon } from 'lucide-react';
import { ROUTES } from './routes';

export const MENU = {
  ITEMS: [
    {
      label: 'Dashboard',
      route: ROUTES.DASHBOARD,
      icon: ChartPieIcon,
    },
    {
      label: 'Wallet',
      route: ROUTES.WALLET.INDEX,
      icon: WalletMinimalIcon,
    },
    {
      label: 'Categories',
      route: ROUTES.CATEGORIES.INDEX,
      icon: TagsIcon,
    },
    {
      label: 'Recurrences',
      route: ROUTES.RECURRENCES.INDEX,
      icon: RepeatIcon,
    },
  ],
};
