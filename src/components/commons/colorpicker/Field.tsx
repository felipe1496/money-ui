import {
  type FieldErrorProps,
  Group,
  type GroupProps,
  type InputProps,
  type LabelProps,
  FieldError as RACFieldError,
  Input as RACInput,
  Label as RACLabel,
  Text,
  type TextProps,
  composeRenderProps,
} from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';
import { cn } from '../../../utils/functions';

export function Label(props: LabelProps) {
  return (
    <RACLabel
      {...props}
      className={twMerge(
        'w-fit cursor-default font-sans text-sm font-medium text-neutral-600 dark:text-neutral-300',
        props.className,
      )}
    />
  );
}

export function Description(props: TextProps) {
  return (
    <Text
      {...props}
      slot="description"
      className={twMerge('text-sm text-neutral-600', props.className)}
    />
  );
}

export function FieldError(props: FieldErrorProps) {
  return (
    <RACFieldError
      {...props}
      className={cn(props.className, 'text-sm text-red-600 forced-colors:text-[Mark]')}
    />
  );
}

const fieldBorderStyles = tv({
  base: 'transition',
  variants: {
    isFocusWithin: {
      false:
        'border-neutral-300 hover:border-neutral-400 dark:border-neutral-600 dark:hover:border-neutral-500 forced-colors:border-[ButtonBorder]',
      true: 'border-neutral-600 dark:border-neutral-300 forced-colors:border-[Highlight]',
    },
    isInvalid: {
      true: 'border-red-600 dark:border-red-600 forced-colors:border-[Mark]',
    },
    isDisabled: {
      true: 'border-neutral-200 dark:border-neutral-700 forced-colors:border-[GrayText]',
    },
  },
});

const fieldGroupStyles = tv({
  base: 'group flex items-center h-9 box-border bg-white dark:bg-neutral-900 forced-colors:bg-[Field] border rounded-lg overflow-hidden transition',
  variants: fieldBorderStyles.variants,
});

export function FieldGroup(props: GroupProps) {
  return (
    <Group
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        fieldGroupStyles({ ...renderProps, className }),
      )}
    />
  );
}

export function Input(props: InputProps) {
  return (
    <RACInput
      {...props}
      className={cn(
        props.className,
        'min-h-9 min-w-0 flex-1 border-0 bg-white px-3 py-0 font-sans text-sm text-neutral-800 outline outline-0 [-webkit-tap-highlight-color:transparent] placeholder:text-neutral-600 disabled:text-neutral-200 disabled:placeholder:text-neutral-200 dark:bg-neutral-900 dark:text-neutral-200 dark:placeholder:text-neutral-400 dark:disabled:text-neutral-600 dark:disabled:placeholder:text-neutral-600',
      )}
    />
  );
}
