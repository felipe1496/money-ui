import { Calendar } from 'lucide-react';
import { PeriodPickerCustom } from './PeriodPickerCustom';
import { cn } from '../../utils/functions';
import type { FC } from 'react';
import { MONTHS_FULL } from '../../constants/dates';

interface PeriodPickerProps {
  value?: { month: number; year: number };
  onChange?: (value: { month: number; year: number }) => void;
  placeholder?: string;
  className?: string;
  minYear?: number;
  maxYear?: number;
}

export const PeriodPicker: FC<PeriodPickerProps> = ({
  value,
  onChange,
  placeholder = 'Selecione o período',
  className,
  minYear = 2000,
  maxYear = 2030,
}) => {
  const displayValue = value ? `${MONTHS_FULL[value.month]} de ${value.year}` : placeholder;

  return (
    <PeriodPickerCustom value={value} onChange={onChange} minYear={minYear} maxYear={maxYear}>
      <button
        className={cn(
          'border-border bg-card text-foreground h-10 w-[280px] rounded-md border px-3 text-left text-sm transition-colors',
          'flex items-center gap-2',
          'hover:border-primary/50 focus:ring-ring focus:ring-offset-background focus:ring-2 focus:ring-offset-2 focus:outline-none',
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
