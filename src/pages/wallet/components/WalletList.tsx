import { useState, type FC } from 'react';
import { useCtxStore } from '../../../stores/useCtxStore';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getEntriesQueryOpts } from '../../../queries/transactions-queries';
import dayjs from 'dayjs';
import { DataTable, type Column } from '../../../components/commons/DataTable';
import type { TransactionsService } from '../../../services/transactions-service';
import { TablePagination } from '../../../components/commons/TablePagination';

export const WalletList: FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { period } = useCtxStore();

  const ITEMS_PER_PAGE = 10;

  const { data } = useSuspenseQuery({
    ...getEntriesQueryOpts(dayjs().year(period.year).month(period.month).format('YYYYMM'), {
      page: currentPage,
      per_page: ITEMS_PER_PAGE,
    }),
  });

  const totalPages = data.query.total_pages;
  const totalItems = data.query.total_items;

  const columns: Column<
    Awaited<ReturnType<typeof TransactionsService.getEntries>>['data']['entries'][number]
  >[] = [
    {
      id: 'name',
      title: 'Name',
      render: (d) => d.name,
    },
    {
      id: 'amount',
      title: 'Amount',
      render: (d) => d.amount,
    },
    {
      id: 'installment',
      title: 'Installment',
      render: (d) => `${d.installment}/${d.total_installments}`,
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={data.data.entries} />
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
    </>
  );
};
