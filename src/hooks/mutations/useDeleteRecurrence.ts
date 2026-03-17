import { useMutation } from '@tanstack/react-query';
import { RecurrencesService } from '../../services/RecurrencesService';

export function useDeleteRecurrence({
  onSuccess,
  meta,
}: {
  onSuccess?: () => void;
  meta?: Record<string, unknown>;
} = {}) {
  return useMutation({
    mutationFn: RecurrencesService.deleteRecurrence,
    onSuccess,
    meta,
  });
}
