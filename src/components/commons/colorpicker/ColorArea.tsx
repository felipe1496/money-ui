import { ColorArea as AriaColorArea, type ColorAreaProps } from 'react-aria-components';
import { cn } from '../../../utils/functions';
import { ColorThumb } from './ColorThumb';

export function ColorArea(props: ColorAreaProps) {
  return (
    <AriaColorArea
      {...props}
      className={cn(
        props.className,
        'aspect-square w-full max-w-56 rounded-lg bg-neutral-300 dark:bg-neutral-800 forced-colors:bg-[GrayText]',
      )}
      style={({ defaultStyle, isDisabled }) => ({
        ...defaultStyle,
        background: isDisabled ? undefined : defaultStyle.background,
      })}
    >
      <ColorThumb />
    </AriaColorArea>
  );
}
