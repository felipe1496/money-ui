import { type FC } from 'react';
import { CategoryPerPeriod } from './CategoryPerPeriodChart';
import { Card } from '../../../components/commons/Card';
import { CategoryBalancePerPeriodList } from './CategoryBalancePerPeriodList';
import { RecurrencesService } from '../../../services/RecurrencesService';
import { useSuspenseQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { usePeriod } from '../../../hooks/usePeriod';

export const Insights: FC = () => {
  const { period } = usePeriod();
  const periodFormatted = dayjs().year(period.year).month(period.month).format('YYYYMM');

  useSuspenseQuery({
    queryKey: ['recurrences', 'prepare', periodFormatted],
    queryFn: async () => {
      await RecurrencesService.prepareRecurrences(periodFormatted);
      return true;
    },
  });

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <Card header={<h2>Spending by category</h2>} wrapperClassName="lg:col-span-9">
        <CategoryPerPeriod />
      </Card>
      <Card header={<h2>Balance by category</h2>} wrapperClassName="lg:col-span-3">
        <CategoryBalancePerPeriodList />
      </Card>
    </div>
  );
};
