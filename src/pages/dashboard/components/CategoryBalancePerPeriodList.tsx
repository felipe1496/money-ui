import { useSuspenseQuery } from '@tanstack/react-query';
import { getCategoriesPerPeriodQueryOpts } from '../../../queries/categories-queries';
import { usePeriod } from '../../../hooks/usePeriod';
import dayjs from 'dayjs';
import { cn } from '../../../utils/functions';
import { useState } from 'react';

const DATA_EXPANDED = {
  SHOW_ALL: 100,
  SHOW_LESS: 10,
};

export const CategoryBalancePerPeriodList = () => {
  const [perPage, setPerPage] = useState(DATA_EXPANDED.SHOW_LESS);

  const { period } = usePeriod();

  const { data } = useSuspenseQuery({
    ...getCategoriesPerPeriodQueryOpts(
      dayjs().year(period.year).month(period.month).format('YYYYMM'),
      { per_page: 100, order_by: 'total_amount:desc' },
    ),
  });

  const showData = data.data.categories.slice(0, perPage);

  const categories = data.data.categories;

  const toggleButton = () => {
    if (categories.length <= DATA_EXPANDED.SHOW_LESS) {
      return null;
    }

    if (perPage === DATA_EXPANDED.SHOW_LESS) {
      return (
        <button
          className="mt-2 cursor-pointer text-sm font-medium text-blue-500 underline"
          onClick={() => {
            setPerPage(DATA_EXPANDED.SHOW_ALL);
          }}
        >
          Show more
        </button>
      );
    }

    return (
      <button
        className="mt-2 cursor-pointer text-sm font-medium text-blue-500 underline"
        onClick={() => {
          setPerPage(DATA_EXPANDED.SHOW_LESS);
        }}
      >
        Show less
      </button>
    );
  };

  if (data.data.categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <img src="/empty_state_tag.webp" alt="" className="size-20" />
        <span className="mt-3 text-lg font-medium">No transactions with categories yet</span>
        <span>Categorize your transactions to check some insights</span>
      </div>
    );
  }

  return (
    <div>
      {showData.map((item) => (
        <div key={item.id} className="flex items-center justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <div
              className="size-5 shrink-0 rounded-full shadow-sm"
              style={{ backgroundColor: item.color }}
            />
            <p className="truncate">{item.name}</p>
          </div>

          <div
            className={cn('font-medium', item.total_amount < 0 ? 'text-red-400' : 'text-green-500')}
          >
            <span>
              {item.total_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </span>
          </div>
        </div>
      ))}

      {toggleButton()}
    </div>
  );
};
