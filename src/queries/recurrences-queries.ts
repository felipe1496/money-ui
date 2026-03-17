import { RecurrencesService } from '../services/RecurrencesService';
import type { QueryOpts } from '../utils/types';

export const recurrencesKeys = {
  all: () => ['recurrences'] as const,
  getRecurrences: (queryOpts?: QueryOpts) => [...recurrencesKeys.all(), { queryOpts }] as const,
};

export function getRecurrencesQueryOpts(queryOpts?: QueryOpts) {
  return {
    queryKey: recurrencesKeys.getRecurrences(queryOpts),
    queryFn: () => RecurrencesService.getRecurrences(queryOpts),
  };
}
