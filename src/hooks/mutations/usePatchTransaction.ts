import { useMutation } from '@tanstack/react-query';
import type { MutationOpts } from '@/utils/types';
import { TransactionsService } from '@/services/TransactionsService';

export function usePatchTransaction({
  mutationKey = [],
  ...props
}: MutationOpts<
  Awaited<ReturnType<typeof TransactionsService.patchTransaction>>,
  Parameters<typeof TransactionsService.patchTransaction>[0]
> = {}) {
  return useMutation({
    ...props,
    mutationKey: ['PATCH_TRANSACTION_MUTATION', ...mutationKey],
    mutationFn: TransactionsService.patchTransaction,
  });
}
