import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { Input } from '../../../components/commons/input/Input';
import { Dialog } from '@radix-ui/react-dialog';
import {
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/commons/Dialog';
import { Button } from '../../../components/commons/Button';
import { Textarea } from '../../../components/commons/Textarea';
import dayjs from 'dayjs';
import type { FCC } from '../../../utils/types';
import { MoneyInput } from '../../../components/commons/input/MoneyInput';
import { formatCurrency } from '../../../utils/functions';
import { Form } from '../../../components/commons/Form';
import { AsyncSelectCategory } from '../../../components/AsyncSelectCategory';
import { Spinner } from '../../../components/commons/loader/Spinner';
import { useState } from 'react';
import { categoriesKeys } from '../../../queries/categories-queries';
import { SaveCategoryDialog } from '../../categories/components/SaveCategoryDialog';
import { usePostCategory } from '../../../hooks/mutations/usePostCategory';

interface Props {
  defaultValues?: Form;
  onSave: (data: Form, { reset }: { reset: () => void }) => void;
  isVisible?: boolean;
  onClose?: () => void;
  isLoading?: boolean;
}

const initialDefaultValues: Form = {
  name: '',
  amount: formatCurrency(0),
  date: dayjs().format('YYYY-MM-DD'),
  description: '',
  category: null,
};

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  amount: z.string(),
  date: z.string().refine((date) => dayjs(date, 'YYYY-MM-DD').isValid(), 'Invalid date'),
  description: z.string().max(400, 'Description is too long').optional(),
  category: z.any(),
});

type Form = z.infer<typeof schema>;

export const SaveIncomeDialog: FCC<Props> = ({
  defaultValues = initialDefaultValues,
  children,
  onSave,
  isVisible,
  onClose,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<Form>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: Form) => {
    onSave(data, { reset });
  };

  const [addCategoryVisible, setAddCategoryVisible] = useState(false);
  
  const { mutate: postCategory, isPending } = usePostCategory({
      onSuccess: () => setAddCategoryVisible(false),
      meta: {
        successNotification: 'Category created successfully',
        errorNotification: 'There was an error creating the category',
        invalidateQuery: [categoriesKeys.all()],
      },
  });

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Income</DialogTitle>
        </DialogHeader>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <label className="flex flex-col text-sm">
            <span data-error={errors.name?.message || '*'}>Name</span>
            <Input placeholder="Cinema ticket, Groceries..." {...register('name')} />
          </label>
          <label className="flex flex-col text-sm">
            <span data-error={errors.amount?.message || '*'}>Amount</span>
            <MoneyInput {...register('amount')} minValue={0} maxValue={999999} />
          </label>
          <label className="flex flex-col text-sm">
            <span data-error={errors.category?.message}>Category</span>
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, value } }) => {
                return (
                  <>
                    <AsyncSelectCategory 
                      selected={value}
                      onChange={(option) => {
                        if (option?.id === '__add__') {
                          setAddCategoryVisible(true);
                          console.log('Add new category');
                        } else {
                          onChange(option);
                        }
                      }} 
                    />
                    <SaveCategoryDialog
                      isVisible={addCategoryVisible}
                      onVisibleChange={setAddCategoryVisible}
                      onSave={postCategory}
                      isLoading={isPending}
                    />
                  </>
                )
              }}
            />
          </label>
          <label className="flex flex-col text-sm">
            <span data-error={errors.date?.message || '*'}>Date</span>
            <Input type="date" {...register('date')} />
          </label>
          <label className="flex flex-col text-sm">
            <span data-error={errors.description?.message}>Description</span>
            <Textarea className="min-h-28" {...register('description')} />
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
