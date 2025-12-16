import { useState, type FC } from 'react';
import { useCtxStore } from '../../../stores/useCtxStore';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getEntriesQueryOpts } from '../../../queries/transactions-queries';
import dayjs from 'dayjs';
import { DataTable, type Column } from '../../../components/commons/DataTable';
import type { TransactionsService } from '../../../services/transactions-service';
import { TablePagination } from '../../../components/commons/TablePagination';
import { Skeleton } from '../../../components/commons/Skeleton';
import { BanknoteArrowDownIcon } from 'lucide-react';

export const WalletList: FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { period } = useCtxStore();

  const ITEMS_PER_PAGE = 10;

  const { data, isFetching } = useQuery({
    ...getEntriesQueryOpts(dayjs().year(period.year).month(period.month).format('YYYYMM'), {
      page: currentPage,
      per_page: ITEMS_PER_PAGE,
    }),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.query.total_pages;
  const totalItems = data?.query.total_items;

  const columns: Column<
    Awaited<ReturnType<typeof TransactionsService.getEntries>>['data']['entries'][number]
  >[] = [
    {
      id: 'name',
      title: 'Name',
      render: (d) => {
        let icon = null;
        switch (d.type) {
          case 'simple_expense':
            icon = (
              <div className="rounded-full bg-red-950 p-2">
                <BanknoteArrowDownIcon className="size-8 text-red-500" />
              </div>
            );
            break;
          default:
            break;
        }
        return (
          <div className="flex items-center gap-4">
            {icon}
            {d.name}
          </div>
        );
      },
      isLoading: (
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={48} height={48} />
          <Skeleton variant="text" width="60%" height={24} />
        </div>
      ),
      trClassName: 'w-[50%]',
    },
    {
      id: 'amount',
      title: 'Amount',
      render: (d) => d.amount,
      isLoading: <Skeleton variant="text" width={40} height={24} />,
      trClassName: 'w-[20%]',
    },
    {
      id: 'installment',
      title: 'Installment',
      render: (d) => `${d.installment}/${d.total_installments}`,
      isLoading: <Skeleton variant="text" width={20} height={24} />,
      trClassName: 'w-[20%]',
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={data?.data.entries ?? []} isLoading={isFetching} />
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages ?? 0}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
    </>
  );
};
