import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/commons/Dialog';
import { Input } from '../../../components/commons/input/Input';
import type { FCC } from '../../../utils/types';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../../../components/commons/Form';
import { DEFAULT_COLORS } from '../../../constants/default-colors';
import { cn } from '../../../utils/functions';
import { CheckIcon, PlusIcon } from 'lucide-react';
import { NewColorPicker } from '../../../components/commons/colorpicker/NewColorPicker';
import { Button } from '../../../components/commons/Button';
import { Spinner } from '../../../components/commons/loader/Spinner';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
  color: z.string().min(1, 'Color is required'),
});

type Form = z.infer<typeof schema>;

const initialDeafultValues: Form = {
  name: '',
  color: '',
};

interface Props {
  defaultValues?: Form;
  isLoading?: boolean;
  onSave: (data: Form, { reset }: { reset: () => void }) => void;
  isVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
}

export const SaveCategoryDialog: FCC<Props> = ({
  children,
  defaultValues = initialDeafultValues,
  isLoading = false,
  onSave,
  isVisible,
  onVisibleChange,
}) => {
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const [ customColor, setCustomColor ] = useState('');
  const [ selectedColor, setSelectedColor ] = useState('');

  function onSubmit(data: Form) {
    onSave(data, { reset });
  }

  return (
    <Dialog open={isVisible} onOpenChange={onVisibleChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
        </DialogHeader>
        <Form
          onSubmit={(evt) => {
            evt.stopPropagation();
            handleSubmit(onSubmit)(evt);
          }}
        >
          <label className="flex flex-col text-sm">
            <span data-error={errors.name?.message}>Name</span>
            <Input placeholder="Name" {...register('name')} />
          </label>
          <label className="flex flex-col text-sm pointer-events-none">
            <span data-error={errors.color?.message}>Color</span>
            <Controller
              name="color"
              control={control}
              render={({ field: { onChange } }) => {
                const isCustomColor = customColor && !Object.values(DEFAULT_COLORS).includes(customColor);
                return (
                  <div className="mt-2 flex items-center gap-1">
                    {Object.values(DEFAULT_COLORS).map((color, idx) => (
                      <button
                        key={`${color}-${idx}`}
                        type="button"
                        onClick={() => {
                          onChange(color);
                          setSelectedColor(color);
                        }}
                        className="flex size-6 cursor-pointer items-center justify-center rounded-full pointer-events-auto"
                        style={{ backgroundColor: color }}
                      >
                        {selectedColor === color && <CheckIcon className="size-4 text-white" />}
                      </button>
                    ))}
                    <NewColorPicker
                      onColorChange={(newCustomColor) => {
                        onChange(newCustomColor);
                        setCustomColor(newCustomColor);
                        setSelectedColor(newCustomColor);
                      }}
                      onClick={() => {setSelectedColor(customColor)}}
                      className={cn(
                        isCustomColor
                          ? 'flex size-6 cursor-pointer items-center justify-center rounded-full pointer-events-auto'
                          : 'border-muted-foreground flex size-5 cursor-pointer items-center justify-center rounded-full border border-dashed pointer-events-auto',
                      )}
                      style={{
                        backgroundColor: isCustomColor ? customColor : 'transparent',
                      }}
                    >
                      {isCustomColor && selectedColor === customColor? (
                        <CheckIcon className="size-4 text-white" />
                      ) : (
                        <PlusIcon className="text-muted-foreground size-3" />
                      )}
                    </NewColorPicker>
                  </div>
                );
              }}
            />
          </label>

          <div className="flex w-full gap-2">
            <DialogClose asChild>
              <Button className="w-full" variant="outlined" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button className="w-full" disabled={isLoading}>
              {isLoading ? <Spinner variant="secondary" /> : 'Save'}
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
