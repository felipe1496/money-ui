import { Suspense, type FC } from 'react';
import { Page } from '@/components/commons/Page';
import { Insights } from './components/Insights';
import { PeriodPickerCustom } from '@/components/commons/PeriodPickerCustom';
import { Button } from '@/components/commons/Button';
import { MONTHS_FULL } from '@/constants/dates';
import { usePeriod } from '@/hooks/usePeriod';
import { LoaderWords } from '@/components/commons/loader/LoaderWords';

export const DashboardPage: FC = () => {
  const { period, setPeriod } = usePeriod();

  return (
    <Page>
      <main className="flex flex-col p-2">
        <header className="mb-4 flex w-full items-center justify-between">
          <h1 className="text-xl font-medium">Dashboard</h1>

          <div className="flex items-center gap-2">
            <PeriodPickerCustom value={period} onChange={setPeriod} align="center">
              <Button variant="outlined" className="font-normal">
                {`${MONTHS_FULL[period.month]} ${period.year}`}
              </Button>
            </PeriodPickerCustom>
          </div>
        </header>

        <Suspense
          fallback={
            <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
              <LoaderWords words={['insights', 'spending', 'analysis', 'review', 'graphs']} />
            </div>
          }
        >
          <Insights />
        </Suspense>
      </main>
    </Page>
  );
};
