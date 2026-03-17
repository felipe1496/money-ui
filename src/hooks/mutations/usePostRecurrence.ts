import { useMutation } from '@tanstack/react-query';
import { RecurrencesService } from '../../services/RecurrencesService';

export function usePostRecurrence({
  onSuccess,
  meta,
}: {
  onSuccess?: () => void;
  meta?: Record<string, unknown>;
} = {}) {
  return useMutation({
    mutationFn: RecurrencesService.postRecurrence,
    onSuccess,
    meta,
  });
}
