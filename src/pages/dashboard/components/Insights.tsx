import { type FC } from 'react';
import { CategoryPerPeriod } from './CategoryPerPeriodChart';
import { Card } from '@/components/commons/Card';
import { CategoryBalancePerPeriodList } from './CategoryBalancePerPeriodList';

export const Insights: FC = () => {
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
