import type { ChangeEvent, FC, InputHTMLAttributes } from 'react';
import { Input } from './Input';

export const NumericInput: FC<InputHTMLAttributes<HTMLInputElement>> = ({
  onChange,
  max,
  ...props
}) => {
  function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
    let onlyNumbers = event.target.value.replace(/\D/g, '');
    if (max !== undefined && onlyNumbers !== '') {
      if (parseInt(onlyNumbers, 10) > Number(max)) {
        onlyNumbers = String(max);
      }
    }
    event.target.value = onlyNumbers;
    if (onChange) onChange(event);
  }
  return <Input inputMode="numeric" type="text" onChange={handleOnChange} max={max} {...props} />;
};
