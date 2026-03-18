import { ColorPicker } from 'react-aria-components';
import { ColorArea } from './ColorArea';
import { ColorSlider } from './ColorSlider';
import { Dialog } from './Dialog';
import { Popover, PopoverTrigger, PopoverContent } from '../Popover';
import { Input } from '../../../components/commons/input/Input';
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
        setColor(newColor.toString('hex'));
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
        <PopoverContent className="w-fit h-fit p-0">
          <Dialog className="flex flex-col gap-2 p-2" aria-label="color-picker-dialog">
            <ColorArea
              className="aspect-square"
              colorSpace="hsb"
              xChannel="saturation"
              yChannel="brightness"
            />
            <ColorSlider colorSpace="hsb" channel="hue" />
            <Input onChange={(newColor) => {
              setColor(newColor.toString());
              onColorChange?.(newColor.toString());
            }} aria-label="color-field" className="h-8"/>
          </Dialog>
        </PopoverContent>
      </Popover>
    </ColorPicker>
  );
};
