import { useMutation } from '@tanstack/react-query';
import type { MutationOpts } from '@/utils/types';
import { TransactionsService } from '@/services/TransactionsService';

export function usePostTransaction({
  mutationKey = [],
  ...props
}: MutationOpts<
  Awaited<ReturnType<typeof TransactionsService.postTransaction>>,
  Parameters<typeof TransactionsService.postTransaction>[0]
> = {}) {
  return useMutation({
    ...props,
    mutationKey: ['POST_TRANSACTION_MUTATION', ...mutationKey],
    mutationFn: TransactionsService.postTransaction,
  });
}
