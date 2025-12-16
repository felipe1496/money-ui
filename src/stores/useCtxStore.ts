import dayjs from 'dayjs';
import { createStore } from '../utils/functions';

export type Period = {
  month: number;
  year: number;
};

interface States {
  period: Period;
}

interface Actions {
  setPeriod: (period: Period) => void;
}

const initialState = {
  period: {
    month: dayjs().month(),
    year: dayjs().year(),
  },
};

export const useCtxStore = createStore<States & Actions>()((set) => ({
  ...initialState,
  setPeriod: (period: Period) => {
    set({ period });
  },
}));
