import { createStore } from '../utils/functions';

interface States {
  isCollapsed: boolean;
}
interface Actions {
  setIsCollapsed: (isCollapsed: boolean) => void;
}

const initialState: States = {
  isCollapsed: false,
};

export const useCollapsed = createStore<States & Actions>()((set) => ({
  ...initialState,
  setIsCollapsed: (isCollapsed: boolean) => {
    localStorage.setItem('NAV_BAR_COLLAPSED', String(isCollapsed));
    set({ isCollapsed });
  },
}));
