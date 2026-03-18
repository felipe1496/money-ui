import {
  ColorField as AriaColorField,
  type ColorFieldProps as AriaColorFieldProps,
  type ValidationResult,
} from 'react-aria-components';
import { tv } from 'tailwind-variants';
import { Description, FieldError, Input, Label } from './Field';
import { cn } from '../../../utils/functions';

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

const inputStyles = tv({
  base: 'border-1 rounded-lg min-h-9 font-sans text-sm py-0 px-3 box-border transition [-webkit-tap-highlight-color:transparent]',
  variants: {
    isFocused: fieldBorderStyles.variants.isFocusWithin,
    isInvalid: fieldBorderStyles.variants.isInvalid,
    isDisabled: fieldBorderStyles.variants.isDisabled,
  },
});

export interface ColorFieldProps extends AriaColorFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function ColorField({ label, description, errorMessage, ...props }: ColorFieldProps) {
  return (
    <AriaColorField {...props} className={cn(props.className, 'flex flex-col gap-1 font-sans')}>
      {label && <Label>{label}</Label>}
      <Input className={inputStyles} />
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaColorField>
  );
}
