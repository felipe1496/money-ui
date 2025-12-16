import { TransactionsService } from '../services/transactions-service';
import type { QueryOpts } from '../utils/types';

export const transactionsKeys = {
  all: () => ['transactions'],
  getEntries: (period: string) => ['entries', period],
};

export function getEntriesQueryOpts(period: string, queryOpts?: QueryOpts) {
  return {
    queryKey: [...transactionsKeys.getEntries(period), queryOpts],
    queryFn: () => TransactionsService.getEntries(period, queryOpts),
  };
}
