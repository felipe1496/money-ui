import { useState, type ComponentProps, type FC } from 'react';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { entriesKeys, getEntriesQueryOpts } from '../../../queries/transactions-queries';
import dayjs from 'dayjs';
import type { TransactionsService } from '../../../services/TransactionsService';
import { useConfirm } from '../../../hooks/useConfirm';
import { useDeleteTransaction } from '../../../hooks/mutations/useDeleteTransaction';
import { Card } from '../../../components/commons/Card';
import { cn, formatCurrency, parseUSD } from '../../../utils/functions';
import { Button } from '../../../components/commons/Button';
import { SquarePenIcon, TrashIcon } from 'lucide-react';
import { Link } from 'react-router';
import { ROUTES } from '../../../constants/routes';
import { usePeriod } from '../../../hooks/usePeriod';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../components/commons/Tooltip';
import { SaveIncomeDialog } from './SaveIncomeDialog';
import { SaveSimpleExpenseDialog } from './SaveSimpleExpenseDialog';
import { createFilter } from '../../../utils/filter';
import { SaveInstallmentDialog } from './SaveInstallmentDialog';
import { usePatchTransaction } from '../../../hooks/mutations/usePatchTransaction';
export const EntriesList: FC = () => {
  const [isEditingExpense, setIsEditingExpense] = useState<{
    id: string;
    defaultValues: NonNullable<ComponentProps<typeof SaveSimpleExpenseDialog>['defaultValues']>;
  } | null>(null);
  const [isEditingIncome, setIsEditingIncome] = useState<{
    id: string;
    defaultValues: NonNullable<ComponentProps<typeof SaveIncomeDialog>['defaultValues']>;
  } | null>(null);
  const [isEditingInstallment, setIsEditingInstallment] = useState<{
    transaction_id: string;
    defaultValues?: NonNullable<ComponentProps<typeof SaveInstallmentDialog>['defaultValues']>;
    previewDefaultValues?: NonNullable<
      ComponentProps<typeof SaveInstallmentDialog>['previewDefaultValues']
    >;
  } | null>(null);
  const { period } = usePeriod();
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const periodFormatted = dayjs().year(period.year).month(period.month).format('YYYYMM');

  const {
    mutate: patchTransaction,
    isPending: isPatchTransactionLoading,
    variables: patchTransactionVariables,
  } = usePatchTransaction({
    meta: {
      successNotification: 'Transaction updated successfully',
      errorNotification: 'There was an error updating the transaction',
      invalidateQuery: [entriesKeys.all()],
    },
  });

  const { data } = useSuspenseQuery({
    ...getEntriesQueryOpts({
      per_page: 999,
      order_by: 'reference_date:desc,created_at:desc',
      filter: createFilter().and('period', 'eq', periodFormatted).toURL(),
    }),
    select: (data) => {
      const entriesPerDate: Record<
        string,
        Awaited<ReturnType<typeof TransactionsService.getEntries>>['data']['entries'][number][]
      > = {};
      data.data.entries.forEach((entry) => {
        const date = entry.reference_date.slice(0, 10);
        if (!entriesPerDate[date]) {
          entriesPerDate[date] = [entry];
        } else {
          entriesPerDate[date] = [...entriesPerDate[date], entry];
        }
      });
      return entriesPerDate;
    },
  });

  const { mutate: deleteTransaction } = useDeleteTransaction({
    onMutate: async (id) => {
      const queryOpts = {
        per_page: 999,
        order_by: 'reference_date:desc,created_at:desc',
        filter: createFilter().and('period', 'eq', periodFormatted).toURL(),
      };

      const queryKey = entriesKeys.getEntries(queryOpts);

      await queryClient.cancelQueries({ queryKey: entriesKeys.all() });

      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData<Awaited<ReturnType<typeof TransactionsService.getEntries>>>(
        queryKey,
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              entries: old.data.entries.filter((entry) => entry.transaction_id !== id),
            },
          };
        },
      );

      return {
        previousData,
        queryKey,
      };
    },
    onError: (_err, _id, context) => {
      const ctx = context as
        | {
            previousData?: Awaited<ReturnType<typeof TransactionsService.getEntries>>;
            queryKey?: readonly unknown[];
          }
        | undefined;
      if (ctx?.previousData && ctx?.queryKey) {
        queryClient.setQueryData(ctx.queryKey, ctx.previousData);
      }
    },
    meta: {
      errorNotification: 'An error occurred while deleting the transaction',
      invalidateQuery: [entriesKeys.all()],
    },
  });

  const entries = Object.entries(data);

  return (
    <Card className="p-0" header={<h2 className="text-muted-foreground">Transactions</h2>}>
      {entries.length > 0 ? (
        <table className="w-full">
          <tbody>
            {entries
              .map(([date, entries]) => [
                <tr key={date} className="bg-zinc-100">
                  <td className="px-3 py-1 text-sm text-zinc-500" colSpan={5}>
                    {dayjs(date, 'YYYY-MM-DD').format('DD of MMMM')}
                  </td>
                </tr>,
                ...entries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="w-[30%] px-3 py-1">
                      <div className="flex items-center gap-2">
                        {entry.category_color && (
                          <Tooltip>
                            <TooltipTrigger>
                              <div
                                className="size-4 shrink-0 rounded-full"
                                style={{
                                  backgroundColor: entry.category_color,
                                }}
                              />
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              <p>{entry.category_name}</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                        <p>{entry.name}</p>
                      </div>
                    </td>
                    <td className="w-[20%] px-3 py-1">{entry.reference_date.slice(0, 10)}</td>
                    <td className="w-[20%] px-3 py-1">
                      {entry.installment}/{entry.total_installments}
                    </td>
                    <td
                      className={cn(
                        'w-[25%] px-3 py-1 text-right font-medium',
                        entry.amount < 0 ? 'text-red-400' : 'text-green-500',
                      )}
                    >
                      {Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                        entry.amount,
                      )}
                    </td>
                    <td className="w-[5%] px-3 py-1 text-right">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outlined"
                          onClick={() => {
                            switch (entry.type) {
                              case 'simple_expense': {
                                const defaultValues = {
                                  name: entry.name,
                                  amount: formatCurrency(Math.abs(entry.amount)),
                                  description: entry.description || '',
                                  date: entry.reference_date.substring(0, 10),
                                  category: null,
                                };
                                if (entry.category_id) {
                                  Object.assign(defaultValues, {
                                    category: {
                                      id: entry.category_id,
                                      value: {
                                        id: entry.category_id,
                                        name: entry.category_name,
                                        color: entry.category_color,
                                      },
                                      label: entry.category_name,
                                    },
                                  });
                                }
                                setIsEditingExpense({
                                  id: entry.transaction_id,
                                  defaultValues,
                                });
                                break;
                              }
                              case 'income': {
                                const defaultValues = {
                                  name: entry.name,
                                  amount: formatCurrency(Math.abs(entry.amount)),
                                  description: entry.description || '',
                                  date: entry.reference_date.substring(0, 10),
                                  category: null,
                                };
                                if (entry.category_id) {
                                  Object.assign(defaultValues, {
                                    category: {
                                      id: entry.category_id,
                                      value: {
                                        id: entry.category_id,
                                        name: entry.category_name,
                                        color: entry.category_color,
                                      },
                                      label: entry.category_name,
                                    },
                                  });
                                }
                                setIsEditingIncome({
                                  id: entry.transaction_id,
                                  defaultValues,
                                });
                                break;
                              }
                              case 'installment': {
                                const defaultValues = {
                                  amount: formatCurrency(Math.abs(entry.total_amount)),
                                  name: entry.name,
                                  note: entry.description || '',
                                  installments: entry.total_installments.toString(),
                                  reference_date: entry.reference_date,
                                  category: null,
                                };
                                if (entry.category_id) {
                                  Object.assign(defaultValues, {
                                    category: {
                                      id: entry.category_id,
                                      value: {
                                        id: entry.category_id,
                                        name: entry.category_name,
                                        color: entry.category_color,
                                      },
                                      label: entry.category_name,
                                    },
                                  });
                                }
                                setIsEditingInstallment({
                                  transaction_id: entry.transaction_id,
                                  defaultValues,
                                });
                                break;
                              }
                              default:
                                break;
                            }
                          }}
                        >
                          <SquarePenIcon className="size-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outlined"
                          onClick={() =>
                            confirm.add(
                              'Delete Transaction',
                              'This action will delete this entry and all other entries related to it. Are you sure? This action cannot be undone.',
                              () => deleteTransaction(entry.transaction_id),
                            )
                          }
                        >
                          <TrashIcon className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )),
              ])
              .flat(Infinity)}
          </tbody>
        </table>
      ) : (
        <div className="flex flex-col items-center justify-center pb-8">
          <img src="/empty_state_wallet.webp" alt="no results found" className="size-28" />

          <span className="text-lg font-medium">No transactions yet</span>
          <span>Try adding one</span>

          <Button className="mt-3" variant="outlined" asChild>
            <Link to={{ pathname: ROUTES.WALLET.NEW }}>Add Transaction</Link>
          </Button>
        </div>
      )}
      {isEditingExpense && (
        <SaveSimpleExpenseDialog
          isLoading={
            isPatchTransactionLoading &&
            isEditingExpense.id === patchTransactionVariables.transactionId
          }
          isVisible={!!isEditingExpense}
          onClose={() => setIsEditingExpense(null)}
          defaultValues={isEditingExpense?.defaultValues}
          onSave={(data) => {
            patchTransaction(
              {
                transactionId: isEditingExpense.id,
                payload: {
                  name: data.name,
                  note: data.description,
                  entries: [{ amount: parseUSD(data.amount) * -1, reference_date: data.date }],
                  category_id: data.category?.id,
                },
              },
              {
                onSuccess: () => {
                  setIsEditingExpense(null);
                },
              },
            );
          }}
        />
      )}
      {isEditingIncome && (
        <SaveIncomeDialog
          isLoading={
            isPatchTransactionLoading &&
            isEditingIncome.id === patchTransactionVariables.transactionId
          }
          isVisible={!!isEditingIncome}
          onClose={() => setIsEditingIncome(null)}
          defaultValues={isEditingIncome?.defaultValues}
          onSave={(data) => {
            patchTransaction(
              {
                transactionId: isEditingIncome.id,
                payload: {
                  name: data.name,
                  note: data.description,
                  entries: [{ amount: parseUSD(data.amount), reference_date: data.date }],
                  category_id: data.category?.id,
                },
              },
              {
                onSuccess: () => {
                  setIsEditingIncome(null);
                },
              },
            );
          }}
        />
      )}
      {isEditingInstallment && (
        <SaveInstallmentDialog
          isLoading={
            isPatchTransactionLoading &&
            isEditingInstallment.transaction_id === patchTransactionVariables.transactionId
          }
          isVisible={!!isEditingInstallment}
          onClose={() => setIsEditingInstallment(null)}
          onSave={(data) => {
            patchTransaction(
              {
                transactionId: isEditingInstallment.transaction_id,
                payload: {
                  category_id: data.category?.id,
                  entries: data.entries.map((entry) => ({
                    amount: parseUSD(entry.amount) * -1,
                    reference_date: entry.reference_date,
                  })),
                  name: data.name,
                  note: data.note,
                },
              },
              {
                onSuccess: () => {
                  setIsEditingInstallment(null);
                },
              },
            );
          }}
          defaultValues={(() => {
            if (!isEditingInstallment?.defaultValues) return undefined;
            return {
              amount: isEditingInstallment.defaultValues.amount,
              name: isEditingInstallment.defaultValues.name,
              note: isEditingInstallment.defaultValues.note,
              installments: isEditingInstallment.defaultValues.installments,
              reference_date: isEditingInstallment.defaultValues.reference_date,
              category: isEditingInstallment.defaultValues.category,
            };
          })()}
          previewDefaultValues={{
            entries: [],
          }}
        />
      )}
    </Card>
  );
};
