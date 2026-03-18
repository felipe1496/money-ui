import { ColorPicker } from 'react-aria-components';
import { ColorArea } from './ColorArea';
import { ColorSlider } from './ColorSlider';
import { ColorField } from './ColorField';
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

export const NewColorPicker: FCC<Props> = ({ children, onColorChange, ...props }) => {
  const [color, setColor] = useState('#000000');

  return (
    <ColorPicker
      value={color}
      onChange={(newColor) => {
        setColor(newColor.toString());
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
        <PopoverContent>
          <Dialog className="flex flex-col gap-2" aria-label="color-picker-dialog">
            <ColorArea
              className="h-48 w-48"
              colorSpace="hsb"
              xChannel="saturation"
              yChannel="brightness"
            />
            <ColorField aria-label="color-field"/>
            <ColorSlider colorSpace="hsb" channel="hue" />
          </Dialog>
        </PopoverContent>
      </Popover>
    </ColorPicker>
  );
};
