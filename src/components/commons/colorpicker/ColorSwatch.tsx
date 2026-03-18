import { ColorSwatch as AriaColorSwatch, type ColorSwatchProps } from 'react-aria-components';
import { cn } from '../../../utils/functions';

export function ColorSwatch(props: ColorSwatchProps) {
  return (
    <AriaColorSwatch
      {...props}
      className={cn(props.className, 'box-border h-8 w-8 rounded-md border border-black/10')}
      style={({ color }) => ({
        background: `linear-gradient(${color}, ${color}),
          repeating-conic-gradient(#CCC 0% 25%, white 0% 50%) 50% / 16px 16px`,
      })}
    />
  );
}
