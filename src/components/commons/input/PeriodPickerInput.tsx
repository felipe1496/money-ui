import { Calendar } from 'lucide-react';
import { PeriodPickerCustom } from '../PeriodPickerCustom';
import { cn } from '../../../utils/functions';
import type { FC } from 'react';
import { MONTHS_FULL } from '../../../constants/dates';

interface PeriodPickerProps {
  value?: { month: number; year: number };
  onChange?: (value: { month: number; year: number }) => void;
  placeholder?: string;
  className?: string;
  minYear?: number;
  maxYear?: number;
}

export const PeriodPickerInput: FC<PeriodPickerProps> = ({
  value,
  onChange,
  placeholder = 'Selecione o período',
  className,
  minYear = 2000,
  maxYear = 2030,
}) => {
  const displayValue = value ? `${MONTHS_FULL[value.month]} ${value.year}` : placeholder;

  return (
    <PeriodPickerCustom value={value} onChange={onChange} minYear={minYear} maxYear={maxYear}>
      <button
        className={cn(
          'text-foreground h-10 w-full cursor-pointer rounded-md border border-zinc-300 px-3 text-left text-sm transition-colors',
          'flex items-center gap-2',
          !value && 'text-muted-foreground',
          className,
        )}
      >
        <Calendar className="text-muted-foreground h-4 w-4" />
        <span className="flex-1">{displayValue}</span>
      </button>
    </PeriodPickerCustom>
  );
};
