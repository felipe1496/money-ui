import type { FC } from 'react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/commons/Dialog';
import { Radio, RadioItem } from '../../../components/commons/Radio';
import { Button } from '../../../components/commons/Button';
import { Spinner } from '../../../components/commons/loader/Spinner';

interface DeleteRecurrenceModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (scope: 'all' | 'until_current') => void;
  isLoading?: boolean;
}

export const DeleteRecurrenceModal: FC<DeleteRecurrenceModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  isLoading,
}) => {
  const [scope, setScope] = useState<'all' | 'until_current'>('all');

  return (
    <Dialog open={isVisible} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Recurrence</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6 p-6">
          <p className="text-zinc-600">How would you like to delete this recurrence?</p>

          <Radio
            value={scope}
            onValueChange={(value) => setScope(value as 'all' | 'until_current')}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1">
              <RadioItem
                value="until_current"
                label={
                  <div className="flex flex-col">
                    <span className="font-medium">Keep history</span>
                    <span className="text-sm text-zinc-500">
                      Keep transactions from previous and current periods. Stop future recurrences.
                    </span>
                  </div>
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <RadioItem
                value="all"
                label={
                  <div className="flex flex-col">
                    <span className="font-medium">Delete all</span>
                    <span className="text-sm text-zinc-500">
                      Remove all transactions associated with this recurrence rule.
                    </span>
                  </div>
                }
              />
            </div>
          </Radio>

          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outlined" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={() => onConfirm(scope)} disabled={isLoading} variant="danger">
              {isLoading ? <Spinner variant="secondary" /> : 'Delete'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
