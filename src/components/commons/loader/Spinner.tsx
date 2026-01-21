import type { FC, HTMLAttributes } from 'react';
import { cn } from '../../../utils/functions';

interface Props extends HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary';
}

export const Spinner: FC<Props> = ({ className, variant = 'primary', ...props }) => (
  <div
    className={cn(
      'size-6 shrink-0 animate-spin rounded-full border-3',
      className,
      variant === 'primary' && 'border-zinc-300 border-t-purple-500',
      variant === 'secondary' && 'border-zinc-300 border-t-white',
    )}
    {...props}
  />
);
