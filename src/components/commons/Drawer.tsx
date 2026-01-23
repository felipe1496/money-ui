import * as DialogPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import type { ComponentProps, FC, HTMLAttributes } from 'react';
import { cn } from '../../utils/functions';

export const Drawer = DialogPrimitive.Root;
export const DrawerTrigger = DialogPrimitive.Trigger;

export const DrawerContent: FC<
  ComponentProps<typeof DialogPrimitive.Content> & { isClosable?: boolean }
> = ({ children, className, isClosable = true, ...props }) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/10 backdrop-blur-xs" />
    <DialogPrimitive.Content
      className={cn(
        'fixed top-0 left-0 z-50 flex h-screen w-full max-w-64 flex-col rounded-md bg-white shadow-md',
        'data-[state=open]:animate-drawer-in',
        'data-[state=closed]:animate-drawer-out',
        className,
      )}
      {...props}
    >
      {isClosable && (
        <DialogClose
          className="text-muted-foreground absolute top-2 right-3 cursor-pointer rounded-full p-1 transition-all hover:bg-zinc-100 hover:text-red-500"
          asChild
        >
          <button>
            <XIcon className="size-6" />
          </button>
        </DialogClose>
      )}
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
);
export const DialogHeader: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return <div className={cn('border-b border-zinc-300 px-4 py-2', className)} {...props} />;
};
export const DialogTitle: FC<ComponentProps<typeof DialogPrimitive.Title>> = ({
  className,
  ...props
}) => <DialogPrimitive.Title className={cn('text-xl font-medium', className)} {...props} />;

export const DialogDescription = DialogPrimitive.Description;
export const DialogClose = DialogPrimitive.Close;
