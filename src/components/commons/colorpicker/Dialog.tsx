import { type DialogProps, Dialog as RACDialog } from 'react-aria-components';
import { cn } from '../../../utils/functions';

export function Dialog(props: DialogProps) {
  return (
    <RACDialog
      {...props}
      className={cn(
        'relative box-border max-h-[inherit] overflow-auto p-6 outline outline-0 [[data-placement]>&]:p-4',
        props.className,
      )}
    />
  );
}
