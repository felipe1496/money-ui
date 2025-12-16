import { useForm } from 'react-hook-form';
import { Button } from '../../../components/commons/Button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '../../../components/commons/Dialog';
import { Input } from '../../../components/commons/Input';
import { Textarea } from '../../../components/commons/Textarea';
import type { FCC } from '../../../utils/types';
import z from 'zod';
import dayjs from 'dayjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { DataTable, type Column } from '../../../components/commons/DataTable';
import { useState } from 'react';
import { ArrowRightIcon } from 'lucide-react';

interface Props {
  defaultValues?: {
    name: string;
    amount: number;
    date: Date;
    description: string;
  };
  onSave: (data: { name: string; amount: number; date: Date; description: string }) => void;
}

const initialDefaultValues = {
  name: '',
  amount: 0,
  installments: 2,
  date: new Date(),
  description: '',
};

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  amount: z
    .string()
    .refine((amount) => Number(amount) > 0, 'Amount must be greater than 0')
    .refine((amount) => Number(amount) % 1 === 0, 'Amount must be an integer'),
  date: z.string().refine((date) => dayjs(date, 'YYYY-MM-DD').isValid(), 'Invalid date'),
  installments: z
    .string()
    .refine((installments) => Number(installments) % 1 === 0, 'Installments must be an integer'),
  description: z.string().max(400, 'Description is too long').optional(),
});

type Form = z.infer<typeof schema>;

export const InstallmentDialog: FCC<Props> = ({
  children,
  defaultValues = initialDefaultValues,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    defaultValues: {
      name: defaultValues.name,
      amount: defaultValues.amount.toString(),
      date: dayjs(defaultValues.date).format('YYYY-MM-DD'),
      description: defaultValues.description,
    },
    resolver: zodResolver(schema),
  });
  const [simulationData, setSimulationData] = useState<Form | null>(null);
  const [periodsSimulation, setPeriodsSimulation] = useState<
    { month: string; name: string; amount: number }[] | null
  >(null);

  const onSubmit = (data: Form) => {
    setSimulationData(data);
  };

  const columns: Column<{ name: string; amount: number }>[] = [
    {
      id: 'name',
      title: 'Name',
      trClassName: 'w-[80%]',
      render: (d) => d.name,
    },
    {
      id: 'amount',
      title: 'Amount',
      trClassName: 'w-[20%]',
      render: (d) => d.amount,
    },
  ];

  function renderSimulation() {
    if (simulationData == null) {
      return null;
    }

    const totalAmount = Number(simulationData.amount);
    const installments = Number(simulationData.installments);

    const baseAmount = Math.floor((totalAmount / installments) * 100) / 100;

    const remainder = Math.round((totalAmount - baseAmount * installments) * 100) / 100;

    const months = Array.from({ length: installments }, (_, i) =>
      dayjs(simulationData.date).add(i, 'month').format('YYYY/MM'),
    );

    const periods = months.map((month, index) => ({
      month,
      name: `${simulationData.name} (${index + 1}/${installments})`,
      amount: index === 0 ? baseAmount + remainder : baseAmount,
    }));

    setPeriodsSimulation(periods);

    return (
      <div className="w-full">
        <DataTable
          columns={[
            {
              id: 'month',
              title: 'Month',
              trClassName: 'w-[30%]',
              render: (d) => d.month,
            },
            ...columns,
          ]}
          data={periods}
        />
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full max-w-2xl gap-4">
        <DialogTitle>Installment Expense</DialogTitle>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-full flex-col gap-3">
            <label className="flex flex-col text-sm">
              <span data-error={errors.name?.message || '*'}>Name</span>
              <Input placeholder="Cinema ticket, Groceries..." {...register('name')} />
            </label>
            <label className="flex flex-col text-sm">
              <span data-error={errors.amount?.message || '*'}>Total Amount</span>
              <Input
                {...register('amount')}
                placeholder="0"
                type="number"
                minNumber={0}
                maxNumber={999999}
                decimalPrecision={2}
              />
            </label>
            <label className="flex flex-col text-sm">
              <span data-error={errors.installments?.message || '*'}>Installments</span>
              <Input
                {...register('installments')}
                placeholder="0"
                type="number"
                minNumber={2}
                maxNumber={1000}
                decimalPrecision={0}
              />
            </label>
            <label className="flex flex-col text-sm">
              <span data-error={errors.date?.message || '*'}>Initial Date</span>
              <Input type="date" {...register('date')} />
            </label>
            <label className="flex flex-col text-sm">
              <span data-error={errors.description?.message}>Description</span>
              <Textarea className="min-h-28" {...register('description')} />
            </label>
          </div>

          <div className="flex w-full gap-2">
            <Button variant="ghost" className="w-full">
              Cancel
            </Button>
            <Button className="w-full">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
