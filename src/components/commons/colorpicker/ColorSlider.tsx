import {
  ColorSlider as AriaColorSlider,
  type ColorSliderProps,
  SliderTrack,
} from 'react-aria-components';
import { tv } from 'tailwind-variants';
import { cn } from '../../../utils/functions';
import { ColorThumb } from './ColorThumb';

const trackStyles = tv({
  base: 'group col-span-2 rounded-md',
  variants: {
    orientation: {
      horizontal: 'w-full h-6',
      vertical: 'w-6 h-50',
    },
    isDisabled: {
      true: 'bg-neutral-300 dark:bg-neutral-800 forced-colors:bg-[GrayText]',
    },
  },
});

export function ColorSlider({ ...props }: ColorSliderProps) {
  return (
    <AriaColorSlider
      {...props}
      className={cn(
        props.className,
        'orientation-horizontal:grid orientation-vertical:flex orientation-horizontal:w-56 grid-cols-[1fr_auto] flex-col items-center gap-2 font-sans',
      )}
    >
      <SliderTrack
        className={trackStyles}
        style={({ defaultStyle, isDisabled }) => ({
          ...defaultStyle,
          background: isDisabled
            ? undefined
            : `${defaultStyle.background}, repeating-conic-gradient(#CCC 0% 25%, white 0% 50%) 50% / 16px 16px`,
        })}
      >
        <ColorThumb />
      </SliderTrack>
    </AriaColorSlider>
  );
}
