import { useMutation } from '@tanstack/react-query';
import { RecurrencesService } from '../../services/RecurrencesService';

export function usePatchRecurrence({
  onSuccess,
  meta,
}: {
  onSuccess?: () => void;
  meta?: Record<string, unknown>;
} = {}) {
  return useMutation({
    mutationFn: RecurrencesService.updateRecurrence,
    onSuccess,
    meta,
  });
}
