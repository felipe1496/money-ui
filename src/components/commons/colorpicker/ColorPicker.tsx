import { ColorPicker as AriaColorPicker, ColorField, Input, parseColor } from 'react-aria-components';
import { ColorArea } from './ColorArea';
import { ColorSlider } from './ColorSlider';
import { Dialog } from './Dialog';
import { Popover, PopoverTrigger, PopoverContent } from '../Popover';
import type { FCC } from '../../../utils/types';
import { useState } from 'react';

type Props = {
  onColorChange?: (color: string) => void;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
};

export const ColorPicker: FCC<Props> = ({ children, onColorChange, ...props }) => {
  const [color, setColor] = useState(parseColor('#000000'));

  return (
    <AriaColorPicker
      value={color}
      onChange={(newColor) => {
        setColor(newColor);
        onColorChange?.(newColor.toString('hex'));
      }}
      aria-label={color}
    >
      <Popover>
        <PopoverTrigger asChild>
          <button type="button" {...props}>
            {children}
          </button>
        </PopoverTrigger>
        <PopoverContent className="h-fit w-fit p-0" side="top">
          <Dialog className="flex flex-col gap-6 p-4" aria-label="color-picker-dialog">
            <ColorArea
              className="aspect-square"
              colorSpace="hsb"
              xChannel="saturation"
              yChannel="brightness"
            />
            <ColorSlider colorSpace="hsb" channel="hue" />
            <ColorField aria-label="color-field">
              <Input
                className="placeholder:text-muted-foreground h-8 rounded-md border border-zinc-300 px-2 text-sm"
                onKeyDown={(evt) => {
                  if (evt.key === 'Enter') {
                    evt.currentTarget.blur();
                  }
                }}
              />
            </ColorField>
          </Dialog>
        </PopoverContent>
      </Popover>
    </AriaColorPicker>
  );
};
