import {
  BanknoteArrowDownIcon,
  BanknoteArrowUpIcon,
  CalendarSyncIcon,
  DiamondPercentIcon,
  WaypointsIcon,
} from 'lucide-react';
import type { FC } from 'react';
import { SimpleExpenseDialog } from './components/SimpleExpenseDialog';
import { IncomeDialog } from './components/IncomeDialog';
import { InstallmentDialog } from './components/InstallmentDialog';
import { Page } from '../../components/commons/Page';

export const NewTransactionPage: FC = () => {
  return (
    <Page>
      <main className="flex w-full flex-col items-center px-8 py-16">
        <h1 className="font-title text-3xl text-shadow-2xs">Select a transaction type</h1>

        <div className="mt-12 grid w-full grid-cols-3 gap-6">
          <SimpleExpenseDialog onSave={() => {}}>
            <button className="flex cursor-pointer flex-col items-center justify-center rounded-md bg-zinc-950 p-12 text-zinc-600 transition-colors hover:bg-red-400 hover:text-red-800">
              <BanknoteArrowDownIcon className="size-24" />
              <span className="text-2xl">Expense</span>
            </button>
          </SimpleExpenseDialog>
          <IncomeDialog onSave={() => {}}>
            <button className="flex cursor-pointer flex-col items-center justify-center rounded-md bg-zinc-950 p-12 text-zinc-600 transition-colors hover:bg-green-400 hover:text-green-800">
              <BanknoteArrowUpIcon className="size-24" />
              <span className="text-2xl">Income</span>
            </button>
          </IncomeDialog>
          <InstallmentDialog onSave={() => {}}>
            <button className="flex cursor-pointer flex-col items-center justify-center rounded-md bg-zinc-950 p-12 text-zinc-600 transition-colors hover:bg-orange-400 hover:text-orange-800">
              <DiamondPercentIcon className="size-24" />
              <span className="text-2xl">Installment</span>
            </button>
          </InstallmentDialog>
          <button className="flex cursor-pointer flex-col items-center justify-center rounded-md bg-zinc-950 p-12 text-zinc-600 transition-colors hover:bg-purple-400 hover:text-purple-800">
            <CalendarSyncIcon className="size-24" />
            <span className="text-2xl">Recurring</span>
          </button>
          <button className="flex cursor-pointer flex-col items-center justify-center rounded-md bg-zinc-950 p-12 text-zinc-600 transition-colors hover:bg-blue-400 hover:text-blue-800">
            <WaypointsIcon className="size-24" />
            <span className="text-2xl">Shared</span>
          </button>
        </div>
      </main>
    </Page>
  );
};
