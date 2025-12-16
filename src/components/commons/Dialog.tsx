import * as DialogPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import type { ComponentProps, FC } from 'react';
import { cn } from '../../utils/functions';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogContent: FC<ComponentProps<typeof DialogPrimitive.Content>> = ({
  children,
  className,
  ...props
}) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/20 backdrop-blur-xs" />
    <DialogPrimitive.Content
      className={cn(
        'fixed top-[50%] left-[50%] z-50 flex w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] flex-col rounded-md bg-zinc-900 p-4 shadow-md',
        className,
      )}
      {...props}
    >
      <DialogClose
        className="text-primary absolute top-3 right-3 cursor-pointer rounded-full bg-zinc-950 p-1 transition-all hover:bg-red-950 hover:text-red-500"
        asChild
      >
        <button>
          <XIcon className="size-4" />
        </button>
      </DialogClose>
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
);
export const DialogTitle: FC<ComponentProps<typeof DialogPrimitive.Title>> = ({
  className,
  ...props
}) => (
  <DialogPrimitive.Title className={cn('font-title text-2xl font-bold', className)} {...props} />
);
export const DialogDescription = DialogPrimitive.Description;
export const DialogClose = DialogPrimitive.Close;
